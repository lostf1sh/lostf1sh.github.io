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
} from "@/utils/motion";

import StatusSection from "@/components/StatusSection.vue";
import ProjectsGrid from "@/components/ProjectsGrid.vue";
import RecentTracks from "@/components/RecentTracks.vue";
import ContributionGraph from "@/components/ContributionGraph.vue";
import SiteFooter from "@/components/SiteFooter.vue";

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

const externalToFetch = ["theovilardo/PixelPlayer"];
const pinnedOrder = [
    "theovilardo/PixelPlayer",
    "lostf1sh/lostf1sh.github.io",
    "lostf1sh/dusk",
    "lostf1sh/pomo",
    "lostf1sh/clp",
    "lostf1sh/v-recipes",
];
const pinnedSet = new Set(pinnedOrder);

const displayedRepos = computed(() => {
    if (!repos.value.length) return [];

    const pinned = pinnedOrder
        .map(name => repos.value.find(r => r.full_name === name))
        .filter(Boolean);

    return pinned;
});

const fetchProjects = async () => {
    const firstPaint = repos.value.length === 0;
    if (firstPaint) reposLoading.value = true;
    reposRevalidating.value = !firstPaint;
    try {
        const [{ repos: ownRepos }, ...pinnedResults] = await Promise.all([
            getAllReposWithLanguages(),
            ...externalToFetch.map((r) =>
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
    const tickAge = () => {
        updateAge();
        ageRafId = requestAnimationFrame(tickAge);
    };
    tickAge();
    window.addEventListener("scroll", onHeroScroll, { passive: true });
});

onBeforeUnmount(() => {
    if (ageRafId) cancelAnimationFrame(ageRafId);
    window.removeEventListener("scroll", onHeroScroll);
    if (heroRaf) cancelAnimationFrame(heroRaf);
});

const BIRTH_DATE = new Date("2008-06-06T00:00:00");

const currentAge = ref(0);

const updateAge = () => {
    const now = new Date();
    const diffMs = now - BIRTH_DATE;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    currentAge.value = diffDays / 365.25;
};

const heroContainer = staggerContainer(0.08);

// Scroll-driven hero fade
const heroOpacity = ref(1);
const heroOffset = ref(0);
let heroRaf = null;

const onHeroScroll = () => {
    if (heroRaf) return;
    heroRaf = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const threshold = 300;
        const progress = Math.min(scrollY / threshold, 1);
        heroOpacity.value = 1 - progress * 0.6;
        heroOffset.value = -progress * 16;
        heroRaf = null;
    });
};

</script>

<template>
    <div class="w-full min-h-screen">
        <div class="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">

            <!-- Hero -->
            <motion.div
                class="mb-16"
                :variants="heroContainer"
                initial="hidden"
                animate="visible"
                :style="{ opacity: heroOpacity }"
            >
                <motion.h1
                    :variants="fadeUp"
                    class="font-serif text-4xl md:text-5xl font-semibold text-catppuccin-text tracking-tight"
                >
                    moli
                </motion.h1>
                <motion.p
                    :variants="fadeUp"
                    class="text-catppuccin-subtle mt-2 text-sm"
                >
                    junior developer · turkey
                </motion.p>

                <!-- Nav links -->
                <motion.nav
                    :variants="fadeUp"
                    class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
                >
                    <router-link
                        to="/blog"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
                    >
                        blog
                    </router-link>
                    <router-link
                        to="/projects"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
                    >
                        projects
                    </router-link>
                    <router-link
                        to="/now"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
                    >
                        now
                    </router-link>
                    <router-link
                        to="/uses"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
                    >
                        uses
                    </router-link>
                    <span class="text-catppuccin-surface">·</span>
                    <a
                        href="https://github.com/lostf1sh"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
                    >
                        github
                    </a>
                    <a
                        href="https://www.instagram.com/kawaiimoli"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors link-underline"
                    >
                        instagram
                    </a>
                </motion.nav>
            </motion.div>

            <!-- About -->
            <motion.div
                class="mb-6"
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }"
            >
                <div class="section-label mb-2">about</div>
                <p class="text-catppuccin-text leading-relaxed">
                    <span class="text-catppuccin-mauve font-medium" style="font-variant-numeric: tabular-nums">{{ currentAge.toFixed(10) }}</span> years old.
                    building things and learning along the way.
                    code, table tennis, cooking.
                </p>
            </motion.div>

            <!-- Divider -->
            <div class="hr-zen mb-6"></div>

            <!-- Status -->
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

            <!-- Tools -->
            <motion.div
                class="mb-6"
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }"
            >
                <div class="section-label mb-2">tools</div>
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-catppuccin-subtle">
                    <span>vue</span>
                    <span>nextjs</span>
                    <span>typescript</span>
                    <span>rust</span>
                    <span>go</span>
                    <span>kotlin</span>
                </div>
            </motion.div>

            <!-- Divider -->
            <div class="hr-zen mb-6"></div>

            <!-- Projects & Tracks grid -->
            <div class="grid lg:grid-cols-2 gap-8 lg:gap-10">
                <ProjectsGrid
                    :repos="displayedRepos"
                    :loading="reposLoading"
                    :revalidating="reposRevalidating"
                />

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

            <SiteFooter />
        </div>
    </div>
</template>
