---
title: building this site: a deep dive
date: 2026-03-06
tags: [vue, vite, catppuccin, webdev, design]
excerpt: how a terminal aesthetic, vue 3, and too many late nights became f1sh.dev.
---

# building this site: a deep dive

this site started as a weekend project and turned into something i actually care about. here is how every piece fits together, the decisions behind them, and the code that makes it work.

## the stack

| layer | choice | why |
|-------|--------|-----|
| framework | vue 3 | composition api is clean, reactive without boilerplate |
| build | vite | instant hmr, fast builds, no webpack nightmares |
| styling | tailwind css | utility-first works perfectly for custom designs |
| colors | catppuccin mocha | warm, accessible, beautiful |
| fonts | jetbrains mono | monospace everywhere for the terminal feel |
| animations | motion-v | spring physics that feel natural |
| markdown | marked.js | lightweight, extensible renderer |
| syntax | prismjs | reliable, themeable code highlighting |
| routing | vue router | spa navigation with query-based blog urls |

no cms, no database, no server. markdown files, static hosting, done.

## the boot sequence

when you first visit the site, you see a fake bios boot screen. it is silly. it is completely unnecessary. i love it.

```javascript
onMounted(() => {
    if (sessionStorage.getItem("booted")) {
        done.value = true;
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
        sessionStorage.setItem("booted", "true");
        done.value = true;
        return;
    }

    show.value = true;
    setTimeout(() => {
        show.value = false;
        sessionStorage.setItem("booted", "true");
        setTimeout(() => { done.value = true; }, 400);
    }, 2500);
});
```

### design decisions

- **runs once per session**: `sessionStorage` means refreshing the page skips it. you only see it when you first arrive.
- **respects reduced motion**: if your os says you prefer reduced motion, the boot sequence is skipped entirely. accessibility is not optional.
- **staggered lines**: each line appears with a css `animation-delay`, simulating a real boot sequence. the timing is tuned to feel fast but readable.

```css
.boot-line {
    opacity: 0;
    animation: boot-appear 0.15s ease-out forwards;
}
```

the progress bar fills at 1.6 seconds and the whole thing wraps up at 2.5 seconds. long enough to register, short enough to not annoy.

## page transitions

every page change has a smooth fade-and-slide animation powered by motion-v (a vue port of framer motion).

```javascript
import { motion, AnimatePresence } from "motion-v";

const pageEnter = { opacity: 0, y: 20 };
const pageAnimate = { opacity: 1, y: 0 };
const pageExit = { opacity: 0, y: -20 };
```

```html
<router-view v-slot="{ Component, route }">
    <AnimatePresence mode="wait">
        <motion.div
            :key="route.path"
            :initial="isInitialLoad ? false : pageEnter"
            :animate="pageAnimate"
            :exit="pageExit"
            :transition="pageTransition"
        >
            <component :is="Component" />
        </motion.div>
    </AnimatePresence>
</router-view>
```

### the subtle details

- **no animation on first load**: `isInitialLoad ? false : pageEnter` prevents the home page from sliding in when you first visit. the boot sequence handles the entrance.
- **wait mode**: `AnimatePresence mode="wait"` means the old page fades out before the new one fades in. no overlap, no jank.
- **spring physics**: transitions use spring-based easing instead of linear or cubic-bezier. springs feel more natural because they can overshoot slightly, like real objects.

## the command palette

`cmd+k` opens a spotlight-style command palette. it searches pages, toggles theme, and finds blog posts.

```javascript
const filteredActions = computed(() => {
    const q = query.value.toLowerCase().trim();
    const all = [
        ...pages,
        themeAction.value,
        ...blogPosts.value,
    ];

    if (!q) {
        return [
            ...pages,
            themeAction.value,
            ...blogPosts.value.slice(0, 5),
        ];
    }

    return all.filter(action =>
        action.label.toLowerCase().includes(q) ||
        action.description.toLowerCase().includes(q)
    );
});
```

### how it works

1. **global keydown listener** captures `cmd+k` / `ctrl+k`
2. **teleported to body** so it renders above everything
3. **backdrop blur** creates depth without a harsh overlay
4. **keyboard navigation**: arrow keys move selection, enter executes, escape closes
5. **auto-focus**: input gets focus immediately on open

### the animation

the modal slides in with a custom cubic-bezier that overshoots slightly:

