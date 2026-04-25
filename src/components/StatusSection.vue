<script setup>
import { computed } from "vue";
import { motion } from "motion-v";
import { fadeUp } from "@/utils/motion";

const props = defineProps({
    isLoading: Boolean,
    isConnected: Boolean,
    isReconnecting: Boolean,
    presenceUnavailable: Boolean,
    usingCachedPresence: Boolean,
    discordUser: Object,
    discordStatus: String,
    discordStatusColor: String,
    spotify: Object,
    editorActivity: Object,
});

const editorStatus = computed(() => {
    if (!props.editorActivity) return null;

    if (
        props.editorActivity.details &&
        props.editorActivity.details.toLowerCase().includes("idling")
    ) {
        return "idling";
    }

    const editorName = props.editorActivity.name;
    const isZed = editorName === "Zed";

    let filename = isZed
        ? props.editorActivity.state || ""
        : props.editorActivity.details || "";

    let workspace = isZed
        ? props.editorActivity.details || ""
        : props.editorActivity.state || "";

    filename = filename
        .replace(/editing /i, "")
        .replace(/working on /i, "")
        .trim();

    workspace = workspace
        .replace(/in /i, "")
        .replace(/workspace: /i, "")
        .trim();

    return {
        name: editorName,
        workspace,
        filename,
    };
});

const showPresenceSkeleton = computed(
    () => props.isLoading && !props.discordUser,
);

const statusDotClass = computed(() => {
    switch (props.discordStatus) {
        case "online": return "bg-catppuccin-green";
        case "idle": return "bg-catppuccin-yellow";
        case "dnd": return "bg-catppuccin-red";
        default: return "bg-catppuccin-overlay";
    }
});
</script>

<template>
    <motion.div
        :variants="fadeUp"
        class="mb-6"
    >
        <div class="section-label mb-2">now</div>
        <div class="space-y-2 text-sm">
            <div
                v-if="showPresenceSkeleton"
                class="text-catppuccin-subtle space-y-2"
            >
                <div class="h-4 w-48 rounded bg-catppuccin-surface/40 animate-pulse"></div>
                <div class="h-4 w-64 rounded bg-catppuccin-surface/30 animate-pulse"></div>
            </div>

            <div
                v-else-if="discordUser"
                class="flex items-center gap-3"
            >
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="statusDotClass"></span>
                <span class="text-catppuccin-subtle">discord</span>
                <span class="text-catppuccin-text">{{ discordUser.username }}</span>
            </div>

            <div class="flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="spotify ? 'bg-catppuccin-green' : 'bg-catppuccin-overlay/50'"></span>
                <span class="text-catppuccin-subtle">music</span>
                <span
                    v-if="!showPresenceSkeleton && spotify"
                    class="text-catppuccin-text truncate"
                >
                    {{ spotify.song }} — {{ spotify.artist }}
                </span>
                <span
                    v-else-if="showPresenceSkeleton"
                    class="h-4 w-56 rounded bg-catppuccin-surface/30 animate-pulse inline-block align-middle"
                ></span>
                <span v-else class="text-catppuccin-subtle/60">silent</span>
            </div>

            <div
                v-if="
                    !showPresenceSkeleton &&
                    editorActivity &&
                    editorStatus &&
                    (editorStatus.workspace ||
                        editorStatus.filename)
                "
                class="flex items-center gap-3"
            >
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-catppuccin-blue"></span>
                <span class="text-catppuccin-subtle">{{
                    editorStatus.name === "Zed" ? "zed" : "code"
                }}</span>
                <span class="text-catppuccin-text truncate">
                    <span v-if="editorStatus.workspace">{{
                        editorStatus.workspace.toLowerCase()
                    }}</span>
                    <span
                        v-if="
                            editorStatus.workspace &&
                            editorStatus.filename
                        "
                        class="text-catppuccin-subtle/50"
                    >
                        /
                    </span>
                    <span v-if="editorStatus.filename">{{
                        editorStatus.filename.toLowerCase()
                    }}</span>
                </span>
            </div>

            <div
                v-if="isReconnecting"
                class="text-xs text-catppuccin-subtle/60 mt-1"
            >reconnecting…</div>
        </div>
    </motion.div>
</template>
