<script setup>
import { computed } from "vue";

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

const statusLabel = computed(() => {
    switch (props.discordStatus) {
        case "online": return "ONLINE";
        case "idle": return "IDLE";
        case "dnd": return "DND";
        default: return "OFFLINE";
    }
});

const statusClass = computed(() => {
    switch (props.discordStatus) {
        case "online": return "text-catppuccin-green";
        case "idle": return "text-catppuccin-yellow";
        case "dnd": return "text-catppuccin-red";
        default: return "text-catppuccin-subtle/50";
    }
});
</script>

<template>
    <div class="tui-panel">
        <span class="tui-panel-title">status</span>
        <div class="space-y-1.5 text-xs pt-1">
            <div
                v-if="showPresenceSkeleton"
                class="space-y-1.5"
            >
                <div class="skeleton-pulse h-3 w-48 bg-catppuccin-surface/40"></div>
                <div class="skeleton-pulse h-3 w-40 bg-catppuccin-surface/30"></div>
            </div>

            <div v-else-if="discordUser">
                <span class="text-catppuccin-subtle">discord </span>
                <span class="text-catppuccin-text mr-1">{{ discordUser.username }}</span>
                <span :class="statusClass">[{{ statusLabel }}]</span>
                <span v-if="isReconnecting" class="text-catppuccin-subtle/40"> [...] reconnecting</span>
            </div>

            <div class="flex items-baseline gap-2 min-w-0">
                <span class="text-catppuccin-subtle flex-shrink-0">music</span>
                <span
                    v-if="!showPresenceSkeleton && spotify"
                    class="text-catppuccin-text min-w-0 block truncate"
                >{{ spotify.song }} — {{ spotify.artist }}</span>
                <span
                    v-else-if="showPresenceSkeleton"
                    class="skeleton-pulse h-3 w-40 bg-catppuccin-surface/30 inline-block align-middle"
                ></span>
                <span v-else class="text-catppuccin-subtle/40">--</span>
            </div>

            <div
                v-if="
                    !showPresenceSkeleton &&
                    editorActivity &&
                    editorStatus &&
                    (editorStatus.workspace || editorStatus.filename)
                "
                class="flex items-baseline gap-2 min-w-0"
            >
                <span class="text-catppuccin-subtle flex-shrink-0">{{ editorStatus.name === "Zed" ? "zed" : "code" }}</span>
                <span class="text-catppuccin-text min-w-0 block truncate">
                    <span v-if="editorStatus.workspace">{{ editorStatus.workspace.toLowerCase() }}</span>
                    <span v-if="editorStatus.workspace && editorStatus.filename" class="text-catppuccin-subtle/40">/</span>
                    <span v-if="editorStatus.filename">{{ editorStatus.filename.toLowerCase() }}</span>
                </span>
            </div>
        </div>
    </div>
</template>
