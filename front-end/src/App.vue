<script lang="ts" setup>
import {
	canonicalUrlForPath,
	pageRobotsForPath,
	pageTitleForPath,
	SITE_DESCRIPTION,
	SITE_URL
} from "@/modules/pageHead";

const siteUrl = import.meta.env.VITE_SITE_URL || SITE_URL;
const route = useRoute();
const canonicalUrl = computed(() =>
	canonicalUrlForPath(route.path || "/", siteUrl)
);
const socialImageUrl = computed(() =>
	new URL("/og.png", `${siteUrl}/`).toString()
);
const pageTitle = computed(() => pageTitleForPath(route.path || "/"));
const robotsContent = computed(() => pageRobotsForPath(route.path || "/"));
const structuredData = computed(() => [
	{
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		description: SITE_DESCRIPTION,
		name: "Classes with Julio",
		url: siteUrl
	},
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		description: SITE_DESCRIPTION,
		name: "Classes with Julio",
		url: siteUrl
	}
]);

useHead(
	() =>
		({
			title: pageTitle.value,
			meta: [
				{
					name: "description",
					content: SITE_DESCRIPTION
				},
				{
					property: "og:title",
					content: "Classes with Julio"
				},
				{
					property: "og:description",
					content: SITE_DESCRIPTION
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: canonicalUrl.value
				},
				{
					property: "og:image",
					content: socialImageUrl.value
				},
				{
					property: "og:image:alt",
					content:
						"Classes with Julio: Scratch, Python, and PyGames for young coders"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: "Classes with Julio"
				},
				{
					name: "twitter:description",
					content: SITE_DESCRIPTION
				},
				{
					name: "twitter:image",
					content: socialImageUrl.value
				},
				{
					name: "robots",
					content: robotsContent.value
				},
				{
					name: "theme-color",
					content: isDark.value ? "#07111f" : "#3158e8"
				}
			],
			link: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg"
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon-32x32.png"
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/favicon-16x16.png"
				},
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png"
				},
				{
					rel: "manifest",
					href: "/site.webmanifest"
				},
				{
					rel: "dns-prefetch",
					href: "//cdn.jsdelivr.net"
				},
				{
					rel: "preconnect",
					href: "https://cdn.jsdelivr.net",
					crossorigin: "anonymous"
				},
				{
					rel: "canonical",
					href: canonicalUrl.value
				}
			],
			script: structuredData.value.map((entry, index) => ({
				innerHTML: JSON.stringify(entry),
				key: `ld-json-${index}`,
				type: "application/ld+json"
			}))
		}) as any
);
</script>

<template>
	<RouterView />
</template>

<style></style>
