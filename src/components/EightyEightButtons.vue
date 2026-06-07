<script setup>
const buttons = [
	{
		label: "moli",
		src: "https://raw.githubusercontent.com/NPSummers/NPSummers/refs/heads/main/doesnt_want_to_host_his_own_gif_moli.gif",
	},
	{
		label: "boo.kim",
		href: "https://boo.kim/",
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
];
</script>

<template>
	<div class="button-grid">
		<component
			v-for="button in buttons"
			:key="button.src"
			:is="button.href ? 'a' : 'span'"
			:href="button.href"
			:target="button.href ? '_blank' : undefined"
			:rel="button.href ? 'noopener noreferrer' : undefined"
			class="button-link"
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
</template>

<style scoped>
.button-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 6px;
	max-width: 100%;
}

.button-link {
	display: block;
	width: 88px;
	height: 31px;
	image-rendering: pixelated;
	transition: opacity 0.12s ease;
}

.button-link:hover,
.button-link:focus-visible {
	opacity: 0.8;
}

.button-link img {
	display: block;
	width: 88px;
	height: 31px;
	object-fit: contain;
}
</style>
