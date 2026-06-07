<script setup>
import { ref, computed, onMounted } from "vue";
import { motion } from "motion-v";
import { getAllReposWithLanguages } from "@/services/githubService";
import {
    CACHE_KEYS,
    readLocalCache,
    writeLocalCache,
} from "@/utils/apiLocalCache";
import { staggerContainer, fadeUp } from "@/utils/motion";
import SiteNav from "@/components/SiteNav.vue";

const repos = ref([]);
const reposCached = readLocalCache(CACHE_KEYS.GITHUB_REPOS);
if (reposCached?.value?.length) {
    repos.value = reposCached.value;
}
const loading = ref(!repos.value.length);
const revalidating = ref(false);
const activeLanguage = ref(null);

const pinnedSlugs = ["lostf1sh.github.io", "PixelPlayer"];
const pinnedExternal = ["theovilardo/PixelPlayer"];

const fetchRepos = async () => {
    const firstPaint = repos.value.length === 0;
    if (firstPaint) loading.value = true;
    else revalidating.value = true;
    try {
        const [{ repos: ownRepos }, ...pinnedResults] = await Promise.all([
            getAllReposWithLanguages(),
            ...pinnedExternal.map((r) =>
                fetch(`https://api.github.com/repos/${r}`)
                    .then((res) => (res.ok ? res.json() : null))
                    .catch(() => null),
            ),
        ]);
        const pinned = pinnedResults.filter(Boolean);
        repos.value = [...pinned, ...ownRepos];
        writeLocalCache(CACHE_KEYS.GITHUB_REPOS, repos.value);
    } catch {
        if (!repos.value.length) repos.value = [];
    } finally {
        loading.value = false;
        revalidating.value = false;
    }
};

const languages = computed(() => {
    const counts = {};
    repos.value.forEach((r) => {
        if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([lang, count]) => ({ lang, count }));
});

const pinnedRepos = computed(() =>
    repos.value.filter((r) => pinnedSlugs.includes(r.name)),
);

const filteredRepos = computed(() => {
    let list = repos.value
        .filter((r) => !pinnedSlugs.includes(r.name))
        .sort((a, b) => b.stargazers_count - a.stargazers_count);

    if (activeLanguage.value) {
        list = list.filter((r) => r.language === activeLanguage.value);
    }
    return list;
});

const toggleLanguage = (lang) => {
    activeLanguage.value = activeLanguage.value === lang ? null : lang;
};

onMounted(fetchRepos);

const headerContainer = staggerContainer(0.06);
const repoContainer = staggerContainer(0.03);
</script>

<template>
    <div class="w-full min-h-screen">
        <div class="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
            <h1 class="sr-only">projects</h1>
            <motion.div :variants="headerContainer" initial="hidden" animate="visible">
                <motion.div :variants="fadeUp"><SiteNav /></motion.div>
            </motion.div>

            <!-- Filter -->
            <div v-if="!loading && languages.length" class="flex flex-wrap gap-1.5 mb-5">
                <button
                    v-for="{ lang, count } in languages"
                    :key="lang"
                    @click="toggleLanguage(lang)"
                    class="px-2 py-0.5 text-[10px] border transition-colors cursor-pointer"
                    :class="activeLanguage === lang
                        ? 'bg-ink-text/8 border-ink-text/20 text-ink-text'
                        : 'bg-transparent border-ink-surface/50 text-ink-subtle hover:text-ink-text hover:border-ink-overlay/40'"
                >
                    {{ lang.toLowerCase() }}({{ count }})
                </button>
            </div>

            <div v-if="loading" class="text-xs text-ink-subtle py-4">loading...</div>

            <template v-else>
                <div v-if="pinnedRepos.length && !activeLanguage" class="tui-panel mb-5">
                    <span class="tui-panel-title">pinned</span>
                    <motion.div :variants="repoContainer" initial="hidden" animate="visible" class="pt-1">
                        <motion.a
                            v-for="repo in pinnedRepos"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="fadeUp"
                            class="group block py-2 border-b border-ink-surface/15 last:border-0 text-xs"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-ink-text group-hover:text-ink-accent transition-colors truncate">{{ repo.name }}</span>
                                <div class="flex items-center gap-3 flex-shrink-0 text-ink-subtle">
                                    <span v-if="repo.stargazers_count > 0">★{{ repo.stargazers_count }}</span>
                                    <span v-if="repo.language">{{ repo.language.toLowerCase() }}</span>
                                </div>
                            </div>
                            <div class="text-ink-subtle truncate mt-0.5">{{ repo.description || "--" }}</div>
                        </motion.a>
                    </motion.div>
                </div>

                <div class="tui-panel">
                    <span class="tui-panel-title">{{ activeLanguage ? activeLanguage.toLowerCase() : 'all' }}</span>

                    <div v-if="!filteredRepos.length" class="text-xs text-ink-subtle py-3 pt-2">
                        (no projects found)
                        <button v-if="activeLanguage" @click="activeLanguage = null" class="text-ink-text ml-2 cursor-pointer">[clear]</button>
                    </div>

                    <motion.div v-else :variants="repoContainer" initial="hidden" animate="visible" class="pt-1">
                        <motion.a
                            v-for="repo in filteredRepos"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="fadeUp"
                            class="group block py-2 border-b border-ink-surface/10 last:border-0 text-xs"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-ink-text group-hover:text-ink-accent transition-colors truncate">{{ repo.name }}</span>
                                <div class="flex items-center gap-3 flex-shrink-0 text-ink-subtle">
                                    <span v-if="repo.stargazers_count > 0">★{{ repo.stargazers_count }}</span>
                                    <span v-if="repo.language">{{ repo.language.toLowerCase() }}</span>
                                </div>
                            </div>
                            <div class="text-ink-subtle truncate mt-0.5">{{ repo.description || "--" }}</div>
                        </motion.a>
                    </motion.div>
                </div>
            </template>

        </div>
    </div>
</template>
