<script setup>
import { ref, onMounted, watch } from "vue";
import { allReady } from "@/services/preloader";

const done = ref(false);
const leaving = ref(false);

const getBooted = () => {
    try {
        return window.sessionStorage?.getItem("booted") === "true";
    } catch {
        return false;
    }
};

const setBooted = () => {
    try {
        window.sessionStorage?.setItem("booted", "true");
    } catch {
    }
};

onMounted(() => {
    if (getBooted()) {
        done.value = true;
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        setBooted();
        done.value = true;
        return;
    }

    const dataReady = new Promise((resolve) => {
        if (allReady.value) return resolve();
        const stop = watch(allReady, (ready) => {
            if (ready) { stop(); resolve(); }
        });
        setTimeout(() => { stop(); resolve(); }, 2500);
    });

    const minTime = new Promise((r) => setTimeout(r, 650));

    Promise.all([dataReady, minTime]).then(() => {
        leaving.value = true;
        setTimeout(() => {
            setBooted();
            done.value = true;
        }, 450);
    });
});
</script>

<template>
    <Teleport to="body">
        <div v-if="!done" class="boot-screen" :class="{ 'is-leaving': leaving }">
            <div class="boot-mark">moli</div>
        </div>
    </Teleport>
</template>

<style scoped>
.boot-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(var(--color-base));
    transition: opacity 0.45s ease;
}

.boot-screen.is-leaving {
    opacity: 0;
}

.boot-mark {
    font-size: clamp(2.5rem, 7vw, 3.5rem);
    font-weight: 500;
    letter-spacing: -0.04em;
    color: rgb(var(--color-text));
    animation: mark-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes mark-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
    .boot-mark { animation: none; }
    .boot-screen { transition: none; }
}
</style>
