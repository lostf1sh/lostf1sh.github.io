<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    fadeUp,
} from "@/utils/motion";

const headerContainer = staggerContainer(0.06);
const sectionContainer = staggerContainer(0.04);
</script>

<template>
    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <!-- Page header -->
            <motion.div
                class="mb-12"
                :variants="headerContainer"
                initial="hidden"
                animate="visible"
            >
                <motion.div :variants="fadeUp" class="mb-2">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors"
                    >
                        ← home
                    </router-link>
                </motion.div>

                <motion.h1
                    :variants="fadeUp"
                    class="font-serif text-3xl md:text-4xl font-semibold text-catppuccin-text tracking-tight mb-2"
                >
                    uses
                </motion.h1>

                <motion.p :variants="fadeUp" class="text-sm text-catppuccin-subtle">
                    tools, hardware, and software i use daily
                </motion.p>
            </motion.div>

            <div class="grid md:grid-cols-2 gap-10">
                <!-- Code editors -->
                <motion.div
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeUp" class="section-label mb-3">editors</motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">zed</span>
                            <span class="text-catppuccin-subtle">primary editor</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">android studio</span>
                            <span class="text-catppuccin-subtle">mobile dev</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">claude code</span>
                            <span class="text-catppuccin-subtle">ai coding</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">codex</span>
                            <span class="text-catppuccin-subtle">openai agent</span>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Terminal -->
                <motion.div
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeUp" class="section-label mb-3">terminal</motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">ghostty</span>
                            <span class="text-catppuccin-subtle">fast, native</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">zsh</span>
                            <span class="text-catppuccin-subtle">shell + plugins</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">tmux</span>
                            <span class="text-catppuccin-subtle">multiplexer</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">starship</span>
                            <span class="text-catppuccin-subtle">minimal prompt</span>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Dev tools -->
                <motion.div
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeUp" class="section-label mb-3">dev tools</motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">vue 3</span>
                            <span class="text-catppuccin-subtle">frontend</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">tailwind</span>
                            <span class="text-catppuccin-subtle">styling</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">bun</span>
                            <span class="text-catppuccin-subtle">runtime + package manager</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">vite</span>
                            <span class="text-catppuccin-subtle">build tool</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">docker</span>
                            <span class="text-catppuccin-subtle">containers</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">git</span>
                            <span class="text-catppuccin-subtle">version control</span>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Languages -->
                <motion.div
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeUp" class="section-label mb-3">languages</motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">javascript / typescript</span>
                            <span class="text-catppuccin-subtle">primary</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">python</span>
                            <span class="text-catppuccin-subtle">scripting</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">dart</span>
                            <span class="text-catppuccin-subtle">flutter</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">bash</span>
                            <span class="text-catppuccin-subtle">shell scripts</span>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- System -->
                <motion.div
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeUp" class="section-label mb-3">system</motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">cachyos</span>
                            <span class="text-catppuccin-subtle">arch-based, daily driver</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">catppuccin</span>
                            <span class="text-catppuccin-subtle">theme everywhere</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">jetbrains mono</span>
                            <span class="text-catppuccin-subtle">monospace font</span>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Apps -->
                <motion.div
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeUp" class="section-label mb-3">apps</motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">firefox</span>
                            <span class="text-catppuccin-subtle">browser</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">obsidian</span>
                            <span class="text-catppuccin-subtle">notes</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">spotify</span>
                            <span class="text-catppuccin-subtle">music</span>
                        </motion.div>
                        <motion.div :variants="fadeUp" class="flex items-start gap-3">
                            <span class="text-catppuccin-text font-medium">discord</span>
                            <span class="text-catppuccin-subtle">comms</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
</template>
