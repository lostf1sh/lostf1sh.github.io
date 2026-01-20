---
title: building a heatmap for github contributions
date: 2025-12-10
tags: [visualization, github, vue, d3]
excerpt: recreating the github contribution graph from scratch for my personal website.
---

# building a heatmap for github contributions

github's contribution graph is iconic. i wanted it on my site without their api rate limits.

## the data

github exposes contribution counts at `https://github.com/users/{username}/contributions`.

a quick scrape gives you the raw data in html. parsing it is straightforward:

```javascript
const data = Array.from(document.querySelectorAll('.day'))
  .map(day => ({
    date: day.dataset.date,
    count: parseInt(day.dataset.count, 10)
  }))
```

## the grid

52 weeks × 7 days = 364 squares. css grid makes this trivial:

```
display: grid;
grid-template-rows: repeat(7, 1fr);
grid-auto-flow: column;
```

this creates the left-to-right week flow with days stacked vertically.

## color scale

contribution counts map to colors. catppuccin palette works well:

```
0: crust
1-3: base
4-6: overlay
7-9: mauve
10+: pink
```

## interactivity

hover shows the date and count. click could link to that day's github profile.

```
title = `${date}: ${count} contributions`
```

simple and effective.

## deployment

fetch on build time. cache the json. no client-side api calls, no rate limit issues.

-- moli
