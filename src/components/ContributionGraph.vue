<script setup>
import { computed } from "vue";
import {
    getContributionLevel,
    getGitHubContributionUrl,
} from "@/services/githubService";

const props = defineProps({
    contributions: { type: Array, required: true },
    loading: Boolean,
});

const weeks = computed(() => {
    const out = [];
    for (let i = 0; i < props.contributions.length; i += 7) {
        out.push(props.contributions.slice(i, i + 7));
    }
    return out;
});

const total = computed(() =>
    props.contributions.reduce((sum, day) => sum + day.count, 0),
);

const LEVEL_ALPHA = [0, 0.3, 0.5, 0.72, 1];
const cellStyle = (count) => {
    const lvl = getContributionLevel(count);
    if (lvl === 0) return { backgroundColor: "rgb(var(--color-surface) / 0.55)" };
    return { backgroundColor: `rgb(var(--color-mint) / ${LEVEL_ALPHA[lvl]})` };
};
</script>

<template>
    <div>
        <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-ink-subtle">
                <template v-if="!loading">{{ total }} contributions in the last year</template>
                <template v-else>loading activity</template>
            </span>
            <div class="hidden sm:flex items-center gap-1.5 text-xs text-ink-subtle">
                <span>less</span>
                <div class="flex gap-[2px]">
                    <span class="legend-cell" :style="cellStyle(0)"></span>
                    <span class="legend-cell" :style="{ backgroundColor: 'rgb(var(--color-mint) / 0.3)' }"></span>
                    <span class="legend-cell" :style="{ backgroundColor: 'rgb(var(--color-mint) / 0.5)' }"></span>
                    <span class="legend-cell" :style="{ backgroundColor: 'rgb(var(--color-mint) / 0.72)' }"></span>
                    <span class="legend-cell" :style="{ backgroundColor: 'rgb(var(--color-mint) / 1)' }"></span>
                </div>
                <span>more</span>
            </div>
        </div>

        <div v-if="loading" class="skeleton-pulse h-[68px] bg-ink-surface/20"></div>

        <div v-else class="overflow-x-auto md:overflow-visible pb-1 scrollbar-thin">
            <div class="inline-flex md:flex gap-[3px]" style="min-width: max-content;">
                <div
                    v-for="(week, wi) in weeks"
                    :key="wi"
                    class="flex flex-col gap-[3px] md:flex-1"
                >
                    <template v-for="(day, di) in week" :key="di">
                        <a
                            v-if="day.count > 0"
                            :href="getGitHubContributionUrl(day.date)"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="contrib-cell"
                            :style="cellStyle(day.count)"
                            :aria-label="`${day.date}: ${day.count} contributions`"
                        >
                            <span class="contrib-tip" :data-tip="`${day.date} · ${day.count}`"></span>
                        </a>
                        <div
                            v-else
                            class="contrib-cell"
                            :style="cellStyle(0)"
                            :title="`${day.date}: 0 contributions`"
                        ></div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.contrib-cell {
    width: 9px;
    height: 9px;
    position: relative;
    transition: outline 0.12s ease;
}

@media (min-width: 768px) {
    .contrib-cell {
        width: auto;
        height: auto;
        aspect-ratio: 1;
    }
}

a.contrib-cell:hover {
    outline: 1px solid rgb(var(--color-mint) / 0.6);
    outline-offset: 1px;
}

.contrib-tip {
    display: block;
    position: absolute;
    inset: 0;
}

.contrib-cell:hover .contrib-tip::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 7px;
    font-size: 0.7rem;
    white-space: nowrap;
    background: rgb(var(--color-surface));
    color: rgb(var(--color-text));
    border: 1px solid rgb(var(--color-overlay));
    z-index: 10;
    pointer-events: none;
}

.legend-cell {
    width: 9px;
    height: 9px;
    display: inline-block;
}

@media (hover: none) {
    .contrib-cell:hover .contrib-tip::after { display: none; }
}
</style>
