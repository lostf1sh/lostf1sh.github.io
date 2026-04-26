<script setup>
import { motion } from "motion-v";
import {
    springs,
    staggerContainer,
    fadeUp,
} from "@/utils/motion";

defineProps({
    repos: { type: Array, required: true },
    loading: Boolean,
    revalidating: Boolean,
});

const repoContainer = staggerContainer(0.04);
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
        <div class="flex items-center justify-between gap-2 mb-4">
            <div class="section-label">
                projects
                <span
                    v-if="revalidating"
                    class="text-[10px] text-catppuccin-subtle/50 ml-2 font-sans"
                >updating</span>
            </div>
            <router-link
                v-if="!loading && repos.length"
                to="/projects"
                class="text-xs text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors flex-shrink-0"
            >
                all projects <span class="arrow-drift">→</span>
            </router-link>
        </div>

        <motion.div
            v-if="loading"
            :variants="skeletonContainer"
            initial="hidden"
            animate="visible"
            class="space-y-3"
        >
            <motion.div
                v-for="i in 6"
                :key="`repo-loading-${i}`"
                :variants="skeletonItem"
                class="py-2.5"
            >
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="skeleton-pulse h-4 rounded bg-catppuccin-surface/40" :style="{ width: ['80px', '100px', '70px', '110px', '65px', '90px'][i - 1] }"></div>
                    </div>
                    <div v-if="i % 3 === 1" class="skeleton-pulse h-3 w-6 rounded bg-catppuccin-surface/30"></div>
                </div>
                <div class="skeleton-pulse h-3 rounded bg-catppuccin-surface/25 mt-1.5" :style="{ width: ['70%', '55%', '80%', '60%', '65%', '75%'][i - 1] }"></div>
            </motion.div>
        </motion.div>

        <div
            v-else-if="!repos.length"
            class="text-sm text-catppuccin-subtle"
        >
            no projects yet
        </div>

        <motion.div
            v-else
            :variants="repoContainer"
            initial="hidden"
            animate="visible"
        >
            <motion.a
                v-for="repo in repos"
                :key="repo.id"
                :href="repo.html_url"
                target="_blank"
                rel="noopener noreferrer"
                :variants="fadeUp"
                class="group block py-3 border-b border-catppuccin-surface/30 last:border-0"
            >
                <div class="flex items-center justify-between gap-3">
                    <span
                        class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors font-medium truncate text-sm"
                        :title="repo.name"
                    >
                        {{ repo.name }}
                    </span>
                    <span
                        v-if="repo.stargazers_count > 0"
                        class="text-catppuccin-subtle text-xs flex-shrink-0"
                    >
                        {{ repo.stargazers_count }}★
                    </span>
                </div>
                <p
                    class="text-xs text-catppuccin-subtle mt-0.5 truncate"
                    :title="repo.description"
                >
                    {{ repo.description || "—" }}
                </p>
            </motion.a>
        </motion.div>
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
