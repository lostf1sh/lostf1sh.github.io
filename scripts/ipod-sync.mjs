import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parseFile } from "music-metadata";

const AUDIO_EXTENSIONS = new Set([
    ".mp3",
    ".m4a",
    ".aac",
    ".flac",
    ".ogg",
    ".opus",
    ".wav",
    ".alac",
]);

const MAX_RECENT_PLAYS = 1000;
const MAX_TOP_ITEMS = 50;
const REQUEST_TIMEOUT_MS = 12000;

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const LIBRARY_OUTPUT = path.join(DATA_DIR, "ipod-library.json");
const PLAYS_OUTPUT = path.join(DATA_DIR, "ipod-plays.json");
const REMOTE_OUTPUT = path.join(DATA_DIR, "ipod-remote.json");

const parseArgs = () => {
    const args = process.argv.slice(2);
    const valueAfter = (flag) => {
        const index = args.indexOf(flag);
        if (index === -1 || index + 1 >= args.length) return null;
        return args[index + 1];
    };

    return {
        source:
            valueAfter("--source") ||
            valueAfter("-s") ||
            process.env.IPOD_MOUNT ||
            "",
        publish: args.includes("--publish"),
        requireGistId:
            args.includes("--require-gist-id") ||
            process.env.IPOD_REQUIRE_GIST_ID === "1",
        gistId: valueAfter("--gist-id") || process.env.IPOD_GIST_ID || "",
        gistOwner:
            valueAfter("--gist-owner") ||
            process.env.IPOD_GIST_OWNER ||
            process.env.GITHUB_USER ||
            "",
        gistToken:
            process.env.IPOD_GIST_TOKEN ||
            process.env.GITHUB_TOKEN ||
            process.env.GH_TOKEN ||
            "",
    };
};

const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
    const total = Math.round(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const remainingSeconds = total % 60;
    if (hours > 0) {
        return [hours, minutes, remainingSeconds]
            .map((value) => String(value).padStart(2, "0"))
            .join(":");
    }
    return [minutes, remainingSeconds]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
};

const normalizeTag = (value, fallback = "unknown") => {
    if (typeof value !== "string") return fallback;
    const cleaned = value.trim();
    return cleaned.length ? cleaned : fallback;
};

const normalizeDevicePath = (value = "") => {
    return value
        .replace(/\\/g, "/")
        .replace(/^\/<HDD0>\//i, "")
        .replace(/^\/+/, "");
};

const walkAudioFiles = async (directory, files = []) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === ".rockbox") continue;
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            await walkAudioFiles(absolutePath, files);
            continue;
        }
        const extension = path.extname(entry.name).toLowerCase();
        if (AUDIO_EXTENSIONS.has(extension)) {
            files.push(absolutePath);
        }
    }
    return files;
};

const parseTrack = async (filePath, sourceRoot) => {
    try {
        const metadata = await parseFile(filePath);
        const common = metadata.common || {};
        const format = metadata.format || {};
        const title = normalizeTag(common.title, path.basename(filePath));
        const artist = normalizeTag(common.artist);
        const album = normalizeTag(common.album);
        const genre = Array.isArray(common.genre)
            ? normalizeTag(common.genre[0], "unknown")
            : normalizeTag(common.genre);
        const year = Number.isInteger(common.year) ? common.year : null;
        const duration = Number.isFinite(format.duration)
            ? Math.round(format.duration)
            : null;

        return {
            path: normalizeDevicePath(path.relative(sourceRoot, filePath)),
            title,
            artist,
            album,
            genre,
            year,
            duration,
        };
    } catch {
        console.warn(`Skipping unreadable file: ${filePath}`);
        return null;
    }
};

const countBy = (items, keyFn) => {
    const counts = new Map();
    for (const item of items) {
        const key = keyFn(item);
        if (!key) continue;
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({ key, count }));
};

