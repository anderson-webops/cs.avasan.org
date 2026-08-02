#!/usr/bin/env bash
set -euo pipefail

umask 022
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH

cs_source_dir="$(pwd -P)"
cs_api_env="/etc/cs.avasan.org/api.env"
cs_release_root="/srv/cs.avasan.org"
cs_api_service="cs-avasan-api.service"
cs_nginx_service="nginx.service"
cs_build_root=""
cs_staging_release=""

usage() {
	printf '%s\n' \
		"Usage: $0 [--source DIR] [--env-file FILE] [--release-root DIR]" \
		"          [--api-service UNIT] [--nginx-service UNIT]"
}

while (( $# > 0 )); do
	case "$1" in
		--source) cs_source_dir="$2"; shift 2 ;;
		--env-file) cs_api_env="$2"; shift 2 ;;
		--release-root) cs_release_root="$2"; shift 2 ;;
		--api-service) cs_api_service="$2"; shift 2 ;;
		--nginx-service) cs_nginx_service="$2"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*) usage >&2; exit 2 ;;
	esac
done

cleanup() {
	if [[ -n "$cs_build_root" && "$cs_build_root" == /var/tmp/cs-avasan-native.* && -d "$cs_build_root" ]]; then
		rm -rf -- "$cs_build_root"
	fi
	if [[ -n "$cs_staging_release" && "$cs_staging_release" == "$cs_release_root/releases/".* && -d "$cs_staging_release" ]]; then
		rm -rf -- "$cs_staging_release"
	fi
}
trap cleanup EXIT

