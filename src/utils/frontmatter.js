export const parseFrontmatter = (content) => {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, content };

    const [, frontmatterText, bodyContent] = match;
    const frontmatter = {};

    frontmatterText.split("\n").forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) return;
        const value = rest.join(":").trim();
        frontmatter[key.trim()] = value.startsWith("[") && value.endsWith("]")
            ? value.slice(1, -1).split(",").map((item) => item.trim())
            : value;
    });

    return { frontmatter, content: bodyContent };
};
