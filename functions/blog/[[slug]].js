const escapeHtml = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let manifestPromise = null;

const getManifest = (request, env) => {
  manifestPromise ??= env.ASSETS.fetch(new URL("/posts-manifest.json", request.url))
    .then((res) => (res.ok ? res.json() : []))
    .catch(() => {
      manifestPromise = null;
      return [];
    });
  return manifestPromise;
};

const setContent = (value) => ({ element: (el) => el.setAttribute("content", value) });

export const onRequest = async ({ request, env }) => {
  const asset = await env.ASSETS.fetch(request);
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/blog\/([a-z0-9-]+)\/?$/);
  if (!match) return asset;

  const post = (await getManifest(request, env)).find((p) => p.slug === match[1]);
  if (!post) return asset;

  const title = `${post.title} | moli.codes`;
  const pageUrl = `${url.origin}/blog/${post.slug}`;
  const imageUrl = `${url.origin}/og/${post.slug}.png`;
  const metaTags = {
    'meta[name="title"]': title,
    'meta[property="og:title"]': title,
    'meta[name="twitter:title"]': title,
    'meta[name="description"]': post.excerpt,
    'meta[property="og:description"]': post.excerpt,
    'meta[name="twitter:description"]': post.excerpt,
    'meta[property="og:url"]': pageUrl,
    'meta[name="twitter:url"]': pageUrl,
    'meta[property="og:type"]': "article",
    'meta[property="og:image"]': imageUrl,
    'meta[name="twitter:image"]': imageUrl,
  };

  const rewriter = new HTMLRewriter()
    .on("title", { element: (el) => el.setInnerContent(title) })
    .on('link[rel="canonical"]', { element: (el) => el.setAttribute("href", pageUrl) })
    .on("head", {
      element: (el) =>
        el.append(
          `<meta property="article:published_time" content="${escapeHtml(post.date)}">` +
            post.tags.map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}">`).join(""),
          { html: true },
        ),
    });

  return Object.entries(metaTags)
    .reduce((r, [selector, value]) => r.on(selector, setContent(value)), rewriter)
    .transform(asset);
};
