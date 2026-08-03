<script lang="ts" setup>
import {
	classroomUsageIsEnabled,
	studentAccountsAreEnabled
} from "@/modules/classroomFeatures";

const privacyLinkIsProminent =
	studentAccountsAreEnabled() || classroomUsageIsEnabled();
</script>

<template>
	<footer class="site-footer">
		<div class="site-shell site-shell--wide site-footer__inner">
			<RouterLink
				class="site-footer__link"
				:class="{
					'site-footer__link--prominent': privacyLinkIsProminent
				}"
				to="/student-privacy"
			>
				Student privacy and record requests
			</RouterLink>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	padding: 0.5rem 0 1.25rem;
}

.site-footer__inner {
	display: flex;
	justify-content: flex-end;
}

.site-footer__link {
	color: var(--color-footer-link);
	font-size: 0.75rem;
	font-weight: 500;
	line-height: 1.45;
	text-decoration: none;
	text-decoration-thickness: 0.08em;
	text-underline-offset: 0.2em;
}

.site-footer__link:hover,
.site-footer__link:focus-visible {
	color: var(--color-ink-soft);
	text-decoration: underline;
}

.site-footer__link:focus-visible {
	border-radius: 0.2rem;
	outline: 2px solid var(--focus-ring-color);
	outline-offset: 0.2rem;
}

.site-footer__link--prominent {
	padding: 0.55rem 0.75rem;
	border: 1px solid var(--color-border-strong);
	border-radius: var(--radius-pill);
	background: var(--color-surface-strong);
	color: var(--color-ink);
	font-size: 0.9rem;
	font-weight: 800;
	text-decoration: underline;
}
</style>
