# f1sh.dev Codebase Improvements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix bugs, refactor large components, add theme toggle, new pages, and visual enhancements to f1sh.dev.

**Architecture:** 9 changes organized in dependency order. Theme system (CSS variables) is the foundation — all subsequent UI work builds on it. Home.vue is decomposed into focused child components. New features (projects page, boot sequence, matrix rain, reading progress) are independent once the foundation is set.

**Tech Stack:** Vue 3, Tailwind CSS 3, Vite 7, motion-v, marked (new), PrismJS

---

## Chunk 1: Foundation

### Task 1: Remove Noto Sans JP Font

**Files:**
- Modify: `index.html:53`
- Modify: `src/assets/main.css:1`

- [ ] **Step 1: Edit Google Fonts URL in index.html**

In `index.html` line 53, change the font URL to remove `&family=Noto+Sans+JP:wght@400;500`:

```html
<!-- FROM -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+JP:wght@400;500&display=swap" rel="stylesheet" />

<!-- TO -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Edit Google Fonts URL in main.css**

In `src/assets/main.css` line 1, same change:

```css
/* FROM */
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+JP:wght@400;500&display=swap");

/* TO */
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap");
```

- [ ] **Step 3: Verify and commit**

Run: `grep -r "Noto" src/ index.html` — should return nothing.

```bash
git add index.html src/assets/main.css
git commit -m "chore: remove unused Noto Sans JP font import"
```

---

### Task 2: Fix Duplicate Event Listener in Blog.vue

**Files:**
- Modify: `src/pages/Blog.vue:330-352`

- [ ] **Step 1: Remove duplicate addEventListener from onMounted**

In `src/pages/Blog.vue`, remove lines 330-332 from the `onMounted` block. The `onMounted` should become:

```javascript
onMounted(() => {
    loadPosts();
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    const slugFromQuery = route.query.post;
    if (slugFromQuery) {
        openPost(slugFromQuery);
    }
});
```

- [ ] **Step 2: Add cleanup to the watch handler**

Replace the existing `watch(articleContentRef, ...)` block (lines 348-352) with a version that cleans up on ref change:

```javascript
watch(articleContentRef, (el, _, onCleanup) => {
    if (el) {
        el.addEventListener("click", handleCopyClick);
        onCleanup(() => {
            el.removeEventListener("click", handleCopyClick);
        });
    }
});
```

- [ ] **Step 3: Remove redundant cleanup from onBeforeUnmount**

The `onBeforeUnmount` handler (lines 340-346) no longer needs to remove the click listener since the watch cleanup handles it. Update to:

```javascript
onBeforeUnmount(() => {
    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
});
```

- [ ] **Step 4: Verify and commit**

Run: `bun run build` — should build cleanly.

```bash
git add src/pages/Blog.vue
git commit -m "fix: remove duplicate event listener in Blog.vue"
```

---

### Task 3: Implement Catppuccin Latte Theme + Toggle

This is the largest task. It changes the color system from hardcoded Tailwind values to CSS custom properties, enabling theme switching.

**Files:**
- Modify: `src/assets/base.css`
- Modify: `src/assets/main.css`
- Modify: `tailwind.config.js`
- Modify: `index.html`
- Modify: `src/App.vue`
- Modify: `src/main.js`
- Create: `src/components/ThemeToggle.vue`
- Modify: `src/services/lanyardService.js:7,119-120`
- Modify: All page/component files using `text-catppuccin-*` / `bg-catppuccin-*` classes (these continue to work since we're changing the Tailwind config values, not the class names)

- [ ] **Step 3.1: Define CSS custom properties in base.css**

Replace the contents of `src/assets/base.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    :root {
        /* Catppuccin Mocha (dark - default) */
        --color-crust: 17 17 27;
        --color-base: 30 30 46;
        --color-surface: 49 50 68;
        --color-overlay: 69 71 90;
        --color-subtle: 147 153 178;
        --color-text: 205 214 244;
        --color-gold: 250 189 47;
        --color-pink: 245 194 231;
        --color-mauve: 203 166 247;
        --color-red: 243 139 168;
        --color-yellow: 249 226 175;
        --color-peach: 250 179 135;
        --color-green: 166 227 161;
        --color-blue: 137 180 250;
        --color-gray: 166 173 200;
    }

    [data-theme="light"] {
        /* Catppuccin Latte */
        --color-crust: 220 224 232;
        --color-base: 239 241 245;
        --color-surface: 204 208 218;
        --color-overlay: 156 160 176;
        --color-subtle: 108 111 133;
        --color-text: 76 79 105;
        --color-gold: 223 142 29;
        --color-pink: 234 118 203;
        --color-mauve: 136 57 239;
        --color-red: 210 15 57;
        --color-yellow: 223 142 29;
        --color-peach: 254 100 11;
        --color-green: 64 160 43;
        --color-blue: 30 102 245;
        --color-gray: 124 127 147;
    }
}
```

- [ ] **Step 3.2: Update tailwind.config.js to use CSS variables**

Replace `tailwind.config.js` entirely:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    fontFamily: {
      sans: ['"JetBrains Mono"', "monospace"],
      mono: ['"JetBrains Mono"', "monospace"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "catppuccin-crust": "rgb(var(--color-crust) / <alpha-value>)",
      "catppuccin-base": "rgb(var(--color-base) / <alpha-value>)",
      "catppuccin-surface": "rgb(var(--color-surface) / <alpha-value>)",
      "catppuccin-overlay": "rgb(var(--color-overlay) / <alpha-value>)",
      "catppuccin-subtle": "rgb(var(--color-subtle) / <alpha-value>)",
      "catppuccin-text": "rgb(var(--color-text) / <alpha-value>)",
      "catppuccin-gold": "rgb(var(--color-gold) / <alpha-value>)",
      "catppuccin-pink": "rgb(var(--color-pink) / <alpha-value>)",
      "catppuccin-mauve": "rgb(var(--color-mauve) / <alpha-value>)",
      "catppuccin-red": "rgb(var(--color-red) / <alpha-value>)",
      "catppuccin-yellow": "rgb(var(--color-yellow) / <alpha-value>)",
      "catppuccin-peach": "rgb(var(--color-peach) / <alpha-value>)",
      "catppuccin-green": "rgb(var(--color-green) / <alpha-value>)",
      "catppuccin-blue": "rgb(var(--color-blue) / <alpha-value>)",
      "catppuccin-gray": "rgb(var(--color-gray) / <alpha-value>)",
    },
  },
  plugins: [],
};
```

**Important:** All existing Tailwind classes like `text-catppuccin-mauve`, `bg-catppuccin-base/20` etc. continue to work unchanged — they now resolve through CSS variables instead of hardcoded hex. The `<alpha-value>` syntax preserves opacity modifiers like `/20`, `/60` etc.

- [ ] **Step 3.3: Update hardcoded hex values in main.css**

In `src/assets/main.css`, replace the hardcoded `background-color` and background gradients in the `body` rule (lines 19-57):

```css
body {
    background-color: rgb(var(--color-base));
    background-image:
        radial-gradient(
            1200px circle at 10% 15%,
            rgb(var(--color-mauve) / 0.08),
            transparent 40%
        ),
        radial-gradient(
            900px circle at 85% 10%,
            rgb(var(--color-green) / 0.06),
            transparent 45%
        ),
        radial-gradient(
            1000px circle at 80% 80%,
            rgb(var(--color-blue) / 0.05),
            transparent 40%
        ),
        repeating-linear-gradient(
            0deg,
            rgb(var(--color-subtle) / 0.05) 0,
            rgb(var(--color-subtle) / 0.05) 1px,
            transparent 1px,
            transparent 40px
        ),
        repeating-linear-gradient(
            90deg,
            rgb(var(--color-subtle) / 0.04) 0,
            rgb(var(--color-subtle) / 0.04) 1px,
            transparent 1px,
            transparent 40px
        );
    background-attachment: fixed;
    background-size: 100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px;
    min-height: 100vh;
    font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
    font-size: 14px;
    line-height: 1.6;
    transition: background-color 0.3s ease, color 0.3s ease;
}
```

