---
title: last.fm is still goated
date: 2025-11-25
tags: [music, api, webdev]
excerpt: why i still use last.fm in 2025 and how i added it to my site.
---

# last.fm is still goated

in a world of spotify wrapped once a year, last.fm just keeps scrobbling. every single track. forever.

## why last.fm in 2025?

spotify gives you stats once a year. last.fm gives you stats every second.

- **real-time tracking** - see what you're listening to right now
- **historical data** - years of listening history
- **open api** - actually lets you build stuff
- **cross-platform** - works with everything, not just spotify

## the api is actually good

```js
const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
    params: {
        method: 'user.getrecenttracks',
        user: 'yourusername',
        api_key: 'your_key',
        format: 'json',
        limit: 10
    }
});
```

that's it. no oauth dance. no token refresh hell. just an api key and you're good.

## what you get back

- track name
- artist
- album
- album art
- timestamp
- whether it's currently playing

everything you need to show "now playing" on your site.

## my setup

i added a recent tracks section to my site. updates every 30 seconds. shows what i'm listening to in real-time.

the cool part: consolidating repeat plays. if i listen to the same song 5 times in a row (no judgment), it shows `×5` instead of listing it five times.

## the scrobbling ecosystem

last.fm works with basically everything:
- spotify (native)
- apple music (via apps)
- youtube music
- local files
- literally anything with a scrobbler

## vs spotify wrapped

| last.fm | spotify wrapped |
|---------|-----------------|
| real-time | once a year |
| all platforms | spotify only |
| open api | lol no |
| years of data | current year |
| free | "free" |

## the vibe

there's something nice about having a complete record of everything you've ever listened to. not just for stats, but for the memories.

looking at my scrobbles from 2020 hits different.

## add it to your site

if you're building a personal site, add your recent tracks. it's:
- easy to implement
- shows personality
- actually useful
- free api

## the truth

last.fm has been doing "music tracking" since 2002. spotify wrapped is just last.fm once a year with better marketing.

real ones know.

-- moli
