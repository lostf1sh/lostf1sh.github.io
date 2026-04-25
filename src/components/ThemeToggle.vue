<script setup>
import { theme, toggleTheme } from "@/utils/theme";
</script>

<template>
    <button
        @click="toggleTheme"
        class="fixed top-5 right-5 z-50 w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-150"
        :class="theme === 'dark'
            ? 'bg-catppuccin-overlay hover:bg-catppuccin-mauve'
            : 'bg-catppuccin-overlay hover:bg-catppuccin-mauve'"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
    </button>
</template>
