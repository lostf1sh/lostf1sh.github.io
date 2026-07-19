<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { motion } from "motion-v";

import { lanyardData } from "@/services/lanyardService";
import { getAllPosts } from "@/services/blogService";
import { markReady } from "@/services/preloader";
import { staggerContainer, fadeUp } from "@/utils/motion";
import NowPlaying from "@/components/NowPlaying.vue";
import EightyEightButtons from "@/components/EightyEightButtons.vue";

const isOnline = computed(() => lanyardData.discordStatus === "online");

const statusText = computed(() => {
    switch (lanyardData.discordStatus) {
        case "online": return "online";
        case "idle": return "idle";
        case "dnd": return "busy";
        default: return "offline";
    }
});

const editor = computed(() => {
    const a = lanyardData.editorActivity;
    if (!a?.name) return null;
    const name =
        a.name === "Zed"
            ? "zed"
            : a.name === "Visual Studio Code" || a.name === "Code"
              ? "vs code"
              : a.name.toLowerCase();
    const file = (a.state || "").replace(/^(working on|editing|in)\s+/i, "").trim();
    return file ? `${name} · ${file}` : name;
});

const statusLine = computed(() => editor.value || statusText.value);

const statusColor = computed(() => {
    switch (lanyardData.discordStatus) {
        case "online": return "rgb(var(--color-mint))";
        case "idle": return "rgb(var(--color-yellow))";
        case "dnd": return "rgb(var(--color-red))";
        default: return "rgb(var(--color-subtle) / 0.55)";
    }
});

const latestPost = computed(() => getAllPosts()[0] || null);

const BIRTH_INSTANT_MS = Date.UTC(2008, 5, 6, 1, 0, 0) - 3 * 3600 * 1000;
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

const units = [
    { key: "years", per: MS_PER_YEAR, dp: 8 },
    { key: "days", per: 86_400_000, dp: 5 },
    { key: "hours", per: 3_600_000, dp: 4 },
    { key: "minutes", per: 60_000, dp: 2 },
];
const unitIndex = ref(0);
const elapsedMs = ref(Date.now() - BIRTH_INSTANT_MS);

const ageValue = computed(() => {
    const u = units[unitIndex.value];
    return (elapsedMs.value / u.per).toFixed(u.dp);
});
const ageUnit = computed(() => units[unitIndex.value].key);
const cycleUnit = () => { unitIndex.value = (unitIndex.value + 1) % units.length; };

let ageRafId = 0;
const tickAge = () => {
    elapsedMs.value = Date.now() - BIRTH_INSTANT_MS;
    ageRafId = window.requestAnimationFrame(tickAge);
};

const kbHint = computed(() => {
    const mac = typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
    return mac ? "⌘K" : "Ctrl K";
});

const heroContainer = staggerContainer(0.08);

// Redaction legibility ladder — index 0 is clean, last is fully redacted.
// Hold on the name walks down the ladder; release walks back up.
const REDACTION_LADDER = [
    '"Redaction"',
    '"Redaction 10"',
    '"Redaction 20"',
    '"Redaction 35"',
    '"Redaction 50"',
    '"Redaction 70"',
    '"Redaction 100"',
];
const redactStage = ref(0);
const nameFont = computed(() => `${REDACTION_LADDER[redactStage.value]}, serif`);

let redactTimer = 0;

const stepRedact = (dir, delay) => {
    window.clearTimeout(redactTimer);
    const next = redactStage.value + dir;
    if (next < 0 || next >= REDACTION_LADDER.length) return;
    redactTimer = window.setTimeout(() => {
        redactStage.value = next;
        stepRedact(dir, delay);
    }, delay);
};

const startRedact = () => stepRedact(1, 130);
const stopRedact = () => stepRedact(-1, 100);

// Role line cycles through phrases; each swap degrades into Redaction 100,
// switches text while unreadable, then resolves back to clean.
const ROLES = [
    "developer, turkey",
    "linux daily driver",
    "builder of small tools",
    "terminally curious",
];
const roleIndex = ref(0);
const roleStage = ref(0);
const roleFont = computed(() => `${REDACTION_LADDER[roleStage.value]}, serif`);

let roleTimer = 0;
const roleStep = (dir, delay, onEnd) => {
    const next = roleStage.value + dir;
    if (next < 0 || next >= REDACTION_LADDER.length) {
        onEnd?.();
        return;
    }
    roleTimer = window.setTimeout(() => {
        roleStage.value = next;
        roleStep(dir, delay, onEnd);
    }, delay);
};

const scheduleRoleSwap = () => {
    roleTimer = window.setTimeout(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            roleIndex.value = (roleIndex.value + 1) % ROLES.length;
            scheduleRoleSwap();
            return;
        }
        roleStep(1, 70, () => {
            roleIndex.value = (roleIndex.value + 1) % ROLES.length;
            roleStep(-1, 90, scheduleRoleSwap);
        });
    }, 4500);
};
// Touch has no real hover: pointerleave may never fire, so restore on lift.
const onNamePointerUp = (e) => {
    if (e.pointerType !== "mouse") stopRedact();
};

onMounted(() => {
    markReady("projects");
    markReady("contributions");
    tickAge();
    REDACTION_LADDER.forEach((f) => document.fonts?.load?.(`1rem ${f}`));
    scheduleRoleSwap();
});

onBeforeUnmount(() => {
    if (ageRafId) window.cancelAnimationFrame(ageRafId);
    window.clearTimeout(redactTimer);
    window.clearTimeout(roleTimer);
});
</script>

