import { access, copyFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DIST_DIR = path.join(process.cwd(), "dist");
const INDEX_FILE = path.join(DIST_DIR, "index.html");
const FALLBACK_FILE = path.join(DIST_DIR, "404.html");

async function run() {
    try {
        await access(INDEX_FILE);
    } catch {
        console.warn("Skipping SPA fallback copy: dist/index.html not found.");
        return;
    }

    await copyFile(INDEX_FILE, FALLBACK_FILE);
    console.log("Created GitHub Pages SPA fallback: dist/404.html");
}

run().catch((error) => {
    console.error("Failed to create SPA fallback page:", error);
    process.exit(1);
});
