<script setup>
defineProps({
    size: { type: Number, default: 24 },
});
</script>

<template>
    <div class="enso-loader" aria-label="Loading">
        <svg
            class="enso-loader-svg"
            :style="{ width: `${size}px`, height: `${size}px` }"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                class="enso-loader-circle"
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="currentColor"
                stroke-width="6"
                stroke-linecap="round"
                stroke-dasharray="239"
                stroke-dashoffset="239"
                :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
            />
        </svg>
    </div>
</template>

<style scoped>
.enso-loader {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgb(var(--color-overlay));
}

.enso-loader-circle {
    animation: enso-loader-draw 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes enso-loader-draw {
    0% {
        stroke-dashoffset: 239;
        opacity: 0.4;
    }
    50% {
        opacity: 1;
    }
    100% {
        stroke-dashoffset: 0;
        opacity: 0.4;
    }
}

@media (prefers-reduced-motion: reduce) {
    .enso-loader-circle {
        animation: none;
        stroke-dashoffset: 100;
        opacity: 0.5;
    }
}
</style>
