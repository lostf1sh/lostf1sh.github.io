<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <div class="mb-12">
                <motion.div :variants="fadeUp" class="text-catppuccin-subtle text-sm mb-2">
                    ~$ cd /
                </motion.div>

                <motion.h1
                    class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2"
                    :initial="{ opacity: 0, y: 25, scale: 0.95 }"
                    :animate="{ opacity: 1, y: 0, scale: 1 }"
                    :transition="springs.bouncy"
                >
                    <span class="text-catppuccin-red">404</span>
                </motion.h1>

                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4 mb-6"
                    :initial="{ opacity: 0, x: -15 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ ...springs.default, delay: 0.15 }"
                >
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ cat error.txt
                    </div>
                    <div class="space-y-1 text-catppuccin-text">
                        <div class="flex items-center gap-2">
                            <span class="text-catppuccin-red">bash:</span>
                            <span class="text-catppuccin-text">cd: {{ route.path }}: No such file or directory</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-catppuccin-subtle">hint:</span>
                            <span class="text-catppuccin-gray">the requested page was not found</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="linksContainer"
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div :variants="fadeUp" class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls useful_links/
                    </motion.div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <motion.div :variants="fadeUp">
                            <router-link
                                to="/"
                                class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                            >
                                <span class="text-catppuccin-blue">/</span>
                                <span class="text-catppuccin-subtle">→</span>
                                <span>home</span>
                            </router-link>
                        </motion.div>
                        <motion.div :variants="fadeUp">
                            <router-link
                                to="/blog"
                                class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                            >
                                <span class="text-catppuccin-blue">/blog</span>
                                <span class="text-catppuccin-subtle">→</span>
                                <span>blog posts</span>
                            </router-link>
                        </motion.div>
                        <motion.div :variants="fadeUp">
                            <router-link
                                to="/uses"
                                class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                            >
                                <span class="text-catppuccin-blue">/uses</span>
                                <span class="text-catppuccin-subtle">→</span>
                                <span>tools & setup</span>
                            </router-link>
                        </motion.div>
                        <motion.div :variants="fadeUp">
                            <a
                                href="https://github.com/lostf1sh"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                            >
                                <span class="text-catppuccin-blue">github.com/lostf1sh</span>
                                <span class="text-catppuccin-subtle">→</span>
                                <span>projects</span>
                            </a>
                        </motion.div>
                        <motion.div :variants="fadeUp">
                            <a
                                href="https://www.instagram.com/kawaiimoli"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                            >
                                <span class="text-catppuccin-blue">instagram.com/kawaiimoli</span>
                                <span class="text-catppuccin-subtle">→</span>
                                <span>photos</span>
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { motion } from "motion-v";
import { springs, staggerContainer, fadeUp } from "@/utils/motion";

const route = useRoute();

const linksContainer = staggerContainer(0.05);
</script>
