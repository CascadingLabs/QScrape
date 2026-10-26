import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { publication } from '../qsn/src/data/publications';

// Audit what the static build actually exposes through ordinary HTML links.
const root = join(process.cwd(), 'qsn', 'dist', publication.key);
const manifestPath = join(root, 'benchmark-manifest.json');
if (!existsSync(manifestPath))
	throw new Error('Build QSN before auditing output.');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
	origin: string;
	sisterOrigins: string[];
	articleCount: number;
	articles: {
		id: string;
		url: string;
		apiPage: number;
		relatedUrls: string[];
	}[];
};
const origin = manifest.origin;
const pending = ['/'];
const visited = new Set<string>();
const missing = new Set<string>();
const mediaFailures = new Set<string>();
const copyFailures = new Set<string>();
let imageCount = 0;
while (pending.length) {
	const path = pending.pop();
	if (!path || visited.has(path)) continue;
	visited.add(path);
	const file = join(root, path, 'index.html');
	if (!existsSync(file)) {
		missing.add(path);
		continue;
	}
	const html = readFileSync(file, 'utf8');
	if (html.includes(String.fromCodePoint(0x2014))) copyFailures.add(path);
	for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
		imageCount++;
		// Astro's component marker is development-only; check the production contract.
		if (
			!/\bsrc="[^"]+\.(?:webp|svg)(?:\?[^"]*)?"/.test(match[0]) ||
			!/\bwidth="[1-9]\d*"/.test(match[0]) ||
			!/\bheight="[1-9]\d*"/.test(match[0]) ||
			!/\bloading="(?:lazy|eager)"/.test(match[0]) ||
			!/\balt(?:="[^"]*")?(?=\s|>)/.test(match[0])
		)
			mediaFailures.add(path);
	}
	if (
		path === '/' &&
		(manifest.sisterOrigins.some((sister) => !html.includes(`${sister}/`)) ||
			!html.includes('https://news.qscrape.dev/'))
	)
		missing.add('sister-publication or newsstand links');
	for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
		const href = match[1];
		if (!href) continue;
		let url: URL;
		try {
			url = new URL(href.replaceAll('&amp;', '&'), `${origin}${path}`);
		} catch {
			continue;
		}
		if (url.origin !== origin || /\.[a-z0-9]+$/i.test(url.pathname)) continue;
		const target = url.pathname.endsWith('/')
			? url.pathname
			: `${url.pathname}/`;
		if (!visited.has(target)) pending.push(target);
	}
}
const unreachable = manifest.articles.filter(
	(article) => !visited.has(article.url),
);
const failed = manifest.articles.filter(
	(article) => !existsSync(join(root, article.url, 'index.html')),
);
const apiFailures: string[] = [];
const edgeFailures: string[] = [];
const apiPages = new Map<number, Set<string>>();
for (const article of manifest.articles) {
	const htmlPath = join(root, article.url, 'index.html');
	if (existsSync(htmlPath)) {
		const html = readFileSync(htmlPath, 'utf8');
		for (const relatedUrl of article.relatedUrls) {
			if (!html.includes(`href="${relatedUrl}"`))
				edgeFailures.push(`${article.url} -> ${relatedUrl}`);
		}
	}
	try {
		if (!apiPages.has(article.apiPage)) {
			const apiPath = join(root, 'api', 'articles', `${article.apiPage}.json`);
			const response = JSON.parse(readFileSync(apiPath, 'utf8')) as {
				articles: { id: string }[];
			};
			apiPages.set(
				article.apiPage,
				new Set(response.articles.map((item) => item.id)),
			);
		}
		if (!apiPages.get(article.apiPage)?.has(article.id))
			apiFailures.push(article.id);
	} catch {
		apiFailures.push(article.id);
	}
}
try {
	const archive = JSON.parse(
		readFileSync(join(root, 'api', 'archive.json'), 'utf8'),
	) as { articles: { id: string }[] };
	const ids = new Set(archive.articles.map((article) => article.id));
	if (
		ids.size !== manifest.articleCount ||
		manifest.articles.some((article) => !ids.has(article.id))
	)
		apiFailures.push('archive');
} catch {
	apiFailures.push('archive');
}
try {
	const ids = new Set(manifest.articles.map((article) => article.id));
	const latest = JSON.parse(
		readFileSync(join(root, 'api', 'latest.json'), 'utf8'),
	) as { articles: { id: string; title: string }[] };
	if (
		!latest.articles.length ||
		latest.articles.some((article) => !ids.has(article.id) || !article.title)
	)
		apiFailures.push('latest');
	const market = JSON.parse(
		readFileSync(join(root, 'api', 'markets.json'), 'utf8'),
	) as {
		markets: { commodity: string; price: string }[];
		weather: { region: string; conditions: string }[];
	};
	if (
		!market.markets.length ||
		!market.weather.length ||
		market.markets.some((item) => !item.commodity || !item.price) ||
		market.weather.some((item) => !item.region || !item.conditions)
	)
		apiFailures.push('markets');
} catch {
	apiFailures.push('latest or markets');
}
if (
	missing.size ||
	mediaFailures.size ||
	copyFailures.size ||
	unreachable.length ||
	failed.length ||
	apiFailures.length ||
	edgeFailures.length ||
	manifest.articleCount !== manifest.articles.length
) {
	console.error(
		`Broken pages: ${missing.size}; image markup failures: ${mediaFailures.size}; copy failures: ${copyFailures.size}; unreachable articles: ${unreachable.length}; missing article files: ${failed.length}; API mismatches: ${apiFailures.length}; missing related links: ${edgeFailures.length}; manifest articles: ${manifest.articles.length}/${manifest.articleCount}`,
	);
	console.error(
		[
			...missing,
			...mediaFailures,
			...copyFailures,
			...unreachable.slice(0, 10).map((article) => article.url),
		]
			.slice(0, 20)
			.join('\n'),
	);
	console.error([...apiFailures, ...edgeFailures].slice(0, 20).join('\n'));
	process.exitCode = 1;
} else {
	console.log(
		`${publication.shortName}: audited ${visited.size} linked HTML pages and ${imageCount} image elements; all ${manifest.articleCount} expected articles, API IDs and related-story links are present.`,
	);
}
