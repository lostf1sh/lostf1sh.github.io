<script setup>
import { theme, toggleTheme } from "@/utils/theme";
</script>

<template>
    <button
        @click="toggleTheme"
        class="fixed top-4 right-4 z-50 w-8 h-8 flex items-center justify-center text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors cursor-pointer"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        <span v-if="theme === 'dark'">sun</span>
        <span v-else>moon</span>
    </button>
</template>
