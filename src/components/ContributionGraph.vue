<script setup>
import { computed } from "vue";
import { motion } from "motion-v";
import { springs, fadeUp } from "@/utils/motion";
import {
    getContributionLevel,
    getGitHubContributionUrl,
} from "@/services/githubService";

const props = defineProps({
    contributions: { type: Array, required: true },
    loading: Boolean,
    revalidating: Boolean,
});

const contributionWeeks = computed(() => {
    const weeks = [];
    for (let i = 0; i < props.contributions.length; i += 7) {
        weeks.push(props.contributions.slice(i, i + 7));
    }
    return weeks;
});

const totalContributions = computed(() => {
    return props.contributions.reduce((sum, day) => sum + day.count, 0);
});
</script>

<template>
    <motion.div
        class="mt-10"
        :whileInView="{ opacity: 1, y: 0 }"
        :initial="{ opacity: 0, y: 10 }"
        :transition="springs.gentle"
        :inViewOptions="{ once: true }"
    >
        <div class="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <div class="section-label">
                contributions
                <span
                    v-if="revalidating && !loading"
                    class="text-[10px] text-catppuccin-subtle/50 ml-2 font-sans"
                >updating</span>
            </div>
            <div v-if="!loading" class="flex items-center gap-1.5 text-[10px] text-catppuccin-subtle">
                <span>less</span>
                <div class="flex gap-[2px]">
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-surface/60"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-mauve/25"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-mauve/45"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-mauve/65"></div>
                    <div class="w-2 h-2 rounded-[2px] bg-catppuccin-mauve/85"></div>
                </div>
                <span>more</span>
            </div>
        </div>

        <div
            v-if="loading"
        >
            <div class="h-[60px] bg-catppuccin-surface/20 rounded cursor-blink"></div>
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
                                class="contrib-cell w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm transition-[background-color,box-shadow,transform] hover:ring-1 hover:ring-catppuccin-mauve/50 hover:scale-110 cursor-pointer relative group"
                                :class="[
                                    getContributionLevel(day.count) === 1
                                        ? 'bg-catppuccin-mauve/20 hover:bg-catppuccin-mauve/35'
                                        : getContributionLevel(day.count) === 2
                                          ? 'bg-catppuccin-mauve/40 hover:bg-catppuccin-mauve/55'
                                          : getContributionLevel(day.count) === 3
                                            ? 'bg-catppuccin-mauve/60 hover:bg-catppuccin-mauve/75'
                                            : 'bg-catppuccin-mauve/80 hover:bg-catppuccin-mauve',
                                ]"
                                :aria-label="`${day.date}: ${day.count} contributions`"
                            >
                                <span class="contrib-tip" :data-tip="`${day.date}: ${day.count}`"></span>
                            </a>
                            <div
                                v-else
                                class="w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm bg-catppuccin-surface/30"
                                :title="`${day.date}: 0 contributions`"
                            ></div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="text-xs text-catppuccin-subtle mt-3">
                {{ totalContributions }} contributions in the last year
            </div>
        </div>
    </motion.div>
</template>

<style scoped>
.contrib-cell:hover .contrib-tip::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    padding: 3px 8px;
    font-size: 11px;
    font-family: 'Karla', sans-serif;
    white-space: nowrap;
    background: rgb(var(--color-surface));
    color: rgb(var(--color-text));
    border-radius: 3px;
    z-index: 10;
    pointer-events: none;
}

.contrib-tip {
    display: block;
    position: absolute;
    inset: 0;
}

@media (hover: none) {
    .contrib-cell:hover .contrib-tip::after {
        display: none;
    }
}
</style>
