<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    scaleFade,
    cardHover,
    cardPress,
} from "@/utils/motion";

defineProps({
    repos: { type: Array, required: true },
    loading: Boolean,
});

const repoContainer = staggerContainer(0.05);
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
        <div class="flex items-center justify-between mb-3">
            <div class="text-catppuccin-subtle text-sm">
                ~$ ls ~/projects
            </div>
            <router-link
                v-if="!loading && repos.length"
                to="/projects"
                class="text-xs text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors"
            >
                see all →
            </router-link>
        </div>

        <motion.div
            v-if="loading"
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
            v-else
            :variants="repoContainer"
            initial="hidden"
            animate="visible"
            class="space-y-2"
        >
            <motion.a
                v-for="repo in repos"
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
