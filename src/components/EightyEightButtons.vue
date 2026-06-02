<script setup>
const buttons = [
    {
        label: "moli",
        gang: true,
        src: "https://raw.githubusercontent.com/NPSummers/NPSummers/refs/heads/main/doesnt_want_to_host_his_own_gif_moli.gif",
    },
    {
        label: "boo.kim",
        href: "https://boo.kim/",
        gang: true,
        src: "https://boo.kim/88x31/bookim.gif",
    },
    {
        label: "aureal",
        href: "https://aureal.dev/",
        src: "https://raw.githubusercontent.com/NPSummers/NPSummers/refs/heads/main/button.png",
    },
    {
        label: "akryst",
        href: "https://akryst.moe/",
        src: "https://akryst.moe/88x31/akryst.gif",
    },
    {
        label: "assuming",
        href: "https://assumi.ng/",
        src: "https://assumi.ng/assets/88x31/assuming.gif",
    },
    {
        label: "arch linux",
        href: "https://archlinux.org/",
        src: "/88x31/archlinux.png",
    },
];
</script>

<template>
    <div class="tui-panel mt-4">
        <span class="tui-panel-title">
            88x31
            <a
                href="https://github.com/lostf1sh/lostf1sh.github.io/issues/new?title=88x31%20swap"
                target="_blank"
                rel="noopener noreferrer"
                class="swap-link"
                title="open a github issue for an 88x31 swap"
            >[swap?]</a>
        </span>
        <div class="button-grid pt-1">
            <component
                v-for="button in buttons"
                :key="button.src"
                :is="button.href ? 'a' : 'span'"
                :href="button.href"
                :target="button.href ? '_blank' : undefined"
                :rel="button.href ? 'noopener noreferrer' : undefined"
                class="button-link"
                :class="{ 'is-gang': button.gang }"
                :aria-label="button.label"
                :title="button.label"
            >
                <img
                    :src="button.src"
                    :alt="button.label"
                    width="88"
                    height="31"
                    loading="lazy"
                    decoding="async"
                />
            </component>
        </div>
    </div>
</template>

<style scoped>
.button-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
}

.swap-link {
    margin-left: 0.35rem;
    color: rgb(var(--color-subtle) / 0.45);
    transition: color 0.12s ease;
}

.swap-link:hover,
.swap-link:focus-visible {
    color: rgb(var(--color-text));
}

.button-link {
    position: relative;
    display: block;
    width: 88px;
    height: 31px;
    border: 1px solid rgb(var(--color-surface) / 0.7);
    background: rgb(var(--color-crust));
    image-rendering: pixelated;
    transition: border-color 0.12s ease, opacity 0.12s ease;
}

.button-link.is-gang {
    border-color: rgb(var(--color-text) / 0.38);
    box-shadow:
        0 0 0 1px rgb(var(--color-text) / 0.06),
        0 0 14px rgb(var(--color-text) / 0.13);
}

.button-link.is-gang::after {
    content: "";
    position: absolute;
    inset: -4px;
    border: 1px solid rgb(var(--color-text) / 0.08);
    pointer-events: none;
}

.button-link:hover,
.button-link:focus-visible {
    border-color: rgb(var(--color-overlay));
    opacity: 0.9;
}

.button-link.is-gang:hover,
.button-link.is-gang:focus-visible {
    border-color: rgb(var(--color-text) / 0.7);
    box-shadow:
        0 0 0 1px rgb(var(--color-text) / 0.12),
        0 0 20px rgb(var(--color-text) / 0.24);
}

.button-link img {
    display: block;
    width: 88px;
    height: 31px;
    filter: grayscale(1) contrast(1.08);
    transition: filter 0.14s ease;
}

.button-link:hover img,
.button-link:focus-visible img {
    filter: grayscale(0) contrast(1);
}
</style>
