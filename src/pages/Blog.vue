<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion } from "motion-v";
import "prismjs/themes/prism-tomorrow.css";
import { renderMarkdown } from "@/utils/markdown";
import SiteNav from "@/components/SiteNav.vue";
import {
    getAllPosts,
    getPostBySlug,
    getRelatedPosts,
    formatDate,
} from "@/services/blogService";
import { updateMeta, setJsonLd, removeJsonLd } from "@/utils/seo";
import { springs, staggerContainer, fadeUp } from "@/utils/motion";

const view = ref("list");
const currentPost = ref(null);
const posts = ref([]);
const articleContentRef = ref(null);
const toastMessage = ref("");
let toastTimeoutId = null;
let PrismInstance = null;

const readingProgress = ref(0);
let rafId = null;

const updateReadingProgress = () => {
    rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        readingProgress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    });
};

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

const currentPostIndex = computed(() => {
    if (!currentPost.value) return 0;
    return sortedPosts.value.findIndex(p => p.slug === currentPost.value.slug);
});

const currentPostNumber = computed(() =>
    String(sortedPosts.value.length - currentPostIndex.value).padStart(3, '0')
);

const relatedPosts = computed(() => {
    if (!currentPost.value) return [];
    return getRelatedPosts(currentPost.value.slug, 3);
});

const loadPosts = () => { posts.value = getAllPosts(); };

const openPost = (slug) => {
    currentPost.value = getPostBySlug(slug);
    if (currentPost.value) {
        view.value = "post";
        window.scrollTo({ top: 0, behavior: "smooth" });
        const currentRouteSlug = typeof route.params.slug === "string" ? route.params.slug : "";
        if (currentRouteSlug !== slug || route.query.post) {
            const nextQuery = { ...route.query };
            delete nextQuery.post;
            router.replace({ name: "Blog", params: { slug }, query: nextQuery });
        }
        updateMeta({
            title: `${currentPost.value.title} | f1sh.v.recipes`,
            description: currentPost.value.excerpt,
            url: `https://f1sh.v.recipes/blog/${slug}`,
        });
        setJsonLd("article", {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: currentPost.value.title,
            description: currentPost.value.excerpt,
            datePublished: currentPost.value.date,
            dateModified: currentPost.value.date,
            author: { "@type": "Person", name: "Moli" },
            mainEntityOfPage: `https://f1sh.v.recipes/blog/${slug}`,
            url: `https://f1sh.v.recipes/blog/${slug}`,
            image: "https://f1sh.v.recipes/screenshot.png",
        });
        void highlightCodeBlocks();
    } else if (route.params.slug || route.query.post) {
        removeJsonLd("article");
        router.replace({ name: "Blog", params: { slug: undefined }, query: {} });
    }
};

const goBack = ({ skipQueryUpdate = false } = {}) => {
    view.value = "list";
    currentPost.value = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateMeta({
        title: "Blog | f1sh.v.recipes",
        description: "Thoughts on code, tools, and random stuff.",
        url: "https://f1sh.v.recipes/blog",
    });
    removeJsonLd("article");
    if (!skipQueryUpdate && (route.params.slug || route.query.post)) {
        const newQuery = { ...route.query };
        delete newQuery.post;
        router.replace({ name: "Blog", params: { slug: undefined }, query: newQuery });
    }
};

const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
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
        toastMessage.value = "[copied]";
        if (toastTimeoutId) clearTimeout(toastTimeoutId);
        toastTimeoutId = setTimeout(() => { toastMessage.value = ""; }, 2200);
    } catch { /* noop */ }
};

const highlightCodeBlocks = async () => {
    await ensurePostEnhancers();
    await nextTick();
    if (PrismInstance && articleContentRef.value) {
        PrismInstance.highlightAllUnder(articleContentRef.value);
    }
};