const parseScrobblerLine = (line) => {
    if (!line || line.startsWith("#")) return null;
    const parts = line.split("\t").map((value) => value.trim());
    if (parts.length < 3) return null;

    const artist = normalizeTag(parts[0], null);
    const album = normalizeTag(parts[1], null);
    const title = normalizeTag(parts[2], null);
    if (!artist || !title) return null;

    const numericTokens = parts
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0);
    const unixToken = numericTokens.find((value) => value > 1_000_000_000);
    const durationToken = numericTokens.find((value) => value > 5 && value < 7200);

    return {
        artist,
        album: album || "unknown",
        title,
        path: null,
        playedAt: unixToken ? new Date(unixToken * 1000).toISOString() : null,
        duration: durationToken || null,
    };
};

const inferFromPath = (relativePath) => {
    const normalized = normalizeDevicePath(relativePath);
    const segments = normalized.split("/").filter(Boolean);
    const filename = segments.at(-1) || "unknown";
    const title = filename
        .replace(/\.[^.]+$/, "")
        .replace(/^\d+\s*[.-]?\s*/, "")
        .trim();
    const album = segments.length > 1 ? segments.at(-2) : "unknown";
    const artist = segments.length > 2 ? segments.at(-3) : "unknown";
    return {
        title: normalizeTag(title, "unknown"),
        artist: normalizeTag(artist, "unknown"),
        album: normalizeTag(album, "unknown"),
    };
};

const parsePlaybackLine = (line, trackByPath, threshold) => {
    if (!line || line.startsWith("#")) return null;
    const match = line.match(/^(\d+):(\d+):(\d+):(.+)$/);
    if (!match) return null;

    const playedAtUnix = Number(match[1]);
    const elapsedMs = Number(match[2]);
    const durationMs = Number(match[3]);
    const rawPath = match[4].trim();
    const relativePath = normalizeDevicePath(rawPath);

    if (!Number.isFinite(playedAtUnix) || !Number.isFinite(elapsedMs) || !Number.isFinite(durationMs)) {
        return null;
    }

    if (durationMs <= 0) return null;
    if (elapsedMs < threshold.minMs) return null;
    if (elapsedMs < durationMs * threshold.savePct) return null;

    const mapped = trackByPath.get(relativePath);
    const inferred = inferFromPath(relativePath);

    return {
        artist: mapped?.artist || inferred.artist,
        album: mapped?.album || inferred.album,
        title: mapped?.title || inferred.title,
        path: relativePath,
        playedAt: new Date(playedAtUnix * 1000).toISOString(),
        duration: Math.round(durationMs / 1000),
    };
};

const readPlaybackThresholds = async (sourceRoot) => {
    const cfgPath = path.join(sourceRoot, ".rockbox", "rocks", "apps", "lastfm_scrobbler.cfg");
    const defaults = {
        savePct: 0.5,
        minMs: 500,
    };

    try {
        const raw = await readFile(cfgPath, "utf8");
        const savePctMatch = raw.match(/SavePct:\s*(\d+)/i);
        const minMsMatch = raw.match(/MinMs:\s*(\d+)/i);
        const parsedSavePct = savePctMatch ? Number(savePctMatch[1]) / 100 : defaults.savePct;
        const parsedMinMs = minMsMatch ? Number(minMsMatch[1]) : defaults.minMs;
        return {
            savePct: Number.isFinite(parsedSavePct) ? parsedSavePct : defaults.savePct,
            minMs: Number.isFinite(parsedMinMs) ? parsedMinMs : defaults.minMs,
        };
    } catch {
        return defaults;
    }
};

const findHistoryFile = async (sourceRoot) => {
    const candidates = [
        path.join(sourceRoot, ".rockbox", ".scrobbler.log"),
        path.join(sourceRoot, ".rockbox", "rocks", ".scrobbler.log"),
        path.join(sourceRoot, ".scrobbler.log"),
        path.join(sourceRoot, ".rockbox", "playback.log"),
    ];
    for (const candidate of candidates) {
        try {
            const fileStat = await stat(candidate);
            if (fileStat.isFile()) return candidate;
        } catch {
            // Keep trying.
        }
    }
    return null;
};

