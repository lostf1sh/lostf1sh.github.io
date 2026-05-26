# f1sh.v.recipes

minimal personal site + blog with terminal aesthetic.

## stack

vue 3 · vite · tailwind css · catppuccin · bun

## features

- live discord / spotify / editor status via lanyard
- github projects + contribution graph
- last.fm recent tracks
- markdown blog with related posts
- command palette, theme toggle, boot sequence
- generated rss, sitemap, robots assets
- spa fallback for static hosting

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
bun run build    # build site + seo assets + spa fallback
bun run preview  # preview production build
```

live: [f1sh.v.recipes](https://f1sh.v.recipes)