Also update `::selection` (lines 61-64) to use CSS variables:

```css
::selection {
    background: rgb(var(--color-mauve));
    color: rgb(var(--color-base));
}
```

Update `.scrollbar-thin::-webkit-scrollbar-thumb` (line 76):

```css
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgb(var(--color-surface));
    border-radius: 2px;
}
```

Update `*:focus-visible` (lines 89-92):

```css
*:focus-visible {
    outline: 1px solid rgb(var(--color-mauve));
    outline-offset: 2px;
}
```

Update `.cursor-blink::after` (lines 108-112):

```css
.cursor-blink::after {
    content: "_";
    color: rgb(var(--color-mauve));
    animation: cursor-blink 1.2s infinite;
}
```

- [ ] **Step 3.4: Update hardcoded hex values in App.vue**

In `src/App.vue`, replace the scrollbar styles (lines 44-65) to use CSS variables:

```css
::-webkit-scrollbar {
    width: 16px;
}

html {
    scrollbar-width: auto;
    scrollbar-color: rgb(var(--color-overlay)) rgb(var(--color-base));
}

::-webkit-scrollbar-track {
    background-color: rgb(var(--color-base));
}

::-webkit-scrollbar-thumb {
    background-color: rgb(var(--color-overlay));
    border: 3px solid rgb(var(--color-base));
    border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgb(var(--color-overlay));
}
```

- [ ] **Step 3.5: Update index.html**

In `index.html`, update line 56 (theme-color will be managed by JS) and add `data-theme` attribute:

```html
<!-- Line 2: add data-theme -->
<html lang="en" prefix="og: https://ogp.me/ns#" data-theme="dark">

<!-- Line 56: default dark theme-color -->
<meta name="theme-color" content="#11111b" />
```

- [ ] **Step 3.6: Create ThemeToggle component**

Create `src/components/ThemeToggle.vue`:

```vue
<script setup>
import { ref, onMounted } from "vue";

const theme = ref("dark");

const themeColors = {
    dark: "#11111b",
    light: "#dce0e8",
};

const setTheme = (t) => {
    theme.value = t;
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[t]);
};

const toggle = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
};

onMounted(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
});
</script>

<template>
    <button
        @click="toggle"
        class="fixed top-4 right-4 z-50 w-8 h-8 flex items-center justify-center text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors cursor-pointer"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        <span v-if="theme === 'dark'">sun</span>
        <span v-else>moon</span>
    </button>
</template>
```

- [ ] **Step 3.7: Add theme initialization script to prevent flash**

In `index.html`, add an inline script before the closing `</head>` tag (after line 56) to set theme before render:

```html
<script>
    (function() {
        var t = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', t);
        var colors = { dark: '#11111b', light: '#dce0e8' };
        document.querySelector('meta[name="theme-color"]').setAttribute('content', colors[t]);
    })();
</script>
```

- [ ] **Step 3.8: Add ThemeToggle to App.vue**

In `src/App.vue`, import and render ThemeToggle:

```vue
<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion, AnimatePresence } from "motion-v";
import ThemeToggle from "@/components/ThemeToggle.vue";
import {
    pageEnter,
    pageAnimate,
    pageExit,
    pageTransition,
} from "@/utils/motion";

const route = useRoute();
const router = useRouter();
const isInitialLoad = ref(true);

router.isReady().then(() => {
    setTimeout(() => {
        isInitialLoad.value = false;
    }, 100);
});
</script>

<template>
    <ThemeToggle />
    <router-view v-slot="{ Component, route }">
        <AnimatePresence mode="wait">
            <motion.div
                :key="route.path"
                :initial="isInitialLoad ? false : pageEnter"
                :animate="pageAnimate"
                :exit="pageExit"
                :transition="pageTransition"
            >
                <component v-if="Component" :is="Component" />
            </motion.div>
        </AnimatePresence>
    </router-view>
</template>
```

- [ ] **Step 3.9: Update lanyardService.js hardcoded colors**

In `src/services/lanyardService.js`, the `discordStatusColor` (lines 7, 117-120) uses Tailwind classes which will work since we changed the underlying values, not the class names. **No changes needed** — the classes `text-catppuccin-gold` and `text-catppuccin-subtle` now resolve through CSS variables automatically.

- [ ] **Step 3.10: Build and test**

Run: `bun run build` — should build cleanly with no errors.

Manual test:
1. Open in browser, verify dark theme looks identical to before
2. Click theme toggle, verify light theme applies
3. Refresh page, verify theme persists
4. Check scrollbar colors change with theme

```bash
git add src/assets/base.css src/assets/main.css tailwind.config.js index.html src/App.vue src/components/ThemeToggle.vue
git commit -m "feat: add Catppuccin Latte theme with toggle button"
```

---

## Chunk 2: Refactoring

### Task 4: Decompose Home.vue into Components

**Files:**
- Create: `src/components/StatusSection.vue`
- Create: `src/components/ProjectsGrid.vue`
- Create: `src/components/RecentTracks.vue`
- Create: `src/components/ContributionGraph.vue`
- Modify: `src/pages/Home.vue`

- [ ] **Step 4.1: Create StatusSection.vue**

Create `src/components/StatusSection.vue`. This component receives lanyard data as props and displays Discord, Spotify, and editor status:

```vue
<script setup>
import { computed } from "vue";
import { motion } from "motion-v";
import { fadeLeft } from "@/utils/motion";

const props = defineProps({
    isLoading: Boolean,
    discordUser: Object,
    discordStatus: String,
    discordStatusColor: String,
    spotify: Object,
    editorActivity: Object,
});

const editorStatus = computed(() => {
    if (!props.editorActivity) return null;

    if (
        props.editorActivity.details &&
        props.editorActivity.details.toLowerCase().includes("idling")
    ) {
        return "idling";
    }

    const editorName = props.editorActivity.name;
    const isZed = editorName === "Zed";

    let filename = isZed
        ? props.editorActivity.state || ""
        : props.editorActivity.details || "";

    let workspace = isZed
        ? props.editorActivity.details || ""
        : props.editorActivity.state || "";

    filename = filename
        .replace(/editing /i, "")
        .replace(/working on /i, "")
        .trim();

    workspace = workspace
        .replace(/in /i, "")
        .replace(/workspace: /i, "")
        .trim();

    return {
        name: editorName,
        workspace,
        filename,
    };
});
</script>

<template>
    <motion.div
        :variants="fadeLeft"
        class="border-l-2 border-catppuccin-surface pl-4 mb-4"
    >
        <div class="text-catppuccin-subtle text-sm mb-2">
            ~$ ps aux | grep duhan
        </div>
        <div class="space-y-1 text-sm">
            <div
                v-if="!isLoading && discordUser"
                class="flex items-center gap-2"
            >
                <span class="text-catppuccin-blue">discord</span>
                <span class="text-catppuccin-subtle">:</span>
                <span class="text-catppuccin-text">{{ discordUser.username }}</span>
                <span :class="discordStatusColor">[{{ discordStatus }}]</span>
            </div>

            <div class="flex items-center gap-2">
                <span class="text-catppuccin-green">spotify</span>
                <span class="text-catppuccin-subtle">:</span>
                <span
                    v-if="!isLoading && spotify"
                    class="text-catppuccin-text truncate"
                >
                    {{ spotify.song }} - {{ spotify.artist }}
                </span>
                <span v-else class="text-catppuccin-subtle">not playing</span>
            </div>

            <div
                v-if="
                    !isLoading &&
                    editorActivity &&
                    editorStatus &&
                    (editorStatus.workspace || editorStatus.filename)
                "
                class="flex items-center gap-2"
            >
                <span class="text-catppuccin-blue">{{
                    editorStatus.name === "Zed" ? "zed" : "vscode"
                }}</span>
                <span class="text-catppuccin-subtle">:</span>
                <span class="text-catppuccin-text truncate">
                    <span v-if="editorStatus.workspace">{{
                        editorStatus.workspace.toLowerCase()
                    }}</span>
                    <span
                        v-if="editorStatus.workspace && editorStatus.filename"
                        class="text-catppuccin-subtle"
                    >
                        /
                    </span>
                    <span v-if="editorStatus.filename">{{
                        editorStatus.filename.toLowerCase()
                    }}</span>
                </span>
            </div>
        </div>
    </motion.div>
</template>
```

