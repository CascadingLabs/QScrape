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
		plugins: ['typescript', 'unicorn', 'oxc', 'react', 'jsx-a11y'],
		ignorePatterns: ['dist/**', '.astro/**', 'node_modules/**'],
	},
});
