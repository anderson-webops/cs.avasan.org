<script setup lang="ts">
type GameCardThumbnailKind = "comet" | "crosswalk" | "machine" | "pond";

defineOptions({ name: "GameCardThumbnail" });

defineProps<{ kind: GameCardThumbnailKind }>();
</script>

<template>
	<svg
		aria-hidden="true"
		class="game-thumbnail"
		focusable="false"
		viewBox="0 0 180 108"
	>
		<template v-if="kind === 'pond'">
			<rect width="180" height="108" rx="18" fill="#c9f3ec" />
			<path d="M0 57c27-15 53 13 82 0s54 12 98-5v56H0Z" fill="#57b8ca" />
			<path
				d="M17 83c17-8 34-8 51 0M106 72c17-8 34-8 51 0"
				fill="none"
				stroke="#d8fbff"
				stroke-linecap="round"
				stroke-width="4"
			/>
			<ellipse cx="145" cy="88" rx="23" ry="9" fill="#5e9e55" />
			<path d="m145 88 18-11" stroke="#d8fbff" stroke-width="3" />
			<ellipse cx="83" cy="66" rx="27" ry="17" fill="#f2c84b" />
			<circle cx="105" cy="53" r="15" fill="#f8d45a" />
			<circle cx="110" cy="49" r="2.5" fill="#17313a" />
			<path d="m118 55 18 6-18 6Z" fill="#e87835" />
			<path
				d="M56 72c-13 1-23 5-31 11"
				fill="none"
				stroke="#e9feff"
				stroke-linecap="round"
				stroke-width="4"
			/>
		</template>

		<template v-else-if="kind === 'crosswalk'">
			<rect width="180" height="108" rx="18" fill="#dff5c9" />
			<rect y="23" width="180" height="68" fill="#475569" />
			<path
				d="M0 42h29m18 0h29m18 0h29m18 0h29M0 72h29m18 0h29m18 0h29m18 0h29"
				stroke="#f8fafc"
				stroke-width="5"
			/>
			<rect x="18" y="51" width="53" height="23" rx="8" fill="#fb7185" />
			<circle cx="31" cy="76" r="6" fill="#172033" />
			<circle cx="58" cy="76" r="6" fill="#172033" />
			<rect x="119" y="30" width="44" height="21" rx="8" fill="#38bdf8" />
			<circle cx="131" cy="52" r="6" fill="#172033" />
			<circle cx="151" cy="52" r="6" fill="#172033" />
			<path
				d="M101 81c-15 8-26-9-18-19 8-9 22-1 18 8"
				fill="none"
				stroke="#b66b2c"
				stroke-linecap="round"
				stroke-width="9"
			/>
			<circle cx="105" cy="82" r="13" fill="#f1a64b" />
			<path d="m96 73 3-12 7 10m7 3 8-8-2 13" fill="#f1a64b" />
			<circle cx="110" cy="80" r="2" fill="#172033" />
		</template>

		<template v-else-if="kind === 'machine'">
			<rect width="180" height="108" rx="18" fill="#172554" />
			<path
				d="M19 84h142M37 22v62m106-62v62"
				stroke="#45668f"
				stroke-width="5"
			/>
			<g fill="none" stroke-linecap="round">
				<circle
					cx="65"
					cy="53"
					r="25"
					stroke="#2dd4bf"
					stroke-width="10"
				/>
				<path
					d="M65 19v11m0 46v11M31 53h11m46 0h11M41 29l8 8m32 32 8 8m0-48-8 8M49 69l-8 8"
					stroke="#2dd4bf"
					stroke-width="7"
				/>
				<circle
					cx="119"
					cy="63"
					r="18"
					stroke="#c084fc"
					stroke-width="8"
				/>
				<path
					d="M119 37v9m0 34v9M93 63h9m34 0h9M101 45l7 7m22 22 7 7m0-36-7 7m-22 22-7 7"
					stroke="#c084fc"
					stroke-width="6"
				/>
			</g>
			<circle cx="151" cy="26" r="7" fill="#fde047" />
			<circle cx="151" cy="45" r="7" fill="#60a5fa" />
		</template>

		<template v-else>
			<rect width="180" height="108" rx="18" fill="#171942" />
			<circle cx="24" cy="23" r="2.5" fill="#fff7c2" />
			<circle cx="60" cy="17" r="3" fill="#fff7c2" />
			<circle cx="144" cy="24" r="2.5" fill="#fff7c2" />
			<circle cx="161" cy="50" r="3" fill="#fff7c2" />
			<path
				d="M0 86 29 73l25 12 31-17 32 18 28-11 35 12v21H0Z"
				fill="#735b73"
			/>
			<path d="m77 60-40 18 33-30" fill="#60a5fa" opacity=".65" />
			<circle cx="88" cy="49" r="22" fill="#8b5cf6" />
			<circle cx="81" cy="44" r="4" fill="#f8fafc" />
			<circle cx="95" cy="44" r="4" fill="#f8fafc" />
			<path
				d="M80 56c5 6 12 6 17 0"
				fill="none"
				stroke="#f8fafc"
				stroke-linecap="round"
				stroke-width="3"
			/>
			<path d="m132 86 7-25 10-7 12 32Z" fill="#8290a6" />
		</template>
	</svg>
</template>

<style scoped>
.game-thumbnail {
	width: 100%;
	height: auto;
	border-radius: 1rem;
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.1);
}
</style>
