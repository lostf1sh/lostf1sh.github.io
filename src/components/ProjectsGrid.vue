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

const repoContainer = staggerContainer(0.03);
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
            projects
            <span v-if="revalidating" class="text-ink-subtle/40"> [syncing]</span>
        </span>

        <div v-if="loading" class="space-y-1">
            <div v-for="i in 6" :key="i" class="py-1.5">
                <div class="skeleton-pulse h-3 bg-ink-surface/40" :style="{ width: ['140px', '170px', '120px', '180px', '110px', '150px'][i - 1] }"></div>
            </div>
        </div>

        <div v-else-if="!repos.length" class="text-xs text-ink-subtle py-2">
            (empty)
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
                class="group block py-1.5 border-b border-ink-surface/20 last:border-0 text-xs"
            >
                <div class="flex items-center justify-between gap-2">
                    <span class="text-ink-text group-hover:text-ink-accent transition-colors truncate">
                        {{ repo.name }}
                    </span>
                    <span v-if="repo.stargazers_count > 0" class="text-ink-subtle flex-shrink-0">
                        ★{{ repo.stargazers_count }}
                    </span>
                </div>
                <div class="text-ink-subtle/40 truncate mt-0.5" :title="repo.description">
                    {{ repo.description || "--" }}
                </div>
            </motion.a>
        </motion.div>
    </motion.div>
</template>
