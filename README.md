# f1sh.dev

minimalist personal website with terminal aesthetic.

## tech stack

vue 3 | tailwind | vite | catppuccin mocha

## setup

```bash
git clone https://github.com/lostf1sh/website
cd website
bun install
bun run dev
```

## rockbox ipod sync

1. mount your ipod (rockbox) so music files are accessible.
2. run:

```bash
bun run ipod:sync -- --source /path/to/ipod-mount
```

3. this generates:
   - `src/data/ipod-library.json`
   - `src/data/ipod-plays.json`
4. open `/ipod` route to see updated stats.

notes:
- script will parse tags from audio files (`mp3/m4a/flac/...`).
- play history is read from `.rockbox/.scrobbler.log` or `.rockbox/playback.log`.
- you can also set `IPOD_MOUNT=/path/to/ipod-mount` and run `bun run ipod:sync`.

## no-commit publish flow (github pages friendly)

one-time setup:
1. create a GitHub token with `gist` permission.
2. bootstrap gist and remote config:

```bash
GITHUB_TOKEN=ghp_xxx IPOD_GIST_OWNER=lostf1sh \
bun run ipod:sync:publish -- --source /run/media/f1sh/FIPOD
```

this creates/updates a gist and writes `src/data/ipod-remote.json`.
commit `src/data/ipod-remote.json` once.

then extract your gist id from `src/data/ipod-remote.json` and use it in automation:

```bash
export IPOD_GIST_ID=your_gist_id
```

daily usage (no commit needed):

```bash
GITHUB_TOKEN=ghp_xxx IPOD_GIST_ID=your_gist_id \
bun run ipod:sync:publish -- --source /run/media/f1sh/FIPOD
```

the site then fetches remote json from gist on `/ipod`.

## arch linux auto-sync service (mount trigger)

this installs a user-level systemd path/service.
when `/run/media/$USER/FIPOD/.rockbox/playback.log` changes, it auto-runs publish.
it also watches `/proc/self/mountinfo`, so mount/unmount events trigger a sync check.
if `playback.log` mtime did not change since the last successful run, publish is skipped.
as a fallback, a user timer runs every 30s and performs the same check.
if your device remounts under a different directory name, the script auto-detects
any `/run/media/$USER/*/.rockbox/playback.log` path.
the sync wrapper waits up to ~25 seconds for the mount to stabilize before skipping.
if playback history is missing during a run, publish is aborted to avoid sending empty play stats.

recommended order:
1. do one manual bootstrap publish first (creates gist id):

```bash
GITHUB_TOKEN=ghp_xxx IPOD_GIST_OWNER=lostf1sh \
bun run ipod:sync:publish -- --source /run/media/f1sh/FIPOD
```

2. copy `gistId` from `src/data/ipod-remote.json`.
3. set env for service:

```bash
cat > ~/.config/lostf1sh-ipod-sync.env <<'EOF'
GITHUB_TOKEN=ghp_xxx
IPOD_GIST_ID=your_gist_id
IPOD_GIST_OWNER=lostf1sh
EOF
chmod 600 ~/.config/lostf1sh-ipod-sync.env
```

install:

```bash
bun run ipod:service:install
```

or custom mount path:

```bash
bun run ipod:service:install -- /run/media/f1sh/FIPOD
```

fill token config at:

```bash
~/.config/lostf1sh-ipod-sync.env
```

required keys:

```bash
GITHUB_TOKEN=ghp_xxx
IPOD_GIST_ID=your_gist_id
```

if env is incomplete, service now exits cleanly with a "Skipping publish" log (no fail loop).

check:

```bash
systemctl --user status ipod-sync-publish.path
systemctl --user status ipod-sync-publish.timer
journalctl --user -u ipod-sync-publish.service -f
```

remove:

```bash
bun run ipod:service:uninstall
```

## features

- real-time discord/spotify/vscode/zed status via lanyard
- github projects from api
- last.fm recent tracks
- monospace terminal design

live at [f1sh.dev](https://f1sh.dev)
