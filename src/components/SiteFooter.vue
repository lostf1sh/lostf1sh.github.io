<script setup>
import { computed } from "vue";

const links = [
    { label: "github", href: "https://github.com/lostf1sh" },
    { label: "instagram", href: "https://www.instagram.com/kawaiimoli" },
];

const kbHint = computed(() => {
    const mac = typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
    return mac ? "⌘K" : "Ctrl K";
});
</script>

<template>
    <footer
        class="mt-10 pt-6 border-t border-ink-surface/40 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-ink-subtle"
    >
        <div class="flex items-center gap-x-5">
            <a
                v-for="link in links"
                :key="link.label"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-ink-mint transition-colors"
            >
                {{ link.label }}
            </a>
        </div>

        <div class="flex items-center gap-4">
            <span class="hidden sm:inline-flex items-center gap-1.5 text-ink-subtle/70">
                <kbd class="footer-kbd">{{ kbHint }}</kbd>
                search
            </span>
            <router-link to="/" class="hover:text-ink-mint transition-colors">moli.codes</router-link>
        </div>
    </footer>
</template>

<style scoped>
.footer-kbd {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.7rem;
    color: rgb(var(--color-subtle));
    border: 1px solid rgb(var(--color-surface));
    border-radius: 4px;
    padding: 0.05rem 0.3rem;
}
</style>
