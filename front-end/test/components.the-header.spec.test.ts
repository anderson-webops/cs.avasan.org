import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TheHeader from "@/components/TheHeader.vue";
import { useAppStore } from "@/stores/app";

vi.mock("vue-router", () => ({
	useRoute: () => ({ path: "/" })
}));

describe("TheHeader.vue", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	function mountHeader(pinia = createPinia()) {
		setActivePinia(pinia);
		return mount(TheHeader, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});
	}

	it("shows Zoom in the primary navigation for visitors", () => {
		const wrapper = mountHeader();

		expect(wrapper.text()).toContain("Zoom");
		expect(wrapper.text()).not.toContain("Pathways");
	});

	it("keeps Pathways visible for admins only", () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "admin-1",
			name: "Admin",
			email: "admin@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountHeader(pinia);

		expect(wrapper.text()).toContain("Zoom");
		expect(wrapper.text()).toContain("Pathways");
		expect(wrapper.text()).toContain("Account");
	});

	it("shows the Teaching workspace link for tutors", () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [],
			editTutors: false,
			saveEdit: "Save"
		});

		const wrapper = mountHeader(pinia);

		expect(wrapper.text()).toContain("Teaching");
		expect(wrapper.text()).toContain("Account");
		expect(wrapper.text()).not.toContain("Profile");
	});
});
