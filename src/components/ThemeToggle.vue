<script setup>
import { ref, onMounted } from "vue";

const theme = ref("dark");

const themeColors = {
    dark: "#11111b",
    light: "#dce0e8",
};

const setTheme = (t) => {
    theme.value = t;
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[t]);
};

const toggle = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
};

onMounted(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
});
</script>

<template>
    <button
        @click="toggle"
        class="fixed top-4 right-4 z-50 w-8 h-8 flex items-center justify-center text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors cursor-pointer"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        <span v-if="theme === 'dark'">sun</span>
        <span v-else>moon</span>
    </button>
</template>
