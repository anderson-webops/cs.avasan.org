<script lang="ts" setup>
import GameCardThumbnail from "@/components/games/GameCardThumbnail.vue";

type GameCardThumbnailKind = "comet" | "crosswalk" | "machine" | "pond";

const games = [
	{
		description:
			"Race through arithmetic in a private room, one student or one team per device.",
		thumbnail: "pond",
		title: "Pond Paddlers",
		to: "/games/pond-paddlers"
	},
	{
		description:
			"Choose Simple, Middle, or Advanced and clear three increasingly busy crossings.",
		thumbnail: "crosswalk",
		title: "Crosswalk Critters",
		to: "/games/crosswalk-critters"
	},
	{
		description:
			"Repair a playful machine by activating its stations in the right order.",
		thumbnail: "machine",
		title: "Machine Workshop",
		to: "/games/machine-workshop"
	},
	{
		description:
			"Jump and duck through a bright space trail and chase a session high score.",
		thumbnail: "comet",
		title: "Comet Hopper",
		to: "/games/comet-hopper"
	}
] satisfies Array<{
	description: string;
	thumbnail: GameCardThumbnailKind;
	title: string;
	to: string;
}>;
</script>

<template>
	<section class="page-shell page-shell--wide games-page">
		<header class="games-page__header">
			<h1 class="page-title">Games</h1>
		</header>

		<div class="games-grid" aria-label="Classroom games">
			<RouterLink
				v-for="game in games"
				:key="game.to"
				class="game-card site-surface"
				:to="game.to"
			>
				<GameCardThumbnail :kind="game.thumbnail" />
				<h2>{{ game.title }}</h2>
				<p>{{ game.description }}</p>
				<span class="game-card__action">Play</span>
			</RouterLink>
		</div>
	</section>
</template>

<style scoped>
.games-page {
	display: grid;
	gap: clamp(1.5rem, 4vw, 2.5rem);
	padding-block: clamp(1.5rem, 4vw, 3rem);
}

.games-page__header {
	display: grid;
	gap: 0.35rem;
}

.games-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
	gap: 1rem;
}

.game-card {
	display: grid;
	min-height: 18rem;
	align-content: start;
	gap: 0.75rem;
	padding: clamp(1.25rem, 3vw, 1.75rem);
	color: var(--color-ink);
	text-decoration: none;
	transition:
		border-color 0.18s ease,
		box-shadow 0.18s ease,
		transform 0.18s ease;
}

.game-card:hover,
.game-card:focus-visible {
	border-color: rgba(15, 118, 110, 0.34);
	box-shadow: var(--shadow-medium);
	transform: translateY(-2px);
}

.game-card:focus-visible {
	outline: 3px solid var(--focus-ring-color);
	outline-offset: 3px;
}

.game-card h2 {
	font-size: clamp(1.45rem, 3vw, 1.85rem);
}

.game-card p {
	color: var(--color-ink-soft);
}

.game-card__action {
	align-self: end;
	margin-top: auto;
	color: var(--color-link);
	font-weight: 800;
}

@media (prefers-reduced-motion: reduce) {
	.game-card {
		transition: none;
	}

	.game-card:hover,
	.game-card:focus-visible {
		transform: none;
	}
}
</style>
