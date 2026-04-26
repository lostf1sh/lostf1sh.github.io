import path from "node:path";
import process from "node:process";

import { generateSeoAssets } from "./seo-assets.mjs";

const ROOT = process.cwd();

generateSeoAssets(ROOT, path.join(ROOT, "dist"))
  .then(() => {
    console.log("Generated RSS, sitemap, and robots files.");
  })
  .catch((error) => {
    console.error("Failed to generate SEO assets:", error);
    process.exit(1);
  });
