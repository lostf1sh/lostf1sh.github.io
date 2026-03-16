<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { motion } from "motion-v";
import { lanyardData } from "@/services/lanyardService";
import { getRecentTracks } from "@/services/lastfmService";
import {
    getAllReposWithLanguages,
    getContributionData,
} from "@/services/githubService";
import {
    staggerContainer,
    fadeUp,
    fadeLeft,
} from "@/utils/motion";

import StatusSection from "@/components/StatusSection.vue";
import ProjectsGrid from "@/components/ProjectsGrid.vue";
import RecentTracks from "@/components/RecentTracks.vue";
import ContributionGraph from "@/components/ContributionGraph.vue";

const discordStatusColor = computed(() => lanyardData.discordStatusColor);
const spotify = computed(() => lanyardData.spotify);
const discordStatus = computed(() => lanyardData.discordStatus);
const discordUser = computed(() => lanyardData.discordUser);
const editorActivity = computed(() => lanyardData.editorActivity);
const isLoading = computed(() => lanyardData.isLoading);

const repos = ref([]);
const reposLoading = ref(true);
const allTracks = ref([]);
const songsLoading = ref(true);
const songsInitialLoad = ref(true);
const songsError = ref(null);
const contributions = ref([]);
const contributionsLoading = ref(true);
let updateInterval = null;
let ageInterval = null;
let timeInterval = null;

const currentTrack = computed(() =>
    allTracks.value.find((track) => track["@attr"]?.nowplaying),
);

const consolidatedTracks = computed(() => {
    const tracks = allTracks.value.filter(
        (track) => !track["@attr"]?.nowplaying,
    );
    const consolidated = [];
    let currentKey = null;
    let count = 1;

    tracks.forEach((track, index) => {
        const key = `${track.name}-${track.artist["#text"]}`;
        if (currentKey === key) {
            count++;
        } else {
            if (currentKey) {
                const prevTrack = tracks[index - 1];
                consolidated.push({
                    ...prevTrack,
                    playcount: count,
                    date: prevTrack.date?.["#text"],
                });
            }
            currentKey = key;
            count = 1;
        }
        if (index === tracks.length - 1) {
            consolidated.push({
                ...track,
                playcount: count,
                date: track.date?.["#text"],
            });
        }
    });

    return consolidated.slice(0, 10);
});

const pinnedExternal = ["theovilardo/PixelPlayer"];
const pinnedFullNames = new Set(pinnedExternal);

const displayedRepos = computed(() => {
    if (!repos.value.length) return [];

    const pinned = repos.value.filter((r) => pinnedFullNames.has(r.full_name));
    const rest = repos.value
        .filter((r) => !pinnedFullNames.has(r.full_name))
        .sort((a, b) => b.stargazers_count - a.stargazers_count);

    return [...pinned, ...rest].slice(0, 6);
});

const fetchSongs = async () => {
    try {
        songsLoading.value = true;
        allTracks.value = await getRecentTracks();
        songsError.value = null;
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load recent tracks:", error);
        songsError.value = "couldn't load tracks";
    } finally {
        songsLoading.value = false;
        songsInitialLoad.value = false;
    }
};

const fetchProjects = async () => {
    try {
        reposLoading.value = true;
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
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load repositories:", error);
        repos.value = [];
    } finally {
        reposLoading.value = false;
    }
};

const fetchContributions = async () => {
    try {
        contributionsLoading.value = true;
        contributions.value = await getContributionData();
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load contribution data:", error);
        contributions.value = [];
    } finally {
        contributionsLoading.value = false;
    }
};

onMounted(() => {
    fetchProjects();
    fetchSongs();
    fetchContributions();
    updateAge();
    updateTime();
    updateInterval = setInterval(fetchSongs, 30000);
    ageInterval = setInterval(updateAge, 1000);
    timeInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
    if (updateInterval) clearInterval(updateInterval);
    if (ageInterval) clearInterval(ageInterval);
    if (timeInterval) clearInterval(timeInterval);
});

const BIRTH_DATE = new Date("2008-06-06T00:00:00");

const currentAge = ref(0);
const currentTime = ref("");

