const defaults = {
  title: "moli - developer, blog & portfolio",
  description: "moli's personal site: projects, blog posts, live status, music, and developer notes.",
  url: "https://moli.codes",
  image: "https://moli.codes/og/default.png",
};

let titlePrefix = "";
let currentTitle = defaults.title;

export const setTitlePrefix = (prefix) => {
  titlePrefix = prefix || "";
  document.title = titlePrefix + currentTitle;
};

export const updateMeta = ({ title, description, url, image } = {}) => {
  const t = title || defaults.title;
  const d = description || defaults.description;
  const u = url || defaults.url;
  const img = image || defaults.image;

  currentTitle = t;
  document.title = titlePrefix + t;

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