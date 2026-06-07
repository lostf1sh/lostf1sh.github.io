<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion } from "motion-v";
import "prismjs/themes/prism-tomorrow.css";
import { renderMarkdown } from "@/utils/markdown";
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import {
    getAllPosts,
    getPostBySlug,
    getRelatedPosts,
    formatDate,
} from "@/services/blogService";
import { updateMeta, setJsonLd, removeJsonLd } from "@/utils/seo";
import { staggerContainer, fadeUp } from "@/utils/motion";

const view = ref("list");
const currentPost = ref(null);
const posts = ref([]);
const articleContentRef = ref(null);
const toastMessage = ref("");
let toastTimeoutId = null;
let PrismInstance = null;

const searchQuery = ref("");

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

const filteredPosts = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return posts.value;
    return posts.value.filter((p) =>
        `${p.title} ${p.excerpt}`.toLowerCase().includes(q),
    );
});

const clearFilters = () => { searchQuery.value = ""; };

const adjacentPosts = computed(() => {
    if (!currentPost.value || !sortedPosts.value.length) return { prev: null, next: null };
    const idx = sortedPosts.value.findIndex((p) => p.slug === currentPost.value.slug);
    return {
        prev: idx < sortedPosts.value.length - 1 ? sortedPosts.value[idx + 1] : null,
        next: idx > 0 ? sortedPosts.value[idx - 1] : null,
    };
});

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
            title: `${currentPost.value.title} | moli.codes`,
            description: currentPost.value.excerpt,
            url: `https://moli.codes/blog/${slug}`,
        });
        setJsonLd("article", {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: currentPost.value.title,
            description: currentPost.value.excerpt,
            datePublished: currentPost.value.date,
            dateModified: currentPost.value.date,
            author: { "@type": "Person", name: "Moli" },
            mainEntityOfPage: `https://moli.codes/blog/${slug}`,
            url: `https://moli.codes/blog/${slug}`,
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
        title: "Blog | moli.codes",
        description: "Thoughts on code, tools, and random stuff.",
        url: "https://moli.codes/blog",
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
        toastMessage.value = "copied";
        if (toastTimeoutId) clearTimeout(toastTimeoutId);
        toastTimeoutId = setTimeout(() => { toastMessage.value = ""; }, 2200);
    } catch { }
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

const listContainer = staggerContainer(0.05);
</script>

<template>
    <Teleport to="body">
        <div v-if="view === 'post' && currentPost" class="fixed top-0 left-0 w-full z-[9998] h-[2px] bg-ink-surface/30">
            <div class="h-full bg-ink-mint/70 transition-[width] duration-150" :style="{ width: progressPercent + '%' }"></div>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="toastMessage" class="copy-toast" role="status" aria-live="polite">{{ toastMessage }}</div>
    </Teleport>

    <div class="w-full min-h-[100dvh]">
        <div class="max-w-2xl mx-auto px-6 pt-12 pb-16">
            <SiteNav />

            <motion.main
                v-if="view === 'list'"
                key="list"
                :variants="listContainer"
                initial="hidden"
                animate="visible"
                class="mt-12"
            >
                <motion.h1 :variants="fadeUp" class="text-3xl md:text-4xl font-medium tracking-tight text-ink-text">
                    writing
                </motion.h1>
                <motion.p :variants="fadeUp" class="mt-2 text-ink-subtle">
                    {{ posts.length }} notes on code, tools, and the systems i build.
                </motion.p>

                <motion.div v-if="posts.length" :variants="fadeUp" class="mt-8">
                    <input
                        v-model="searchQuery"
                        type="search"
                        placeholder="search posts"
                        aria-label="Search posts"
                        class="blog-search"
                    />
                </motion.div>

                <div v-if="posts.length && !filteredPosts.length" class="mt-8 text-sm text-ink-subtle">
                    no posts match.
                    <button @click="clearFilters" class="text-ink-mint ml-1 cursor-pointer">clear</button>
                </div>

                <div v-else-if="!posts.length" class="mt-10 text-sm text-ink-subtle">nothing here yet.</div>

                <motion.div v-else :variants="fadeUp" class="mt-6 divide-y divide-ink-surface/30">
                    <button
                        v-for="post in filteredPosts"
                        :key="post.id"
                        type="button"
                        @click="openPost(post.slug)"
                        class="group w-full text-left py-4 cursor-pointer block"
                    >
                        <div class="flex items-baseline justify-between gap-4">
                            <span class="text-ink-text group-hover:text-ink-mint transition-colors leading-snug">
                                {{ post.title }}
                            </span>
                            <time class="text-sm text-ink-subtle flex-shrink-0">{{ formatDate(post.date) }}</time>
                        </div>
                    </button>
                </motion.div>
            </motion.main>

            <main v-else-if="view === 'post' && currentPost" key="post" class="mt-12 post-detail-enter">
                <button @click="goBack" class="text-sm text-ink-subtle hover:text-ink-mint transition-colors cursor-pointer">
                    ← writing
                </button>

                <header class="mt-6">
                    <h1 class="text-2xl md:text-3xl font-medium tracking-tight text-ink-text leading-tight">
                        {{ currentPost.title }}
                    </h1>
                    <div class="mt-3 text-sm text-ink-subtle">
                        {{ formatDate(currentPost.date) }} · {{ readingTime(currentPost.content) }} min read
                    </div>
                </header>

                <article
                    ref="articleContentRef"
                    class="prose-blog mt-8"
                    v-html="renderMarkdown(currentPost.content)"
                ></article>

                <nav class="mt-14 grid sm:grid-cols-2 gap-4 border-t border-ink-surface/40 pt-6">
                    <button
                        v-if="adjacentPosts.prev"
                        @click="openPost(adjacentPosts.prev.slug)"
                        class="group text-left cursor-pointer"
                    >
                        <div class="text-xs text-ink-subtle mb-1">older</div>
                        <div class="text-sm text-ink-text group-hover:text-ink-mint transition-colors truncate">
                            {{ adjacentPosts.prev.title }}
                        </div>
                    </button>
                    <div v-else></div>

                    <button
                        v-if="adjacentPosts.next"
                        @click="openPost(adjacentPosts.next.slug)"
                        class="group text-left sm:text-right cursor-pointer"
                    >
                        <div class="text-xs text-ink-subtle mb-1">newer</div>
                        <div class="text-sm text-ink-text group-hover:text-ink-mint transition-colors truncate">
                            {{ adjacentPosts.next.title }}
                        </div>
                    </button>
                    <div v-else></div>
                </nav>

                <section v-if="relatedPosts.length" class="mt-12">
                    <h2 class="text-ink-text font-medium mb-1">related</h2>
                    <div class="divide-y divide-ink-surface/30">
                        <button
                            v-for="post in relatedPosts"
                            :key="post.slug"
                            @click="openPost(post.slug)"
                            class="group w-full text-left py-3 cursor-pointer"
                        >
                            <div class="flex items-baseline justify-between gap-4">
                                <span class="text-sm text-ink-text group-hover:text-ink-mint transition-colors truncate">{{ post.title }}</span>
                                <time class="text-xs text-ink-subtle flex-shrink-0">{{ formatDate(post.date) }}</time>
                            </div>
                        </button>
                    </div>
                </section>

                <button @click="goBack" class="mt-12 text-sm text-ink-subtle hover:text-ink-mint transition-colors cursor-pointer">
                    ← writing
                </button>
            </main>

            <SiteFooter />
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
    padding: 0.45rem 0.7rem;
    font-size: 0.75rem;
    animation: toast-in 0.15s ease both;
}

