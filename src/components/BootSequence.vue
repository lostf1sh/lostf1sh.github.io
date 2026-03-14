<script setup>
import { ref, onMounted } from "vue";

const show = ref(false);
const done = ref(false);

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

    setTimeout(() => {
        show.value = false;
        sessionStorage.setItem("booted", "true");
        setTimeout(() => {
            done.value = true;
        }, 400);
    }, 2500);
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="!done"
            class="fixed inset-0 z-[9999] flex items-center justify-center font-mono transition-opacity duration-400"
            :class="show ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            :style="{ backgroundColor: 'rgb(var(--color-crust))' }"
        >
            <div class="text-sm space-y-1 px-6 max-w-md w-full">
                <div class="boot-line" style="animation-delay: 0s">
                    <span class="text-catppuccin-blue">[BIOS]</span>
                    <span class="text-catppuccin-text"> f1sh.dev v2.0</span>
                </div>
                <div class="boot-line" style="animation-delay: 0.3s">
                    <span class="text-catppuccin-yellow">[INIT]</span>
                    <span class="text-catppuccin-subtle"> loading kernel modules...</span>
                </div>
                <div class="boot-line" style="animation-delay: 0.6s">
                    <span class="text-catppuccin-green">[OK]</span>
                    <span class="text-catppuccin-text">   catppuccin.theme</span>
                </div>
                <div class="boot-line" style="animation-delay: 0.9s">
                    <span class="text-catppuccin-green">[OK]</span>
                    <span class="text-catppuccin-text">   vue@3.x</span>
                </div>
                <div class="boot-line" style="animation-delay: 1.2s">
                    <span class="text-catppuccin-green">[OK]</span>
                    <span class="text-catppuccin-text">   motion-v initialized</span>
                </div>
                <div class="boot-line" style="animation-delay: 1.5s">
                    <div class="boot-progress h-3 rounded overflow-hidden bg-catppuccin-surface/50 mt-1">
                        <div class="h-full bg-catppuccin-mauve boot-progress-fill"></div>
                    </div>
                </div>
                <div class="boot-line" style="animation-delay: 2.1s">
                    <span class="text-catppuccin-mauve">[READY]</span>
                    <span class="text-catppuccin-text"> welcome, visitor.</span>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.boot-line {
    opacity: 0;
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

.boot-progress-fill {
    width: 0%;
    animation: boot-fill 0.5s ease-out 1.6s forwards;
}

@keyframes boot-fill {
    from { width: 0%; }
    to { width: 100%; }
}
</style>
