<script setup>
import { ref, onMounted, watch } from "vue";
import { allReady } from "@/services/preloader";

const done = ref(false);
const phase = ref("idle"); // idle → drawing → hold → fading → done

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

    // Start the ensō draw
    phase.value = "drawing";

    // Drawing takes ~1.2s, then hold
    setTimeout(() => {
        phase.value = "hold";
    }, 1200);

    // Wait for data or timeout
    const maxTime = new Promise((r) => setTimeout(r, 3500));
    const dataReady = new Promise((resolve) => {
        if (allReady.value) return resolve();
        const stop = watch(allReady, (ready) => {
            if (ready) { stop(); resolve(); }
        });
        // Safety cleanup
        setTimeout(() => { stop(); resolve(); }, 3500);
    });

    // Ensure minimum display time (let the circle draw + hold)
    const minTime = new Promise((r) => setTimeout(r, 1800));

    Promise.all([Promise.race([dataReady, maxTime]), minTime]).then(() => {
        phase.value = "fading";
        setTimeout(() => {
            sessionStorage.setItem("booted", "true");
            done.value = true;
        }, 700);
    });
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="!done"
            class="enso-screen"
            :class="phase === 'fading' ? 'is-fading' : ''"
        >
            <svg
                class="enso-svg"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    class="enso-circle"
                    :class="{ 'is-drawing': phase !== 'idle' }"
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-dasharray="239"
                    stroke-dashoffset="239"
                    :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
                />
                <!-- Small gap imperfection — wabi-sabi -->
                <circle
                    class="enso-gap"
                    :class="{ 'is-visible': phase === 'hold' || phase === 'fading' }"
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-dasharray="4 240"
                    stroke-dashoffset="-232"
                    :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
                />
            </svg>
        </div>
    </Teleport>
</template>

<style scoped>
.enso-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--color-crust));
    transition: opacity 0.7s ease;
}

.enso-screen.is-fading {
    opacity: 0;
}

.enso-svg {
    width: 64px;
    height: 64px;
    color: rgb(var(--color-overlay));
}

.enso-circle {
    opacity: 0;
    transition: opacity 0.4s ease;
}

.enso-circle.is-drawing {
    opacity: 1;
    animation: enso-draw 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.enso-gap {
    opacity: 0;
    transition: opacity 0.6s ease;
}

.enso-gap.is-visible {
    opacity: 0.7;
}

@keyframes enso-draw {
    0% {
        stroke-dashoffset: 239;
    }
    100% {
        stroke-dashoffset: 8;
    }
}

@media (prefers-reduced-motion: reduce) {
    .enso-circle.is-drawing {
        animation: none;
        stroke-dashoffset: 8;
        opacity: 0.5;
    }

    .enso-gap.is-visible {
        opacity: 0;
    }
}
</style>
