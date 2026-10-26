// QSN is built and hosted separately from the QScrape index and eShop.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { getPublication } from './src/data/publications';

const publication = getPublication();

export default defineConfig({
	site: publication.origin,
	outDir: process.env.QSN_BUILD_ROOT
		? `${process.env.QSN_BUILD_ROOT}/${publication.key}/`
		: `./dist/${publication.key}/`,
	build: { concurrency: 1 },
	trailingSlash: 'always',
	integrations: [sitemap()],
});
