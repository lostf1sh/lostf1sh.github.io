# f1sh.dev Codebase Improvements & New Features

**Date:** 2026-03-14
**Status:** Approved

---

## Scope

9 changes across bug fixes, refactoring, new features, and design enhancements for f1sh.dev (Vue 3 + Tailwind + Vite personal site with terminal aesthetic).

---

## 1. Bug Fix: Duplicate Event Listener in Blog.vue

**Problem:** `handleCopyClick` listener is added in both `onMounted` and `watch(articleContentRef)`, causing duplicate event handlers.

**Fix:** Remove the `addEventListener` call inside `onMounted` (lines 330-332). Keep only the `watch` handler (lines 348-352), which correctly fires when the ref is assigned/changed. Ensure `onBeforeUnmount` cleanup (lines 343-345) still removes the listener properly. The `watch` should use a cleanup callback to handle ref changes.

**Files:** `src/pages/Blog.vue`

---

## 2. Refactor: Home.vue Component Decomposition

**Problem:** Home.vue is 772 lines — handles API calls, animations, calculations, and rendering in one file.

**Approach:** Extract into focused components. Home.vue becomes an orchestrator that fetches data and passes props.

**New components:**
- `src/components/StatusSection.vue` — Discord presence, Spotify track, editor activity display (includes `editorStatus` computed logic for Zed/VSCode parsing)
- `src/components/ProjectsGrid.vue` — Repository cards grid with stars/language/description
- `src/components/RecentTracks.vue` — Last.fm recent tracks list with play counts
- `src/components/ContributionGraph.vue` — GitHub contribution heatmap (53 weeks)

**Stays in Home.vue:** Hero area (name, bio, navigation links), about section, tools section. These are unique to the home page and tightly coupled to the page layout.

**Note:** `src/components/` directory does not exist yet — must be created.

**Data flow:** Home.vue owns all reactive state and API calls. Child components receive data via props and emit events if needed. Animation presets remain in `utils/motion.js`.

**Files:** `src/pages/Home.vue`, `src/components/StatusSection.vue`, `src/components/ProjectsGrid.vue`, `src/components/RecentTracks.vue`, `src/components/ContributionGraph.vue`

---

## 3. Refactor: Replace Custom Markdown Parser with marked

**Problem:** Blog.vue contains 160+ lines of regex-based markdown parsing. Fragile, hard to maintain, and missing edge cases.

**Approach:**
- Install `marked` as production dependency
- Configure marked renderer to match current styling (Tailwind classes, Catppuccin colors)
- Integrate with existing PrismJS for syntax highlighting via marked's `highlight` option
- Remove the entire `parseMarkdown()` function (lines 152-315) and its helpers (`escapeHtml` lines 94-101, `sanitizeExternalUrl` lines 103-109)
- **Note:** `marked` does NOT sanitize raw HTML by default — it passes HTML through. Since blog posts are self-authored .md files (not user-generated content), this is acceptable. No additional sanitization library needed.

**Files:** `src/pages/Blog.vue`, `package.json`

---

## 4. Feature: Reading Progress Bar

**Location:** Blog post detail view only (not list view).

**Implementation:**
- Fixed position bar at the very top of the viewport, 3px height
- **Note:** `App.vue` applies `transform: scale(0.9)` to `#app` on desktop — fixed positioning inside a transformed parent may not work as expected. The progress bar should be rendered outside `#app` or use `position: sticky` instead.
- Color: Catppuccin `mauve` (theme-aware via CSS variable)
- Width calculated as `(scrollY / (documentHeight - viewportHeight)) * 100%`
- Uses `scroll` event with `requestAnimationFrame` for throttling
- Appears only when `currentPost` is set (detail view)
- Smooth width transition via CSS `transition: width 0.1s`

**Files:** `src/pages/Blog.vue`

---

## 5. Feature: Projects Page (`/projects`)

**Route:** `/projects` mapped to `src/pages/Projects.vue`

**Data source:** GitHub API (reuse existing `githubService.js`)

**Layout:**
- Header: "~/projects" terminal-style heading
- Pinned section: Featured projects at top (hardcoded slug list in component, fetched from API)
- All projects grid below
- Language filter: clickable badges that toggle filtering
- Each card shows: name, description, stars, forks, primary language (color dot + name), last updated date
- External link to GitHub repo

**Changes to Home.vue:** Reduce project grid from current 6 (`.slice(0, 6)` at line 132) to top 4, add "see all ~/projects" link.

**SEO:** Add projects route with meta tags to `src/router/index.js` (per-page SEO meta is defined in route meta objects, not in `seo.js` which is just a utility function).

**Files:** `src/pages/Projects.vue`, `src/router/index.js`, `src/pages/Home.vue`

---

## 6. Feature: Boot Sequence Animation

**Trigger:** First page load only. Controlled via `sessionStorage.setItem('booted', 'true')`.

**Duration:** ~2.5 seconds total.