- [ ] **Step 4.2: Create ProjectsGrid.vue**

Create `src/components/ProjectsGrid.vue`:

```vue
<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    scaleFade,
    cardHover,
    cardPress,
} from "@/utils/motion";

defineProps({
    repos: Array,
    loading: Boolean,
});

const repoContainer = staggerContainer(0.05);
const skeletonContainer = staggerContainer(0.04);
const skeletonItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
</script>

<template>
    <motion.div
        class="border-l-2 border-catppuccin-surface pl-4 min-w-0"
        :whileInView="{ opacity: 1, x: 0 }"
        :initial="{ opacity: 0, x: -15 }"
        :transition="springs.default"
        :inViewOptions="{ once: true }"
    >
        <div class="text-catppuccin-subtle text-sm mb-3">
            ~$ ls ~/projects
        </div>

        <motion.div
            v-if="loading"
            :variants="skeletonContainer"
            initial="hidden"
            animate="visible"
            class="space-y-2"
        >
            <motion.div
                v-for="i in 6"
                :key="`repo-loading-${i}`"
                :variants="skeletonItem"
                class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2"
            >
                <div class="flex items-start gap-3">
                    <div class="skeleton-pulse w-3 h-3 rounded-sm bg-catppuccin-surface/60 mt-0.5"></div>
                    <div class="flex-1 min-w-0 space-y-2">
                        <div class="flex items-center gap-2">
                            <div class="skeleton-pulse h-3.5 rounded bg-catppuccin-surface/60" :style="{ width: ['45%', '55%', '40%', '60%', '35%', '50%'][i - 1] }"></div>
                            <div v-if="i % 3 === 1" class="skeleton-pulse h-3 w-8 rounded bg-catppuccin-yellow/15"></div>
                        </div>
                        <div class="skeleton-pulse h-2.5 rounded bg-catppuccin-surface/40" :style="{ width: ['80%', '65%', '90%', '70%', '75%', '85%'][i - 1] }"></div>
                    </div>
                </div>
            </motion.div>
        </motion.div>

        <div
            v-else-if="!repos.length"
            class="text-sm text-catppuccin-subtle"
        >
            no projects found
        </div>

        <motion.div
            v-else
            :variants="repoContainer"
            initial="hidden"
            animate="visible"
            class="space-y-2"
        >
            <motion.a
                v-for="repo in repos"
                :key="repo.id"
                :href="repo.html_url"
                target="_blank"
                rel="noopener noreferrer"
                :variants="scaleFade"
                :whileHover="cardHover"
                :whilePress="cardPress"
                class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"
            >
                <div class="flex items-start gap-3 text-sm hover:text-catppuccin-mauve transition-colors px-3 py-2">
                    <span class="text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors">></span>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span
                                class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors font-medium truncate"
                                :title="repo.name"
                            >
                                {{ repo.name }}
                            </span>
                            <span
                                v-if="repo.stargazers_count > 0"
                                class="text-catppuccin-yellow text-xs flex-shrink-0"
                            >
                                ★{{ repo.stargazers_count }}
                            </span>
                        </div>
                        <p
                            class="text-xs text-catppuccin-gray truncate"
                            :title="repo.description"
                        >
                            {{ repo.description || "no description" }}
                        </p>
                    </div>
                </div>
            </motion.a>

            <slot name="footer" />
        </motion.div>
    </motion.div>
</template>

<style scoped>
.skeleton-pulse {
    animation: skeleton-shimmer 1.8s ease-in-out infinite;
}
@keyframes skeleton-shimmer {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
}
</style>
```

- [ ] **Step 4.3: Create RecentTracks.vue**

Create `src/components/RecentTracks.vue`:

```vue
<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    fadeUp,
    scaleFade,
    cardHover,
    cardPress,
} from "@/utils/motion";

defineProps({
    currentTrack: Object,
    tracks: Array,
    loading: Boolean,
    error: String,
});

const trackContainer = staggerContainer(0.05);
const skeletonContainer = staggerContainer(0.04);
const skeletonItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
</script>

<template>
    <motion.div
        class="border-l-2 border-catppuccin-surface pl-4 min-w-0"
        :whileInView="{ opacity: 1, x: 0 }"
        :initial="{ opacity: 0, x: -15 }"
        :transition="springs.default"
        :inViewOptions="{ once: true }"
    >
        <div class="text-catppuccin-subtle text-sm mb-3">
            ~$ cat recent_tracks.log
        </div>

        <motion.div
            v-if="loading"
            :variants="skeletonContainer"
            initial="hidden"
            animate="visible"
            class="space-y-2"
        >
            <motion.div
                v-for="i in 6"
                :key="`loading-${i}`"
                :variants="skeletonItem"
                class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2"
            >
                <div class="flex items-start gap-3">
                    <div class="skeleton-pulse w-3 h-3 rounded-sm mt-0.5" :class="i === 1 ? 'bg-catppuccin-green/30' : 'bg-catppuccin-surface/60'"></div>
                    <div class="flex-1 min-w-0 space-y-2">
                        <div class="flex items-center gap-2">
                            <div class="skeleton-pulse h-3.5 rounded bg-catppuccin-surface/60" :style="{ width: ['50%', '60%', '40%', '55%', '45%', '65%'][i - 1] }"></div>
                            <div v-if="i === 1" class="skeleton-pulse h-3 w-10 rounded bg-catppuccin-green/15"></div>
                            <div v-else-if="i % 2 === 0" class="skeleton-pulse h-3 w-6 rounded bg-catppuccin-yellow/15"></div>
                        </div>
                        <div class="skeleton-pulse h-2.5 rounded bg-catppuccin-surface/40" :style="{ width: ['70%', '55%', '85%', '60%', '75%', '50%'][i - 1] }"></div>
                    </div>
                </div>
            </motion.div>
        </motion.div>

        <div v-else-if="error" class="text-sm text-catppuccin-red">
            error: {{ error }}
        </div>

        <div
            v-else-if="!tracks.length && !currentTrack"
            class="text-sm text-catppuccin-subtle"
        >
            no tracks found
        </div>

        <motion.div
            v-else
            :variants="trackContainer"
            initial="hidden"
            animate="visible"
            class="space-y-2"
        >
            <motion.a
                v-if="currentTrack"
                :href="currentTrack.url"
                target="_blank"
                rel="noopener noreferrer"
                :key="`current-${currentTrack.name}-${currentTrack.artist['#text']}`"
                :variants="scaleFade"
                :whileHover="cardHover"
                :whilePress="cardPress"
                class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"
            >
                <div class="flex items-start gap-3 text-sm px-3 py-2">
                    <span class="text-catppuccin-green">♪</span>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span
                                class="text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate"
                                :title="currentTrack.name"
                            >
                                {{ currentTrack.name }}
                            </span>
                            <span class="text-catppuccin-green text-xs flex-shrink-0">[now]</span>
                        </div>
                        <p
                            class="text-xs text-catppuccin-gray truncate"
                            :title="currentTrack.artist['#text']"
                        >
                            {{ currentTrack.artist["#text"] }}
                        </p>
                    </div>
                </div>
            </motion.a>

            <motion.a
                v-for="track in tracks.slice(0, currentTrack ? 5 : 6)"
                :key="`${track.name}-${track.artist['#text']}-${track.date}`"
                :href="track.url"
                target="_blank"
                rel="noopener noreferrer"
                :variants="fadeUp"
                :whileHover="cardHover"
                :whilePress="cardPress"
                class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"
            >
                <div class="flex items-start gap-3 text-sm px-3 py-2">
                    <span class="text-catppuccin-subtle group-hover:text-catppuccin-green transition-colors">></span>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span
                                class="text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate"
                                :title="track.name"
                            >
                                {{ track.name }}
                            </span>
                            <span
                                v-if="track.playcount > 1"
                                class="text-catppuccin-yellow text-xs flex-shrink-0"
                            >
                                ×{{ track.playcount }}
                            </span>
                        </div>
                        <p
                            class="text-xs text-catppuccin-gray truncate"
                            :title="track.artist['#text']"
                        >
                            {{ track.artist["#text"] }}
                        </p>
                    </div>
                </div>
            </motion.a>
        </motion.div>
    </motion.div>
</template>

<style scoped>
.skeleton-pulse {
    animation: skeleton-shimmer 1.8s ease-in-out infinite;
}
@keyframes skeleton-shimmer {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
}
</style>
```

