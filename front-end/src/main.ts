import type { UserModule } from "~/types.ts";
import { setupLayouts } from "virtual:generated-layouts";

import { routes } from "vue-router/auto-routes";
import App from "./App.vue";
import { startAdminSessionLifecycle } from "./modules/adminSession";
import { studentAccountsAreEnabled } from "./modules/classroomFeatures";
import {
	purgeAllStudentPythonProjectRecovery,
	volatileStudentPythonProjectRecovery
} from "./modules/pythonIde";
import { startSessionBootstrap } from "./modules/sessionBootstrap";
import { startStudentSessionLifecycle } from "./modules/studentSession";
import { ViteSSG } from "./ssg";
import { useAppStore } from "./stores/app";
import "bootstrap/dist/css/bootstrap.min.css";
// Assuming you have styles defined in these files
// import "uno.css";
// import "@unocss/reset/tailwind.css";
import "./styles/main.css";

// https://github.com/antfu/vite-ssg
// noinspection JSUnusedGlobalSymbols
export const createApp = ViteSSG(
	App,
	{
		routes: setupLayouts([...routes]),
		base: import.meta.env.BASE_URL
	},
	async ctx => {
		// Auto-install only app plugin modules. Broad eager globs pull feature
		// modules like the Python IDE runtime into the startup bundle.
		Object.values(
			import.meta.glob<UserModule>(
				[
					"./modules/admin-guard.ts",
					"./modules/i18n.ts",
					"./modules/nprogress.ts",
					"./modules/pinia.ts"
				],
				{ eager: true, import: "install" }
			)
		).forEach(install => install?.(ctx));
		// ctx.app.use(Previewer)

		// Only run on client, after Pinia is ready
		if (!import.meta.env.SSR) {
			// Complete the one-time legacy owner-storage purge before mounting
			// any authenticated classroom UI. Anonymous browser projects remain.
			await purgeAllStudentPythonProjectRecovery().catch(() => undefined);
			// Load Bootstrap’s JavaScript (includes Popper via bundler)
			await import("bootstrap");
			const appStore = useAppStore();
			window.addEventListener("beforeunload", event => {
				if (!volatileStudentPythonProjectRecovery.hasAnyUnsynced()) {
					return;
				}
				event.preventDefault();
				event.returnValue = "";
			});
			startSessionBootstrap(appStore);
			startAdminSessionLifecycle(appStore);
			if (studentAccountsAreEnabled()) {
				startStudentSessionLifecycle(appStore);
			}
		}

		// If you had specific plugins like a global error handler, i18n, etc., initialize them here
	}
);
