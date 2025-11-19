import type { UserModule } from "~/types.ts";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFacebook, faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { setupLayouts } from "virtual:generated-layouts";
import { ViteSSG } from "vite-ssg";

import { routes } from "vue-router/auto-routes";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
// Assuming you have styles defined in these files
// import "uno.css";
// import "@unocss/reset/tailwind.css";
import "./styles/main.css";

// FontAwesome library setup
library.add(faFacebook, faGithub, faInstagram);

// https://github.com/antfu/vite-ssg
// noinspection JSUnusedGlobalSymbols
export const createApp = ViteSSG(
	App,
	{
		routes: setupLayouts(routes),
		base: import.meta.env.BASE_URL
	},
	async ctx => {
		// ctx is the context where you can add global components or plugins
		ctx.app.component("font-awesome-icon", FontAwesomeIcon);

		// Auto-import and install all modules under `modules/`, if any install all modules under `modules/`
		Object.values(
			import.meta.glob<{
				install: UserModule;
			}>("./modules/*.ts", { eager: true })
		).forEach(i => i.install?.(ctx));
		// ctx.app.use(Previewer)

		// Only run on client, after Pinia is ready
		if (!import.meta.env.SSR) {
			// Load Bootstrap’s JavaScript (includes Popper via bundler)
			await import("bootstrap");
			const { useAppStore } = await import("./stores/app");
			const appStore = useAppStore();
			await appStore.bootstrapSession(); // <- rehydrate Pinia from cookies
		}

		// If you had specific plugins like a global error handler, i18n, etc., initialize them here
	}
);
