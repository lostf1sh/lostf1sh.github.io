<script setup>
import { computed } from "vue";
import { motion } from "motion-v";
import { fadeLeft } from "@/utils/motion";

const props = defineProps({
    isLoading: Boolean,
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
</script>

<template>
    <motion.div
        :variants="fadeLeft"
        class="border-l-2 border-catppuccin-surface pl-4 mb-4"
    >
        <div class="text-catppuccin-subtle text-sm mb-2">
            ~$ ps aux | grep duhan
        </div>
        <div class="space-y-1 text-sm">
            <div
                v-if="!isLoading && discordUser"
                class="flex items-center gap-2"
            >
                <span class="text-catppuccin-blue">discord</span>
                <span class="text-catppuccin-subtle">:</span>
                <span class="text-catppuccin-text">{{
                    discordUser.username
                }}</span>
                <span :class="discordStatusColor"
                    >[{{ discordStatus }}]</span
                >
            </div>

            <div class="flex items-center gap-2">
                <span class="text-catppuccin-green">spotify</span>
                <span class="text-catppuccin-subtle">:</span>
                <span
                    v-if="!isLoading && spotify"
                    class="text-catppuccin-text truncate"
                >
                    {{ spotify.song }} - {{ spotify.artist }}
                </span>
                <span v-else class="text-catppuccin-subtle"
                    >not playing</span
                >
            </div>

            <div
                v-if="
                    !isLoading &&
                    editorActivity &&
                    editorStatus &&
                    (editorStatus.workspace ||
                        editorStatus.filename)
                "
                class="flex items-center gap-2"
            >
                <span class="text-catppuccin-blue">{{
                    editorStatus.name === "Zed" ? "zed" : "vscode"
                }}</span>
                <span class="text-catppuccin-subtle">:</span>
                <span class="text-catppuccin-text truncate">
                    <span v-if="editorStatus.workspace">{{
                        editorStatus.workspace.toLowerCase()
                    }}</span>
                    <span
                        v-if="
                            editorStatus.workspace &&
                            editorStatus.filename
                        "
                        class="text-catppuccin-subtle"
                    >
                        /
                    </span>
                    <span v-if="editorStatus.filename">{{
                        editorStatus.filename.toLowerCase()
                    }}</span>
                </span>
            </div>
        </div>
    </motion.div>
</template>
