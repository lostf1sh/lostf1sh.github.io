<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
    { name: "Home", path: "/", label: "home" },
    { name: "Blog", path: "/blog", label: "blog" },
    { name: "Projects", path: "/projects", label: "projects" },
    { name: "Now", path: "/now", label: "now" },
    { name: "Uses", path: "/uses", label: "uses" },
];

const isActive = (item) => route.name === item.name;
</script>

<template>
    <nav class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs mb-8">
        <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            :class="[
                'link-underline transition-colors duration-200',
                isActive(item)
                    ? 'text-catppuccin-text active'
                    : 'text-catppuccin-subtle hover:text-catppuccin-text',
            ]"
        >
            {{ item.label }}
        </router-link>
        <span class="text-catppuccin-surface">·</span>
        <a
            href="https://github.com/lostf1sh"
            target="_blank"
            rel="noopener noreferrer"
            class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
        >
            github
        </a>
        <a
            href="https://www.instagram.com/kawaiimoli"
            target="_blank"
            rel="noopener noreferrer"
            class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
        >
            instagram
        </a>
    </nav>
</template>
