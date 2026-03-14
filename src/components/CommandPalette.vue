<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { toggleTheme, theme } from "@/utils/theme";
import { getAllPosts } from "@/services/blogService";

const router = useRouter();
const isOpen = ref(false);
const query = ref("");
const selectedIndex = ref(0);
const inputRef = ref(null);

const pages = [
    { type: "page", label: "home", description: "go to homepage", path: "/" },
    { type: "page", label: "blog", description: "read blog posts", path: "/blog" },
    { type: "page", label: "projects", description: "view projects", path: "/projects" },
    { type: "page", label: "uses", description: "tools & setup", path: "/uses" },
    { type: "page", label: "now", description: "what i'm doing now", path: "/now" },
];

const themeAction = computed(() => ({
    type: "theme",
    label: theme.value === "dark" ? "switch to light mode" : "switch to dark mode",
    description: "toggle theme",
}));

const blogPosts = computed(() => {
    return getAllPosts().map(post => ({
        type: "blog",
        label: post.title,
        description: post.excerpt || "blog post",
        slug: post.slug,
    }));
});

const filteredActions = computed(() => {
    const q = query.value.toLowerCase().trim();
    const all = [
        ...pages,
        themeAction.value,
        ...blogPosts.value,
    ];

    if (!q) {
        return [
            ...pages,
            themeAction.value,
            ...blogPosts.value.slice(0, 5),
        ];
    }

    return all.filter(action =>
        action.label.toLowerCase().includes(q) ||
        action.description.toLowerCase().includes(q)
    );
});

const open = () => {
    isOpen.value = true;
    query.value = "";
    selectedIndex.value = 0;
    nextTick(() => inputRef.value?.focus());
};

const close = () => {
    isOpen.value = false;
    query.value = "";
};

const execute = (action) => {
    if (action.type === "page") {
        router.push(action.path);
    } else if (action.type === "theme") {
        toggleTheme();
    } else if (action.type === "blog") {
        router.push({ path: "/blog", query: { post: action.slug } });
    }
    close();
};

const handleKeydown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen.value) {
            close();
        } else {
            open();
        }
    }

    if (!isOpen.value) return;

    if (e.key === "Escape") {
        close();
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex.value = Math.min(selectedIndex.value + 1, filteredActions.value.length - 1);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
    } else if (e.key === "Enter") {
        e.preventDefault();
        const action = filteredActions.value[selectedIndex.value];
        if (action) execute(action);
    }
};

watch(query, () => {
    selectedIndex.value = 0;
});

onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="fixed inset-0 z-[9997] flex items-start justify-center pt-[20vh] font-mono"
            @click.self="close"
        >
            <div class="fixed inset-0 bg-catppuccin-crust/80 backdrop-blur-sm palette-backdrop" @click="close"></div>

            <div class="relative z-10 w-full max-w-lg mx-4 rounded-md border border-catppuccin-surface bg-catppuccin-base shadow-2xl overflow-hidden palette-modal">
                <div class="flex items-center gap-2 px-4 py-3 border-b border-catppuccin-surface">
                    <span class="text-catppuccin-subtle text-sm">~$</span>
                    <input
                        ref="inputRef"
                        v-model="query"
                        type="text"
                        placeholder="type a command..."
                        class="flex-1 bg-transparent text-catppuccin-text text-sm outline-none placeholder:text-catppuccin-overlay"
                    />
                    <kbd class="text-xs text-catppuccin-subtle px-1.5 py-0.5 rounded border border-catppuccin-surface">esc</kbd>
                </div>

                <div class="max-h-[300px] overflow-y-auto py-2">
                    <div v-if="!filteredActions.length" class="px-4 py-3 text-sm text-catppuccin-subtle">
                        no results found
                    </div>

                    <button
                        v-for="(action, i) in filteredActions"
                        :key="`${action.type}-${action.label}`"
                        @click="execute(action)"
                        @mouseenter="selectedIndex = i"
                        class="w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors cursor-pointer"
                        :class="i === selectedIndex
                            ? 'bg-catppuccin-surface/40 border-l-2 border-catppuccin-mauve pl-3.5'
                            : 'border-l-2 border-transparent'"
                    >
                        <span
                            class="text-xs flex-shrink-0 w-12"
                            :class="{
                                'text-catppuccin-blue': action.type === 'page',
                                'text-catppuccin-yellow': action.type === 'theme',
                                'text-catppuccin-green': action.type === 'blog',
                            }"
                        >
                            {{ action.type === 'page' ? 'page' : action.type === 'theme' ? 'theme' : 'post' }}
                        </span>
                        <div class="min-w-0 flex-1">
                            <div class="text-catppuccin-text truncate">{{ action.label }}</div>
                        </div>
                    </button>
                </div>

                <div class="px-4 py-2 border-t border-catppuccin-surface flex items-center gap-4 text-xs text-catppuccin-subtle">
                    <span>↑↓ navigate</span>
                    <span>↵ select</span>
                    <span>esc close</span>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.palette-backdrop {
    animation: backdrop-in 0.15s ease-out;
}

.palette-modal {
    animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes backdrop-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes modal-in {
    from {
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
