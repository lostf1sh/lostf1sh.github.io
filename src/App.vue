<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import ThemeToggle from "@/components/ThemeToggle.vue";
import BootSequence from "@/components/BootSequence.vue";
import BackToTop from "@/components/BackToTop.vue";
import CustomCursor from "@/components/CustomCursor.vue";
import CommandPalette from "@/components/CommandPalette.vue";

const route = useRoute();
const pageKey = ref(0);
let initialized = false;

const canUseViewTransitions = () => {
    if (typeof document === "undefined" || typeof window === "undefined") {
        return false;
    }

    return "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

watch(() => route.fullPath, async () => {
    if (!initialized) {
        initialized = true;
        return;
    }

    if (canUseViewTransitions()) {
        const transition = document.startViewTransition(async () => {
            pageKey.value++;
            await nextTick();
        });

        try {
            await transition.finished;
        } catch {
        }
        return;
    }

    pageKey.value++;
});

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

    if (canUseViewTransitions()) {
        document.documentElement.classList.add("view-transitions-enabled");
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    document.documentElement.classList.remove("view-transitions-enabled");
});
</script>

<template>
    <CustomCursor />
    <BootSequence />
    <CommandPalette />
    <ThemeToggle />
    <router-view v-slot="{ Component, route }" id="main-content">
        <div
            :key="pageKey"
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
    animation: page-enter 0.25s ease both;
}

html.view-transitions-enabled .page-transition {
    animation: none;
    view-transition-name: page-root;
}

@keyframes page-enter {
    from { opacity: 0; }
    to { opacity: 1; }
}

@supports (view-transition-name: none) {
    ::view-transition-old(page-root) {
        animation: view-old 0.2s ease both;
    }

    ::view-transition-new(page-root) {
        animation: view-new 0.25s ease both;
    }

    @keyframes view-old {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes view-new {
        from { opacity: 0; }
        to { opacity: 1; }
    }
}

@media (prefers-reduced-motion: reduce) {
    .page-transition {
        animation: none;
    }
}
</style>