const updateAge = () => {
    const now = new Date();
    const diffMs = now - BIRTH_DATE;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    currentAge.value = diffDays / 365.25;
};

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

// Variant definitions
const heroContainer = staggerContainer(0.06);
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Hero section -->
            <motion.div
                class="mb-12"
                :variants="heroContainer"
                initial="hidden"
                animate="visible"
            >
                <div class="mb-8">
                    <motion.div
                        :variants="fadeUp"
                        class="text-catppuccin-subtle text-sm mb-2"
                    >
                        ~$ whoami
                    </motion.div>
                    <motion.h1
                        :variants="fadeUp"
                        class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2"
                    >
                        <span class="text-catppuccin-mauve">f1sh.</span>
                        <span class="text-catppuccin-subtle">v</span>
                        <span class="text-catppuccin-blue">.recipes</span>
                    </motion.h1>
                    <motion.div
                        :variants="fadeUp"
                        class="text-sm text-catppuccin-gray mb-4 flex items-center gap-2"
                    >
                        <span class="text-catppuccin-subtle">aka </span
                        ><span class="text-catppuccin-green">moli</span>
                        <span class="text-catppuccin-surface">|</span>
                        <span class="text-catppuccin-peach">{{ currentTime }}</span>
                        <span class="text-catppuccin-subtle text-xs">TRT</span>
                    </motion.div>

                    <motion.div
                        :variants="fadeUp"
                        class="flex items-center flex-wrap gap-4 text-sm"
                    >
                        <router-link
                            to="/blog"
                            class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors"
                        >
                            [blog]
                        </router-link>
                        <router-link
                            to="/projects"
                            class="text-catppuccin-subtle hover:text-catppuccin-blue transition-colors"
                        >
                            [projects]
                        </router-link>
                        <a
                            href="https://github.com/lostf1sh"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                        >
                            [github]
                        </a>
                        <a
                            href="https://www.instagram.com/kawaiimoli"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-catppuccin-subtle hover:text-catppuccin-pink transition-colors"
                        >
                            [instagram]
                        </a>
                        <router-link
                            to="/uses"
                            class="text-catppuccin-subtle hover:text-catppuccin-peach transition-colors"
                        >
                            [uses]
                        </router-link>
                        <router-link
                            to="/now"
                            class="text-catppuccin-subtle hover:text-catppuccin-green transition-colors"
                        >
                            [now]
                        </router-link>
                    </motion.div>
                </div>

                <!-- About section -->
                <motion.div
                    :variants="fadeLeft"
                    class="border-l-2 border-catppuccin-surface pl-4 mb-4"
                >
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ cat about.txt
                    </div>
                    <p class="text-catppuccin-text leading-relaxed mb-4">
                        <span class="text-catppuccin-yellow">{{ currentAge.toFixed(10) }}</span> y/o
                        junior dev. building stuff and learning along the way.
                        code, table tennis, cooking. based in turkey.
                    </p>
                </motion.div>

                <!-- Status section -->
                <StatusSection
                    :isLoading="isLoading"
                    :discordUser="discordUser"
                    :discordStatus="discordStatus"
                    :discordStatusColor="discordStatusColor"
                    :spotify="spotify"
                    :editorActivity="editorActivity"
                />

                <!-- Tools section -->
                <motion.div
                    :variants="fadeLeft"
                    class="border-l-2 border-catppuccin-surface pl-4 mb-4"
                >
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ ls ~/tools
                    </div>
                    <div class="text-sm text-catppuccin-text">
                        vue | git | nextjs | dart | python | js/ts | docker |
                        bash |
                    </div>
                </motion.div>

            </motion.div>

            <!-- Projects & Tracks grid -->
            <div class="grid lg:grid-cols-2 gap-6">
                <!-- Projects column -->
                <ProjectsGrid
                    :repos="displayedRepos"
                    :loading="reposLoading"
                />

                <!-- Tracks column -->
                <RecentTracks
                    :currentTrack="currentTrack"
                    :tracks="consolidatedTracks"
                    :loading="songsLoading"
                    :error="songsError"
                />
            </div>

            <!-- Contribution graph -->
            <ContributionGraph
                :contributions="contributions"
                :loading="contributionsLoading"
            />

        </div>
    </div>
</template>
