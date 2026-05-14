<script setup lang="ts">
import AdminProfile from "@/components/AdminProfile.vue";
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";
</script>

<template>
	<AdminWorkspaceShell
		intro="Manage the native people records for the tutoring system: tutor permissions, learner assignments, recipient associations, course access, and role changes."
		title="People and Access"
	>
		<AdminProfile mode="people" />
	</AdminWorkspaceShell>
</template>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
