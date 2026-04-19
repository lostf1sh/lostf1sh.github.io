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

const tokenize = (value) => {
  return (value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
};

const keywordSet = (post) => {
  const words = [
    ...tokenize(post.title),
    ...tokenize(post.excerpt),
    ...post.tags.map((tag) => tag.toLowerCase()),
  ];
  return new Set(words);
};

export const getRelatedPosts = (slug, limit = 3) => {
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((post) => post.slug === slug);
  if (!currentPost) return [];

  const currentTags = new Set(currentPost.tags.map((tag) => tag.toLowerCase()));
  const currentKeywords = keywordSet(currentPost);

  const scored = allPosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const postTags = new Set(post.tags.map((tag) => tag.toLowerCase()));
      const postKeywords = keywordSet(post);

      let sharedTags = 0;
      currentTags.forEach((tag) => {
        if (postTags.has(tag)) sharedTags += 1;
      });

      let sharedKeywords = 0;
      currentKeywords.forEach((word) => {
        if (postKeywords.has(word)) sharedKeywords += 1;
      });

      return {
        post,
        score: sharedTags * 5 + sharedKeywords,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date) - new Date(a.post.date);
    });

  const withSignal = scored.filter((item) => item.score > 0).slice(0, limit).map((item) => item.post);
  if (withSignal.length >= limit) return withSignal;

  const fallback = scored
    .filter((item) => !withSignal.some((post) => post.slug === item.post.slug))
    .slice(0, limit - withSignal.length)
    .map((item) => item.post);

  return [...withSignal, ...fallback];
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
