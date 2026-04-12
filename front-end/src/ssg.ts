import type {
	RouterOptions,
	ViteSSGClientOptions,
	ViteSSGContext
} from "vite-ssg";
import type { Component } from "vue";
import { createHead as createClientHead } from "@unhead/vue/client";
import { createHead } from "@unhead/vue/server";
import {
	createApp as createClientApp,
	createSSRApp,
	defineComponent,
	onMounted,
	ref
} from "vue";
import {
	createMemoryHistory,
	createRouter,
	createWebHistory
} from "vue-router";

const ClientOnly = defineComponent({
	setup(_props, { slots }) {
		const mounted = ref(false);

		onMounted(() => {
			mounted.value = true;
		});

		return () => {
			if (!mounted.value) return slots.placeholder?.({});

			return slots.default?.({});
		};
	}
});

function deserializeState(state: unknown) {
	try {
		return JSON.parse(String(state ?? "{}"));
	} catch (error) {
		console.error("[SSG] On state deserialization -", error, state);
		return {};
	}
}

function documentReady<T>(passThrough?: T) {
	if (document.readyState === "loading") {
		return new Promise<T | undefined>(resolve => {
			document.addEventListener("DOMContentLoaded", () => {
				resolve(passThrough);
			});
		});
	}

	return Promise.resolve(passThrough);
}

export function ViteSSG(
	App: Component,
	routerOptions: RouterOptions,
	fn?: (context: ViteSSGContext<true>) => Promise<void> | void,
	options?: ViteSSGClientOptions
) {
	const {
		transformState,
		registerComponents = true,
		useHead = true,
		rootContainer = "#app"
	} = options ?? {};

	async function createApp(routePath?: string) {
		const app =
			import.meta.env.SSR || options?.hydration
				? createSSRApp(App)
				: createClientApp(App);

		const head = useHead
			? import.meta.env.SSR
				? createHead()
				: createClientHead()
			: undefined;

		if (head) app.use(head);

		const router = createRouter({
			history: import.meta.env.SSR
				? createMemoryHistory(routerOptions.base)
				: createWebHistory(routerOptions.base),
			...routerOptions
		});

		if (registerComponents) app.component("ClientOnly", ClientOnly);

		const appRenderCallbacks: Array<() => void | Promise<void>> = [];
		const onSSRAppRendered = import.meta.env.SSR
			? (callback: () => void) => appRenderCallbacks.push(callback)
			: () => {};
		const triggerOnSSRAppRendered = (
			_route?: string,
			_appHTML?: string,
			_appCtx?: ViteSSGContext<true>
		) => Promise.all(appRenderCallbacks.map(callback => callback()));

		const context: ViteSSGContext<true> = {
			app,
			head: head as ViteSSGContext<true>["head"],
			isClient: !import.meta.env.SSR,
			router: router as ViteSSGContext<true>["router"],
			routes: routerOptions.routes,
			onSSRAppRendered,
			triggerOnSSRAppRendered,
			initialState: {},
			transformState,
			routePath
		};

		if (!import.meta.env.SSR) {
			await documentReady();
			context.initialState =
				transformState?.((window as any).__INITIAL_STATE__ || {}) ||
				deserializeState((window as any).__INITIAL_STATE__);
		}

		await fn?.(context);
		app.use(router);

		let entryRoutePath: string | undefined;
		let isFirstRoute = true;

		// Vue Router 5 warns on the legacy `next()` guard signature.
		router.beforeEach(to => {
			if (
				isFirstRoute ||
				(entryRoutePath && entryRoutePath === to.path)
			) {
				isFirstRoute = false;
				entryRoutePath = to.path;
				to.meta.state = context.initialState;
			}
		});

		if (import.meta.env.SSR) {
			const route = context.routePath ?? "/";
			await router.push(route);
			await router.isReady();
			context.initialState = router.currentRoute.value.meta.state || {};
		}

		return {
			...context,
			initialState: context.initialState
		};
	}

	if (!import.meta.env.SSR) {
		void (async () => {
			const { app, router } = await createApp();
			await router.isReady();
			app.mount(rootContainer, true);
		})();
	}

	return createApp;
}
