<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { toggleTheme, theme } from "@/utils/theme";
import { getAllPosts, getAllTags } from "@/services/blogService";

const router = useRouter();
const isOpen = ref(false);
const query = ref("");
const selectedIndex = ref(0);
const inputRef = ref(null);

const pages = [
    { type: "page", label: "home", description: "go to homepage", path: "/" },
    { type: "page", label: "blog", description: "read blog posts", path: "/blog" },
    { type: "page", label: "projects", description: "view projects", path: "/projects" },
    { type: "page", label: "now", description: "what i'm doing now", path: "/now" },
];

const quickCommands = [
    {
        type: "command",
        label: "open rss feed",
        description: "open /rss.xml",
        href: "/rss.xml",
    },
    {
        type: "command",
        label: "open sitemap",
        description: "open /sitemap.xml",
        href: "/sitemap.xml",
    },
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
        tags: post.tags,
    }));
});

const blogTags = computed(() => {
    return getAllTags().map((tag) => ({
        type: "tag",
        label: `tag: ${tag}`,
        description: "filter blog posts by tag",
        tag,
    }));
});

const getScore = (action, q) => {
    const label = action.label.toLowerCase();
    const description = action.description.toLowerCase();
    let score = 0;

    if (label === q) score += 120;
    if (label.startsWith(q)) score += 80;
    if (label.includes(q)) score += 35;
    if (description.includes(q)) score += 15;

    if (action.type === "blog") {
        const tags = (action.tags || []).map((tag) => tag.toLowerCase());
        if (tags.some((tag) => tag.includes(q))) score += 25;
    }

    if (action.type === "tag" && action.tag.toLowerCase() === q) score += 40;

    return score;
};

const filteredActions = computed(() => {
    const q = query.value.toLowerCase().trim();
    const all = [
        ...quickCommands,
        ...pages,
        themeAction.value,
        ...blogTags.value,
        ...blogPosts.value,
    ];

    if (!q) {
        return [
            ...quickCommands,
            ...pages,
            themeAction.value,
            ...blogTags.value.slice(0, 6),
            ...blogPosts.value.slice(0, 5),
        ];
    }

    if (q.startsWith("tag:")) {
        const tagQuery = q.replace("tag:", "").trim();
        if (!tagQuery) return blogTags.value;

        return blogTags.value
            .filter((tagAction) => tagAction.tag.toLowerCase().includes(tagQuery))
            .sort((a, b) => getScore(b, q) - getScore(a, q));
    }

    if (q.startsWith("#")) {
        const tagQuery = q.replace("#", "").trim();
        return blogPosts.value.filter((post) =>
            (post.tags || []).some((tag) => tag.toLowerCase().includes(tagQuery)),
        );
    }

    return all
        .filter(action =>
            action.label.toLowerCase().includes(q) ||
            action.description.toLowerCase().includes(q),
        )
        .sort((a, b) => getScore(b, q) - getScore(a, q));
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
    } else if (action.type === "command") {
        window.open(action.href, "_blank", "noopener,noreferrer");
    } else if (action.type === "blog") {
        router.push({ path: `/blog/${action.slug}` });
    } else if (action.type === "tag") {
        query.value = `#${action.tag}`;
        selectedIndex.value = 0;
        return;
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

            <div role="dialog" aria-modal="true" aria-label="Command palette" class="relative z-10 w-full max-w-lg mx-4 rounded-md border border-catppuccin-surface bg-catppuccin-base shadow-2xl overflow-hidden palette-modal overscroll-contain">
                <div class="flex items-center gap-2 px-4 py-3 border-b border-catppuccin-surface">
                    <span class="text-catppuccin-subtle text-sm">~$</span>
                    <input
                        ref="inputRef"
                        v-model="query"
                        type="text"
                        placeholder="type a command or #tag…"
                        aria-label="Command search"
                        class="flex-1 bg-transparent text-catppuccin-text text-sm placeholder:text-catppuccin-overlay focus:outline-none"
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
                                'text-catppuccin-mauve': action.type === 'tag',
                                'text-catppuccin-peach': action.type === 'command',
                            }"
                        >
                            {{ action.type === 'page' ? 'page' : action.type === 'theme' ? 'theme' : action.type === 'tag' ? 'tag' : action.type === 'command' ? 'cmd' : 'post' }}
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
                    <span>#tag filter posts</span>
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

@media (prefers-reduced-motion: reduce) {
    .palette-backdrop,
    .palette-modal {
        animation: none;
    }
}
</style>
