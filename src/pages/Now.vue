<script setup>
import { ref, computed, onMounted } from "vue";
import { motion } from "motion-v";
import { getAllPosts, formatDate as formatBlogDate } from "@/services/blogService";
import { getRecentEvents } from "@/services/githubService";
import {
    CACHE_KEYS,
    readLocalCache,
    writeLocalCache,
} from "@/utils/apiLocalCache";
import { parseFrontmatter, renderMarkdown } from "@/utils/markdown";
import {
    springs,
    staggerContainer,
    fadeUp,
    fadeLeft,
} from "@/utils/motion";
import nowRaw from "/content/now.md?raw";

const events = ref([]);
const eventsCached = readLocalCache(CACHE_KEYS.GITHUB_EVENTS);
if (eventsCached?.value?.length) {
    events.value = eventsCached.value;
}
const eventsLoading = ref(!events.value.length);
const eventsRevalidating = ref(false);

const recentPosts = computed(() => getAllPosts().slice(0, 3));

// Parse now.md
const { frontmatter, content: nowBody } = parseFrontmatter(nowRaw);
const lastUpdated = frontmatter.lastUpdated || "";
const nowHtml = renderMarkdown(nowBody);

const formatRelativeTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

onMounted(async () => {
    const hadCache = events.value.length > 0;
    if (hadCache) eventsRevalidating.value = true;
    else eventsLoading.value = true;
    try {
        const fresh = await getRecentEvents();
        if (fresh.length) {
            events.value = fresh;
            writeLocalCache(CACHE_KEYS.GITHUB_EVENTS, fresh);
        }
    } catch {
        if (!events.value.length) events.value = [];
    } finally {
        eventsLoading.value = false;
        eventsRevalidating.value = false;
    }
});

const headerContainer = staggerContainer(0.06);
const sectionContainer = staggerContainer(0.04);
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Header -->
            <motion.div
                class="mb-10"
                :variants="headerContainer"
                initial="hidden"
                animate="visible"
            >
                <motion.div :variants="fadeUp" class="flex items-center gap-3 text-sm mb-4">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                    >~</router-link>
                    <span class="text-catppuccin-surface">/</span>
                    <span class="text-catppuccin-subtle">now</span>
                </motion.div>
                <motion.h1
                    :variants="fadeUp"
                    class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2"
                    style="text-wrap: balance"
                >
                    <span class="text-catppuccin-mauve">now</span>
                </motion.h1>
                <motion.div :variants="fadeUp" class="flex items-center gap-2 text-xs text-catppuccin-subtle">
                    <span>what i'm currently up to</span>
                    <span v-if="lastUpdated" class="text-catppuccin-surface">·</span>
                    <span v-if="lastUpdated">{{ lastUpdated }}</span>
                </motion.div>
            </motion.div>

            <!-- now.md content -->
            <motion.div
                class="border-l-2 border-catppuccin-surface pl-4 mb-8"
                :initial="{ opacity: 0, x: -15 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="springs.default"
            >
                <div class="text-catppuccin-subtle text-sm mb-2">
                    ~$ cat status.txt
                </div>
                <div class="now-prose text-sm text-catppuccin-text leading-relaxed [&_img]:max-w-full [&_img]:h-auto" v-html="nowHtml"></div>
            </motion.div>

            <!-- Recent activity grid -->
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Recent blog posts -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    :whileInView="{ opacity: 1, x: 0 }"
                    :initial="{ opacity: 0, x: -15 }"
                    :transition="springs.default"
                    :inViewOptions="{ once: true }"
                >
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/blog --recent
                    </div>
                    <div class="divide-y divide-catppuccin-surface/40 text-sm">
                        <router-link
                            v-for="post in recentPosts"
                            :key="post.slug"
                            :to="{ path: '/blog', query: { post: post.slug } }"
                            class="flex items-start gap-2 group py-2.5 first:pt-0"
                        >
                            <span class="text-catppuccin-blue mt-0.5">&gt;</span>
                            <div class="min-w-0">
                                <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate block">
                                    {{ post.title }}
                                </span>
                                <span class="text-xs text-catppuccin-subtle">
                                    {{ formatBlogDate(post.date) }}
                                </span>
                            </div>
                        </router-link>
                    </div>
                </motion.div>

                <!-- Recent GitHub events -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4"
                    :variants="sectionContainer"
                    :whileInView="{ opacity: 1, x: 0 }"
                    :initial="{ opacity: 0, x: -15 }"
                    :transition="springs.default"
                    :inViewOptions="{ once: true }"
                >
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                        <div class="text-catppuccin-subtle text-sm">
                            ~$ git log --oneline --all
                        </div>
                        <span
                            v-if="eventsRevalidating"
                            class="text-[10px] text-catppuccin-subtle"
                        >refreshing…</span>
                    </div>

                    <div v-if="eventsLoading" class="text-sm text-catppuccin-subtle space-y-2">
                        <div class="h-3 w-full max-w-[220px] rounded bg-catppuccin-surface/40 animate-pulse"></div>
                        <div class="h-3 w-full max-w-[180px] rounded bg-catppuccin-surface/30 animate-pulse"></div>
                        <div class="h-3 w-full max-w-[200px] rounded bg-catppuccin-surface/25 animate-pulse"></div>
                    </div>

                    <div v-else-if="!events.length" class="text-sm text-catppuccin-subtle">
                        no recent activity
                    </div>

                    <div v-else class="divide-y divide-catppuccin-surface/40 text-sm">
                        <a
                            v-for="(event, i) in events"
                            :key="i"
                            :href="event.repoUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-start gap-2 group py-2.5 first:pt-0"
                        >
                            <span class="text-catppuccin-green mt-0.5">&gt;</span>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate">
                                        {{ event.repo }}
                                    </span>
                                    <span class="text-xs text-catppuccin-subtle flex-shrink-0">
                                        {{ formatRelativeTime(event.date) }}
                                    </span>
                                </div>
                                <span class="text-xs text-catppuccin-gray truncate block">
                                    {{ event.message }}
                                </span>
                            </div>
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.now-prose :deep(p) {
    margin-bottom: 0.75rem;
}

.now-prose :deep(h2) {
    color: rgb(var(--color-mauve));
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
}

.now-prose :deep(ul) {
    list-style: none;
    padding-left: 0;
}

.now-prose :deep(li) {
    padding-left: 1rem;
    position: relative;
    margin-bottom: 0.25rem;
    color: rgb(var(--color-gray));
}

.now-prose :deep(li)::before {
    content: ">";
    position: absolute;
    left: 0;
    color: rgb(var(--color-subtle));
}
</style>
