import type { UserModule } from "~/types";
import NProgress from "nprogress";

export const install: UserModule = ({ router }) => {
	if (!import.meta.env.SSR) {
		NProgress.configure({
			barSelector: ".bar",
			showSpinner: false,
			spinnerSelector: ".spinner",
			template: [
				'<div class="bar" role="progressbar" aria-label="Page loading" aria-valuemin="0" aria-valuemax="100">',
				'<div class="peg"></div>',
				"</div>"
			].join("")
		});

		router.beforeEach((to, from) => {
			if (to.path !== from.path) NProgress.start();
		});
		router.afterEach(() => {
			NProgress.done();
		});
	}
};
