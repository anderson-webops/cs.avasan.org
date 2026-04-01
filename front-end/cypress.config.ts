import { defineConfig } from "cypress";

export default defineConfig({
	projectId: "d8k2m8",
	e2e: {
		baseUrl: "http://localhost:3333",
		chromeWebSecurity: false,
		specPattern: "cypress/e2e/**/*.spec.*",
		supportFile: false
	},

	component: {
		devServer: {
			framework: "vue",
			bundler: "vite"
		}
	}
});
