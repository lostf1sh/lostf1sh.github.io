import { ref, watch } from "vue";
import { lanyardData } from "@/services/lanyardService";
import { markReady } from "@/services/preloader";
import { readLocalCache, writeLocalCache, CACHE_KEYS } from "@/utils/apiLocalCache";

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY || "c9ee964e5a0bffdb2aba28397f852bbf";
const USER = "molishu";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const POLL_INTERVAL = 60_000;

export const tracks = ref([]);
export const isLoading = ref(true);
export const isRevalidating = ref(false);
export const error = ref(null);
export const revalidateFailed = ref(false);

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
  isLoading.value = false;
  initialHydrated = true;
  markReady("songs");
  return true;
}

const fetchTracks = async () => {
  const empty = tracks.value.length === 0;
  if (empty) {
    isLoading.value = true;
  } else {
    isRevalidating.value = true;
  }

  try {
    const params = new URLSearchParams({
      method: "user.getrecenttracks",
      user: USER,
      api_key: API_KEY,
      format: "json",
      limit: 50,
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Last.fm request failed with ${response.status}`);
    }

    const data = await response.json();
    const list = normalizeTrackList(data);
    tracks.value = list;
    revalidateFailed.value = false;
    error.value = null;
    if (list.length) {
      writeLocalCache(CACHE_KEYS.LASTFM_TRACKS, list);
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error("Failed to load recent tracks:", err);
    if (tracks.value.length) {
      revalidateFailed.value = true;
      error.value = null;
    } else {
      error.value = "couldn't load tracks";
    }
  } finally {
    isLoading.value = false;
    isRevalidating.value = false;
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
    fetchTracks();
    startPolling();
  }
});

let lastTrackId = null;
watch(
  () => lanyardData.spotify,
  (spotify) => {
    const trackId = spotify?.track_id ?? null;
    if (trackId !== lastTrackId) {
      lastTrackId = trackId;
      setTimeout(fetchTracks, 5000);
    }
  },
);

fetchTracks();
startPolling();
