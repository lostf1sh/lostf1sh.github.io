const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

// Keep in sync with REACTIONS in src/services/reactionsService.js.
const REACTIONS = ["fire", "heart", "mind", "eyes"];

let slugsPromise = null;

const getSlugs = (request, env) => {
  slugsPromise ??= env.ASSETS.fetch(new URL("/posts-manifest.json", request.url))
    .then((res) => (res.ok ? res.json() : []))
    .then((posts) => new Set(posts.map((post) => post.slug)))
    .catch(() => {
      slugsPromise = null;
      return new Set();
    });
  return slugsPromise;
};

const emptyCounts = () => Object.fromEntries(REACTIONS.map((key) => [key, 0]));

const readCounts = async (env, key) => {
  const counts = emptyCounts();
  const stored = await env.VIEWS.get(key, "json");
  if (stored && typeof stored === "object") {
    for (const reaction of REACTIONS) {
      if (Number.isFinite(stored[reaction])) counts[reaction] = stored[reaction];
    }
  }
  return counts;
};

export const onRequest = async ({ request, env, params }) => {
  const slug = typeof params.slug === "string" ? params.slug : "";
  if (!/^[a-z0-9-]{1,128}$/.test(slug)) return json({ error: "bad slug" }, 400);
  if (!env.VIEWS) return json({ error: "reactions not configured" }, 503);
  if (!(await getSlugs(request, env)).has(slug)) return json({ error: "unknown post" }, 404);

  const key = `reactions:${slug}`;
  const counts = await readCounts(env, key);

  if (request.method === "GET") return json({ reactions: counts });
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

  const reaction = new URL(request.url).searchParams.get("key");
  if (!REACTIONS.includes(reaction)) return json({ error: "bad reaction" }, 400);

  counts[reaction] += 1;
  await env.VIEWS.put(key, JSON.stringify(counts));
  return json({ reactions: counts });
};
