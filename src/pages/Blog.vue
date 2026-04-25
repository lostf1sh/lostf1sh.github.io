<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion, AnimatePresence } from "motion-v";
import "prismjs/themes/prism-tomorrow.css";
import { renderMarkdown } from "@/utils/markdown";
import TableOfContents from "@/components/TableOfContents.vue";
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
const headings = ref([]);
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
            author: {
                "@type": "Person",
                name: "Moli",
            },
            mainEntityOfPage: `https://f1sh.v.recipes/blog/${slug}`,
            url: `https://f1sh.v.recipes/blog/${slug}`,
            image: "https://f1sh.v.recipes/screenshot.png",
        });
        void highlightCodeBlocks();
        extractHeadings();
    } else if (route.params.slug || route.query.post) {
        removeJsonLd("article");
        router.replace({ name: "Blog", params: { slug: undefined }, query: {} });
    }
};

const goBack = ({ skipQueryUpdate = false } = {}) => {
    view.value = "list";
    currentPost.value = null;
    headings.value = [];
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
        const originalText = button.textContent;
        button.textContent = "copied!";
        setTimeout(() => { button.textContent = originalText; }, 2000);
    } catch { /* noop */ }
};

const highlightCodeBlocks = async () => {
    await ensurePostEnhancers();
    await nextTick();
    if (PrismInstance && articleContentRef.value) {
        PrismInstance.highlightAllUnder(articleContentRef.value);
    }
};

const extractHeadings = () => {
    nextTick(() => {
        if (!articleContentRef.value) { headings.value = []; return; }
        const els = articleContentRef.value.querySelectorAll("h2, h3");
        headings.value = Array.from(els).map(el => ({
            id: el.id,
            text: el.textContent,
            level: parseInt(el.tagName[1]),
        }));
    });
};

const readingTime = (content) => {
    const text = content.replace(/```[\s\S]*?```/g, '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return calculateReadingTime(text);
};

const progressBlocks = computed(() => {
    const total = 12;
    return Array.from({ length: total }, (_, i) => ({
        filled: readingProgress.value >= ((i + 1) / total) * 100,
    }));
});

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
    removeJsonLd("article");
});

