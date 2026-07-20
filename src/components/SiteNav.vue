<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
    { name: "Blog", path: "/blog", label: "blog" },
    { name: "Projects", path: "/projects", label: "projects" },
    { name: "Now", path: "/now", label: "now" },
];

const isActive = (item) => route.name === item.name;
</script>

<template>
    <header class="site-nav flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <router-link
            to="/"
            class="brand text-lg text-ink-text hover:text-ink-mint transition-colors"
        >
            moli
        </router-link>

        <nav aria-label="Primary" class="flex items-center gap-x-5 gap-y-1.5 text-sm">
            <router-link
                v-for="item in navItems"
                :key="item.name"
                :to="item.path"
                :class="[
                    'transition-colors',
                    isActive(item)
                        ? 'text-ink-text'
                        : 'text-ink-subtle hover:text-ink-mint',
                ]"
            >
                {{ item.label }}
            </router-link>
        </nav>
    </header>
</template>

<style scoped>
/* Snapshot the nav separately during view transitions so it holds still
   while the page content fades; pages without SiteNav fall back to the
   plain cross-fade. */
.site-nav {
    view-transition-name: site-nav;
}

.brand {
    font-family: "Rowan", serif;
    font-weight: 300;
}
</style>
