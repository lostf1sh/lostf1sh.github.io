<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    fadeUp,
    scaleFade,
    cardHover,
    cardPress,
} from "@/utils/motion";

defineProps({
    currentTrack: Object,
    tracks: { type: Array, required: true },
    loading: Boolean,
    revalidating: Boolean,
    staleFailed: Boolean,
    error: String,
});

const skeletonContainer = staggerContainer(0.04);
const skeletonItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
</script>

<template>
    <motion.div
        class="border-l-2 border-catppuccin-surface pl-4 min-w-0"
        :whileInView="{ opacity: 1, x: 0 }"
        :initial="{ opacity: 0, x: -15 }"
        :transition="springs.default"
        :inViewOptions="{ once: true }"
    >
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="text-catppuccin-subtle text-sm">
                ~$ cat recent_tracks.log
            </div>
            <span
                v-if="revalidating"
                class="text-[10px] text-catppuccin-subtle"
            >refreshing…</span>
        </div>

        <p
            v-if="staleFailed && (tracks.length || currentTrack)"
            class="text-xs text-catppuccin-peach mb-2"
        >
            couldn’t refresh — showing cached scrobbles
        </p>

        <div class="space-y-2">
            <!-- Now playing -->
            <motion.a
                v-if="currentTrack"
                :href="currentTrack.url"
                target="_blank"
                rel="noopener noreferrer"
                :key="`current-${currentTrack.name}-${currentTrack.artist['#text']}`"
                :initial="scaleFade.hidden"
                :animate="scaleFade.visible"
                class="flex items-start gap-3 text-sm group py-2.5 border-b border-catppuccin-surface/40"
            >
                <span class="text-catppuccin-green mt-0.5">♪</span>

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
                        >[now]</span>
                    </div>

                    <p
                        class="text-xs text-catppuccin-gray truncate"
                        :title="currentTrack.artist['#text']"
                    >
                        {{ currentTrack.artist["#text"] }}
                    </p>
                </div>
            </motion.a>

            <!-- Loading skeletons for past tracks -->
            <motion.div
                v-if="loading"
                :variants="skeletonContainer"
                initial="hidden"
                animate="visible"
                class="space-y-2"
            >
                <motion.div
                    v-for="i in (currentTrack ? 5 : 6)"
                    :key="`loading-${i}`"
                    :variants="skeletonItem"
                    class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 px-3 py-2"
                >
                    <div class="flex items-start gap-3">
                        <div class="skeleton-pulse w-3 h-3 rounded-sm mt-0.5 bg-catppuccin-surface/60"></div>
                        <div class="flex-1 min-w-0 space-y-2">
                            <div class="flex items-center gap-2">
                                <div class="skeleton-pulse h-3.5 rounded bg-catppuccin-surface/60" :style="{ width: ['50%', '60%', '40%', '55%', '45%', '65%'][i - 1] }"></div>
                                <div v-if="i % 2 === 0" class="skeleton-pulse h-3 w-6 rounded bg-catppuccin-yellow/15"></div>
                            </div>
                            <div class="skeleton-pulse h-2.5 rounded bg-catppuccin-surface/40" :style="{ width: ['70%', '55%', '85%', '60%', '75%', '50%'][i - 1] }"></div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <!-- Error state -->
            <div
                v-else-if="error && !tracks.length"
                class="text-sm text-catppuccin-red"
            >
                error: {{ error }}
            </div>

            <!-- No tracks found -->
            <div
                v-else-if="!tracks.length && !currentTrack"
                class="text-sm text-catppuccin-subtle"
            >
                no tracks found
            </div>

            <!-- Past tracks list -->
            <div
                v-else-if="tracks.length"
                class="divide-y divide-catppuccin-surface/40"
            >
                <motion.a
                    v-for="(track, index) in tracks.slice(
                        0,
                        currentTrack ? 5 : 6,
                    )"
                    :key="`${track.name}-${track.artist['#text']}-${track.date}`"
                    :href="track.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :initial="fadeUp.hidden"
                    :animate="fadeUp.visible"
                    :transition="{ ...springs.default, delay: index * 0.05 }"
                    class="flex items-start gap-3 text-sm group py-2.5 first:pt-0"
                >
                    <span
                        class="text-catppuccin-subtle group-hover:text-catppuccin-green transition-colors mt-0.5"
                    >&gt;</span>

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
                </motion.a>
            </div>
        </div>
    </motion.div>
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