const loadPlays = async (sourceRoot, tracks) => {
    const historyFile = await findHistoryFile(sourceRoot);
    if (!historyFile) {
        return {
            sourceFile: null,
            sourceType: null,
            plays: [],
            recentPlays: [],
            topTracks: [],
            topArtists: [],
        };
    }

    const trackByPath = new Map(
        tracks.map((track) => [normalizeDevicePath(track.path), track]),
    );

    const raw = await readFile(historyFile, "utf8");
    const lines = raw.split(/\r?\n/);
    const isPlaybackLog = path.basename(historyFile).toLowerCase() === "playback.log";

    const threshold = isPlaybackLog
        ? await readPlaybackThresholds(sourceRoot)
        : { savePct: 0.5, minMs: 500 };

    const plays = lines
        .map((line) => {
            if (isPlaybackLog) {
                return parsePlaybackLine(line, trackByPath, threshold);
            }
            return parseScrobblerLine(line);
        })
        .filter(Boolean);

    const recentPlays = [...plays].reverse().slice(0, MAX_RECENT_PLAYS);
    const topTracks = countBy(plays, (play) => `${play.artist} — ${play.title}`).slice(0, MAX_TOP_ITEMS);
    const topArtists = countBy(plays, (play) => play.artist).slice(0, MAX_TOP_ITEMS);

    return {
        sourceFile: path.relative(sourceRoot, historyFile),
        sourceType: isPlaybackLog ? "playback.log" : "scrobbler.log",
        plays,
        recentPlays,
        topTracks,
        topArtists,
    };
};

const buildLibrarySummary = (tracks) => {
    const totalDurationSeconds = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
    const topArtists = countBy(tracks, (track) => track.artist).slice(0, MAX_TOP_ITEMS);
    const topAlbums = countBy(tracks, (track) => `${track.artist} — ${track.album}`).slice(0, MAX_TOP_ITEMS);
    const genreBreakdown = countBy(tracks, (track) => track.genre).slice(0, MAX_TOP_ITEMS);

    return {
        trackCount: tracks.length,
        uniqueArtists: new Set(tracks.map((track) => track.artist)).size,
        uniqueAlbums: new Set(tracks.map((track) => `${track.artist}::${track.album}`)).size,
        totalDurationSeconds,
        totalDurationFormatted: formatDuration(totalDurationSeconds),
        topArtists,
        topAlbums,
        genreBreakdown,
    };
};

const requestJson = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`GitHub API failed (${response.status}): ${text.slice(0, 300)}`);
        }
        return response.json();
    } finally {
        clearTimeout(timeoutId);
    }
};

const publishToGist = async ({
    gistId,
    gistOwner,
    gistToken,
    libraryPayload,
    playsPayload,
}) => {
    if (!gistToken) {
        throw new Error("Missing GITHUB_TOKEN/IPOD_GIST_TOKEN for publish");
    }

    const headers = {
        Authorization: `Bearer ${gistToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
    };

    const files = {
        "ipod-library.json": { content: `${JSON.stringify(libraryPayload, null, 4)}\n` },
        "ipod-plays.json": { content: `${JSON.stringify(playsPayload, null, 4)}\n` },
    };

    let finalGistId = gistId;
    let finalOwner = gistOwner;

    if (finalGistId) {
        const response = await requestJson(`https://api.github.com/gists/${finalGistId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
                description: "Rockbox iPod sync data for website",
                files,
            }),
        });
        finalOwner = finalOwner || response?.owner?.login || "";
    } else {
        const response = await requestJson("https://api.github.com/gists", {
            method: "POST",
            headers,
            body: JSON.stringify({
                description: "Rockbox iPod sync data for website",
                public: true,
                files,
            }),
        });
        finalGistId = response.id;
        finalOwner = finalOwner || response?.owner?.login || "";
    }

    if (!finalGistId || !finalOwner) {
        throw new Error("Could not resolve gist id/owner for remote URLs");
    }

    const remoteConfig = {
        enabled: true,
        provider: "github-gist",
        gistId: finalGistId,
        owner: finalOwner,
        libraryUrl: `https://gist.githubusercontent.com/${finalOwner}/${finalGistId}/raw/ipod-library.json`,
        playsUrl: `https://gist.githubusercontent.com/${finalOwner}/${finalGistId}/raw/ipod-plays.json`,
    };

    await writeFile(REMOTE_OUTPUT, `${JSON.stringify(remoteConfig, null, 4)}\n`);
    return remoteConfig;
};

