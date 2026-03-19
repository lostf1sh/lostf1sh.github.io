import { ref, watch } from "vue";
import { lanyardData } from "@/services/lanyardService";
import { markReady } from "@/services/preloader";

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY || "c9ee964e5a0bffdb2aba28397f852bbf";
const USER = "molishu";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const POLL_INTERVAL = 60_000; // 60s background poll

// Reactive state
export const tracks = ref([]);
export const isLoading = ref(true);
export const error = ref(null);
let initialLoad = true;
let pollTimer = null;

const fetchTracks = async () => {
  try {
    if (initialLoad) isLoading.value = true;

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
    tracks.value = data.recenttracks.track;
    error.value = null;
  } catch (err) {
    if (import.meta.env.DEV) console.error("Failed to load recent tracks:", err);
    error.value = "couldn't load tracks";
  } finally {
    isLoading.value = false;
    if (initialLoad) {
      initialLoad = false;
      markReady("songs");
    }
  }
};

// --- Smart polling: only when tab is visible ---
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
    // Tab visible again — fetch immediately then resume polling
    fetchTracks();
    startPolling();
  }
});

// --- Lanyard Spotify trigger: instant update on track change ---
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

// Boot
fetchTracks();
startPolling();
