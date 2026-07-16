<script setup>
import { ref, computed, onMounted } from "vue";
import { getAllReposWithLanguages } from "@/services/githubService";
import { getAllPosts } from "@/services/blogService";
import { CACHE_KEYS, readLocalCache, writeLocalCache } from "@/utils/apiLocalCache";
import CountUp from "@/components/CountUp.vue";

const props = defineProps({
    contributions: { type: Array, default: () => [] },
});

const postCount = getAllPosts().length;

const stats = ref({ totalRepos: 0, totalStars: 0 });
const cached = readLocalCache(CACHE_KEYS.GITHUB_STATS);
if (cached?.value) stats.value = { totalRepos: cached.value.totalRepos || 0, totalStars: cached.value.totalStars || 0 };

onMounted(async () => {
    if (cached?.fresh) return;
    try {
        const { repos, totalRepos } = await getAllReposWithLanguages();
        const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        stats.value = { totalRepos, totalStars };
        writeLocalCache(CACHE_KEYS.GITHUB_STATS, stats.value);
    } catch {
    }
});

const totalContributions = computed(() =>
    props.contributions.reduce((s, d) => s + d.count, 0),
);

const streak = computed(() => {
    const arr = props.contributions;
    let s = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].count > 0) s++;
        else if (i === arr.length - 1) continue;
        else break;
    }
    return s;
});

const numbers = computed(() => [
    { label: "posts", value: postCount },
    { label: "repos", value: stats.value.totalRepos },
    { label: "stars", value: stats.value.totalStars },
    { label: "day streak", value: streak.value },
    { label: "commits / yr", value: totalContributions.value },
]);
</script>

<template>
    <div>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-y-6 gap-x-4">
            <div v-for="n in numbers" :key="n.label">
                <div class="text-2xl md:text-3xl font-medium tracking-tight text-ink-text">
                    <CountUp :value="n.value" />
                </div>
                <div class="text-xs text-ink-subtle mt-0.5">{{ n.label }}</div>
            </div>
        </div>
    </div>
</template>
