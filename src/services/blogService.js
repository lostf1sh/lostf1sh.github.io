import { posts as manifest } from "virtual:posts-manifest";
import { parseFrontmatter } from "@/utils/frontmatter";

const bodyLoaders = import.meta.glob("/posts/*.md", {
  query: "?raw",
  import: "default",
});

export const getAllPosts = () => manifest;

export const getPostBySlug = async (slug) => {
  const meta = manifest.find((post) => post.slug === slug);
  const loadBody = bodyLoaders[`/posts/${slug}.md`];
  if (!meta || !loadBody) return null;

  const { content } = parseFrontmatter(await loadBody());
  return { ...meta, content: content.trim() };
};

const tokenize = (value) =>
  (value || "").toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);

const keywordSet = (post) =>
  new Set([...tokenize(post.title), ...tokenize(post.excerpt), ...post.tags.map((tag) => tag.toLowerCase())]);

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
      const score =
        [...currentTags].filter((tag) => postTags.has(tag)).length * 5 +
        [...currentKeywords].filter((word) => postKeywords.has(word)).length;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date));

  const withSignal = scored.filter((item) => item.score > 0).slice(0, limit).map((item) => item.post);
  if (withSignal.length >= limit) return withSignal;

  const fallback = scored
    .filter((item) => !withSignal.includes(item.post))
    .slice(0, limit - withSignal.length)
    .map((item) => item.post);

  return [...withSignal, ...fallback];
};

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
