import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getPosts } from "./posts.mjs";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const fontsDir = path.join(rootDir, "scripts", "og-fonts");
const outDir = path.join(rootDir, "dist", "og");

const WIDTH = 1200;
const HEIGHT = 630;

const ink = {
  crust: "#0a0a0a",
  surface: "#1c1c1c",
  subtle: "#999999",
  text: "#e0e0e0",
  mint: "#4ec9a0",
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const titleSize = (title) => (title.length > 70 ? 52 : title.length > 40 ? 60 : 68);

const el = (style, children) => ({ type: "div", props: { style, children } });

const card = ({ kicker, title, footerLeft, footerRight }) =>
  el(
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      backgroundColor: ink.crust,
      border: `1px solid ${ink.surface}`,
      fontFamily: "Geist",
      position: "relative",
      overflow: "hidden",
    },
    [
      el({
        position: "absolute",
        top: "-260px",
        right: "-200px",
        width: "640px",
        height: "640px",
        borderRadius: "9999px",
        backgroundImage: "radial-gradient(circle, rgba(78, 201, 160, 0.16) 0%, rgba(78, 201, 160, 0) 70%)",
      }),
      el({ display: "flex", fontSize: "30px", fontWeight: 600, color: ink.mint }, kicker),
      el(
        {
          display: "flex",
          fontSize: `${titleSize(title)}px`,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: ink.text,
          maxWidth: "980px",
        },
        title,
      ),
      el(
        { display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "27px", color: ink.subtle },
        [
          el({ display: "flex" }, footerLeft),
          el({ display: "flex", color: ink.mint, opacity: 0.8 }, footerRight),
        ],
      ),
    ],
  );

const [regular, semibold] = await Promise.all([
  readFile(path.join(fontsDir, "geist-400.ttf")),
  readFile(path.join(fontsDir, "geist-600.ttf")),
]);

const fonts = [
  { name: "Geist", data: regular, weight: 400, style: "normal" },
  { name: "Geist", data: semibold, weight: 600, style: "normal" },
];

const renderPng = async (node) => {
  const svg = await satori(node, { width: WIDTH, height: HEIGHT, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
};

await mkdir(outDir, { recursive: true });

const posts = await getPosts(rootDir);
for (const post of posts) {
  const png = await renderPng(
    card({
      kicker: "moli.codes",
      title: post.title,
      footerLeft: `${formatDate(post.date)} · ${post.readingTime} min read`,
      footerRight: post.tags.slice(0, 3).map((tag) => `#${tag}`).join("  "),
    }),
  );
  await writeFile(path.join(outDir, `${post.slug}.png`), png);
}

await writeFile(
  path.join(outDir, "default.png"),
  await renderPng(
    card({
      kicker: "moli.codes",
      title: "developer, blog & portfolio",
      footerLeft: "projects · writing · live status · music",
      footerRight: "@lostf1sh",
    }),
  ),
);

console.log(`og: wrote ${posts.length + 1} cards to dist/og/`);

const SITE = "https://moli.codes";
const staticRoutes = ["/", "/blog", "/projects", "/now", "/colophon"];
const urls = [
  ...staticRoutes.map((route) => ({ loc: `${SITE}${route}` })),
  ...posts.map((post) => ({ loc: `${SITE}/blog/${post.slug}`, lastmod: new Date(post.date).toISOString().slice(0, 10) })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(({ loc, lastmod }) => `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
  .join("\n")}\n</urlset>\n`;
await writeFile(path.join(rootDir, "dist", "sitemap.xml"), sitemap);

const llms = `# moli.codes

> Personal site of moli (lostf1sh) — developer from Turkey. Small tools, web experiments, and a blog about what they learn.

## Pages

- [Home](${SITE}/): live status, now playing, quick links
- [Blog](${SITE}/blog): all posts
- [Projects](${SITE}/projects): selected work
- [Now](${SITE}/now): what moli is up to right now
- [Colophon](${SITE}/colophon): how this site is built

## Posts

${posts.map((post) => `- [${post.title}](${SITE}/blog/${post.slug}): ${post.excerpt}`.trimEnd()).join("\n")}
`;
await writeFile(path.join(rootDir, "dist", "llms.txt"), llms);

console.log(`seo: wrote sitemap.xml (${urls.length} urls) and llms.txt`);
