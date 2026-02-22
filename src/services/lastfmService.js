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

// Get user info (total playcount, account age)
export const getUserInfo = async () => {
  const response = await axios.get(BASE_URL, {
    params: {
      method: "user.getinfo",
      user: USER,
      api_key: API_KEY,
      format: "json",
    },
  });

  return response.data.user;
};

// Get top artists (supports period: overall, 7day, 1month, 3month, 6month, 12month)
export const getTopArtists = async (period = "overall", limit = 50) => {
  const response = await axios.get(BASE_URL, {
    params: {
      method: "user.gettopartists",
      user: USER,
      api_key: API_KEY,
      format: "json",
      period: period,
      limit: limit,
    },
  });

  return response.data.topartists.artist;
};

// Get weekly chart data (for activity grid)
export const getWeeklyChartData = async () => {
  const response = await axios.get(BASE_URL, {
    params: {
      method: "user.getweeklychartdata",
      user: USER,
      api_key: API_KEY,
      format: "json",
    },
  });

  return response.data.weeklychartdata.chart;
};

// Get recent tracks for streak calculation (up to 200 tracks)
export const getRecentTracksForStreak = async (limit = 200) => {
  const response = await axios.get(BASE_URL, {
    params: {
      method: "user.getrecenttracks",
      user: USER,
      api_key: API_KEY,
      format: "json",
      limit: limit,
    },
  });

  return response.data.recenttracks.track;
};
