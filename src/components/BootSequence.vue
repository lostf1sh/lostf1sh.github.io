<script setup>
import { ref, onMounted, watch } from "vue";
import { allReady } from "@/services/preloader";

const done = ref(false);
const lines = ref([]);
const showCursor = ref(true);

const bootLines = [
    { text: "[boot] moliOS // moli.codes", delay: 0 },
    { text: "[ok]   mounted /home/moli", delay: 180 },
    { text: "[ok]   loaded posts/index", delay: 180 },
    { text: "[ok]   linked github repos", delay: 220 },
    { text: "[ok]   opened lanyard socket", delay: 260 },
    { text: "[ok]   synced last.fm cache", delay: 260 },
    { text: "[run]  starting terminal ui", delay: 220 },
    { text: "", delay: 120 },
    { text: "$ whoami", delay: 100 },
    { text: "moli // junior developer // turkey", delay: 120 },
];

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
        // Storage can be unavailable on some mobile/private browsers.
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

    let totalDelay = 200;
    bootLines.forEach((line, i) => {
        totalDelay += line.delay;
        setTimeout(() => {
            lines.value.push(line.text);
        }, totalDelay);
    });

    const dataReady = new Promise((resolve) => {
        if (allReady.value) return resolve();
        const stop = watch(allReady, (ready) => {
            if (ready) { stop(); resolve(); }
        });
        setTimeout(() => { stop(); resolve(); }, 3500);
    });

    const minTime = new Promise((r) => setTimeout(r, totalDelay + 600));

    Promise.all([dataReady, minTime]).then(() => {
        showCursor.value = false;
        setTimeout(() => {
            setBooted();
            done.value = true;
        }, 400);
    });
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="!done"
            class="boot-screen"
            :class="{ 'is-fading': !showCursor && lines.length >= bootLines.length }"
        >
            <div class="boot-content">
                <div class="boot-frame-label">init</div>
                <div
                    v-for="(line, i) in lines"
                    :key="i"
                    class="boot-line"
                    :class="{
                        'text-ok': line.startsWith('[ok]'),
                        'text-boot': line.startsWith('[boot]'),
                        'text-done': line.startsWith('[run]'),
                        'text-cmd': line.startsWith('$'),
                    }"
                >{{ line }}</div>
                <span v-if="showCursor" class="boot-cursor">█</span>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.boot-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: #0a0a0a;
    padding: 2rem;
    transition: opacity 0.4s ease;
    font-family: "JetBrains Mono", monospace;
}

.boot-screen.is-fading {
    opacity: 0;
}

.boot-content {
    position: relative;
    min-width: min(420px, calc(100vw - 4rem));
    border: 1px solid #1c1c1c;
    padding: 1.1rem 1.25rem 1rem;
    font-size: 13px;
    line-height: 1.8;
    color: #666;
}

.boot-frame-label {
    position: absolute;
    top: -0.65em;
    left: 0.9rem;
    background: #0a0a0a;
    padding: 0 0.45rem;
    font-size: 10px;
    color: rgb(102 102 102 / 0.55);
}

.boot-line {
    white-space: pre;
}

.text-ok {
    color: rgb(224 224 224 / 0.6);
}

.text-boot {
    color: rgb(224 224 224 / 0.4);
}

.text-done {
    color: rgb(224 224 224);
}

.text-cmd {
    color: rgb(224 224 224);
    margin-top: 0.25rem;
}

.boot-cursor {
    color: rgb(224 224 224);
    animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
    .boot-cursor {
        animation: none;
        opacity: 0.5;
    }
}
</style>
