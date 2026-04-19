const defaults = {
  title: "Personal Website | f1sh.dev",
  description: "Personal portfolio and creative space of Moli, showcasing projects, photography, and digital experiences.",
  url: "https://f1sh.dev",
};

export const updateMeta = ({ title, description, url } = {}) => {
  const t = title || defaults.title;
  const d = description || defaults.description;
  const u = url || defaults.url;

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
