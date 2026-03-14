<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion, AnimatePresence } from "motion-v";
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
    <router-view v-slot="{ Component, route }">
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
    scrollbar-color: #45475a #1e1e2e;
}

::-webkit-scrollbar-track {
    background-color: #1e1e2e;
}

::-webkit-scrollbar-thumb {
    background-color: #45475a;
    border: 3px solid #1e1e2e;
    border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #585b70;
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
        transform: scale(0.9);
        transform-origin: center center;
        margin-top: -5vh;
    }
}
</style>
