<script setup lang="ts">
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";
</script>

<template>
	<AdminWorkspaceShell
		:action="{
			href: 'https://docs.google.com/spreadsheets/d/1UzA77-6hEakCe583WXOZTniC_RB6pqKp-2_ZLgQFOtk/edit?gid=891834841#gid=891834841',
			label: 'Open full spreadsheet',
			external: true
		}"
		intro="Review the published roster view here, then jump to the live Google Sheet only when you need to edit or cross-check the full document."
		title="Learner Management"
	>
		<div class="sheet-panel">
			<p class="helper-text">
				This embedded view is for quick review. Use the full sheet for
				editing, filters, or protected-range work.
			</p>
			<div class="iframe-wrap">
				<iframe
					allowfullscreen
					loading="lazy"
					src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSaHeIeRi1nujjE_klPrxwQ5v6Wf4gLNGgUrcbUIl2gnwCRuf7PQUD0EOT44SLqpotNODfm2bfjqEEN/pubhtml?gid=891834841&amp;single=true&amp;widget=true&amp;headers=false"
					title="Student Management Spreadsheet"
				></iframe>
			</div>
		</div>
	</AdminWorkspaceShell>
</template>

<style scoped>
.sheet-panel {
	display: grid;
	gap: 1rem;
}

.helper-text {
	margin: 0;
	color: #526779;
	line-height: 1.6;
}

.iframe-wrap {
	position: relative;
	width: 100%;
	padding-top: min(70vw, 70%);
	border: 1px solid #d8e3ed;
	border-radius: 22px;
	overflow: hidden;
	background: #fff;
	box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.55);
}

.iframe-wrap iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: 0;
}

@media (min-width: 992px) {
	.iframe-wrap {
		padding-top: 650px;
	}
}
</style>

<route lang="json">
{
	"meta": {
		"layout": "default",
		"requiresAdmin": true
	}
}
</route>
