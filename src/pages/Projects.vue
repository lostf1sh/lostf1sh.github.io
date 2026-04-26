<script setup>
import { ref, computed, onMounted } from "vue";
import { motion } from "motion-v";
import { getAllReposWithLanguages } from "@/services/githubService";
import {
    CACHE_KEYS,
    readLocalCache,
    writeLocalCache,
} from "@/utils/apiLocalCache";
import {
    springs,
    staggerContainer,
    fadeUp,
} from "@/utils/motion";
import SiteNav from "@/components/SiteNav.vue";
import EnsoLoader from "@/components/EnsoLoader.vue";
import SiteFooter from "@/components/SiteFooter.vue";

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

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

onMounted(fetchRepos);

const headerContainer = staggerContainer(0.06);
const repoContainer = staggerContainer(0.04);
</script>

<template>
    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <motion.div
                class="mb-12"
                :variants="headerContainer"
                initial="hidden"
                animate="visible"
            >
                <motion.div :variants="fadeUp" class="mb-2">
                    <SiteNav />
                </motion.div>

                <motion.h1
                    :variants="fadeUp"
                    class="font-serif text-3xl md:text-4xl font-semibold text-catppuccin-text tracking-tight mb-2"
                >
                    projects
                </motion.h1>

                <motion.p :variants="fadeUp" class="text-sm text-catppuccin-subtle mb-6">
                    open source projects and experiments
                    <span
                        v-if="revalidating"
                        class="block text-xs text-catppuccin-subtle/50 mt-1"
                    >updating…</span>
                </motion.p>

                <motion.div
                    v-if="!loading && languages.length"
                    :variants="fadeUp"
                    class="flex flex-wrap gap-2"
                >
                    <button
                        v-for="{ lang, count } in languages"
                        :key="lang"
                        @click="toggleLanguage(lang)"
                        class="px-2.5 py-1 text-xs border transition-colors cursor-pointer"
                        :class="activeLanguage === lang
                            ? 'bg-catppuccin-mauve/15 border-catppuccin-mauve/40 text-catppuccin-mauve'
                            : 'bg-transparent border-catppuccin-surface/40 text-catppuccin-subtle hover:text-catppuccin-text hover:border-catppuccin-overlay/40'"
                    >
                        {{ lang }} ({{ count }})
                    </button>
                </motion.div>
            </motion.div>

            <div v-if="loading" class="flex items-center gap-3 text-sm text-catppuccin-subtle py-4">
                <EnsoLoader :size="20" />
                <span>loading projects</span>
            </div>

            <template v-else>
                <!-- Pinned repos -->
                <div v-if="pinnedRepos.length && !activeLanguage" class="mb-10">
                    <div class="section-label mb-4">pinned</div>
                    <motion.div
                        :variants="repoContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.a
                            v-for="repo in pinnedRepos"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="fadeUp"
                            class="group block py-3 border-b border-catppuccin-surface/20"
                        >
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2 min-w-0">
                                    <span class="text-catppuccin-mauve text-xs">★</span>
                                    <span class="text-catppuccin-text font-medium group-hover:text-catppuccin-mauve transition-colors truncate text-sm">
                                        {{ repo.name }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-3 flex-shrink-0">
                                    <span v-if="repo.stargazers_count > 0" class="text-catppuccin-subtle text-xs">
                                        {{ repo.stargazers_count }}★
                                    </span>
                                    <span v-if="repo.language" class="text-catppuccin-subtle text-xs">
                                        {{ repo.language }}
                                    </span>
                                </div>
                            </div>
                            <p class="text-xs text-catppuccin-subtle mt-0.5 truncate">
                                {{ repo.description || "—" }}
                            </p>
                        </motion.a>
                    </motion.div>
                </div>

                <!-- All repos -->
                <div>
                    <div class="section-label mb-4">
                        {{ activeLanguage || 'all' }}
                    </div>

                    <div v-if="!filteredRepos.length" class="text-sm text-catppuccin-subtle py-4">
                        no projects found
                        <button
                            v-if="activeLanguage"
                            @click="activeLanguage = null"
                            class="block text-xs text-catppuccin-mauve mt-1 cursor-pointer"
                        >clear filter</button>
                    </div>

                    <motion.div
                        v-else
                        :variants="repoContainer"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.a
                            v-for="repo in filteredRepos"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="fadeUp"
                            class="group block py-3 border-b border-catppuccin-surface/20 last:border-0"
                        >
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-catppuccin-text font-medium group-hover:text-catppuccin-mauve transition-colors truncate text-sm">
                                    {{ repo.name }}
                                </span>
                                <div class="flex items-center gap-3 flex-shrink-0">
                                    <span v-if="repo.stargazers_count > 0" class="text-catppuccin-subtle text-xs">
                                        {{ repo.stargazers_count }}★
                                    </span>
                                    <span v-if="repo.language" class="text-catppuccin-subtle text-xs">
                                        {{ repo.language }}
                                    </span>
                                </div>
                            </div>
                            <p class="text-xs text-catppuccin-subtle mt-0.5 truncate">
                                {{ repo.description || "—" }}
                            </p>
                        </motion.a>
                    </motion.div>
                </div>
            </template>

            <SiteFooter />
        </div>
    </div>
</template>
