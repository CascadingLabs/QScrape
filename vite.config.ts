import { defineConfig } from 'vite-plus';

export default defineConfig({
	fmt: {
		useTabs: true,
		printWidth: 80,
		singleQuote: true,
		semi: true,
		ignorePatterns: ['dist/**', '.astro/**', 'node_modules/**'],
	},
	lint: {
		ignorePatterns: ['dist/**', '.astro/**', 'node_modules/**'],
	},
});
