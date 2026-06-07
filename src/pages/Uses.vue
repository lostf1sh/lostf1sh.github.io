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
                        <div class="flex justify-between"><span class="text-ink-text">zed</span><span class="text-ink-subtle">primary</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">android studio</span><span class="text-ink-subtle">mobile</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">claude code</span><span class="text-ink-subtle">ai</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">codex</span><span class="text-ink-subtle">agent</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">terminal</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-ink-text">ghostty</span><span class="text-ink-subtle">emulator</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">zsh</span><span class="text-ink-subtle">shell</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">tmux</span><span class="text-ink-subtle">mux</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">starship</span><span class="text-ink-subtle">prompt</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">dev tools</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-ink-text">vue 3</span><span class="text-ink-subtle">frontend</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">tailwind</span><span class="text-ink-subtle">css</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">bun</span><span class="text-ink-subtle">runtime</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">vite</span><span class="text-ink-subtle">build</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">docker</span><span class="text-ink-subtle">containers</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">git</span><span class="text-ink-subtle">vcs</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">languages</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-ink-text">js / ts</span><span class="text-ink-subtle">primary</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">python</span><span class="text-ink-subtle">scripting</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">dart</span><span class="text-ink-subtle">flutter</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">bash</span><span class="text-ink-subtle">shell</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">system</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-ink-text">cachyos</span><span class="text-ink-subtle">arch</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">catppuccin</span><span class="text-ink-subtle">theme</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">jetbrains mono</span><span class="text-ink-subtle">font</span></div>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">apps</span>
                    <div class="space-y-1.5 text-xs pt-1">
                        <div class="flex justify-between"><span class="text-ink-text">firefox</span><span class="text-ink-subtle">browser</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">obsidian</span><span class="text-ink-subtle">notes</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">spotify</span><span class="text-ink-subtle">music</span></div>
                        <div class="flex justify-between"><span class="text-ink-text">discord</span><span class="text-ink-subtle">comms</span></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
