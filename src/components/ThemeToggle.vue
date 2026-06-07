<script setup>
import { theme, toggleTheme } from "@/utils/theme";
</script>

<template>
    <button
        @click="toggleTheme"
        class="fixed top-4 right-5 z-50 text-[10px] text-ink-subtle hover:text-ink-text transition-colors cursor-pointer font-mono tracking-wide"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        {{ theme === 'dark' ? '[light]' : '[dark]' }}
    </button>
</template>
