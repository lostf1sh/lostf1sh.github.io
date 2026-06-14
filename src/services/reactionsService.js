import { readLocalCache, writeLocalCache } from "@/utils/apiLocalCache";

const REACTED_KEY = "reactions.reacted.v1";

// Keys must match REACTIONS in functions/api/reactions/[slug].js.
export const REACTIONS = [
  { key: "fire", emoji: "🔥", label: "fire" },
  { key: "heart", emoji: "❤️", label: "love" },
  { key: "mind", emoji: "🤯", label: "mind blown" },
  { key: "eyes", emoji: "👀", label: "watching" },
];

const reactedList = () => readLocalCache(REACTED_KEY)?.value || [];
const reactedId = (slug, key) => `${slug}:${key}`;

export const hasReacted = (slug, key) => reactedList().includes(reactedId(slug, key));

const parseCounts = (data) =>
  data?.reactions && typeof data.reactions === "object" ? data.reactions : null;

export const getReactions = async (slug) => {
  try {
    const res = await fetch(`/api/reactions/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return parseCounts(await res.json());
  } catch {
    return null;
  }
};

export const addReaction = async (slug, key) => {
  if (hasReacted(slug, key)) return null;
  try {
    const res = await fetch(
      `/api/reactions/${encodeURIComponent(slug)}?key=${encodeURIComponent(key)}`,
      { method: "POST" },
    );
    if (!res.ok) return null;
    const counts = parseCounts(await res.json());
    if (counts) writeLocalCache(REACTED_KEY, [...reactedList(), reactedId(slug, key)]);
    return counts;
  } catch {
    return null;
  }
};
