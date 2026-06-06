const defaults = {
  title: "moli — developer blog & terminal portfolio",
  description: "moli's terminal-styled personal site: projects, blog posts, live status, music, and developer notes.",
  url: "https://moli.codes",
};

export const updateMeta = ({ title, description, url, image } = {}) => {
  const t = title || defaults.title;
  const d = description || defaults.description;
  const u = url || defaults.url;
  const img = image || null;

  document.title = t;

  const setContent = (selector, value) => {
    document.querySelector(selector)?.setAttribute("content", value);
  };

  setContent('meta[name="title"]', t);
  setContent('meta[property="og:title"]', t);
  setContent('meta[name="twitter:title"]', t);

  setContent('meta[name="description"]', d);
  setContent('meta[property="og:description"]', d);
  setContent('meta[name="twitter:description"]', d);

  setContent('meta[property="og:url"]', u);
  setContent('meta[name="twitter:url"]', u);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", u);

  const removeMeta = (selector) => {
    document.querySelector(selector)?.remove();
  };

  if (img) {
    setContent('meta[property="og:image"]', img);
    setContent('meta[name="twitter:image"]', img);
  } else {
    removeMeta('meta[property="og:image"]');
    removeMeta('meta[property="og:image:alt"]');
    removeMeta('meta[property="og:image:width"]');
    removeMeta('meta[property="og:image:height"]');
    removeMeta('meta[name="twitter:image"]');
    removeMeta('meta[name="twitter:image:alt"]');
  }
};

export const setJsonLd = (id, data) => {
  const scriptId = `jsonld-${id}`;
  let script = document.getElementById(scriptId);

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
};

export const removeJsonLd = (id) => {
  const script = document.getElementById(`jsonld-${id}`);
  if (script) script.remove();
};