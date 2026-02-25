import axios from "axios";

const API_KEY = "c9ee964e5a0bffdb2aba28397f852bbf";
const USER = "molishu";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

// Cache to prevent rate limiting
let cachedTracks = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export const getRecentTracks = async (forceRefresh = false) => {
  const now = Date.now();
  
  // Return cached data if still valid and not forcing refresh
  if (!forceRefresh && cachedTracks && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedTracks;
  }
  
  const response = await axios.get(BASE_URL, {
    params: {
      method: "user.getrecenttracks",
      user: USER,
      api_key: API_KEY,
      format: "json",
      limit: 50,
    },
  });
  
  cachedTracks = response.data.recenttracks.track;
  lastFetchTime = now;
  
  return cachedTracks;
};

// Clear cache manually if needed
export const clearTracksCache = () => {
  cachedTracks = null;
  lastFetchTime = 0;
};
