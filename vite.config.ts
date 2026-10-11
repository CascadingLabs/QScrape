import { defineConfig } from 'vite-plus';

export default defineConfig({
	fmt: {
		useTabs: true,
		printWidth: 80,
		singleQuote: true,
		semi: true,
		svelte: true,
		ignorePatterns: ['dist/**', '.astro/**', 'node_modules/**'],
	},
	lint: {
		ignorePatterns: ['dist/**', '.astro/**', 'node_modules/**'],
		overrides: [
			{
				files: ['src/components/**/solid/**/*.tsx'],
				// Solid's JSX transform assigns ref={variable}; the linter cannot see it.
				rules: { 'no-unassigned-vars': 'off' },
			},
		],
	},
});
