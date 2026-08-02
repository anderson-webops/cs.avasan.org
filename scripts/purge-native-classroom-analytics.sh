#!/usr/bin/env bash
set -euo pipefail

umask 077
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH

cs_confirmation="--confirm-delete-all-classroom-analytics"
cs_api_env="/etc/cs.avasan.org/api.env"
cs_release_root="/srv/cs.avasan.org"
cs_current_link="$cs_release_root/current"

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
	printf '%s\n' "Run the native classroom analytics purge as root." >&2
	exit 1
fi
if [[ $# -ne 1 || "$1" != "$cs_confirmation" ]]; then
	printf '%s\n' \
		"Refusing permanent deletion without exactly $cs_confirmation." >&2
	exit 2
fi

# Start from a narrow environment before loading the reviewed native inputs.
# This keeps unrelated sudo/root credentials out of the service-user process.
for cs_inherited_name in $(compgen -e); do
	case "$cs_inherited_name" in
		PATH) ;;
		*) unset "$cs_inherited_name" 2>/dev/null || true ;;
	esac
done

for cs_command in id node readlink runuser stat; do
	command -v "$cs_command" >/dev/null 2>&1 \
		|| { printf '%s\n' "Missing required command: $cs_command" >&2; exit 1; }
done
id cs-avasan >/dev/null 2>&1 \
	|| { printf '%s\n' "Missing cs-avasan service user." >&2; exit 1; }

[[ -f "$cs_api_env" && ! -L "$cs_api_env" ]] \
	|| { printf '%s\n' "Missing regular native API environment file." >&2; exit 1; }
[[ "$(stat -c '%u:%a' "$cs_api_env")" == "0:600" ]] \
	|| { printf '%s\n' "The native API environment file must be root-owned with mode 0600." >&2; exit 1; }
[[ -L "$cs_current_link" ]] \
	|| { printf '%s\n' "The active native release link is missing." >&2; exit 1; }
cs_release_dir="$(readlink -f -- "$cs_current_link")"
[[ -d "$cs_release_dir" && "$cs_release_dir" == "$cs_release_root/releases/"* ]] \
	|| { printf '%s\n' "The active release is outside the managed native release directory." >&2; exit 1; }

for cs_release_file in \
	release.env \
	native-release.json \
	public/release.json \
	scripts/verify-native-runtime-config.mjs \
	back-end/dist/purge-classroom-analytics.js; do
	cs_release_path="$cs_release_dir/$cs_release_file"
	[[ -f "$cs_release_path" && ! -L "$cs_release_path" ]] \
		|| { printf '%s\n' "The active native release is incomplete." >&2; exit 1; }
	[[ "$(stat -c '%u' "$cs_release_path")" == "0" ]] \
		|| { printf '%s\n' "The active native release must be root-owned." >&2; exit 1; }
	cs_release_mode="$(stat -c '%a' "$cs_release_path")"
	(( (8#$cs_release_mode & 0022) == 0 )) \
		|| { printf '%s\n' "The active native release must not be group- or world-writable." >&2; exit 1; }
done

set -a
# shellcheck disable=SC1090
source "$cs_api_env"
# shellcheck disable=SC1090
source "$cs_release_dir/release.env"
set +a
export NODE_ENV=production

[[ "${CS_RELEASE_VERSION:-}" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]] \
	|| { printf '%s\n' "The active release version is invalid." >&2; exit 1; }
[[ "${SOURCE_REVISION:-}" =~ ^[0-9a-f]{40}$ ]] \
	|| { printf '%s\n' "The active release revision is invalid." >&2; exit 1; }
[[ "${CLASSROOM_ANALYTICS_COLLECTION_ENABLED:-}" == "false" ]] \
	|| { printf '%s\n' "CLASSROOM_ANALYTICS_COLLECTION_ENABLED must be explicitly false before permanent deletion." >&2; exit 1; }

/usr/bin/node \
	"$cs_release_dir/scripts/verify-native-runtime-config.mjs" \
	"$cs_release_dir"

# The purge needs only the selected Mongo credential source, collection gate,
# and validated release identity. Do not pass session, OAuth, or diagnostics
# credentials into the one-shot service-user process.
for cs_loaded_name in $(compgen -e); do
	case "$cs_loaded_name" in
		PATH|NODE_ENV|CS_RELEASE_VERSION|SOURCE_REVISION|\
		MONGODB_URI|VAULT_ADDR|VAULT_ROLE_ID|VAULT_SECRET_ID|\
		VAULT_MONGODB_SECRET_PATH|CLASSROOM_ANALYTICS_COLLECTION_ENABLED) ;;
		*) unset "$cs_loaded_name" 2>/dev/null || true ;;
	esac
done

exec /usr/sbin/runuser --preserve-environment --user cs-avasan -- \
	/usr/bin/node \
	"$cs_release_dir/back-end/dist/purge-classroom-analytics.js" \
	"$cs_confirmation"
