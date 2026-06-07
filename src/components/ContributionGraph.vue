<script setup>
import { computed } from "vue";
import { motion } from "motion-v";
import { springs } from "@/utils/motion";
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
        class="tui-panel mt-4"
        :whileInView="{ opacity: 1 }"
        :initial="{ opacity: 0 }"
        :transition="springs.gentle"
        :inViewOptions="{ once: true }"
    >
        <span class="tui-panel-title">
            contributions
            <span v-if="revalidating && !loading" class="text-ink-subtle/40"> [syncing]</span>
        </span>

        <div class="pt-1">
            <div v-if="!loading" class="flex items-center justify-between mb-2">
                <span class="text-[10px] text-ink-subtle/40">{{ totalContributions }} in the last year</span>
                <div class="flex items-center gap-1.5 text-[10px] text-ink-subtle/40">
                    <span>less</span>
                    <div class="flex gap-px">
                        <div class="w-[7px] h-[7px] bg-ink-surface/60"></div>
                        <div class="w-[7px] h-[7px] bg-ink-text/10"></div>
                        <div class="w-[7px] h-[7px] bg-ink-text/25"></div>
                        <div class="w-[7px] h-[7px] bg-ink-text/45"></div>
                        <div class="w-[7px] h-[7px] bg-ink-text/70"></div>
                    </div>
                    <span>more</span>
                </div>
            </div>

            <div v-if="loading">
                <div class="h-[60px] bg-ink-surface/15 cursor-blink"></div>
            </div>

            <div v-else>
                <div class="overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-thin">
                    <div class="inline-flex md:flex gap-[2px] md:gap-[3px]" style="min-width: max-content;">
                        <div
                            v-for="(week, weekIndex) in contributionWeeks"
                            :key="weekIndex"
                            class="flex flex-col gap-[2px] md:gap-[3px] md:flex-1"
                        >
                            <template v-for="(day, dayIndex) in week" :key="dayIndex">
                                <a
                                    v-if="day.count > 0"
                                    :href="getGitHubContributionUrl(day.date)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="contrib-cell no-external w-[7px] h-[7px] md:w-auto md:h-auto md:aspect-square transition-[background-color,outline] hover:outline hover:outline-1 hover:outline-ink-text/30 relative group"
                                    :class="[
                                        getContributionLevel(day.count) === 1
                                            ? 'bg-ink-text/10 hover:bg-ink-text/20'
                                            : getContributionLevel(day.count) === 2
                                              ? 'bg-ink-text/25 hover:bg-ink-text/35'
                                              : getContributionLevel(day.count) === 3
                                                ? 'bg-ink-text/45 hover:bg-ink-text/55'
                                                : 'bg-ink-text/70 hover:bg-ink-text/85',
                                    ]"
                                    :aria-label="`${day.date}: ${day.count} contributions`"
                                >
                                    <span class="contrib-tip" :data-tip="`${day.date}: ${day.count}`"></span>
                                </a>
                                <div
                                    v-else
                                    class="w-[7px] h-[7px] md:w-auto md:h-auto md:aspect-square bg-ink-surface/25"
                                    :title="`${day.date}: 0 contributions`"
                                ></div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
</template>

<style scoped>
.contrib-cell:hover .contrib-tip::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 6px;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    background: rgb(var(--color-surface));
    color: rgb(var(--color-text));
    border: 1px solid rgb(var(--color-overlay));
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
