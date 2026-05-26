<script setup>
import { motion } from "motion-v";
import { staggerContainer, fadeUp } from "@/utils/motion";
import SiteNav from "@/components/SiteNav.vue";

const headerContainer = staggerContainer(0.06);
</script>

<template>
    <div class="w-full min-h-screen">
        <div class="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
            <h1 class="sr-only">uses</h1>
            <motion.div :variants="headerContainer" initial="hidden" animate="visible">
                <motion.div :variants="fadeUp"><SiteNav /></motion.div>
            </motion.div>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="tui-panel">
                    <span class="tui-panel-title">editors</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-catppuccin-text">zed</span><span class="text-catppuccin-subtle/30">primary</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">android studio</span><span class="text-catppuccin-subtle/30">mobile</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">claude code</span><span class="text-catppuccin-subtle/30">ai</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">codex</span><span class="text-catppuccin-subtle/30">agent</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">terminal</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-catppuccin-text">ghostty</span><span class="text-catppuccin-subtle/30">emulator</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">zsh</span><span class="text-catppuccin-subtle/30">shell</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">tmux</span><span class="text-catppuccin-subtle/30">mux</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">starship</span><span class="text-catppuccin-subtle/30">prompt</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">dev tools</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-catppuccin-text">vue 3</span><span class="text-catppuccin-subtle/30">frontend</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">tailwind</span><span class="text-catppuccin-subtle/30">css</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">bun</span><span class="text-catppuccin-subtle/30">runtime</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">vite</span><span class="text-catppuccin-subtle/30">build</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">docker</span><span class="text-catppuccin-subtle/30">containers</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">git</span><span class="text-catppuccin-subtle/30">vcs</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">languages</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-catppuccin-text">js / ts</span><span class="text-catppuccin-subtle/30">primary</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">python</span><span class="text-catppuccin-subtle/30">scripting</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">dart</span><span class="text-catppuccin-subtle/30">flutter</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">bash</span><span class="text-catppuccin-subtle/30">shell</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">system</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-catppuccin-text">cachyos</span><span class="text-catppuccin-subtle/30">arch</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">catppuccin</span><span class="text-catppuccin-subtle/30">theme</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">jetbrains mono</span><span class="text-catppuccin-subtle/30">font</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">apps</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-catppuccin-text">firefox</span><span class="text-catppuccin-subtle/30">browser</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">obsidian</span><span class="text-catppuccin-subtle/30">notes</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">spotify</span><span class="text-catppuccin-subtle/30">music</span></div>
                        <div class="flex justify-between"><span class="text-catppuccin-text">discord</span><span class="text-catppuccin-subtle/30">comms</span></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
