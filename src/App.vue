<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

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
        <Transition :name="isInitialLoad ? '' : 'page'" mode="out-in">
            <component :is="Component" :key="route.path" />
        </Transition>
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

<style>
.page-enter-active {
    transition: all 0.3s ease-out;
}

.page-leave-active {
    transition: all 0.25s ease-in;
}

.page-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.page-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>
