<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion, AnimatePresence } from "motion-v";
import "prismjs/themes/prism-tomorrow.css";
import {
    getAllPosts,
    getPostBySlug,
    formatDate,
} from "@/services/blogService";
import { updateMeta } from "@/utils/seo";
import {
    springs,
    staggerContainer,
    fadeUp,
    fadeLeft,
    scaleFade,
    cardHover,
    cardPress,
    linkHover,
} from "@/utils/motion";

const view = ref("list");
const currentPost = ref(null);
const posts = ref([]);
const articleContentRef = ref(null);
let PrismInstance = null;

const route = useRoute();
const router = useRouter();

const sortedPosts = computed(() => posts.value);

const adjacentPosts = computed(() => {
    if (!currentPost.value || !sortedPosts.value.length) return { prev: null, next: null };
    const idx = sortedPosts.value.findIndex((p) => p.slug === currentPost.value.slug);
    return {
        prev: idx < sortedPosts.value.length - 1 ? sortedPosts.value[idx + 1] : null,
        next: idx > 0 ? sortedPosts.value[idx - 1] : null,
    };
});

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
        updateMeta({
            title: `${currentPost.value.title} | f1sh.dev`,
            description: currentPost.value.excerpt,
            url: `https://f1sh.dev/blog?post=${slug}`,
        });
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
    updateMeta({
        title: "Blog | f1sh.dev",
        description: "Thoughts on code, tools, and random stuff.",
        url: "https://f1sh.dev/blog",
    });
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
    if (PrismInstance) return;
    const [prismModule] = await Promise.all([
        import("prismjs"),
        import("prismjs/components/prism-javascript"),
        import("prismjs/components/prism-python"),
        import("prismjs/components/prism-bash"),
        import("prismjs/components/prism-css"),
        import("prismjs/components/prism-markup"),
    ]);
    PrismInstance = prismModule.default;
};

const handleCopyClick = async (e) => {
    const button = e.target.closest("[data-copy-target]");
    if (!button) return;
    const targetId = button.getAttribute("data-copy-target");
    const codeEl = document.getElementById(targetId);
    if (!codeEl) return;
    try {
        await navigator.clipboard.writeText(codeEl.textContent);
        const originalText = button.textContent;
        button.textContent = "copied!";
        button.classList.add("text-catppuccin-green");
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("text-catppuccin-green");
        }, 2000);
    } catch {
        // Clipboard API not available
    }
};

