// Local compatibility shim for Chromium's chrome://resources/js/assert.js.
export function assert<T>(
	condition: T,
	message = "Assertion failed"
): asserts condition {
	if (!condition) throw new Error(message);
}
