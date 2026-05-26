<script setup>
defineProps({
    visible: Boolean,
});

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
    <button
        v-if="visible"
        type="button"
        @click="scrollToTop"
        aria-label="Back to top"
        class="back-to-top"
    >
        <span class="sr-only">Back to top</span>
        [↑]
    </button>
</template>

<style scoped>
.back-to-top {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9997;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    border: 1px solid rgb(var(--color-surface));
    background: rgb(var(--color-base) / 0.95);
    color: rgb(var(--color-subtle));
    padding: 6px 8px;
    transition: color 0.15s ease, border-color 0.15s ease, opacity 0.3s ease;
    opacity: 0;
    animation: btt-in 0.2s ease forwards;
}

.back-to-top:hover {
    color: rgb(var(--color-text));
    border-color: rgb(var(--color-overlay));
}

@keyframes btt-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

@media (prefers-reduced-motion: reduce) {
    .back-to-top {
        animation: none;
        opacity: 1;
    }
}
</style>
