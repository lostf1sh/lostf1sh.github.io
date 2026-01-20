---
title: shipping tiny cli tools on a weekend
date: 2025-10-26
tags: [cli, shipping, weekend-project]
excerpt: notes on building opinionated little binaries fast and keeping scope under control.
---

# shipping tiny cli tools on a weekend

there is something addictive about finishing a small cli tool before monday hits. no roadmap, just a scratch to itch.

## the idea bank

- convert spotify playlists to mp3 tags.
- wrap openapi specs into copy pasteable markdown.
- run `npm audit` across multiple repos with one command.

i keep them in a `todo.md` file, label the ones that can be done in under 6 hours, and pick one on friday night.

## constraints i set

1. only one external dependency allowed.
2. must build on macos and linux without extra steps.
3. readme and gif demo required before calling it done.

with rules in place, i avoid feature creep and focus on the happy path.

## tooling

- language: go for binaries, bun for scripts.
- tests: snapshot helpers with `@vitest/ui` for quick feedback.
- packaging: `goreleaser` for go, `bun build` for js.

## releasing

- tag `v0.x.0` even if it is just a prototype.
- publish binaries on github releases.
- write a short blog post describing the problem solved.

## lessons

- single purpose tools invite fewer bug reports.
- shipping early surfaces real workflows that docs ignore.
- saying "no" to extra flags keeps the interface friendly.

if i can keep this streak going, i will end the year with a neat toolbox instead of an idea backlog.

-- moli