```css
.palette-modal {
    animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
    from {
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

the `0.2s` duration is intentional. any slower and it feels sluggish for something that should feel instant. any faster and you do not see the animation at all.

## markdown rendering

blog posts are plain markdown files with yaml-like frontmatter. the rendering pipeline has three stages.

### stage 1: frontmatter parsing

```javascript
export const parseFrontmatter = (content) => {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, content };

    const [, frontmatterText, bodyContent] = match;
    const frontmatter = {};

    frontmatterText.split("\n").forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) return;
        const value = rest.join(":").trim();
        if (value.startsWith("[") && value.endsWith("]")) {
            frontmatter[key.trim()] = value
                .slice(1, -1)
                .split(",")
                .map((item) => item.trim());
        } else {
            frontmatter[key.trim()] = value;
        }
    });

    return { frontmatter, content: bodyContent };
};
```

no yaml parser dependency. the format is simple enough that a regex and some string splitting handles everything. arrays use bracket notation: `tags: [vue, webdev, tutorial]`.

### stage 2: markdown to html

marked.js with a custom renderer that applies catppuccin classes to every element:

```javascript
heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = slugify(text);
    const classes = {
        1: "text-2xl font-bold text-catppuccin-text mt-8 mb-4",
        2: "text-xl font-semibold text-catppuccin-blue mt-8 mb-4",
        3: "text-lg font-semibold text-catppuccin-mauve mt-6 mb-3",
    };
    return `<h${depth} id="${id}" class="${classes[depth]}">${text}</h${depth}>`;
}
```

every heading gets a slugified id for anchor links. h2 headings are blue, h3 headings are mauve. this color distinction helps you scan the page visually.

### stage 3: syntax highlighting

prismjs runs after the markdown is rendered and inserted into the dom:

```javascript
const highlightCodeBlocks = async () => {
    await ensurePostEnhancers();
    await nextTick();
    if (PrismInstance && articleContentRef.value) {
        PrismInstance.highlightAllUnder(articleContentRef.value);
    }
};
```

prism is lazy-loaded. it only imports when you open a blog post, not on the home page. the language components (javascript, python, bash, css) are loaded in parallel with the main prism module.

### the copy button

every code block gets a copy button that appears on hover:

```javascript
code({ text, lang }) {
    const id = `code-block-${codeBlockCounter++}`;
    return `<div class="relative group">
        <button data-copy-target="${id}"
            class="absolute top-2 right-2 opacity-0
                   group-hover:opacity-100 ...">
            copy
        </button>
        <pre class="...">
            <code id="${id}" class="language-${lang}">
                ${escaped}
            </code>
        </pre>
    </div>`;
}
```

the button uses event delegation on the article container rather than attaching listeners to each button. one listener handles all code blocks.

## the table of contents

the sticky toc sidebar is one of my favorite features. it uses intersection observer to highlight the current section as you scroll.

```javascript
const extractHeadings = () => {
    const els = articleContentRef.value.querySelectorAll("h2, h3");
    headings.value = Array.from(els).map(el => ({
        id: el.id,
        text: el.textContent,
        level: parseInt(el.tagName[1]),
    }));
};
```

### intersection observer setup

```javascript
observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeId.value = entry.target.id;
            }
        });

        const allAbove = entries
            .filter(e => e.boundingClientRect.top < 0)
            .sort((a, b) =>
                b.boundingClientRect.top - a.boundingClientRect.top
            );

        if (allAbove.length && !entries.some(e => e.isIntersecting)) {
            activeId.value = allAbove[0].target.id;
        }
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
);
```

### why these margins

`-20% 0px -70% 0px` means the observer considers a heading "visible" when it is in the top 20-30% of the viewport. this feels right because you are reading downward — by the time a heading reaches the top third of the screen, that is the section you are in.

the fallback logic handles an edge case: when you scroll fast and no heading is currently intersecting, it picks the last heading that scrolled above the viewport.

### the visual indicator

```html
<button
    :class="[
        activeId === heading.id
            ? 'text-catppuccin-mauve border-l-2 border-catppuccin-mauve pl-2'
            : 'text-catppuccin-subtle border-l-2 border-transparent pl-2',
    ]"
>
```

active sections get a mauve left border and text color. h3 headings are indented. the whole thing is hidden on mobile because a sidebar toc does not make sense on small screens.

## the reading progress bar

a thin mauve bar at the top of blog posts that fills as you scroll:

```javascript
const updateReadingProgress = () => {
    rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        readingProgress.value =
            docHeight > 0
                ? Math.min((scrollTop / docHeight) * 100, 100)
                : 0;
    });
};
```

wrapped in `requestAnimationFrame` for performance. scroll events fire constantly, but raf ensures we only calculate once per frame.

```html
<div class="fixed top-0 left-0 w-full h-[3px] z-[9998]">
    <div
        class="h-full bg-catppuccin-mauve"
        :style="{
            width: readingProgress + '%',
            transition: 'width 0.1s ease-out'
        }"
    ></div>