**Sequence (lines appear with staggered delay):**
```
[BIOS] f1sh.dev v2.0
[INIT] loading kernel modules...
[OK]   catppuccin-mocha.theme
[OK]   vue@3.x
[OK]   motion-v initialized
[████████████████████] 100%
[READY] welcome, visitor.
```

**Implementation:**
- Overlay component (`src/components/BootSequence.vue`) rendered in `App.vue`
- CSS-only animations: each line uses `animation-delay` for stagger
- Progress bar fills via CSS `@keyframes`
- After sequence completes, overlay fades out and is removed from DOM
- If `sessionStorage.getItem('booted')` exists, component renders nothing
- Respects `prefers-reduced-motion`: skips animation, shows content immediately

**Files:** `src/components/BootSequence.vue`, `src/App.vue`

---

## 7. Feature: Matrix Rain Background

**Location:** Home page background, behind all content.

**Implementation:**
- Canvas element positioned absolute, behind content (`z-index: 0`, content at `z-index: 1`)
- Characters: Katakana (U+30A0-U+30FF), Latin uppercase, digits
- Column-based rain: each column drops characters independently at random speeds
- Color: Catppuccin `green` via CSS variable `var(--color-green)` at 6-8% opacity (theme-aware, since theme system is implemented first)
- Font: 14px JetBrains Mono
- Animation: `requestAnimationFrame` loop, ~30fps cap for performance
- Canvas resizes on window resize (debounced)
- `prefers-reduced-motion`: disables animation, shows static faint grid instead
- Component: `src/components/MatrixRain.vue` with canvas ref

**Files:** `src/components/MatrixRain.vue`, `src/pages/Home.vue`

---

## 8. Cleanup: Remove Noto Sans JP

**Problem:** Noto Sans JP is imported in CSS but never used anywhere. Wastes a network request.

**Fix:** Edit the Google Fonts URL in both `src/assets/main.css` and `index.html` (line 53) to remove the `&family=Noto+Sans+JP:wght@400;500` parameter while keeping the JetBrains Mono portion intact. Both files share the same bundled Google Fonts URL.

**Files:** `src/assets/main.css`, `index.html`

---

## 9. Feature: Catppuccin Latte Theme + Toggle

**Approach:** CSS custom properties for all theme colors, toggled via `data-theme` attribute on `<html>`.

**Color system:**
- Define CSS variables for all Catppuccin colors: `--color-base`, `--color-surface`, `--color-text`, `--color-mauve`, etc.
- Two sets: Mocha (dark, default) and Latte (light)
- Tailwind config updated to reference CSS variables instead of hardcoded hex values

**Toggle button:**
- Location: Top-right corner of the page (or within the header/nav area)
- Icon: Sun (light mode active) / Moon (dark mode active)
- Monospace/terminal styled, consistent with site aesthetic
- Smooth color transition on toggle (`transition: background-color 0.3s, color 0.3s` on root)

**Persistence:** `localStorage.setItem('theme', 'light'|'dark')`. Default: `dark`.

**No OS detection** (user chose Latte + Toggle, not auto-detect).

**Migration:** All hardcoded Catppuccin color classes (e.g., `bg-crust`, `text-mauve`) must be converted to use CSS variables so they respond to theme changes. This is the largest change in scope.

**Key locations with hardcoded values:**
- `src/assets/main.css` line 20: hardcoded `background-color: #1e1e2e`
- `src/App.vue` lines 50-64: hardcoded hex values in scrollbar styles
- `index.html` line 56: `<meta name="theme-color" content="#11111b">` — must be toggled dynamically via JS
- `index.html` body classes: `bg-catppuccin-crust text-catppuccin-text` — must use CSS variable-backed classes

**Note:** `src/assets/base.css` currently only contains Tailwind directives (`@tailwind base/components/utilities`). The CSS custom property definitions will be new content added here.

**Files:** `src/assets/base.css`, `src/assets/main.css`, `tailwind.config.js`, `index.html`, `src/App.vue`, `src/components/ThemeToggle.vue`, all component files referencing theme colors

---

## Implementation Order

Dependencies suggest this order:
1. **Noto Sans JP removal** (trivial, no dependencies)
2. **Duplicate listener fix** (trivial bug fix)
3. **Theme system** (must come before other UI work, since all components need CSS variable migration)
4. **Home.vue decomposition** (structural, enables cleaner work on other features)
5. **Markdown library swap** (independent)
6. **Reading progress bar** (independent)
7. **Projects page** (depends on decomposed Home.vue for consistency)
8. **Boot sequence** (independent, App.vue level)
9. **Matrix rain** (independent, Home.vue level)

---

## Testing Strategy

- Manual browser testing for all visual changes
- Verify theme toggle persists across page loads
- Verify boot sequence shows only on first visit (clear sessionStorage to re-test)
- Verify matrix rain respects prefers-reduced-motion
- Verify markdown rendering matches current output for all 15 blog posts
- Verify reading progress bar accuracy at 0%, 50%, 100% scroll positions
- Verify projects page filters work correctly
- Test on mobile viewport sizes
