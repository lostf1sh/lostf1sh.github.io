<script setup>
import { ref, watch, onMounted } from "vue";
import { allReady, preloaderState, loadProgress } from "@/services/preloader";

const show = ref(false);
const done = ref(false);
const line = ref(0);
const showReady = ref(false);

const finish = () => {
    show.value = false;
    sessionStorage.setItem("booted", "true");
    setTimeout(() => {
        done.value = true;
    }, 400);
};

onMounted(() => {
    if (sessionStorage.getItem("booted")) {
        done.value = true;
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        sessionStorage.setItem("booted", "true");
        done.value = true;
        return;
    }

    show.value = true;

    // Reveal lines sequentially
    const timings = [0, 300, 600, 900, 1200, 1500, 1650, 1800];
    timings.forEach((ms, i) => {
        setTimeout(() => { line.value = i + 1; }, ms);
    });

    // Wait for both minimum animation time and all data to load
    // Max 6s timeout so boot never hangs if an API is down
    const minTime = new Promise((r) => setTimeout(r, 2500));
    const maxTime = new Promise((r) => setTimeout(r, 6000));
    const dataReady = new Promise((resolve) => {
        if (allReady.value) return resolve();
        const stop = watch(allReady, (ready) => {
            if (ready) { stop(); resolve(); }
        });
    });

    Promise.race([
        Promise.all([minTime, dataReady]),
        maxTime,
    ]).then(() => {
        showReady.value = true;
        setTimeout(finish, 600);
    });
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="!done"
            class="fixed inset-0 z-[9999] flex flex-col items-center justify-center font-mono transition-opacity duration-400"
            :class="show ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            :style="{ backgroundColor: 'rgb(var(--color-crust))' }"
        >
            <div class="flex flex-col px-6 max-w-md w-full" style="max-height: 60vh">
                <!-- Boot lines — grow upward from bottom -->
                <div class="flex-1 flex flex-col justify-end text-sm space-y-1 overflow-hidden mb-4">
                    <div v-if="line >= 1" class="boot-anim">
                        <span class="text-catppuccin-blue">[BIOS]</span>
                        <span class="text-catppuccin-text"> f1sh.v.recipes v2.0</span>
                    </div>
                    <div v-if="line >= 2" class="boot-anim">
                        <span class="text-catppuccin-yellow">[INIT]</span>
                        <span class="text-catppuccin-subtle"> loading kernel modules...</span>
                    </div>
                    <div v-if="line >= 3" class="boot-anim">
                        <span class="text-catppuccin-green">[OK]</span>
                        <span class="text-catppuccin-text">   catppuccin.theme</span>
                    </div>
                    <div v-if="line >= 4" class="boot-anim">
                        <span class="text-catppuccin-green">[OK]</span>
                        <span class="text-catppuccin-text">   vue@3.x</span>
                    </div>
                    <div v-if="line >= 5" class="boot-anim">
                        <span class="text-catppuccin-green">[OK]</span>
                        <span class="text-catppuccin-text">   motion-v initialized</span>
                    </div>
                    <div v-if="line >= 6" class="boot-anim">
                        <span :class="preloaderState.projects ? 'text-catppuccin-green' : 'text-catppuccin-yellow'">
                            {{ preloaderState.projects ? '[OK]' : '[..]' }}
                        </span>
                        <span class="text-catppuccin-text">   github.repos</span>
                    </div>
                    <div v-if="line >= 7" class="boot-anim">
                        <span :class="preloaderState.songs ? 'text-catppuccin-green' : 'text-catppuccin-yellow'">
                            {{ preloaderState.songs ? '[OK]' : '[..]' }}
                        </span>
                        <span class="text-catppuccin-text">   lastfm.tracks</span>
                    </div>
                    <div v-if="line >= 8" class="boot-anim">
                        <span :class="preloaderState.contributions ? 'text-catppuccin-green' : 'text-catppuccin-yellow'">
                            {{ preloaderState.contributions ? '[OK]' : '[..]' }}
                        </span>
                        <span class="text-catppuccin-text">   github.contributions</span>
                    </div>
                </div>

                <!-- Progress bar + READY — pinned at bottom -->
                <div class="shrink-0">
                    <div class="h-1.5 rounded-full overflow-hidden bg-catppuccin-surface/50">
                        <div
                            class="h-full bg-catppuccin-mauve transition-[width] duration-500 ease-out"
                            :style="{ width: (loadProgress * 100) + '%' }"
                        ></div>
                    </div>
                    <div v-if="showReady" class="boot-anim text-sm mt-2">
                        <span class="text-catppuccin-mauve">[READY]</span>
                        <span class="text-catppuccin-text"> welcome, visitor.</span>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.boot-anim {
    animation: boot-appear 0.15s ease-out forwards;
}

@keyframes boot-appear {
    from {
        opacity: 0;
        transform: translateY(4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
