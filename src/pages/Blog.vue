<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion } from "motion-v";
import "prismjs/themes/prism-tomorrow.css";
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import {
    getAllPosts,
    getPostBySlug,
    getRelatedPosts,
    formatDate,
} from "@/services/blogService";
import { recordView } from "@/services/viewsService";
import { REACTIONS, getReactions, addReaction, hasReacted } from "@/services/reactionsService";
import { updateMeta } from "@/utils/seo";
import { staggerContainer, fadeUp } from "@/utils/motion";

const posts = getAllPosts();
const view = ref("list");
const currentPost = ref(null);
const viewCount = ref(null);
const reactions = ref(null);
const reactedKeys = ref(new Set());
const renderedHtml = ref("");
const articleContentRef = ref(null);
const toastMessage = ref("");
let toastTimeoutId = null;
let PrismInstance = null;
let renderMarkdownFn = null;

const renderPostHtml = async (content) => {
    if (!renderMarkdownFn) {
        ({ renderMarkdown: renderMarkdownFn } = await import("@/utils/markdown"));
    }
    return renderMarkdownFn(content);
};

const searchQuery = ref("");
const activeTag = ref("");

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

const asSlug = (value) => (typeof value === "string" ? value : "");

const tagFilters = computed(() => {
    const counts = new Map();
    posts.forEach((p) => p.tags.forEach((t) => {
        const tag = t.toLowerCase();
        counts.set(tag, (counts.get(tag) || 0) + 1);
    }));
    return [...counts.entries()]
        .filter(([tag, count]) => count > 1 || tag === activeTag.value)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([tag]) => tag);
});

