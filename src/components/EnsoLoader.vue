<script setup>
defineProps({
    size: { type: Number, default: 24 },
});
</script>

<template>
    <span class="term-loader" aria-label="Loading">...</span>
</template>

<style scoped>
.term-loader {
    display: inline;
    font-family: "JetBrains Mono", monospace;
    color: rgb(var(--color-subtle));
    animation: term-dots 1.2s step-end infinite;
}

@keyframes term-dots {
    0% { content: "."; }
    33% { content: ".."; }
    66% { content: "..."; }
}

@media (prefers-reduced-motion: reduce) {
    .term-loader {
        animation: none;
    }
}
</style>
