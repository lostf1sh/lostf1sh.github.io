<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
import BootSequence from "@/components/BootSequence.vue";
import BackToTop from "@/components/BackToTop.vue";
import CustomCursor from "@/components/CustomCursor.vue";
import CommandPalette from "@/components/CommandPalette.vue";
import DigitalAquarium from "@/components/DigitalAquarium.vue";

const showBackToTop = ref(false);
let scrollRaf = null;

const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
        showBackToTop.value = window.scrollY > window.innerHeight * 0.6;
        scrollRaf = null;
    });
};

onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
});
</script>

<template>
    <DigitalAquarium />
    <CustomCursor />
    <BootSequence />
    <CommandPalette />
    <ThemeToggle />
    <router-view v-slot="{ Component, route }">
        <div
            id="main-content"
            :key="route.fullPath"
            class="page-transition"
        >
            <component v-if="Component" :is="Component" />
        </div>
    </router-view>
    <BackToTop :visible="showBackToTop" />
</template>

<style>
body {
    margin: 0;
}

::-webkit-scrollbar {
    width: 5px;
}

html {
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--color-overlay) / 0.25) transparent;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgb(var(--color-overlay) / 0.25);
}

/* Page transition */
.page-transition {
    animation: page-enter 0.16s ease-out both;
}

@keyframes page-enter {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .page-transition {
        animation: none;
    }
}
</style>
