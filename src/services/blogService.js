import { parseFrontmatter } from "@/utils/markdown";

const postFiles = import.meta.glob("/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const loadPosts = () => {
  const posts = [];
  let id = 1;

  Object.entries(postFiles).forEach(([filepath, content]) => {
    const { frontmatter, content: body } = parseFrontmatter(content);
    const slug = filepath.split("/").pop().replace(".md", "");

    posts.push({
      id: id++,
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || new Date().toISOString().split("T")[0],
      tags: frontmatter.tags || [],
      excerpt: frontmatter.excerpt || "",
      content: body.trim(),
    });
  });

  return posts;
};

let cache = null;

export const getAllPosts = () => {
  if (!cache) cache = loadPosts();
  return [...cache].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getPostBySlug = (slug) => {
  return getAllPosts().find((post) => post.slug === slug);
};

export const getAllTags = () => {
  const tags = new Set();
  getAllPosts().forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