const readingTime = (content) => {
    const text = content.replace(/```[\s\S]*?```/g, '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return calculateReadingTime(text);
};

const progressPercent = computed(() => Math.round(readingProgress.value));

onMounted(() => {
    loadPosts();
    const slugFromParam = typeof route.params.slug === "string" ? route.params.slug : "";
    const slugFromQuery = typeof route.query.post === "string" ? route.query.post : "";
    if (slugFromParam) openPost(slugFromParam);
    else if (slugFromQuery) openPost(slugFromQuery);
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", updateReadingProgress);
    if (rafId) cancelAnimationFrame(rafId);
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    removeJsonLd("article");
});

watch(articleContentRef, (el, _, onCleanup) => {
    if (el) {
        el.addEventListener("click", handleCopyClick);
        void highlightCodeBlocks();
        onCleanup(() => { el.removeEventListener("click", handleCopyClick); });
    }
});

watch(
    () => [route.params.slug, route.query.post],
    (slug, prevSlug) => {
        const currentSlug = typeof slug[0] === "string" ? slug[0] : typeof slug[1] === "string" ? slug[1] : "";
        const previousSlug = typeof prevSlug?.[0] === "string" ? prevSlug[0] : typeof prevSlug?.[1] === "string" ? prevSlug[1] : "";

        if (currentSlug && currentSlug !== previousSlug) openPost(currentSlug);
        else if (!currentSlug && view.value === "post") goBack({ skipQueryUpdate: true });
    },
);

const listHeaderContainer = staggerContainer(0.07);
const listItemsContainer = staggerContainer(0.05);

const viewEnter = { opacity: 0 };
const viewAnimate = { opacity: 1 };
</script>

<template>
    <!-- Reading progress bar -->
    <Teleport to="body">
        <div v-if="view === 'post' && currentPost" class="fixed top-0 left-0 w-full z-[9998] h-[2px] bg-catppuccin-surface/20">
            <div class="h-full bg-catppuccin-text/40 transition-[width] duration-150" :style="{ width: progressPercent + '%' }"></div>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="toastMessage" class="copy-toast" role="status" aria-live="polite">{{ toastMessage }}</div>
    </Teleport>

    <div class="w-full min-h-screen">
        <div class="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
        <!-- Post list -->
        <motion.div
            v-if="view === 'list'"
            key="list"
            :initial="viewEnter"
            :animate="viewAnimate"
            :transition="springs.gentle"
        >
            <h1 class="sr-only">writing</h1>
            <motion.div
                :variants="listHeaderContainer"
                initial="hidden"
                animate="visible"
            >
                <motion.div :variants="fadeUp">
                    <SiteNav />
                </motion.div>
            </motion.div>

            <div class="tui-panel mb-4">
                <span class="tui-panel-title">writing</span>
                <div class="pt-1 flex items-center justify-between text-[10px] text-catppuccin-subtle/40 mb-2">
                    <span>{{ posts.length }} posts // thoughts on code, tools, and systems</span>
                    <div class="flex gap-2">
                        <a href="/rss.xml" class="hover:text-catppuccin-text transition-colors" target="_blank" rel="noopener noreferrer">[rss]</a>
                        <a href="https://github.com/lostf1sh" class="hover:text-catppuccin-text transition-colors" target="_blank" rel="noopener noreferrer">[github]</a>
                    </div>
                </div>

                <div v-if="!posts.length" class="text-xs text-catppuccin-subtle py-4">(empty)</div>

                <motion.div v-else :variants="listItemsContainer" initial="hidden" animate="visible">
                    <motion.div
                        v-for="(post, idx) in posts"
                        :key="post.id"
                        :variants="fadeUp"
                        class="group"
                    >
                        <button
                            type="button"
                            @click="openPost(post.slug)"
                            class="w-full text-left py-2.5 border-b border-catppuccin-surface/20 cursor-pointer block last:border-0"
                        >
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex-1 min-w-0">
                                    <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors leading-snug">
                                        {{ post.title }}
                                    </div>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span class="text-[10px] text-catppuccin-subtle/40">{{ formatDate(post.date) }}</span>
                                        <span v-if="post.tags.length" class="text-[10px] text-catppuccin-subtle/30">
                                            <span v-for="(tag, ti) in post.tags" :key="tag">
                                                {{ tag }}<span v-if="ti < post.tags.length - 1">,</span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <span class="text-[10px] text-catppuccin-subtle/20 group-hover:text-catppuccin-subtle transition-colors flex-shrink-0 pt-0.5">
                                    →
                                </span>
                            </div>
                        </button>
                    </motion.div>
                </motion.div>
            </div>

        </motion.div>

        <!-- Post detail -->
        <div v-else-if="view === 'post' && currentPost" key="post" class="post-detail-enter">
            <button @click="goBack" class="text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors mb-4 cursor-pointer block">
                [← back]
            </button>

            <div class="flex flex-col md:flex-row gap-4">
                <!-- Metadata rail -->
                <aside class="md:w-28 flex-shrink-0 md:sticky md:top-2 md:self-start">
                    <div class="tui-panel mb-4">
                        <span class="tui-panel-title">meta</span>
                        <div class="flex flex-row md:flex-col gap-3 flex-wrap text-[10px] pt-1">
                            <div>
                                <div class="text-catppuccin-subtle/40">issue</div>
                                <div class="text-catppuccin-text">#{{ currentPostNumber }}</div>
                            </div>
                            <div>
                                <div class="text-catppuccin-subtle/40">date</div>
                                <div class="text-catppuccin-text">{{ formatDate(currentPost.date) }}</div>
                            </div>
                            <div>
                                <div class="text-catppuccin-subtle/40">read</div>
                                <div class="text-catppuccin-text">~{{ readingTime(currentPost.content) }}m</div>
                            </div>
                            <div v-if="currentPost.tags.length">
                                <div class="text-catppuccin-subtle/40">tags</div>
                                <div class="flex flex-row flex-wrap gap-1 md:flex-col">
                                    <span v-for="tag in currentPost.tags" :key="tag" class="text-catppuccin-subtle">{{ tag }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Article -->
                <div class="flex-1 min-w-0">
                    <div class="tui-panel">
                        <span class="tui-panel-title">post</span>
                        <h1 class="text-sm md:text-base font-semibold text-catppuccin-text leading-snug mb-3 pt-1">
                            {{ currentPost.title }}
                        </h1>
                        <article ref="articleContentRef" class="prose-blog pt-2" v-html="renderMarkdown(currentPost.content)"></article>
                    </div>

                    <!-- Adjacent posts -->
                    <div class="grid grid-cols-2 gap-2 mt-4">
                        <button
                            v-if="adjacentPosts.prev"
                            @click="openPost(adjacentPosts.prev.slug)"
                            class="group text-left tui-panel cursor-pointer"
                        >
                            <span class="tui-panel-title">← older</span>
                            <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate pt-1">
                                {{ adjacentPosts.prev.title }}
                            </div>
                        </button>
                        <div v-else></div>

                        <button
                            v-if="adjacentPosts.next"
                            @click="openPost(adjacentPosts.next.slug)"
                            class="group text-right tui-panel cursor-pointer"
                        >
                            <span class="tui-panel-title" style="left: auto; right: 0.75rem;">newer →</span>
                            <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate pt-1">
                                {{ adjacentPosts.next.title }}
                            </div>
                        </button>
                        <div v-else></div>
                    </div>

                    <div v-if="relatedPosts.length" class="tui-panel mt-4">
                        <span class="tui-panel-title">related</span>
                        <div class="space-y-1 pt-1">
                            <button
                                v-for="post in relatedPosts"
                                :key="post.slug"
                                @click="openPost(post.slug)"
                                class="group w-full text-left py-1.5 border-b border-catppuccin-surface/20 last:border-0 cursor-pointer text-xs"
                            >
                                <div class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">{{ post.title }}</div>
                                <div class="text-[10px] text-catppuccin-subtle/40">{{ formatDate(post.date) }}</div>
                            </button>
                        </div>
                    </div>

                    <button @click="goBack" class="mt-4 text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors cursor-pointer block">
                        [← back]
                    </button>
                </div>
            </div>

        </div>
        </div>
    </div>
</template>

<style scoped>
.copy-toast {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 9998;
    border: 1px solid rgb(var(--color-surface));
    background: rgb(var(--color-base));
    color: rgb(var(--color-text));
    padding: 0.4rem 0.6rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 10px;
    animation: toast-in 0.15s ease both;
}

@keyframes toast-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

.post-detail-enter {
    animation: detail-in 0.2s ease both;
}

@keyframes detail-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .post-detail-enter,
    .copy-toast {
        animation: none;
    }
}

/* Article prose */
.prose-blog {
    font-size: 14px;
    line-height: 1.8;
    color: rgb(var(--color-text));
    font-family: "JetBrains Mono", monospace;
}

.prose-blog :deep(p) { margin: 0.85rem 0; }

.prose-blog :deep(a) {
    color: rgb(var(--color-text));
    text-decoration: underline;
    text-decoration-color: rgb(var(--color-subtle) / 0.3);
    text-underline-offset: 3px;
    transition: text-decoration-color 0.12s ease;
}
.prose-blog :deep(a:hover) { text-decoration-color: rgb(var(--color-text)); }

.prose-blog :deep(ul),
.prose-blog :deep(ol) { margin: 0.85rem 0; padding-left: 1.4rem; }
.prose-blog :deep(li) { margin: 0.3rem 0; }

.prose-blog :deep(pre) {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    line-height: 1.6;
    border: 1px solid rgb(var(--color-surface));
    margin: 1.25rem 0;
}
.prose-blog :deep(code:not(pre code)) {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    background: rgb(var(--color-surface) / 0.4);
    padding: 0.1em 0.3em;
}

.prose-blog :deep(h2) {
    font-size: 13px;
    font-weight: 600;
    color: rgb(var(--color-text));
    margin: 1.75rem 0 0.5rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid rgb(var(--color-surface) / 0.4);
    scroll-margin-top: 1.5rem;
}

.prose-blog :deep(h2),
.prose-blog :deep(h3) {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
}

.prose-blog :deep(.heading-anchor) {
    opacity: 0;
    font-size: 0.85em;
    color: rgb(var(--color-subtle));
    text-decoration: none;
    transition: opacity 0.12s ease;
}

.prose-blog :deep(h2:hover .heading-anchor),
.prose-blog :deep(h3:hover .heading-anchor),
.prose-blog :deep(.heading-anchor:focus-visible) { opacity: 1; }

.prose-blog :deep(.heading-anchor:hover) { color: rgb(var(--color-text)); }

.prose-blog :deep(h3) {
    font-size: 11px;
    font-weight: 600;
    color: rgb(var(--color-subtle));
    margin: 1.25rem 0 0.35rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    scroll-margin-top: 1.5rem;
}

.prose-blog :deep(blockquote) {
    border-left: 2px solid rgb(var(--color-surface));
    padding-left: 1rem;
    color: rgb(var(--color-subtle));
    margin: 1.25rem 0;
    font-style: italic;
}

.prose-blog :deep(hr) {
    border: none;
    border-top: 1px solid rgb(var(--color-surface));
    margin: 1.5rem 0;
}

.prose-blog :deep(img) { max-width: 100%; height: auto; }
</style>
