<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent } from "vue";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "ProfilePage" });

const AdminProfile = defineAsyncComponent(
	() => import("@/components/AdminProfile.vue")
);
const TutorProfile = defineAsyncComponent(
	() => import("@/components/TutorProfile.vue")
);
const UserProfile = defineAsyncComponent(
	() => import("@/components/UserProfile.vue")
);

const app = useAppStore();
const { currentAdmin, currentTutor, currentUser } = storeToRefs(app);

const activeProfileComponent = computed(() => {
	if (currentAdmin.value) return AdminProfile;
	if (currentTutor.value) return TutorProfile;
	if (currentUser.value) return UserProfile;
	return null;
});

const displayName = computed(
	() =>
		currentAdmin.value?.name ||
		currentTutor.value?.name ||
		currentUser.value?.name ||
		""
);

const profileRole = computed(() => {
	if (currentAdmin.value) return "Administrator";
	if (currentTutor.value) return "Tutor";
	if (currentUser.value) return "Student";
	return null;
});

const hasProfile = computed(() => activeProfileComponent.value !== null);
const isWorkspaceLayout = computed(() => hasProfile.value);

const heroTitle = computed(() => {
	if (profileRole.value === "Administrator") {
		return displayName.value
			? `${displayName.value}'s account.`
			: "Administrator account.";
	}
	if (profileRole.value === "Tutor") {
		return displayName.value
			? `${displayName.value}'s account.`
			: "Tutor account.";
	}
	if (profileRole.value === "Student") {
		return displayName.value
			? `${displayName.value}'s account.`
			: "Student account.";
	}
	return "Account access.";
});

const heroSubtitle = computed(() => {
	switch (profileRole.value) {
		case "Administrator":
			return "Manage your own login and security details here. People, permissions, course access, session notes, and role changes now live under Admin.";
		case "Tutor":
			return "Manage your own login and security details here. Learner operations live in the Teaching workspace and course progress is tracked inside Courses.";
		case "Student":
			return "Check your account information, assigned tutors, course access, and communication settings.";
		default:
			return "Sign in or create an account to view personalized account details.";
	}
});

const heroBadge = computed(() =>
	profileRole.value ? `Signed in as ${profileRole.value}` : "Account"
);

const profileComponentProps = computed(() => {
	if (currentAdmin.value) {
		return { mode: "account" };
	}
	if (currentTutor.value) {
		return { mode: "account" };
	}
	return {};
});

function openAuthModal() {
	app.setLoginBlock(true);
}
</script>

