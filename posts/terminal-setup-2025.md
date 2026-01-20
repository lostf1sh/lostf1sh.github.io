---
title: my terminal setup 2025
date: 2025-12-25
tags: [terminal, setup, productivity,ricing]
excerpt: alacritty, zsh, tmux, and the small configs that make it work.
---

# my terminal setup 2025

minimal, fast, keyboard-driven.

## terminal

alacritty with gpu acceleration. 60fps scrolling on 4k monitors.

```toml
[font]
size = 13
offset = { y = 1 }

[window]
opacity = 0.9
decorations = "None"
```

no title bar, slight transparency, monospace font.

## shell

zsh with oh-my-zsh stripped down.

```
plugins=(git python docker)
```

prompt is minimal:

```
╭─ user@host ~/project ────────────────────────────────────
╰─ $
```

no fortune, no cowsay, no ascii art on start.

## multiplexing

tmux with prefix changed to `Ctrl+a`.

```
set -g mouse on
set -g status-style "bg=#1e1e2e"
set -g window-style "bg=#1e1e2e"
set -g pane-border-style "fg=#313244"
```

copy mode with mouse works. scrolling works. it feels like a gui.

## the workflow

```
Ctrl+a + c     # new window
Ctrl+a + n     # next window
Ctrl+a + |     # horizontal split
Ctrl+a + _     # vertical split
Ctrl+a + arrow # navigate panes
```

all keyboard. hands never leave home row.

## tools

| tool | purpose |
|------|---------|
| fzf | fuzzy finding |
| ripgrep | searching |
| bat | syntax highlighted cat |
| eza | ls replacement |
| bottom | system monitor |

small binaries that do one thing well.

## config location

```
~/.config/
  alacritty/
  tmux/
  zsh/
```

all version controlled. chezmoi manages the sync.

-- moli
