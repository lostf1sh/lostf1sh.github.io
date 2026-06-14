import { ref, watch } from "vue";
import { lanyardData } from "@/services/lanyardService";
import { theme } from "@/utils/theme";
import { setTitlePrefix } from "@/utils/seo";
import { applyThemeColor, applyFavicon } from "@/utils/chrome";
import {
  rgbToOklch,
  parseRgbTriplet,
  oklchToRgbTriplet,
  oklchToHex,
  gamutClampOklch,
  lerp,
  hueLerp,
  extractAccentFromImage,
} from "@/utils/color";

const ROOT = typeof document !== "undefined" ? document.documentElement : null;

const COOL_HUE = 240;
const CODING_CHROMA_FACTOR = 0.82;
const MIN_CHROMA_FACTOR = 0.55;
const MAX_CHROMA_FACTOR = 1.15;
const GRAYSCALE_CHROMA_FACTOR = 0.1;
const DRIFT_MS = 1500;
const SETTLE_MS = 2000;

const AURA = { music: 1.0, coding: 0.5, idle: 0 };
const THEME_TINT_C = 0.05;
const FAVICON_L = 0.24;
const FAVICON_C = 0.07;
const CHROME_THROTTLE_MS = 150;

export const accentMode = ref("idle");
export const vitality = ref(1);

const reducedMotionMq =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
const prefersReduced = () => Boolean(reducedMotionMq?.matches);

let baseline = { L: 0.756, C: 0.125, H: 168 };
let bgBaseline = { L: 0.13, C: 0, H: 0 };

const current = { L: 0.756, C: 0.125, H: 168, aura: AURA.idle, v: 1 };

let rafId = 0;
let reqId = 0;
let started = false;
let lastChromeMs = 0;
const albumCache = new Map();

function readBaselines() {
  if (!ROOT) return;
  const cs = getComputedStyle(ROOT);
  const mint = parseRgbTriplet(cs.getPropertyValue("--color-mint-base"));
  if (mint) baseline = rgbToOklch(mint[0], mint[1], mint[2]);
  const bg = parseRgbTriplet(cs.getPropertyValue("--color-base"));
  if (bg) bgBaseline = rgbToOklch(bg[0], bg[1], bg[2]);
}

function vitalityTarget() {
  const s = lanyardData.discordStatus;
  let v =
    s === "online" ? 0.85 : s === "dnd" ? 0.65 : s === "idle" ? 0.5 : 0.25;
  if (lanyardData.editorActivity) v += 0.1;
  if (lanyardData.spotify) v += 0.05;
  return Math.min(1, v);
}

const chromaScale = (v) => 0.7 + 0.3 * v;

function musicAccent(album, v) {
  if (!album) return { L: baseline.L, C: baseline.C * chromaScale(v), H: baseline.H };
  // Black & white cover → light grayish accent instead of JPEG-cast blue/green.
  if (album.grayscale) {
    return {
      L: baseline.L,
      C: baseline.C * GRAYSCALE_CHROMA_FACTOR * chromaScale(v),
      H: baseline.H,
    };
  }
  const minC = baseline.C * MIN_CHROMA_FACTOR;
  const maxC = baseline.C * MAX_CHROMA_FACTOR;
  return {
    L: baseline.L,
    C: Math.min(maxC, Math.max(minC, album.C)) * chromaScale(v),
    H: album.H,
  };
}

function applyAccentVars() {
  if (!ROOT) return;
  ROOT.style.setProperty("--color-mint", oklchToRgbTriplet(current));
  ROOT.style.setProperty("--accent-aura", current.aura.toFixed(3));
  ROOT.style.setProperty("--vitality", current.v.toFixed(3));
  vitality.value = current.v;
}

function applyChrome(now, isFinal) {
  if (!isFinal && now - lastChromeMs < CHROME_THROTTLE_MS) return;
  lastChromeMs = now;
  const tint = current.aura;
  applyThemeColor(
    oklchToHex(
      gamutClampOklch({ L: bgBaseline.L, C: THEME_TINT_C * tint, H: current.H }),
    ),
  );
  if (isFinal) {
    applyFavicon(
      oklchToHex(
        gamutClampOklch({ L: FAVICON_L, C: FAVICON_C * tint, H: current.H }),
      ),
    );
  }
}

function frame(now, isFinal) {
  applyAccentVars();
  applyChrome(now, isFinal);
}

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

function animateTo(to, duration) {
  cancelAnimationFrame(rafId);

  if (prefersReduced() || duration <= 0 || typeof performance === "undefined") {
    Object.assign(current, to);
    frame(0, true);
    return;
  }

  const from = { ...current };
  const start = performance.now();

  const step = (now) => {
    const e = easeInOutCubic(Math.min(1, (now - start) / duration));
    current.L = lerp(from.L, to.L, e);
    current.C = lerp(from.C, to.C, e);
    current.H = hueLerp(from.H, to.H, e);
    current.aura = lerp(from.aura, to.aura, e);
    current.v = lerp(from.v, to.v, e);

    const isFinal = e >= 1;
    frame(now, isFinal);
    if (!isFinal) rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
}

async function update() {
  readBaselines();

  const sp = lanyardData.spotify;
  const v = vitalityTarget();
  const myReq = ++reqId;

  let mode;
  let accent;

  if (sp?.album_art_url) {
    mode = "music";
    const key = sp.track_id || sp.album_art_url;
    let album = albumCache.get(key);
    if (album === undefined) {
      album = await extractAccentFromImage(sp.album_art_url);
      if (myReq !== reqId) return;
      albumCache.set(key, album);
    }
    accent = musicAccent(album, v);
  } else if (lanyardData.editorActivity) {
    mode = "coding";
    accent = { L: baseline.L, C: baseline.C * CODING_CHROMA_FACTOR * chromaScale(v), H: COOL_HUE };
  } else {
    mode = "idle";
    accent = { L: baseline.L, C: baseline.C * chromaScale(v), H: baseline.H };
  }

  accentMode.value = mode;
  setTitlePrefix(mode === "music" ? "♪ " : "");
  animateTo(
    { ...gamutClampOklch(accent), aura: AURA[mode], v },
    mode === "idle" ? SETTLE_MS : DRIFT_MS,
  );
}

export function startLivingAccent() {
  if (started || !ROOT) return () => {};
  started = true;

  readBaselines();
  Object.assign(current, {
    L: baseline.L,
    C: baseline.C,
    H: baseline.H,
    aura: AURA.idle,
    v: vitalityTarget(),
  });
  frame(0, true);

  const stopWatch = watch(
    () => {
      const s = lanyardData.spotify;
      return [
        theme.value,
        lanyardData.discordStatus,
        s?.track_id || "",
        s?.album_art_url || "",
        lanyardData.editorActivity ? "1" : "0",
      ].join("|");
    },
    () => void update(),
    { immediate: true },
  );

  const onReducedChange = () => void update();
  reducedMotionMq?.addEventListener?.("change", onReducedChange);

  return () => {
    stopWatch();
    cancelAnimationFrame(rafId);
    reducedMotionMq?.removeEventListener?.("change", onReducedChange);
    started = false;
  };
}
