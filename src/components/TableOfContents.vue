<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

const props = defineProps({
    headings: { type: Array, default: () => [] },
});

const activeId = ref("");
const navRef = ref(null);
const fixedStyle = ref({});
let observer = null;
let rafId = null;

const updateFixedPosition = () => {
    if (!navRef.value) return;
    const wrapper = navRef.value.parentElement;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    fixedStyle.value = {
        position: "fixed",
        top: "2rem",
        left: `${rect.left}px`,
        width: `${rect.width}px`,
    };
};

const onScroll = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateFixedPosition);
};

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
    updateFixedPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFixedPosition, { passive: true });
});

onBeforeUnmount(() => {
    if (observer) observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", updateFixedPosition);
});
</script>

<template>
    <nav
        v-if="headings.length"
        ref="navRef"
        class="hidden lg:block max-h-[calc(100vh-4rem)] overflow-y-auto z-50"
        :style="fixedStyle"
    >
        <div class="text-catppuccin-subtle text-xs mb-3">~$ toc</div>
        <ul class="space-y-1 text-xs">
            <li
                v-for="heading in headings"
                :key="heading.id"
            >
                <button
                    @click="scrollTo(heading.id)"
                    class="text-left w-full truncate transition-colors cursor-pointer py-0.5"
                    :class="[
                        heading.level === 3 ? 'pl-5' : 'pl-2',
                        activeId === heading.id && heading.level === 2
                            ? 'text-catppuccin-blue border-l-2 border-catppuccin-blue'
                            : '',
                        activeId === heading.id && heading.level === 3
                            ? 'text-catppuccin-mauve border-l-2 border-catppuccin-mauve'
                            : '',
                        activeId !== heading.id && heading.level === 2
                            ? 'text-catppuccin-subtle hover:text-catppuccin-blue border-l-2 border-transparent'
                            : '',
                        activeId !== heading.id && heading.level === 3
                            ? 'text-catppuccin-overlay hover:text-catppuccin-mauve border-l-2 border-transparent'
                            : '',
                    ]"
                >
                    {{ heading.text }}
                </button>
            </li>
        </ul>
    </nav>
</template>
