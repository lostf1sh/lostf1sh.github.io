<script setup>
import { computed } from "vue";
import { BUILD_DATE, formatBuildDate } from "@/utils/buildInfo";

const buildLabel = computed(() => formatBuildDate(BUILD_DATE));
</script>

<template>
    <footer class="mt-16 border-t border-catppuccin-surface/20 pt-6 text-xs text-catppuccin-subtle/60">
        <div class="grid gap-2 text-center md:grid-cols-3 md:items-center md:text-left">
            <div>
                <span>© {{ new Date().getFullYear() }} moli</span>
            </div>

            <div class="md:text-center">
                <span>built with vue + vite</span>
            </div>

            <div class="md:text-right">
                <span>updated {{ buildLabel }}</span>
            </div>
        </div>
    </footer>
</template>