const run = async () => {
    const {
        source,
        publish,
        requireGistId,
        gistId,
        gistOwner,
        gistToken,
    } = parseArgs();

    if (!source) {
        console.error("Missing iPod source path.");
        console.error("Usage: bun run ipod:sync -- --source /media/your-ipod");
        process.exit(1);
    }

    const sourceRoot = path.resolve(source);
    try {
        const sourceStat = await stat(sourceRoot);
        if (!sourceStat.isDirectory()) {
            throw new Error("Source path is not a directory");
        }
    } catch {
        console.error(`Invalid source path: ${sourceRoot}`);
        process.exit(1);
    }

    console.log(`Scanning audio files from: ${sourceRoot}`);
    const audioFiles = await walkAudioFiles(sourceRoot);
    console.log(`Found ${audioFiles.length} audio files.`);

    const tracks = [];
    for (const filePath of audioFiles) {
        const parsed = await parseTrack(filePath, sourceRoot);
        if (parsed) tracks.push(parsed);
    }

    const librarySummary = buildLibrarySummary(tracks);
    const playsResult = await loadPlays(sourceRoot, tracks);

    if (publish && !playsResult.sourceType) {
        throw new Error(
            "No playback history file detected (.scrobbler.log/playback.log). Aborting publish.",
        );
    }

    const generatedAt = new Date().toISOString();
    const libraryPayload = {
        generatedAt,
        sourceRoot,
        summary: librarySummary,
        tracks,
    };

    const playsPayload = {
        generatedAt,
        sourceRoot,
        sourceFile: playsResult.sourceFile,
        sourceType: playsResult.sourceType,
        summary: {
            playCount: playsResult.plays.length,
            trackedSessions: playsResult.recentPlays.length,
        },
        topTracks: playsResult.topTracks,
        topArtists: playsResult.topArtists,
        recentPlays: playsResult.recentPlays,
    };

    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(LIBRARY_OUTPUT, `${JSON.stringify(libraryPayload, null, 4)}\n`);
    await writeFile(PLAYS_OUTPUT, `${JSON.stringify(playsPayload, null, 4)}\n`);

    console.log(`Wrote library data: ${path.relative(ROOT_DIR, LIBRARY_OUTPUT)}`);
    console.log(`Wrote play data: ${path.relative(ROOT_DIR, PLAYS_OUTPUT)}`);
    console.log(
        `Detected play source: ${playsResult.sourceType || "none"} (${playsResult.plays.length} entries)`,
    );

    if (publish) {
        if (requireGistId && !gistId) {
            throw new Error("Missing gist id (IPOD_GIST_ID) while require-gist-id is enabled");
        }
        console.log("Publishing to GitHub Gist...");
        const remoteConfig = await publishToGist({
            gistId,
            gistOwner,
            gistToken,
            libraryPayload,
            playsPayload,
        });
        console.log(
            `Published gist ${remoteConfig.gistId}. Remote config: ${path.relative(
                ROOT_DIR,
                REMOTE_OUTPUT,
            )}`,
        );
    }

    console.log("Sync complete.");
};

run().catch((error) => {
    console.error("Sync failed:", error);
    process.exit(1);
});
