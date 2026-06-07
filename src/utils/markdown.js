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

const escapeAttribute = (text) => text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

let codeBlockCounter = 0;

const marked = new Marked({
    renderer: {
        heading({ tokens, depth }) {
            const text = this.parser.parseInline(tokens);
            const id = slugify(text);
            const plainText = text.replace(/<[^>]+>/g, "").trim();
            const classes = {
                1: "text-2xl font-semibold text-ink-text mt-8 mb-4",
                2: "text-xl font-semibold text-ink-text mt-8 mb-4",
                3: "text-lg font-medium text-ink-text mt-6 mb-3",
            };
            return `<h${depth} id="${id}" data-heading-text="${escapeAttribute(plainText)}" class="${classes[depth] || ""}">${text}<a href="#${id}" class="heading-anchor no-external" aria-label="Link to ${escapeAttribute(plainText)}">#</a></h${depth}>`;
        },
        paragraph({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<p class="text-ink-text leading-relaxed mb-4">${text}</p>`;
        },
        link({ href, tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-ink-text underline decoration-ink-subtle/40 underline-offset-2 hover:text-ink-mint hover:decoration-ink-mint transition-colors">${text}</a>`;
        },
        image({ href, text }) {
            return `<img src="${href}" alt="${text}" loading="lazy" class="border border-ink-surface my-4 max-w-full h-auto">`;
        },
        code({ text, lang }) {
            const id = `code-block-${codeBlockCounter++}`;
            const languageClass = lang ? `language-${lang.toLowerCase()}` : "";
            const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            return `<div class="relative group">
                <button data-copy-target="${id}" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-ink-subtle hover:text-ink-mint px-2 py-1 bg-ink-crust border border-ink-surface cursor-pointer z-10">copy</button>
                <pre class="bg-ink-surface/40 border border-ink-surface p-4 overflow-x-auto my-4"><code id="${id}" class="${languageClass}">${escaped}</code></pre>
            </div>`;
        },
        codespan({ text }) {
            return `<code class="bg-ink-surface/50 px-1.5 py-0.5 text-ink-text text-[0.9em]">${text}</code>`;
        },
        blockquote({ tokens }) {
            const body = this.parser.parse(tokens);
            return `<blockquote class="border-l-2 border-ink-mint/60 pl-4 my-4 text-ink-subtle italic">${body}</blockquote>`;
        },
        list({ items, ordered }) {
            const tag = ordered ? "ol" : "ul";
            const listClass = ordered ? "list-decimal" : "list-disc";
            const inner = items.map(item => {
                const text = this.parser.parse(item.tokens);
                return `<li class="ml-6 ${listClass} text-ink-text mb-1">${text}</li>`;
            }).join("");
            return `<${tag} class="my-4">${inner}</${tag}>`;
        },
        table({ header, rows }) {
            let html = '<table class="w-full my-4 text-sm border-collapse"><thead><tr>';
            header.forEach(cell => {
                const text = this.parser.parseInline(cell.tokens);
                html += `<th class="border border-ink-surface px-3 py-2 text-left text-ink-text font-medium bg-ink-surface/30">${text}</th>`;
            });
            html += '</tr></thead><tbody>';
            rows.forEach(row => {
                html += '<tr>';
                row.forEach(cell => {
                    const text = this.parser.parseInline(cell.tokens);
                    html += `<td class="border border-ink-surface px-3 py-2 text-ink-text">${text}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table>';
            return html;
        },
        hr() {
            return '<hr class="border-ink-surface my-6">';
        },
        strong({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<strong class="text-ink-text font-semibold">${text}</strong>`;
        },
        em({ tokens }) {
            const text = this.parser.parseInline(tokens);
            return `<em class="italic">${text}</em>`;
        },
    },
});

export const renderMarkdown = (content) => {
    codeBlockCounter = 0;
    return marked.parse(content);
};
