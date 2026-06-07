<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";

const route = useRoute();
const routePath = computed(() => route.fullPath || "/");

const links = [
    { to: "/", label: "home" },
    { to: "/blog", label: "writing" },
    { to: "/projects", label: "projects" },
    { to: "/now", label: "now" },
];
</script>

<template>
    <div class="w-full min-h-[100dvh]">
        <div class="max-w-2xl mx-auto px-6 pt-12 pb-16">
            <SiteNav />

            <main class="py-24 md:py-32 text-center">
                <div class="text-6xl md:text-7xl font-medium tracking-tight text-ink-text">404</div>
                <p class="mt-4 text-ink-subtle">
                    nothing lives at
                    <span class="text-ink-text break-all">{{ routePath }}</span>.
                </p>
                <nav class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                    <router-link
                        v-for="link in links"
                        :key="link.to"
                        :to="link.to"
                        class="text-ink-subtle hover:text-ink-mint transition-colors"
                    >
                        {{ link.label }}
                    </router-link>
                </nav>
            </main>

            <SiteFooter />
        </div>
    </div>
</template>
