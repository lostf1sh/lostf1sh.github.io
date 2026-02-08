<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import "prismjs/themes/prism-tomorrow.css";
import {
    getAllPosts,
    getPostBySlug,
    formatDate,
} from "@/services/blogService";

const view = ref("list");
const currentPost = ref(null);
const posts = ref([]);
const articleContentRef = ref(null);
let clipboard = null;
let PrismInstance = null;
let ClipboardConstructor = null;

const route = useRoute();
const router = useRouter();

const loadPosts = () => {
    posts.value = getAllPosts();
};

const openPost = (slug) => {
    currentPost.value = getPostBySlug(slug);
    if (currentPost.value) {
        view.value = "post";
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (route.query.post !== slug) {
            router.replace({
                name: "Blog",
                query: { ...route.query, post: slug },
            });
        }
        void highlightCodeBlocks();
    } else if (route.query.post) {
        const newQuery = { ...route.query };
        delete newQuery.post;
        router.replace({ name: "Blog", query: newQuery });
    }
};

const goBack = ({ skipQueryUpdate = false } = {}) => {
    view.value = "list";
    currentPost.value = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (clipboard) {
        clipboard.destroy();
        clipboard = null;
    }
    if (!skipQueryUpdate && "post" in route.query) {
        const newQuery = { ...route.query };
        delete newQuery.post;
        router.replace({ name: "Blog", query: newQuery });
    }
};

const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
};

const escapeHtml = (text = "") => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const sanitizeExternalUrl = (url = "") => {
    const trimmedUrl = url.trim();
    if (/^(https?:\/\/|mailto:|\/)/i.test(trimmedUrl)) {
        return trimmedUrl;
    }
    return "#";
};

const ensurePostEnhancers = async () => {
    if (PrismInstance && ClipboardConstructor) return;
    const [prismModule, clipboardModule] = await Promise.all([
        import("prismjs"),
        import("clipboard"),
        import("prismjs/components/prism-javascript"),
        import("prismjs/components/prism-python"),
        import("prismjs/components/prism-bash"),
        import("prismjs/components/prism-css"),
        import("prismjs/components/prism-markup"),
    ]);
    PrismInstance = prismModule.default;
    ClipboardConstructor = clipboardModule.default;
};

const setupClipboard = () => {
    if (clipboard) {
        clipboard.destroy();
        clipboard = null;
    }
    if (!ClipboardConstructor) return;
    clipboard = new ClipboardConstructor("[data-clipboard-target]");
    clipboard.on("success", (e) => {
        const button = e.trigger;
        const originalText = button.textContent;
        button.textContent = "copied!";
        button.classList.add("text-catppuccin-green");
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("text-catppuccin-green");
        }, 2000);
        e.clearSelection();
    });
};

const highlightCodeBlocks = async () => {
    await ensurePostEnhancers();
    await nextTick();
    if (PrismInstance && articleContentRef.value) {
        PrismInstance.highlightAllUnder(articleContentRef.value);
    }
    setupClipboard();
};