const filteredPosts = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    return posts.filter((p) => {
        if (activeTag.value && !p.tags.some((t) => t.toLowerCase() === activeTag.value)) return false;
        return !q || `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(q);
    });
});

const toggleTag = (tag) => {
    activeTag.value = activeTag.value === tag ? "" : tag;
    const nextQuery = { ...route.query };
    if (activeTag.value) nextQuery.tag = activeTag.value;
    else delete nextQuery.tag;
    router.replace({ query: nextQuery });
};

const clearFilters = () => {
    searchQuery.value = "";
    if (activeTag.value) toggleTag(activeTag.value);
};

const adjacentPosts = computed(() => {
    if (!currentPost.value) return { prev: null, next: null };
    const idx = posts.findIndex((p) => p.slug === currentPost.value.slug);
    return {
        prev: idx < posts.length - 1 ? posts[idx + 1] : null,
        next: idx > 0 ? posts[idx - 1] : null,
    };
});

const relatedPosts = computed(() => {
    if (!currentPost.value) return [];
    return getRelatedPosts(currentPost.value.slug, 3);
});

const unescapeAttribute = (text) => text
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const tocItems = computed(() => {
    const items = [];
    const headingRe = /<h([23]) id="([^"]+)" data-heading-text="([^"]*)"/g;
    let match;
    while ((match = headingRe.exec(renderedHtml.value))) {
        items.push({ depth: Number(match[1]), id: match[2], text: unescapeAttribute(match[3]) });
    }
    if (items.length > 12) {
        const topLevel = items.filter((item) => item.depth === 2);
        if (topLevel.length >= 3) return topLevel;
    }
    return items;
});

const showToc = computed(() => tocItems.value.length >= 3);

const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(history.state, "", `#${id}`);
};

const openPost = async (slug) => {
    const meta = posts.find((p) => p.slug === slug);
    if (!meta) {
        currentPost.value = null;
        if (route.params.slug || route.query.post) {
            renderedHtml.value = "";
            router.replace({ name: "Blog", params: { slug: undefined }, query: {} });
        }
        return;
    }

    currentPost.value = { ...meta, content: "" };
    renderedHtml.value = "";
    view.value = "post";
    window.scrollTo({ top: 0, behavior: "smooth" });

    viewCount.value = null;
    recordView(slug).then((views) => {
        if (currentPost.value?.slug === slug) viewCount.value = views;
    });

    reactions.value = null;
    reactedKeys.value = new Set(
        REACTIONS.filter((r) => hasReacted(slug, r.key)).map((r) => r.key),
    );
    getReactions(slug).then((counts) => {
        if (currentPost.value?.slug === slug) reactions.value = counts;
    });

    if (asSlug(route.params.slug) !== slug || route.query.post) {
        const nextQuery = { ...route.query };
        delete nextQuery.post;
        router.replace({ name: "Blog", params: { slug }, query: nextQuery });
    }
    updateMeta({
        title: `${meta.title} | moli.codes`,
        description: meta.excerpt,
        url: `https://moli.codes/blog/${slug}`,
        image: `https://moli.codes/og/${slug}.png`,
    });

    const post = await getPostBySlug(slug);
    if (!post || currentPost.value?.slug !== slug) return;
    currentPost.value = post;
    renderedHtml.value = await renderPostHtml(post.content);
    void highlightCodeBlocks();
};

const goBack = ({ skipQueryUpdate = false } = {}) => {
    view.value = "list";
    currentPost.value = null;
    renderedHtml.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateMeta({
        title: "Blog | moli.codes",
        description: "Thoughts on code, tools, and random stuff.",
        url: "https://moli.codes/blog",
    });
    if (!skipQueryUpdate && (route.params.slug || route.query.post)) {
        const newQuery = { ...route.query };
        delete newQuery.post;
        router.replace({ name: "Blog", params: { slug: undefined }, query: newQuery });
    }
};

const react = async (key) => {
    const slug = currentPost.value?.slug;
    if (!slug || !reactions.value || reactedKeys.value.has(key)) return;
    reactedKeys.value = new Set([...reactedKeys.value, key]);
    reactions.value = { ...reactions.value, [key]: (reactions.value[key] || 0) + 1 };
    const counts = await addReaction(slug, key);
    if (counts && currentPost.value?.slug === slug) reactions.value = counts;
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

const progressPercent = computed(() => Math.round(readingProgress.value));

onMounted(() => {
    activeTag.value = asSlug(route.query.tag).toLowerCase();
    const slug = asSlug(route.params.slug) || asSlug(route.query.post);
    if (slug) openPost(slug);
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", updateReadingProgress);
    if (rafId) cancelAnimationFrame(rafId);
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
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
    ([slugParam, postQuery], prev) => {
        const currentSlug = asSlug(slugParam) || asSlug(postQuery);
        const previousSlug = asSlug(prev?.[0]) || asSlug(prev?.[1]);
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
                    <div v-if="tagFilters.length" class="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                        <button
                            v-for="tag in tagFilters"
                            :key="tag"
                            type="button"
                            @click="toggleTag(tag)"
                            class="text-xs transition-colors cursor-pointer"
                            :class="activeTag === tag ? 'text-ink-mint' : 'text-ink-subtle hover:text-ink-text'"
                            :aria-pressed="activeTag === tag"
                        >
                            #{{ tag }}
                        </button>
                    </div>
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
                            <time class="text-sm text-ink-subtle flex-shrink-0">
                                {{ formatDate(post.date) }}<span class="hidden sm:inline" v-if="post.readingTime"> · {{ post.readingTime }} min</span>
                            </time>
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
                        {{ formatDate(currentPost.date) }}<template v-if="currentPost.readingTime"> · {{ currentPost.readingTime }} min read</template><template v-if="viewCount !== null"> · {{ viewCount.toLocaleString() }} {{ viewCount === 1 ? "view" : "views" }}</template>
                    </div>
                </header>

                <nav v-if="showToc" class="mt-8 border-l border-ink-surface pl-4" aria-label="Table of contents">
                    <div class="text-xs text-ink-subtle/80 mb-2">contents</div>
                    <ol class="space-y-1">
                        <li v-for="item in tocItems" :key="item.id" :class="item.depth === 3 ? 'pl-4' : ''">
                            <a
                                :href="`#${item.id}`"
                                @click.prevent="scrollToHeading(item.id)"
                                class="text-sm text-ink-subtle hover:text-ink-mint transition-colors"
                            >{{ item.text }}</a>
                        </li>
                    </ol>
                </nav>

                <article
                    ref="articleContentRef"
                    class="prose-blog mt-8"
                    v-html="renderedHtml"
                ></article>

                <div v-if="reactions" class="reactions mt-12">
                    <button
                        v-for="r in REACTIONS"
                        :key="r.key"
                        type="button"
                        @click="react(r.key)"
                        :disabled="reactedKeys.has(r.key)"
                        :aria-pressed="reactedKeys.has(r.key)"
                        :aria-label="r.label"
                        :title="r.label"
                        class="reaction"
                        :class="{ 'reaction--on': reactedKeys.has(r.key) }"
                    >
                        <span class="reaction__emoji">{{ r.emoji }}</span>
                        <span class="reaction__count">{{ reactions[r.key] || 0 }}</span>
                    </button>
                </div>

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
    .reaction {
        transition: none;
    }
    .reaction:active:not(:disabled) {
        transform: none;
    }
}

.reactions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.reaction {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid rgb(var(--color-surface));
    background: transparent;
    color: rgb(var(--color-subtle));
    font-size: 0.8125rem;
    line-height: 1;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}

.reaction:hover:not(:disabled) {
    color: rgb(var(--color-text));
    border-color: rgb(var(--color-mint) / 0.5);
}

.reaction:active:not(:disabled) {
    transform: scale(0.94);
}

.reaction--on {
    color: rgb(var(--color-mint));
    border-color: rgb(var(--color-mint) / 0.6);
}

.reaction:disabled {
    cursor: default;
}

.reaction__emoji {
    font-size: 0.95rem;
}

.reaction__count {
    font-variant-numeric: tabular-nums;
    min-width: 0.7rem;
    text-align: left;
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
