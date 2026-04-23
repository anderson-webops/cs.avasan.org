// back-end/eslint.config.js
import globals from "globals";
import ts from "typescript-eslint";
import base from "../eslint.config.js";

export default base.append(
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: ts.parser,
			parserOptions: { project: "./tsconfig.json", sourceType: "module" },
			globals: { ...globals.node }
		},
		rules: {
			"new-cap": "off"
		}
	},
	{ files: ["**/*.{js,cjs,mjs}"], languageOptions: { globals: { ...globals.node } } },
	{ ignores: ["dist/**"] }
);
