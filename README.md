# moli.codes

minimal personal site + blog with terminal aesthetic.

## stack

vue 3 · vite · tailwind css · bun

## features

- live discord / spotify / editor status via lanyard
- github projects + contribution graph
- last.fm recent tracks
- markdown blog with related posts
- command palette, theme toggle, boot sequence
- generated rss, sitemap, robots assets
- spa routing (cloudflare pages auto-serves index.html when no 404.html exists)

## setup

```bash
git clone https://github.com/lostf1sh/lostf1sh.github.io
cd lostf1sh.github.io
bun install
bun run dev
```

## scripts

```bash
bun run dev      # start vite dev server
bun run build    # build site + seo assets
bun run preview  # preview production build
```

live: [moli.codes](https://moli.codes)
