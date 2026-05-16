<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const cursorRef = ref(null);
const cursorDotRef = ref(null);
const pos = { x: -100, y: -100 };
const target = { x: -100, y: -100 };
let rafId = null;
let isTouch = false;

const lerp = (a, b, n) => (1 - n) * a + n * b;

const updateCursor = () => {
    pos.x = lerp(pos.x, target.x, 0.15);
    pos.y = lerp(pos.y, target.y, 0.15);

    if (cursorRef.value) {
        cursorRef.value.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }
    if (cursorDotRef.value) {
        cursorDotRef.value.style.transform = `translate(${target.x}px, ${target.y}px)`;
    }

    rafId = requestAnimationFrame(updateCursor);
};

const INTERACTIVE_SELECTOR =
    "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";

const onMouseMove = (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
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

onMounted(() => {
    isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.body.classList.add("custom-cursor-enabled");
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onPointerOver, { passive: true });
    document.addEventListener("mouseout", onPointerOut, { passive: true });
    rafId = requestAnimationFrame(updateCursor);
});

onBeforeUnmount(() => {
    if (isTouch) return;
    window.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseover", onPointerOver);
    document.removeEventListener("mouseout", onPointerOut);
    if (rafId) cancelAnimationFrame(rafId);
    document.body.classList.remove("custom-cursor-enabled");
});
</script>

<template>
    <template v-if="!isTouch">
        <div ref="cursorRef" class="cursor-ring" aria-hidden="true"></div>
        <div ref="cursorDotRef" class="cursor-dot" aria-hidden="true"></div>
    </template>
</template>

<style scoped>
.cursor-ring {
    position: fixed;
    top: -16px;
    left: -16px;
    width: 32px;
    height: 32px;
    border: 1px solid rgb(var(--color-mauve) / 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    mix-blend-mode: difference;
    transition: width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease, border-color 0.25s ease;
    will-change: transform;
}

.cursor-ring.cursor-hover {
    top: -24px;
    left: -24px;
    width: 48px;
    height: 48px;
    border-color: rgb(var(--color-mauve) / 0.9);
}

.cursor-dot {
    position: fixed;
    top: -3px;
    left: -3px;
    width: 6px;
    height: 6px;
    background: rgb(var(--color-mauve));
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    mix-blend-mode: difference;
    will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
    .cursor-ring {
        display: none;
    }
}
</style>
