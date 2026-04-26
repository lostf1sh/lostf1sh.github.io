import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const BASE_URL = "https://f1sh.v.recipes";

const escapeXml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const parseFrontmatter = (content) => {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const [, frontmatterText, body] = match;
  const frontmatter = {};

  frontmatterText.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) return;

    const value = rest.join(":").trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      frontmatter[key.trim()] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim());
      return;
    }

    frontmatter[key.trim()] = value;
  });

  return { frontmatter, body: body.trim() };
};

export const getPosts = async (rootDir) => {
  const postsDir = path.join(rootDir, "posts");
  const files = await readdir(postsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const posts = await Promise.all(
    markdownFiles.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(postsDir, file);
      const content = await readFile(filePath, "utf8");
      const { frontmatter, body } = parseFrontmatter(content);

      const excerpt = frontmatter.excerpt || body.slice(0, 180).replace(/\s+/g, " ").trim();

      return {
        slug,
        title: frontmatter.title || slug,
        excerpt,
        date: frontmatter.date || new Date().toISOString().split("T")[0],
      };
    }),
  );

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const buildRss = (posts) => {
  const items = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`;
      return `\n    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(url)}</link>\n      <guid>${escapeXml(url)}</guid>\n      <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n      <description>${escapeXml(post.excerpt)}</description>\n    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>f1sh.v.recipes blog</title>\n    <link>${BASE_URL}/blog</link>\n    <description>Thoughts on code, tools, and random stuff.</description>\n    <language>en-us</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}\n  </channel>\n</rss>\n`;
};

export const buildSitemap = (posts) => {
  const staticPages = ["/", "/blog", "/projects", "/now", "/uses"];
  const staticEntries = staticPages
    .map(
      (route) =>
        `\n  <url>\n    <loc>${escapeXml(`${BASE_URL}${route}`)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === "/" ? "1.0" : "0.8"}</priority>\n  </url>`,
    )
    .join("");

  const postEntries = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`;
      return `\n  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${post.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticEntries}${postEntries}\n</urlset>\n`;
};

export const buildRobots = () => {
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
};

export const generateSeoAssets = async (rootDir, outDir) => {
  const posts = await getPosts(rootDir);

  await writeFile(path.join(outDir, "rss.xml"), buildRss(posts), "utf8");
  await writeFile(path.join(outDir, "sitemap.xml"), buildSitemap(posts), "utf8");
  await writeFile(path.join(outDir, "robots.txt"), buildRobots(), "utf8");
};

export const renderSeoAssets = async (rootDir) => {
  const posts = await getPosts(rootDir);

  return {
    "rss.xml": buildRss(posts),
    "sitemap.xml": buildSitemap(posts),
    "robots.txt": buildRobots(),
  };
};
