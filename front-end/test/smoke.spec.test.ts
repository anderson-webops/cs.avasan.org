// test/smoke.spec.test.ts
import { mount } from "@vue/test-utils";
import { expect, it } from "vitest";
import TheInput from "../src/components/TheInput.vue";

it("mounts a Vue component", () => {
	const wrapper = mount(TheInput, { props: { modelValue: "Hello" } });
	expect(wrapper.exists()).toBe(true);
});
