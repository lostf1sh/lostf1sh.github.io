<template>
    <div class="w-full min-h-screen">
        <div class="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
            <h1 class="sr-only">page not found</h1>
            <SiteNav />

            <div class="tui-panel mb-5">
                <span class="tui-panel-title">shell</span>
                <div class="pt-1 text-xs leading-relaxed">
                    <div class="text-ink-subtle">$ cd {{ routePath }}</div>
                    <div class="text-ink-red/80">cd: no such file or directory: {{ routePath }}</div>
                    <div class="text-ink-subtle mt-3">$ ls ~</div>
                    <div class="text-ink-text/80">blog/ projects/ now.md uses.md</div>
                </div>
            </div>

            <div class="tui-panel">
                <span class="tui-panel-title">recover</span>
                <div class="space-y-0 text-xs pt-1">
                    <router-link to="/" class="group flex items-center justify-between py-2 border-b border-ink-surface/10">
                        <span class="text-ink-text group-hover:text-ink-accent transition-colors">cd ~</span>
                        <span class="text-ink-subtle">home</span>
                    </router-link>
                    <router-link to="/blog" class="group flex items-center justify-between py-2 border-b border-ink-surface/10">
                        <span class="text-ink-text group-hover:text-ink-accent transition-colors">ls posts</span>
                        <span class="text-ink-subtle">~/blog</span>
                    </router-link>
                    <router-link to="/projects" class="group flex items-center justify-between py-2 border-b border-ink-surface/10">
                        <span class="text-ink-text group-hover:text-ink-accent transition-colors">ls repos</span>
                        <span class="text-ink-subtle">~/projects</span>
                    </router-link>
                    <router-link to="/now" class="group flex items-center justify-between py-2 border-b border-ink-surface/10">
                        <span class="text-ink-text group-hover:text-ink-accent transition-colors">cat now.md</span>
                        <span class="text-ink-subtle">~/now</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import SiteNav from "@/components/SiteNav.vue";

const route = useRoute();
const routePath = computed(() => route.fullPath || "/missing");
</script>
