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
        class="back-to-top no-external"
    >
        <span class="sr-only">Back to top</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 19V5"/>
            <path d="M5 12l7-7 7 7"/>
        </svg>
    </button>
</template>

<style scoped>
.back-to-top {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9997;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid rgb(var(--color-surface));
    background: rgb(var(--color-base) / 0.8);
    backdrop-filter: blur(8px);
    color: rgb(var(--color-subtle));
    transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.3s ease;
    opacity: 0;
    animation: btt-in 0.3s ease forwards;
}

.back-to-top:hover {
    color: rgb(var(--color-mauve));
    border-color: rgb(var(--color-mauve) / 0.4);
    transform: translateY(-2px);
}

@keyframes btt-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
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
