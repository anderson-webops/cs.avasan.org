// src/stores/quote.ts
import { acceptHMRUpdate, defineStore } from "pinia";

export interface Quote {
	_id: string;
	content: string;
	author: string;
	tags: string[];
	authorSlug: string;
	length: number;
	dateAdded: string;
	dateModified: string;
}

interface FetchOpts {
	tags?: string[];
	limit?: number;
	force?: boolean; // bypass cache
}

export const useQuoteStore = defineStore("quote", () => {
	const hasQuote = ref(false);
	const text = ref("");
	const author = ref("");
	const loading = ref(false);
	const error = ref<string | null>(null);

	// simple in-memory cache TTL so we don’t refetch on every route visit
	const lastFetchedAt = ref<number | null>(null);
	const TTL_MS = 5 * 60 * 1000; // 5 minutes

	async function fetchQuote(opts: FetchOpts = {}) {
		// Avoid SSR fetch unless you intentionally need it; your endpoint looks client-side.
		if (import.meta.env.SSR) return;

		const now = Date.now();
		const withinTtl = lastFetchedAt.value !== null && now - lastFetchedAt.value < TTL_MS;

		if (!opts.force && withinTtl && hasQuote.value) return;

		loading.value = true;
		error.value = null;

		try {
			// Optional auth “ping”
			try {
				// If you keep an axios-like API wrapper, use that here.
				// It’s fine to call it directly inside the store.
				const { api } = await import("@/api.ts");
				await api.get("/accounts/me");
			} catch {
				// Non-fatal: you might be unauthenticated for quotes; ignore
			}

			const tagParam = opts.tags && opts.tags.length ? `tags=${encodeURIComponent(opts.tags.join(","))}` : "";
			const limitParam = `limit=${opts.limit ?? 100}`;
			const query = [tagParam, limitParam].filter(Boolean).join("&");

			const res = await fetch(`/api/quotes?${query}`);
			if (!res.ok) {
				error.value = `Backend error: ${await res.text()}`;
				hasQuote.value = false;
				loading.value = false;
				return;
			}

			const data = (await res.json()) as Quote[];

			if (Array.isArray(data) && data.length > 0) {
				// Choose the first; you can randomize if you prefer
				text.value = data[0].content;
				author.value = data[0].author;
				hasQuote.value = true;
				lastFetchedAt.value = now;
			} else {
				hasQuote.value = false;
			}
		} catch (e: any) {
			error.value = e?.message ?? "Unknown error";
			hasQuote.value = false;
		} finally {
			loading.value = false;
		}
	}

	// Optional helper to randomize if multiple quotes are returned
	// function setQuote(q: Quote) {
	// 	text.value = q.content;
	// 	author.value = q.author;
	// 	hasQuote.value = true;
	// 	lastFetchedAt.value = Date.now();
	// }

	return {
		// state
		hasQuote,
		text,
		author,
		loading,
		error,
		// actions
		fetchQuote
		// setQuote
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useQuoteStore as any, import.meta.hot));
}
