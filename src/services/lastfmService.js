import { ref, watch } from "vue";
import { lanyardData } from "@/services/lanyardService";
import { markReady } from "@/services/preloader";
import { readLocalCache, writeLocalCache, CACHE_KEYS } from "@/utils/apiLocalCache";

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY || "c9ee964e5a0bffdb2aba28397f852bbf";
const USER = "molishu";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const POLL_INTERVAL = 60_000;

export const tracks = ref([]);

let initialHydrated = false;
let pollTimer = null;

function normalizeTrackList(data) {
  const raw = data?.recenttracks?.track;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function hydrateFromCache() {
  const row = readLocalCache(CACHE_KEYS.LASTFM_TRACKS);
  if (!row?.value?.length) return false;
  tracks.value = row.value;
  initialHydrated = true;
  markReady("songs");
  return true;
}

export const getTopTracks = async (period = "7day", limit = 6) => {
  const params = new URLSearchParams({
    method: "user.gettoptracks",
    user: USER,
    api_key: API_KEY,
    period,
    limit,
    format: "json",
  });
  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Last.fm top tracks request failed with ${response.status}`);
  }
  const data = await response.json();
  const raw = data?.toptracks?.track;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.map((t) => ({
    name: t.name,
    artist: t.artist?.name || "",
    playcount: Number(t.playcount) || 0,
    url: t.url,
  }));
};

let lastFetchAt = 0;

const fetchTracks = async () => {
  lastFetchAt = Date.now();
  try {
    // Only the first track is rendered (NowPlaying), so a small page is enough.
    const params = new URLSearchParams({
      method: "user.getrecenttracks",
      user: USER,
      api_key: API_KEY,
      format: "json",
      limit: 5,
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Last.fm request failed with ${response.status}`);
    }

    const data = await response.json();
    const list = normalizeTrackList(data);
    tracks.value = list;
    if (list.length) {
      writeLocalCache(CACHE_KEYS.LASTFM_TRACKS, list);
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error("Failed to load recent tracks:", err);
  } finally {
    if (!initialHydrated) {
      initialHydrated = true;
      markReady("songs");
    }
  }
};

hydrateFromCache();

const startPolling = () => {
  if (pollTimer) return;
  pollTimer = setInterval(fetchTracks, POLL_INTERVAL);
};

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopPolling();
  } else {
    if (Date.now() - lastFetchAt >= 30_000) fetchTracks();
    startPolling();
  }
});

const presenceTrackKey = () => {
  const sp = lanyardData.spotify;
  if (sp) return sp.track_id ?? `${sp.song}|${sp.artist}`;
  const li = lanyardData.listening;
  if (li) return `${li.song}|${li.artist}`;
  return null;
};

let lastTrackId = presenceTrackKey();
watch(
  presenceTrackKey,
  (trackId) => {
    if (trackId !== lastTrackId) {
      lastTrackId = trackId;
      // Skip if a poll just ran; the scrobble is already in that response.
      setTimeout(() => {
        if (Date.now() - lastFetchAt >= 30_000) fetchTracks();
      }, 5000);
    }
  },
);

fetchTracks();
if (!document.hidden) startPolling();
