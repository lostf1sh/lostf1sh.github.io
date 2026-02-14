<script setup>
import { computed, onMounted, ref } from "vue";
import remoteConfig from "@/data/ipod-remote.json";

const EMPTY_LIBRARY_DATA = {
    generatedAt: null,
    summary: {
        trackCount: 0,
        uniqueArtists: 0,
        uniqueAlbums: 0,
        totalDurationFormatted: "00:00",
        topArtists: [],
    },
};

const EMPTY_PLAYS_DATA = {
    generatedAt: null,
    sourceType: null,
    topTracks: [],
    recentPlays: [],
};

const libraryData = ref(EMPTY_LIBRARY_DATA);
const playsData = ref(EMPTY_PLAYS_DATA);
const dataSource = ref("fallback");
const isLoading = ref(true);

const stats = computed(() => {
    return [
        {
            label: "tracks",
            value: libraryData.value.summary.trackCount,
            color: "text-catppuccin-blue",
            icon: "~",
        },
        {
            label: "artists",
            value: libraryData.value.summary.uniqueArtists,
            color: "text-catppuccin-mauve",
            icon: "*",
        },
        {
            label: "albums",
            value: libraryData.value.summary.uniqueAlbums,
            color: "text-catppuccin-green",
            icon: "#",
        },
        {
            label: "playtime",
            value: libraryData.value.summary.totalDurationFormatted,
            color: "text-catppuccin-peach",
            icon: ">",
        },
    ];
});

const hasSyncedLibrary = computed(() => Boolean(libraryData.value.generatedAt));

