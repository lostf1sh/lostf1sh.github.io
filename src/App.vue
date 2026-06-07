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
        <div id="main-content" :key="route.fullPath">
            <component v-if="Component" :is="Component" />
        </div>
    </router-view>
    <BackToTop :visible="showBackToTop" />
    <div class="grain" aria-hidden="true"></div>
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

.grain {
    position: fixed;
    inset: 0;
    z-index: 60;
    pointer-events: none;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
}

@media (prefers-reduced-transparency: reduce) {
    .grain { display: none; }
}
</style>
