<template>
    <div class="accent-aura" aria-hidden="true"></div>
</template>

<style scoped>
.accent-aura {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: var(--accent-aura, 0);
    background: radial-gradient(
        70vw 55vh at 50% -12%,
        rgb(var(--color-mint) / 0.3),
        transparent 62%
    );
    mix-blend-mode: screen;
    transform-origin: 50% 0;
    animation: aura-breathe 9s ease-in-out infinite;
    will-change: transform, opacity;
}

[data-theme="light"] .accent-aura {
    mix-blend-mode: multiply;
}

@keyframes aura-breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
    .accent-aura { animation: none; }
}

@media (prefers-reduced-transparency: reduce) {
    .accent-aura { display: none; }
}
</style>
