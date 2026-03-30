// @ts-check

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://qscrape.dev',
	integrations: [
		sitemap(),
		react({ include: ['**/l2/react/**', '**/l3/react/**'] }),
		vue(),
		svelte(),
		solid({ include: ['**/l3/solid/**'] }),
	],
});
