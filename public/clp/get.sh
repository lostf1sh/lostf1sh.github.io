#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/lostf1sh/clp.git"
INSTALL_DIR="${TMPDIR:-/tmp}/clp-install-$$"

echo "Installing clp..."

git clone --depth 1 "$REPO" "$INSTALL_DIR"
cd "$INSTALL_DIR"
bash install.sh

rm -rf "$INSTALL_DIR"
