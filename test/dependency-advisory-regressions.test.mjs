import assert from "node:assert/strict";
// These dependency contracts run independently of the application runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";
import { renderToString } from "@vue/server-renderer";
import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { createSSRApp, h } from "vue";

test("patched math rendering retains inline and display expressions", () => {
	const output = micromark(
		"Inline $x^2 + 1$ and\n\n$$\n\\frac{1}{2}\n$$\n",
		{ extensions: [math()], htmlExtensions: [mathHtml()] }
	);
	assert.match(output, /class="math math-inline"/);
	assert.match(output, /<msup><mi>x<\/mi><mn>2<\/mn><\/msup>/);
	assert.match(output, /class="math math-display"/);
	assert.match(output, /<mfrac><mn>1<\/mn><mn>2<\/mn><\/mfrac>/);
});

test("server rendering rejects carriage returns in attribute names", async () => {
	const app = createSSRApp({
		render: () => h("div", {
			"data-safe": "kept",
			"x\ronclick": "alert(1)"
		}, "Safe")
	});
	assert.equal(await renderToString(app), "<div data-safe=\"kept\">Safe</div>");
});
