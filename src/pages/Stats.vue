<script setup>
import { computed, onMounted, ref } from "vue";
import {
    getUserInfo,
    getTopArtists,
    getRecentTracksForStreak,
    getWeeklyChartData,
} from "@/services/lastfmService";

const isLoading = ref(true);
const userInfo = ref(null);
const topArtists = ref([]);
const recentTracks = ref([]);
const weeklyChartData = ref([]);

// Fetch all data on mount
onMounted(async () => {
    try {
        const [user, artists, tracks, weekly] = await Promise.all([
            getUserInfo(),
            getTopArtists("7day", 12),
            getRecentTracksForStreak(200),
            getWeeklyChartData(),
        ]);
        userInfo.value = user;
        topArtists.value = artists;
        recentTracks.value = tracks;
        weeklyChartData.value = weekly;
    } catch (error) {
        console.error("Failed to load Last.fm stats:", error);
    } finally {
        isLoading.value = false;
    }
});

// Calculate total scrobbles from userInfo
const totalScrobbles = computed(() => {
    if (!userInfo.value?.playcount) return "0";
    return parseInt(userInfo.value.playcount).toLocaleString();
});

// Calculate this month's plays from recent tracks
const thisMonthPlays = computed(() => {
    if (!recentTracks.value.length) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let count = 0;
    recentTracks.value.forEach((track) => {
        if (track.date?.uts) {
            const trackDate = new Date(track.date.uts * 1000);
            if (trackDate.getMonth() === currentMonth && trackDate.getFullYear() === currentYear) {
                count++;
            }
        }
    });
    return count;
});

// Calculate current streak (consecutive days with at least 1 play)
const currentStreak = computed(() => {
    if (!recentTracks.value.length) return 0;

    // Group tracks by date
    const tracksByDate = {};
    recentTracks.value.forEach((track) => {
        if (track.date?.uts) {
            const trackDate = new Date(track.date.uts * 1000);
            const dateKey = trackDate.toISOString().split("T")[0];
            tracksByDate[dateKey] = (tracksByDate[dateKey] || 0) + 1;
        }
    });

    // Sort dates in descending order
    const sortedDates = Object.keys(tracksByDate).sort((a, b) => new Date(b) - new Date(a));

    // Check if today or yesterday has plays to start counting
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (!tracksByDate[today] && !tracksByDate[yesterday]) {
        return 0;
    }

    // Count consecutive days
    let streak = 0;
    let checkDate = tracksByDate[today] ? new Date(today) : new Date(yesterday);

    while (true) {
        const dateKey = checkDate.toISOString().split("T")[0];
        if (tracksByDate[dateKey]) {
            streak++;
            checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
            break;
        }
    }

    return streak;
});

// Get top artist this week
const topArtistThisWeek = computed(() => {
    if (!topArtists.value.length) return null;
    return topArtists.value[0];
});

// Process weekly chart data into 52-week grid
const activityGrid = computed(() => {
    if (!weeklyChartData.value.length) return [];

    // Group by week
    const weeks = [];
    let currentWeek = [];

    weeklyChartData.value.forEach((item, index) => {
        const date = new Date(item.from * 1000);
        const dayOfWeek = date.getDay();

        // Pad the beginning of the first week
        if (index === 0 && dayOfWeek !== 0) {
            for (let i = 0; i < dayOfWeek; i++) {
                currentWeek.push({ count: 0, date: null });
            }
        }

        currentWeek.push({
            count: parseInt(item.playcount) || 0,
            date: item.from,
        });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    // Add remaining days
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push({ count: 0, date: null });
        }
        weeks.push(currentWeek);
    }

    // Only keep last 52 weeks
    return weeks.slice(-52);
});

// Get color intensity for activity grid
const getActivityColor = (count) => {
    if (count === 0) return "bg-catppuccin-surface/40";
    if (count <= 3) return "bg-catppuccin-green/30";
    if (count <= 7) return "bg-catppuccin-green/50";
    if (count <= 15) return "bg-catppuccin-green/70";
    return "bg-catppuccin-green";
};

