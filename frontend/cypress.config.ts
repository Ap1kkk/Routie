import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:5000",
		specPattern: "cypress/e2e/**/*.cy.ts",

		viewportWidth: 925,
		viewportHeight: 900,
	},
});