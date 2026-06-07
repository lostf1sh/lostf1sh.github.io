<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    value: { type: Number, default: 0 },
    duration: { type: Number, default: 1100 },
    decimals: { type: Number, default: 0 },
});

const display = ref(0);
const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let raf = 0;

const animate = (to) => {
    if (reduce || to === display.value) {
        display.value = to;
        return;
    }
    const from = display.value;
    const start = performance.now();
    const step = (now) => {
        const t = Math.min(1, (now - start) / props.duration);
        const eased = 1 - Math.pow(1 - t, 3);
        display.value = from + (to - from) * eased;
        if (t < 1) raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
};

onMounted(() => animate(props.value));
watch(() => props.value, (v) => animate(v));
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
    <span style="font-variant-numeric: tabular-nums">{{ display.toFixed(decimals) }}</span>
</template>
