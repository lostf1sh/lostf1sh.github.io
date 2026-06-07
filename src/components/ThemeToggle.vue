<script setup>
import { theme, toggleTheme } from "@/utils/theme";
</script>

<template>
    <button
        @click="toggleTheme"
        class="fixed top-4 right-4 z-50 text-xs text-ink-subtle hover:text-ink-mint transition-colors cursor-pointer tracking-tight"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        {{ theme === 'dark' ? 'light' : 'dark' }}
    </button>
</template>
