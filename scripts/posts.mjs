import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const parseFrontmatter = (content) => {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const [, frontmatterText, body] = match;
  const frontmatter = {};

  frontmatterText.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) return;
    const value = rest.join(":").trim();
    frontmatter[key.trim()] = value.startsWith("[") && value.endsWith("]")
      ? value.slice(1, -1).split(",").map((item) => item.trim())
      : value;
  });

  return { frontmatter, body: body.trim() };
};

const readingTime = (body) => {
  const words = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const getPosts = async (rootDir) => {
  const postsDir = path.join(rootDir, "posts");
  const files = (await readdir(postsDir)).filter((file) => file.endsWith(".md"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(path.join(postsDir, file), "utf8");
      const { frontmatter, body } = parseFrontmatter(content);

      return {
        slug: file.replace(/\.md$/, ""),
        title: frontmatter.title || file.replace(/\.md$/, ""),
        excerpt: frontmatter.excerpt || body.slice(0, 180).replace(/\s+/g, " ").trim(),
        date: frontmatter.date || new Date().toISOString().split("T")[0],
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        readingTime: readingTime(body),
      };
    }),
  );

  return posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((post, index) => ({ id: index + 1, ...post }));
};
