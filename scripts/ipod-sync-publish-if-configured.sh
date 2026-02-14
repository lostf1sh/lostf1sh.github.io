#!/usr/bin/env bash
set -euo pipefail

MOUNT_PATH="${IPOD_MOUNT:-${1:-}}"
BUN_BIN="${BUN_BIN:-}"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/lostf1sh-ipod-sync"
STATE_FILE="${STATE_DIR}/last_playback_mtime"
PLAYBACK_LOG=""
MOUNT_ROOT="${IPOD_MOUNT_ROOT:-/run/media/$USER}"
WAIT_SECONDS="${IPOD_MOUNT_WAIT_SECONDS:-25}"

if [[ -z "$BUN_BIN" ]]; then
    BUN_BIN="$(command -v bun || true)"
fi

if [[ -z "${MOUNT_PATH}" ]]; then
    MOUNT_PATH="$MOUNT_ROOT"
fi

FOUND_PATH=""
for _ in $(seq 1 "${WAIT_SECONDS}"); do
    if [[ -f "${MOUNT_PATH}/.rockbox/playback.log" ]]; then
        FOUND_PATH="${MOUNT_PATH}"
        break
    fi
    for candidate in "$MOUNT_ROOT"/*; do
        if [[ -f "${candidate}/.rockbox/playback.log" ]]; then
            FOUND_PATH="$candidate"
            break
        fi
    done
    if [[ -n "${FOUND_PATH}" ]]; then
        break
    fi
    sleep 1
done

if [[ -z "${FOUND_PATH}" ]]; then
    echo "Skipping publish: playback log not found under ${MOUNT_ROOT}."
    exit 0
fi

MOUNT_PATH="${FOUND_PATH}"
PLAYBACK_LOG="${MOUNT_PATH}/.rockbox/playback.log"

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

CURRENT_MTIME="$(stat -c %Y "${PLAYBACK_LOG}" 2>/dev/null || true)"
if [[ -z "${CURRENT_MTIME}" ]]; then
    echo "Skipping publish: could not read playback.log mtime."
    exit 0
fi

if [[ -f "${STATE_FILE}" ]]; then
    LAST_MTIME="$(cat "${STATE_FILE}" 2>/dev/null || true)"
    if [[ -n "${LAST_MTIME}" && "${CURRENT_MTIME}" -le "${LAST_MTIME}" ]]; then
        echo "Skipping publish: playback.log not changed since last successful sync."
        exit 0
    fi
fi

mkdir -p "${STATE_DIR}"

for attempt in 1 2 3; do
    if "$BUN_BIN" run ipod:sync:publish --require-gist-id -- --source "$MOUNT_PATH"; then
        echo "${CURRENT_MTIME}" > "${STATE_FILE}"
        exit 0
    fi
    if [[ "${attempt}" -lt 3 ]]; then
        echo "Publish attempt ${attempt} failed, retrying..."
        sleep $((attempt * 2))
    fi
done

echo "Publish failed after retries."
exit 1
