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
import { springs, staggerContainer, fadeUp } from "@/utils/motion";
import SiteNav from "@/components/SiteNav.vue";
import nowRaw from "/content/now.md?raw";

const events = ref([]);
const eventsCached = readLocalCache(CACHE_KEYS.GITHUB_EVENTS);
if (eventsCached?.value?.length) {
    events.value = eventsCached.value;
}
const eventsLoading = ref(!events.value.length);
const eventsRevalidating = ref(false);

const recentPosts = computed(() => getAllPosts().slice(0, 3));

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

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
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
</script>

<template>
    <div class="w-full min-h-screen">
        <div class="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
            <h1 class="sr-only">now</h1>
            <motion.div :variants="headerContainer" initial="hidden" animate="visible">
                <motion.div :variants="fadeUp"><SiteNav /></motion.div>
            </motion.div>

            <div class="tui-panel mb-5">
                <span class="tui-panel-title">now <span v-if="lastUpdated" class="text-catppuccin-subtle/25">// {{ lastUpdated }}</span></span>
                <div class="now-prose text-xs text-catppuccin-text/80 leading-relaxed pt-1" v-html="nowHtml"></div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="tui-panel">
                    <span class="tui-panel-title">recent writing</span>
                    <div class="text-xs pt-1">
                        <router-link
                            v-for="post in recentPosts"
                            :key="post.slug"
                            :to="{ path: '/blog', query: { post: post.slug } }"
                            class="group block py-2 border-b border-catppuccin-surface/15 last:border-0"
                        >
                            <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors block truncate">
                                {{ post.title }}
                            </span>
                            <span class="text-[10px] text-catppuccin-subtle/30">
                                {{ formatBlogDate(post.date) }}
                            </span>
                        </router-link>
                    </div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">
                        recent commits
                        <span v-if="eventsRevalidating" class="text-catppuccin-subtle/25"> [syncing]</span>
                    </span>

                    <div v-if="eventsLoading" class="text-xs pt-1 space-y-2">
                        <div class="skeleton-pulse h-3 w-48 bg-catppuccin-surface/30"></div>
                        <div class="skeleton-pulse h-3 w-40 bg-catppuccin-surface/25"></div>
                    </div>

                    <div v-else-if="!events.length" class="text-xs text-catppuccin-subtle/30 pt-1">(no activity)</div>

                    <div v-else class="text-xs pt-1">
                        <a
                            v-for="(event, i) in events"
                            :key="i"
                            :href="event.repoUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group block py-2 border-b border-catppuccin-surface/15 last:border-0"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate">{{ event.repo }}</span>
                                <span class="text-[10px] text-catppuccin-subtle/30 flex-shrink-0">{{ formatRelativeTime(event.date) }}</span>
                            </div>
                            <span class="text-catppuccin-subtle/35 truncate block mt-0.5">{{ event.message }}</span>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.now-prose :deep(p) { margin-bottom: 0.5rem; }

.now-prose :deep(h2) {
    font-size: 12px;
    font-weight: 600;
    color: rgb(var(--color-text));
    margin-top: 1rem;
    margin-bottom: 0.35rem;
}

.now-prose :deep(.heading-anchor) { display: none; }

.now-prose :deep(ul) { list-style: none; padding-left: 0; }

.now-prose :deep(li) {
    padding-left: 1rem;
    position: relative;
    margin-bottom: 0.2rem;
    color: rgb(var(--color-subtle) / 0.7);
}

.now-prose :deep(li)::before {
    content: "-";
    position: absolute;
    left: 0;
    color: rgb(var(--color-overlay));
}
</style>
