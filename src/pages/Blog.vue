<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion, AnimatePresence } from "motion-v";
import "prismjs/themes/prism-tomorrow.css";
import { renderMarkdown } from "@/utils/markdown";
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
            title: `${currentPost.value.title} | f1sh.dev`,
            description: currentPost.value.excerpt,
            url: `https://f1sh.dev/blog/${slug}`,
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
            mainEntityOfPage: `https://f1sh.dev/blog/${slug}`,
            url: `https://f1sh.dev/blog/${slug}`,
            image: "https://f1sh.dev/screenshot.png",
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
        title: "Blog | f1sh.dev",
        description: "Thoughts on code, tools, and random stuff.",
        url: "https://f1sh.dev/blog",
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

// Stepped progress blocks (12 segments)
const progressBlocks = computed(() => {
    const total = 12;
    return Array.from({ length: total }, (_, i) => ({
        filled: readingProgress.value >= ((i + 1) / total) * 100,
    }));
});

// Rotating accent per post index
const accentVars = ['--color-pink', '--color-mauve', '--color-green', '--color-blue'];
const getAccentColor = (idx) => `rgb(var(${accentVars[idx % accentVars.length]}))`;
const getAccentMuted = (idx) => `rgb(var(${accentVars[idx % accentVars.length]}) / 0.1)`;

onMounted(() => {
    loadPosts();
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
    const slugFromParam = typeof route.params.slug === "string" ? route.params.slug : "";
    const slugFromQuery = typeof route.query.post === "string" ? route.query.post : "";
    if (slugFromParam) openPost(slugFromParam);
    else if (slugFromQuery) openPost(slugFromQuery);
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
});

