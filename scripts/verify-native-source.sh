#!/usr/bin/env bash
set -euo pipefail

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH

if [[ $# -ne 2 ]]; then
	printf '%s\n' "Usage: $0 SOURCE TAG" >&2
	exit 2
fi

cs_source_dir="$(realpath "$1")"
cs_tag="$2"
[[ "$cs_tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]] \
	|| { printf '%s\n' "Release tag must be a semantic v-tag." >&2; exit 1; }
[[ "$(git -C "$cs_source_dir" rev-parse --is-inside-work-tree 2>/dev/null || true)" == "true" ]] \
	|| { printf '%s\n' "Native source must be a Git checkout." >&2; exit 1; }
[[ -z "$(git -C "$cs_source_dir" status --porcelain --untracked-files=normal)" ]] \
	|| { printf '%s\n' "Native source checkout must be clean." >&2; exit 1; }

cs_revision="$(git -C "$cs_source_dir" rev-parse --verify 'HEAD^{commit}')"
cs_origin_url="$(git -C "$cs_source_dir" remote get-url origin 2>/dev/null || true)"
cs_canonical_origin_pattern='^(git@github\.com:|ssh://git@github\.com/|https://github\.com/)anderson-webops/cs\.avasan\.org([.]git)?$'
if [[ ! "$cs_origin_url" =~ $cs_canonical_origin_pattern ]]; then
	printf 'Native source origin is not anderson-webops/cs.avasan.org: %s\n' \
		"${cs_origin_url:-missing}" >&2
	exit 1
fi

cs_origin_main="$(
	git -C "$cs_source_dir" rev-parse --verify 'refs/remotes/origin/main^{commit}' 2>/dev/null || true
)"
[[ -n "$cs_origin_main" ]] \
	|| { printf '%s\n' "Native source is missing the fetched origin/main revision." >&2; exit 1; }
[[ "$cs_revision" == "$cs_origin_main" ]] \
	|| { printf '%s\n' "Native source HEAD is not the exact fetched origin/main revision." >&2; exit 1; }
[[ "$(git -C "$cs_source_dir" cat-file -t "refs/tags/$cs_tag" 2>/dev/null || true)" == "tag" ]] \
	|| { printf '%s\n' "Native release tag must exist as an annotated tag." >&2; exit 1; }
[[ "$(git -C "$cs_source_dir" rev-parse --verify "refs/tags/$cs_tag^{commit}")" == "$cs_revision" ]] \
	|| { printf '%s\n' "Annotated native release tag does not resolve to source HEAD." >&2; exit 1; }

printf 'Verified %s at exact canonical origin/main revision %s.\n' \
	"$cs_tag" \
	"$cs_revision"
