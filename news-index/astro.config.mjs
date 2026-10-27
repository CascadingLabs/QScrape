import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://news.qscrape.dev',
	trailingSlash: 'always',
	outDir: process.env.QSN_BUILD_ROOT
		? `${process.env.QSN_BUILD_ROOT}/news/`
		: '../qsn/dist/news/',
	build: { concurrency: 1 },
	integrations: [sitemap()],
});