const formatDate = (value) => {
    if (!value) return "not synced yet";
    return new Date(value).toLocaleString("en-US", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatRelativeTime = (value) => {
    if (!value) return "";
    const now = new Date();
    const date = new Date(value);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(value);
};

const loadRemoteJson = async (url) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
};

onMounted(async () => {
    if (!remoteConfig.enabled) {
        isLoading.value = false;
        return;
    }
    if (!remoteConfig.libraryUrl || !remoteConfig.playsUrl) {
        isLoading.value = false;
        return;
    }

    try {
        const [remoteLibrary, remotePlays] = await Promise.all([
            loadRemoteJson(remoteConfig.libraryUrl),
            loadRemoteJson(remoteConfig.playsUrl),
        ]);
        libraryData.value = remoteLibrary;
        playsData.value = remotePlays;
        dataSource.value = "remote";
    } catch (error) {
        console.error("Failed to load remote iPod data, falling back to empty state.", error);
    } finally {
        isLoading.value = false;
    }
});

const rankColors = [
    "text-catppuccin-gold",
    "text-catppuccin-peach",
    "text-catppuccin-mauve",
];

const getRankColor = (index) => {
    return rankColors[index] || "text-catppuccin-subtle";
};
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Header -->
            <div class="mb-10">
                <div class="text-catppuccin-subtle text-sm mb-2">
                    ~$ cat ipod_profile.txt
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2">
                    <span class="text-catppuccin-blue">ipod</span>
                    <span class="text-catppuccin-subtle">@</span>
                    <span class="text-catppuccin-mauve">rockbox</span>
                </h1>
                <p class="text-sm text-catppuccin-gray leading-relaxed">
                    my music archive from my modded ipod classic.
                </p>

                <div class="flex items-center flex-wrap gap-4 text-sm mt-4">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                    >
                        [&larr; home]
                    </router-link>
                    <router-link
                        to="/blog"
                        class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors"
                    >
                        [blog]
                    </router-link>
                </div>
            </div>

            <!-- No Sync Warning -->
            <div
                v-if="!isLoading && !hasSyncedLibrary"
                class="border border-catppuccin-yellow/40 bg-catppuccin-yellow/5 rounded-md px-4 py-4 mb-8"
            >
                <div class="text-catppuccin-yellow text-sm mb-2">
                    no sync data yet
                </div>
                <div class="text-xs text-catppuccin-subtle leading-relaxed">
                    run:
                    <code class="text-catppuccin-yellow bg-catppuccin-surface/30 px-1.5 py-0.5 rounded">bun run ipod:sync -- --source /path/to/ipod-mount</code>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                <template v-if="isLoading">
                    <div
                        v-for="i in 4"
                        :key="`stat-loading-${i}`"
                        class="border border-catppuccin-surface/60 rounded-md bg-catppuccin-base/20 px-4 py-3"
                    >
                        <div class="h-2.5 bg-catppuccin-surface/50 rounded w-1/2 mb-2.5 cursor-blink"></div>
                        <div class="h-5 bg-catppuccin-surface/70 rounded w-2/3 cursor-blink"></div>
                    </div>
                </template>
                <div
                    v-else
                    v-for="item in stats"
                    :key="item.label"
                    class="group border border-catppuccin-surface/60 rounded-md bg-catppuccin-base/20 hover:bg-catppuccin-base/40 hover:border-catppuccin-surface transition-all duration-200 px-4 py-3"
                >
                    <div class="text-[11px] uppercase tracking-widest text-catppuccin-subtle mb-1.5 flex items-center gap-1.5">
                        <span :class="item.color" class="opacity-60">{{ item.icon }}</span>
                        {{ item.label }}
                    </div>
                    <div :class="item.color" class="text-xl font-medium tabular-nums">{{ item.value }}</div>
                </div>
            </div>

            <!-- Sync Info -->
            <div class="border-l-2 border-catppuccin-surface pl-4 mb-10">
                <div class="text-catppuccin-subtle text-sm mb-2">
                    ~$ tail -n 1 sync.log
                </div>
                <div class="text-sm space-y-0.5">
                    <div class="text-catppuccin-text">
                        <span class="text-catppuccin-subtle">source:</span> {{ dataSource }}
                        <span class="text-catppuccin-surface mx-1">|</span>
                        <span class="text-catppuccin-subtle">history:</span> {{ playsData.sourceType || "none" }}
                    </div>
                    <div class="text-catppuccin-text">
                        <span class="text-catppuccin-subtle">library synced:</span> {{ formatDate(libraryData.generatedAt) }}
                    </div>
                    <div class="text-catppuccin-text">
                        <span class="text-catppuccin-subtle">plays synced:</span> {{ formatDate(playsData.generatedAt) }}
                    </div>
                </div>
            </div>

            <!-- Top Artists & Top Tracks -->
            <div class="grid lg:grid-cols-2 gap-6">
                <!-- Top Artists -->
                <div class="border-l-2 border-catppuccin-surface pl-4 min-w-0">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ cat top_artists.txt
                    </div>

                    <div v-if="isLoading" class="space-y-2">
                        <div
                            v-for="i in 8"
                            :key="`artist-loading-${i}`"
                            class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 p-2.5"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-5 h-3 bg-catppuccin-surface/50 rounded cursor-blink"></div>
                                <div class="flex-1 min-w-0">
                                    <div class="h-3 bg-catppuccin-surface/70 rounded w-3/5 cursor-blink"></div>
                                </div>
                                <div class="h-2.5 bg-catppuccin-surface/50 rounded w-12 cursor-blink"></div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else-if="!libraryData.summary.topArtists.length"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no artist data yet
                    </div>

                    <TransitionGroup
                        v-else
                        name="list"
                        tag="div"
                        class="space-y-1.5"
                    >
                        <div
                            v-for="(artist, index) in libraryData.summary.topArtists.slice(0, 12)"
                            :key="artist.key"
                            :style="{ transitionDelay: `${index * 40}ms` }"
                            class="group flex items-center gap-3 rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/40 hover:border-catppuccin-surface transition-all duration-200 px-3 py-2 text-sm"
                        >
                            <span
                                :class="getRankColor(index)"
                                class="w-5 text-xs text-right tabular-nums flex-shrink-0 font-medium"
                            >
                                {{ String(index + 1).padStart(2, '0') }}
                            </span>
                            <span class="text-catppuccin-text truncate flex-1 mr-2 music-text">{{ artist.key }}</span>
                            <div class="flex items-center gap-1 flex-shrink-0">
                                <div
                                    class="h-1 rounded-full bg-catppuccin-green/40 transition-all duration-300"
                                    :style="{ width: `${Math.max(8, (artist.count / libraryData.summary.topArtists[0].count) * 48)}px` }"
                                ></div>
                                <span class="text-catppuccin-green text-xs tabular-nums w-14 text-right">{{ artist.count }} trk</span>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>

                <!-- Top Tracks -->
                <div class="border-l-2 border-catppuccin-surface pl-4 min-w-0">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ sort -rn playback.log | head
                    </div>

                    <div v-if="isLoading" class="space-y-2">
                        <div
                            v-for="i in 8"
                            :key="`track-loading-${i}`"
                            class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 p-2.5"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-5 h-3 bg-catppuccin-surface/50 rounded cursor-blink"></div>
                                <div class="flex-1 min-w-0">
                                    <div class="h-3 bg-catppuccin-surface/70 rounded w-4/5 cursor-blink"></div>
                                </div>
                                <div class="h-2.5 bg-catppuccin-surface/50 rounded w-14 cursor-blink"></div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="!isLoading && !playsData.topTracks.length"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no play history found
                        <span class="block text-xs mt-1 text-catppuccin-overlay">.scrobbler.log / playback.log missing or empty</span>
                    </div>

                    <TransitionGroup
                        v-else-if="!isLoading"
                        name="list"
                        tag="div"
                        class="space-y-1.5"
                    >
                        <div
                            v-for="(track, index) in playsData.topTracks.slice(0, 12)"
                            :key="track.key"
                            :style="{ transitionDelay: `${index * 40}ms` }"
                            class="group flex items-center gap-3 rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/40 hover:border-catppuccin-surface transition-all duration-200 px-3 py-2 text-sm"
                        >
                            <span
                                :class="getRankColor(index)"
                                class="w-5 text-xs text-right tabular-nums flex-shrink-0 font-medium"
                            >
                                {{ String(index + 1).padStart(2, '0') }}
                            </span>
                            <span class="text-catppuccin-text truncate flex-1 mr-2 music-text">{{ track.key }}</span>
                            <div class="flex items-center gap-1 flex-shrink-0">
                                <div
                                    class="h-1 rounded-full bg-catppuccin-peach/40 transition-all duration-300"
                                    :style="{ width: `${Math.max(8, (track.count / playsData.topTracks[0].count) * 48)}px` }"
                                ></div>
                                <span class="text-catppuccin-peach text-xs tabular-nums w-14 text-right">{{ track.count }}&times;</span>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </div>

            <!-- Recent Plays -->
            <div class="mt-8 border-l-2 border-catppuccin-surface pl-4">
                <div class="text-catppuccin-subtle text-sm mb-3">
                    ~$ tail -f recent_plays.log
                </div>

                <div v-if="isLoading" class="space-y-2">
                    <div
                        v-for="i in 6"
                        :key="`recent-loading-${i}`"
                        class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2.5"
                    >
                        <div class="flex items-center gap-3">
                            <span class="text-catppuccin-subtle">></span>
                            <div class="flex-1 min-w-0">
                                <div class="h-3 bg-catppuccin-surface/70 rounded w-2/3 mb-2 cursor-blink"></div>
                                <div class="h-2 bg-catppuccin-surface/50 rounded w-1/3 cursor-blink"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-else-if="!playsData.recentPlays.length"
                    class="text-sm text-catppuccin-subtle"
                >
                    no recent plays captured
                </div>

                <TransitionGroup
                    v-else
                    name="list"
                    tag="div"
                    class="space-y-1.5"
                >
                    <div
                        v-for="(play, index) in playsData.recentPlays.slice(0, 15)"
                        :key="`${play.artist}-${play.title}-${play.playedAt || index}`"
                        :style="{ transitionDelay: `${index * 30}ms` }"
                        class="group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/40 hover:border-catppuccin-surface transition-all duration-200 px-3 py-2"
                    >
                        <div class="flex items-center gap-3">
                            <span class="text-catppuccin-subtle group-hover:text-catppuccin-green transition-colors text-xs">></span>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm text-catppuccin-text truncate music-text">
                                    <span class="text-catppuccin-blue">{{ play.artist }}</span>
                                    <span class="text-catppuccin-overlay mx-1">&mdash;</span>
                                    <span>{{ play.title }}</span>
                                </div>
                                <div class="text-xs text-catppuccin-subtle truncate mt-0.5 music-text">
                                    {{ play.album }}
                                    <span class="text-catppuccin-overlay mx-1">|</span>
                                    <span class="text-catppuccin-gray">{{ formatRelativeTime(play.playedAt) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<style scoped>
.music-text {
    font-family: "Noto Sans JP", "JetBrains Mono", ui-monospace, monospace;
}

.list-enter-active {
    transition: all 0.4s ease-out;
}

.list-leave-active {
    transition: all 0.3s ease-in;
    position: absolute;
}

.list-enter-from {
    opacity: 0;
    transform: translateY(12px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}

.list-move {
    transition: transform 0.4s ease;
}
</style>
