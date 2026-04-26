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
                <svg class="w-3.5 h-3.5 flex-shrink-0 text-catppuccin-subtle" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span class="text-catppuccin-subtle">discord</span>
                <span class="text-catppuccin-text">{{ discordUser.username }}</span>
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="statusDotClass"></span>
            </div>

            <div class="flex items-center gap-3">
                <svg class="w-3.5 h-3.5 flex-shrink-0" :class="spotify ? 'text-catppuccin-green' : 'text-catppuccin-overlay/50'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
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
                <svg class="w-3.5 h-3.5 flex-shrink-0 text-catppuccin-blue" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 1.61v20.78L18.36 24 0 17.61l5.64 2.22L0 21.39l18.36 2.22L24 21.39V1.61L18.36 0 0 6.39l5.64-2.22L0 2.61 18.36.39 24 1.61zM9.13 13.99l1.95-1.95-4.58-4.58-1.95 1.95 4.58 4.58zm5.11-5.11l1.95-1.95-6.69-6.69-1.95 1.95 6.69 6.69zm-2.63 2.63l1.95-1.95-4.58-4.58-1.95 1.95 4.58 4.58zm5.11-5.11l1.95-1.95-6.69-6.69-1.95 1.95 6.69 6.69z"/>
                </svg>
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
