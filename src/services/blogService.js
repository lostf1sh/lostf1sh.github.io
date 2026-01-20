const postFiles = import.meta.glob("/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const parseFrontmatter = (content) => {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

  if (!match) return { frontmatter: {}, content };

  const [, frontmatterText, bodyContent] = match;
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
    } else {
      frontmatter[key.trim()] = value;
    }
  });

  return { frontmatter, content: bodyContent };
};

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
