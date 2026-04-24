const defaults = {
  title: "Personal Website | f1sh.v.recipes",
  description: "Personal portfolio and creative space of Moli.",
  url: "https://f1sh.v.recipes",
  image: "https://f1sh.v.recipes/screenshot.png",
};

export const updateMeta = ({ title, description, url, image } = {}) => {
  const t = title || defaults.title;
  const d = description || defaults.description;
  const u = url || defaults.url;
  const img = image || defaults.image;

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

  setContent('meta[property="og:image"]', img);
  setContent('meta[name="twitter:image"]', img);
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