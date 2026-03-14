<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { motion } from "motion-v";
import { lanyardData } from "@/services/lanyardService";
import { getRecentTracks } from "@/services/lastfmService";
import {
    getAllReposWithLanguages,
    getContributionData,
    getContributionLevel,
    getGitHubContributionUrl,
} from "@/services/githubService";
import {
    springs,
    staggerContainer,
    fadeUp,
    fadeLeft,
    scaleFade,
    cardHover,
    cardPress,
} from "@/utils/motion";

const discordStatusColor = computed(() => lanyardData.discordStatusColor);
const spotify = computed(() => lanyardData.spotify);
const discordStatus = computed(() => lanyardData.discordStatus);
const discordUser = computed(() => lanyardData.discordUser);
const editorActivity = computed(() => lanyardData.editorActivity);
const isLoading = computed(() => lanyardData.isLoading);


const editorStatus = computed(() => {
    if (!editorActivity.value) return null;

    if (
        editorActivity.value.details &&
        editorActivity.value.details.toLowerCase().includes("idling")
    ) {
        return "idling";
    }

    const editorName = editorActivity.value.name;
    const isZed = editorName === "Zed";

    let filename = isZed
        ? editorActivity.value.state || ""
        : editorActivity.value.details || "";

    let workspace = isZed
        ? editorActivity.value.details || ""
        : editorActivity.value.state || "";

    filename = filename
        .replace(/editing /i, "")
        .replace(/working on /i, "")
        .trim();

    workspace = workspace
        .replace(/in /i, "")
        .replace(/workspace: /i, "")
        .trim();

    return {
        name: editorName,
        workspace,
        filename,
    };
});

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
    let currentTrack = null;
    let count = 1;

    tracks.forEach((track, index) => {
        const key = `${track.name}-${track.artist["#text"]}`;
        if (currentTrack === key) {
            count++;
        } else {
            if (currentTrack) {
                const prevTrack = tracks[index - 1];
                consolidated.push({
                    ...prevTrack,
                    playcount: count,
                    date: prevTrack.date?.["#text"],
                });
            }
            currentTrack = key;
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
        console.error("Failed to load recent tracks:", error);
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
        console.error("Failed to load repositories:", error);
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
        console.error("Failed to load contribution data:", error);
        contributions.value = [];
    } finally {
        contributionsLoading.value = false;
    }
};

const contributionWeeks = computed(() => {
    const weeks = [];
    for (let i = 0; i < contributions.value.length; i += 7) {
        weeks.push(contributions.value.slice(i, i + 7));
    }
    return weeks;
});

const totalContributions = computed(() => {
    return contributions.value.reduce((sum, day) => sum + day.count, 0);
});

onMounted(() => {
    fetchProjects();
    fetchSongs();
    fetchContributions();
    updateAge();
    updateTime();
    updateInterval = setInterval(fetchSongs, 30000);
    ageInterval = setInterval(updateAge, 50);
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
const repoContainer = staggerContainer(0.05);
const trackContainer = staggerContainer(0.05);

const skeletonContainer = staggerContainer(0.04);
const skeletonItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
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
                        <span class="text-catppuccin-mauve">duhan</span>
                        <span class="text-catppuccin-subtle">@</span>
                        <span class="text-catppuccin-blue">f1sh.dev</span>
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
                <motion.div
                    :variants="fadeLeft"
                    class="border-l-2 border-catppuccin-surface pl-4 mb-4"
                >
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ ps aux | grep duhan
                    </div>
                    <div class="space-y-1 text-sm">
                        <div
                            v-if="!isLoading && discordUser"
                            class="flex items-center gap-2"
                        >
                            <span class="text-catppuccin-blue">discord</span>
                            <span class="text-catppuccin-subtle">:</span>
                            <span class="text-catppuccin-text">{{
                                discordUser.username
                            }}</span>
                            <span :class="discordStatusColor"
                                >[{{ discordStatus }}]</span
                            >
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="text-catppuccin-green">spotify</span>
                            <span class="text-catppuccin-subtle">:</span>
                            <span
                                v-if="!isLoading && spotify"
                                class="text-catppuccin-text truncate"
                            >
                                {{ spotify.song }} - {{ spotify.artist }}
                            </span>
                            <span v-else class="text-catppuccin-subtle"
                                >not playing</span
                            >
                        </div>

                        <div
                            v-if="
                                !isLoading &&
                                editorActivity &&
                                editorStatus &&
                                (editorStatus.workspace ||
                                    editorStatus.filename)
                            "
                            class="flex items-center gap-2"
                        >
                            <span class="text-catppuccin-blue">{{
                                editorStatus.name === "Zed" ? "zed" : "vscode"
                            }}</span>
                            <span class="text-catppuccin-subtle">:</span>
                            <span class="text-catppuccin-text truncate">
                                <span v-if="editorStatus.workspace">{{
                                    editorStatus.workspace.toLowerCase()
                                }}</span>
                                <span
                                    v-if="
                                        editorStatus.workspace &&
                                        editorStatus.filename
                                    "
                                    class="text-catppuccin-subtle"
                                >
                                    /
                                </span>
                                <span v-if="editorStatus.filename">{{
                                    editorStatus.filename.toLowerCase()
                                }}</span>
                            </span>
                        </div>
                    </div>
                </motion.div>

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
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4 min-w-0"
                    :whileInView="{ opacity: 1, x: 0 }"
                    :initial="{ opacity: 0, x: -15 }"
                    :transition="springs.default"
                    :inViewOptions="{ once: true }"
                >
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/projects
                    </div>

                    <motion.div
                        v-if="reposLoading"
                        :variants="skeletonContainer"
                        initial="hidden"
                        animate="visible"
                        class="space-y-2"
                    >
                        <motion.div
                            v-for="i in 6"
                            :key="`repo-loading-${i}`"
                            :variants="skeletonItem"
                            class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2"
                        >
                            <div class="flex items-start gap-3">
                                <div class="skeleton-pulse w-3 h-3 rounded-sm bg-catppuccin-surface/60 mt-0.5"></div>
                                <div class="flex-1 min-w-0 space-y-2">
                                    <div class="flex items-center gap-2">
                                        <div class="skeleton-pulse h-3.5 rounded bg-catppuccin-surface/60" :style="{ width: ['45%', '55%', '40%', '60%', '35%', '50%'][i - 1] }"></div>
                                        <div v-if="i % 3 === 1" class="skeleton-pulse h-3 w-8 rounded bg-catppuccin-yellow/15"></div>
                                    </div>
                                    <div class="skeleton-pulse h-2.5 rounded bg-catppuccin-surface/40" :style="{ width: ['80%', '65%', '90%', '70%', '75%', '85%'][i - 1] }"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div
                        v-else-if="!repos.length"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no projects found
                    </div>

                    <motion.div
                        v-else-if="displayedRepos.length"
                        :variants="repoContainer"
                        initial="hidden"
                        animate="visible"
                        class="space-y-2"
                    >
                        <motion.a
                            v-for="repo in displayedRepos"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="scaleFade"
                            :whileHover="cardHover"
                            :whilePress="cardPress"
                            class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"
                        >
                            <div
                                class="flex items-start gap-3 text-sm hover:text-catppuccin-mauve transition-colors px-3 py-2"
                            >
                                <span
                                    class="text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors"
                                    >></span
                                >

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors font-medium truncate"
                                            :title="repo.name"
                                        >
                                            {{ repo.name }}
                                        </span>

                                        <span
                                            v-if="repo.stargazers_count > 0"
                                            class="text-catppuccin-yellow text-xs flex-shrink-0"
                                        >
                                            ★{{ repo.stargazers_count }}
                                        </span>
                                    </div>

                                    <p
                                        class="text-xs text-catppuccin-gray truncate"
                                        :title="repo.description"
                                    >
                                        {{
                                            repo.description || "no description"
                                        }}
                                    </p>
                                </div>
                            </div>
                        </motion.a>
                    </motion.div>

                    <div
                        v-else
                        class="text-sm text-catppuccin-subtle"
                    >
                        no repositories found
                    </div>
                </motion.div>

                <!-- Tracks column -->
                <motion.div
                    class="border-l-2 border-catppuccin-surface pl-4 min-w-0"
                    :whileInView="{ opacity: 1, x: 0 }"
                    :initial="{ opacity: 0, x: -15 }"
                    :transition="springs.default"
                    :inViewOptions="{ once: true }"
                >
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ cat recent_tracks.log
                    </div>

                    <motion.div
                        v-if="songsLoading"
                        :variants="skeletonContainer"
                        initial="hidden"
                        animate="visible"
                        class="space-y-2"
                    >
                        <motion.div
                            v-for="i in 6"
                            :key="`loading-${i}`"
                            :variants="skeletonItem"
                            class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2"
                        >
                            <div class="flex items-start gap-3">
                                <div class="skeleton-pulse w-3 h-3 rounded-sm mt-0.5" :class="i === 1 ? 'bg-catppuccin-green/30' : 'bg-catppuccin-surface/60'"></div>
                                <div class="flex-1 min-w-0 space-y-2">
                                    <div class="flex items-center gap-2">
                                        <div class="skeleton-pulse h-3.5 rounded bg-catppuccin-surface/60" :style="{ width: ['50%', '60%', '40%', '55%', '45%', '65%'][i - 1] }"></div>
                                        <div v-if="i === 1" class="skeleton-pulse h-3 w-10 rounded bg-catppuccin-green/15"></div>
                                        <div v-else-if="i % 2 === 0" class="skeleton-pulse h-3 w-6 rounded bg-catppuccin-yellow/15"></div>
                                    </div>
                                    <div class="skeleton-pulse h-2.5 rounded bg-catppuccin-surface/40" :style="{ width: ['70%', '55%', '85%', '60%', '75%', '50%'][i - 1] }"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div
                        v-else-if="songsError"
                        class="text-sm text-catppuccin-red"
                    >
                        error: {{ songsError }}
                    </div>

                    <div
                        v-else-if="!consolidatedTracks.length && !currentTrack"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no tracks found
                    </div>

                    <motion.div
                        v-else
                        :variants="trackContainer"
                        initial="hidden"
                        animate="visible"
                        class="space-y-2"
                    >
                        <motion.a
                            v-if="currentTrack"
                            :href="currentTrack.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :key="`current-${currentTrack.name}-${currentTrack.artist['#text']}`"
                            :variants="scaleFade"
                            :whileHover="cardHover"
                            :whilePress="cardPress"
                            class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"
                        >
                            <div
                                class="flex items-start gap-3 text-sm px-3 py-2"
                            >
                                <span class="text-catppuccin-green">♪</span>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate"
                                            :title="currentTrack.name"
                                        >
                                            {{ currentTrack.name }}
                                        </span>

                                        <span
                                            class="text-catppuccin-green text-xs flex-shrink-0"
                                            >[now]</span
                                        >
                                    </div>

                                    <p
                                        class="text-xs text-catppuccin-gray truncate"
                                        :title="currentTrack.artist['#text']"
                                    >
                                        {{ currentTrack.artist["#text"] }}
                                    </p>
                                </div>
                            </div>
                        </motion.a>

                        <motion.a
                            v-for="track in consolidatedTracks.slice(
                                0,
                                currentTrack ? 5 : 6,
                            )"
                            :key="`${track.name}-${track.artist['#text']}-${track.date}`"
                            :href="track.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :variants="fadeUp"
                            :whileHover="cardHover"
                            :whilePress="cardPress"
                            class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"
                        >
                            <div
                                class="flex items-start gap-3 text-sm px-3 py-2"
                            >
                                <span
                                    class="text-catppuccin-subtle group-hover:text-catppuccin-green transition-colors"
                                    >></span
                                >

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate"
                                            :title="track.name"
                                        >
                                            {{ track.name }}
                                        </span>

                                        <span
                                            v-if="track.playcount > 1"
                                            class="text-catppuccin-yellow text-xs flex-shrink-0"
                                        >
                                            ×{{ track.playcount }}
                                        </span>
                                    </div>

                                    <p
                                        class="text-xs text-catppuccin-gray truncate"
                                        :title="track.artist['#text']"
                                    >
                                        {{ track.artist["#text"] }}
                                    </p>
                                </div>
                            </div>
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            <!-- Contribution graph -->
            <motion.div
                class="mt-6 border-l-2 border-catppuccin-surface pl-4"
                :whileInView="{ opacity: 1, y: 0 }"
                :initial="{ opacity: 0, y: 20 }"
                :transition="springs.default"
                :inViewOptions="{ once: true }"
            >
                <div class="flex items-center justify-between mb-3">
                    <div class="text-catppuccin-subtle text-sm">
                        ~$ git log --oneline --since="1.year.ago" | wc -l
                    </div>
                    <div v-if="!contributionsLoading" class="flex items-center gap-1 text-[10px] text-catppuccin-subtle">
                        <span>less</span>
                        <div class="flex gap-[1px]">
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-surface/50"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/30"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/50"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/70"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green"></div>
                        </div>
                        <span>more</span>
                    </div>
                </div>

                <div
                    v-if="contributionsLoading"
                >
                    <div class="h-[60px] bg-catppuccin-surface/30 rounded cursor-blink"></div>
                </div>

                <div v-else>
                    <div class="overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-thin">
                        <div class="inline-flex md:flex gap-[3px] md:gap-1" style="min-width: max-content;">
                            <div
                                v-for="(week, weekIndex) in contributionWeeks"
                                :key="weekIndex"
                                class="flex flex-col gap-[3px] md:gap-1 md:flex-1"
                            >
                                <template v-for="(day, dayIndex) in week" :key="dayIndex">
                                    <a
                                        v-if="day.count > 0"
                                        :href="getGitHubContributionUrl(day.date)"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm transition-all hover:ring-1 hover:ring-catppuccin-green hover:scale-110 cursor-pointer"
                                        :class="[
                                            getContributionLevel(day.count) === 1
                                                ? 'bg-catppuccin-green/30 hover:bg-catppuccin-green/40'
                                                : getContributionLevel(day.count) === 2
                                                  ? 'bg-catppuccin-green/50 hover:bg-catppuccin-green/60'
                                                  : getContributionLevel(day.count) === 3
                                                    ? 'bg-catppuccin-green/70 hover:bg-catppuccin-green/80'
                                                    : 'bg-catppuccin-green hover:bg-catppuccin-green',
                                        ]"
                                        :title="`${day.date}: ${day.count} contributions - Click to view on GitHub`"
                                    ></a>
                                    <div
                                        v-else
                                        class="w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm bg-catppuccin-surface/50"
                                        :title="`${day.date}: ${day.count} contributions`"
                                    ></div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div class="text-xs text-catppuccin-gray mt-2">
                        {{ totalContributions }} contributions in the last year
                    </div>
                </div>
            </motion.div>


        </div>
    </div>
</template>

<style scoped>
.skeleton-pulse {
    animation: skeleton-shimmer 1.8s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
}
</style>
