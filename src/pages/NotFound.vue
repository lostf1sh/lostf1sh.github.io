<template>
    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <motion.div
                class="mb-12"
                :initial="{ opacity: 0, y: 15 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="springs.gentle"
            >
                <SiteNav class="mb-8" />

                <h1
                    class="font-serif text-6xl md:text-7xl font-semibold text-catppuccin-text/10 tracking-tight mb-4 select-none"
                >
                    404
                </h1>

                <p class="text-sm text-catppuccin-subtle mb-2">
                    the page you're looking for doesn't exist
                </p>
                <p class="text-xs text-catppuccin-subtle/50 mb-10">
                    maybe it moved, maybe it never existed — such is the way of things
                </p>

                <p class="mb-10 max-w-lg text-sm italic text-catppuccin-subtle/70">
                    "{{ quote }}"
                </p>

                <div class="hr-zen mb-10"></div>

                <div class="space-y-2 text-sm">
                    <router-link
                        to="/"
                        class="group flex items-center gap-3 py-2 hover-lift"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">home</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">homepage</span>
                    </router-link>
                    <router-link
                        to="/blog"
                        class="group flex items-center gap-3 py-2 hover-lift"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">blog</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">writing</span>
                    </router-link>
                    <router-link
                        to="/projects"
                        class="group flex items-center gap-3 py-2 hover-lift"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">projects</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">open source work</span>
                    </router-link>
                    <router-link
                        to="/now"
                        class="group flex items-center gap-3 py-2 hover-lift"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">now</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">current focus</span>
                    </router-link>
                    <a
                        href="https://github.com/lostf1sh"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group flex items-center gap-3 py-2 hover-lift"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">github</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">lostf1sh</span>
                    </a>
                </div>
            </motion.div>

            <SiteFooter />
        </div>
    </div>
</template>

<script setup>
import { motion } from "motion-v";
import { springs } from "@/utils/motion";
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";

const quotes = [
    "Not all who wander are lost. Some routes just 404.",
    "Empty paths can still be beautiful.",
    "The map ends here, but the site does not.",
    "A missing page is still part of the story.",
    "Even broken links can point somewhere inward.",
];

const quote = quotes[Math.floor(Math.random() * quotes.length)];
</script>