- [ ] **Step 4.4: Create ContributionGraph.vue**

Create `src/components/ContributionGraph.vue`:

```vue
<script setup>
import { computed } from "vue";
import { motion } from "motion-v";
import { springs } from "@/utils/motion";
import { getContributionLevel, getGitHubContributionUrl } from "@/services/githubService";

const props = defineProps({
    contributions: Array,
    loading: Boolean,
});

const contributionWeeks = computed(() => {
    const weeks = [];
    for (let i = 0; i < props.contributions.length; i += 7) {
        weeks.push(props.contributions.slice(i, i + 7));
    }
    return weeks;
});

const totalContributions = computed(() => {
    return props.contributions.reduce((sum, day) => sum + day.count, 0);
});
</script>

<template>
    <motion.div
        class="mt-6 border-l-2 border-catppuccin-surface pl-4"
        :whileInView="{ opacity: 1, y: 0 }"
        :initial="{ opacity: 0, y: 20 }"
        :transition="springs.default"
        :inViewOptions="{ once: true }"
    >
        <div class="flex items-center justify-between mb-3">
            <div class="text-catppuccin-subtle text-sm">
                ~$ git log --oneline --since="1.year.ago" | wc -l
            </div>
            <div v-if="!loading" class="flex items-center gap-1 text-[10px] text-catppuccin-subtle">
                <span>less</span>
                <div class="flex gap-[1px]">
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-surface/50"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/30"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/50"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/70"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green"></div>
                </div>
                <span>more</span>
            </div>
        </div>

        <div v-if="loading">
            <div class="h-[60px] bg-catppuccin-surface/30 rounded cursor-blink"></div>
        </div>

        <div v-else>
            <div class="overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-thin">
                <div class="inline-flex md:flex gap-[3px] md:gap-1" style="min-width: max-content;">
                    <div
                        v-for="(week, weekIndex) in contributionWeeks"
                        :key="weekIndex"
                        class="flex flex-col gap-[3px] md:gap-1 md:flex-1"
                    >
                        <template v-for="(day, dayIndex) in week" :key="dayIndex">
                            <a
                                v-if="day.count > 0"
                                :href="getGitHubContributionUrl(day.date)"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm transition-all hover:ring-1 hover:ring-catppuccin-green hover:scale-110 cursor-pointer"
                                :class="[
                                    getContributionLevel(day.count) === 1
                                        ? 'bg-catppuccin-green/30 hover:bg-catppuccin-green/40'
                                        : getContributionLevel(day.count) === 2
                                          ? 'bg-catppuccin-green/50 hover:bg-catppuccin-green/60'
                                          : getContributionLevel(day.count) === 3
                                            ? 'bg-catppuccin-green/70 hover:bg-catppuccin-green/80'
                                            : 'bg-catppuccin-green hover:bg-catppuccin-green',
                                ]"
                                :title="`${day.date}: ${day.count} contributions - Click to view on GitHub`"
                            ></a>
                            <div
                                v-else
                                class="w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm bg-catppuccin-surface/50"
                                :title="`${day.date}: ${day.count} contributions`"
                            ></div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="text-xs text-catppuccin-gray mt-2">
                {{ totalContributions }} contributions in the last year
            </div>
        </div>
    </motion.div>
</template>
```

- [ ] **Step 4.5: Rewrite Home.vue to use child components**

Replace `src/pages/Home.vue` with the orchestrator version. Keep hero, about, and tools sections inline. Use child components for status, projects, tracks, and contributions:

```vue
<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { motion } from "motion-v";
import { lanyardData } from "@/services/lanyardService";
import { getRecentTracks } from "@/services/lastfmService";
import {
    getAllReposWithLanguages,
    getContributionData,
} from "@/services/githubService";
import {
    springs,
    staggerContainer,
    fadeUp,
    fadeLeft,
} from "@/utils/motion";

import StatusSection from "@/components/StatusSection.vue";
import ProjectsGrid from "@/components/ProjectsGrid.vue";
import RecentTracks from "@/components/RecentTracks.vue";
import ContributionGraph from "@/components/ContributionGraph.vue";

const discordStatusColor = computed(() => lanyardData.discordStatusColor);
const spotify = computed(() => lanyardData.spotify);
const discordStatus = computed(() => lanyardData.discordStatus);
const discordUser = computed(() => lanyardData.discordUser);
const editorActivity = computed(() => lanyardData.editorActivity);
const isLoading = computed(() => lanyardData.isLoading);

const repos = ref([]);
const reposLoading = ref(true);
const allTracks = ref([]);
const songsLoading = ref(true);
const songsInitialLoad = ref(true);
const songsError = ref(null);
const contributions = ref([]);
const contributionsLoading = ref(true);
let updateInterval = null;
let ageInterval = null;
let timeInterval = null;

const currentTrack = computed(() =>
    allTracks.value.find((track) => track["@attr"]?.nowplaying),
);

const consolidatedTracks = computed(() => {
    const tracks = allTracks.value.filter(
        (track) => !track["@attr"]?.nowplaying,
    );
    const consolidated = [];
    let currentKey = null;
    let count = 1;

    tracks.forEach((track, index) => {
        const key = `${track.name}-${track.artist["#text"]}`;
        if (currentKey === key) {
            count++;
        } else {
            if (currentKey) {
                const prevTrack = tracks[index - 1];
                consolidated.push({
                    ...prevTrack,
                    playcount: count,
                    date: prevTrack.date?.["#text"],
                });
            }
            currentKey = key;
            count = 1;
        }
        if (index === tracks.length - 1) {
            consolidated.push({
                ...track,
                playcount: count,
                date: track.date?.["#text"],
            });
        }
    });

    return consolidated.slice(0, 10);
});

const pinnedExternal = ["theovilardo/PixelPlayer"];
const pinnedFullNames = new Set(pinnedExternal);

const displayedRepos = computed(() => {
    if (!repos.value.length) return [];

    const pinned = repos.value.filter((r) => pinnedFullNames.has(r.full_name));
    const rest = repos.value
        .filter((r) => !pinnedFullNames.has(r.full_name))
        .sort((a, b) => b.stargazers_count - a.stargazers_count);

    return [...pinned, ...rest].slice(0, 4);
});

const fetchSongs = async () => {
    try {
        songsLoading.value = true;
        allTracks.value = await getRecentTracks();
        songsError.value = null;
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load recent tracks:", error);
        songsError.value = "couldn't load tracks";
    } finally {
        songsLoading.value = false;
        songsInitialLoad.value = false;
    }
};

const fetchProjects = async () => {
    try {
        reposLoading.value = true;
        const [{ repos: ownRepos }, ...pinnedResults] = await Promise.all([
            getAllReposWithLanguages(),
            ...pinnedExternal.map((r) =>
                fetch(`https://api.github.com/repos/${r}`)
                    .then((res) => (res.ok ? res.json() : null))
                    .catch(() => null),
            ),
        ]);
        const pinned = pinnedResults.filter(Boolean);
        repos.value = [...pinned, ...ownRepos];
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load repositories:", error);
        repos.value = [];
    } finally {
        reposLoading.value = false;
    }
};