<template>
	<section
		class="profile-page"
		:class="{ 'is-workspace-layout': isWorkspaceLayout }"
	>
		<div
			class="profile-content"
			:class="{ 'is-workspace-layout': isWorkspaceLayout }"
		>
			<header
				class="profile-header"
				:class="{ 'is-workspace-layout': isWorkspaceLayout }"
			>
				<p class="profile-badge">{{ heroBadge }}</p>
				<h1>{{ heroTitle }}</h1>
				<p>{{ heroSubtitle }}</p>
			</header>

			<div
				v-if="hasProfile"
				class="profile-card"
				:class="{ 'is-workspace-layout': isWorkspaceLayout }"
			>
				<component
					:is="activeProfileComponent"
					v-bind="profileComponentProps"
				/>
			</div>

			<div v-else class="profile-empty">
				<div class="empty-card">
					<h2>You're almost there</h2>
					<p>
						Log in to access your personalized profile, manage
						account details, and stay connected with your tutor.
					</p>
					<div class="profile-actions">
						<button
							class="action primary"
							type="button"
							@click="openAuthModal"
						>
							Log in
						</button>
						<RouterLink class="action secondary" to="/signup">
							Create an account
						</RouterLink>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.profile-page {
	position: relative;
	min-height: calc(100vh - 6rem);
	padding: clamp(3rem, 6vw, 6rem) 1.5rem 5rem;
	background:
		radial-gradient(
			circle at 0% -20%,
			rgba(125, 211, 252, 0.38),
			transparent 55%
		),
		linear-gradient(130deg, #0f172a 0%, #1e3a8a 55%, #312e81 100%);
	display: flex;
	justify-content: center;
	align-items: center;
}

.profile-page.is-workspace-layout {
	align-items: flex-start;
	padding: clamp(2rem, 3vw, 3rem) 1rem 3rem;
}

.profile-content {
	width: min(1080px, 100%);
	display: flex;
	flex-direction: column;
	gap: clamp(1.75rem, 3vw, 3rem);
}

.profile-content.is-workspace-layout {
	width: min(1520px, 100%);
}

.profile-header {
	text-align: center;
	color: #f8fafc;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.profile-header.is-workspace-layout {
	text-align: center;
	max-width: 70rem;
	margin: 0 auto;
	align-items: center;
}

.profile-header.is-workspace-layout .profile-badge {
	align-self: center;
}

.profile-header.is-workspace-layout p:last-child {
	max-width: 52rem;
	margin-inline: auto;
}

.profile-badge {
	align-self: center;
	padding: 0.4rem 0.95rem;
	border-radius: 999px;
	background: rgba(15, 23, 42, 0.35);
	border: 1px solid rgba(226, 232, 240, 0.35);
	text-transform: uppercase;
	letter-spacing: 0.12em;
	font-size: 0.8rem;
	font-weight: 600;
	color: rgba(224, 242, 254, 0.92);
}

.profile-header h1 {
	margin: 0;
	font-size: clamp(2.1rem, 5vw, 2.85rem);
	font-weight: 700;
	line-height: 1.12;
	color: #f8fafc;
	text-shadow: 0 16px 32px rgba(15, 23, 42, 0.28);
}

.profile-header p {
	margin: 0;
	font-size: clamp(1rem, 2.6vw, 1.18rem);
	line-height: 1.65;
	color: rgba(226, 232, 240, 0.9);
}

.profile-card {
	width: 100%;
	background: rgba(255, 255, 255, 0.97);
	border-radius: 28px;
	padding: clamp(1.75rem, 4vw, 3rem);
	box-shadow: 0 40px 70px -35px rgba(15, 23, 42, 0.55);
	border: 1px solid rgba(255, 255, 255, 0.6);
	backdrop-filter: blur(16px);
}

.profile-card.is-workspace-layout {
	padding: 0.8rem;
	border-radius: 34px;
	background: rgba(255, 255, 255, 0.14);
	border-color: rgba(191, 219, 254, 0.24);
	box-shadow: 0 55px 90px -55px rgba(15, 23, 42, 0.82);
	backdrop-filter: blur(24px);
}

.profile-card :deep(.Signup) {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	color: #0f172a;
}

.profile-card :deep(.Signup h2) {
	margin: 0;
	font-size: clamp(1.8rem, 4vw, 2.25rem);
	color: #0f172a;
}

.profile-card :deep(.Signup h4) {
	font-size: 1.1rem;
	color: #0f172a;
}

.profile-card :deep(hr) {
	border: none;
	height: 1px;
	width: 100%;
	background: linear-gradient(
		90deg,
		rgba(148, 163, 184, 0),
		rgba(148, 163, 184, 0.75),
		rgba(148, 163, 184, 0)
	);
	margin: 2rem 0 1.5rem;
}

.profile-card :deep(.tutorList) {
	width: min(100%, 700px);
	margin: 0 auto;
	padding: 1.5rem 1.75rem 1.85rem;
	border-radius: 22px;
	border: 1px solid rgba(148, 163, 184, 0.4);
	background: linear-gradient(
		140deg,
		rgba(248, 250, 252, 0.96),
		rgba(255, 255, 255, 0.98)
	);
	box-shadow: 0 25px 45px -35px rgba(15, 23, 42, 0.55);
	outline: none;
}

.profile-card :deep(.tutorList + .tutorList) {
	margin-top: 1.5rem;
}

.profile-card :deep(.btn) {
	margin: 0.25rem 0.5rem 0;
}

.profile-empty {
	width: 100%;
	display: flex;
	justify-content: center;
}

.empty-card {
	width: min(520px, 100%);
	background: rgba(15, 23, 42, 0.8);
	border-radius: 26px;
	padding: clamp(2rem, 5vw, 2.85rem);
	text-align: center;
	color: #e2e8f0;
	border: 1px solid rgba(148, 163, 184, 0.35);
	box-shadow: 0 35px 60px -30px rgba(15, 23, 42, 0.75);
	backdrop-filter: blur(14px);
}

.empty-card h2 {
	margin: 0 0 1rem;
	font-size: clamp(1.65rem, 4vw, 2.1rem);
	font-weight: 700;
}

.empty-card p {
	margin: 0 0 1.75rem;
	line-height: 1.7;
	color: rgba(226, 232, 240, 0.88);
}

.profile-actions {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.75rem;
}

.action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.9rem;
	border-radius: 999px;
	font-weight: 600;
	font-size: 1rem;
	text-decoration: none;
	border: none;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		background-color 0.2s ease,
		color 0.2s ease;
}

.action.primary {
	background: linear-gradient(135deg, #38bdf8, #2563eb);
	color: #0f172a;
	box-shadow: 0 18px 35px -18px rgba(37, 99, 235, 0.65);
}

.action.primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 22px 40px -20px rgba(37, 99, 235, 0.75);
}

.action.secondary {
	background: rgba(15, 23, 42, 0.65);
	color: #e2e8f0;
	border: 1px solid rgba(148, 163, 184, 0.4);
}

.action.secondary:hover {
	transform: translateY(-2px);
	background: rgba(15, 23, 42, 0.75);
}

.action:focus {
	outline: 2px solid rgba(224, 242, 254, 0.75);
	outline-offset: 2px;
}

@media (max-width: 768px) {
	.profile-page {
		padding: 3.5rem 1.25rem 4rem;
	}

	.profile-page.is-workspace-layout {
		padding: 2.25rem 0.85rem 2.75rem;
	}

	.profile-card,
	.empty-card {
		padding: clamp(1.5rem, 5vw, 2.5rem);
	}

	.profile-card.is-workspace-layout {
		padding: 0.7rem;
	}

	.profile-header.is-workspace-layout {
		text-align: center;
	}

	.profile-header.is-workspace-layout .profile-badge {
		align-self: center;
	}

	.profile-card :deep(.tutorList) {
		padding: 1.25rem 1.35rem 1.5rem;
	}
}

@media (max-width: 480px) {
	.profile-actions {
		flex-direction: column;
	}

	.action {
		width: 100%;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
