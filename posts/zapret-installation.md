---
title: bypassing dpi with zapret on linux
date: 2026-01-10
tags: [linux, privacy, networking, censorship]
excerpt: step by step zapret installation to bypass isp deep packet inspection.
---

# bypassing dpi with zapret on linux

isps use dpi (deep packet inspection) to analyze traffic and block certain sites. zapret bypasses these restrictions.

## what we're doing

1. dns over tls setup
2. zapret installation
3. isp-specific parameter detection
4. profit

## required packages

```bash
# debian/ubuntu
sudo apt install -y curl dnsutils nftables unzip

# fedora/rhel
sudo dnf install -y bind-utils curl nftables unzip

# arch
sudo pacman -S --noconfirm bind-tools curl nftables unzip
```

## dns setup

zapret only bypasses dpi. we need to set up dns ourselves. using yandex dns here, alternatives:

- [cloudflare dns](https://keift.gitbook.io/blog/linux/use-dns-over-tls#alternative-cloudflare-dns-recommended) (recommended)
- [mullvad dns](https://keift.gitbook.io/blog/linux/use-dns-over-tls#alternative-mullvad-dns)
- [google dns](https://keift.gitbook.io/blog/linux/use-dns-over-tls#alternative-google-dns)

```bash
# enable systemd-resolved
sudo systemctl enable --now systemd-resolved

# write dns config
sudo tee /etc/systemd/resolved.conf &>/dev/null << EOF
[Resolve]
DNS=77.88.8.8#common.dot.dns.yandex.net
DNS=2a02:6b8::feed:0ff#common.dot.dns.yandex.net
DNSOverTLS=yes
EOF

# symlink resolv.conf
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf

# restart
sudo systemctl restart systemd-resolved
```

## download zapret

```bash
# clean start
sudo rm -rf /tmp/zapret-v72.7*

# download and extract
sudo wget -P /tmp https://github.com/bol-van/zapret/releases/download/v72.7/zapret-v72.7.zip
sudo unzip -d /tmp /tmp/zapret-v72.7.zip
sudo rm /tmp/zapret-v72.7.zip
```

## pre-installation

```bash
# remove old installation
sudo /opt/zapret/uninstall_easy.sh 2>/dev/null
sudo rm -rf /opt/zapret

# install requirements
sudo /tmp/zapret-v72.7/install_prereq.sh
sudo /tmp/zapret-v72.7/install_bin.sh
```

firewall question: **leave blank** (nftables will be selected)

## blockcheck - isp analysis

detect the dpi method your isp uses:

```bash
sudo /tmp/zapret-v72.7/blockcheck.sh
```

answers:

| question | answer |
|----------|--------|
| domain | a blocked site (e.g. discord.com) |
| ip version | leave blank |
| check http/https | leave blank |
| repeat count | leave blank |
| scan mode | leave blank (standard) |

test takes a few minutes. you'll get output like:

```
curl_test_https_tls12 ipv4 discord.com : nfqws --dpi-desync=fakeddisorder --dpi-desync-ttl=1 --dpi-desync-autottl=-5 --dpi-desync-split-pos=1
```

note the part starting with `nfqws`. these are your isp-specific bypass parameters.

## zapret installation

```bash
sudo /tmp/zapret-v72.7/install_easy.sh
```

| question | answer |
|----------|--------|
| copy for you | **Y** |
| firewall type | leave blank |
| ipv6 support | leave blank |
| flow offloading | leave blank |
| filtering | leave blank |
| tpws socks | leave blank |
| tpws transparent | leave blank |
| enable nfqws | **Y** |
| edit options | **Y** |

nano will open. find `NFQWS_OPT` and paste your blockcheck parameters:

```ini
NFQWS_OPT="--dpi-desync=fakeddisorder --dpi-desync-ttl=1 --dpi-desync-autottl=-5 --dpi-desync-split-pos=1"
```

save: `Ctrl+S`, exit: `Ctrl+X`

leave the remaining questions blank.

## cleanup

```bash
sudo rm -rf /tmp/zapret-v72.7
```

done. 🎉

## uninstalling

```bash
# remove zapret
sudo /opt/zapret/uninstall_easy.sh
sudo rm -rf /opt/zapret

# reset dns
sudo tee /etc/systemd/resolved.conf &>/dev/null <<< ""
sudo systemctl restart systemd-resolved
```

-- moli
