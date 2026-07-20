<script setup>
import { motion } from "motion-v";
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import { staggerContainer, fadeUp } from "@/utils/motion";

const groups = [
    {
        title: "stack",
        rows: [
            ["vue 3 + vite", "a single-page app with history-mode routing"],
            ["tailwind", "utility styling over css-variable theming"],
            ["cloudflare pages", "static hosting plus edge functions"],
            ["bun", "package manager and build scripts"],
        ],
    },
    {
        title: "living data",
        rows: [
            ["lanyard", "discord + spotify presence over a websocket"],
            ["the accent", "recolors to whatever album art is playing — and settles into a soft gray for black & white covers"],
            ["github", "repos, the contribution graph, recent pushes"],
            ["last.fm", "what's on repeat this week"],
        ],
    },
    {
        title: "at the edge",
        rows: [
            ["satori + resvg", "1200×630 link-preview cards rendered at build time"],
            ["htmlrewriter", "per-post preview meta, injected at the edge"],
            ["workers kv", "view counts"],
        ],
    },
    {
        title: "craft",
        rows: [
            ["motion-v", "animation, all of it honoring prefers-reduced-motion"],
            ["oklch", "perceptual color math behind the living accent"],
            ["view transitions", "the soft cross-fade between pages"],
            ["⌘k", "command palette · custom cursor · the aquarium below"],
        ],
    },
];

const container = staggerContainer(0.06);
</script>

<template>
    <div class="w-full min-h-[100dvh]">
        <div class="max-w-2xl mx-auto px-6 pt-12 pb-16">
            <SiteNav />

            <motion.main :variants="container" initial="hidden" animate="visible" class="mt-12">
                <motion.h1 :variants="fadeUp" class="text-3xl md:text-4xl font-medium tracking-tight text-ink-text">
                    colophon
                </motion.h1>
                <motion.p :variants="fadeUp" class="mt-2 text-ink-subtle">
                    how this site is put together.
                </motion.p>

                <motion.section
                    v-for="group in groups"
                    :key="group.title"
                    :variants="fadeUp"
                    class="mt-12"
                >
                    <h2 class="text-ink-text font-medium mb-3">{{ group.title }}</h2>
                    <dl class="space-y-3">
                        <div v-for="[term, desc] in group.rows" :key="term" class="colophon-row">
                            <dt class="text-sm text-ink-text">{{ term }}</dt>
                            <dd class="text-sm text-ink-subtle leading-relaxed">{{ desc }}</dd>
                        </div>
                    </dl>
                </motion.section>

                <motion.p :variants="fadeUp" class="mt-12 text-sm text-ink-subtle leading-relaxed">
                    the whole thing is open source —
                    <a
                        href="https://github.com/lostf1sh/lostf1sh.github.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="colophon-link"
                    >read the source on github</a>.
                </motion.p>
            </motion.main>

            <SiteFooter />
        </div>
    </div>
</template>

<style scoped>
.colophon-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.15rem;
}

@media (min-width: 640px) {
    .colophon-row {
        grid-template-columns: 9.5rem 1fr;
        gap: 1.25rem;
        align-items: baseline;
    }
}

.colophon-link {
    color: rgb(var(--color-text) / 0.8);
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: rgb(var(--color-surface));
    transition: color 0.15s ease;
}

.colophon-link:hover,
.colophon-link:focus-visible {
    color: rgb(var(--color-mint));
}
</style>
