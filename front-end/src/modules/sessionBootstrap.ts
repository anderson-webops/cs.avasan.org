export interface SessionBootstrapStore {
	bootstrapSession: () => Promise<void>;
}

export function startSessionBootstrap(store: SessionBootstrapStore): void {
	const bootstrap = () => {
		void store.bootstrapSession().catch(() => undefined);
	};
	if (
		typeof document === "undefined" ||
		document.visibilityState === "visible"
	) {
		bootstrap();
		return;
	}

	const bootstrapWhenVisible = () => {
		if (document.visibilityState !== "visible") return;
		document.removeEventListener("visibilitychange", bootstrapWhenVisible);
		bootstrap();
	};
	document.addEventListener("visibilitychange", bootstrapWhenVisible);
}
