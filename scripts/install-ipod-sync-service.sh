#!/usr/bin/env bash
set -euo pipefail

MOUNT_PATH="${1:-/run/media/$USER/FIPOD}"
REPO_DIR="${2:-$(cd "$(dirname "$0")/.." && pwd)}"
ENV_FILE="${3:-$HOME/.config/lostf1sh-ipod-sync.env}"
BUN_BIN="${BUN_BIN:-$(command -v bun)}"
RUNNER_SCRIPT="$REPO_DIR/scripts/ipod-sync-publish-if-configured.sh"

if [[ -z "${BUN_BIN}" ]]; then
    echo "bun binary not found. Install bun first."
    exit 1
fi

if [[ ! -f "$RUNNER_SCRIPT" ]]; then
    echo "Missing runner script: $RUNNER_SCRIPT"
    exit 1
fi

chmod +x "$RUNNER_SCRIPT"

mkdir -p "$HOME/.config/systemd/user"
mkdir -p "$(dirname "$ENV_FILE")"

if [[ ! -f "$ENV_FILE" ]]; then
    cat > "$ENV_FILE" <<'EOF'
# Required:
# GITHUB_TOKEN=ghp_xxx
# IPOD_GIST_ID=your_existing_gist_id

# Optional:
# IPOD_GIST_OWNER=your_github_username
EOF
    chmod 600 "$ENV_FILE"
    echo "Created env template: $ENV_FILE"
    echo "Fill required values before relying on automatic publish."
fi

cat > "$HOME/.config/systemd/user/ipod-sync-publish.service" <<EOF
[Unit]
Description=Sync Rockbox iPod data and publish to GitHub Gist
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=$REPO_DIR
Environment=IPOD_MOUNT=$MOUNT_PATH
Environment=BUN_BIN=$BUN_BIN
EnvironmentFile=$ENV_FILE
ExecStart=$RUNNER_SCRIPT
EOF

cat > "$HOME/.config/systemd/user/ipod-sync-publish.path" <<EOF
[Unit]
Description=Trigger iPod sync when Rockbox playback log changes

[Path]
PathChanged=$MOUNT_PATH/.rockbox/playback.log
Unit=ipod-sync-publish.service

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user reset-failed ipod-sync-publish.service ipod-sync-publish.path >/dev/null 2>&1 || true
systemctl --user enable --now ipod-sync-publish.path

if [[ -f "$MOUNT_PATH/.rockbox/playback.log" ]]; then
    systemctl --user start ipod-sync-publish.service || true
fi

echo "Installed and enabled ipod-sync-publish.path"
echo "Check status with: systemctl --user status ipod-sync-publish.path"
