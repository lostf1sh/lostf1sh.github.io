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
    fadeLeft,
    scaleFade,
    cardHover,
    cardPress,
} from "@/utils/motion";

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

const langColors = {
    JavaScript: "text-catppuccin-yellow",
    TypeScript: "text-catppuccin-blue",
    Python: "text-catppuccin-green",
    Dart: "text-catppuccin-blue",
    Rust: "text-catppuccin-peach",
    Vue: "text-catppuccin-green",
    HTML: "text-catppuccin-red",
    CSS: "text-catppuccin-mauve",
    Shell: "text-catppuccin-green",
};
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <motion.div
                class="mb-12"
                :variants="headerContainer"
                initial="hidden"
                animate="visible"
            >
                <motion.div :variants="fadeUp" class="text-catppuccin-subtle text-sm mb-2">
                    ~$ ls ~/projects
                </motion.div>
                <motion.h1
                    :variants="fadeUp"
                    class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"
                    style="text-wrap: balance"
                >
                    <span class="text-catppuccin-mauve">projects</span>
                </motion.h1>
                <motion.p :variants="fadeUp" class="text-sm text-catppuccin-gray leading-relaxed mb-6">
                    open source projects and experiments.
                    <span
                        v-if="revalidating"
                        class="block text-xs text-catppuccin-subtle mt-1"
                    >refreshing from github…</span>
                </motion.p>

                <motion.div :variants="fadeUp" class="flex items-center gap-4 text-sm mb-6">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                    >
                        [← home]
                    </router-link>
                </motion.div>

                <motion.div
                    v-if="!loading && languages.length"
                    :variants="fadeUp"
                    class="flex flex-wrap gap-2"
                >
                    <button
                        v-for="{ lang, count } in languages"
                        :key="lang"
                        @click="toggleLanguage(lang)"
                        class="px-2 py-0.5 rounded text-xs border transition-colors cursor-pointer"
                        :class="activeLanguage === lang
                            ? 'bg-catppuccin-mauve/20 border-catppuccin-mauve text-catppuccin-mauve'
                            : 'bg-catppuccin-surface/30 border-catppuccin-surface text-catppuccin-subtle hover:text-catppuccin-text hover:border-catppuccin-overlay'"
                    >
                        {{ lang }} ({{ count }})
                    </button>
                </motion.div>
            </motion.div>

            <div v-if="loading" class="text-sm text-catppuccin-subtle">
                loading repositories…
            </div>

            <template v-else>
                <div v-if="pinnedRepos.length && !activeLanguage" class="mb-8">
                    <motion.div
                        :variants="fadeLeft"
                        class="border-l-2 border-catppuccin-surface pl-4"
                    >
                        <div class="text-catppuccin-subtle text-sm mb-3">
                            ~$ cat pinned.txt
                        </div>
                        <motion.div
                            :variants="repoContainer"
                            initial="hidden"
                            animate="visible"
                            class="divide-y divide-catppuccin-surface/40"
                        >
                            <motion.a
                                v-for="repo in pinnedRepos"
                                :key="repo.id"
                                :href="repo.html_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                :variants="scaleFade"
                                class="flex items-start gap-3 text-sm group py-2.5 first:pt-0"
                            >
                                <span class="text-catppuccin-mauve mt-0.5">★</span>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span class="text-catppuccin-text font-medium group-hover:text-catppuccin-mauve transition-colors truncate">
                                            {{ repo.name }}
                                        </span>
                                        <span v-if="repo.stargazers_count > 0" class="text-catppuccin-yellow text-xs flex-shrink-0">
                                            ★{{ repo.stargazers_count }}
                                        </span>
                                        <span v-if="repo.language" :class="langColors[repo.language] || 'text-catppuccin-subtle'" class="text-xs flex-shrink-0 ml-auto">
                                            {{ repo.language }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-catppuccin-gray truncate">
                                        {{ repo.description || "no description" }}
                                    </p>
                                </div>
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    :variants="fadeLeft"
                    class="border-l-2 border-catppuccin-surface pl-4"
                >
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ find ~/projects -type d {{ activeLanguage ? `| grep ${activeLanguage}` : '' }}
                    </div>

                    <div v-if="!filteredRepos.length" class="text-sm text-catppuccin-subtle py-4">
                        <div>
                            <span class="text-catppuccin-peach">$</span> no projects found<template v-if="activeLanguage"> matching <span class="text-catppuccin-mauve">{{ activeLanguage }}</span></template>
                        </div>
                        <div class="text-catppuccin-overlay mt-1">
                            try a different language or clear the filter
                        </div>
                    </div>

                    <motion.div
                        v-else
                        :variants="repoContainer"
                        initial="hidden"
                        animate="visible"
                        class="divide-y divide-catppuccin-surface/40"
                    >
                        <motion.a
                            v-for="repo in filteredRepos"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="scaleFade"
                            class="flex items-start gap-3 text-sm group py-2.5 first:pt-0"
                        >
                            <span class="text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors mt-0.5">&gt;</span>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors font-medium truncate">
                                        {{ repo.name }}
                                    </span>
                                    <span v-if="repo.stargazers_count > 0" class="text-catppuccin-yellow text-xs flex-shrink-0">
                                        ★{{ repo.stargazers_count }}
                                    </span>
                                    <span v-if="repo.language" :class="langColors[repo.language] || 'text-catppuccin-subtle'" class="text-xs flex-shrink-0 ml-auto">
                                        {{ repo.language }}
                                    </span>
                                </div>
                                <p class="text-xs text-catppuccin-gray truncate">
                                    {{ repo.description || "no description" }}
                                </p>
                            </div>
                        </motion.a>
                    </motion.div>
                </motion.div>
            </template>
        </div>
    </div>
</template>
