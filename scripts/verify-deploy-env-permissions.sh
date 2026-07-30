#!/bin/sh
set -eu

environment_file=${1:-deploy/cs.env}

if [ ! -f "$environment_file" ]; then
	echo "Missing deployment environment file: $environment_file" >&2
	exit 1
fi

if mode=$(stat -c '%a' "$environment_file" 2>/dev/null); then
	:
else
	mode=$(stat -f '%Lp' "$environment_file")
fi

if [ "$mode" != "600" ]; then
	echo "Refusing to use $environment_file: permissions must be 600, not $mode." >&2
	exit 1
fi

echo "$environment_file permissions are 600."
