<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion, AnimatePresence } from "motion-v";
import ThemeToggle from "@/components/ThemeToggle.vue";
import CommandPalette from "@/components/CommandPalette.vue";
import BootSequence from "@/components/BootSequence.vue";
import {
    pageEnter,
    pageAnimate,
    pageExit,
    pageTransition,
} from "@/utils/motion";

const route = useRoute();
const router = useRouter();
const isInitialLoad = ref(true);

router.isReady().then(() => {
    setTimeout(() => {
        isInitialLoad.value = false;
    }, 100);
});
</script>

<template>
    <BootSequence />
    <ThemeToggle />
    <CommandPalette />
    <router-view v-slot="{ Component, route }" id="main-content">
        <AnimatePresence mode="wait">
            <motion.div
                :key="route.path"
                :initial="isInitialLoad ? false : pageEnter"
                :animate="pageAnimate"
                :exit="pageExit"
                :transition="pageTransition"
            >
                <component v-if="Component" :is="Component" />
            </motion.div>
        </AnimatePresence>
    </router-view>
</template>

<style>
body {
    margin: 0;
}

::-webkit-scrollbar {
    width: 16px;
}

html {
    scrollbar-width: auto;
    scrollbar-color: rgb(var(--color-overlay)) rgb(var(--color-base));
}

::-webkit-scrollbar-track {
    background-color: rgb(var(--color-base));
}

::-webkit-scrollbar-thumb {
    background-color: rgb(var(--color-overlay));
    border: 3px solid rgb(var(--color-base));
    border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgb(var(--color-overlay));
}

/* Desktop: Centered layout */
@media (min-width: 1024px) {
    body {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
    }

    #app {
        zoom: 0.9;
        transform-origin: center center;
        margin-top: 2vh;
    }
}
</style>
