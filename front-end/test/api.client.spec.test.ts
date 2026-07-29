// test/api.client.spec.test.ts
import { api } from "../src/api";
import { expect, it } from "vitest";

it("uses the same-origin API with credentials and a CSRF-resistant header", () => {
	expect((api.defaults as any).baseURL).toBe("/api");
	expect((api.defaults as any).withCredentials).toBe(true);
	expect((api.defaults.headers as any)["X-Classroom-Request"]).toBe("1");
});
