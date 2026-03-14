import { Marked } from "marked";

export const parseFrontmatter = (content) => {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, content };

    const [, frontmatterText, bodyContent] = match;
    const frontmatter = {};

    frontmatterText.split("\n").forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) return;
        const value = rest.join(":").trim();
        if (value.startsWith("[") && value.endsWith("]")) {
            frontmatter[key.trim()] = value.slice(1, -1).split(",").map((item) => item.trim());
        } else {
            frontmatter[key.trim()] = value;
        }
    });

    return { frontmatter, content: bodyContent };
};

const slugify = (text) => {
    return text
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
};

let codeBlockCounter = 0;

export const marked = new Marked({
    renderer: {
        heading({ tokens, depth }) {
            const text = this.parser.parseInline(tokens);
            const id = slugify(text);
            const classes = {
                1: "text-2xl font-bold text-catppuccin-text mt-8 mb-4",
                2: "text-xl font-semibold text-catppuccin-blue mt-8 mb-4",
                3: "text-lg font-semibold text-catppuccin-mauve mt-6 mb-3",
            };
            return `<h${depth} id="${id}" class="${classes[depth] || ''}">${text}</h${depth}>`;
        },
        paragraph({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<p class="text-catppuccin-text leading-relaxed mb-4">${text}</p>`;
        },
        link({ href, tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-catppuccin-blue hover:text-catppuccin-mauve underline transition-colors">${text}</a>`;
        },
        image({ href, text }) {
            return `<img src="${href}" alt="${text}" class="rounded border border-catppuccin-surface my-4 max-w-full">`;
        },
        code({ text, lang }) {
            const id = `code-block-${codeBlockCounter++}`;
            const languageClass = lang ? `language-${lang.toLowerCase()}` : "";
            const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            return `<div class="relative group">
                <button data-copy-target="${id}" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-catppuccin-subtle hover:text-catppuccin-mauve px-2 py-1 bg-catppuccin-crust border border-catppuccin-surface rounded hover:bg-catppuccin-mauve/10 cursor-pointer z-10">copy</button>
                <pre class="bg-catppuccin-surface/50 border border-catppuccin-overlay/30 rounded p-4 overflow-x-auto my-4"><code id="${id}" class="${languageClass}">${escaped}</code></pre>
            </div>`;
        },
        codespan({ text }) {
            return `<code class="bg-catppuccin-surface/50 px-2 py-0.5 rounded text-catppuccin-pink text-sm">${text}</code>`;
        },
        blockquote({ tokens }) {
            const body = this.parser.parse(tokens);
            return `<blockquote class="border-l-2 border-catppuccin-mauve pl-4 my-4 text-catppuccin-subtle italic">${body}</blockquote>`;
        },
        list({ items, ordered }) {
            const tag = ordered ? "ol" : "ul";
            const listClass = ordered ? "list-decimal" : "list-disc";
            const inner = items.map(item => {
                const text = this.parser.parse(item.tokens);
                return `<li class="ml-6 ${listClass} text-catppuccin-text mb-1">${text}</li>`;
            }).join("");
            return `<${tag} class="my-4">${inner}</${tag}>`;
        },
        table({ header, rows }) {
            let html = '<table class="w-full my-4 text-sm border-collapse"><thead><tr>';
            header.forEach(cell => {
                const text = this.parser.parseInline(cell.tokens);
                html += `<th class="border border-catppuccin-surface px-3 py-2 text-left text-catppuccin-mauve bg-catppuccin-surface/30">${text}</th>`;
            });
            html += '</tr></thead><tbody>';
            rows.forEach(row => {
                html += '<tr>';
                row.forEach(cell => {
                    const text = this.parser.parseInline(cell.tokens);
                    html += `<td class="border border-catppuccin-surface px-3 py-2 text-catppuccin-text">${text}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table>';
            return html;
        },
        hr() {
            return '<hr class="border-catppuccin-surface my-6">';
        },
        strong({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<strong class="text-catppuccin-mauve font-semibold">${text}</strong>`;
        },
        em({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<em class="text-catppuccin-peach italic">${text}</em>`;
        },
    },
});

export const renderMarkdown = (content) => {
    codeBlockCounter = 0;
    return marked.parse(content);
};
