<script setup>
import { ref, onMounted } from "vue";
import { getTopTracks } from "@/services/lastfmService";
import { CACHE_KEYS, readLocalCache, writeLocalCache } from "@/utils/apiLocalCache";

const tracks = ref([]);
const cached = readLocalCache(CACHE_KEYS.LASTFM_TOP);
if (cached?.value?.length) tracks.value = cached.value;
const loading = ref(!tracks.value.length);
const failed = ref(false);

onMounted(async () => {
    try {
        const data = await getTopTracks("7day", 6);
        if (data.length) {
            tracks.value = data;
            writeLocalCache(CACHE_KEYS.LASTFM_TOP, data);
        }
    } catch {
        if (!tracks.value.length) failed.value = true;
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div v-if="loading" class="grid sm:grid-cols-2 gap-x-10 gap-y-1">
        <div v-for="i in 6" :key="i" class="flex items-center gap-3 py-2">
            <div class="skeleton-pulse h-3 w-3 bg-ink-surface/30"></div>
            <div class="skeleton-pulse h-3 flex-1 bg-ink-surface/25" :style="{ maxWidth: ['70%','55%','62%','48%','66%','58%'][i - 1] }"></div>
        </div>
    </div>

    <div v-else-if="failed && !tracks.length" class="text-sm text-ink-subtle">couldn't load music stats.</div>

    <div v-else class="grid sm:grid-cols-2 gap-x-10">
        <a
            v-for="(t, i) in tracks"
            :key="`${t.name}-${t.artist}`"
            :href="t.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-baseline gap-3 py-2 border-b border-ink-surface/25 last:border-0 sm:[&:nth-last-child(2)]:border-0"
        >
            <span class="text-sm text-ink-subtle/60 tabular-nums w-4 flex-shrink-0">{{ i + 1 }}</span>
            <span class="min-w-0 flex-1">
                <span class="block truncate text-sm text-ink-text group-hover:text-ink-mint transition-colors">{{ t.name }}</span>
                <span class="block truncate text-xs text-ink-subtle">{{ t.artist }}</span>
            </span>
            <span class="text-xs text-ink-subtle flex-shrink-0">{{ t.playcount }} plays</span>
        </a>
    </div>
</template>