// Stats array for overview cards
const stats = computed(() => [
    {
        label: "total scrobbles",
        value: totalScrobbles.value,
        color: "text-catppuccin-blue",
        icon: "#",
    },
    {
        label: "this month",
        value: thisMonthPlays.value.toLocaleString(),
        color: "text-catppuccin-mauve",
        icon: "~",
    },
    {
        label: "day streak",
        value: currentStreak.value,
        color: "text-catppuccin-green",
        icon: "*",
    },
    {
        label: "top artist",
        value: topArtistThisWeek.value?.name || "—",
        color: "text-catppuccin-peach",
        icon: ">",
        isText: true,
    },
]);

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
                    ~$ cat lastfm_stats.txt
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2">
                    <span class="text-catppuccin-red">last</span><span class="text-catppuccin-mauve">.fm</span>
                </h1>
                <p class="text-sm text-catppuccin-gray leading-relaxed">
                    my listening statistics and activity.
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
                    <router-link
                        to="/ipod"
                        class="text-catppuccin-subtle hover:text-catppuccin-blue transition-colors"
                    >
                        [ipod]
                    </router-link>
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
                    <div :class="[item.color, item.isText ? 'text-lg truncate' : 'text-xl']" class="font-medium tabular-nums">{{ item.value }}</div>
                </div>
            </div>

            <!-- Activity Grid -->
            <div class="border-l-2 border-catppuccin-surface pl-4 mb-10">
                <div class="text-catppuccin-subtle text-sm mb-3">
                    ~$ git log --oneline --since="1.year.ago" | wc -l
                </div>

                <div class="flex items-center justify-between mb-3">
                    <div v-if="isLoading" class="h-[88px] bg-catppuccin-surface/30 rounded cursor-blink w-full max-w-md"></div>
                    <div v-else class="text-xs text-catppuccin-gray">
                        {{ weeklyChartData.reduce((sum, w) => sum + parseInt(w.playcount || 0), 0) }} plays in the last year
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-catppuccin-subtle">
                        <span>less</span>
                        <div class="flex gap-[1px]">
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-surface/40"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/30"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/50"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/70"></div>
                            <div class="w-2 h-2 rounded-[2px] bg-catppuccin-green"></div>
                        </div>
                        <span>more</span>
                    </div>
                </div>

                <div v-if="isLoading" class="h-[88px] bg-catppuccin-surface/30 rounded cursor-blink"></div>

                <div v-else class="overflow-x-auto pb-2 md:pb-0">
                    <div class="inline-flex gap-[3px]" style="min-width: max-content;">
                        <div
                            v-for="(week, weekIndex) in activityGrid"
                            :key="weekIndex"
                            class="flex flex-col gap-[3px]"
                        >
                            <template v-for="(day, dayIndex) in week" :key="dayIndex">
                                <div
                                    v-if="day.date"
                                    class="w-[10px] h-[10px] rounded-sm transition-all hover:ring-1 hover:ring-catppuccin-green/50 cursor-help"
                                    :class="getActivityColor(day.count)"
                                    :title="`${new Date(day.date * 1000).toLocaleDateString()}: ${day.count} plays`"
                                ></div>
                                <div
                                    v-else
                                    class="w-[10px] h-[10px] rounded-sm bg-catppuccin-base/20"
                                ></div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Artists -->
            <div class="border-l-2 border-catppuccin-surface pl-4">
                <div class="text-catppuccin-subtle text-sm mb-3">
                    ~$ cat top_artists.txt
                </div>

                <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div
                        v-for="i in 12"
                        :key="`artist-loading-${i}`"
                        class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 p-3"
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-catppuccin-surface/50 rounded-full cursor-blink"></div>
                            <div class="flex-1 min-w-0">
                                <div class="h-3 bg-catppuccin-surface/70 rounded w-3/5 mb-2 cursor-blink"></div>
                                <div class="h-2 bg-catppuccin-surface/50 rounded w-1/3 cursor-blink"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-else-if="!topArtists.length"
                    class="text-sm text-catppuccin-subtle"
                >
                    no artist data available
                </div>

                <div
                    v-else
                    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                >
                    <div
                        v-for="(artist, index) in topArtists.slice(0, 12)"
                        :key="artist.mbid || artist.name"
                        class="group flex items-center gap-3 rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/40 hover:border-catppuccin-surface transition-all duration-200 px-3 py-2"
                    >
                        <span
                            :class="getRankColor(index)"
                            class="w-5 text-xs text-right tabular-nums flex-shrink-0 font-medium"
                        >
                            {{ String(index + 1).padStart(2, '0') }}
                        </span>
                        <div
                            v-if="artist.image?.length"
                            class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-catppuccin-surface"
                        >
                            <img
                                :src="artist.image.find(i => i.size === 'medium')?.['#text'] || artist.image[0]?.['#text']"
                                :alt="artist.name"
                                class="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div v-else class="w-10 h-10 rounded-full flex-shrink-0 bg-catppuccin-surface flex items-center justify-center">
                            <span class="text-catppuccin-subtle">?</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="text-sm text-catppuccin-text truncate">{{ artist.name }}</div>
                            <div class="text-xs text-catppuccin-green tabular-nums">{{ artist.playcount }} plays</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
