#!/usr/bin/env bash
set -euo pipefail

cs_release_root="/srv/cs.avasan.org"
cs_api_env="/etc/cs.avasan.org/api.env"
cs_api_service="cs-avasan-api.service"
cs_nginx_service="nginx.service"

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
[[ -f "$cs_api_env" && "$(stat -c '%a' "$cs_api_env")" == "600" && "$(stat -c '%u' "$cs_api_env")" == "0" ]] \
	|| { printf '%s\n' "The API environment file must be root-owned with mode 0600." >&2; exit 1; }

set -a
# shellcheck disable=SC1090
source "$cs_api_env"
set +a

cs_current_link="$cs_release_root/current"
cs_previous_link="$cs_release_root/previous"
cs_current_target="$(readlink -f "$cs_current_link")"
cs_previous_target="$(readlink -f "$cs_previous_link")"
for cs_target in "$cs_current_target" "$cs_previous_target"; do
	[[ "$cs_target" == "$cs_release_root/releases/"* && -d "$cs_target" ]] \
		|| { printf '%s\n' "Rollback link points outside the managed releases." >&2; exit 1; }
done
[[ "$cs_current_target" != "$cs_previous_target" ]] \
	|| { printf '%s\n' "Current and previous releases are identical." >&2; exit 1; }

cs_manifest_version="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).version" "$cs_previous_target/native-release.json")"
cs_manifest_revision="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).revision" "$cs_previous_target/native-release.json")"
cs_student_accounts_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_ACCOUNTS_ENABLED || 'false'" "$cs_previous_target/native-release.json")"
cs_student_oauth_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_OAUTH_ENABLED || 'false'" "$cs_previous_target/native-release.json")"
cs_classroom_analytics_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.CLASSROOM_ANALYTICS_COLLECTION_ENABLED || 'false'" "$cs_previous_target/native-release.json")"

atomic_link() {
	local cs_link_target="$1"
	local cs_link_name="$2"
	local cs_next_link="${cs_link_name}.next.$$"
	ln -s -- "$cs_link_target" "$cs_next_link"
	mv -Tf -- "$cs_next_link" "$cs_link_name"
}

restore_current() {
	atomic_link "$cs_current_target" "$cs_current_link" || return 1
	systemctl restart "$cs_api_service" || return 1
	systemctl reload "$cs_nginx_service" || return 1
}

fail_rollback() {
	local cs_failure_reason="$1"
	if restore_current >/dev/null 2>&1; then
		printf '%s\n' "$cs_failure_reason; the original release was restored." >&2
	else
		printf '%s\n' "$cs_failure_reason; restoring the original release also failed and requires operator recovery." >&2
	fi
	exit 1
}

atomic_link "$cs_previous_target" "$cs_current_link"
if ! systemctl restart "$cs_api_service" || ! systemctl reload "$cs_nginx_service"; then
	fail_rollback "Rollback activation failed"
fi

if ! env -i PATH=/usr/bin:/bin \
	CS_SITE_ORIGIN=http://127.0.0.1:8080 \
	CS_EXPECTED_RELEASE="$cs_manifest_version" \
	CS_EXPECTED_REVISION="$cs_manifest_revision" \
	CS_EXPECT_STUDENT_ACCOUNTS_ENABLED="$cs_student_accounts_enabled" \
	CS_EXPECT_STUDENT_OAUTH_ENABLED="$cs_student_oauth_enabled" \
	CS_EXPECT_CLASSROOM_ANALYTICS_COLLECTION_ENABLED="$cs_classroom_analytics_enabled" \
	/usr/bin/node "$cs_previous_target/scripts/post-deploy-smoke.mjs"; then
	fail_rollback "Rollback smoke gate failed"
fi

atomic_link "$cs_current_target" "$cs_previous_link"
printf 'Rolled cs.avasan.org back to %s at %s.\n' "$cs_manifest_version" "$cs_manifest_revision"
