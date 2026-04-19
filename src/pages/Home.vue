<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { motion } from "motion-v";
import { lanyardData } from "@/services/lanyardService";
import {
    tracks as lastfmTracks,
    isLoading as lastfmLoading,
    isRevalidating as lastfmRevalidating,
    error as lastfmError,
    revalidateFailed as lastfmRevalidateFailed,
} from "@/services/lastfmService";
import {
    getAllReposWithLanguages,
    getContributionData,
    buildFallbackContributionYear,
} from "@/services/githubService";
import { markReady } from "@/services/preloader";
import {
    CACHE_KEYS,
    readLocalCache,
    writeLocalCache,
} from "@/utils/apiLocalCache";
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
const lanyardConnected = computed(() => lanyardData.isConnected);
const lanyardReconnecting = computed(() => lanyardData.isReconnecting);
const lanyardUnavailable = computed(() => lanyardData.presenceUnavailable);
const lanyardStalePresence = computed(() => lanyardData.usingCachedPresence);

const repos = ref([]);
const reposCached = readLocalCache(CACHE_KEYS.GITHUB_REPOS);
if (reposCached?.value?.length) {
    repos.value = reposCached.value;
    markReady("projects");
}
const reposLoading = ref(!repos.value.length);
const reposRevalidating = ref(false);

const contributions = ref([]);
const contribCached = readLocalCache(CACHE_KEYS.GITHUB_CONTRIBUTIONS);
if (contribCached?.value?.length) {
    contributions.value = contribCached.value;
    markReady("contributions");
}
const contributionsLoading = ref(!contributions.value.length);
const contributionsRevalidating = ref(false);
let ageRafId = null;
let timeInterval = null;
const isClockHovered = ref(false);
const isAgeWarping = ref(false);
const isAltPressed = ref(false);
let ageWarpStartedAt = 0;

const AGE_WARP_DURATION_MS = 2000;
const AGE_WARP_MULTIPLIER = 10;

// Now playing from Lanyard Spotify (real-time via WebSocket)
const currentTrack = computed(() => {
    const sp = lanyardData.spotify;
    if (!sp) return null;
    return {
        name: sp.song,
        artist: { "#text": sp.artist },
        url: `https://open.spotify.com/track/${sp.track_id}`,
    };
});

// Past tracks from LastFM (excludes any nowplaying entry)
const consolidatedTracks = computed(() => {
    const tracks = lastfmTracks.value.filter(
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

const fetchProjects = async () => {
    const firstPaint = repos.value.length === 0;
    if (firstPaint) reposLoading.value = true;
    reposRevalidating.value = !firstPaint;
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
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load repositories:", error);
        if (!repos.value.length) repos.value = [];
    } finally {
        reposLoading.value = false;
        reposRevalidating.value = false;
        markReady("projects");
    }
};

const fetchContributions = async () => {
    const firstPaint = contributions.value.length === 0;
    if (firstPaint) contributionsLoading.value = true;
    contributionsRevalidating.value = !firstPaint;
    try {
        const data = await getContributionData();
        contributions.value = data;
        writeLocalCache(CACHE_KEYS.GITHUB_CONTRIBUTIONS, data);
    } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load contribution data:", error);
        if (!contributions.value.length) {
            contributions.value = buildFallbackContributionYear();
        }
    } finally {
        contributionsLoading.value = false;
        contributionsRevalidating.value = false;
        markReady("contributions");
    }
};

onMounted(() => {
    fetchProjects();
    fetchContributions();
    updateTime();
    window.addEventListener("keydown", handleWarpHotkey);
    window.addEventListener("keyup", handleAltRelease);
    const tickAge = () => {
        updateAge();
        ageRafId = requestAnimationFrame(tickAge);
    };
    tickAge();
    timeInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
    if (ageRafId) cancelAnimationFrame(ageRafId);
    if (timeInterval) clearInterval(timeInterval);
    window.removeEventListener("keydown", handleWarpHotkey);
    window.removeEventListener("keyup", handleAltRelease);
});

const BIRTH_DATE = new Date("2008-06-06T00:00:00");

const currentAge = ref(0);
const currentTime = ref("");

const updateAge = () => {
    let nowMs = Date.now();

    if (isAgeWarping.value) {
        const elapsed = performance.now() - ageWarpStartedAt;
        if (elapsed >= AGE_WARP_DURATION_MS) {
            isAgeWarping.value = false;
        } else {
            nowMs += elapsed * (AGE_WARP_MULTIPLIER - 1);
        }
    }

    const now = new Date(nowMs);
    const diffMs = now - BIRTH_DATE;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    currentAge.value = diffDays / 365.25;
};

const triggerAgeWarp = () => {
    if (isAgeWarping.value) return;
    isAgeWarping.value = true;
    ageWarpStartedAt = performance.now();
};

const handleWarpHotkey = (event) => {
    if (event.key !== "Alt") return;
    isAltPressed.value = true;
    if (isClockHovered.value) triggerAgeWarp();
};

const handleAltRelease = (event) => {
    if (event.key === "Alt") isAltPressed.value = false;
};

const handleClockMouseEnter = (event) => {
    isClockHovered.value = true;
    if (event.altKey || isAltPressed.value) triggerAgeWarp();
};

const handleClockMouseLeave = () => {
    isClockHovered.value = false;
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
                        style="text-wrap: balance"
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
                        <span
                            class="flex items-center gap-1"
                            @mouseenter="handleClockMouseEnter"
                            @mouseleave="handleClockMouseLeave"
                        >
                            <span class="text-catppuccin-peach" style="font-variant-numeric: tabular-nums">{{ currentTime }}</span>
                            <span class="text-catppuccin-subtle text-xs" :class="{ 'text-catppuccin-mauve': isAgeWarping }">TRT</span>
                            <span v-if="isAgeWarping" class="text-[10px] text-catppuccin-mauve">warp x10</span>
                        </span>
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
                        <span class="text-catppuccin-yellow" style="font-variant-numeric: tabular-nums">{{ currentAge.toFixed(10) }}</span> y/o
                        junior dev. building stuff and learning along the way.
                        code, table tennis, cooking. based in turkey.
                    </p>
                </motion.div>

                <!-- Status section -->
                <StatusSection
                    :isLoading="isLoading"
                    :isConnected="lanyardConnected"
                    :isReconnecting="lanyardReconnecting"
                    :presenceUnavailable="lanyardUnavailable"
                    :usingCachedPresence="lanyardStalePresence"
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
                    :revalidating="reposRevalidating"
                />

                <!-- Tracks column -->
                <RecentTracks
                    :currentTrack="currentTrack"
                    :tracks="consolidatedTracks"
                    :loading="lastfmLoading && !consolidatedTracks.length"
                    :revalidating="lastfmRevalidating"
                    :staleFailed="lastfmRevalidateFailed"
                    :error="lastfmError"
                />
            </div>

            <!-- Contribution graph -->
            <ContributionGraph
                :contributions="contributions"
                :loading="contributionsLoading"
                :revalidating="contributionsRevalidating"
            />

        </div>
    </div>
</template>
