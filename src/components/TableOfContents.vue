<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

const props = defineProps({
    headings: { type: Array, default: () => [] },
});

const activeId = ref("");
let observer = null;

const setupObserver = () => {
    if (observer) observer.disconnect();

    const elements = props.headings
        .map(h => document.getElementById(h.id))
        .filter(Boolean);

    if (!elements.length) return;

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeId.value = entry.target.id;
                }
            });

            const allAbove = entries
                .filter(e => e.boundingClientRect.top < 0)
                .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

            if (allAbove.length && !entries.some(e => e.isIntersecting)) {
                activeId.value = allAbove[0].target.id;
            }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
};

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
    }
};

watch(() => props.headings, () => {
    nextTick(setupObserver);
}, { deep: true });

onMounted(() => {
    if (props.headings.length) {
        nextTick(setupObserver);
    }
});

onBeforeUnmount(() => {
    if (observer) observer.disconnect();
});
</script>

<template>
    <nav v-if="headings.length" class="max-h-[calc(100vh-8rem)] overflow-y-auto">
        <ul class="space-y-1 text-xs">
            <li
                v-for="heading in headings"
                :key="heading.id"
            >
                <button
                    @click="scrollTo(heading.id)"
                    class="text-left w-full truncate transition-colors cursor-pointer py-0.5"
                    :class="[
                        heading.level === 3 ? 'pl-3' : 'pl-0',
                        activeId === heading.id
                            ? 'text-catppuccin-mauve'
                            : 'text-catppuccin-subtle hover:text-catppuccin-text',
                    ]"
                >
                    {{ heading.text }}
                </button>
            </li>
        </ul>
    </nav>
</template>