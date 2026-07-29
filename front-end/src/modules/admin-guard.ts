// src/modules/admin-guard.ts
import type { UserModule } from "@/types";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

export const install: UserModule = ({ router }) => {
	if (import.meta.env.SSR) return; // skip SSR, run in client

	router.beforeEach(async to => {
		if (!to.meta.requiresAdmin) return;

		const app = useAppStore();

		await app.bootstrapSession();

		// If we don’t already know, ask the server (cookie-session backed)
		if (!app.currentAdmin) {
			try {
				// You already have this endpoint and cookie-session configured
				const { data } = await api.get("/admins/loggedin", {
					withCredentials: true
				});
				if (data.currentAdmin) app.setCurrentAdmin(data.currentAdmin);
			} catch {
				// ignore; not logged in as admin
			}
		}

		// Still not an admin? block & bounce
		if (!app.currentAdmin) {
			return { path: "/admin", query: { redirect: to.fullPath } };
		}
	});
};
