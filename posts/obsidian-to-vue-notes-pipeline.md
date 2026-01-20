---
title: how i sync obsidian notes into vue
date: 2025-10-28
tags: [tooling, automation, obsidian, vue]
excerpt: wiring a tiny pipeline that turns my messy vault into clean blog-ready markdown.
---

# how i sync obsidian notes into vue

i finally automated the thing i always complained about: moving notes from obsidian into this site without copy paste misery.

## the rough edges

- obsidian makes it easy to write, hard to export.
- backlinks, custom callouts, and dataview blocks break vite builds.
- manual cleanup means i forget to publish at all.

## the new flow

1. tag a note with `#publish`.
2. run `bun sync:notes`.
3. script converts frontmatter, strips obsidian syntax, and drops the file into `posts/`.
4. vite hot reloads and i get instant preview.

## key pieces

```text
scripts/
  sync-notes.ts      # pulls marked notes over fs
  render-snippets.ts # converts callouts -> blockquotes
```

- parses the first heading for the title.
- default excerpt comes from the first paragraph.
- preserves code blocks and inline formatting.

## why bun

- fast fs operations.
- typescript without extra config.
- easy to ship a single command.

## what needs polish

- images still require hand uploading.
- dataview tables get downgraded to plain lists.
- i want a diff preview before overwriting an existing post.

for now, it feels like magic compared to the old workflow. more excuses to write.

-- moli