const parseMarkdown = (content) => {
    let html = content;

    // Store code blocks temporarily to prevent other replacements from affecting them
    const codeBlocks = [];
    html = html.replace(/```(\w*)\s*\n?([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `__CODEBLOCK_${codeBlocks.length}__`;
        const escapedCode = escapeHtml(code.trim());

        const languageClass = lang ? `language-${lang.toLowerCase()}` : "";
        const blockId = `code-block-${codeBlocks.length}`;

        codeBlocks.push(
            `<div class="relative group">
                <button data-clipboard-target="#${blockId}" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-catppuccin-subtle hover:text-catppuccin-mauve px-2 py-1 bg-catppuccin-crust border border-catppuccin-surface rounded hover:bg-catppuccin-mauve/10 cursor-pointer z-10">
                    copy
                </button>
                <pre class="bg-catppuccin-surface/50 border border-catppuccin-overlay/30 rounded p-4 overflow-x-auto my-4"><code id="${blockId}" class="${languageClass}">${escapedCode}</code></pre>
            </div>`
        );
        return placeholder;
    });

    // Parse tables
    const tables = [];
    html = html.replace(/((?:\|[^\n]+\|\r?\n?)+)/g, (match) => {
        // Check if this looks like a table (has at least header and separator)
        const lines = match.trim().split(/\r?\n/);
        if (lines.length < 2) return match;
        
        // Check for separator row (|---|---|)
        const hasSeparator = /^\|[\s\-:|]+\|$/.test(lines[1]);
        if (!hasSeparator) return match;
        
        const placeholder = `__TABLE_${tables.length}__`;
        const headerRow = lines[0];
        const dataRows = lines.slice(2);
        
        let tableHtml = '<table class="w-full my-4 text-sm border-collapse">';
        
        const headers = headerRow.split('|').filter(c => c.trim());
        tableHtml += '<thead><tr>';
        headers.forEach(h => {
            tableHtml += `<th class="border border-catppuccin-surface px-3 py-2 text-left text-catppuccin-mauve bg-catppuccin-surface/30">${escapeHtml(h.trim())}</th>`;
        });
        tableHtml += '</tr></thead>';
        
        tableHtml += '<tbody>';
        dataRows.forEach(row => {
            if (row.trim() && !/^\|[\s\-:|]+\|$/.test(row)) {
                const cells = row.split('|').filter(c => c.trim());
                tableHtml += '<tr>';
                cells.forEach(c => {
                    tableHtml += `<td class="border border-catppuccin-surface px-3 py-2 text-catppuccin-text">${escapeHtml(c.trim())}</td>`;
                });
                tableHtml += '</tr>';
            }
        });
        tableHtml += '</tbody></table>';
        
        tables.push(tableHtml);
        return placeholder;
    });

    html = escapeHtml(html);

    html = html.replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold text-catppuccin-mauve mt-6 mb-3">$1</h3>',
    );
    html = html.replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold text-catppuccin-blue mt-8 mb-4">$1</h2>',
    );
    html = html.replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold text-catppuccin-text mt-8 mb-4">$1</h1>',
    );

    html = html.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-catppuccin-mauve font-semibold">$1</strong>',
    );
    html = html.replace(
        /`([^`]+)`/g,
        '<code class="bg-catppuccin-surface/50 px-2 py-0.5 rounded text-catppuccin-pink text-sm">$1</code>',
    );
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
        const safeUrl = sanitizeExternalUrl(url);
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-catppuccin-blue hover:text-catppuccin-mauve underline transition-colors">${label}</a>`;
    });
    html = html.replace(
        /^\- (.*$)/gim,
        '<li class="ml-6 list-disc text-catppuccin-text mb-1">$1</li>',
    );

    html = html
        .split("\n\n")
        .map((p) => {
            if (!p.trim().startsWith("<") && !p.trim().startsWith("__CODEBLOCK_") && !p.trim().startsWith("__TABLE_")) {
                return `<p class="text-catppuccin-text leading-relaxed mb-4">${p}</p>`;
            }
            return p;
        })
        .join("\n");

    // Restore code blocks
    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODEBLOCK_${i}__`, block);
    });

    // Restore tables
    tables.forEach((table, i) => {
        html = html.replace(`__TABLE_${i}__`, table);
    });

    return html;
};

const readingTime = (content) => {
    const text = content.replace(/```[\s\S]*?```/g, '') // Remove code blocks
                       .replace(/[^\w\s]/g, ' ') // Remove special chars
                       .replace(/\s+/g, ' ') // Normalize spaces
                       .trim();
    return calculateReadingTime(text);
};

onMounted(() => {
    loadPosts();
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    const slugFromQuery = route.query.post;
    if (slugFromQuery) {
        openPost(slugFromQuery);
    }
});

onBeforeUnmount(() => {
    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
    if (clipboard) {
        clipboard.destroy();
        clipboard = null;
    }
});

watch(
    () => route.query.post,
    (slug, prevSlug) => {
        if (slug && slug !== prevSlug) {
            openPost(slug);
        } else if (!slug && view.value === "post") {
            goBack({ skipQueryUpdate: true });
        }
    },
);
</script>

<template>
    <div
        class="w-full min-h-screen overflow-x-hidden overflow-y-auto font-mono"
    >
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4">
            <Transition name="fade" mode="out-in">
                <div v-if="view === 'list'" key="list">
                    <div class="mb-12">
                        <div class="text-catppuccin-subtle text-sm mb-2">
                            ~$ cd ~/blog
                        </div>
                        <h1
                            class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"
                        >
                            <span class="text-catppuccin-mauve">blog</span>
                        </h1>
                        <p
                            class="text-sm text-catppuccin-gray leading-relaxed mb-6"
                        >
                            thoughts on code, tools, and random stuff i find
                            interesting.
                        </p>

                        <div class="flex items-center gap-4 text-sm mb-6">
                            <router-link
                                to="/"
                                class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                            >
                                [← home]
                            </router-link>
                        </div>

                    </div>

                    <div class="border-l-2 border-catppuccin-surface pl-4">
                        <div class="text-catppuccin-subtle text-sm mb-3">
                            ~$ ls -la posts/
                        </div>

                        <div
                            v-if="!posts.length"
                            class="text-sm text-catppuccin-subtle"
                        >
                            no posts found
                        </div>

                        <div v-else class="space-y-3">
                            <button
                                v-for="post in posts"
                                :key="post.id"
                                type="button"
                                @click="openPost(post.slug)"
                                class="block w-full text-left group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-catppuccin-mauve transition-all cursor-pointer"
                            >
                                <div class="px-4 py-3">
                                    <div
                                        class="flex items-start justify-between gap-4 mb-2"
                                    >
                                        <h2
                                            class="text-base font-semibold text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors"
                                        >
                                            {{ post.title }}
                                        </h2>
                                        <span
                                            class="text-xs text-catppuccin-subtle flex-shrink-0"
                                        >
                                            {{ formatDate(post.date) }}
                                        </span>
                                    </div>

                                    <p
                                        class="text-sm text-catppuccin-gray mb-3 leading-relaxed"
                                    >
                                        {{ post.excerpt }}
                                    </p>

                                    <div class="flex items-center gap-2">
                                        <div class="flex flex-wrap gap-1.5">
                                            <span
                                                v-for="tag in post.tags"
                                                :key="tag"
                                                class="px-2 py-0.5 rounded text-xs bg-catppuccin-surface/60 text-catppuccin-subtle"
                                            >
                                                #{{ tag }}
                                            </span>
                                        </div>
                                        <span
                                            class="ml-auto text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors text-sm"
                                        >
                                            read →
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="view === 'post' && currentPost" key="post">
                    <div class="mb-8">
                        <div class="text-catppuccin-subtle text-sm mb-2">
                            ~$ cat {{ currentPost.slug }}.md
                        </div>

                        <button
                            @click="goBack"
                            class="text-sm text-catppuccin-subtle hover:text-catppuccin-text transition-colors mb-6 inline-flex items-center gap-1"
                        >
                            ← back to posts
                        </button>

                        <h1
                            class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-3"
                        >
                            {{ currentPost.title }}
                        </h1>

                        <div
                            class="flex items-center gap-4 text-sm text-catppuccin-subtle mb-4"
                        >
                            <span>{{ formatDate(currentPost.date) }}</span>
                            <span class="text-catppuccin-surface">•</span>
                            <span>~{{ readingTime(currentPost.content) }} min read</span>
                            <span class="text-catppuccin-surface">•</span>
                            <div class="flex gap-2">
                                <span
                                    v-for="tag in currentPost.tags"
                                    :key="tag"
                                    class="text-catppuccin-gray"
                                >
                                    #{{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <article
                        class="border-l-2 border-catppuccin-surface pl-4 mb-8"
                    >
                        <div
                            ref="articleContentRef"
                            class="prose prose-invert max-w-none text-catppuccin-text"
                            v-html="parseMarkdown(currentPost.content)"
                        ></div>
                    </article>

                    <div class="border-l-2 border-catppuccin-surface pl-4">
                        <button
                            @click="goBack"
                            class="text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors inline-flex items-center gap-1"
                        >
                            ← back to all posts
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: all 0.3s ease-out;
}

.fade-leave-active {
    transition: all 0.2s ease-in;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

article :deep(a) {
    word-break: break-word;
}

article :deep(ul) {
    margin: 1rem 0;
}

article :deep(pre) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.875rem;
    line-height: 1.6;
}

article :deep(code) {
    font-family: "JetBrains Mono", monospace;
}
</style>
