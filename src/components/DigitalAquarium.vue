<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const STORAGE_KEY = "moli:aquarium";
const FISH_GLYPHS = ["<><", "<°)))><", "><(((°>", "><>", "<*)))-{"];
const BUBBLE_COUNT = 18;
const FISH_COUNT = 7;

const enabled = ref(true);
const reduceMotion = ref(false);
const fish = ref([]);
const bubbles = ref([]);
const food = ref([]);
let rafId = 0;
let lastTime = 0;
let reduceMotionQuery = null;

const aquariumClass = computed(() => ({
    "is-disabled": !enabled.value,
    "is-reduced-motion": reduceMotion.value,
}));

const randomBetween = (min, max) => min + Math.random() * (max - min);

const createFish = (_, index) => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    return {
        id: `fish-${index}`,
        glyph: FISH_GLYPHS[index % FISH_GLYPHS.length],
        x: randomBetween(4, 96),
        y: randomBetween(18, 84),
        speed: randomBetween(1.2, 4.2),
        direction,
        phase: randomBetween(0, Math.PI * 2),
        depth: randomBetween(0.62, 0.92),
    };
};

const createBubble = (_, index) => ({
    id: `bubble-${index}`,
    x: randomBetween(2, 98),
    y: randomBetween(20, 100),
    speed: randomBetween(4, 12),
    delay: randomBetween(0, 8),
    size: Math.random() > 0.74 ? "o" : ".",
    opacity: randomBetween(0.8, 0.95),
});

const readEnabled = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        enabled.value = saved === null ? true : saved === "true";
    } catch {
        enabled.value = true;
    }
};

const persistEnabled = () => {
    try {
        localStorage.setItem(STORAGE_KEY, String(enabled.value));
    } catch {
    }
};

const toggleAquarium = () => {
    enabled.value = !enabled.value;
    persistEnabled();
};

const feedAquarium = () => {
    if (!enabled.value) enabled.value = true;
    persistEnabled();

    const now = performance.now();
    const pellets = Array.from({ length: 7 }, (_, index) => ({
        id: `food-${now}-${index}`,
        x: randomBetween(18, 82),
        y: randomBetween(8, 18),
        speed: randomBetween(7, 16),
        drift: randomBetween(-2, 2),
        bornAt: now,
    }));

    food.value = [...food.value.slice(-18), ...pellets];
};

const tick = (time) => {
    if (!lastTime) lastTime = time;
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    if (enabled.value && !reduceMotion.value) {
        fish.value = fish.value.map((item) => {
            let x = item.x + item.speed * item.direction * delta;
            let direction = item.direction;

            if (x > 108) {
                x = -8;
                direction = 1;
            } else if (x < -8) {
                x = 108;
                direction = -1;
            }

            return {
                ...item,
                x,
                direction,
                phase: item.phase + delta,
            };
        });

        bubbles.value = bubbles.value.map((bubble) => {
            const y = bubble.y - bubble.speed * delta;
            return {
                ...bubble,
                y: y < -8 ? 108 : y,
            };
        });

        const now = performance.now();
        food.value = food.value
            .map((pellet) => ({
                ...pellet,
                x: pellet.x + pellet.drift * delta,
                y: pellet.y + pellet.speed * delta,
            }))
            .filter((pellet) => pellet.y < 94 && now - pellet.bornAt < 9000);
    }

    rafId = requestAnimationFrame(tick);
};

const syncReduceMotion = () => {
    reduceMotion.value = Boolean(reduceMotionQuery?.matches);
};

onMounted(() => {
    readEnabled();
    fish.value = Array.from({ length: FISH_COUNT }, createFish);
    bubbles.value = Array.from({ length: BUBBLE_COUNT }, createBubble);

    reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    syncReduceMotion();
    reduceMotionQuery.addEventListener?.("change", syncReduceMotion);

    window.addEventListener("aquarium:toggle", toggleAquarium);
    window.addEventListener("aquarium:feed", feedAquarium);
    rafId = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
    reduceMotionQuery?.removeEventListener?.("change", syncReduceMotion);
    window.removeEventListener("aquarium:toggle", toggleAquarium);
    window.removeEventListener("aquarium:feed", feedAquarium);
});
</script>

<template>
    <div class="digital-aquarium" :class="aquariumClass" aria-hidden="true">
        <span
            v-for="bubble in bubbles"
            :key="bubble.id"
            class="aquarium-bubble"
            :style="{
                transform: `translate3d(${bubble.x}vw, ${bubble.y}vh, 0)`,
                opacity: bubble.opacity,
                transitionDelay: `${bubble.delay}s`,
            }"
        >{{ bubble.size }}</span>

        <span
            v-for="item in fish"
            :key="item.id"
            class="aquarium-fish"
            :style="{
                opacity: item.depth,
                transform: `translate3d(calc(${item.x}vw - 50%), calc(${item.y + Math.sin(item.phase) * 1.8}vh - 50%), 0) scaleX(${item.direction}) scale(${0.78 + item.depth * 0.42})`,
            }"
        >{{ item.glyph }}</span>

        <span
            v-for="pellet in food"
            :key="pellet.id"
            class="aquarium-food"
            :style="{
                transform: `translate3d(${pellet.x}vw, ${pellet.y}vh, 0)`,
            }"
        >·</span>

    </div>
</template>

<style scoped>
.digital-aquarium {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 2;
    overflow: hidden;
    color: rgb(var(--color-subtle));
    font-family: "JetBrains Mono", monospace;
    opacity: 1;
    mix-blend-mode: screen;
    transition: opacity 0.3s ease;
    mask-image: radial-gradient(circle at 50% 42%, transparent 0 18%, rgb(0 0 0 / 0.2) 38%, black 100%);
}

[data-theme="light"] .digital-aquarium {
    mix-blend-mode: multiply;
    opacity: 1;
}

.digital-aquarium.is-disabled {
    opacity: 0;
}

.aquarium-fish,
.aquarium-bubble,
.aquarium-food {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    user-select: none;
    will-change: transform;
}

.aquarium-fish {
    color: rgb(var(--color-text));
    font-size: clamp(10px, 1.2vw, 15px);
    text-shadow: 0 0 10px rgb(var(--color-text) / 0.12);
}

.aquarium-bubble {
    color: rgb(var(--color-blue));
    font-size: 11px;
}

.aquarium-food {
    color: rgb(var(--color-yellow));
    font-size: 16px;
    text-shadow: 0 0 8px rgb(var(--color-yellow) / 0.3);
}

.is-reduced-motion .aquarium-fish,
.is-reduced-motion .aquarium-bubble,
.is-reduced-motion .aquarium-food {
    will-change: auto;
}

@media (max-width: 640px) {
    .digital-aquarium {
        opacity: 1;
    }

}
</style>