<template>
    <div class="home-root w-full min-h-[100dvh] flex items-center justify-center px-6 py-24">
        <motion.div
            class="w-full max-w-[30rem] mx-auto flex flex-col items-center text-center"
            :variants="heroContainer"
            initial="hidden"
            animate="visible"
        >
            <motion.h1
                :variants="fadeUp"
                class="name"
                :style="{ fontFamily: nameFont }"
                @pointerenter="startRedact"
                @pointerleave="stopRedact"
                @pointercancel="stopRedact"
                @pointerup="onNamePointerUp"
                @contextmenu.prevent
            >moli</motion.h1>
            <motion.p :variants="fadeUp" class="role" :style="{ fontFamily: roleFont }">{{ ROLES[roleIndex] }}</motion.p>

            <motion.p :variants="fadeUp" class="intro">
                i build small tools, ship web experiments, and write about what i learn.
            </motion.p>

            <motion.div :variants="fadeUp" class="mt-9">
                <NowPlaying />
            </motion.div>

            <motion.dl :variants="fadeUp" class="living">
                <dt>status</dt>
                <dd>
                    <span class="dot" :class="{ 'dot-pulse': isOnline }" :style="{ background: statusColor }" aria-hidden="true"></span>
                    {{ statusLine }}
                </dd>

                <template v-if="latestPost">
                    <dt>latest</dt>
                    <dd>
                        <router-link :to="`/blog/${latestPost.slug}`" class="val-link">
                            {{ latestPost.title }}
                        </router-link>
                    </dd>
                </template>

                <dt>age</dt>
                <dd>
                    <button type="button" class="age-btn" @click="cycleUnit" title="click to change units">
                        <span class="num">{{ ageValue }}</span><span class="muted">&nbsp;{{ ageUnit }}</span>
                    </button>
                </dd>
            </motion.dl>

            <motion.div :variants="fadeUp" class="mt-10 w-full min-w-0">
                <EightyEightButtons />
            </motion.div>

            <motion.nav :variants="fadeUp" class="nav" aria-label="Primary">
                <router-link to="/blog">blog</router-link>
                <router-link to="/projects">projects</router-link>
                <router-link to="/now">now</router-link>
                <span class="nav-gap" aria-hidden="true"></span>
                <a href="https://github.com/lostf1sh" target="_blank" rel="noopener noreferrer">github</a>
                <a href="https://www.instagram.com/kawaiimoli" target="_blank" rel="noopener noreferrer">instagram</a>
            </motion.nav>

            <motion.p :variants="fadeUp" class="kbd-hint">
                press <kbd>{{ kbHint }}</kbd> to jump around
            </motion.p>
        </motion.div>
    </div>
</template>

<style scoped>
.home-root {
    letter-spacing: -0.01em;
}

.name {
    font-size: clamp(3rem, 9vw, 4.25rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.01em;
    color: rgb(var(--color-text));
    cursor: default;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    touch-action: manipulation;
}

.role {
    margin-top: 0.85rem;
    font-size: 0.95rem;
    letter-spacing: 0.01em;
    color: rgb(var(--color-subtle));
    user-select: none;
    -webkit-user-select: none;
}

.intro {
    margin-top: 2rem;
    max-width: 26rem;
    font-size: 1.0625rem;
    line-height: 1.6;
    color: rgb(var(--color-text) / 0.82);
}

.living {
    margin-top: 2.75rem;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 1.5rem;
    row-gap: 0.55rem;
    text-align: left;
    font-size: 0.875rem;
    max-width: 100%;
}

.living dt {
    text-align: right;
    color: rgb(var(--color-subtle) / 0.9);
    white-space: nowrap;
}

.living dd {
    margin: 0;
    min-width: 0;
    color: rgb(var(--color-text));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.muted {
    color: rgb(var(--color-subtle));
}

.num {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0;
}

.age-btn {
    color: rgb(var(--color-text));
    cursor: pointer;
    transition: color 0.15s ease;
}

.age-btn:hover,
.age-btn:focus-visible {
    color: rgb(var(--color-mint));
}

.val-link {
    color: rgb(var(--color-text));
    transition: color 0.15s ease;
}

.val-link:hover,
.val-link:focus-visible {
    color: rgb(var(--color-mint));
}

.dot {
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    margin-right: 0.5rem;
    border-radius: 9999px;
    background: rgb(var(--color-subtle) / 0.55);
    vertical-align: middle;
    transform: translateY(-1px);
}

@media (prefers-reduced-motion: no-preference) {
    .dot-pulse {
        animation: dot-pulse 2.4s ease-in-out infinite;
    }
}

@keyframes dot-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgb(var(--color-mint) / 0.45); }
    60% { box-shadow: 0 0 0 0.32rem rgb(var(--color-mint) / 0); }
}

.nav {
    margin-top: 3rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.35rem 1.25rem;
    font-size: 0.9rem;
}

.nav a {
    color: rgb(var(--color-subtle));
    position: relative;
    transition: color 0.15s ease;
}

.nav a:hover,
.nav a:focus-visible {
    color: rgb(var(--color-mint));
}

.nav-gap {
    width: 1px;
    height: 0.9rem;
    background: rgb(var(--color-overlay) / 0.5);
}

@media (max-width: 420px) {
    .nav-gap { display: none; }
    .kbd-hint { display: none; }
}

.kbd-hint {
    margin-top: 1.75rem;
    font-size: 0.75rem;
    color: rgb(var(--color-subtle) / 0.65);
}

.kbd-hint kbd {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.7rem;
    color: rgb(var(--color-subtle));
    border: 1px solid rgb(var(--color-surface));
    border-radius: 4px;
    padding: 0.05rem 0.3rem;
}
</style>
