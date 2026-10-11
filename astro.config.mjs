// @ts-check

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { eshopAPIPlugin } from './scripts/eshop-api-plugin';

// https://astro.build/config
export default defineConfig({
	site: 'https://qscrape.dev',
	trailingSlash: 'always',
	vite: { plugins: [eshopAPIPlugin()] },
	integrations: [sitemap(), react()],
});
