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

const openPalette = async (prefix = "") => {
    open.value = true;
    query.value = prefix;
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
        { id: "home", label: "open home", hint: "cd ~", action: () => go({ name: "Home" }) },
        { id: "blog", label: "open blog", hint: "ls posts", action: () => go({ name: "Blog" }) },
        { id: "projects", label: "open projects", hint: "ls repos", action: () => go({ name: "Projects" }) },
        { id: "now", label: "open now", hint: "cat now.md", action: () => go({ name: "Now" }) },
        { id: "uses", label: "open uses", hint: "cat uses.md", action: () => go({ name: "Uses" }) },
        {
            id: "theme",
            label: `theme ${theme.value === "dark" ? "light" : "dark"}`,
            hint: "toggle theme",
            action: () => {
                setTheme(theme.value === "dark" ? "light" : "dark");
                closePalette();
            },
        },
        { id: "copy", label: "copy url", hint: copied.value ? "copied" : "clipboard", action: copyUrl },
        { id: "random", label: "random post", hint: "shuffle posts", action: openRandomPost },
        { id: "aquarium-toggle", label: "toggle aquarium", hint: "fishtank", action: toggleAquarium },
        { id: "aquarium-feed", label: "feed fish", hint: "drop pellets", action: feedAquarium },
    ].filter(Boolean);
});

const filteredCommands = computed(() => {
    const needle = query.value.replace(/^[:/]\s*/, "").trim().toLowerCase();
    if (!needle) return commands.value;
    return commands.value.filter((command) =>
        `${command.label} ${command.hint}`.toLowerCase().includes(needle),
    );
});

const runCommand = (command = filteredCommands.value[0]) => {
    if (!command) return;
    command.action();
};

const onKeydown = (event) => {
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
        <div v-if="open" class="palette-backdrop" @click.self="closePalette">
            <div class="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
                <div class="palette-title">command</div>
                <div class="palette-input-row">
                    <span class="text-ink-subtle">$</span>
                    <input
                        ref="inputRef"
                        v-model="query"
                        type="text"
                        spellcheck="false"
                        autocomplete="off"
                        aria-label="Command"
                        placeholder="open blog"
                    />
                </div>

                <div class="palette-list">
                    <button
                        v-for="command in filteredCommands"
                        :key="command.id"
                        type="button"
                        class="palette-item"
                        @click="runCommand(command)"
                    >
                        <span>{{ command.label }}</span>
                        <span>{{ command.hint }}</span>
                    </button>
                    <div v-if="!filteredCommands.length" class="palette-empty">(no command)</div>
                </div>
            </div>
        </div>
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
    padding: 14vh 1rem 1rem;
    background: rgb(var(--color-crust) / 0.35);
}

.command-palette {
    position: relative;
    width: min(560px, 100%);
    border: 1px solid rgb(var(--color-overlay) / 0.7);
    background: rgb(var(--color-base) / 0.96);
    color: rgb(var(--color-text));
    box-shadow: 0 18px 50px rgb(var(--color-crust) / 0.28);
}

.palette-title {
    position: absolute;
    top: -0.65em;
    left: 1rem;
    background: rgb(var(--color-base));
    padding: 0 0.5rem;
    font-size: 10px;
    color: rgb(var(--color-subtle) / 0.6);
}

.palette-input-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border-bottom: 1px solid rgb(var(--color-surface) / 0.65);
    padding: 0.8rem 1rem;
    font-size: 12px;
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
    color: rgb(var(--color-subtle) / 0.35);
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
    padding: 0.55rem 0.65rem;
    color: rgb(var(--color-text));
    font-size: 12px;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
}

.palette-item span:last-child {
    min-width: 0;
    flex-shrink: 1;
    overflow: hidden;
    color: rgb(var(--color-subtle) / 0.42);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.palette-item:hover,
.palette-item:focus-visible {
    background: rgb(var(--color-surface) / 0.45);
}

.palette-empty {
    padding: 0.75rem;
    color: rgb(var(--color-subtle) / 0.45);
    font-size: 12px;
}
</style>
