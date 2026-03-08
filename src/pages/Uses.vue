<script setup>
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div class="mb-12">
                <div class="text-catppuccin-subtle text-sm mb-2">
                    ~$ cat ~/uses.txt
                </div>
                <h1
                    class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"
                >
                    <span class="text-catppuccin-mauve">uses</span>
                </h1>
                <p class="text-sm text-catppuccin-gray leading-relaxed mb-6">
                    tools, hardware, and software i use daily.
                </p>

                <div class="flex items-center gap-4 text-sm mb-6">
                    <router-link
                        to="/"
                        class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                    >
                        [← home]
                    </router-link>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="border-l-2 border-catppuccin-surface pl-4">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/code/
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">zed</span>
                                <span class="text-catppuccin-gray"> — primary editor, fast and minimal</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">android studio</span>
                                <span class="text-catppuccin-gray"> — mobile development</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">claude code</span>
                                <span class="text-catppuccin-gray"> — ai-assisted coding in terminal</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">codex</span>
                                <span class="text-catppuccin-gray"> — openai coding agent</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-blue">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">t3 code</span>
                                <span class="text-catppuccin-gray"> — alpha / codex wrapper</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/terminal/
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">ghostty</span>
                                <span class="text-catppuccin-gray"> — fast, native terminal</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">zsh + oh-my-zsh</span>
                                <span class="text-catppuccin-gray"> — shell with plugins</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">tmux</span>
                                <span class="text-catppuccin-gray"> — terminal multiplexer</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-green">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">starship</span>
                                <span class="text-catppuccin-gray"> — minimal prompt</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/dev-tools/
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">vue 3</span>
                                <span class="text-catppuccin-gray"> — frontend framework of choice</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">tailwind css</span>
                                <span class="text-catppuccin-gray"> — utility-first styling</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">bun</span>
                                <span class="text-catppuccin-gray"> — js runtime and package manager</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">vite</span>
                                <span class="text-catppuccin-gray"> — build tool</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">docker</span>
                                <span class="text-catppuccin-gray"> — containerization</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-peach">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">git + github</span>
                                <span class="text-catppuccin-gray"> — version control</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/languages/
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">javascript / typescript</span>
                                <span class="text-catppuccin-gray"> — primary</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">python</span>
                                <span class="text-catppuccin-gray"> — scripting, automation</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">dart</span>
                                <span class="text-catppuccin-gray"> — flutter apps</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-yellow">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">bash</span>
                                <span class="text-catppuccin-gray"> — shell scripts</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ uname -a
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-red">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">cachyos (arch linux)</span>
                                <span class="text-catppuccin-gray"> — daily driver</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-red">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">catppuccin mocha</span>
                                <span class="text-catppuccin-gray"> — theme everywhere</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-red">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">jetbrains mono</span>
                                <span class="text-catppuccin-gray"> — monospace font</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/apps/
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">firefox</span>
                                <span class="text-catppuccin-gray"> — browser</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">obsidian</span>
                                <span class="text-catppuccin-gray"> — notes and knowledge base</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">spotify</span>
                                <span class="text-catppuccin-gray"> — music</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="text-catppuccin-pink">></span>
                            <div>
                                <span class="text-catppuccin-text font-medium">discord</span>
                                <span class="text-catppuccin-gray"> — comms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
