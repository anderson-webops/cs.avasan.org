#!/usr/bin/env bash
set -euo pipefail

umask 022

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
[[ -d "$cs_source_dir/.git" || -f "$cs_source_dir/.git" ]] \
	|| { printf '%s\n' "--source must be a Git checkout." >&2; exit 1; }
[[ -f "$cs_api_env" ]] || { printf '%s\n' "Missing API environment file." >&2; exit 1; }
[[ "$(stat -c '%a' "$cs_api_env")" == "600" && "$(stat -c '%u' "$cs_api_env")" == "0" ]] \
	|| { printf '%s\n' "The API environment file must be root-owned with mode 0600." >&2; exit 1; }
id cs-avasan >/dev/null 2>&1 || { printf '%s\n' "Missing cs-avasan service user." >&2; exit 1; }
for cs_command in cmp curl git nginx node npm runuser systemctl tar; do
	command -v "$cs_command" >/dev/null 2>&1 \
		|| { printf '%s\n' "Missing required command: $cs_command" >&2; exit 1; }
done

[[ -z "$(git -C "$cs_source_dir" status --porcelain --untracked-files=normal)" ]] \
	|| { printf '%s\n' "Refusing to deploy a dirty checkout." >&2; exit 1; }
cs_revision="$(git -C "$cs_source_dir" rev-parse HEAD)"
[[ "$cs_revision" =~ ^[0-9a-f]{40}$ ]] \
	|| { printf '%s\n' "Git did not return a full lowercase revision." >&2; exit 1; }
cs_version="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).version" "$cs_source_dir/package.json")"
[[ "$cs_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]] \
	|| { printf '%s\n' "package.json does not contain a semantic release version." >&2; exit 1; }
[[ "$(git -C "$cs_source_dir" cat-file -t "v$cs_version" 2>/dev/null || true)" == "tag" ]] \
	|| { printf '%s\n' "The release version must have an annotated downstream tag." >&2; exit 1; }
[[ "$(git -C "$cs_source_dir" rev-parse "v$cs_version^{}")" == "$cs_revision" ]] \
	|| { printf '%s\n' "The downstream release tag does not point to HEAD." >&2; exit 1; }
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
	cmp --silent "$cs_source_artifact" "$cs_installed_artifact" \
		|| { printf '%s\n' "Install the reviewed native service artifacts from this release before deploying." >&2; exit 1; }
done

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

install -d -o root -g root -m 0755 "$cs_release_root" "$cs_release_root/releases"
cs_final_release="$cs_release_root/releases/$cs_release_suffix"

if [[ ! -d "$cs_final_release" ]]; then
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
	(
		set -a
		# shellcheck disable=SC1090
		source "$cs_api_env"
		set +a
		export CS_RELEASE_VERSION="$cs_version" SOURCE_REVISION="$cs_revision"
		node "$cs_staging_release/scripts/verify-native-runtime-config.mjs" "$cs_staging_release"
	)
	mv -- "$cs_staging_release" "$cs_final_release"
	cs_staging_release=""
else
	(
		set -a
		# shellcheck disable=SC1090
		source "$cs_api_env"
		set +a
		export CS_RELEASE_VERSION="$cs_version" SOURCE_REVISION="$cs_revision"
		node "$cs_final_release/scripts/verify-native-runtime-config.mjs" "$cs_final_release"
	)
fi

cs_current_link="$cs_release_root/current"
cs_previous_link="$cs_release_root/previous"
cs_previous_target="$(readlink -f "$cs_current_link" 2>/dev/null || true)"
if [[ -n "$cs_previous_target" && "$cs_previous_target" != "$cs_release_root/releases/"* ]]; then
	printf '%s\n' "Current release points outside the managed release directory." >&2
	exit 1
fi

atomic_link() {
	local cs_link_target="$1"
	local cs_link_name="$2"
	local cs_next_link="${cs_link_name}.next.$$"
	ln -s -- "$cs_link_target" "$cs_next_link"
	mv -Tf -- "$cs_next_link" "$cs_link_name"
}

restore_previous() {
	if [[ -n "$cs_previous_target" ]]; then
		atomic_link "$cs_previous_target" "$cs_current_link" || return 1
		systemctl restart "$cs_api_service" || return 1
	else
		[[ -L "$cs_current_link" ]] && unlink "$cs_current_link"
		systemctl stop "$cs_api_service" || return 1
	fi
	systemctl reload "$cs_nginx_service" || return 1
}

fail_activation() {
	local cs_failure_reason="$1"
	if restore_previous >/dev/null 2>&1; then
		if [[ -n "$cs_previous_target" ]]; then
			printf '%s\n' "$cs_failure_reason; the previous release was restored." >&2
		else
			printf '%s\n' "$cs_failure_reason; the incomplete first activation was removed." >&2
		fi
	else
		printf '%s\n' "$cs_failure_reason; automatic rollback also failed and requires operator recovery." >&2
	fi
	exit 1
}

nginx -t
atomic_link "$cs_final_release" "$cs_current_link"
systemctl daemon-reload
if ! systemctl restart "$cs_api_service"; then
	fail_activation "API restart failed"
fi
if ! systemctl reload "$cs_nginx_service"; then
	fail_activation "Nginx reload failed"
fi

cs_ready=false
for _cs_attempt in {1..30}; do
	if curl --fail --silent --show-error --max-time 2 \
		http://127.0.0.1:3008/readyz >/dev/null; then
		cs_ready=true
		break
	fi
	sleep 1
done
if [[ "$cs_ready" != true ]]; then
	fail_activation "API readiness failed"
fi

if ! env -i PATH=/usr/bin:/bin \
	CS_SITE_ORIGIN=http://127.0.0.1:8080 \
	CS_EXPECTED_RELEASE="$cs_version" \
	CS_EXPECTED_REVISION="$cs_revision" \
	CS_EXPECT_STUDENT_ACCOUNTS_ENABLED="${STUDENT_ACCOUNTS_ENABLED:-false}" \
	CS_EXPECT_STUDENT_OAUTH_ENABLED="${STUDENT_OAUTH_ENABLED:-false}" \
	CS_EXPECT_CLASSROOM_ANALYTICS_COLLECTION_ENABLED="${CLASSROOM_ANALYTICS_COLLECTION_ENABLED:-false}" \
	/usr/bin/node "$cs_final_release/scripts/post-deploy-smoke.mjs"; then
	fail_activation "Native release smoke gate failed"
fi

if [[ -n "$cs_previous_target" && "$cs_previous_target" != "$cs_final_release" ]]; then
	atomic_link "$cs_previous_target" "$cs_previous_link"
fi
printf 'Activated cs.avasan.org %s at %s.\n' "$cs_version" "$cs_revision"
