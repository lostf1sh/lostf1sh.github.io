import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BASE_URL = "https://f1sh.dev";
const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "posts");
const PUBLIC_DIR = path.join(ROOT, "public");

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

const getPosts = async () => {
  const files = await readdir(POSTS_DIR);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const posts = await Promise.all(
    markdownFiles.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(POSTS_DIR, file);
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

const buildRss = (posts) => {
  const items = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`;
      return `\n    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(url)}</link>\n      <guid>${escapeXml(url)}</guid>\n      <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n      <description>${escapeXml(post.excerpt)}</description>\n    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>f1sh.dev blog</title>\n    <link>${BASE_URL}/blog</link>\n    <description>Thoughts on code, tools, and random stuff.</description>\n    <language>en-us</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}\n  </channel>\n</rss>\n`;
};

const buildSitemap = (posts) => {
  const staticPages = ["/", "/blog", "/projects", "/now"];
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

const buildRobots = () => {
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
};

async function run() {
  const posts = await getPosts();

  await writeFile(path.join(PUBLIC_DIR, "rss.xml"), buildRss(posts), "utf8");
  await writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), buildSitemap(posts), "utf8");
  await writeFile(path.join(PUBLIC_DIR, "robots.txt"), buildRobots(), "utf8");

  console.log("Generated RSS, sitemap, and robots files.");
}

run().catch((error) => {
  console.error("Failed to generate SEO assets:", error);
  process.exit(1);
});