[[ ${EUID:-$(id -u)} -eq 0 ]] || { printf '%s\n' "Run this deployment as root." >&2; exit 1; }
[[ "$cs_release_root" == /* && "$cs_release_root" != "/" && "$cs_release_root" != "/srv" ]] \
	|| { printf '%s\n' "--release-root must be a narrow absolute directory." >&2; exit 1; }
[[ "$cs_api_service" =~ ^[a-zA-Z0-9_.@-]+[.]service$ \
	&& "$cs_nginx_service" =~ ^[a-zA-Z0-9_.@-]+[.]service$ ]] \
	|| { printf '%s\n' "Service unit names are invalid." >&2; exit 1; }
[[ -d "$cs_source_dir/.git" || -f "$cs_source_dir/.git" ]] \
	|| { printf '%s\n' "--source must be a Git checkout." >&2; exit 1; }
[[ -f "$cs_api_env" && ! -L "$cs_api_env" ]] \
	|| { printf '%s\n' "Missing regular API environment file." >&2; exit 1; }
[[ "$(stat -c '%a' "$cs_api_env")" == "600" && "$(stat -c '%u' "$cs_api_env")" == "0" ]] \
	|| { printf '%s\n' "The API environment file must be root-owned with mode 0600." >&2; exit 1; }
id cs-avasan >/dev/null 2>&1 || { printf '%s\n' "Missing cs-avasan service user." >&2; exit 1; }
for cs_command in chmod chown cmp curl env git id install ln mktemp mv nginx node npm readlink realpath rm runuser sleep stat systemctl tar; do
	command -v "$cs_command" >/dev/null 2>&1 \
		|| { printf '%s\n' "Missing required command: $cs_command" >&2; exit 1; }
done

cs_source_dir="$(realpath "$cs_source_dir")"
cs_version="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).version" "$cs_source_dir/package.json")"
[[ "$cs_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]] \
	|| { printf '%s\n' "package.json does not contain a semantic release version." >&2; exit 1; }
cs_release_tag="v$cs_version"
"$cs_source_dir/scripts/verify-native-source.sh" \
	"$cs_source_dir" \
	"$cs_release_tag"
cs_revision="$(git -C "$cs_source_dir" rev-parse --verify 'HEAD^{commit}')"
[[ "$cs_revision" =~ ^[0-9a-f]{40}$ ]] \
	|| { printf '%s\n' "Git did not return a full lowercase revision." >&2; exit 1; }
node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a === 24 && b >= 18 ? 0 : 1)' \
	|| { printf '%s\n' "Native releases require system Node 24.18 or newer within major 24." >&2; exit 1; }
[[ "$(npm --version)" == "11.16.0" ]] \
	|| { printf '%s\n' "Native releases require the pinned npm 11.16.0 toolchain." >&2; exit 1; }

for cs_artifact_pair in \
	"deploy/native/cs-avasan-security-headers.conf:/etc/nginx/snippets/cs-avasan-security-headers.conf" \
	"deploy/native/cs-avasan-ide-security-headers.conf:/etc/nginx/snippets/cs-avasan-ide-security-headers.conf" \
	"deploy/native/nginx.conf.example:/etc/nginx/sites-available/cs.avasan.org" \
	"deploy/native/cs-avasan-api.service:/etc/systemd/system/cs-avasan-api.service"; do
	cs_source_artifact="$cs_source_dir/${cs_artifact_pair%%:*}"
	cs_installed_artifact="${cs_artifact_pair#*:}"
	[[ -f "$cs_source_artifact" && ! -L "$cs_source_artifact" \
		&& -f "$cs_installed_artifact" && ! -L "$cs_installed_artifact" \
		&& "$(stat -c '%u:%a' "$cs_installed_artifact")" == "0:644" ]] \
		|| { printf '%s\n' "Native service artifacts must be regular files installed root-owned at mode 0644." >&2; exit 1; }
	cmp --silent "$cs_source_artifact" "$cs_installed_artifact" \
		|| { printf '%s\n' "Install the reviewed native service artifacts from this release before deploying." >&2; exit 1; }
done

[[ -d "$cs_release_root" && ! -L "$cs_release_root" ]] \
	|| { printf '%s\n' "The real native release root is missing." >&2; exit 1; }
cs_release_root="$(realpath "$cs_release_root")"
[[ -d "$cs_release_root/releases" && ! -L "$cs_release_root/releases" ]] \
	|| { printf '%s\n' "The real managed releases directory is missing." >&2; exit 1; }
cs_current_link="$cs_release_root/current"
cs_previous_link="$cs_release_root/previous"
[[ -L "$cs_current_link" ]] \
	|| { printf '%s\n' "Deployment requires an existing current release symlink for rollback." >&2; exit 1; }
[[ ! -e "$cs_previous_link" || -L "$cs_previous_link" ]] \
	|| { printf '%s\n' "Previous release path must be absent or a symlink." >&2; exit 1; }
cs_previous_target="$(readlink -- "$cs_current_link")"
[[ "$cs_previous_target" == /* ]] \
	|| { printf '%s\n' "Current release symlink must use an absolute immutable target." >&2; exit 1; }
node "$cs_source_dir/scripts/verify-native-release-target.mjs" \
	"$cs_previous_target" \
	"$cs_release_root"
cs_previous_version="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).version" "$cs_previous_target/native-release.json")"
cs_previous_revision="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).revision" "$cs_previous_target/native-release.json")"
cs_previous_student_accounts_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_ACCOUNTS_ENABLED" "$cs_previous_target/native-release.json")"
cs_previous_student_oauth_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.STUDENT_OAUTH_ENABLED" "$cs_previous_target/native-release.json")"
cs_previous_classroom_analytics_enabled="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).buildConfig.CLASSROOM_ANALYTICS_COLLECTION_ENABLED" "$cs_previous_target/native-release.json")"

# api.env is a root-owned deployment input and is deliberately shared with
# systemd. Export it only inside this process, then force the fixed production
# boundary so the file cannot override host, origin, or release identity.
cs_api_env_names=()
while IFS= read -r cs_env_line || [[ -n "$cs_env_line" ]]; do
	[[ "$cs_env_line" =~ ^[[:space:]]*$ || "$cs_env_line" =~ ^[[:space:]]*# ]] && continue
	[[ "$cs_env_line" =~ ^([A-Z][A-Z0-9_]*)= ]] \
		|| { printf '%s\n' "api.env contains an unsupported assignment." >&2; exit 1; }
	cs_env_name="${BASH_REMATCH[1]}"
	case "$cs_env_name" in
		MONGODB_URI|VAULT_ADDR|VAULT_ROLE_ID|VAULT_SECRET_ID|VAULT_MONGODB_SECRET_PATH|\
		SESSION_SECRET|INTERNAL_DIAGNOSTICS_KEY|CLASSROOM_PRIVACY_APPROVED|\
		SCHOOL_PRIVACY_CONTACT|CLASSROOM_PRIVACY_OPERATOR_NOTICE|\
		CLASSROOM_SERVICE_PROVIDER_NOTICE|STUDENT_ACCOUNTS_ENABLED|\
		STUDENT_OAUTH_ENABLED|STUDENT_RECORD_RETENTION_DAYS|\
		CLASSROOM_ANALYTICS_COLLECTION_ENABLED|CLASSROOM_ANALYTICS_RETENTION_DAYS|\
		GOOGLE_OAUTH_CLIENT_ID|GOOGLE_OAUTH_CLIENT_SECRET|APPLE_OAUTH_CLIENT_ID|\
		APPLE_OAUTH_TEAM_ID|APPLE_OAUTH_KEY_ID|APPLE_OAUTH_PRIVATE_KEY_BASE64|\
		OAUTH_RATE_MAX|OAUTH_RATE_WINDOW_MS|PYTHON_IDE_PROJECT_BODY_LIMIT) ;;
		*) printf '%s\n' "api.env contains an unreviewed variable: $cs_env_name" >&2; exit 1 ;;
	esac
	cs_api_env_names+=("$cs_env_name")
done < "$cs_api_env"
set -a
# shellcheck disable=SC1090
source "$cs_api_env"
set +a
export CS_RELEASE_VERSION="$cs_version"
export SOURCE_REVISION="$cs_revision"
export NODE_ENV=production
export HOST=127.0.0.1
export BACKEND_HOST=127.0.0.1
export PORT=3008
export CLASSROOM_ORIGIN=https://cs.avasan.org
export CROSS_SITE=false
export TRUST_PROXY_HOPS=1
export VITE_CLASSROOM_PRIVACY_APPROVED="${CLASSROOM_PRIVACY_APPROVED:-false}"
export VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE="${CLASSROOM_PRIVACY_OPERATOR_NOTICE:-}"
export VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE="${CLASSROOM_SERVICE_PROVIDER_NOTICE:-}"
export VITE_CLASSROOM_USAGE_ENABLED="${CLASSROOM_ANALYTICS_COLLECTION_ENABLED:-false}"
export VITE_SCHOOL_PRIVACY_CONTACT="${SCHOOL_PRIVACY_CONTACT:-}"
export VITE_STUDENT_ACCOUNTS_ENABLED="${STUDENT_ACCOUNTS_ENABLED:-false}"
export VITE_STUDENT_OAUTH_ENABLED="${STUDENT_OAUTH_ENABLED:-false}"
export VITE_STUDENT_RECORD_RETENTION_DAYS="${STUDENT_RECORD_RETENTION_DAYS:-}"

cs_release_suffix="$(node "$cs_source_dir/scripts/write-native-release-manifest.mjs" --print-release-suffix)"
[[ "$cs_release_suffix" =~ ^[0-9a-f]{40}-[0-9a-f]{64}$ ]] \
	|| { printf '%s\n' "Native release suffix validation failed." >&2; exit 1; }
# Build dependencies and Vite receive only release identity and the intentional
# public VITE values above, never Mongo, session, OAuth, Vault, or diagnostics
# secrets from api.env.
for cs_env_name in "${cs_api_env_names[@]}"; do
	export -n "$cs_env_name"
done
# The manifest and frontend build still need the reviewed public policy values.
# Re-export only that allowlist after removing every api.env variable from the
# child-process environment; credentials and runtime-only settings remain local
# shell variables and cannot reach npm, Vite, or the release metadata writer.
export CLASSROOM_ANALYTICS_COLLECTION_ENABLED="${CLASSROOM_ANALYTICS_COLLECTION_ENABLED:-false}"
export CLASSROOM_PRIVACY_APPROVED="${CLASSROOM_PRIVACY_APPROVED:-false}"
export CLASSROOM_PRIVACY_OPERATOR_NOTICE="${CLASSROOM_PRIVACY_OPERATOR_NOTICE:-}"
export CLASSROOM_SERVICE_PROVIDER_NOTICE="${CLASSROOM_SERVICE_PROVIDER_NOTICE:-}"
export SCHOOL_PRIVACY_CONTACT="${SCHOOL_PRIVACY_CONTACT:-}"
export STUDENT_ACCOUNTS_ENABLED="${STUDENT_ACCOUNTS_ENABLED:-false}"
export STUDENT_OAUTH_ENABLED="${STUDENT_OAUTH_ENABLED:-false}"
export STUDENT_RECORD_RETENTION_DAYS="${STUDENT_RECORD_RETENTION_DAYS:-}"

cs_final_release="$cs_release_root/releases/$cs_release_suffix"

if [[ ! -e "$cs_final_release" && ! -L "$cs_final_release" ]]; then
	cs_build_root="$(mktemp -d /var/tmp/cs-avasan-native.XXXXXX)"
	cs_build_source="$cs_build_root/source"
	install -d -m 0755 "$cs_build_source"
	git -C "$cs_source_dir" archive "$cs_revision" | tar -x -C "$cs_build_source"
	chown -R cs-avasan:cs-avasan "$cs_build_root"
	# Dependency lifecycle scripts and both builds run without root privileges
	# and without any runtime credential in their environment.
	runuser --user cs-avasan -- env \
		CYPRESS_INSTALL_BINARY=0 \
		PUPPETEER_SKIP_DOWNLOAD=true \
		npm_config_cache="$cs_build_root/npm-cache" \
		npm --prefix "$cs_build_source" ci --include=optional --strict-allow-scripts
	runuser --user cs-avasan -- env \
		npm_config_cache="$cs_build_root/npm-cache" \
		npm --prefix "$cs_build_source" run build

	cs_staging_release="$(mktemp -d "$cs_release_root/releases/.${cs_release_suffix}.XXXXXX")"
	install -d -m 0755 "$cs_staging_release/public" "$cs_staging_release/back-end" "$cs_staging_release/scripts"
	cp -a "$cs_build_source/front-end/dist/." "$cs_staging_release/public/"
	cp -a "$cs_build_source/back-end/dist" "$cs_staging_release/back-end/dist"
	install -m 0644 "$cs_build_source/package.json" "$cs_build_source/package-lock.json" "$cs_staging_release/"
	install -d -m 0755 "$cs_staging_release/front-end"
	install -m 0644 "$cs_build_source/front-end/package.json" "$cs_staging_release/front-end/package.json"
	install -m 0644 "$cs_build_source/back-end/package.json" "$cs_staging_release/back-end/package.json"
	install -m 0644 \
		"$cs_build_source/scripts/http-smoke-client.mjs" \
		"$cs_build_source/scripts/post-deploy-smoke.mjs" \
		"$cs_build_source/scripts/verify-native-runtime-config.mjs" \
		"$cs_staging_release/scripts/"
	install -m 0755 \
		"$cs_build_source/scripts/purge-native-classroom-analytics.sh" \
		"$cs_staging_release/scripts/"
	chown -R cs-avasan:cs-avasan "$cs_staging_release"
	runuser --user cs-avasan -- env \
		CYPRESS_INSTALL_BINARY=0 \
		PUPPETEER_SKIP_DOWNLOAD=true \
		npm_config_cache="$cs_build_root/npm-cache" \
		npm --prefix "$cs_staging_release" ci --omit=dev --workspace back-end \
			--include-workspace-root=false --include=optional --strict-allow-scripts
	node "$cs_build_source/scripts/write-native-release-manifest.mjs" \
		--output "$cs_staging_release/native-release.json" \
		--output-environment "$cs_staging_release/public-config.env"
	printf 'CS_RELEASE_VERSION=%s\nSOURCE_REVISION=%s\n' \
		"$cs_version" "$cs_revision" > "$cs_staging_release/release.env"
	chmod 0644 \
		"$cs_staging_release/release.env" \
		"$cs_staging_release/native-release.json" \
		"$cs_staging_release/public-config.env"
	chown -R root:root "$cs_staging_release"
	chmod -R go-w "$cs_staging_release"
	# mktemp creates the staging root at 0700. Keep it private while it is
	# assembled, then make the completed release traversable by the systemd
	# service user before it can become an immutable activation target.
	chmod 0755 -- "$cs_staging_release"
	(
		set -a
		# shellcheck disable=SC1090
		source "$cs_api_env"
		set +a
		export CS_RELEASE_VERSION="$cs_version" SOURCE_REVISION="$cs_revision"
		node "$cs_staging_release/scripts/verify-native-runtime-config.mjs" "$cs_staging_release"
	)
	mv -T -- "$cs_staging_release" "$cs_final_release"
	cs_staging_release=""
else
	node "$cs_source_dir/scripts/verify-native-release-target.mjs" \
		"$cs_final_release" \
		"$cs_release_root"
	(
		set -a
		# shellcheck disable=SC1090
		source "$cs_api_env"
		set +a
		export CS_RELEASE_VERSION="$cs_version" SOURCE_REVISION="$cs_revision"
		node "$cs_final_release/scripts/verify-native-runtime-config.mjs" "$cs_final_release"
	)
fi

node "$cs_source_dir/scripts/verify-native-release-target.mjs" \
	"$cs_final_release" \
	"$cs_release_root"

# The build can take several minutes. Re-prove both the tagged source and the
# exact rollback target immediately before changing any live symlink.
"$cs_source_dir/scripts/verify-native-source.sh" \
	"$cs_source_dir" \
	"$cs_release_tag"
[[ "$(git -C "$cs_source_dir" rev-parse --verify 'HEAD^{commit}')" == "$cs_revision" ]] \
	|| { printf '%s\n' "Native source revision changed while the candidate was prepared." >&2; exit 1; }
[[ -L "$cs_current_link" && "$(readlink -- "$cs_current_link")" == "$cs_previous_target" ]] \
	|| { printf '%s\n' "Current release changed while the candidate was prepared." >&2; exit 1; }
node "$cs_source_dir/scripts/verify-native-release-target.mjs" \
	"$cs_previous_target" \
	"$cs_release_root"

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
		curl --fail --silent --show-error --max-time 2 \
			http://127.0.0.1:3008/readyz >/dev/null \
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

restore_previous() {
	local cs_rollback_status=0
	node "$cs_source_dir/scripts/verify-native-release-target.mjs" \
		"$cs_previous_target" \
		"$cs_release_root" \
		|| cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		printf '%s\n' "Automatic rollback target verification failed with status $cs_rollback_status." >&2
		return "$cs_rollback_status"
	fi
	atomic_link "$cs_previous_target" "$cs_current_link" || cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		printf '%s\n' "Automatic rollback symlink restoration failed with status $cs_rollback_status." >&2
		return "$cs_rollback_status"
	fi
	systemctl daemon-reload || cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		printf '%s\n' "Automatic rollback systemd reload failed with status $cs_rollback_status." >&2
		return "$cs_rollback_status"
	fi
	systemctl restart "$cs_api_service" || cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		printf '%s\n' "Automatic rollback API restart failed with status $cs_rollback_status." >&2
		return "$cs_rollback_status"
	fi
	systemctl reload "$cs_nginx_service" || cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		printf '%s\n' "Automatic rollback Nginx reload failed with status $cs_rollback_status." >&2
		return "$cs_rollback_status"
	fi
	verify_release_health \
		"$cs_previous_target" \
		"$cs_previous_version" \
		"$cs_previous_revision" \
		"$cs_previous_student_accounts_enabled" \
		"$cs_previous_student_oauth_enabled" \
		"$cs_previous_classroom_analytics_enabled" \
		|| cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		printf '%s\n' "Automatic rollback prior-release health verification failed with status $cs_rollback_status." >&2
		return "$cs_rollback_status"
	fi
	[[ -L "$cs_current_link" && "$(readlink -- "$cs_current_link")" == "$cs_previous_target" ]] \
		|| cs_rollback_status=$?
	if (( cs_rollback_status != 0 )); then
		printf '%s\n' "Automatic rollback current-link verification failed with status $cs_rollback_status." >&2
		return "$cs_rollback_status"
	fi
}

fail_activation() {
	local cs_failure_reason="$1"
	local cs_activation_status="$2"
	local cs_rollback_status=0
	restore_previous || cs_rollback_status=$?
	if (( cs_rollback_status == 0 )); then
		printf '%s\n' "$cs_failure_reason (status $cs_activation_status); the previous release runtime was restored and verified." >&2
	else
		printf '%s\n' "$cs_failure_reason (status $cs_activation_status); automatic rollback separately failed with status $cs_rollback_status and requires operator recovery." >&2
	fi
	exit 1
}

cs_activation_status=0
nginx -t || cs_activation_status=$?
if (( cs_activation_status != 0 )); then
	printf '%s\n' "Nginx configuration validation failed with status $cs_activation_status; the current release was not changed." >&2
	exit 1
fi
atomic_link "$cs_final_release" "$cs_current_link" || cs_activation_status=$?
if (( cs_activation_status != 0 )); then
	fail_activation "Candidate symlink activation failed" "$cs_activation_status"
fi
systemctl daemon-reload || cs_activation_status=$?
if (( cs_activation_status != 0 )); then
	fail_activation "systemd daemon reload failed" "$cs_activation_status"
fi
systemctl restart "$cs_api_service" || cs_activation_status=$?
if (( cs_activation_status != 0 )); then
	fail_activation "API restart failed" "$cs_activation_status"
fi
systemctl reload "$cs_nginx_service" || cs_activation_status=$?
if (( cs_activation_status != 0 )); then
	fail_activation "Nginx reload failed" "$cs_activation_status"
fi
verify_release_health \
	"$cs_final_release" \
	"$cs_version" \
	"$cs_revision" \
	"${STUDENT_ACCOUNTS_ENABLED:-false}" \
	"${STUDENT_OAUTH_ENABLED:-false}" \
	"${CLASSROOM_ANALYTICS_COLLECTION_ENABLED:-false}" \
	|| cs_activation_status=$?
if (( cs_activation_status != 0 )); then
	fail_activation "Native release readiness or smoke gate failed" "$cs_activation_status"
fi

if [[ "$cs_previous_target" != "$cs_final_release" ]]; then
	atomic_link "$cs_previous_target" "$cs_previous_link" || cs_activation_status=$?
	if (( cs_activation_status != 0 )); then
		fail_activation "Preserving the previous release failed" "$cs_activation_status"
	fi
fi
printf 'Activated cs.avasan.org %s at %s.\n' "$cs_version" "$cs_revision"