</div>
```

3 pixels tall. enough to notice, not enough to distract. the 0.1s transition smooths out the movement so it does not jitter on fast scrolling.

## blog post loading

posts are loaded at build time using vite's glob import:

```javascript
const postModules = import.meta.glob("/posts/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
});
```

### why eager loading

`eager: true` means all posts are bundled into the javascript. for a personal blog with 15-20 posts, this is fine — maybe 50-100kb of markdown total. the alternative (lazy loading each post) adds network requests and loading states for negligible savings.

### slug generation

```javascript
const slug = path.replace("/posts/", "").replace(".md", "");
```

the filename *is* the slug. `building-this-site.md` becomes `building-this-site`. no database ids, no generated hashes. rename the file, change the url.

### sorting and caching

posts are sorted by date (newest first) once at load time and cached. no re-sorting on every render.

## the catppuccin theme system

the entire site uses catppuccin mocha as its color system. tailwind is configured with css custom properties:

```javascript
// tailwind.config.js
colors: {
    catppuccin: {
        text: "rgb(var(--color-text))",
        base: "rgb(var(--color-base))",
        crust: "rgb(var(--color-crust))",
        mauve: "rgb(var(--color-mauve))",
        blue: "rgb(var(--color-blue))",
        // ... all 26 catppuccin colors
    }
}
```

### dark and light modes

css variables switch between mocha (dark) and latte (light):

```css
:root {
    --color-text: 205 214 244;    /* mocha text */
    --color-base: 30 30 46;       /* mocha base */
    --color-mauve: 203 166 247;   /* mocha mauve */
}

.light {
    --color-text: 76 79 105;      /* latte text */
    --color-base: 239 241 245;    /* latte base */
    --color-mauve: 136 57 239;    /* latte mauve */
}
```

by using rgb values without the `rgb()` wrapper, tailwind can add opacity modifiers: `bg-catppuccin-surface/50` becomes `rgba(var(--color-surface), 0.5)`. this one trick makes the entire theme system work with tailwind's opacity utilities.

### the 0.9 scale trick

```css
@media (min-width: 1024px) {
    #app {
        transform: scale(0.9);
        transform-origin: center center;
        margin-top: -5vh;
    }
}
```

on desktop, the entire app is scaled to 90%. this makes the monospace font and terminal aesthetic feel more "contained" — like looking at a terminal window rather than a full-screen application. the negative margin compensates for the visual gap the scaling creates.

## performance decisions

### what i did not add

- **no ssr**: this is a static personal site. the spa loads fast enough. adding nuxt or ssr would triple the complexity for marginal improvement.
- **no image optimization pipeline**: i have maybe five images total. a build-time optimizer would be over-engineering.
- **no state management**: vue's `ref()` and `computed()` handle everything. pinia would be unused overhead.
- **no analytics**: i do not need to know how many people read my posts. the site exists because i enjoy building it.

### what i optimized

- **lazy prismjs**: syntax highlighting only loads when viewing a blog post.
- **eager post loading**: all markdown bundled upfront to avoid loading spinners.
- **raf-throttled scroll handlers**: reading progress bar and toc use `requestAnimationFrame` instead of raw scroll events.
- **css animations over js**: boot sequence and palette animations use css keyframes. js controls when they start, css handles the motion.
- **minimal dependencies**: the total dependency count is under 10. every package earns its place.

## what i would do differently

### vue over astro

if i started today, i might consider astro with vue islands. the blog content is static — it does not need to be an spa. but honestly, the spa approach works fine for this scale and i enjoy having full control.

### tailwind classes in markdown

the custom marked renderer injects tailwind classes directly into html strings. it works, but it means the markdown output is tightly coupled to tailwind. if i ever migrate away from tailwind, every renderer function needs rewriting.

a better approach would be using semantic css classes and styling them separately. but "better" and "worth refactoring" are different things.

### testing

there are no tests. for a personal blog, i am fine with this. i test by looking at the site. but if this were a team project, the markdown renderer and blog service would need unit tests.

## the terminal aesthetic philosophy

the whole site follows one principle: *look like a terminal, behave like a website.*

- `~$ cd ~/blog` above the blog list — decorative, not functional
- `~$ cat post.md` above post content — sets the mood
- `~$ toc` above the table of contents — consistent theming
- monospace font everywhere — commitment to the bit
- left border on content — mimics a terminal cursor column

but the site still has proper links, responsive layout, smooth animations, and accessibility features. the terminal aesthetic is a skin, not a limitation.

the most important lesson from building this site: constraints breed creativity. "make it look like a terminal" sounds limiting, but it actually made every design decision easier. when you have a strong visual language, you spend less time deciding and more time building.

-- moli