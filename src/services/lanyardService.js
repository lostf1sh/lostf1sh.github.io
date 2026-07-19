import { reactive } from "vue";
import { readSessionCache, writeSessionCache } from "@/utils/apiLocalCache";

const LANYARD_SESSION_KEY = "lanyard.presence.v2";
const LANYARD_USER_ID = "470904884946796544";
const REST_URL = `https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`;
const FIRST_MESSAGE_MS = 12_000;
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;

const lanyardData = reactive({
  spotify: null,
  listening: null,
  discordStatus: "offline",
  editorActivity: null,
});

// Non-reactive: only the connect/fallback flow cares about these.
let hasPresence = false;
let isLoading = true;

// Discord proxies external activity art as "mp:external/..." asset keys.
function activityImageUrl(asset) {
  if (!asset) return null;
  if (asset.startsWith("mp:")) {
    return `https://media.discordapp.net/${asset.slice(3)}`;
  }
  if (asset.startsWith("http")) return asset;
  return null;
}

function applyPresencePayload(data) {
  if (!data) return;

  hasPresence = true;
  isLoading = false;

  lanyardData.spotify = data.spotify
    ? {
        song: data.spotify.song,
        artist: data.spotify.artist,
        track_id: data.spotify.track_id,
        album_art_url: data.spotify.album_art_url || null,
        timestamps: data.spotify.timestamps || null,
      }
    : null;

  // Any other "Listening to ..." activity (Apple Music, YouTube Music, etc.)
  const listening = data.activities?.find(
    (a) => a.type === 2 && a.name !== "Spotify" && a.details,
  );
  lanyardData.listening = listening
    ? {
        song: listening.details,
        artist: listening.state || "",
        source: listening.name,
        album_art_url: activityImageUrl(listening.assets?.large_image),
        url: listening.details_url || listening.assets?.large_url || null,
        timestamps: listening.timestamps || null,
      }
    : null;

  if (data.discord_status) {
    lanyardData.discordStatus = data.discord_status;
  }

  lanyardData.editorActivity = data.activities?.find(
    (a) =>
      a.name === "Visual Studio Code" ||
      a.name === "Code" ||
      a.name === "Zed",
  );
}

function persistPresence() {
  writeSessionCache(LANYARD_SESSION_KEY, {
    spotify: lanyardData.spotify,
    listening: lanyardData.listening,
    discordStatus: lanyardData.discordStatus,
    editorActivity: lanyardData.editorActivity,
  });
}

function hydrateFromSession() {
  const row = readSessionCache(LANYARD_SESSION_KEY);
  if (!row?.value) return false;
  if (Date.now() - row.storedAt > MAX_SESSION_AGE_MS) return false;

  const p = row.value;
  lanyardData.spotify = p.spotify ?? null;
  lanyardData.listening = p.listening ?? null;
  if (p.discordStatus) lanyardData.discordStatus = p.discordStatus;
  lanyardData.editorActivity = p.editorActivity ?? null;
  hasPresence = true;
  isLoading = false;
  return true;
}

async function fetchRestPresence() {
  try {
    const res = await fetch(REST_URL);
    if (!res.ok) return false;
    const body = await res.json();
    if (!body?.success || !body.data) return false;
    applyPresencePayload(body.data);
    persistPresence();
    return true;
  } catch {
    return false;
  }
}

class LanyardService {
  constructor() {
    this.ws = null;
    this.heartbeat = null;
    this.reconnectTimeout = null;
    this.firstMessageTimer = null;
    this.reconnectAttempts = 0;
    this.maxAttempts = 5;
    this.userId = LANYARD_USER_ID;
    this.isConnecting = false;
  }

  clearFirstMessageTimer() {
    if (this.firstMessageTimer) {
      clearTimeout(this.firstMessageTimer);
      this.firstMessageTimer = null;
    }
  }

  startFirstMessageGuard() {
    this.clearFirstMessageTimer();
    this.firstMessageTimer = setTimeout(() => {
      if (isLoading || !hasPresence) {
        void fetchRestPresence();
      }
    }, FIRST_MESSAGE_MS);
  }

  connect() {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.isConnecting = true;
    if (!hasPresence) {
      isLoading = true;
    }

    this.startFirstMessageGuard();

    try {
      this.ws = new WebSocket("wss://api.lanyard.rest/socket");

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        this.ws.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_id: this.userId },
          }),
        );
      };

      this.ws.onmessage = (event) => {
        try {
          this.handleMessage(JSON.parse(event.data));
        } catch (error) {
          console.error("Failed to parse Lanyard socket message:", error);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;

        if (this.heartbeat) {
          clearInterval(this.heartbeat);
          this.heartbeat = null;
        }

        // Hidden tabs throttle timers until the heartbeat misses and the
        // server drops us; the visibilitychange handler resumes instead.
        if (document.hidden) return;

        if (this.reconnectAttempts < this.maxAttempts) {
          this.scheduleReconnect();
        } else {
          isLoading = false;
        }
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
      };
    } catch (e) {
      this.isConnecting = false;
      isLoading = false;
      console.error("Failed to initialize Lanyard socket connection:", e);
      this.scheduleReconnect();
    }
  }

  handleMessage(msg) {
    if (msg.op === 1) {
      this.startHeartbeat(msg.d.heartbeat_interval);
    } else if (
      msg.op === 0 &&
      (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")
    ) {
      this.clearFirstMessageTimer();
      applyPresencePayload(msg.d);
      persistPresence();
    }
  }

  startHeartbeat(interval) {
    if (this.heartbeat) clearInterval(this.heartbeat);

    this.heartbeat = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ op: 3 }));
      }
    }, interval);
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    this.reconnectAttempts++;
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts - 1),
      30000,
    );

    this.reconnectTimeout = setTimeout(() => this.connect(), delay);
  }
}

const hydrated = hydrateFromSession();

const lanyardService = new LanyardService();

// A backgrounded tab (or a lost network) kills the socket; without these the
// card silently freezes on the last song until a full reload.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  if (lanyardService.ws?.readyState !== WebSocket.OPEN) {
    lanyardService.reconnectAttempts = 0;
    void fetchRestPresence();
    lanyardService.connect();
  }
});

window.addEventListener("online", () => {
  if (lanyardService.ws?.readyState !== WebSocket.OPEN) {
    lanyardService.reconnectAttempts = 0;
    lanyardService.connect();
  }
});

// The websocket delivers INIT_STATE within a couple seconds and the
// first-message guard falls back to REST, so the eager REST fetch is only
// needed when there is no cached presence to paint from.
if (!hydrated) void fetchRestPresence();
lanyardService.connect();

export { lanyardData };
