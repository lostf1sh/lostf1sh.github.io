<template>
    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <motion.div
                class="mb-12"
                :initial="{ opacity: 0, y: 15 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="springs.gentle"
            >
                <router-link
                    to="/"
                    class="text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors mb-8 block"
                >
                    ← home
                </router-link>

                <h1
                    class="font-serif text-6xl md:text-7xl font-semibold text-catppuccin-text/20 tracking-tight mb-4"
                >
                    404
                </h1>

                <p class="text-sm text-catppuccin-subtle mb-10">
                    the page you're looking for doesn't exist
                </p>

                <div class="hr-zen mb-10"></div>

                <div class="space-y-2 text-sm">
                    <router-link
                        to="/"
                        class="group flex items-center gap-3 py-2"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">home</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">homepage</span>
                    </router-link>
                    <router-link
                        to="/blog"
                        class="group flex items-center gap-3 py-2"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">blog</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">writing</span>
                    </router-link>
                    <router-link
                        to="/projects"
                        class="group flex items-center gap-3 py-2"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">projects</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">open source work</span>
                    </router-link>
                    <router-link
                        to="/now"
                        class="group flex items-center gap-3 py-2"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">now</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">current focus</span>
                    </router-link>
                    <a
                        href="https://github.com/lostf1sh"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group flex items-center gap-3 py-2"
                    >
                        <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors">github</span>
                        <span class="text-catppuccin-subtle/40">—</span>
                        <span class="text-catppuccin-subtle">lostf1sh</span>
                    </a>
                </div>
            </motion.div>
        </div>
    </div>
</template>

<script setup>
import { motion } from "motion-v";
import { springs } from "@/utils/motion";
</script>
