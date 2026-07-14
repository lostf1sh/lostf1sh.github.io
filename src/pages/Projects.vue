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
import SiteFooter from "@/components/SiteFooter.vue";

const repos = ref([]);
const reposCached = readLocalCache(CACHE_KEYS.GITHUB_REPOS);
if (reposCached?.value?.length) {
    repos.value = reposCached.value;
}
const loading = ref(!repos.value.length);

const pinnedSlugs = ["lostf1sh.github.io", "PixelPlayer", "PixelPlayerOSS"];
const pinnedExternal = ["theovilardo/PixelPlayer", "PixelPlayerHQ/PixelPlayerOSS"];

const fetchRepos = async () => {
    const firstPaint = repos.value.length === 0;
    if (firstPaint) loading.value = true;
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
    }
};

const pinnedRepos = computed(() =>
    repos.value.filter((r) => pinnedSlugs.includes(r.name)),
);

const filteredRepos = computed(() =>
    repos.value
        .filter((r) => !pinnedSlugs.includes(r.name))
        .sort((a, b) => b.stargazers_count - a.stargazers_count),
);

onMounted(fetchRepos);

const container = staggerContainer(0.06);
</script>

<template>
    <div class="w-full min-h-[100dvh]">
        <div class="max-w-2xl mx-auto px-6 pt-12 pb-10">
            <SiteNav />

            <motion.main :variants="container" initial="hidden" animate="visible" class="mt-12">
                <motion.h1 :variants="fadeUp" class="text-3xl md:text-4xl font-medium tracking-tight text-ink-text">
                    projects
                </motion.h1>
                <motion.p :variants="fadeUp" class="mt-2 text-ink-subtle">
                    open source tools and experiments. mostly small, mostly useful.
                </motion.p>

                <div v-if="loading" class="mt-10 space-y-5">
                    <div v-for="i in 5" :key="i" class="space-y-2">
                        <div class="skeleton-pulse h-3.5 bg-ink-surface/30" :style="{ width: ['40%','55%','35%','48%','42%'][i - 1] }"></div>
                        <div class="skeleton-pulse h-3 bg-ink-surface/20" :style="{ width: ['72%','60%','80%','66%','70%'][i - 1] }"></div>
                    </div>
                </div>

                <template v-else>
                    <motion.section v-if="pinnedRepos.length" :variants="fadeUp" class="mt-10">
                        <h2 class="text-ink-text font-medium mb-1">pinned</h2>
                        <div class="divide-y divide-ink-surface/30">
                            <a
                                v-for="repo in pinnedRepos"
                                :key="repo.id"
                                :href="repo.html_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="group block py-4"
                            >
                                <div class="flex items-baseline justify-between gap-4">
                                    <span class="text-ink-text group-hover:text-ink-mint transition-colors truncate">{{ repo.name }}</span>
                                    <div class="flex items-center gap-3 flex-shrink-0 text-sm text-ink-subtle">
                                        <span v-if="repo.stargazers_count > 0">★ {{ repo.stargazers_count }}</span>
                                        <span v-if="repo.language">{{ repo.language.toLowerCase() }}</span>
                                    </div>
                                </div>
                                <p class="mt-1 text-sm text-ink-subtle">{{ repo.description || "no description" }}</p>
                            </a>
                        </div>
                    </motion.section>

                    <motion.section :variants="fadeUp" class="mt-10">
                        <h2 class="text-ink-text font-medium mb-1">all repositories</h2>

                        <div v-if="!filteredRepos.length" class="text-sm text-ink-subtle py-4">
                            no repositories to show.
                        </div>

                        <div v-else class="divide-y divide-ink-surface/30">
                            <a
                                v-for="repo in filteredRepos"
                                :key="repo.id"
                                :href="repo.html_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="group block py-4"
                            >
                                <div class="flex items-baseline justify-between gap-4">
                                    <span class="text-ink-text group-hover:text-ink-mint transition-colors truncate">{{ repo.name }}</span>
                                    <div class="flex items-center gap-3 flex-shrink-0 text-sm text-ink-subtle">
                                        <span v-if="repo.stargazers_count > 0">★ {{ repo.stargazers_count }}</span>
                                        <span v-if="repo.language">{{ repo.language.toLowerCase() }}</span>
                                    </div>
                                </div>
                                <p class="mt-1 text-sm text-ink-subtle">{{ repo.description || "no description" }}</p>
                            </a>
                        </div>
                    </motion.section>
                </template>
            </motion.main>

            <SiteFooter />
        </div>
    </div>
</template>
