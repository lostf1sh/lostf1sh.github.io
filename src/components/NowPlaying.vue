<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { lanyardData } from "@/services/lanyardService";
import { tracks as lastfmTracks } from "@/services/lastfmService";

const nowMs = ref(Date.now());
let timer = 0;

const lastfmCover = (t) => {
    if (!Array.isArray(t?.image)) return null;
    const pick = t.image.find((i) => i.size === "extralarge") || t.image[t.image.length - 1];
    return pick?.["#text"] || null;
};

const track = computed(() => {
    const sp = lanyardData.spotify;
    if (sp) {
        return {
            title: sp.song,
            artist: sp.artist,
            cover: sp.album_art_url || null,
            url: `https://open.spotify.com/track/${sp.track_id}`,
            live: true,
            start: sp.timestamps?.start ?? null,
            end: sp.timestamps?.end ?? null,
        };
    }
    const t = lastfmTracks.value?.[0];
    if (!t) return null;
    const artist = t.artist?.["#text"] || "";
    return {
        title: t.name,
        artist,
        cover: lastfmCover(t),
        url: t.url?.includes("http")
            ? t.url
            : `https://open.spotify.com/search/${encodeURIComponent(`${t.name} ${artist}`.trim())}`,
        live: Boolean(t["@attr"]?.nowplaying),
        start: null,
        end: null,
    };
});

const progress = computed(() => {
    const t = track.value;
    if (!t?.start || !t?.end || t.end <= t.start) return null;
    const pct = ((nowMs.value - t.start) / (t.end - t.start)) * 100;
    return Math.min(100, Math.max(0, pct));
});

onMounted(() => {
    timer = window.setInterval(() => { nowMs.value = Date.now(); }, 1000);
});
onBeforeUnmount(() => {
    if (timer) window.clearInterval(timer);
});
</script>

<template>
    <a
        v-if="track"
        :href="track.url"
        target="_blank"
        rel="noopener noreferrer"
        class="now-card group"
    >
        <div class="cover">
            <img v-if="track.cover" :src="track.cover" alt="" loading="lazy" width="52" height="52" />
            <div v-else class="cover-fallback" aria-hidden="true">&#9834;</div>
        </div>

        <div class="info">
            <div class="label">{{ track.live ? "now playing" : "last played" }}</div>
            <div class="title">{{ track.title }}</div>
            <div class="artist">{{ track.artist }}</div>
            <div v-if="progress != null" class="bar"><span :style="{ width: progress + '%' }"></span></div>
        </div>
    </a>
</template>

<style scoped>
.now-card {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    width: 100%;
    max-width: 20rem;
    text-align: left;
}

.cover {
    position: relative;
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    background: rgb(var(--color-surface) / 0.5);
    overflow: hidden;
}

.cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.cover-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: rgb(var(--color-subtle));
    font-size: 1.1rem;
}

.info {
    min-width: 0;
    flex: 1;
}

.label {
    font-size: 0.7rem;
    color: rgb(var(--color-subtle) / 0.8);
    margin-bottom: 0.1rem;
}

.title {
    font-size: 0.9rem;
    color: rgb(var(--color-text));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
}

.now-card:hover .title,
.now-card:focus-visible .title {
    color: rgb(var(--color-mint));
}

.artist {
    font-size: 0.8rem;
    color: rgb(var(--color-subtle));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.bar {
    margin-top: 0.45rem;
    height: 2px;
    background: rgb(var(--color-surface) / 0.7);
    overflow: hidden;
}

.bar span {
    display: block;
    height: 100%;
    background: rgb(var(--color-mint));
    transition: width 1s linear;
}

@media (prefers-reduced-motion: reduce) {
    .bar span { transition: none; }
}
</style>
