#!/usr/bin/env bash
set -euo pipefail

systemctl --user disable --now ipod-sync-publish.path 2>/dev/null || true
systemctl --user disable --now ipod-sync-publish.service 2>/dev/null || true
rm -f "$HOME/.config/systemd/user/ipod-sync-publish.path"
rm -f "$HOME/.config/systemd/user/ipod-sync-publish.service"
systemctl --user daemon-reload

echo "Removed ipod-sync-publish systemd user units."
echo "Env file kept at: $HOME/.config/lostf1sh-ipod-sync.env"
