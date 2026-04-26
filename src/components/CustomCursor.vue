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

const onMouseMove = (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
};

const onMouseEnterInteractive = () => {
    if (cursorRef.value) cursorRef.value.classList.add("cursor-hover");
};

const onMouseLeaveInteractive = () => {
    if (cursorRef.value) cursorRef.value.classList.remove("cursor-hover");
};

const bindInteractiveElements = () => {
    const interactives = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, [data-cursor-hover]"
    );
    interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });
};

onMounted(() => {
    isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.body.classList.add("custom-cursor-enabled");
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateCursor);

    // Bind existing interactive elements
    bindInteractiveElements();

    // Re-bind for dynamically added elements (simple MutationObserver)
    const observer = new MutationObserver(() => {
        bindInteractiveElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    onBeforeUnmount(() => {
        observer.disconnect();
    });
});

onBeforeUnmount(() => {
    if (isTouch) return;
    window.removeEventListener("mousemove", onMouseMove);
    if (rafId) cancelAnimationFrame(rafId);
    document.body.classList.remove("custom-cursor-enabled");
});
</script>

<template>
    <div v-if="!isTouch" class="custom-cursor-wrapper" aria-hidden="true">
        <div ref="cursorRef" class="cursor-ring"></div>
        <div ref="cursorDotRef" class="cursor-dot"></div>
    </div>
</template>

<style scoped>
.custom-cursor-wrapper {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 99999;
    mix-blend-mode: difference;
}

.cursor-ring {
    position: absolute;
    top: -16px;
    left: -16px;
    width: 32px;
    height: 32px;
    border: 1px solid rgb(var(--color-mauve) / 0.6);
    border-radius: 50%;
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
    position: absolute;
    top: -3px;
    left: -3px;
    width: 6px;
    height: 6px;
    background: rgb(var(--color-mauve));
    border-radius: 50%;
    will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
    .cursor-ring {
        display: none;
    }
}
</style>