const fetchContributions = async () => {
    try {
        contributionsLoading.value = true;
        contributions.value = await getContributionData();
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load contribution data:", error);
        contributions.value = [];
    } finally {
        contributionsLoading.value = false;
    }
};

onMounted(() => {
    fetchProjects();
    fetchSongs();
    fetchContributions();
    updateAge();
    updateTime();
    updateInterval = setInterval(fetchSongs, 30000);
    ageInterval = setInterval(updateAge, 1000);
    timeInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
    if (updateInterval) clearInterval(updateInterval);
    if (ageInterval) clearInterval(ageInterval);
    if (timeInterval) clearInterval(timeInterval);
});

const BIRTH_DATE = new Date("2008-06-06T00:00:00");
const currentAge = ref(0);
const currentTime = ref("");

const updateAge = () => {
    const now = new Date();
    const diffMs = now - BIRTH_DATE;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    currentAge.value = diffDays / 365.25;
};

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

const heroContainer = staggerContainer(0.06);
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Hero section -->
            <motion.div
                class="mb-12"
                :variants="heroContainer"
                initial="hidden"
                animate="visible"
            >
                <div class="mb-8">
                    <motion.div
                        :variants="fadeUp"
                        class="text-catppuccin-subtle text-sm mb-2"
                    >
                        ~$ whoami
                    </motion.div>
                    <motion.h1
                        :variants="fadeUp"
                        class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2"
                    >
                        <span class="text-catppuccin-mauve">duhan</span>
                        <span class="text-catppuccin-subtle">@</span>
                        <span class="text-catppuccin-blue">f1sh.dev</span>
                    </motion.h1>
                    <motion.div
                        :variants="fadeUp"
                        class="text-sm text-catppuccin-gray mb-4 flex items-center gap-2"
                    >
                        <span class="text-catppuccin-subtle">aka </span>
                        <span class="text-catppuccin-green">moli</span>
                        <span class="text-catppuccin-surface">|</span>
                        <span class="text-catppuccin-peach">{{ currentTime }}</span>
                        <span class="text-catppuccin-subtle text-xs">TRT</span>
                    </motion.div>

                    <motion.div
                        :variants="fadeUp"
                        class="flex items-center flex-wrap gap-4 text-sm"
                    >
                        <router-link
                            to="/blog"
                            class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors"
                        >
                            [blog]
                        </router-link>
                        <a
                            href="https://github.com/lostf1sh"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                        >
                            [github]
                        </a>
                        <a
                            href="https://www.instagram.com/kawaiimoli"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-catppuccin-subtle hover:text-catppuccin-pink transition-colors"
                        >
                            [instagram]
                        </a>
                        <router-link
                            to="/uses"
                            class="text-catppuccin-subtle hover:text-catppuccin-peach transition-colors"
                        >
                            [uses]
                        </router-link>
                        <router-link
                            to="/projects"
                            class="text-catppuccin-subtle hover:text-catppuccin-yellow transition-colors"
                        >
                            [projects]
                        </router-link>
                    </motion.div>
                </div>

                <!-- About section -->
                <motion.div
                    :variants="fadeLeft"
                    class="border-l-2 border-catppuccin-surface pl-4 mb-4"
                >
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ cat about.txt
                    </div>
                    <p class="text-catppuccin-text leading-relaxed mb-4">
                        <span class="text-catppuccin-yellow">{{ currentAge.toFixed(10) }}</span> y/o
                        junior dev. building stuff and learning along the way.
                        code, table tennis, cooking. based in turkey.
                    </p>
                </motion.div>

                <!-- Status section -->
                <StatusSection
                    :isLoading="isLoading"
                    :discordUser="discordUser"
                    :discordStatus="discordStatus"
                    :discordStatusColor="discordStatusColor"
                    :spotify="spotify"
                    :editorActivity="editorActivity"
                />

                <!-- Tools section -->
                <motion.div
                    :variants="fadeLeft"
                    class="border-l-2 border-catppuccin-surface pl-4 mb-4"
                >
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ ls ~/tools
                    </div>
                    <div class="text-sm text-catppuccin-text">
                        vue | git | nextjs | dart | python | js/ts | docker | bash |
                    </div>
                </motion.div>
            </motion.div>

            <!-- Projects & Tracks grid -->
            <div class="grid lg:grid-cols-2 gap-6">
                <ProjectsGrid :repos="displayedRepos" :loading="reposLoading">
                    <template #footer>
                        <router-link
                            to="/projects"
                            class="block text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors mt-2 pl-6"
                        >
                            see all ~/projects →
                        </router-link>
                    </template>
                </ProjectsGrid>

                <RecentTracks
                    :currentTrack="currentTrack"
                    :tracks="consolidatedTracks"
                    :loading="songsLoading"
                    :error="songsError"
                />
            </div>

            <!-- Contribution graph -->
            <ContributionGraph
                :contributions="contributions"
                :loading="contributionsLoading"
            />
        </div>
    </div>
</template>
```

Note: `ageInterval` changed from 50ms to 1000ms (was unnecessary at 50ms).

- [ ] **Step 4.6: Verify and commit**

Run: `bun run build` — should build cleanly.

Manual test: verify Home page looks identical, all sections render, data loads.

```bash
git add src/components/StatusSection.vue src/components/ProjectsGrid.vue src/components/RecentTracks.vue src/components/ContributionGraph.vue src/pages/Home.vue
git commit -m "refactor: decompose Home.vue into focused child components"
```

---

### Task 5: Replace Custom Markdown Parser with marked

**Files:**
- Modify: `package.json`
- Modify: `src/pages/Blog.vue`

- [ ] **Step 5.1: Install marked**

```bash
bun add marked
```

- [ ] **Step 5.2: Replace parseMarkdown and helpers in Blog.vue**

Remove the `escapeHtml` function (lines 94-101), `sanitizeExternalUrl` function (lines 103-109), and `parseMarkdown` function (lines 152-315) from Blog.vue.

Replace with a `marked` setup. Add these imports at the top of the `<script setup>`:

```javascript
import { Marked } from "marked";
```

Then add this configuration where the old functions were:

```javascript
let codeBlockCounter = 0;

