<script setup>
import { computed, onMounted, ref } from "vue";
import localLibraryData from "@/data/ipod-library.json";
import localPlaysData from "@/data/ipod-plays.json";
import remoteConfig from "@/data/ipod-remote.json";

const libraryData = ref(localLibraryData);
const playsData = ref(localPlaysData);
const dataSource = ref("local");

const stats = computed(() => {
    return [
        {
            label: "tracks",
            value: libraryData.value.summary.trackCount,
        },
        {
            label: "artists",
            value: libraryData.value.summary.uniqueArtists,
        },
        {
            label: "albums",
            value: libraryData.value.summary.uniqueAlbums,
        },
        {
            label: "library length",
            value: libraryData.value.summary.totalDurationFormatted,
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
    if (!remoteConfig.enabled) return;
    if (!remoteConfig.libraryUrl || !remoteConfig.playsUrl) return;

    try {
        const [remoteLibrary, remotePlays] = await Promise.all([
            loadRemoteJson(remoteConfig.libraryUrl),
            loadRemoteJson(remoteConfig.playsUrl),
        ]);
        libraryData.value = remoteLibrary;
        playsData.value = remotePlays;
        dataSource.value = "remote";
    } catch (error) {
        console.error("Failed to load remote iPod data, falling back to local JSON.", error);
    }
});
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                    music archive snapshot from your mounted rockbox device.
                </p>

                <div class="flex items-center flex-wrap gap-4 text-sm mt-4">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                    >
                        [← home]
                    </router-link>
                    <router-link
                        to="/blog"
                        class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors"
                    >
                        [blog]
                    </router-link>
                </div>
            </div>

            <div
                v-if="!hasSyncedLibrary"
                class="border border-catppuccin-yellow/40 bg-catppuccin-base/20 rounded-md px-4 py-4 mb-8"
            >
                <div class="text-catppuccin-yellow text-sm mb-2">
                    no sync data yet
                </div>
                <div class="text-xs text-catppuccin-subtle leading-relaxed">
                    run:
                    <code class="text-catppuccin-yellow">bun run ipod:sync -- --source /path/to/ipod-mount</code>
                </div>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div
                    v-for="item in stats"
                    :key="item.label"
                    class="border border-catppuccin-surface rounded-md bg-catppuccin-base/20 px-4 py-3"
                >
                    <div class="text-[11px] uppercase tracking-wide text-catppuccin-subtle mb-1">
                        {{ item.label }}
                    </div>
                    <div class="text-catppuccin-text text-lg">{{ item.value }}</div>
                </div>
            </div>

            <div class="border-l-2 border-catppuccin-surface pl-4 mb-8">
                <div class="text-catppuccin-subtle text-sm mb-2">
                    ~$ tail -n 1 sync.log
                </div>
                <div class="text-sm text-catppuccin-text">
                    data source: {{ dataSource }}
                </div>
                <div class="text-sm text-catppuccin-text">
                    history source: {{ playsData.sourceType || "none" }}
                </div>
                <div class="text-sm text-catppuccin-text">
                    last library sync: {{ formatDate(libraryData.generatedAt) }}
                </div>
                <div class="text-sm text-catppuccin-text">
                    last play sync: {{ formatDate(playsData.generatedAt) }}
                </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6">
                <div class="border-l-2 border-catppuccin-surface pl-4 min-w-0">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ cat top_artists.txt
                    </div>
                    <div
                        v-if="!libraryData.summary.topArtists.length"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no artist data yet
                    </div>
                    <div v-else class="space-y-2">
                        <div
                            v-for="artist in libraryData.summary.topArtists.slice(0, 12)"
                            :key="artist.key"
                            class="flex items-center justify-between rounded border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2 text-sm"
                        >
                            <span class="text-catppuccin-text truncate mr-2">{{ artist.key }}</span>
                            <span class="text-catppuccin-green text-xs">{{ artist.count }} tracks</span>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4 min-w-0">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ cat top_tracks_from_history.log
                    </div>
                    <div
                        v-if="!playsData.topTracks.length"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no play history found (.scrobbler.log / playback.log missing or empty)
                    </div>
                    <div v-else class="space-y-2">
                        <div
                            v-for="track in playsData.topTracks.slice(0, 12)"
                            :key="track.key"
                            class="flex items-center justify-between rounded border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2 text-sm"
                        >
                            <span class="text-catppuccin-text truncate mr-2">{{ track.key }}</span>
                            <span class="text-catppuccin-peach text-xs">{{ track.count }} plays</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-6 border-l-2 border-catppuccin-surface pl-4">
                <div class="text-catppuccin-subtle text-sm mb-3">
                    ~$ cat recent_plays.log
                </div>
                <div
                    v-if="!playsData.recentPlays.length"
                    class="text-sm text-catppuccin-subtle"
                >
                    no recent plays captured
                </div>
                <div v-else class="space-y-2">
                    <div
                        v-for="play in playsData.recentPlays.slice(0, 15)"
                        :key="`${play.artist}-${play.title}-${play.playedAt || 'unknown'}`"
                        class="rounded border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2"
                    >
                        <div class="text-sm text-catppuccin-text truncate">
                            {{ play.artist }} - {{ play.title }}
                        </div>
                        <div class="text-xs text-catppuccin-subtle">
                            {{ play.album }} | {{ formatDate(play.playedAt) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
