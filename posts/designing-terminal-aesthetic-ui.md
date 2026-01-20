---
title: designing a terminal aesthetic without going full retro
date: 2025-10-20
tags: [design, ui, tailwind, catppuccin]
excerpt: balancing nostalgia and usability while building the new theme for this site.
---

# designing a terminal aesthetic without going full retro

my site looks like a shell prompt, but that does not mean i want to live in vt100 land. here is how i kept the vibe without the eye strain.

## color choices

- base palette from catppuccin mocha.
- bumped contrast on text by 6 percent for accessibility.
- reserved neon colors for accents only.

## typography

- jetbrains mono for everything, but with tighter letter spacing above 26px.
- headlines use uppercase sparingly to avoid shouting.
- paragraphs stay at 14px with 1.6 line height to mimic terminal proportions.

## micro interactions

- focus rings get a subtle mauve outline instead of pure white.
- list animations use `transition-delay` to feel like commands printing.
- cards tilt between 2 and 4 degrees on hover, nodding to crt jitter.

## pitfalls avoided

- no fake scanlines. they age poorly and hurt readability.
- refused to add artificial typing animations on every section.
- kept layout responsive; terminal does not mean fixed width.

## tools

- tailwind for spacing and responsive helpers.
- `@headlessui/vue` for accessible menus (even if they look old school).
- figma variables to experiment with contrast quickly.

keeping the aesthetic light enough means i can enjoy the nostalgia while staying productive. feels like the right balance for now.

-- moli
