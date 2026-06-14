<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { theme, setTheme } from "@/utils/theme";

const router = useRouter();
const open = ref(false);
const query = ref("");
const inputRef = ref(null);
const copied = ref(false);
let copiedTimer = null;

const isTypingTarget = (target) => {
    const tag = target?.tagName?.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
};

const closePalette = () => {
    open.value = false;
    query.value = "";
};

const postCommands = ref([]);

const loadPostCommands = async () => {
    if (postCommands.value.length) return;
    const { getAllPosts } = await import("@/services/blogService");
    postCommands.value = getAllPosts().map((p) => ({
        id: `post-${p.slug}`,
        label: p.title,
        hint: "post",
        action: () => go({ name: "Blog", params: { slug: p.slug } }),
    }));
};

const openPalette = async (prefix = "") => {
    open.value = true;
    query.value = prefix;
    loadPostCommands();
    await nextTick();
    inputRef.value?.focus();
};

const go = (to) => {
    router.push(to);
    closePalette();
};

const copyUrl = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        if (copiedTimer) clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => { copied.value = false; }, 1200);
    } catch {
        copied.value = false;
    }
};

const openRandomPost = async () => {
    const { getAllPosts } = await import("@/services/blogService");
    const posts = getAllPosts();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    if (randomPost) go({ name: "Blog", params: { slug: randomPost.slug } });
};

const toggleAquarium = () => {
    window.dispatchEvent(new CustomEvent("aquarium:toggle"));
    closePalette();
};

const feedAquarium = () => {
    window.dispatchEvent(new CustomEvent("aquarium:feed"));
    closePalette();
};

const commands = computed(() => {
    return [
        { id: "home", label: "home", hint: "/", action: () => go({ name: "Home" }) },
        { id: "blog", label: "writing", hint: "/blog", action: () => go({ name: "Blog" }) },
        { id: "projects", label: "projects", hint: "/projects", action: () => go({ name: "Projects" }) },
        { id: "now", label: "now", hint: "/now", action: () => go({ name: "Now" }) },
        { id: "colophon", label: "colophon", hint: "/colophon", action: () => go({ name: "Colophon" }) },
        {
            id: "theme",
            label: `switch to ${theme.value === "dark" ? "light" : "dark"} mode`,
            hint: "theme",
            action: () => {
                setTheme(theme.value === "dark" ? "light" : "dark");
                closePalette();
            },
        },
        { id: "copy", label: "copy link to this page", hint: copied.value ? "copied" : "share", action: copyUrl },
        { id: "random", label: "open a random post", hint: "shuffle", action: openRandomPost },
        { id: "aquarium-toggle", label: "toggle the aquarium", hint: "background", action: toggleAquarium },
        { id: "aquarium-feed", label: "feed the fish", hint: "aquarium", action: feedAquarium },
    ].filter(Boolean);
});

const hiddenCommands = [
    {
        id: "frenzy",
        label: "release the school",
        hint: "↑↑↓↓←→←→ba",
        action: () => {
            window.dispatchEvent(new CustomEvent("aquarium:frenzy"));
            closePalette();
        },
    },
];

const filteredCommands = computed(() => {
    const needle = query.value.replace(/^[:/]\s*/, "").trim().toLowerCase();
    if (!needle) return commands.value;
    return [...commands.value, ...hiddenCommands, ...postCommands.value].filter((command) =>
        `${command.label} ${command.hint}`.toLowerCase().includes(needle),
    );
});

const runCommand = (command = filteredCommands.value[0]) => {
    if (!command) return;
    command.action();
};

const onKeydown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open.value ? closePalette() : openPalette();
        return;
    }

    if (open.value) {
        if (event.key === "Escape") {
            event.preventDefault();
            closePalette();
        }
        if (event.key === "Enter") {
            event.preventDefault();
            runCommand();
        }
        return;
    }

    if (isTypingTarget(event.target)) return;
    if (event.key === "/" || event.key === ":") {
        event.preventDefault();
        openPalette(event.key);
    }
};

onMounted(() => {
    window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown);
    if (copiedTimer) clearTimeout(copiedTimer);
});
</script>

<template>
    <Teleport to="body">
        <Transition name="palette">
            <div v-if="open" class="palette-backdrop" @click.self="closePalette">
                <div class="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
                    <div class="palette-input-row">
                        <svg class="palette-search" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6" />
                            <path d="M21 21l-4.5-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                        </svg>
                        <input
                            ref="inputRef"
                            v-model="query"
                            type="text"
                            spellcheck="false"
                            autocomplete="off"
                            aria-label="Command"
                            placeholder="jump to a page or run a command"
                        />
                        <kbd class="palette-kbd">esc</kbd>
                    </div>

                    <div class="palette-list">
                        <button
                            v-for="command in filteredCommands"
                            :key="command.id"
                            type="button"
                            class="palette-item"
                            @click="runCommand(command)"
                        >
                            <span class="palette-item-label">{{ command.label }}</span>
                            <span class="palette-item-hint">{{ command.hint }}</span>
                        </button>
                        <div v-if="!filteredCommands.length" class="palette-empty">no matches</div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.palette-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99998;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 16vh 1rem 1rem;
    background: rgb(var(--color-crust) / 0.5);
    backdrop-filter: blur(3px);
}

.command-palette {
    position: relative;
    width: min(540px, 100%);
    border: 1px solid rgb(var(--color-overlay) / 0.7);
    background: rgb(var(--color-base) / 0.98);
    color: rgb(var(--color-text));
    overflow: hidden;
}

.palette-input-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border-bottom: 1px solid rgb(var(--color-surface) / 0.7);
    padding: 0.85rem 1rem;
    font-size: 0.875rem;
}

.palette-search {
    flex-shrink: 0;
    color: rgb(var(--color-subtle) / 0.7);
}

.palette-input-row input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    color: rgb(var(--color-text));
    font: inherit;
}

.palette-input-row input::placeholder {
    color: rgb(var(--color-subtle) / 0.6);
}

.palette-kbd {
    flex-shrink: 0;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.625rem;
    color: rgb(var(--color-subtle));
    border: 1px solid rgb(var(--color-surface));
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
}

.palette-list {
    max-height: 320px;
    overflow-y: auto;
    padding: 0.35rem;
}

.palette-item {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0.7rem;
    color: rgb(var(--color-text));
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
}

.palette-item-hint {
    min-width: 0;
    flex-shrink: 0;
    overflow: hidden;
    color: rgb(var(--color-subtle) / 0.7);
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8125rem;
}

.palette-item:hover,
.palette-item:focus-visible {
    background: rgb(var(--color-surface) / 0.5);
    color: rgb(var(--color-mint));
}

.palette-item:hover .palette-item-hint,
.palette-item:focus-visible .palette-item-hint {
    color: rgb(var(--color-mint) / 0.7);
}

.palette-empty {
    padding: 0.85rem;
    color: rgb(var(--color-subtle) / 0.6);
    font-size: 0.875rem;
}

.palette-enter-active,
.palette-leave-active {
    transition: opacity 0.18s ease;
}

.palette-enter-active .command-palette,
.palette-leave-active .command-palette {
    transition: transform 0.18s ease, opacity 0.18s ease;
}

.palette-enter-from,
.palette-leave-to {
    opacity: 0;
}

.palette-enter-from .command-palette,
.palette-leave-to .command-palette {
    opacity: 0;
    transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
    .palette-enter-active,
    .palette-leave-active,
    .palette-enter-active .command-palette,
    .palette-leave-active .command-palette {
        transition: none;
    }
    .palette-backdrop { backdrop-filter: none; }
}
</style>