@keyframes toast-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}

.post-detail-enter {
    animation: detail-in 0.22s ease both;
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

.blog-search {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgb(var(--color-surface) / 0.6);
    padding: 0.5rem 0.1rem;
    color: rgb(var(--color-text));
    font: inherit;
    outline: none;
    transition: border-color 0.15s ease;
}

.blog-search::placeholder {
    color: rgb(var(--color-subtle) / 0.7);
}

.blog-search:focus {
    border-bottom-color: rgb(var(--color-mint) / 0.6);
}

.blog-search::-webkit-search-cancel-button {
    -webkit-appearance: none;
}

.prose-blog {
    font-size: 1rem;
    line-height: 1.75;
    color: rgb(var(--color-text));
}

.prose-blog :deep(p) { margin: 1rem 0; }

.prose-blog :deep(a) {
    color: rgb(var(--color-text));
    text-decoration: underline;
    text-decoration-color: rgb(var(--color-subtle) / 0.4);
    text-underline-offset: 2px;
    transition: color 0.12s ease, text-decoration-color 0.12s ease;
}
.prose-blog :deep(a:hover) {
    color: rgb(var(--color-mint));
    text-decoration-color: rgb(var(--color-mint));
}

.prose-blog :deep(ul) { margin: 1rem 0; padding-left: 1.4rem; list-style: disc; }
.prose-blog :deep(ol) { margin: 1rem 0; padding-left: 1.4rem; list-style: decimal; }
.prose-blog :deep(li) { margin: 0.4rem 0; }
.prose-blog :deep(li)::marker { color: rgb(var(--color-subtle)); }

.prose-blog :deep(pre) {
    font-size: 0.8125rem;
    line-height: 1.65;
    border: 1px solid rgb(var(--color-surface));
    margin: 1.5rem 0;
}
.prose-blog :deep(code:not(pre code)) {
    font-size: 0.875em;
}

.prose-blog :deep(h2),
.prose-blog :deep(h3) {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    scroll-margin-top: 1.5rem;
    color: rgb(var(--color-text));
}

.prose-blog :deep(h2) {
    font-size: 1.35rem;
    font-weight: 600;
    margin: 2.25rem 0 0.75rem;
}

.prose-blog :deep(h3) {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 1.75rem 0 0.5rem;
}

.prose-blog :deep(.heading-anchor) {
    opacity: 0;
    font-size: 0.85em;
    color: rgb(var(--color-subtle));
    text-decoration: none;
    transition: opacity 0.12s ease, color 0.12s ease;
}

.prose-blog :deep(h2:hover .heading-anchor),
.prose-blog :deep(h3:hover .heading-anchor),
.prose-blog :deep(.heading-anchor:focus-visible) { opacity: 1; }

.prose-blog :deep(.heading-anchor:hover) { color: rgb(var(--color-mint)); }

.prose-blog :deep(blockquote) {
    border-left: 2px solid rgb(var(--color-mint) / 0.6);
    padding-left: 1rem;
    color: rgb(var(--color-subtle));
    margin: 1.25rem 0;
    font-style: italic;
}

.prose-blog :deep(hr) {
    border: none;
    border-top: 1px solid rgb(var(--color-surface));
    margin: 2rem 0;
}

.prose-blog :deep(img) { max-width: 100%; height: auto; }
.prose-blog :deep(table) { width: 100%; font-size: 0.875rem; }
</style>