const highlightCodeBlocks = async () => {
    await ensurePostEnhancers();
    await nextTick();
    if (PrismInstance && articleContentRef.value) {
        PrismInstance.highlightAllUnder(articleContentRef.value);
    }
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
                <button data-copy-target="${blockId}" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-catppuccin-subtle hover:text-catppuccin-mauve px-2 py-1 bg-catppuccin-crust border border-catppuccin-surface rounded hover:bg-catppuccin-mauve/10 cursor-pointer z-10">
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
        const lines = match.trim().split(/\r?\n/);
        if (lines.length < 2) return match;

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

    // Extract blockquotes before escaping
    const blockquotes = [];
    html = html.replace(/(?:^|\n)((?:> .*(?:\n|$))+)/g, (match) => {
        const placeholder = `__BLOCKQUOTE_${blockquotes.length}__`;
        const text = match
            .trim()
            .split("\n")
            .map((l) => escapeHtml(l.replace(/^> ?/, "")))
            .join("<br>");
        blockquotes.push(
            `<blockquote class="border-l-2 border-catppuccin-mauve pl-4 my-4 text-catppuccin-subtle italic">${text}</blockquote>`
        );
        return `\n${placeholder}\n`;
    });

    html = escapeHtml(html);

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="border-catppuccin-surface my-6">');

    // Headings
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

    // Images (before links)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        const safeSrc = sanitizeExternalUrl(src);
        return `<img src="${safeSrc}" alt="${alt}" class="rounded border border-catppuccin-surface my-4 max-w-full">`;
    });

    // Bold
    html = html.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-catppuccin-mauve font-semibold">$1</strong>',
    );

    // Italic (single asterisk, after bold is processed)
    html = html.replace(
        /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
        '<em class="text-catppuccin-peach italic">$1</em>',
    );

    // Inline code
    html = html.replace(
        /`([^`]+)`/g,
        '<code class="bg-catppuccin-surface/50 px-2 py-0.5 rounded text-catppuccin-pink text-sm">$1</code>',
    );

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
        const safeUrl = sanitizeExternalUrl(url);
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-catppuccin-blue hover:text-catppuccin-mauve underline transition-colors">${label}</a>`;
    });

    // Bullet lists
    html = html.replace(
        /^\- (.*$)/gim,
        '<li class="ml-6 list-disc text-catppuccin-text mb-1">$1</li>',
    );

    // Numbered lists
    html = html.replace(
        /^\d+\. (.*$)/gim,
        '<li class="ml-6 list-decimal text-catppuccin-text mb-1">$1</li>',
    );

    // Paragraphs
    html = html
        .split("\n\n")
        .map((p) => {
            const trimmed = p.trim();
            if (!trimmed) return "";
            if (trimmed.startsWith("<") || trimmed.startsWith("__CODEBLOCK_") || trimmed.startsWith("__TABLE_") || trimmed.startsWith("__BLOCKQUOTE_")) {
                return p;
            }
            return `<p class="text-catppuccin-text leading-relaxed mb-4">${p}</p>`;
        })
        .join("\n");

    // Restore placeholders
    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODEBLOCK_${i}__`, block);
    });
    tables.forEach((table, i) => {
        html = html.replace(`__TABLE_${i}__`, table);
    });
    blockquotes.forEach((bq, i) => {
        html = html.replace(`__BLOCKQUOTE_${i}__`, bq);
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

    if (articleContentRef.value) {
        articleContentRef.value.addEventListener("click", handleCopyClick);
    }

    const slugFromQuery = route.query.post;
    if (slugFromQuery) {
        openPost(slugFromQuery);
    }
});

onBeforeUnmount(() => {
    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
    if (articleContentRef.value) {
        articleContentRef.value.removeEventListener("click", handleCopyClick);
    }
});

watch(articleContentRef, (el) => {
    if (el) {
        el.addEventListener("click", handleCopyClick);
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

// Variant definitions
const listHeaderContainer = staggerContainer(0.06);
const postListContainer = staggerContainer(0.05);
const postDetailContainer = staggerContainer(0.06);

// AnimatePresence view transition presets
const viewEnter = { opacity: 0, y: 20 };
const viewAnimate = { opacity: 1, y: 0 };
const viewExit = { opacity: 0, y: -20 };
</script>

<template>
    <div
        class="w-full min-h-screen overflow-x-hidden overflow-y-auto font-mono"
    >
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4">
            <AnimatePresence mode="wait">
                <motion.div
                    v-if="view === 'list'"
                    key="list"
                    :initial="viewEnter"
                    :animate="viewAnimate"
                    :exit="viewExit"
                    :transition="springs.default"
                >
                    <motion.div
                        class="mb-12"
                        :variants="listHeaderContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div :variants="fadeUp" class="text-catppuccin-subtle text-sm mb-2">
                            ~$ cd ~/blog
                        </motion.div>
                        <motion.h1
                            :variants="fadeUp"
                            class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"
                        >
                            <span class="text-catppuccin-mauve">blog</span>
                        </motion.h1>
                        <motion.p
                            :variants="fadeUp"
                            class="text-sm text-catppuccin-gray leading-relaxed mb-6"
                        >
                            thoughts on code, tools, and random stuff i find
                            interesting.
                        </motion.p>

                        <motion.div :variants="fadeUp" class="flex items-center gap-4 text-sm mb-6">
                            <router-link
                                to="/"
                                class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                            >
                                [← home]
                            </router-link>
                        </motion.div>

                    </motion.div>

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

                        <motion.div
                            v-else
                            class="space-y-3"
                            :variants="postListContainer"
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.button
                                v-for="post in posts"
                                :key="post.id"
                                type="button"
                                @click="openPost(post.slug)"
                                :variants="scaleFade"
                                :whileHover="cardHover"
                                :whilePress="cardPress"
                                class="block w-full text-left group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-catppuccin-mauve cursor-pointer"
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
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    v-else-if="view === 'post' && currentPost"
                    key="post"
                    :initial="viewEnter"
                    :animate="viewAnimate"
                    :exit="viewExit"
                    :transition="springs.default"
                >
                    <motion.div
                        class="mb-8"
                        :variants="postDetailContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div :variants="fadeUp" class="text-catppuccin-subtle text-sm mb-2">
                            ~$ cat {{ currentPost.slug }}.md
                        </motion.div>

                        <motion.button
                            :variants="fadeUp"
                            @click="goBack"
                            class="text-sm text-catppuccin-subtle hover:text-catppuccin-text transition-colors mb-6 inline-flex items-center gap-1"
                        >
                            ← back to posts
                        </motion.button>

                        <motion.h1
                            :variants="fadeUp"
                            class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-3"
                        >
                            {{ currentPost.title }}
                        </motion.h1>

                        <motion.div
                            :variants="fadeUp"
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
                        </motion.div>
                    </motion.div>

                    <motion.article
                        class="border-l-2 border-catppuccin-surface pl-4 mb-8"
                        :initial="{ opacity: 0, y: 15 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ ...springs.gentle, delay: 0.2 }"
                    >
                        <div
                            ref="articleContentRef"
                            class="prose prose-invert max-w-none text-catppuccin-text"
                            v-html="parseMarkdown(currentPost.content)"
                        ></div>
                    </motion.article>

                    <div class="border-l-2 border-catppuccin-surface pl-4 mb-4">
                        <div class="flex items-center justify-between gap-4">
                            <motion.button
                                v-if="adjacentPosts.prev"
                                @click="openPost(adjacentPosts.prev.slug)"
                                class="group text-left min-w-0 flex-1"
                                :whileHover="linkHover"
                            >
                                <span class="text-xs text-catppuccin-subtle">← older</span>
                                <div class="text-sm text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                    {{ adjacentPosts.prev.title }}
                                </div>
                            </motion.button>
                            <div v-else class="flex-1"></div>

                            <motion.button
                                v-if="adjacentPosts.next"
                                @click="openPost(adjacentPosts.next.slug)"
                                class="group text-right min-w-0 flex-1"
                                :whileHover="{ x: -3, transition: springs.snappy }"
                            >
                                <span class="text-xs text-catppuccin-subtle">newer →</span>
                                <div class="text-sm text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                    {{ adjacentPosts.next.title }}
                                </div>
                            </motion.button>
                            <div v-else class="flex-1"></div>
                        </div>
                    </div>

                    <div class="border-l-2 border-catppuccin-surface pl-4">
                        <motion.button
                            @click="goBack"
                            :whileHover="linkHover"
                            class="text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors inline-flex items-center gap-1"
                        >
                            ← back to all posts
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    </div>
</template>

<style scoped>
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
