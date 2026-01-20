import { reactive } from "vue";

const lanyardData = reactive({
  discordUser: null,
  spotify: null,
  discordStatus: "offline",
  discordStatusColor: "text-catppuccin-subtle",
  editorActivity: null,
  isConnected: false,
  isLoading: true,
});

class LanyardService {
  constructor() {
    this.ws = null;
    this.heartbeat = null;
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxAttempts = 5;
    this.userId = "470904884946796544";
    this.isConnecting = false;
  }

  connect() {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.isConnecting = true;
    lanyardData.isLoading = true;

    try {
      this.ws = new WebSocket("wss://api.lanyard.rest/socket");

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        lanyardData.isConnected = true;

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
        } catch (e) {}
      };

      this.ws.onclose = (event) => {
        this.isConnecting = false;
        lanyardData.isConnected = false;

        if (this.heartbeat) {
          clearInterval(this.heartbeat);
          this.heartbeat = null;
        }

        if (event.code !== 1000 && this.reconnectAttempts < this.maxAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        lanyardData.isConnected = false;
      };
    } catch (e) {
      this.isConnecting = false;
      lanyardData.isLoading = false;
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
      this.updatePresence(msg.d);
      lanyardData.isLoading = false;
    }
  }

  updatePresence(data) {
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

const lanyardService = new LanyardService();
lanyardService.connect();

export { lanyardService, lanyardData };
