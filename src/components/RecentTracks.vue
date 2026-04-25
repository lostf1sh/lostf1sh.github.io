<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    fadeUp,
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
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
</script>

<template>
    <motion.div
        class="min-w-0"
        :whileInView="{ opacity: 1, y: 0 }"
        :initial="{ opacity: 0, y: 10 }"
        :transition="springs.gentle"
        :inViewOptions="{ once: true }"
    >
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div class="section-label">
                listening
                <span
                    v-if="revalidating"
                    class="text-[10px] text-catppuccin-subtle/50 ml-2 font-sans"
                >updating</span>
            </div>
        </div>

        <p
            v-if="staleFailed && (tracks.length || currentTrack)"
            class="text-xs text-catppuccin-subtle/60 mb-2"
        >
            showing cached data
        </p>

        <div class="space-y-0">
            <!-- Now playing -->
            <motion.a
                v-if="currentTrack"
                :href="currentTrack.url"
                target="_blank"
                rel="noopener noreferrer"
                :key="`current-${currentTrack.name}-${currentTrack.artist['#text']}`"
                :initial="{ opacity: 0, y: 6 }"
                :animate="{ opacity: 1, y: 0 }"
                class="group block py-3 border-b border-catppuccin-surface/30"
            >
                <div class="flex items-center justify-between gap-3">
                    <span
                        class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate text-sm"
                        :title="currentTrack.name"
                    >
                        {{ currentTrack.name }}
                    </span>
                    <span class="text-catppuccin-green text-xs flex-shrink-0">now</span>
                </div>
                <p
                    class="text-xs text-catppuccin-subtle mt-0.5 truncate"
                    :title="currentTrack.artist['#text']"
                >
                    {{ currentTrack.artist["#text"] }}
                </p>
            </motion.a>

            <!-- Loading skeletons -->
            <motion.div
                v-if="loading"
                :variants="skeletonContainer"
                initial="hidden"
                animate="visible"
                class="space-y-3"
            >
                <motion.div
                    v-for="i in (currentTrack ? 5 : 6)"
                    :key="`loading-${i}`"
                    :variants="skeletonItem"
                    class="py-2.5"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="skeleton-pulse h-4 rounded bg-catppuccin-surface/40" :style="{ width: ['90px', '110px', '75px', '100px', '85px', '95px'][i - 1] }"></div>
                        <div v-if="i % 2 === 0" class="skeleton-pulse h-3 w-5 rounded bg-catppuccin-surface/30"></div>
                    </div>
                    <div class="skeleton-pulse h-3 rounded bg-catppuccin-surface/25 mt-1.5" :style="{ width: ['60%', '50%', '75%', '55%', '65%', '45%'][i - 1] }"></div>
                </motion.div>
            </motion.div>

            <!-- Error state -->
            <div
                v-else-if="error && !tracks.length"
                class="text-sm text-catppuccin-subtle py-2"
            >
                couldn't load tracks
            </div>

            <!-- No tracks -->
            <div
                v-else-if="!tracks.length && !currentTrack"
                class="text-sm text-catppuccin-subtle py-2"
            >
                nothing recently
            </div>

            <!-- Past tracks -->
            <div v-else-if="tracks.length">
                <motion.a
                    v-for="(track, index) in tracks.slice(
                        0,
                        currentTrack ? 5 : 6,
                    )"
                    :key="`${track.name}-${track.artist['#text']}-${track.date}`"
                    :href="track.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :initial="{ opacity: 0, y: 6 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ ...springs.gentle, delay: index * 0.04 }"
                    class="group block py-3 border-b border-catppuccin-surface/30 last:border-0"
                >
                    <div class="flex items-center justify-between gap-3">
                        <span
                            class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors truncate text-sm"
                            :title="track.name"
                        >
                            {{ track.name }}
                        </span>
                        <span
                            v-if="track.playcount > 1"
                            class="text-catppuccin-subtle text-xs flex-shrink-0"
                        >
                            ×{{ track.playcount }}
                        </span>
                    </div>
                    <p
                        class="text-xs text-catppuccin-subtle mt-0.5 truncate"
                        :title="track.artist['#text']"
                    >
                        {{ track.artist["#text"] }}
                    </p>
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
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
}
</style>