const marked = new Marked({
    renderer: {
        heading({ tokens, depth }) {
            const text = this.parser.parseInline(tokens);
            const classes = {
                1: "text-2xl font-bold text-catppuccin-text mt-8 mb-4",
                2: "text-xl font-semibold text-catppuccin-blue mt-8 mb-4",
                3: "text-lg font-semibold text-catppuccin-mauve mt-6 mb-3",
            };
            return `<h${depth} class="${classes[depth] || ''}">${text}</h${depth}>`;
        },
        paragraph({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<p class="text-catppuccin-text leading-relaxed mb-4">${text}</p>`;
        },
        link({ href, tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-catppuccin-blue hover:text-catppuccin-mauve underline transition-colors">${text}</a>`;
        },
        image({ href, text }) {
            return `<img src="${href}" alt="${text}" class="rounded border border-catppuccin-surface my-4 max-w-full">`;
        },
        code({ text, lang }) {
            const id = `code-block-${codeBlockCounter++}`;
            const languageClass = lang ? `language-${lang.toLowerCase()}` : "";
            const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            return `<div class="relative group">
                <button data-copy-target="${id}" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-catppuccin-subtle hover:text-catppuccin-mauve px-2 py-1 bg-catppuccin-crust border border-catppuccin-surface rounded hover:bg-catppuccin-mauve/10 cursor-pointer z-10">copy</button>
                <pre class="bg-catppuccin-surface/50 border border-catppuccin-overlay/30 rounded p-4 overflow-x-auto my-4"><code id="${id}" class="${languageClass}">${escaped}</code></pre>
            </div>`;
        },
        codespan({ text }) {
            return `<code class="bg-catppuccin-surface/50 px-2 py-0.5 rounded text-catppuccin-pink text-sm">${text}</code>`;
        },
        blockquote({ tokens }) {
            const body = this.parser.parse(tokens);
            return `<blockquote class="border-l-2 border-catppuccin-mauve pl-4 my-4 text-catppuccin-subtle italic">${body}</blockquote>`;
        },
        list({ items, ordered }) {
            const tag = ordered ? "ol" : "ul";
            const listClass = ordered ? "list-decimal" : "list-disc";
            const inner = items.map(item => {
                const text = this.parser.parse(item.tokens);
                return `<li class="ml-6 ${listClass} text-catppuccin-text mb-1">${text}</li>`;
            }).join("");
            return `<${tag} class="my-4">${inner}</${tag}>`;
        },
        table({ header, rows }) {
            let html = '<table class="w-full my-4 text-sm border-collapse"><thead><tr>';
            header.forEach(cell => {
                const text = this.parser.parseInline(cell.tokens);
                html += `<th class="border border-catppuccin-surface px-3 py-2 text-left text-catppuccin-mauve bg-catppuccin-surface/30">${text}</th>`;
            });
            html += '</tr></thead><tbody>';
            rows.forEach(row => {
                html += '<tr>';
                row.forEach(cell => {
                    const text = this.parser.parseInline(cell.tokens);
                    html += `<td class="border border-catppuccin-surface px-3 py-2 text-catppuccin-text">${text}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table>';
            return html;
        },
        hr() {
            return '<hr class="border-catppuccin-surface my-6">';
        },
        strong({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<strong class="text-catppuccin-mauve font-semibold">${text}</strong>`;
        },
        em({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<em class="text-catppuccin-peach italic">${text}</em>`;
        },
    },
});

const renderMarkdown = (content) => {
    codeBlockCounter = 0;
    return marked.parse(content);
};
```

- [ ] **Step 5.3: Update the template to use renderMarkdown**

In the template, change line 559:

```html
<!-- FROM -->
v-html="parseMarkdown(currentPost.content)"

<!-- TO -->
v-html="renderMarkdown(currentPost.content)"
```

- [ ] **Step 5.4: Verify and commit**

Run: `bun run build`

Manual test: Open each blog post and verify rendering matches expected output (headings, code blocks, links, tables, blockquotes, lists, images).

```bash
git add package.json bun.lockb src/pages/Blog.vue
git commit -m "refactor: replace custom markdown parser with marked library"
```

---

## Chunk 3: New Features

### Task 6: Add Reading Progress Bar to Blog

**Files:**
- Modify: `src/pages/Blog.vue`

- [ ] **Step 6.1: Add scroll tracking logic**

In Blog.vue `<script setup>`, add after the existing refs:

```javascript
const readingProgress = ref(0);
let rafId = null;

const updateReadingProgress = () => {
    rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        readingProgress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    });
};
```

In the existing `watch` for `route.query.post`, when a post is opened, add scroll listener. Update the `openPost` function to attach the listener:

Add to `onMounted`:

```javascript
window.addEventListener("scroll", updateReadingProgress, { passive: true });
```

Add to `onBeforeUnmount`:

```javascript
window.removeEventListener("scroll", updateReadingProgress);
if (rafId) cancelAnimationFrame(rafId);
```

- [ ] **Step 6.2: Add progress bar to template**

Add the progress bar using `Teleport` to body (avoids `transform: scale(0.9)` in App.vue breaking `fixed` positioning, and avoids multi-root fragment issues with AnimatePresence):

```html
<template>
    <!-- Reading progress bar (teleported outside #app to avoid transform context) -->
    <Teleport to="body">
        <div
            v-if="view === 'post' && currentPost"
            class="fixed top-0 left-0 w-full h-[3px] z-[9998]"
        >
            <div
                class="h-full bg-catppuccin-mauve"
                :style="{ width: readingProgress + '%', transition: 'width 0.1s ease-out' }"
            ></div>
        </div>
    </Teleport>

    <div class="w-full min-h-screen overflow-x-hidden overflow-y-auto font-mono">
        <!-- ... rest of template ... -->
    </div>
</template>
```

- [ ] **Step 6.3: Verify and commit**

Run: `bun run build`

Manual test: Open a blog post, scroll, verify bar moves smoothly from 0% to 100%.

```bash
git add src/pages/Blog.vue
git commit -m "feat: add reading progress bar to blog post view"
```

---

### Task 7: Create Projects Page

**Files:**
- Create: `src/pages/Projects.vue`
- Modify: `src/router/index.js`

- [ ] **Step 7.1: Create Projects.vue**

Create `src/pages/Projects.vue`:

```vue
<script setup>
import { ref, computed, onMounted } from "vue";
import { motion } from "motion-v";
import { getAllReposWithLanguages } from "@/services/githubService";
import {
    springs,
    staggerContainer,
    fadeUp,
    fadeLeft,
    scaleFade,
    cardHover,
    cardPress,
} from "@/utils/motion";

const repos = ref([]);
const loading = ref(true);
const activeLanguage = ref(null);

const pinnedSlugs = ["lostf1sh.github.io", "PixelPlayer"];
const pinnedExternal = ["theovilardo/PixelPlayer"];

const fetchRepos = async () => {
    try {
        loading.value = true;
        const [{ repos: ownRepos }, ...pinnedResults] = await Promise.all([
            getAllReposWithLanguages(),
            ...pinnedExternal.map((r) =>
                fetch(`https://api.github.com/repos/${r}`)
                    .then((res) => (res.ok ? res.json() : null))
                    .catch(() => null),
            ),
        ]);
        const pinned = pinnedResults.filter(Boolean);
        repos.value = [...pinned, ...ownRepos];
    } catch {
        repos.value = [];
    } finally {
        loading.value = false;
    }
};

const languages = computed(() => {
    const counts = {};
    repos.value.forEach((r) => {
        if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([lang, count]) => ({ lang, count }));
});

const pinnedRepos = computed(() =>
    repos.value.filter((r) => pinnedSlugs.includes(r.name)),
);

const filteredRepos = computed(() => {
    let list = repos.value
        .filter((r) => !pinnedSlugs.includes(r.name))
        .sort((a, b) => b.stargazers_count - a.stargazers_count);

    if (activeLanguage.value) {
        list = list.filter((r) => r.language === activeLanguage.value);
    }
    return list;
});

const toggleLanguage = (lang) => {
    activeLanguage.value = activeLanguage.value === lang ? null : lang;
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

onMounted(fetchRepos);

const headerContainer = staggerContainer(0.06);
const repoContainer = staggerContainer(0.04);

const langColors = {
    JavaScript: "text-catppuccin-yellow",
    TypeScript: "text-catppuccin-blue",
    Python: "text-catppuccin-green",
    Dart: "text-catppuccin-blue",
    Rust: "text-catppuccin-peach",
    Vue: "text-catppuccin-green",
    HTML: "text-catppuccin-red",
    CSS: "text-catppuccin-mauve",
    Shell: "text-catppuccin-green",
};
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Header -->
            <motion.div
                class="mb-12"
                :variants="headerContainer"
                initial="hidden"
                animate="visible"
            >
                <motion.div :variants="fadeUp" class="text-catppuccin-subtle text-sm mb-2">
                    ~$ ls ~/projects
                </motion.div>
                <motion.h1
                    :variants="fadeUp"
                    class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"
                >
                    <span class="text-catppuccin-mauve">projects</span>
                </motion.h1>
                <motion.p :variants="fadeUp" class="text-sm text-catppuccin-gray leading-relaxed mb-6">
                    open source projects and experiments.
                </motion.p>

                <motion.div :variants="fadeUp" class="flex items-center gap-4 text-sm mb-6">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                    >
                        [← home]
                    </router-link>
                </motion.div>

                <!-- Language filters -->
                <motion.div
                    v-if="!loading && languages.length"
                    :variants="fadeUp"
                    class="flex flex-wrap gap-2"
                >
                    <button
                        v-for="{ lang, count } in languages"
                        :key="lang"
                        @click="toggleLanguage(lang)"
                        class="px-2 py-0.5 rounded text-xs border transition-colors cursor-pointer"
                        :class="activeLanguage === lang
                            ? 'bg-catppuccin-mauve/20 border-catppuccin-mauve text-catppuccin-mauve'
                            : 'bg-catppuccin-surface/30 border-catppuccin-surface text-catppuccin-subtle hover:text-catppuccin-text hover:border-catppuccin-overlay'"
                    >
                        {{ lang }} ({{ count }})
                    </button>
                </motion.div>
            </motion.div>

            <!-- Loading -->
            <div v-if="loading" class="text-sm text-catppuccin-subtle">
                loading repositories...
            </div>

            <template v-else>
                <!-- Pinned -->
                <div v-if="pinnedRepos.length && !activeLanguage" class="mb-8">
                    <motion.div
                        :variants="fadeLeft"
                        class="border-l-2 border-catppuccin-surface pl-4"
                    >
                        <div class="text-catppuccin-subtle text-sm mb-3">
                            ~$ cat pinned.txt
                        </div>
                        <motion.div
                            :variants="repoContainer"
                            initial="hidden"
                            animate="visible"
                            class="grid md:grid-cols-2 gap-3"
                        >
                            <motion.a
                                v-for="repo in pinnedRepos"
                                :key="repo.id"
                                :href="repo.html_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                :variants="scaleFade"
                                :whileHover="cardHover"
                                :whilePress="cardPress"
                                class="block group rounded-md border border-catppuccin-mauve/30 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/60"
                            >
                                <div class="px-4 py-3">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-catppuccin-mauve text-xs">★</span>
                                        <span class="text-catppuccin-text font-medium group-hover:text-catppuccin-mauve transition-colors">
                                            {{ repo.name }}
                                        </span>
                                        <span v-if="repo.stargazers_count > 0" class="text-catppuccin-yellow text-xs ml-auto">
                                            ★{{ repo.stargazers_count }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-catppuccin-gray mb-2">
                                        {{ repo.description || "no description" }}
                                    </p>
                                    <div class="flex items-center gap-3 text-xs">
                                        <span v-if="repo.language" :class="langColors[repo.language] || 'text-catppuccin-subtle'">
                                            {{ repo.language }}
                                        </span>
                                        <span v-if="repo.forks_count > 0" class="text-catppuccin-subtle">
                                            ⑂ {{ repo.forks_count }}
                                        </span>
                                        <span class="text-catppuccin-subtle ml-auto">
                                            {{ formatDate(repo.updated_at) }}
                                        </span>
                                    </div>
                                </div>
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>

                <!-- All repos -->
                <motion.div
                    :variants="fadeLeft"
                    class="border-l-2 border-catppuccin-surface pl-4"
                >
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ find ~/projects -type d {{ activeLanguage ? `| grep ${activeLanguage}` : '' }}
                    </div>

                    <div v-if="!filteredRepos.length" class="text-sm text-catppuccin-subtle">
                        no projects found{{ activeLanguage ? ` for ${activeLanguage}` : '' }}
                    </div>

                    <motion.div
                        v-else
                        :variants="repoContainer"
                        initial="hidden"
                        animate="visible"
                        class="space-y-2"
                    >
                        <motion.a
                            v-for="repo in filteredRepos"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="scaleFade"
                            :whileHover="cardHover"
                            :whilePress="cardPress"
                            class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"
                        >
                            <div class="flex items-start gap-3 text-sm px-3 py-2">
                                <span class="text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors">></span>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors font-medium truncate">
                                            {{ repo.name }}
                                        </span>
                                        <span v-if="repo.stargazers_count > 0" class="text-catppuccin-yellow text-xs flex-shrink-0">
                                            ★{{ repo.stargazers_count }}
                                        </span>
                                        <span v-if="repo.language" :class="langColors[repo.language] || 'text-catppuccin-subtle'" class="text-xs flex-shrink-0 ml-auto">
                                            {{ repo.language }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-catppuccin-gray truncate">
                                        {{ repo.description || "no description" }}
                                    </p>
                                </div>
                            </div>
                        </motion.a>
                    </motion.div>
                </motion.div>
            </template>
        </div>
    </div>
</template>
```

- [ ] **Step 7.2: Add route to router**

In `src/router/index.js`, add the projects route before the NotFound catch-all:

```javascript
{
    path: "/projects",
    name: "Projects",
    component: () => import("@/pages/Projects.vue"),
    meta: {
        title: "Projects | f1sh.dev",
        description: "Open source projects and experiments by duhan.",
    },
},
```

- [ ] **Step 7.3: Verify and commit**

Run: `bun run build`

Manual test: Navigate to `/projects`, verify repos load, language filters work, pinned projects show at top.

```bash
git add src/pages/Projects.vue src/router/index.js
git commit -m "feat: add /projects page with language filtering and pinned repos"
```

---

### Task 8: Add Boot Sequence Animation

**Files:**
- Create: `src/components/BootSequence.vue`
- Modify: `src/App.vue`

- [ ] **Step 8.1: Create BootSequence.vue**

Create `src/components/BootSequence.vue`:

```vue
<script setup>
import { ref, onMounted } from "vue";

const show = ref(false);
const done = ref(false);

onMounted(() => {
    if (sessionStorage.getItem("booted")) {
        done.value = true;
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        sessionStorage.setItem("booted", "true");
        done.value = true;
        return;
    }

    show.value = true;

    setTimeout(() => {
        show.value = false;
        sessionStorage.setItem("booted", "true");
        setTimeout(() => {
            done.value = true;
        }, 400);
    }, 2500);
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="!done"
            class="fixed inset-0 z-[9999] flex items-center justify-center font-mono transition-opacity duration-400"
            :class="show ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            :style="{ backgroundColor: 'rgb(var(--color-crust))' }"
        >
            <div class="text-sm space-y-1 px-6 max-w-md w-full">
                <div class="boot-line" style="animation-delay: 0s">
                    <span class="text-catppuccin-blue">[BIOS]</span>
                    <span class="text-catppuccin-text"> f1sh.dev v2.0</span>
                </div>
                <div class="boot-line" style="animation-delay: 0.3s">
                    <span class="text-catppuccin-yellow">[INIT]</span>
                    <span class="text-catppuccin-subtle"> loading kernel modules...</span>
                </div>
                <div class="boot-line" style="animation-delay: 0.6s">
                    <span class="text-catppuccin-green">[OK]</span>
                    <span class="text-catppuccin-text">   catppuccin.theme</span>
                </div>
                <div class="boot-line" style="animation-delay: 0.9s">
                    <span class="text-catppuccin-green">[OK]</span>
                    <span class="text-catppuccin-text">   vue@3.x</span>
                </div>
                <div class="boot-line" style="animation-delay: 1.2s">
                    <span class="text-catppuccin-green">[OK]</span>
                    <span class="text-catppuccin-text">   motion-v initialized</span>
                </div>
                <div class="boot-line" style="animation-delay: 1.5s">
                    <div class="boot-progress h-3 rounded overflow-hidden bg-catppuccin-surface/50 mt-1">
                        <div class="h-full bg-catppuccin-mauve boot-progress-fill"></div>
                    </div>
                </div>
                <div class="boot-line" style="animation-delay: 2.1s">
                    <span class="text-catppuccin-mauve">[READY]</span>
                    <span class="text-catppuccin-text"> welcome, visitor.</span>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.boot-line {
    opacity: 0;
    animation: boot-appear 0.15s ease-out forwards;
}

@keyframes boot-appear {
    from {
        opacity: 0;
        transform: translateY(4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.boot-progress-fill {
    width: 0%;
    animation: boot-fill 0.5s ease-out 1.6s forwards;
}

@keyframes boot-fill {
    from { width: 0%; }
    to { width: 100%; }
}
</style>
```

- [ ] **Step 8.2: Add BootSequence to App.vue**

In `src/App.vue`, import and add the component:

Add import:
```javascript
import BootSequence from "@/components/BootSequence.vue";
```

Add to template (before `<ThemeToggle />`):
```html
<BootSequence />
<ThemeToggle />
```

- [ ] **Step 8.3: Verify and commit**

Run: `bun run build`

Manual test:
1. Clear sessionStorage, refresh — should see boot sequence
2. Refresh again — should skip directly to content
3. Open new tab — should show boot sequence again

```bash
git add src/components/BootSequence.vue src/App.vue
git commit -m "feat: add terminal boot sequence animation on first visit"
```

---

### Task 9: Add Matrix Rain Background

**Files:**
- Create: `src/components/MatrixRain.vue`
- Modify: `src/pages/Home.vue`

- [ ] **Step 9.1: Create MatrixRain.vue**

Create `src/components/MatrixRain.vue`:

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvas = ref(null);
let animationId = null;
let columns = [];
let ctx = null;
let width = 0;
let height = 0;
let lastTime = 0;
const FPS_INTERVAL = 1000 / 30;

const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 14;

let cachedGreenColor = null;
let cachedBaseColor = null;

const updateCachedColors = () => {
    const style = getComputedStyle(document.documentElement);
    cachedGreenColor = style.getPropertyValue("--color-green").trim() || "166 227 161";
    cachedBaseColor = style.getPropertyValue("--color-base").trim() || "30 30 46";
};

// Watch for theme changes
const themeObserver = new MutationObserver(() => updateCachedColors());

const init = () => {
    if (!canvas.value) return;
    ctx = canvas.value.getContext("2d");
    resize();
};

const resize = () => {
    if (!canvas.value) return;
    width = canvas.value.parentElement.offsetWidth;
    height = canvas.value.parentElement.offsetHeight;
    canvas.value.width = width;
    canvas.value.height = height;

    const colCount = Math.floor(width / fontSize);
    columns = Array.from({ length: colCount }, () => ({
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.7,
    }));
};

const draw = (timestamp) => {
    animationId = requestAnimationFrame(draw);

    const elapsed = timestamp - lastTime;
    if (elapsed < FPS_INTERVAL) return;
    lastTime = timestamp - (elapsed % FPS_INTERVAL);

    if (!ctx) return;

    const baseRgb = cachedBaseColor || "30 30 46";
    ctx.fillStyle = `rgba(${baseRgb.replace(/ /g, ", ")}, 0.05)`;
    ctx.fillRect(0, 0, width, height);

    const rgb = cachedGreenColor || "166 227 161";
    ctx.fillStyle = `rgba(${rgb.replace(/ /g, ", ")}, 0.07)`;
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    columns.forEach((col, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        ctx.fillText(char, x, col.y);

        col.y += fontSize * col.speed;

        if (col.y > height && Math.random() > 0.98) {
            col.y = 0;
            col.speed = 0.3 + Math.random() * 0.7;
        }
    });
};

const start = () => {
    lastTime = 0;
    animationId = requestAnimationFrame(draw);
};

let resizeTimeout = null;
const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
};

onMounted(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    updateCachedColors();
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    init();
    start();
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId);
    themeObserver.disconnect();
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimeout);
});
</script>

<template>
    <canvas
        ref="canvas"
        class="absolute inset-0 w-full h-full pointer-events-none"
        style="z-index: 0;"
    />
</template>
```

- [ ] **Step 9.2: Add MatrixRain to Home.vue**

In `src/pages/Home.vue`, import and add the component:

Add import:
```javascript
import MatrixRain from "@/components/MatrixRain.vue";
```

Wrap the outermost template div to be `relative` and add MatrixRain:

```html
<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono relative">
        <MatrixRain />
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative" style="z-index: 1;">
            <!-- ... rest of content ... -->
        </div>
    </div>
</template>
```

- [ ] **Step 9.3: Verify and commit**

Run: `bun run build`

Manual test: Verify faint green characters fall behind content on home page. Toggle theme — colors should adapt. Check `prefers-reduced-motion` disables animation.

```bash
git add src/components/MatrixRain.vue src/pages/Home.vue
git commit -m "feat: add matrix rain background effect to home page"
```

---

## Final Verification

- [ ] **Run full build**

```bash
bun run build
```

- [ ] **Manual testing checklist**

1. Theme toggle: dark ↔ light, persists on refresh
2. Boot sequence: shows once per session, respects reduced-motion
3. Matrix rain: visible behind home content, theme-aware
4. Projects page: `/projects` loads, filters work, pinned repos show
5. Blog progress bar: appears in post view, tracks scroll accurately
6. Home page: all sections render with child components
7. Blog: markdown rendering correct for all posts
8. Mobile: all pages responsive
9. No console errors in production build
