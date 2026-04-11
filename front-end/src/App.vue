<script lang="ts" setup>
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the HTML results with vite-ssg
import { SCHEDULER_ORIGIN } from "@/modules/scheduler";
const siteUrl = "https://classes.jacobdanderson.net";
const siteDescription =
	"Private instruction with Jacob Anderson for coding, STEM, and Spanish learners, including one-on-one classes, course pathways, and flexible scheduling.";
const route = useRoute();
const noindexMatchers = [/^\/admin(?:\/|$)/, /^\/profile(?:\/|$)/, /^\/api(?:\/|$)/];
const canonicalUrl = computed(() => new URL(route.path || "/", `${siteUrl}/`).toString());
const robotsContent = computed(() =>
	noindexMatchers.some(matcher => matcher.test(route.path))
		? "noindex,nofollow"
		: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
);
const structuredData = computed(() => [
	{
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		"description": siteDescription,
		"name": "Classes with Jacob",
		"url": siteUrl
	},
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"description": siteDescription,
		"name": "Classes with Jacob",
		"url": siteUrl
	}
]);

useHead(() => ({
	title: "Classes",
	meta: [
		{
			name: "description",
			content: siteDescription
		},
		{
			property: "og:title",
			content: "Classes with Jacob"
		},
		{
			property: "og:description",
			content: siteDescription
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
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "twitter:title",
			content: "Classes with Jacob"
		},
		{
			name: "twitter:description",
			content: siteDescription
		},
		{
			name: "robots",
			content: robotsContent.value
		},
		{
			name: "theme-color",
			content: isDark.value ? "#00aba9" : "#ffffff"
		}
	],
	link: [
		{
			rel: "icon",
			type: "image/x-icon",
			href: "https://classes-jacobdanderson.s3.us-east-1.amazonaws.com/Favicons/favicon.ico"
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			href: "https://classes-jacobdanderson.s3.us-east-1.amazonaws.com/Favicons/favicon-32x32.png"
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			href: "https://classes-jacobdanderson.s3.us-east-1.amazonaws.com/Favicons/favicon-16x16.png"
		},
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "https://classes-jacobdanderson.s3.us-east-1.amazonaws.com/Favicons/apple-touch-icon.png"
		},
		{
			rel: "dns-prefetch",
			href: "//scheduler.classes.jacobdanderson.net"
		},
		{
			rel: "preconnect",
			href: SCHEDULER_ORIGIN
		},
		{
			rel: "canonical",
			href: canonicalUrl.value
		}
	],
	script: [
		...(import.meta.env.PROD
			? [
					{
						defer: true,
						src: "https://analytics.jacobdanderson.net/script.js",
						"data-website-id": "d9905a72-7109-4f71-bfbb-d5e0dcef964e"
					}
				]
			: []),
		...structuredData.value.map((entry, index) => ({
			children: JSON.stringify(entry),
			key: `ld-json-${index}`,
			type: "application/ld+json"
		}))
	]
}));
</script>

<template>
	<RouterView />
</template>

<style></style>
