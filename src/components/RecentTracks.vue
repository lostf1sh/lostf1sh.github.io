<script setup>
import { motion } from "motion-v";
import { springs, staggerContainer, fadeUp } from "@/utils/motion";

defineProps({
    currentTrack: Object,
    tracks: { type: Array, required: true },
    loading: Boolean,
    revalidating: Boolean,
    staleFailed: Boolean,
    error: String,
});

const searchTerm = (track) =>
    encodeURIComponent(`${track.name} ${track.artist?.["#text"] || ""}`.trim());

const spotifyUrl = (track) =>
    track.url?.includes("open.spotify.com")
        ? track.url
        : `https://open.spotify.com/search/${searchTerm(track)}`;

const appleMusicUrl = (track) =>
    `https://music.apple.com/search?term=${searchTerm(track)}`;
</script>

<template>
    <motion.div
        class="tui-panel min-w-0"
        :whileInView="{ opacity: 1 }"
        :initial="{ opacity: 0 }"
        :transition="springs.gentle"
        :inViewOptions="{ once: true }"
    >
        <span class="tui-panel-title">
            listening
            <span v-if="revalidating" class="text-catppuccin-subtle/40"> [syncing]</span>
        </span>

        <div class="pt-1">
            <div v-if="staleFailed && (tracks.length || currentTrack)" class="text-[10px] text-catppuccin-subtle/40 mb-2">
                [cached]
            </div>

            <!-- Now playing -->
            <div
                v-if="currentTrack"
                class="group block py-1.5 border-b border-catppuccin-surface/20 text-xs"
            >
                <div class="flex items-center justify-between gap-2">
                    <span class="text-catppuccin-text truncate">
                        ♪ {{ currentTrack.name }}
                    </span>
                    <span class="text-catppuccin-green flex-shrink-0">[NOW]</span>
                </div>
                <div class="flex items-center justify-between gap-2 mt-0.5">
                    <span class="text-catppuccin-subtle/40 truncate">
                        {{ currentTrack.artist["#text"] }}
                    </span>
                    <span class="provider-links">
                        <a :href="spotifyUrl(currentTrack)" target="_blank" rel="noopener noreferrer">spotify</a>
                        <a :href="appleMusicUrl(currentTrack)" target="_blank" rel="noopener noreferrer">apple</a>
                    </span>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="space-y-1">
                <div v-for="i in (currentTrack ? 5 : 6)" :key="i" class="py-1.5">
                    <div class="skeleton-pulse h-3 bg-catppuccin-surface/40" :style="{ width: ['130px', '160px', '110px', '145px', '120px', '135px'][i - 1] }"></div>
                </div>
            </div>

            <!-- Error -->
            <div v-else-if="error && !tracks.length" class="text-xs text-catppuccin-subtle py-2">
                [ERR] couldn't load tracks
            </div>

            <!-- No tracks -->
            <div v-else-if="!tracks.length && !currentTrack" class="text-xs text-catppuccin-subtle py-2">
                (silent)
            </div>

            <!-- Past tracks -->
            <template v-else-if="tracks.length">
                <motion.div
                    v-for="(track, index) in tracks.slice(0, currentTrack ? 5 : 6)"
                    :key="`${track.name}-${track.artist['#text']}-${track.date}`"
                    :initial="{ opacity: 0 }"
                    :animate="{ opacity: 1 }"
                    :transition="{ delay: index * 0.03 }"
                    class="block py-1.5 border-b border-catppuccin-surface/20 last:border-0 text-xs"
                >
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-catppuccin-text truncate">
                            {{ track.name }}
                        </span>
                        <span v-if="track.playcount > 1" class="text-catppuccin-subtle flex-shrink-0">
                            x{{ track.playcount }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between gap-2 mt-0.5">
                        <span class="text-catppuccin-subtle/40 truncate">
                            {{ track.artist["#text"] }}
                        </span>
                        <span class="provider-links">
                            <a :href="spotifyUrl(track)" target="_blank" rel="noopener noreferrer">spotify</a>
                            <a :href="appleMusicUrl(track)" target="_blank" rel="noopener noreferrer">apple</a>
                        </span>
                    </div>
                </motion.div>
            </template>
        </div>
    </motion.div>
</template>

<style scoped>
.provider-links {
    display: flex;
    flex-shrink: 0;
    gap: 0.45rem;
    font-size: 10px;
}

.provider-links a {
    color: rgb(var(--color-subtle) / 0.38);
    transition: color 0.12s ease;
}

.provider-links a:hover,
.provider-links a:focus-visible {
    color: rgb(var(--color-text));
}
</style>
