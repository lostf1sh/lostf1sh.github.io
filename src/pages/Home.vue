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
import { staggerContainer, fadeUp } from "@/utils/motion";

import StatusSection from "@/components/StatusSection.vue";
import ProjectsGrid from "@/components/ProjectsGrid.vue";
import RecentTracks from "@/components/RecentTracks.vue";
import ContributionGraph from "@/components/ContributionGraph.vue";
import EightyEightButtons from "@/components/EightyEightButtons.vue";

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
let ageRafId = 0;

const currentTrack = computed(() => {
    const sp = lanyardData.spotify;
    if (!sp) return null;
    return {
        name: sp.song,
        artist: { "#text": sp.artist },
        url: `https://open.spotify.com/track/${sp.track_id}`,
    };
});

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

const displayedRepos = computed(() => {
    if (!repos.value.length) return [];
    return pinnedOrder
        .map(name => repos.value.find(r => r.full_name === name))
        .filter(Boolean);
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
    tickAge();
});

onBeforeUnmount(() => {
    if (ageRafId) window.cancelAnimationFrame(ageRafId);
});

// 6 June 2008, 01:00 Turkey time (UTC+3)
const BIRTH_DATE_IN_TURKEY = Date.UTC(2008, 5, 6, 1, 0, 0);
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;
const BIRTH_INSTANT_MS = BIRTH_DATE_IN_TURKEY - 3 * 3600 * 1000;
const currentAge = ref((Date.now() - BIRTH_INSTANT_MS) / MS_PER_YEAR);
const tickAge = () => {
    currentAge.value = (Date.now() - BIRTH_INSTANT_MS) / MS_PER_YEAR;
    ageRafId = window.requestAnimationFrame(tickAge);
};

const heroContainer = staggerContainer(0.06);

const stackItems = [
    { name: "Vue", icon: "https://cdn.simpleicons.org/vuedotjs" },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs" },
    { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript" },
    { name: "Rust", icon: "https://cdn.simpleicons.org/rust" },
    { name: "Go", icon: "https://cdn.simpleicons.org/go" },
    { name: "Kotlin", icon: "https://cdn.simpleicons.org/kotlin" },
];
</script>

<template>
    <div class="w-full min-h-screen">
        <div class="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
            <h1 class="sr-only">moli</h1>

            <!-- Hero -->
            <motion.div
                :variants="heroContainer"
                initial="hidden"
                animate="visible"
            >
                <!-- About panel -->
                <motion.div :variants="fadeUp" class="tui-panel mb-5">
                    <span class="tui-panel-title">about</span>
                    <div class="pt-1">
                        <div class="text-catppuccin-text text-lg font-medium mb-0.5 tracking-tight">moli</div>
                        <div class="text-[11px] text-catppuccin-subtle/50 mb-3">junior developer // turkey</div>
                        <div class="text-xs text-catppuccin-text/80 leading-relaxed">
                            <span class="text-catppuccin-text" style="font-variant-numeric: tabular-nums">{{ currentAge.toFixed(10) }}</span> years in.
                            i build small tools, ship web experiments, and keep notes on what i learn.
                            usually somewhere between code, table tennis, and cooking.
                        </div>
                    </div>
                </motion.div>

                <!-- Nav row -->
                <motion.div :variants="fadeUp" class="flex flex-wrap items-center gap-2 mb-8 text-xs">
                    <router-link to="/blog" class="nav-btn">blog</router-link>
                    <router-link to="/projects" class="nav-btn">projects</router-link>
                    <router-link to="/now" class="nav-btn">now</router-link>
                    <router-link to="/uses" class="nav-btn">uses</router-link>
                    <span class="text-catppuccin-surface/40 px-0.5">│</span>
                    <a href="https://github.com/lostf1sh" target="_blank" rel="noopener noreferrer" class="nav-btn">github</a>
                    <a href="https://www.instagram.com/kawaiimoli" target="_blank" rel="noopener noreferrer" class="nav-btn">instagram</a>
                </motion.div>
            </motion.div>

            <!-- Status + Stack -->
            <div class="grid md:grid-cols-2 gap-4 mb-5">
                <motion.div
                    :initial="{ opacity: 0 }"
                    :animate="{ opacity: 1 }"
                    :transition="{ delay: 0.2 }"
                >
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
                </motion.div>

                <motion.div
                    :initial="{ opacity: 0 }"
                    :animate="{ opacity: 1 }"
                    :transition="{ delay: 0.25 }"
                    class="tui-panel stack-panel"
                >
                    <span class="tui-panel-title">stack</span>
                    <div class="stack-icons pt-1" aria-label="Technology stack">
                        <span
                            v-for="item in stackItems"
                            :key="item.name"
                            class="stack-icon"
                            :style="{ '--stack-icon': `url(${item.icon})` }"
                            :title="item.name"
                            :aria-label="item.name"
                            role="img"
                        ></span>
                    </div>
                </motion.div>
            </div>

            <!-- Projects & Tracks -->
            <div class="grid lg:grid-cols-2 gap-4 mb-5">
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

            <EightyEightButtons />
        </div>
    </div>
</template>

<style scoped>
.nav-btn {
    padding: 0.3rem 0.65rem;
    border: 1px solid rgb(var(--color-surface) / 0.5);
    color: rgb(var(--color-subtle) / 0.6);
    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
    font-size: 11px;
}

.nav-btn:hover {
    color: rgb(var(--color-text));
    border-color: rgb(var(--color-overlay) / 0.6);
    background: rgb(var(--color-surface) / 0.15);
}

/* make the stack panel a column so the icon row can grow to fill it
   when the grid stretches this box to match a taller status box */
.stack-panel {
    display: flex;
    flex-direction: column;
}

.stack-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    align-items: center;
    align-content: center;
    justify-content: center;
    min-height: 2.7rem;
    /* fill the panel's height so the icons stay vertically centered
       even when the box is taller than its content */
    flex: 1 1 auto;
}

.stack-icon {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    background: rgb(var(--color-subtle) / 0.62);
    -webkit-mask: var(--stack-icon) center / contain no-repeat;
    mask: var(--stack-icon) center / contain no-repeat;
    transition: background-color 0.14s ease, transform 0.14s ease;
}

.stack-icon:hover {
    background: rgb(var(--color-text));
    transform: translateY(-1px);
}
</style>
