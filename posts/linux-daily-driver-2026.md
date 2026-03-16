---
title: linux as a daily driver in 2026
date: 2026-03-14
tags: [linux, setup, workflow, gaming, opinion]
excerpt: it finally feels like "the year of linux desktop" stopped being a joke.
---

# linux as a daily driver in 2026

i have been running linux as my only operating system for over three years now. no dual boot, no macos laptop on the side, no windows vm "just in case." here is everything i learned, broke, fixed, and settled on.

## choosing a distro

this is where everyone gets stuck. i have distro-hopped enough to have opinions.

### what i have tried

| distro | time spent | verdict |
|--------|-----------|---------|
| fedora | ~1 months | sucks imo, dnf was slow back then |
| arch | ~1 year | learned a lot, broke things often |
| nixos | ~3 months | beautiful concept, steep learning curve |
| cachyos | current | arch-based, sane defaults, performance patches |

### why cachyos

cachyos ships with performance-optimized kernels (bore scheduler, cachyline patches), a graphical installer that actually works, and pacman with parallel downloads out of the box. it is arch underneath so you get the aur and the wiki without the weekend-long install ritual.

```bash
# check your scheduler
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
# performance

# kernel version
uname -r
# 6.19.7-1-cachyos
```

if you want arch but value your weekends, cachyos is the answer.

## desktop environment

### the wayland situation

wayland in 2026 is finally stable enough to recommend to everyone. xwayland handles legacy apps, screen sharing works in browsers, and most compositors have caught up.

i use hyprland. it is a tiling wayland compositor with smooth animations and a config file that actually makes sense.

```conf
# ~/.config/hypr/hyprland.conf

monitor=DP-1, 2560x1440@165, 0x0, 1
monitor=HDMI-A-1, 1920x1080@60, 2560x0, 1

input {
    kb_layout = tr
    follow_mouse = 1
    sensitivity = -0.3
}

general {
    gaps_in = 4
    gaps_out = 8
    border_size = 2
    col.active_border = rgb(cba6f7)
    col.inactive_border = rgb(313244)
    layout = dwindle
}

animations {
    enabled = true
    bezier = snappy, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 5, snappy
    animation = fade, 1, 4, default
    animation = workspaces, 1, 4, snappy, slide
}
```

### why tiling

once you go tiling, floating feels like chaos. every window has its place. no overlapping, no searching for that terminal you minimized twenty minutes ago.

my layout is usually:

```
┌──────────────┬──────────┐
│              │ terminal │
│   browser    ├──────────┤
│              │  editor  │
└──────────────┴──────────┘
```

`super + 1-9` switches workspaces. `super + enter` opens a terminal. `super + q` closes a window. muscle memory takes a week to build, then you never look back.

### status bar

waybar with a minimal config. clock, workspaces, volume, battery, network. no system tray icons because i do not need fifteen applets telling me things i already know.

```json
{
    "layer": "top",
    "position": "top",
    "height": 32,
    "modules-left": ["hyprland/workspaces"],
    "modules-center": ["clock"],
    "modules-right": ["pulseaudio", "network", "battery"],
    "clock": {
        "format": "{:%H:%M}",
        "format-alt": "{:%Y-%m-%d}"
    }
}
```

## the daily workflow

### app launcher

rofi on wayland (rofi-wayland fork). fast, themeable, handles both app launching and window switching.

```bash
# bind in hyprland.conf
bind = SUPER, d, exec, rofi -show drun -theme catppuccin-mocha
```

### notifications

dunst replaced with mako. lighter, wayland-native, and the config is three lines:

```ini
[urgency=low]
background-color=#1e1e2e
text-color=#cdd6f4
border-color=#313244

[urgency=normal]
background-color=#1e1e2e
text-color=#cdd6f4
border-color=#cba6f7

[urgency=critical]
background-color=#1e1e2e
text-color=#f38ba8
border-color=#f38ba8
```

### file management

thunar for when i need a gui, but honestly `lf` (terminal file manager) handles 90% of my file operations. it is like ranger but written in go and much faster.

```bash
# ~/.config/lf/lfrc
set previewer ctpv
set cleaner ctpvclear
set shell zsh
set icons true
```

### screenshots

grimblast. one keybind for area selection, one for full screen, auto-copies to clipboard.

```bash
bind = , Print, exec, grimblast --notify copy area
bind = SHIFT, Print, exec, grimblast --notify copy screen
```

## audio and media

### pipewire

