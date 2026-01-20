---
title: why i switched from neovim to zed
date: 2025-11-15
tags: [zed, editor, neovim, rust]
excerpt: giving up 5 years of modal editing for a mouse-friendly rust-based editor.
---

# why i switched from neovim to zed

after 5 years of muscle memory, i deleted my `.config/nvim` folder. here is what led me there.

## the problem with plugins

neovim plugins are amazing until one breaks after an update. lsp configurations drift, treesitter parsers desync, and suddenly you spend a saturday debugging instead of coding.

zed has zero config out of the box. language servers just work. no `PackerSync`, no `MasonInstallAll`, no `checkhealth`.

## the mouse thing

i thought i hated the mouse. turns out i just never had a good one.

zed's multi cursor with mouse support is faster than any vim motions for repetitive edits. select, alt+click more, type. done.

## the tradeoffs

missing:
- `:terminal`
- `:G` for git (though zed's built-in git is surprisingly good)
- tmux integration

gaining:
- no startup time
- collaboration features (remote sessions are wild)
- vim mode that actually feels complete

## verdict

zed is not for everyone. if you live in terminal, stick with neovim. if you want a fast editor that feels like 2025, try it for a week.

i am not looking back.

-- moli
