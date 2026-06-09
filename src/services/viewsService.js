import { readSessionCache, writeSessionCache } from "@/utils/apiLocalCache";

const COUNTED_KEY = "views.counted.v1";

export const recordView = async (slug) => {
  try {
    const counted = readSessionCache(COUNTED_KEY)?.value || [];
    const alreadyCounted = counted.includes(slug);

    const res = await fetch(`/api/views/${encodeURIComponent(slug)}`, {
      method: alreadyCounted ? "GET" : "POST",
    });
    if (!res.ok) return null;
    if (!alreadyCounted) writeSessionCache(COUNTED_KEY, [...counted, slug]);

    const data = await res.json();
    return typeof data.views === "number" ? data.views : null;
  } catch {
    return null;
  }
};
