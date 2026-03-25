<script lang="ts" setup>
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the HTML results with vite-ssg
useHead({
	title: "Classes",
	meta: [
		{
			name: "Classes",
			content: ""
		},
		{
			name: "theme-color",
			content: () => (isDark.value ? "#00aba9" : "#ffffff")
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
		}
		/*				{
          rel: 'icon',
          type: 'image/svg+xml',
          href: () => preferredDark.value ? '/favicon-dark.svg': '/favicon.svg',
        }, */
	],
	script: import.meta.env.PROD
		? [
				{
					defer: true,
					src: "https://analytics.jacobdanderson.net/script.js",
					"data-website-id": "d9905a72-7109-4f71-bfbb-d5e0dcef964e"
				}
			]
		: []
});
</script>

<template>
	<RouterView />
</template>

<style></style>
