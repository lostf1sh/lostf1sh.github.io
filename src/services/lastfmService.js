import axios from "axios";

const API_KEY = "c9ee964e5a0bffdb2aba28397f852bbf";
const USER = "molishu";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export const getRecentTracks = async () => {
  const response = await axios.get(BASE_URL, {
    params: {
      method: "user.getrecenttracks",
      user: USER,
      api_key: API_KEY,
      format: "json",
      limit: 50,
    },
  });
  return response.data.recenttracks.track;
};
