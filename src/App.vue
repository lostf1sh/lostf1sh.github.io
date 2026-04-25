<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import ThemeToggle from "@/components/ThemeToggle.vue";
import CommandPalette from "@/components/CommandPalette.vue";
import BootSequence from "@/components/BootSequence.vue";

const route = useRoute();
const pageKey = ref(0);
let initialized = false;

// Bump key on route change to re-trigger CSS animation (skip first)
watch(() => route.path, () => {
    if (!initialized) {
        initialized = true;
        return;
    }
    pageKey.value++;
});
</script>

<template>
    <BootSequence />
    <ThemeToggle />
    <CommandPalette />
    <router-view v-slot="{ Component, route }" id="main-content">
        <div
            :key="pageKey"
            class="page-transition"
        >
            <component v-if="Component" :is="Component" />
        </div>
    </router-view>
</template>

<style>
body {
    margin: 0;
}

::-webkit-scrollbar {
    width: 6px;
}

html {
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--color-overlay) / 0.3) transparent;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgb(var(--color-overlay) / 0.3);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--color-overlay) / 0.5);
}

/* Page transition — no transforms, preserves sticky */
.page-transition {
    animation: page-fade-in 0.35s ease both;
}

@keyframes page-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .page-transition {
        animation: none;
    }
}
</style>
