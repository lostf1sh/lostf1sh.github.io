<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const cursorRef = ref(null);
const pos = { x: -100, y: -100 };
const target = { x: -100, y: -100 };
let rafId = null;
const enabled = ref(false);
const hasMoved = ref(false);
const isSplashing = ref(false);
const bubbles = ref([]);
let splashTimeout = null;
let bubbleId = 0;

const lerp = (a, b, n) => (1 - n) * a + n * b;

const updateCursor = () => {
    pos.x = lerp(pos.x, target.x, 0.32);
    pos.y = lerp(pos.y, target.y, 0.32);

    if (cursorRef.value) {
        cursorRef.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    }

    rafId = requestAnimationFrame(updateCursor);
};

const INTERACTIVE_SELECTOR =
    "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";

const onMouseMove = (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
    hasMoved.value = true;
};

const onPointerOver = (e) => {
    const t = e.target;
    if (t && t.closest && t.closest(INTERACTIVE_SELECTOR)) {
        cursorRef.value?.classList.add("cursor-hover");
    }
};

const onPointerOut = (e) => {
    const t = e.target;
    const r = e.relatedTarget;
    const from = t && t.closest && t.closest(INTERACTIVE_SELECTOR);
    const to = r && r.closest && r.closest(INTERACTIVE_SELECTOR);
    if (from && from !== to) {
        cursorRef.value?.classList.remove("cursor-hover");
    }
};

const onClick = (e) => {
    isSplashing.value = true;
    if (splashTimeout) clearTimeout(splashTimeout);
    splashTimeout = setTimeout(() => {
        isSplashing.value = false;
    }, 180);

    const burst = ["blub", "°", "o"].map((text, index) => ({
        id: bubbleId++,
        text,
        x: e.clientX + 8 + index * 10,
        y: e.clientY - 8 - index * 4,
    }));
    bubbles.value.push(...burst);
    setTimeout(() => {
        const ids = new Set(burst.map((bubble) => bubble.id));
        bubbles.value = bubbles.value.filter((bubble) => !ids.has(bubble.id));
    }, 650);
};

onMounted(() => {
    const isTouchDevice =
        (navigator.maxTouchPoints || 0) > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches;

    const canUseCursor =
        !isTouchDevice &&
        window.matchMedia("(pointer: fine)").matches &&
        window.matchMedia("(hover: hover)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUseCursor) return;

    enabled.value = true;
    document.body.classList.add("custom-cursor-enabled");
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    document.addEventListener("mouseover", onPointerOver, { passive: true });
    document.addEventListener("mouseout", onPointerOut, { passive: true });
    rafId = requestAnimationFrame(updateCursor);
});

onBeforeUnmount(() => {
    if (!enabled.value) return;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("click", onClick);
    document.removeEventListener("mouseover", onPointerOver);
    document.removeEventListener("mouseout", onPointerOut);
    if (rafId) cancelAnimationFrame(rafId);
    if (splashTimeout) clearTimeout(splashTimeout);
    document.body.classList.remove("custom-cursor-enabled");
});
</script>

<template>
    <div
        v-if="enabled"
        ref="cursorRef"
        class="cursor-fish"
        :class="{ 'has-moved': hasMoved, 'is-splashing': isSplashing }"
        aria-hidden="true"
    >
        <span class="fish-body">{{ isSplashing ? "&gt;&lt;&gt;" : "&lt;&gt;&lt;" }}</span>
        <span class="fish-wake">~</span>
    </div>
    <span
        v-for="bubble in bubbles"
        :key="bubble.id"
        class="cursor-bubble"
        :style="{ transform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)` }"
        aria-hidden="true"
    >
        {{ bubble.text }}
    </span>
</template>

<style scoped>
.cursor-fish {
    position: fixed;
    top: -8px;
    left: -14px;
    display: flex;
    align-items: center;
    gap: 2px;
    pointer-events: none;
    z-index: 99999;
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    line-height: 1;
    color: rgb(var(--color-text));
    opacity: 0;
    will-change: transform;
    transition: opacity 0.12s ease, color 0.14s ease;
}

.cursor-fish.has-moved {
    opacity: 0.9;
}

.fish-body {
    display: block;
    letter-spacing: -0.08em;
}

.fish-wake {
    color: rgb(var(--color-subtle) / 0.45);
    font-size: 10px;
}

.cursor-fish.cursor-hover {
    color: rgb(var(--color-accent));
    opacity: 1;
}

.cursor-fish.cursor-hover .fish-wake {
    color: rgb(var(--color-accent) / 0.55);
}

.cursor-fish.is-splashing {
    color: rgb(var(--color-blue));
}

.cursor-bubble {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99998;
    pointer-events: none;
    color: rgb(var(--color-subtle));
    font-family: "JetBrains Mono", monospace;
    font-size: 10px;
    line-height: 1;
    animation: bubble-pop 0.65s ease-out forwards;
}

@keyframes bubble-pop {
    from {
        opacity: 0.9;
        translate: 0 0;
    }
    to {
        opacity: 0;
        translate: 0 -18px;
    }
}
</style>
