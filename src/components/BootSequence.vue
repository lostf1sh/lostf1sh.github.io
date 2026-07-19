<script setup>
import { ref, onMounted, watch } from "vue";
import { allReady } from "@/services/preloader";

const done = ref(false);
const leaving = ref(false);

// Most redacted → fully legible. Delays are the pause *before* each step;
// the last snap to clean gets a slightly longer beat.
const STAGES = [
    { family: '"Redaction 100"', delay: 0 },
    { family: '"Redaction 70"', delay: 300 },
    { family: '"Redaction 50"', delay: 240 },
    { family: '"Redaction 35"', delay: 190 },
    { family: '"Redaction 20"', delay: 160 },
    { family: '"Redaction 10"', delay: 140 },
    { family: '"Redaction"', delay: 260 },
];

const stage = ref(0);

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

const loadFonts = () => {
    if (!document.fonts?.load) return Promise.resolve();
    const loads = STAGES.map((s) => document.fonts.load(`1rem ${s.family}`));
    return Promise.race([
        Promise.all(loads),
        new Promise((r) => setTimeout(r, 700)),
    ]);
};

const runSequence = () =>
    new Promise((resolve) => {
        const step = (i) => {
            if (i >= STAGES.length) {
                // hold the clean mark for a beat before allowing exit
                setTimeout(resolve, 350);
                return;
            }
            setTimeout(() => {
                stage.value = i;
                step(i + 1);
            }, STAGES[i].delay);
        };
        step(1);
    });

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

    const sequenceDone = loadFonts().then(runSequence);

    Promise.all([dataReady, sequenceDone]).then(() => {
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
            <div class="boot-mark" :style="{ fontFamily: STAGES[stage].family + ', serif' }">moli</div>
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
    font-size: clamp(3.5rem, 10vw, 5.5rem);
    font-weight: 400;
    letter-spacing: 0.01em;
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
