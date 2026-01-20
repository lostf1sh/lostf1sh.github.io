---
title: managing dotfiles with chezmoi
date: 2025-11-20
tags: [dotfiles, chezmoi, automation, dotfiles]
excerpt: finally a dotfiles manager that does not feel like a second job.
---

# managing dotfiles with chezmoi

i tried symlinking manually. i tried git bare repo tricks. i tried ansible. chezmoi is the only one that stuck.

## why it works

chezmoi is idempotent. running it twice does nothing bad. it respects `$HOME` and creates symlinks or copies based on your preference.

```bash
chezmoi add ~/.zshrc
chezmoi apply
```

that's it. no `Makefile` gymnastics, no `stow` confusion.

## the templating

need different configs for work and home? chezmoi templates with sprig functions.

```
{{- if eq .hostname "work-laptop" }}
# work settings
{{- end }}
```

handles per-machine config without branching repositories.

## the diff

`chezmoi diff` shows exactly what will change before you apply. safety net for people who fear ruining their shell config.

## getting started

```bash
brew install chezmoi
chezmoi init --apply https://github.com/yourusername/dotfiles
```

migrate existing configs:
```bash
chezmoi add ~/.config/alacritty/alacritty.toml
chezmoi status
chezmoi apply
```

-- moli