onBeforeUnmount(() => {
    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
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
const listItemsContainer = staggerContainer(0.07);
const postDetailContainer = staggerContainer(0.06);

// ClipPath wipe reveal — left to right
const cardWipeIn = {
    hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
    visible: {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

// Slide transitions for list ↔ post
const viewEnter = { opacity: 0, x: 24 };
const viewAnimate = { opacity: 1, x: 0 };
const viewExitToLeft = { opacity: 0, x: -24 };
</script>

<template>
    <!-- Stepped reading progress (fills left to right, block by block) -->
    <Teleport to="body">
        <div v-if="view === 'post' && currentPost" class="fixed top-0 left-0 w-full z-[9998] flex gap-px h-[4px]">
            <div
                v-for="(block, i) in progressBlocks"
                :key="i"
                class="flex-1 transition-colors duration-200"
                :style="{ backgroundColor: block.filled ? 'rgb(var(--color-green))' : 'rgb(var(--color-surface))' }"
            ></div>
        </div>
    </Teleport>

    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <AnimatePresence mode="wait">

                <!-- ── Post list ─────────────────────────────────────────── -->
                <motion.div
                    v-if="view === 'list'"
                    key="list"
                    :initial="viewEnter"
                    :animate="viewAnimate"
                    :exit="viewExitToLeft"
                    :transition="springs.default"
                >
                    <!-- Header block -->
                    <motion.div
                        class="mb-10"
                        :variants="listHeaderContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div :variants="fadeUp" class="text-[0.6rem] tracking-[0.22em] uppercase text-catppuccin-subtle mb-2">
                            ~$ cat ~/blog/index.txt
                        </motion.div>

                        <motion.div :variants="fadeUp" class="flex items-baseline gap-3 mb-1">
                            <span class="text-2xl font-bold text-catppuccin-mauve">
                                issue {{ String(posts.length).padStart(3, '0') }}
                            </span>
                            <span class="text-catppuccin-subtle text-xs">{{ new Date().getFullYear() }}</span>
                        </motion.div>

                        <motion.p :variants="fadeUp" class="text-sm text-catppuccin-subtle mb-5">
                            thoughts on code, tools, and systems.
                        </motion.p>

                        <motion.div :variants="fadeUp">
                            <router-link
                                to="/"
                                class="text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors"
                            >
                                [← home]
                            </router-link>
                        </motion.div>
                    </motion.div>

                    <!-- Rule -->
                    <div class="border-t border-catppuccin-surface mb-2"></div>

                    <div class="flex items-center justify-between gap-3 border-b border-catppuccin-surface/60 py-3 mb-2 text-xs">
                        <span class="text-catppuccin-subtle">follow updates without email</span>
                        <div class="flex items-center gap-3">
                            <a href="/rss.xml" class="text-catppuccin-subtle hover:text-catppuccin-green transition-colors" target="_blank" rel="noopener noreferrer">[rss]</a>
                            <a href="https://github.com/lostf1sh" class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors" target="_blank" rel="noopener noreferrer">[github]</a>
                        </div>
                    </div>

                    <div v-if="!posts.length" class="text-sm text-catppuccin-subtle py-8">
                        no posts found
                    </div>

                    <!-- Post entries -->
                    <motion.div
                        v-else
                        :variants="listItemsContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            v-for="(post, idx) in posts"
                            :key="post.id"
                            :variants="cardWipeIn"
                            class="group relative"
                        >
                            <button
                                type="button"
                                @click="openPost(post.slug)"
                                class="post-row w-full text-left flex items-start gap-5 py-5 border-b border-catppuccin-surface/60 cursor-pointer relative"
                            >
                                <div class="post-row-inner flex items-start gap-5 w-full">
                                    <!-- Big ghost number -->
                                    <span
                                        class="flex-shrink-0 w-12 text-right text-[3.5rem] leading-none font-bold select-none transition-colors duration-300"
                                        :style="{ color: getAccentMuted(idx) }"
                                        aria-hidden="true"
                                    >
                                        {{ String(posts.length - idx).padStart(2, '0') }}
                                    </span>

                                    <!-- Post content -->
                                    <div class="flex-1 min-w-0 pt-1">
                                        <div
                                            class="text-[0.6rem] tracking-[0.18em] uppercase mb-1.5 font-mono"
                                            :style="{ color: getAccentColor(idx) }"
                                        >
                                            {{ formatDate(post.date) }}
                                        </div>

                                        <div class="text-sm font-semibold text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors duration-150 leading-snug mb-2">
                                            {{ post.title }}
                                        </div>

                                        <div v-if="post.tags.length" class="text-xs text-catppuccin-subtle">
                                            <span v-for="(tag, ti) in post.tags" :key="tag">
                                                <span>{{ tag }}</span>
                                                <span v-if="ti < post.tags.length - 1" class="mx-1.5 text-catppuccin-overlay">／</span>
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Read indicator -->
                                    <span
                                        class="pt-2 flex-shrink-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                        :style="{ color: getAccentColor(idx) }"
                                    >
                                        read →
                                    </span>
                                </div>

                                <!-- Left border grows on hover -->
                                <div
                                    class="absolute left-0 top-0 bottom-0 w-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 will-change-transform"
                                    :style="{ backgroundColor: getAccentColor(idx) }"
                                ></div>
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <!-- ── Post detail ────────────────────────────────────────── -->
                <motion.div
                    v-else-if="view === 'post' && currentPost"
                    key="post"
                    :initial="viewEnter"
                    :animate="viewAnimate"
                    :exit="viewExitToLeft"
                    :transition="springs.default"
                >
                    <button
                        @click="goBack"
                        class="text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors mb-10 cursor-pointer block"
                    >
                        [← back to index]
                    </button>

                    <div class="flex flex-col md:flex-row gap-8 md:gap-10">
                        <!-- Metadata rail -->
                        <aside class="md:w-36 flex-shrink-0 md:sticky md:top-8 md:self-start">
                            <div class="flex flex-row md:flex-col gap-5 flex-wrap text-xs">
                                <div>
                                    <div class="text-[0.55rem] tracking-[0.2em] uppercase text-catppuccin-subtle mb-0.5">issue</div>
                                    <div class="text-catppuccin-mauve font-bold">#{{ currentPostNumber }}</div>
                                </div>
                                <div>
                                    <div class="text-[0.55rem] tracking-[0.2em] uppercase text-catppuccin-subtle mb-0.5">date</div>
                                    <div class="text-catppuccin-text">{{ formatDate(currentPost.date) }}</div>
                                </div>
                                <div>
                                    <div class="text-[0.55rem] tracking-[0.2em] uppercase text-catppuccin-subtle mb-0.5">length</div>
                                    <div class="text-catppuccin-text">~{{ readingTime(currentPost.content) }} min</div>
                                </div>
                                <div v-if="currentPost.tags.length">
                                    <div class="text-[0.55rem] tracking-[0.2em] uppercase text-catppuccin-subtle mb-1">tags</div>
                                    <div class="flex flex-row flex-wrap gap-x-2 gap-y-1 md:flex-col md:gap-1">
                                        <span
                                            v-for="tag in currentPost.tags"
                                            :key="tag"
                                            class="text-catppuccin-mauve"
                                        >{{ tag }}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <!-- Article -->
                        <div class="flex-1 min-w-0">
                            <h1 class="text-2xl md:text-3xl font-bold text-catppuccin-text mb-8 leading-snug" style="text-wrap: balance">
                                {{ currentPost.title }}
                            </h1>

                            <article
                                ref="articleContentRef"
                                class="prose-blog"
                                v-html="renderMarkdown(currentPost.content)"
                            ></article>

                            <!-- Adjacent posts -->
                            <div class="mt-12 pt-6 border-t border-catppuccin-surface">
                                <div class="flex items-start justify-between gap-4">
                                    <button
                                        v-if="adjacentPosts.prev"
                                        @click="openPost(adjacentPosts.prev.slug)"
                                        class="group text-left min-w-0 flex-1 cursor-pointer"
                                    >
                                        <div class="text-[0.55rem] tracking-[0.18em] uppercase text-catppuccin-subtle mb-1">← older</div>
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
                                        <div class="text-[0.55rem] tracking-[0.18em] uppercase text-catppuccin-subtle mb-1">newer →</div>
                                        <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                            {{ adjacentPosts.next.title }}
                                        </div>
                                    </button>
                                    <div v-else class="flex-1"></div>
                                </div>
                            </div>

                            <div v-if="relatedPosts.length" class="mt-10 pt-6 border-t border-catppuccin-surface">
                                <div class="text-[0.55rem] tracking-[0.2em] uppercase text-catppuccin-subtle mb-3">you may also like</div>
                                <div class="space-y-2">
                                    <button
                                        v-for="post in relatedPosts"
                                        :key="post.slug"
                                        @click="openPost(post.slug)"
                                        class="group w-full text-left border border-catppuccin-surface/70 hover:border-catppuccin-mauve/50 px-3 py-2 transition-colors cursor-pointer"
                                    >
                                        <div class="text-xs text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                            {{ post.title }}
                                        </div>
                                        <div class="mt-1 text-[0.65rem] text-catppuccin-subtle">
                                            {{ formatDate(post.date) }}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div class="mt-8 pt-5 border-t border-catppuccin-surface/70 flex items-center justify-between gap-3 text-xs">
                                <span class="text-catppuccin-subtle">want more posts?</span>
                                <div class="flex items-center gap-3">
                                    <a href="/rss.xml" class="text-catppuccin-subtle hover:text-catppuccin-green transition-colors" target="_blank" rel="noopener noreferrer">[rss]</a>
                                    <a href="https://github.com/lostf1sh" class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors" target="_blank" rel="noopener noreferrer">[github]</a>
                                </div>
                            </div>

                            <button
                                @click="goBack"
                                class="mt-6 text-catppuccin-subtle hover:text-catppuccin-text text-xs transition-colors cursor-pointer block"
                            >
                                [← back to index]
                            </button>
                        </div>
                    </div>
                </motion.div>

            </AnimatePresence>
        </div>
    </div>
</template>

<style scoped>
/* Card row: shift left on hover */
.post-row {
    contain: paint;
}

.post-row-inner {
    transition: transform 0.15s ease;
    will-change: transform;
}

.post-row:hover .post-row-inner {
    transform: translateX(-3px);
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

/* Drop cap on opening paragraph */
.prose-blog :deep(p:first-of-type::first-letter) {
    font-size: 3.75rem;
    font-weight: 700;
    line-height: 0.82;
    float: left;
    margin-right: 0.08em;
    margin-top: 0.06em;
    color: rgb(var(--color-mauve));
}

.prose-blog :deep(a) {
    color: rgb(var(--color-pink));
    word-break: break-word;
    transition: color 0.15s ease;
}
.prose-blog :deep(a:hover) {
    color: rgb(var(--color-mauve));
}

.prose-blog :deep(ul),
.prose-blog :deep(ol) {
    margin: 1rem 0;
    padding-left: 1.4rem;
}
.prose-blog :deep(li) {
    margin: 0.35rem 0;
}

/* Code blocks: square corners, mauve left border */
.prose-blog :deep(pre) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    border-radius: 0;
    border: 1px solid rgb(var(--color-surface));
    border-left: 3px solid rgb(var(--color-mauve) / 0.6);
    margin: 1.5rem 0;
}
.prose-blog :deep(code:not(pre code)) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.8rem;
    background: rgb(var(--color-surface) / 0.5);
    padding: 0.1em 0.35em;
    border-radius: 2px;
}

/* H2: green underline accent */
.prose-blog :deep(h2) {
    font-family: "JetBrains Mono", monospace;
    font-size: 1.05rem;
    font-weight: 700;
    color: rgb(var(--color-text));
    margin: 2.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgb(var(--color-green) / 0.35);
    scroll-margin-top: 1.5rem;
}

/* H3: uppercase, subtle */
.prose-blog :deep(h3) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgb(var(--color-subtle));
    margin: 2rem 0 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    scroll-margin-top: 1.5rem;
}

.prose-blog :deep(blockquote) {
    border-left: 3px solid rgb(var(--color-pink) / 0.55);
    padding-left: 1rem;
    color: rgb(var(--color-subtle));
    margin: 1.5rem 0;
    font-style: italic;
}

.prose-blog :deep(hr) {
    border: none;
    border-top: 1px solid rgb(var(--color-surface));
    margin: 2rem 0;
}

.prose-blog :deep(img) {
    max-width: 100%;
    height: auto;
}
</style>