pipewire replaced pulseaudio and it just works. low latency, bluetooth codec switching, no configuration needed for 99% of use cases.

```bash
# check pipewire is running
systemctl --user status pipewire wireplumber
```

### bluetooth

bluetooth on linux used to be a nightmare. with bluez 5.x and pipewire, my sony headphones connect on boot, codec switches to ldac automatically, and battery level shows in waybar.

the only trick: make sure `experimental = true` is in `/etc/bluetooth/main.conf` for battery reporting.

### music

ncmpcpp + mpd for local music, spotify via the flatpak client. last.fm scrobbling works through mpdscribble for local and the spotify client handles its own.

## gaming

### the steam deck effect

valve single-handedly made linux gaming viable. proton translates directx to vulkan, and the compatibility database is enormous.

```bash
# check vulkan support
vulkaninfo --summary

# install steam
sudo pacman -S steam
```

### what works

- **native games**: most indie games ship linux builds. factorio, celeste, hollow knight all run natively.
- **proton**: elden ring, cyberpunk 2077, baldur's gate 3 — all run through proton with minimal setup.
- **anti-cheat**: the biggest remaining pain point. some games with kernel-level anti-cheat still refuse to run.

### what does not

- valorant. vanguard anti-cheat requires windows kernel access. not happening.
- some competitive fps games with aggressive anti-cheat.
- adobe creative suite. not a game, but worth mentioning. gimp and inkscape are good, but they are not photoshop.

### performance

on my rx 7900 xtx with mesa drivers, most games run at 95-100% of windows performance. some vulkan-native games actually run *faster* on linux.

```bash
# useful environment variables for gaming
MANGOHUD=1          # fps overlay
DXVK_HUD=fps       # directx translation overlay
mesa_glthread=true  # opengl threading
```

### gamescope

valve's micro-compositor for gaming. handles resolution scaling, hdr, frame limiting. i use it for every game:

```bash
gamescope -w 2560 -h 1440 -r 165 -f -- %command%
```

## the pain points

### fractional scaling

4k monitors at 150% scaling still have blurry xwayland apps. the fix is per-app: force wayland on electron apps with `--ozone-platform=wayland`, use native wayland firefox, and accept that some gtk3 apps will look slightly off.

```bash
# force electron apps to use wayland
echo "--ozone-platform-hint=auto" >> ~/.config/electron-flags.conf
```

### printer setup

every six months i need to print something and every six months i rediscover that cups exists. the web interface at `localhost:631` is ugly but functional.

### video calls

screen sharing in teams/zoom on wayland requires xdg-desktop-portal-hyprland. once installed, it works. but "once installed" took me an hour of searching the first time.

```bash
sudo pacman -S xdg-desktop-portal-hyprland
```

### firmware updates

fwupd handles most firmware updates through `fwupdmgr`. but some hardware (looking at you, certain wifi cards) still requires windows to update firmware.

## dotfiles management

i use chezmoi for syncing configs across machines. wrote a whole post about it, but the tldr:

```bash
chezmoi init --apply https://github.com/lostf1sh/dotfiles
```

one command, entire setup replicated. new machine goes from fresh install to fully configured in under ten minutes.

## the ecosystem in 2026

### what got better

- **wayland**: finally mature. screen sharing, clipboard, multi-monitor all work.
- **gaming**: proton is a miracle. most steam games just work.
- **flatpak**: sandboxed apps that update themselves. great for gui apps.
- **fonts**: font rendering on linux is actually better than windows now.

### what still needs work

- **adobe alternatives**: gimp 3.0 is better but the ux gap is still real.
- **office compatibility**: libreoffice handles most things, but complex excel macros break.
- **anti-cheat**: kernel-level anti-cheat is the last major gaming barrier.

## who should try it

if you are a developer, linux is the obvious choice. your deployment target is probably linux anyway. docker runs natively. package managers are first-class.

if you are a gamer who plays mostly single-player or steam games, you will be fine. check protondb before buying.

if you depend on adobe or microsoft office daily, dual boot or use a vm. do not try to force it.

## my current stack

| component | choice |
|-----------|--------|
| distro | cachyos |
| kernel | 6.19-cachyos (bore) |
| compositor | hyprland |
| terminal | alacritty |
| shell | zsh |
| editor | zed |
| browser | firefox (wayland) |
| file manager | thunar + lf |
| launcher | rofi-wayland |
| bar | waybar |
| notifications | mako |
| audio | pipewire |
| gaming | steam + proton + gamescope |

three years in and i do not miss windows. not even a little.

-- moli