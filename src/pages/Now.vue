<script setup>
import { ref, computed, onMounted } from "vue";
import { motion } from "motion-v";
import { getAllPosts, formatDate as formatBlogDate } from "@/services/blogService";
import {
    getRecentEvents,
    getContributionData,
    buildFallbackContributionYear,
} from "@/services/githubService";
import {
    CACHE_KEYS,
    readLocalCache,
    writeLocalCache,
} from "@/utils/apiLocalCache";
import { parseFrontmatter } from "@/utils/frontmatter";
import { renderMarkdown } from "@/utils/markdown";
import { staggerContainer, fadeUp } from "@/utils/motion";
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import ContributionGraph from "@/components/ContributionGraph.vue";
import OnRepeat from "@/components/OnRepeat.vue";
import ByTheNumbers from "@/components/ByTheNumbers.vue";
import nowRaw from "/content/now.md?raw";

const events = ref([]);
const eventsCached = readLocalCache(CACHE_KEYS.GITHUB_EVENTS);
if (eventsCached?.value?.length) {
    events.value = eventsCached.value;
}
const eventsLoading = ref(!events.value.length);
const eventsRevalidating = ref(false);

const contributions = ref([]);
const contribCached = readLocalCache(CACHE_KEYS.GITHUB_CONTRIBUTIONS);
if (contribCached?.value?.length) {
    contributions.value = contribCached.value;
}
const contributionsLoading = ref(!contributions.value.length);

const recentPosts = computed(() => getAllPosts().slice(0, 4));
const recentEvents = computed(() => events.value.slice(0, 4));

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

const fetchEvents = async () => {
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
};

const fetchContributions = async () => {
    if (contributions.value.length === 0) contributionsLoading.value = true;
    try {
        const data = await getContributionData();
        contributions.value = data;
        writeLocalCache(CACHE_KEYS.GITHUB_CONTRIBUTIONS, data);
    } catch {
        if (!contributions.value.length) {
            contributions.value = buildFallbackContributionYear();
        }
    } finally {
        contributionsLoading.value = false;
    }
};

onMounted(() => {
    if (!eventsCached?.fresh || !events.value.length) fetchEvents();
    if (!contribCached?.fresh || !contributions.value.length) fetchContributions();
});

const container = staggerContainer(0.06);
</script>

<template>
    <div class="w-full min-h-[100dvh]">
        <div class="max-w-2xl mx-auto px-6 pt-12 pb-16">
            <SiteNav />

            <motion.main :variants="container" initial="hidden" animate="visible" class="mt-12">
                <motion.h1 :variants="fadeUp" class="text-3xl md:text-4xl font-medium tracking-tight text-ink-text">
                    now
                </motion.h1>
                <motion.p v-if="lastUpdated" :variants="fadeUp" class="mt-2 text-ink-subtle">
                    last updated {{ lastUpdated }}.
                </motion.p>

                <motion.div :variants="fadeUp" class="now-prose mt-8 text-ink-text/85 leading-relaxed" v-html="nowHtml"></motion.div>

                <motion.p :variants="fadeUp" class="now-credit mt-8 text-xs text-ink-subtle leading-relaxed">
                    this page is inspired by
                    <a href="https://sivers.org/nowff" target="_blank" rel="noopener noreferrer">derek sivers' now page suggestion</a>
                    and his
                    <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer">now now now movement</a>.
                </motion.p>

                <motion.div :variants="fadeUp" class="mt-14 grid md:grid-cols-2 gap-x-12 gap-y-10">
                    <section>
                        <h2 class="text-ink-text font-medium mb-1">recent writing</h2>
                        <div class="divide-y divide-ink-surface/30">
                            <router-link
                                v-for="post in recentPosts"
                                :key="post.slug"
                                :to="{ path: '/blog', query: { post: post.slug } }"
                                class="group flex flex-col justify-center gap-1 min-h-[4rem]"
                            >
                                <span class="text-sm text-ink-text group-hover:text-ink-mint transition-colors truncate">
                                    {{ post.title }}
                                </span>
                                <span class="text-xs text-ink-subtle">{{ formatBlogDate(post.date) }}</span>
                            </router-link>
                        </div>
                    </section>

                    <section>
                        <h2 class="text-ink-text font-medium mb-1 flex items-center gap-2">
                            recent commits
                            <span v-if="eventsRevalidating" class="text-xs text-ink-subtle font-normal">syncing</span>
                        </h2>

                        <div v-if="eventsLoading" class="space-y-3 pt-3">
                            <div v-for="i in 4" :key="i" class="skeleton-pulse h-3 bg-ink-surface/30" :style="{ width: ['70%','55%','62%','48%'][i - 1] }"></div>
                        </div>

                        <div v-else-if="!events.length" class="text-sm text-ink-subtle pt-3">no recent activity.</div>

                        <div v-else class="divide-y divide-ink-surface/30">
                            <a
                                v-for="(event, i) in recentEvents"
                                :key="i"
                                :href="event.repoUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="group flex flex-col justify-center gap-1 min-h-[4rem]"
                            >
                                <div class="flex items-baseline justify-between gap-3">
                                    <span class="text-sm text-ink-text group-hover:text-ink-mint transition-colors truncate">{{ event.repo }}</span>
                                    <span class="text-xs text-ink-subtle flex-shrink-0">{{ formatRelativeTime(event.date) }}</span>
                                </div>
                                <span class="text-xs text-ink-subtle truncate block">{{ event.message }}</span>
                            </a>
                        </div>
                    </section>
                </motion.div>

                <motion.section :variants="fadeUp" class="mt-14">
                    <h2 class="text-ink-text font-medium mb-3">
                        on repeat <span class="text-xs text-ink-subtle font-normal">this week</span>
                    </h2>
                    <OnRepeat />
                </motion.section>

                <motion.section :variants="fadeUp" class="mt-14">
                    <h2 class="text-ink-text font-medium mb-4">by the numbers</h2>
                    <ByTheNumbers :contributions="contributions" />
                </motion.section>

                <motion.section :variants="fadeUp" class="mt-14">
                    <h2 class="text-ink-text font-medium mb-3">contributions</h2>
                    <ContributionGraph :contributions="contributions" :loading="contributionsLoading" />
                </motion.section>
            </motion.main>

            <SiteFooter />
        </div>
    </div>
</template>

<style scoped>
.now-prose :deep(p) { margin-bottom: 0.85rem; }

.now-prose :deep(h2) {
    font-size: 1rem;
    font-weight: 500;
    color: rgb(var(--color-text));
    margin-top: 1.75rem;
    margin-bottom: 0.5rem;
}

.now-prose :deep(.heading-anchor) { display: none; }

.now-prose :deep(ul) { list-style: none; padding-left: 0; margin: 0.5rem 0; }

.now-prose :deep(li) {
    padding-left: 1.1rem;
    position: relative;
    margin-bottom: 0.35rem;
    color: rgb(var(--color-text) / 0.75);
}

.now-prose :deep(li)::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 0.32rem;
    height: 1px;
    background: rgb(var(--color-mint));
}

.now-credit a {
    color: rgb(var(--color-text) / 0.7);
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: rgb(var(--color-surface));
    transition: color 0.15s ease;
}

.now-credit a:hover,
.now-credit a:focus-visible {
    color: rgb(var(--color-mint));
}
</style>
