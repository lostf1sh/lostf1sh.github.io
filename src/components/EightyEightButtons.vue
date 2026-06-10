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
	{
		label: "kie.ac",
		href: "https://kie.ac/",
		src: "https://kie.ac/88x31/button.png",
	},
];
</script>

<template>
	<div class="marquee" :style="{ '--duration': `${buttons.length * 2.25}s` }">
		<div class="marquee-track">
			<div
				v-for="copy in 2"
				:key="copy"
				class="marquee-group"
				:aria-hidden="copy === 2 ? 'true' : undefined"
			>
				<component
					v-for="button in buttons"
					:key="button.src"
					:is="button.href ? 'a' : 'span'"
					:href="button.href"
					:target="button.href ? '_blank' : undefined"
					:rel="button.href ? 'noopener noreferrer' : undefined"
					:tabindex="copy === 2 ? -1 : undefined"
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
		</div>
	</div>
</template>

<style scoped>
.marquee {
	max-width: min(100%, 21rem);
	margin-inline: auto;
	overflow: hidden;
	-webkit-mask-image: linear-gradient(
		to right,
		transparent,
		black 12%,
		black 88%,
		transparent
	);
	mask-image: linear-gradient(
		to right,
		transparent,
		black 12%,
		black 88%,
		transparent
	);
}

.marquee-track {
	display: flex;
	width: max-content;
	animation: marquee-scroll var(--duration, 21s) linear infinite;
}

.marquee:hover .marquee-track,
.marquee:focus-within .marquee-track {
	animation-play-state: paused;
}

.marquee-group {
	display: flex;
	gap: 6px;
	padding-right: 6px;
}

@keyframes marquee-scroll {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-50%);
	}
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

@media (prefers-reduced-motion: reduce) {
	.marquee {
		-webkit-mask-image: none;
		mask-image: none;
	}

	.marquee-track {
		width: auto;
		animation: none;
	}

	.marquee-group {
		flex-wrap: wrap;
		justify-content: center;
		padding-right: 0;
	}

	.marquee-group[aria-hidden="true"] {
		display: none;
	}
}
</style>
