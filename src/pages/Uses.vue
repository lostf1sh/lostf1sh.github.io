<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    fadeUp,
    fadeLeft,
} from "@/utils/motion";

const headerContainer = staggerContainer(0.06);
const sectionContainer = staggerContainer(0.04);

const itemHover = { x: 4, transition: springs.snappy };
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Page header -->
            <motion.div
                class="mb-12"
                :variants="headerContainer"
                initial="hidden"
                animate="visible"
            >
                <motion.div :variants="fadeUp" class="text-catppuccin-subtle text-sm mb-2">
                    ~$ cat ~/uses.txt
                </motion.div>
                <motion.h1
                    :variants="fadeUp"
                    class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"
                >
                    <span class="text-catppuccin-mauve">uses</span>
                </motion.h1>
                <motion.p :variants="fadeUp" class="text-sm text-catppuccin-gray leading-relaxed mb-6">
                    tools, hardware, and software i use daily.
                </motion.p>

                <motion.div :variants="fadeUp" class="flex items-center gap-4 text-sm mb-6">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                    >
                        [← home]
                    </router-link>
                </motion.div>
            </motion.div>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Code editors -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeLeft" class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/code/
                    </motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">zed</span>
                                <span class="text-catppuccin-gray"> — primary editor, fast and minimal</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">android studio</span>
                                <span class="text-catppuccin-gray"> — mobile development</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">claude code</span>
                                <span class="text-catppuccin-gray"> — ai-assisted coding in terminal</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">codex</span>
                                <span class="text-catppuccin-gray"> — openai coding agent</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">t3 code</span>
                                <span class="text-catppuccin-gray"> — alpha / codex wrapper</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Terminal -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeLeft" class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/terminal/
                    </motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">ghostty</span>
                                <span class="text-catppuccin-gray"> — fast, native terminal</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">zsh + oh-my-zsh</span>
                                <span class="text-catppuccin-gray"> — shell with plugins</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">tmux</span>
                                <span class="text-catppuccin-gray"> — terminal multiplexer</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">starship</span>
                                <span class="text-catppuccin-gray"> — minimal prompt</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Dev tools -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeLeft" class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/dev-tools/
                    </motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">vue 3</span>
                                <span class="text-catppuccin-gray"> — frontend framework of choice</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">tailwind css</span>
                                <span class="text-catppuccin-gray"> — utility-first styling</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">bun</span>
                                <span class="text-catppuccin-gray"> — js runtime and package manager</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">vite</span>
                                <span class="text-catppuccin-gray"> — build tool</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">docker</span>
                                <span class="text-catppuccin-gray"> — containerization</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">git + github</span>
                                <span class="text-catppuccin-gray"> — version control</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Languages -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeLeft" class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/languages/
                    </motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">javascript / typescript</span>
                                <span class="text-catppuccin-gray"> — primary</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">python</span>
                                <span class="text-catppuccin-gray"> — scripting, automation</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">dart</span>
                                <span class="text-catppuccin-gray"> — flutter apps</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">bash</span>
                                <span class="text-catppuccin-gray"> — shell scripts</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- System -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeLeft" class="text-catppuccin-subtle text-sm mb-3">
                        ~$ uname -a
                    </motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-red">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">cachyos (arch linux)</span>
                                <span class="text-catppuccin-gray"> — daily driver</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-red">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">catppuccin mocha</span>
                                <span class="text-catppuccin-gray"> — theme everywhere</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-red">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">jetbrains mono</span>
                                <span class="text-catppuccin-gray"> — monospace font</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <!-- Apps -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    whileInView="visible"
                    initial="hidden"
                    :inViewOptions="{ once: true }"
                >
                    <motion.div :variants="fadeLeft" class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/apps/
                    </motion.div>
                    <div class="space-y-2 text-sm">
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">firefox</span>
                                <span class="text-catppuccin-gray"> — browser</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">obsidian</span>
                                <span class="text-catppuccin-gray"> — notes and knowledge base</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">spotify</span>
                                <span class="text-catppuccin-gray"> — music</span>
                            </div>
                        </motion.div>
                        <motion.div :variants="fadeUp" :whileHover="itemHover" class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">discord</span>
                                <span class="text-catppuccin-gray"> — comms</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
</template>
