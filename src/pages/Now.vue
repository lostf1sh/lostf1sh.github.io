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
    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <!-- Header -->
            <motion.div
                class="mb-12"
                :variants="headerContainer"
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
                    now
                </motion.h1>

                <motion.div :variants="fadeUp" class="flex items-center gap-2 text-xs text-catppuccin-subtle">
                    <span>what i'm currently up to</span>
                    <span v-if="lastUpdated" class="text-catppuccin-surface">·</span>
                    <span v-if="lastUpdated">{{ lastUpdated }}</span>
                </motion.div>
            </motion.div>

            <!-- now.md content -->
            <motion.div
                class="mb-12"
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="springs.gentle"
            >
                <div class="section-label mb-3">status</div>
                <div class="now-prose text-sm text-catppuccin-text leading-relaxed [&_img]:max-w-full [&_img]:h-auto" v-html="nowHtml"></div>
            </motion.div>

            <!-- Divider -->
            <div class="hr-zen mb-10"></div>

            <!-- Recent activity grid -->
            <div class="grid md:grid-cols-2 gap-10">
                <!-- Recent blog posts -->
                <motion.div
                    :variants="sectionContainer"
                    :whileInView="{ opacity: 1, y: 0 }"
                    :initial="{ opacity: 0, y: 10 }"
                    :transition="springs.gentle"
                    :inViewOptions="{ once: true }"
                >
                    <div class="section-label mb-3">recent writing</div>
                    <div class="text-sm">
                        <router-link
                            v-for="post in recentPosts"
                            :key="post.slug"
                            :to="{ path: '/blog', query: { post: post.slug } }"
                            class="group block py-3 border-b border-catppuccin-surface/20 last:border-0"
                        >
                            <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors block">
                                {{ post.title }}
                            </span>
                            <span class="text-xs text-catppuccin-subtle">
                                {{ formatBlogDate(post.date) }}
                            </span>
                        </router-link>
                    </div>
                </motion.div>

                <!-- Recent GitHub events -->
                <motion.div
                    :variants="sectionContainer"
                    :whileInView="{ opacity: 1, y: 0 }"
                    :initial="{ opacity: 0, y: 10 }"
                    :transition="springs.gentle"
                    :inViewOptions="{ once: true }"
                >
                    <div class="section-label mb-3">
                        recent commits
                        <span
                            v-if="eventsRevalidating"
                            class="text-[10px] text-catppuccin-subtle/50 ml-2 font-sans"
                        >updating</span>
                    </div>

                    <div v-if="eventsLoading" class="text-sm text-catppuccin-subtle space-y-3">
                        <div class="h-3 w-full max-w-[220px] rounded bg-catppuccin-surface/30 animate-pulse"></div>
                        <div class="h-3 w-full max-w-[180px] rounded bg-catppuccin-surface/25 animate-pulse"></div>
                        <div class="h-3 w-full max-w-[200px] rounded bg-catppuccin-surface/20 animate-pulse"></div>
                    </div>

                    <div v-else-if="!events.length" class="text-sm text-catppuccin-subtle">
                        no recent activity
                    </div>

                    <div v-else class="text-sm">
                        <a
                            v-for="(event, i) in events"
                            :key="i"
                            :href="event.repoUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group block py-3 border-b border-catppuccin-surface/20 last:border-0"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">
                                    {{ event.repo }}
                                </span>
                                <span class="text-xs text-catppuccin-subtle flex-shrink-0">
                                    {{ formatRelativeTime(event.date) }}
                                </span>
                            </div>
                            <span class="text-xs text-catppuccin-subtle truncate block mt-0.5">
                                {{ event.message }}
                            </span>
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
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: rgb(var(--color-text));
    margin-top: 1.5rem;
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
    color: rgb(var(--color-subtle));
}

.now-prose :deep(li)::before {
    content: "—";
    position: absolute;
    left: 0;
    color: rgb(var(--color-overlay));
}
</style>
