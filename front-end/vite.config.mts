// vite.config.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import Shiki from "@shikijs/markdown-it";
import { unheadVueComposablesImports } from "@unhead/vue";
import Vue from "@vitejs/plugin-vue";

import LinkAttributes from "markdown-it-link-attributes";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Markdown from "unplugin-vue-markdown/vite";
import { defineConfig } from "vite";
import VueDevTools from "vite-plugin-vue-devtools";
import Layouts from "vite-plugin-vue-layouts-next";
import generateSitemap from "vite-ssg-sitemap";
import { VueRouterAutoImports } from "vue-router/unplugin";
import VueRouter from "vue-router/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
	resolve: {
		alias: {
			"~": `${path.resolve(__dirname, "src")}/`,
			"@": `${path.resolve(__dirname, "src")}/`
		}
	},

	plugins: [
		/* 1️⃣  Router (must run before macros/layouts) */
		VueRouter({
			extensions: [".vue", ".md"],
			dts: "src/route-map.d.ts",
			watch: command === "serve" && !process.env.VITEST
		}),

		/* 2️⃣  Vue */
		Vue({ include: [/\.vue$/, /\.md$/] }),

		/* 3️⃣  Layouts */
		Layouts(),

		/* 4️⃣  Auto-import globals */
		AutoImport({
			include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
			// ⚠️ remove @vueuse/head to avoid duplicate helpers
			imports: [
				"vue",
				"vue-i18n",
				"@vueuse/core",
				unheadVueComposablesImports, // supplies useHead / useSeoMeta
				VueRouterAutoImports,
				{ "vue-router/auto": ["useLink"] }
			],
			eslintrc: {
				enabled: true,
				filepath: ".eslintrc-auto-import.json",
				globalsPropValue: true // all the auto-imports become readonly globals
			},
			dts: "src/auto-imports.d.ts",
			dirs: ["src/composables", "src/stores"],
			vueTemplate: true
		}),

		/* 5️⃣  Auto-register components */
		Components({
			extensions: ["vue", "md"],
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
			dts: "src/components.d.ts"
		}),

		/* 6️⃣  CSS / Markdown / Misc */
		Unocss(),
		Markdown({
			wrapperClasses: "prose prose-sm m-auto text-left",
			headEnabled: true,
			async markdownItSetup(md) {
				md.use(LinkAttributes, {
					matcher: (link: string) => /^https?:\/\//.test(link),
					attrs: { target: "_blank", rel: "noopener" }
				});
				md.use(
					await Shiki({
						defaultColor: false,
						themes: { light: "vitesse-light", dark: "vitesse-dark" }
					})
				);
			}
		}),

		/* 7️⃣  Devtools */
		// https://github.com/webfansplz/vite-plugin-vue-devtools
		VueDevTools()
	],

	/* vitest */
	// https://github.com/vitest-dev/vitest
	test: {
		include: ["test/**/*.test.ts"],
		environment: "jsdom"
	},

	/* vite-ssg */
	// https://github.com/antfu/vite-ssg
	ssgOptions: {
		script: "async",
		formatting: "minify",
		beastiesOptions: {
			reduceInlineStyles: false
		},
		onFinished() {
			generateSitemap();
		}
	},

	ssr: {
		// TODO: workaround until they support native ESM
		noExternal: ["workbox-window", /vue-i18n/]
	},

	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3008",
				changeOrigin: true,
				rewrite: p => p.replace(/^\/api/, "") // strip /api
			}
		}
	}
}));
