#!/usr/bin/env bash
set -euo pipefail

MOUNT_PATH="${IPOD_MOUNT:-${1:-}}"
BUN_BIN="${BUN_BIN:-}"

if [[ -z "$BUN_BIN" ]]; then
    BUN_BIN="$(command -v bun || true)"
fi

if [[ -z "${MOUNT_PATH}" ]]; then
    echo "Skipping publish: IPOD_MOUNT is not set."
    exit 0
fi

if [[ ! -d "${MOUNT_PATH}" ]]; then
    echo "Skipping publish: mount path does not exist (${MOUNT_PATH})."
    exit 0
fi

if [[ ! -f "${MOUNT_PATH}/.rockbox/playback.log" ]]; then
    echo "Skipping publish: playback log not found (${MOUNT_PATH}/.rockbox/playback.log)."
    exit 0
fi

if [[ -z "${BUN_BIN}" ]]; then
    echo "Skipping publish: bun binary not found."
    exit 0
fi

if [[ -z "${GITHUB_TOKEN:-}" && -z "${IPOD_GIST_TOKEN:-}" ]]; then
    echo "Skipping publish: GITHUB_TOKEN/IPOD_GIST_TOKEN is missing."
    exit 0
fi

if [[ -z "${IPOD_GIST_ID:-}" ]]; then
    echo "Skipping publish: IPOD_GIST_ID is missing."
    exit 0
fi

"$BUN_BIN" run ipod:sync:publish --require-gist-id -- --source "$MOUNT_PATH"
