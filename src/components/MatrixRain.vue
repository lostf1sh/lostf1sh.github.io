<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvas = ref(null);
let animationId = null;
let columns = [];
let ctx = null;
let width = 0;
let height = 0;
let lastTime = 0;
const FPS_INTERVAL = 1000 / 30;

const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 14;

let cachedGreenColor = null;
let cachedBaseColor = null;

const updateCachedColors = () => {
    const style = getComputedStyle(document.documentElement);
    cachedGreenColor = style.getPropertyValue("--color-green").trim() || "166 227 161";
    cachedBaseColor = style.getPropertyValue("--color-base").trim() || "30 30 46";
};

const themeObserver = new MutationObserver(() => updateCachedColors());

const init = () => {
    if (!canvas.value) return;
    ctx = canvas.value.getContext("2d");
    resize();
};

const resize = () => {
    if (!canvas.value) return;
    width = canvas.value.parentElement.offsetWidth;
    height = canvas.value.parentElement.offsetHeight;
    canvas.value.width = width;
    canvas.value.height = height;

    const colCount = Math.floor(width / fontSize);
    columns = Array.from({ length: colCount }, () => ({
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.7,
    }));
};

const draw = (timestamp) => {
    animationId = requestAnimationFrame(draw);

    const elapsed = timestamp - lastTime;
    if (elapsed < FPS_INTERVAL) return;
    lastTime = timestamp - (elapsed % FPS_INTERVAL);

    if (!ctx) return;

    const baseRgb = cachedBaseColor || "30 30 46";
    ctx.fillStyle = `rgba(${baseRgb.replace(/ /g, ", ")}, 0.05)`;
    ctx.fillRect(0, 0, width, height);

    const rgb = cachedGreenColor || "166 227 161";
    ctx.fillStyle = `rgba(${rgb.replace(/ /g, ", ")}, 0.07)`;
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    columns.forEach((col, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        ctx.fillText(char, x, col.y);

        col.y += fontSize * col.speed;

        if (col.y > height && Math.random() > 0.98) {
            col.y = 0;
            col.speed = 0.3 + Math.random() * 0.7;
        }
    });
};

const start = () => {
    lastTime = 0;
    animationId = requestAnimationFrame(draw);
};

let resizeTimeout = null;
const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
};

onMounted(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    updateCachedColors();
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    init();
    start();
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId);
    themeObserver.disconnect();
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimeout);
});
</script>

<template>
    <canvas
        ref="canvas"
        class="absolute inset-0 w-full h-full pointer-events-none"
        style="z-index: 0;"
    />
</template>