watch(articleContentRef, (el, _, onCleanup) => {
    if (el) {
        el.addEventListener("click", handleCopyClick);
        extractHeadings();
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
const listItemsContainer = staggerContainer(0.06);

const viewEnter = { opacity: 0, y: 12 };
const viewAnimate = { opacity: 1, y: 0 };
const viewExit = { opacity: 0, y: -8 };
</script>

<template>
    <!-- Reading progress bar -->
    <Teleport to="body">
        <div v-if="view === 'post' && currentPost" class="fixed top-0 left-0 w-full z-[9998] flex gap-px h-[2px]">
            <div
                v-for="(block, i) in progressBlocks"
                :key="i"
                class="flex-1 transition-colors duration-200"
                :style="{ backgroundColor: block.filled ? 'rgb(var(--color-mauve))' : 'transparent' }"
            ></div>
        </div>
    </Teleport>

    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <AnimatePresence mode="wait">

                <!-- ── Post list ─────────────────────────────────────────── -->
                <motion.div
                    v-if="view === 'list'"
                    key="list"
                    :initial="viewEnter"
                    :animate="viewAnimate"
                    :exit="viewExit"
                    :transition="springs.gentle"
                >
                    <motion.div
                        class="mb-12"
                        :variants="listHeaderContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div :variants="fadeUp" class="mb-2">
                            <router-link
                                to="/"
                                class="text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors"
                            >
                                ← home
                            </router-link>
                        </motion.div>

                        <motion.h1
                            :variants="fadeUp"
                            class="font-serif text-3xl md:text-4xl font-semibold text-catppuccin-text tracking-tight mb-2"
                        >
                            writing
                        </motion.h1>

                        <motion.p :variants="fadeUp" class="text-sm text-catppuccin-subtle">
                            {{ posts.length }} posts · thoughts on code, tools, and systems
                        </motion.p>
                    </motion.div>

                    <div class="flex items-center justify-between gap-3 border-b border-catppuccin-surface/20 pb-3 mb-2 text-xs">
                        <span class="text-catppuccin-subtle/60">follow without email</span>
                        <div class="flex items-center gap-3">
                            <a href="/rss.xml" class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors" target="_blank" rel="noopener noreferrer">rss</a>
                            <a href="https://github.com/lostf1sh" class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors" target="_blank" rel="noopener noreferrer">github</a>
                        </div>
                    </div>

                    <div v-if="!posts.length" class="text-sm text-catppuccin-subtle py-8">
                        no posts yet
                    </div>

                    <motion.div
                        v-else
                        :variants="listItemsContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            v-for="(post, idx) in posts"
                            :key="post.id"
                            :variants="fadeUp"
                            class="group"
                        >
                            <button
                                type="button"
                                @click="openPost(post.slug)"
                                class="w-full text-left py-5 border-b border-catppuccin-surface/20 cursor-pointer block"
                            >
                                <div class="flex items-start justify-between gap-4">
                                    <div class="flex-1 min-w-0">
                                        <div class="text-xs text-catppuccin-subtle mb-1.5">
                                            {{ formatDate(post.date) }}
                                        </div>
                                        <div class="text-sm font-medium text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors duration-150 leading-snug mb-1.5">
                                            {{ post.title }}
                                        </div>
                                        <div v-if="post.tags.length" class="text-xs text-catppuccin-subtle/70">
                                            <span v-for="(tag, ti) in post.tags" :key="tag">
                                                <span>{{ tag }}</span>
                                                <span v-if="ti < post.tags.length - 1" class="mx-1.5 text-catppuccin-surface">/</span>
                                            </span>
                                        </div>
                                    </div>
                                    <span class="text-xs text-catppuccin-subtle/40 group-hover:text-catppuccin-mauve transition-colors flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100">
                                        →
                                    </span>
                                </div>
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <!-- ── Post detail (plain div, no motion-v, sticky works) ── -->
                <div
                    v-else-if="view === 'post' && currentPost"
                    key="post"
                    class="post-detail-enter"
                >
                    <button
                        @click="goBack"
                        class="text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors mb-10 cursor-pointer block"
                    >
                        ← back to index
                    </button>

                    <div class="flex flex-col md:flex-row gap-8 md:gap-12">
                        <!-- Metadata rail -->
                        <aside class="md:w-32 flex-shrink-0 md:sticky md:top-8 md:self-start md:max-h-[calc(100vh-4rem)] md:overflow-y-auto">
                            <div class="flex flex-row md:flex-col gap-5 flex-wrap text-xs">
                                <div>
                                    <div class="section-label text-[10px] mb-0.5">issue</div>
                                    <div class="text-catppuccin-mauve font-medium">#{{ currentPostNumber }}</div>
                                </div>
                                <div>
                                    <div class="section-label text-[10px] mb-0.5">date</div>
                                    <div class="text-catppuccin-text">{{ formatDate(currentPost.date) }}</div>
                                </div>
                                <div>
                                    <div class="section-label text-[10px] mb-0.5">length</div>
                                    <div class="text-catppuccin-text">~{{ readingTime(currentPost.content) }} min</div>
                                </div>
                                <div v-if="currentPost.tags.length">
                                    <div class="section-label text-[10px] mb-1">tags</div>
                                    <div class="flex flex-row flex-wrap gap-x-2 gap-y-1 md:flex-col md:gap-1">
                                        <span
                                            v-for="tag in currentPost.tags"
                                            :key="tag"
                                            class="text-catppuccin-subtle"
                                        >{{ tag }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Table of Contents -->
                            <div v-if="headings.length" class="hidden md:block mt-6 pt-4 border-t border-catppuccin-surface/20">
                                <TableOfContents :headings="headings" />
                            </div>
                        </aside>

                        <!-- Article -->
                        <div class="flex-1 min-w-0">
                            <h1 class="font-serif text-2xl md:text-3xl font-semibold text-catppuccin-text mb-8 leading-snug tracking-tight" style="text-wrap: balance">
                                {{ currentPost.title }}
                            </h1>

                            <article
                                ref="articleContentRef"
                                class="prose-blog"
                                v-html="renderMarkdown(currentPost.content)"
                            ></article>

                            <!-- Adjacent posts -->
                            <div class="mt-12 pt-6 border-t border-catppuccin-surface/20">
                                <div class="flex items-start justify-between gap-4">
                                    <button
                                        v-if="adjacentPosts.prev"
                                        @click="openPost(adjacentPosts.prev.slug)"
                                        class="group text-left min-w-0 flex-1 cursor-pointer"
                                    >
                                        <div class="text-[10px] text-catppuccin-subtle mb-1 uppercase tracking-wider">← older</div>
                                        <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                            {{ adjacentPosts.prev.title }}
                                        </div>
                                    </button>
                                    <div v-else class="flex-1"></div>

                                    <button
                                        v-if="adjacentPosts.next"
                                        @click="openPost(adjacentPosts.next.slug)"
                                        class="group text-right min-w-0 flex-1 cursor-pointer"
                                    >
                                        <div class="text-[10px] text-catppuccin-subtle mb-1 uppercase tracking-wider">newer →</div>
                                        <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                            {{ adjacentPosts.next.title }}
                                        </div>
                                    </button>
                                    <div v-else class="flex-1"></div>
                                </div>
                            </div>

                            <div v-if="relatedPosts.length" class="mt-10 pt-6 border-t border-catppuccin-surface/20">
                                <div class="section-label text-[10px] mb-3">you may also like</div>
                                <div class="space-y-2">
                                    <button
                                        v-for="post in relatedPosts"
                                        :key="post.slug"
                                        @click="openPost(post.slug)"
                                        class="group w-full text-left border border-catppuccin-surface/30 hover:border-catppuccin-mauve/30 px-4 py-3 transition-colors cursor-pointer"
                                    >
                                        <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                            {{ post.title }}
                                        </div>
                                        <div class="mt-1 text-[10px] text-catppuccin-subtle">
                                            {{ formatDate(post.date) }}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div class="mt-8 pt-5 border-t border-catppuccin-surface/20 flex items-center justify-between gap-3 text-xs">
                                <span class="text-catppuccin-subtle/60">follow along</span>
                                <div class="flex items-center gap-3">
                                    <a href="/rss.xml" class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors" target="_blank" rel="noopener noreferrer">rss</a>
                                    <a href="https://github.com/lostf1sh" class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors" target="_blank" rel="noopener noreferrer">github</a>
                                </div>
                            </div>

                            <button
                                @click="goBack"
                                class="mt-6 text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors cursor-pointer block"
                            >
                                ← back to index
                            </button>
                        </div>
                    </div>
                </div>

            </AnimatePresence>
        </div>
    </div>
</template>

<style scoped>
/* ── Post detail entrance (CSS only, no motion-v transforms) ── */
.post-detail-enter {
    animation: post-detail-in 0.35s ease both;
}

@keyframes post-detail-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .post-detail-enter {
        animation: none;
    }
}

/* ─── Article prose ─────────────────────────────────────── */
.prose-blog {
    font-size: 0.9375rem;
    line-height: 1.85;
    color: rgb(var(--color-text));
}

.prose-blog :deep(p) {
    margin: 1.2rem 0;
}

.prose-blog :deep(a) {
    color: rgb(var(--color-mauve));
    word-break: break-word;
    transition: color 0.15s ease;
    text-decoration: underline;
    text-decoration-color: rgb(var(--color-mauve) / 0.3);
    text-underline-offset: 3px;
}
.prose-blog :deep(a:hover) {
    text-decoration-color: rgb(var(--color-mauve));
}

.prose-blog :deep(ul),
.prose-blog :deep(ol) {
    margin: 1rem 0;
    padding-left: 1.4rem;
}
.prose-blog :deep(li) {
    margin: 0.35rem 0;
}

.prose-blog :deep(pre) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    border-radius: 2px;
    border: 1px solid rgb(var(--color-surface));
    margin: 1.5rem 0;
}
.prose-blog :deep(code:not(pre code)) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.8rem;
    background: rgb(var(--color-surface) / 0.5);
    padding: 0.1em 0.35em;
    border-radius: 2px;
}

.prose-blog :deep(h2) {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.35rem;
    font-weight: 600;
    color: rgb(var(--color-text));
    margin: 2.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgb(var(--color-surface) / 0.5);
    scroll-margin-top: 1.5rem;
}

.prose-blog :deep(h3) {
    font-family: "Karla", sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgb(var(--color-subtle));
    margin: 2rem 0 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    scroll-margin-top: 1.5rem;
}

.prose-blog :deep(blockquote) {
    border-left: 2px solid rgb(var(--color-mauve) / 0.4);
    padding-left: 1rem;
    color: rgb(var(--color-subtle));
    margin: 1.5rem 0;
    font-style: italic;
}

.prose-blog :deep(hr) {
    border: none;
    border-top: 1px solid rgb(var(--color-surface) / 0.5);
    margin: 2rem 0;
}

.prose-blog :deep(img) {
    max-width: 100%;
    height: auto;
}
</style>
