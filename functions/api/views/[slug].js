const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

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

export const onRequest = async ({ request, env, params }) => {
  const slug = typeof params.slug === "string" ? params.slug : "";
  if (!/^[a-z0-9-]{1,128}$/.test(slug)) return json({ error: "bad slug" }, 400);
  if (!env.VIEWS) return json({ error: "views not configured" }, 503);
  if (!(await getSlugs(request, env)).has(slug)) return json({ error: "unknown post" }, 404);

  const key = `views:${slug}`;
  const current = Number(await env.VIEWS.get(key)) || 0;

  if (request.method === "GET") return json({ views: current });
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

  await env.VIEWS.put(key, String(current + 1));
  return json({ views: current + 1 });
};
