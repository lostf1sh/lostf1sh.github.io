import { reactive } from "vue";
import { readSessionCache, writeSessionCache } from "@/utils/apiLocalCache";

const LANYARD_SESSION_KEY = "lanyard.presence.v1";
const LANYARD_USER_ID = "470904884946796544";
const REST_URL = `https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`;
const FIRST_MESSAGE_MS = 12_000;
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;

const lanyardData = reactive({
  discordUser: null,
  spotify: null,
  discordStatus: "offline",
  discordStatusColor: "text-catppuccin-subtle",
  editorActivity: null,
  isConnected: false,
  isLoading: true,
  presenceUnavailable: false,
  isReconnecting: false,
  usingCachedPresence: false,
});

function applyPresencePayload(data) {
  if (!data) return;

  if (data.discord_user) {
    lanyardData.discordUser = {
      username: data.discord_user.username,
      discriminator: data.discord_user.discriminator,
      avatar: data.discord_user.avatar,
      id: data.discord_user.id,
    };
  }

  lanyardData.spotify = data.spotify
    ? {
        song: data.spotify.song,
        artist: data.spotify.artist,
        track_id: data.spotify.track_id,
      }
    : null;

  if (data.discord_status) {
    lanyardData.discordStatus = data.discord_status;
    lanyardData.discordStatusColor =
      data.discord_status === "online"
        ? "text-catppuccin-gold"
        : "text-catppuccin-subtle";
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
    discordUser: lanyardData.discordUser,
    spotify: lanyardData.spotify,
    discordStatus: lanyardData.discordStatus,
    discordStatusColor: lanyardData.discordStatusColor,
    editorActivity: lanyardData.editorActivity,
  });
}

function hydrateFromSession() {
  const row = readSessionCache(LANYARD_SESSION_KEY);
  if (!row?.value) return false;
  if (Date.now() - row.storedAt > MAX_SESSION_AGE_MS) return false;

  const p = row.value;
  if (p.discordUser) lanyardData.discordUser = p.discordUser;
  lanyardData.spotify = p.spotify ?? null;
  if (p.discordStatus) lanyardData.discordStatus = p.discordStatus;
  if (p.discordStatusColor) lanyardData.discordStatusColor = p.discordStatusColor;
  lanyardData.editorActivity = p.editorActivity ?? null;
  lanyardData.usingCachedPresence = true;
  lanyardData.isLoading = false;
  return Boolean(p.discordUser);
}

async function fetchRestPresence() {
  try {
    const res = await fetch(REST_URL);
    if (!res.ok) return false;
    const body = await res.json();
    if (!body?.success || !body.data) return false;
    applyPresencePayload(body.data);
    lanyardData.usingCachedPresence = false;
    lanyardData.presenceUnavailable = false;
    persistPresence();
    lanyardData.isLoading = false;
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
    this.firstMessageTimer = setTimeout(async () => {
      if (lanyardData.isLoading || !lanyardData.discordUser) {
        const ok = await fetchRestPresence();
        if (!ok && !lanyardData.discordUser) {
          lanyardData.isLoading = false;
          lanyardData.presenceUnavailable = true;
        }
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
    if (!lanyardData.discordUser) {
      lanyardData.isLoading = true;
    }

    this.startFirstMessageGuard();

    try {
      this.ws = new WebSocket("wss://api.lanyard.rest/socket");

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        lanyardData.isConnected = true;
        lanyardData.isReconnecting = false;

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

      this.ws.onclose = (event) => {
        this.isConnecting = false;
        lanyardData.isConnected = false;
        lanyardData.usingCachedPresence = Boolean(lanyardData.discordUser);

        if (this.heartbeat) {
          clearInterval(this.heartbeat);
          this.heartbeat = null;
        }

        if (event.code !== 1000 && this.reconnectAttempts < this.maxAttempts) {
          lanyardData.isReconnecting = true;
          this.scheduleReconnect();
        } else if (this.reconnectAttempts >= this.maxAttempts) {
          lanyardData.isReconnecting = false;
          lanyardData.presenceUnavailable = !lanyardData.discordUser;
          lanyardData.isLoading = false;
        }
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        lanyardData.isConnected = false;
      };
    } catch (e) {
      this.isConnecting = false;
      lanyardData.isLoading = false;
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
      lanyardData.usingCachedPresence = false;
      lanyardData.presenceUnavailable = false;
      persistPresence();
      lanyardData.isLoading = false;
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

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.clearFirstMessageTimer();

    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Manual disconnect");
      this.ws = null;
    }

    lanyardData.isConnected = false;
  }
}

hydrateFromSession();

const lanyardService = new LanyardService();

void fetchRestPresence();
lanyardService.connect();

export { lanyardService, lanyardData };
