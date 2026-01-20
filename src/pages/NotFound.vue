<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <div class="mb-12">
                <div class="text-catppuccin-subtle text-sm mb-2">
                    ~$ cd /
                </div>

                <h1 class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2">
                    <span class="text-catppuccin-red">404</span>
                </h1>

                <div class="border-l-2 border-catppuccin-surface pl-4 mb-6">
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ cat error.txt
                    </div>
                    <div class="space-y-1 text-catppuccin-text">
                        <div class="flex items-center gap-2">
                            <span class="text-catppuccin-red">bash:</span>
                            <span class="text-catppuccin-text">cd: {{ $route.path }}: No such file or directory</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-catppuccin-subtle">hint:</span>
                            <span class="text-catppuccin-gray">the requested page was not found</span>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls valid_directories/
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <router-link
                            to="/"
                            class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                        >
                            <span class="text-catppuccin-blue">/</span>
                            <span class="text-catppuccin-subtle">→</span>
                            <span>home</span>
                        </router-link>
                        <router-link
                            to="/blog"
                            class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                        >
                            <span class="text-catppuccin-blue">/blog</span>
                            <span class="text-catppuccin-subtle">→</span>
                            <span>blog posts</span>
                        </router-link>
                        <router-link
                            to="/github"
                            class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                        >
                            <span class="text-catppuccin-blue">/github</span>
                            <span class="text-catppuccin-subtle">→</span>
                            <span>projects</span>
                        </router-link>
                        <router-link
                            to="/instagram"
                            class="flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"
                        >
                            <span class="text-catppuccin-blue">/instagram</span>
                            <span class="text-catppuccin-subtle">→</span>
                            <span>photos</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
