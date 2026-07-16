const PREFIX = "f1sh.api.";

// While a cached row is younger than this, components skip revalidation
// entirely instead of refetching on every mount/navigation.
export const CACHE_TTL_MS = 10 * 60 * 1000;

export const CACHE_KEYS = {
  GITHUB_REPOS: "github.repos.merged.v1",
  GITHUB_CONTRIBUTIONS: "github.contributions.v1",
  LASTFM_TRACKS: "lastfm.recent.v1",
  LASTFM_TOP: "lastfm.top.v1",
  GITHUB_EVENTS: "github.events.v1",
  GITHUB_STATS: "github.stats.v1",
};

function canUseStorage() {
  return typeof localStorage !== "undefined";
}

export function readLocalCache(key) {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { v, t } = JSON.parse(raw);
    return { value: v, storedAt: t, fresh: Date.now() - t < CACHE_TTL_MS };
  } catch {
    return null;
  }
}

export function writeLocalCache(key, value) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(
      PREFIX + key,
      JSON.stringify({ v: value, t: Date.now() }),
    );
  } catch {
  }
}

const SESSION_PREFIX = "f1sh.sess.";

export function readSessionCache(key) {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_PREFIX + key);
    if (!raw) return null;
    const { v, t } = JSON.parse(raw);
    return { value: v, storedAt: t };
  } catch {
    return null;
  }
}

export function writeSessionCache(key, value) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(
      SESSION_PREFIX + key,
      JSON.stringify({ v: value, t: Date.now() }),
    );
  } catch {
  }
}
