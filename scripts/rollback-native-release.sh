#!/usr/bin/env bash
set -euo pipefail

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH

cs_release_root="/srv/cs.avasan.org"
cs_api_env="/etc/cs.avasan.org/api.env"
cs_api_service="cs-avasan-api.service"
cs_nginx_service="nginx.service"
cs_script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

while (( $# > 0 )); do
	case "$1" in
		--release-root) cs_release_root="$2"; shift 2 ;;
		--env-file) cs_api_env="$2"; shift 2 ;;
		--api-service) cs_api_service="$2"; shift 2 ;;
		--nginx-service) cs_nginx_service="$2"; shift 2 ;;
		*) printf '%s\n' "Unknown rollback option: $1" >&2; exit 2 ;;
	esac
done

[[ ${EUID:-$(id -u)} -eq 0 ]] || { printf '%s\n' "Run rollback as root." >&2; exit 1; }
[[ "$cs_release_root" == /* && "$cs_release_root" != "/" && "$cs_release_root" != "/srv" ]] \
	|| { printf '%s\n' "--release-root must be a narrow absolute directory." >&2; exit 1; }
[[ "$cs_api_service" =~ ^[a-zA-Z0-9_.@-]+[.]service$ \
	&& "$cs_nginx_service" =~ ^[a-zA-Z0-9_.@-]+[.]service$ ]] \
	|| { printf '%s\n' "Service unit names are invalid." >&2; exit 1; }
for cs_command in curl env id ln mv node readlink realpath rm sleep stat systemctl; do
	command -v "$cs_command" >/dev/null 2>&1 \
		|| { printf '%s\n' "Missing required command: $cs_command" >&2; exit 1; }
done
[[ -f "$cs_api_env" && ! -L "$cs_api_env" \
	&& "$(stat -c '%a' "$cs_api_env")" == "600" && "$(stat -c '%u' "$cs_api_env")" == "0" ]] \
	|| { printf '%s\n' "The API environment file must be root-owned with mode 0600." >&2; exit 1; }
[[ -d "$cs_release_root" && ! -L "$cs_release_root" ]] \
	|| { printf '%s\n' "The real native release root is missing." >&2; exit 1; }
cs_release_root="$(realpath "$cs_release_root")"
[[ -d "$cs_release_root/releases" && ! -L "$cs_release_root/releases" ]] \
	|| { printf '%s\n' "The real managed releases directory is missing." >&2; exit 1; }

cs_current_link="$cs_release_root/current"
cs_previous_link="$cs_release_root/previous"
[[ -L "$cs_current_link" && -L "$cs_previous_link" ]] \
	|| { printf '%s\n' "Rollback requires current and previous release symlinks." >&2; exit 1; }
cs_current_target="$(readlink -- "$cs_current_link")"
cs_previous_target="$(readlink -- "$cs_previous_link")"
for cs_target in "$cs_current_target" "$cs_previous_target"; do
	[[ "$cs_target" == /* ]] \
		|| { printf '%s\n' "Rollback release symlinks must use absolute immutable targets." >&2; exit 1; }
	node "$cs_script_dir/verify-native-release-target.mjs" \
		"$cs_target" \
		"$cs_release_root"
done
[[ "$cs_current_target" != "$cs_previous_target" ]] \
	|| { printf '%s\n' "Current and previous releases are identical." >&2; exit 1; }

cs_manifest_version="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).version" "$cs_previous_target/native-release.json")"
cs_manifest_revision="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).revision" "$cs_previous_target/native-release.json")"
cs_student_accounts_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_ACCOUNTS_ENABLED || 'false'" "$cs_previous_target/native-release.json")"
cs_student_oauth_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_OAUTH_ENABLED || 'false'" "$cs_previous_target/native-release.json")"
cs_classroom_analytics_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.CLASSROOM_ANALYTICS_COLLECTION_ENABLED || 'false'" "$cs_previous_target/native-release.json")"
cs_current_manifest_version="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).version" "$cs_current_target/native-release.json")"
cs_current_manifest_revision="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).revision" "$cs_current_target/native-release.json")"
cs_current_student_accounts_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_ACCOUNTS_ENABLED || 'false'" "$cs_current_target/native-release.json")"
cs_current_student_oauth_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_OAUTH_ENABLED || 'false'" "$cs_current_target/native-release.json")"
cs_current_classroom_analytics_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.CLASSROOM_ANALYTICS_COLLECTION_ENABLED || 'false'" "$cs_current_target/native-release.json")"

atomic_link() {
	local cs_link_target="$1"
	local cs_link_name="$2"
	local cs_next_link="${cs_link_name}.next.$$"
	local cs_link_status=0
	ln -s -- "$cs_link_target" "$cs_next_link" || cs_link_status=$?
	if (( cs_link_status != 0 )); then
		return "$cs_link_status"
	fi
	mv -Tf -- "$cs_next_link" "$cs_link_name" || cs_link_status=$?
	if (( cs_link_status != 0 )); then
		rm -f -- "$cs_next_link"
		return "$cs_link_status"
	fi
}

wait_for_api_readiness() {
	local cs_readiness_status=1
	local cs_attempt
	for cs_attempt in {1..30}; do
		cs_readiness_status=0
		curl --fail --silent --max-time 2 \
			http://127.0.0.1:3008/readyz >/dev/null 2>&1 \
			|| cs_readiness_status=$?
		if (( cs_readiness_status == 0 )); then
			return 0
		fi
		if (( cs_attempt < 30 )); then
			sleep 1 || return $?
		fi
	done
	printf '%s\n' "API readiness did not recover after 30 attempts." >&2
	return "$cs_readiness_status"
}

verify_release_health() {
	local cs_health_release="$1"
	local cs_expected_version="$2"
	local cs_expected_revision="$3"
	local cs_expected_student_accounts="$4"
	local cs_expected_student_oauth="$5"
	local cs_expected_classroom_analytics="$6"
	local cs_health_status=0

	wait_for_api_readiness || cs_health_status=$?
	if (( cs_health_status != 0 )); then
		return "$cs_health_status"
	fi
	env -i PATH=/usr/bin:/bin \
		CS_SITE_ORIGIN=http://127.0.0.1:8080 \
		CS_EXPECTED_RELEASE="$cs_expected_version" \
		CS_EXPECTED_REVISION="$cs_expected_revision" \
		CS_EXPECT_STUDENT_ACCOUNTS_ENABLED="$cs_expected_student_accounts" \
		CS_EXPECT_STUDENT_OAUTH_ENABLED="$cs_expected_student_oauth" \
		CS_EXPECT_CLASSROOM_ANALYTICS_COLLECTION_ENABLED="$cs_expected_classroom_analytics" \
		/usr/bin/node "$cs_health_release/scripts/post-deploy-smoke.mjs" \
		|| cs_health_status=$?
	return "$cs_health_status"
}

restore_current() {
	local cs_restore_status=0
	node "$cs_script_dir/verify-native-release-target.mjs" \
		"$cs_current_target" \
		"$cs_release_root" \
		|| cs_restore_status=$?
	if (( cs_restore_status != 0 )); then
		printf '%s\n' "Original release target verification failed with status $cs_restore_status." >&2
		return "$cs_restore_status"
	fi
	atomic_link "$cs_current_target" "$cs_current_link" || cs_restore_status=$?
	if (( cs_restore_status != 0 )); then
		printf '%s\n' "Original release symlink restoration failed with status $cs_restore_status." >&2
		return "$cs_restore_status"
	fi
	systemctl daemon-reload || cs_restore_status=$?
	if (( cs_restore_status != 0 )); then
		printf '%s\n' "Original release systemd reload failed with status $cs_restore_status." >&2
		return "$cs_restore_status"
	fi
	systemctl restart "$cs_api_service" || cs_restore_status=$?
	if (( cs_restore_status != 0 )); then
		printf '%s\n' "Original release API restart failed with status $cs_restore_status." >&2
		return "$cs_restore_status"
	fi
	systemctl reload "$cs_nginx_service" || cs_restore_status=$?
	if (( cs_restore_status != 0 )); then
		printf '%s\n' "Original release Nginx reload failed with status $cs_restore_status." >&2
		return "$cs_restore_status"
	fi
	verify_release_health \
		"$cs_current_target" \
		"$cs_current_manifest_version" \
		"$cs_current_manifest_revision" \
		"$cs_current_student_accounts_enabled" \
		"$cs_current_student_oauth_enabled" \
		"$cs_current_classroom_analytics_enabled" \
		|| cs_restore_status=$?
	if (( cs_restore_status != 0 )); then
		printf '%s\n' "Original release health verification failed with status $cs_restore_status." >&2
		return "$cs_restore_status"
	fi
	[[ -L "$cs_current_link" && "$(readlink -- "$cs_current_link")" == "$cs_current_target" ]] \
		|| cs_restore_status=$?
	if (( cs_restore_status != 0 )); then
		printf '%s\n' "Original release current-link verification failed with status $cs_restore_status." >&2
		return "$cs_restore_status"
	fi
}

fail_rollback() {
	local cs_failure_reason="$1"
	local cs_rollback_status="$2"
	local cs_restore_status=0
	restore_current || cs_restore_status=$?
	if (( cs_restore_status == 0 )); then
		printf '%s\n' "$cs_failure_reason (status $cs_rollback_status); the original release runtime was restored and verified." >&2
	else
		printf '%s\n' "$cs_failure_reason (status $cs_rollback_status); restoring the original release separately failed with status $cs_restore_status and requires operator recovery." >&2
	fi
	exit 1
}

[[ "$(readlink -- "$cs_current_link")" == "$cs_current_target" \
	&& "$(readlink -- "$cs_previous_link")" == "$cs_previous_target" ]] \
	|| { printf '%s\n' "Rollback targets changed during verification." >&2; exit 1; }

cs_rollback_status=0
atomic_link "$cs_previous_target" "$cs_current_link" || cs_rollback_status=$?
if (( cs_rollback_status != 0 )); then
	fail_rollback "Rollback symlink activation failed" "$cs_rollback_status"
fi
systemctl daemon-reload || cs_rollback_status=$?
if (( cs_rollback_status != 0 )); then
	fail_rollback "Rollback systemd reload failed" "$cs_rollback_status"
fi
systemctl restart "$cs_api_service" || cs_rollback_status=$?
if (( cs_rollback_status != 0 )); then
	fail_rollback "Rollback API restart failed" "$cs_rollback_status"
fi
systemctl reload "$cs_nginx_service" || cs_rollback_status=$?
if (( cs_rollback_status != 0 )); then
	fail_rollback "Rollback Nginx reload failed" "$cs_rollback_status"
fi
verify_release_health \
	"$cs_previous_target" \
	"$cs_manifest_version" \
	"$cs_manifest_revision" \
	"$cs_student_accounts_enabled" \
	"$cs_student_oauth_enabled" \
	"$cs_classroom_analytics_enabled" \
	|| cs_rollback_status=$?
if (( cs_rollback_status != 0 )); then
	fail_rollback "Rollback readiness or smoke gate failed" "$cs_rollback_status"
fi

if [[ "$cs_current_target" != "$cs_previous_target" ]]; then
	atomic_link "$cs_current_target" "$cs_previous_link" || cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		fail_rollback "Preserving the original release failed" "$cs_rollback_status"
	fi
fi
printf 'Rolled cs.avasan.org back to %s at %s.\n' "$cs_manifest_version" "$cs_manifest_revision"
