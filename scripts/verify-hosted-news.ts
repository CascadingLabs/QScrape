import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { publications, type Publication } from '../qsn/src/data/publications';
import { linksInclude } from './lib/hosted-links';

const HUB_ORIGIN = 'https://news.qscrape.dev';
const REPORT_PATH = join(process.cwd(), '.astro', 'hosted-news-report.json');
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [250, 750];

interface CheckRecord {
	label: string;
	url: string;
	finalUrl?: string;
	status: number | null;
	expectedStatus: number;
	durationMs: number;
	attempts: number;
	contentType?: string;
	error?: string;
}

interface FetchResult {
	check: CheckRecord;
	body: Uint8Array;
}

interface ManifestArticle {
	id: string;
	url: string;
	apiPage: number;
	relatedUrls: string[];
}

interface BenchmarkManifest {
	publicationId: string;
	origin: string;
	articleCount: number;
	articles: ManifestArticle[];
	authors: string[];
}

interface ApiArticle {
	id: string;
	title: string;
	summary?: string;
	section?: string;
	publishedAt?: string;
}

interface ArticleApiPage {
	page: number;
	pageSize: number;
	total: number;
	articles: ApiArticle[];
}

interface HubManifest {
	hubOrigin: string;
	publicationCount: number;
	totalArticleCount: number;
	publications: Array<{
		id: string;
		key: string;
		origin: string;
		articleCount: number;
		manifest?: string;
	}>;
	hubLinks: Array<{ from: string; to: string; publicationId: string }>;
	hubReturnLinks: Array<{ from: string; to: string }>;
	sisterEdges: Array<{
		sourceId: string;
		destinationId: string;
		sourceOrigin: string;
		destinationOrigin: string;
	}>;
}

const checks: CheckRecord[] = [];
const failures: string[] = [];
const utf8 = new TextDecoder();

function recordFailure(message: string): void {
	failures.push(message);
}

function check(condition: boolean, message: string): void {
	if (!condition) recordFailure(message);
}

function pause(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function errorMessage(error: unknown): string {
	return error instanceof Error
		? `${error.name}: ${error.message}`
		: String(error);
}

function isTransientNetworkError(error: unknown): boolean {
	return (
		error instanceof TypeError ||
		(error instanceof Error &&
			['AbortError', 'TimeoutError', 'NetworkError'].includes(error.name))
	);
}

async function fetchRecorded(
	label: string,
	url: string,
	expectedStatus = 200,
): Promise<FetchResult | undefined> {
	const startedAt = Date.now();
	let requestedOrigin: string;
	try {
		requestedOrigin = new URL(url).origin;
	} catch (error) {
		const checkRecord: CheckRecord = {
			label,
			url,
			status: null,
			expectedStatus,
			durationMs: Date.now() - startedAt,
			attempts: 0,
			error: errorMessage(error),
		};
		checks.push(checkRecord);
		recordFailure(`${label}: invalid request URL: ${errorMessage(error)}`);
		return undefined;
	}
	let attempts = 0;
	let lastError = '';

	while (attempts < MAX_ATTEMPTS) {
		attempts += 1;
		let response: Response;
		try {
			response = await fetch(url, {
				headers: { 'User-Agent': 'QScrape-News-Hosted-Verifier/1.0' },
				redirect: 'manual',
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
		} catch (error) {
			lastError = errorMessage(error);
			if (isTransientNetworkError(error) && attempts < MAX_ATTEMPTS) {
				await pause(
					RETRY_DELAYS_MS[attempts - 1] ?? RETRY_DELAYS_MS.at(-1) ?? 750,
				);
				continue;
			}
			const checkRecord: CheckRecord = {
				label,
				url,
				status: null,
				expectedStatus,
				durationMs: Date.now() - startedAt,
				attempts,
				error: lastError,
			};
			checks.push(checkRecord);
			recordFailure(
				`${label}: request failed after ${attempts} attempts: ${lastError}`,
			);
			return undefined;
		}

		if (
			response.status >= 500 &&
			response.status <= 599 &&
			attempts < MAX_ATTEMPTS
		) {
			try {
				await response.body?.cancel();
			} catch {
				// The next bounded request is still useful if the error body could not be cancelled.
			}
			await pause(
				RETRY_DELAYS_MS[attempts - 1] ?? RETRY_DELAYS_MS.at(-1) ?? 750,
			);
			continue;
		}

		const contentType = response.headers.get('content-type') ?? undefined;
		let body = new Uint8Array();
		if (response.status < 500 || response.status > 599) {
			try {
				body = new Uint8Array(await response.arrayBuffer());
			} catch (error) {
				lastError = errorMessage(error);
				if (isTransientNetworkError(error) && attempts < MAX_ATTEMPTS) {
					await pause(
						RETRY_DELAYS_MS[attempts - 1] ?? RETRY_DELAYS_MS.at(-1) ?? 750,
					);
					continue;
				}
				const checkRecord: CheckRecord = {
					label,
					url,
					finalUrl: response.url,
					status: response.status,
					expectedStatus,
					durationMs: Date.now() - startedAt,
					attempts,
					contentType,
					error: lastError,
				};
				checks.push(checkRecord);
				recordFailure(
					`${label}: response body failed after ${attempts} attempts: ${lastError}`,
				);
				return undefined;
			}
		} else {
			try {
				await response.body?.cancel();
			} catch {
				// The status and URL remain sufficient evidence for a final server error.
			}
		}
		const checkRecord: CheckRecord = {
			label,
			url,
			finalUrl: response.url,
			status: response.status,
			expectedStatus,
			durationMs: Date.now() - startedAt,
			attempts,
			contentType,
		};
		checks.push(checkRecord);
		try {
			const responseOrigin = new URL(response.url).origin;
			if (responseOrigin !== requestedOrigin) {
				recordFailure(
					`${label}: redirected across origins from ${requestedOrigin} to ${responseOrigin}`,
				);
			}
		} catch (error) {
			recordFailure(`${label}: invalid response URL: ${errorMessage(error)}`);
		}
		return { check: checkRecord, body };
	}

	recordFailure(`${label}: request loop ended without a response`);
	return undefined;
}

function expectStatus(
	result: FetchResult | undefined,
	expected: number,
	label: string,
): boolean {
	if (!result) return false;
	if (result.check.status !== expected) {
		recordFailure(
			`${label}: expected HTTP ${expected}, received ${result.check.status}`,
		);
		return false;
	}
	return true;
}

function expectContentType(
	result: FetchResult | undefined,
	pattern: RegExp,
	label: string,
): void {
	if (!result || !result.check.contentType) {
		recordFailure(`${label}: missing content-type header`);
		return;
	}
	if (!pattern.test(result.check.contentType)) {
		recordFailure(
			`${label}: unexpected content-type ${result.check.contentType}`,
		);
	}
}

function responseText(result: FetchResult): string {
	return utf8.decode(result.body);
}

async function fetchText(
	label: string,
	url: string,
	expectedStatus = 200,
	expectedContentType = /text\/html/i,
): Promise<string | undefined> {
	const result = await fetchRecorded(label, url, expectedStatus);
	if (!result || !expectStatus(result, expectedStatus, label)) return undefined;
	expectContentType(result, expectedContentType, label);
	return responseText(result);
}

async function fetchJson<T>(
	label: string,
	url: string,
): Promise<T | undefined> {
	const result = await fetchRecorded(label, url);
	if (!result || !expectStatus(result, 200, label)) return undefined;
	expectContentType(result, /application\/json/i, label);
	try {
		return JSON.parse(responseText(result)) as T;
	} catch (error) {
		recordFailure(`${label}: invalid JSON: ${errorMessage(error)}`);
		return undefined;
	}
}

function decodeHtml(value: string): string {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;/gi, "'")
		.replace(/&#(\d+);/g, (_, decimal: string) => {
			const codepoint = Number(decimal);
			return Number.isInteger(codepoint) &&
				codepoint >= 0 &&
				codepoint <= 0x10ffff
				? String.fromCodePoint(codepoint)
				: '';
		})
		.replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
			const codepoint = Number.parseInt(hex, 16);
			return Number.isInteger(codepoint) &&
				codepoint >= 0 &&
				codepoint <= 0x10ffff
				? String.fromCodePoint(codepoint)
				: '';
		});
}

function getAttribute(tag: string, name: string): string | undefined {
	const match = new RegExp(
		`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`,
		'i',
	).exec(tag);
	return match?.[2] ? decodeHtml(match[2]) : undefined;
}

function extractTag(html: string, name: string): string | undefined {
	return new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i').exec(
		html,
	)?.[1];
}

function extractCanonical(html: string): string | undefined {
	const links = html.match(/<link\b[^>]*>/gi) ?? [];
	const canonical = links.find(
		(tag) => getAttribute(tag, 'rel')?.toLowerCase() === 'canonical',
	);
	return canonical ? getAttribute(canonical, 'href') : undefined;
}

function extractLinks(html: string): string[] {
	return (html.match(/<a\b[^>]*>/gi) ?? [])
		.map((tag) => getAttribute(tag, 'href'))
		.filter((href): href is string => Boolean(href));
}

function hasLink(html: string, href: string, pageUrl: string): boolean {
	return linksInclude(extractLinks(html), href, pageUrl);
}

function hasHtmlAttribute(
	html: string,
	tagName: string,
	name: string,
	value: string,
): boolean {
	const tag = new RegExp(`<${tagName}\\b[^>]*>`, 'i').exec(html)?.[0];
	return tag !== undefined && getAttribute(tag, name) === value;
}

function checkCanonical(html: string, expected: string, label: string): void {
	const actual = extractCanonical(html);
	check(
		actual === expected,
		`${label}: canonical expected ${expected}, received ${actual ?? 'none'}`,
	);
}

function checkPublicationBrand(
	html: string,
	publication: Publication,
	label: string,
): void {
	const selected =
		hasHtmlAttribute(html, 'html', 'data-publication', publication.id) ||
		hasHtmlAttribute(html, 'html', 'data-publication', publication.key);
	check(
		selected,
		`${label}: html data-publication is not ${publication.id} or ${publication.key}`,
	);
	check(
		html.includes(publication.shortName) && html.includes(publication.name),
		`${label}: publication branding is missing ${publication.shortName} or ${publication.name}`,
	);
}

function parseSitemapChild(
	indexXml: string,
	origin: string,
	label: string,
): string | undefined {
	if (!/<sitemapindex\b/i.test(indexXml)) {
		recordFailure(`${label}: sitemap index root element is missing`);
		return undefined;
	}
	const loc = /<loc>\s*([\s\S]*?)\s*<\/loc>/i.exec(indexXml)?.[1];
	if (!loc) {
		recordFailure(`${label}: sitemap index has no child location`);
		return undefined;
	}
	const childUrl = decodeHtml(loc.trim());
	try {
		const child = new URL(childUrl);
		const childHost = child.host;
		const expectedHost = new URL(origin).host;
		if (child.protocol !== 'https:' || childHost !== expectedHost) {
			recordFailure(
				`${label}: child sitemap must stay on https://${expectedHost}, received ${childUrl}`,
			);
			return undefined;
		}
		return child.href;
	} catch {
		recordFailure(
			`${label}: child sitemap location is not an absolute URL: ${childUrl}`,
		);
		return undefined;
	}
}

async function verifyRobotsAndSitemap(
	origin: string,
	label: string,
): Promise<void> {
	const normalized = origin.replace(/\/+$/, '');
	const robotsUrl = `${normalized}/robots.txt`;
	const robotsText = await fetchText(
		`${label} robots`,
		robotsUrl,
		200,
		/text\/plain/i,
	);
	if (robotsText !== undefined) {
		check(
			/user-agent:\s*\*/i.test(robotsText),
			`${label} robots: wildcard user-agent is missing`,
		);
		check(
			robotsText.includes(`${normalized}/sitemap-index.xml`),
			`${label} robots: sitemap URL does not point to the site's own origin`,
		);
	}

	const indexUrl = `${normalized}/sitemap-index.xml`;
	const sitemapIndex = await fetchText(
		`${label} sitemap index`,
		indexUrl,
		200,
		/(?:application|text)\/xml/i,
	);
	if (sitemapIndex === undefined) return;
	const childUrl = parseSitemapChild(
		sitemapIndex,
		normalized,
		`${label} sitemap index`,
	);
	if (!childUrl) return;
	const childXml = await fetchText(
		`${label} sitemap child`,
		childUrl,
		200,
		/(?:application|text)\/xml/i,
	);
	if (childXml !== undefined) {
		check(
			/<urlset\b/i.test(childXml),
			`${label} sitemap child: urlset root element is missing`,
		);
		check(
			childXml.includes(normalized),
			`${label} sitemap child: no URLs belong to its own origin`,
		);
	}
}

function parseJsonOrFail<T>(text: string, label: string): T | undefined {
	try {
		return JSON.parse(text) as T;
	} catch (error) {
		recordFailure(`${label}: invalid JSON: ${errorMessage(error)}`);
		return undefined;
	}
}

async function fetchJsonResult<T>(
	label: string,
	url: string,
): Promise<T | undefined> {
	const result = await fetchRecorded(label, url);
	if (!result || !expectStatus(result, 200, label)) return undefined;
	expectContentType(result, /application\/json/i, label);
	const parsed = parseJsonOrFail<T>(responseText(result), label);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		recordFailure(`${label}: JSON root must be an object`);
		return undefined;
	}
	return parsed;
}

async function verifyHub(): Promise<void> {
	const hubOrigin = `${HUB_ORIGIN}/`;
	const html = await fetchText('hub home', hubOrigin);
	if (html !== undefined) {
		checkCanonical(html, hubOrigin, 'hub home');
		check(
			hasLink(html, `${HUB_ORIGIN}/network-manifest.json`, hubOrigin),
			'hub home: network manifest link is missing',
		);
		for (const publication of publications) {
			const origin = `${publication.origin.replace(/\/+$/, '')}/`;
			check(
				hasLink(html, origin, hubOrigin),
				`hub home: publication link is missing for ${publication.key}`,
			);
			check(
				hasLink(html, `${origin}benchmark-manifest.json`, hubOrigin),
				`hub home: benchmark manifest link is missing for ${publication.key}`,
			);
		}
	}

	const network = await fetchJsonResult<HubManifest>(
		'hub network manifest',
		`${HUB_ORIGIN}/network-manifest.json`,
	);
	if (network) {
		const expectedTotal = publications.reduce(
			(total, paper) => total + paper.articleCount,
			0,
		);
		const networkPublications = Array.isArray(network.publications)
			? network.publications
			: [];
		const hubLinks = Array.isArray(network.hubLinks) ? network.hubLinks : [];
		const hubReturnLinks = Array.isArray(network.hubReturnLinks)
			? network.hubReturnLinks
			: [];
		const sisterEdges = Array.isArray(network.sisterEdges)
			? network.sisterEdges
			: [];
		check(
			Array.isArray(network.publications),
			'hub manifest: publications must be an array',
		);
		check(
			Array.isArray(network.hubLinks),
			'hub manifest: hubLinks must be an array',
		);
		check(
			Array.isArray(network.hubReturnLinks),
			'hub manifest: hubReturnLinks must be an array',
		);
		check(
			Array.isArray(network.sisterEdges),
			'hub manifest: sisterEdges must be an array',
		);
		check(
			network.hubOrigin === `${HUB_ORIGIN}/`,
			'hub manifest: hub origin mismatch',
		);
		check(
			network.publicationCount === publications.length,
			'hub manifest: publication count does not match registry',
		);
		check(
			network.totalArticleCount === expectedTotal,
			`hub manifest: total article count must be ${expectedTotal}`,
		);
		check(
			networkPublications.length === publications.length,
			'hub manifest: publication inventory length does not match registry',
		);
		check(
			hubLinks.length === publications.length,
			'hub manifest: hub link count does not match registry',
		);
		check(
			hubReturnLinks.length === publications.length,
			'hub manifest: return link count does not match registry',
		);
		check(
			sisterEdges.length === publications.length * (publications.length - 1),
			'hub manifest: directed sister edge count does not match registry',
		);
		for (const publication of publications) {
			const origin = `${publication.origin.replace(/\/+$/, '')}/`;
			const entry = networkPublications.find(
				(item) => item?.id === publication.id,
			);
			check(
				Boolean(entry),
				`hub manifest: publication ${publication.id} is missing`,
			);
			if (entry) {
				check(
					entry.key === publication.key,
					`hub manifest: key mismatch for ${publication.id}`,
				);
				check(
					entry.origin === origin,
					`hub manifest: origin mismatch for ${publication.id}`,
				);
				check(
					entry.articleCount === publication.articleCount,
					`hub manifest: article count mismatch for ${publication.id}`,
				);
				check(
					entry.manifest === `${origin}benchmark-manifest.json`,
					`hub manifest: benchmark manifest URL mismatch for ${publication.id}`,
				);
			}
			check(
				hubLinks.some(
					(edge) =>
						edge?.publicationId === publication.id &&
						edge.from === `${HUB_ORIGIN}/` &&
						edge.to === origin,
				),
				`hub manifest: publication edge missing for ${publication.id}`,
			);
			check(
				hubReturnLinks.some(
					(edge) => edge?.from === origin && edge.to === `${HUB_ORIGIN}/`,
				),
				`hub manifest: return edge missing for ${publication.id}`,
			);
			for (const sister of publications) {
				if (sister.id === publication.id) continue;
				const sisterOrigin = `${sister.origin.replace(/\/+$/, '')}/`;
				check(
					sisterEdges.some(
						(edge) =>
							edge?.sourceId === publication.id &&
							edge.destinationId === sister.id &&
							edge.sourceOrigin === origin &&
							edge.destinationOrigin === sisterOrigin,
					),
					`hub manifest: sister edge missing from ${publication.id} to ${sister.id}`,
				);
			}
		}
	}

	await verifyRobotsAndSitemap(HUB_ORIGIN, 'hub');
}

async function verifyRootSite(): Promise<void> {
	const html = await fetchText('QScrape root index', 'https://qscrape.dev/');
	if (html !== undefined)
		check(
			hasLink(html, `${HUB_ORIGIN}/`, 'https://qscrape.dev/'),
			'QScrape root index: newsstand link is missing',
		);
	const shop = await fetchText(
		'Existing HTML eShop',
		'https://qscrape.dev/eshop/html/',
	);
	if (shop !== undefined)
		check(
			shop.includes('obj-001') && shop.includes('Arc desk lamp'),
			'Existing HTML eShop catalogue changed',
		);
	const catalogue = await fetchJson<{
		data: { id: string; price: number }[];
		count: number;
		currency: string;
		priceUnit: string;
	}>('Existing eShop Functions API', 'https://qscrape.dev/api/eshop/products/');
	if (catalogue)
		check(
			Array.isArray(catalogue.data) &&
				catalogue.count === 6 &&
				catalogue.currency === 'USD' &&
				catalogue.priceUnit === 'cents' &&
				catalogue.data.some(
					(product) => product.id === 'obj-001' && product.price === 6800,
				),
			'Existing eShop Functions API no longer matches the fixture',
		);
}

async function verifyPublication(publication: Publication): Promise<void> {
	const origin = publication.origin.replace(/\/+$/, '');
	const homepageUrl = `${origin}/`;
	const homepage = await fetchText(`${publication.key} home`, homepageUrl);
	if (homepage !== undefined) {
		checkCanonical(homepage, homepageUrl, `${publication.key} home`);
		checkPublicationBrand(homepage, publication, `${publication.key} home`);
		for (const sister of publications) {
			if (sister.id === publication.id) continue;
			const sisterOrigin = `${sister.origin.replace(/\/+$/, '')}/`;
			check(
				hasLink(homepage, sisterOrigin, homepageUrl),
				`${publication.key} home: sister publication link is missing for ${sister.key}`,
			);
		}
		check(
			hasLink(homepage, `${HUB_ORIGIN}/`, homepageUrl),
			`${publication.key} home: newsstand return link is missing`,
		);
	}

	const manifest = await fetchJsonResult<BenchmarkManifest>(
		`${publication.key} benchmark manifest`,
		`${origin}/benchmark-manifest.json`,
	);
	if (manifest) {
		const manifestArticles = Array.isArray(manifest.articles)
			? manifest.articles
			: [];
		const authorIds = Array.isArray(manifest.authors) ? manifest.authors : [];
		check(
			Array.isArray(manifest.articles),
			`${publication.key} benchmark manifest: articles must be an array`,
		);
		check(
			Array.isArray(manifest.authors),
			`${publication.key} benchmark manifest: authors must be an array`,
		);
		check(
			manifest.publicationId === publication.id,
			`${publication.key} benchmark manifest: publication ID mismatch`,
		);
		check(
			typeof manifest.origin === 'string' &&
				manifest.origin.replace(/\/+$/, '') === origin,
			`${publication.key} benchmark manifest: origin mismatch`,
		);
		check(
			manifest.articleCount === publication.articleCount,
			`${publication.key} benchmark manifest: article count mismatch`,
		);
		check(
			manifestArticles.length === publication.articleCount,
			`${publication.key} benchmark manifest: article inventory length mismatch`,
		);
		check(
			authorIds.length > 0,
			`${publication.key} benchmark manifest: no authors declared`,
		);
	}

	const latest = await fetchJsonResult<{ articles: ApiArticle[] }>(
		`${publication.key} latest API`,
		`${origin}/api/latest.json`,
	);
	if (latest) {
		const latestArticles = Array.isArray(latest.articles)
			? latest.articles
			: [];
		check(
			Array.isArray(latest.articles),
			`${publication.key} latest API: articles must be an array`,
		);
		check(
			latestArticles.length > 0,
			`${publication.key} latest API: article list is empty`,
		);
		const knownIds = new Set(
			manifest && Array.isArray(manifest.articles)
				? manifest.articles
						.filter((article) => typeof article?.id === 'string')
						.map((article) => article.id)
				: [],
		);
		for (const article of latestArticles) {
			check(
				Boolean(
					article?.id &&
					article.title &&
					article.summary &&
					article.section &&
					article.publishedAt,
				),
				`${publication.key} latest API: incomplete article record ${article?.id ?? 'unknown'}`,
			);
			if (knownIds.size && article?.id)
				check(
					knownIds.has(article.id),
					`${publication.key} latest API: unknown article ID ${article.id}`,
				);
		}
	}

	const markets = await fetchJsonResult<{
		asOf: string;
		markets: Array<{ commodity: string; price: string; note: string }>;
		weather: Array<{ region: string; conditions: string }>;
	}>(`${publication.key} market API`, `${origin}/api/markets.json`);
	if (markets) {
		const marketItems = Array.isArray(markets.markets) ? markets.markets : [];
		const weatherItems = Array.isArray(markets.weather) ? markets.weather : [];
		check(
			Boolean(markets.asOf),
			`${publication.key} market API: snapshot time is missing`,
		);
		check(
			Array.isArray(markets.markets),
			`${publication.key} market API: markets must be an array`,
		);
		check(
			Array.isArray(markets.weather),
			`${publication.key} market API: weather must be an array`,
		);
		check(
			marketItems.length > 0,
			`${publication.key} market API: market list is empty`,
		);
		check(
			weatherItems.length > 0,
			`${publication.key} market API: weather list is empty`,
		);
		for (const item of marketItems) {
			check(
				Boolean(item?.commodity && item.price && item.note),
				`${publication.key} market API: incomplete market item`,
			);
		}
		for (const item of weatherItems) {
			check(
				Boolean(item?.region && item.conditions),
				`${publication.key} market API: incomplete weather item`,
			);
		}
	}

	if (
		manifest &&
		Array.isArray(manifest.articles) &&
		manifest.articles.length > 0
	) {
		const manifestArticles = manifest.articles;
		const sampleIndexes = [
			...new Set([
				0,
				Math.floor(manifestArticles.length / 2),
				manifestArticles.length - 1,
			]),
		];
		const apiPageCache = new Map<number, ArticleApiPage>();
		for (const index of sampleIndexes) {
			const articleEntry = manifestArticles[index];
			if (!articleEntry) {
				recordFailure(
					`${publication.key} manifest sample ${index}: article record is missing`,
				);
				continue;
			}
			if (
				typeof articleEntry.id !== 'string' ||
				typeof articleEntry.url !== 'string' ||
				!Number.isInteger(articleEntry.apiPage) ||
				!Array.isArray(articleEntry.relatedUrls)
			) {
				recordFailure(
					`${publication.key} manifest sample ${index}: article record has an invalid shape`,
				);
				continue;
			}
			if (
				!articleEntry.url.startsWith('/article/') ||
				!articleEntry.url.endsWith('/')
			) {
				recordFailure(
					`${publication.key} manifest sample ${articleEntry.id}: invalid article URL ${articleEntry.url}`,
				);
				continue;
			}

			let apiPage = apiPageCache.get(articleEntry.apiPage);
			if (!apiPage) {
				const fetchedApiPage = await fetchJsonResult<ArticleApiPage>(
					`${publication.key} article API page ${articleEntry.apiPage}`,
					`${origin}/api/articles/${articleEntry.apiPage}.json`,
				);
				if (!fetchedApiPage) continue;
				apiPage = fetchedApiPage;
				apiPageCache.set(articleEntry.apiPage, apiPage);
			}
			check(
				apiPage.page === articleEntry.apiPage,
				`${publication.key} article API page ${articleEntry.apiPage}: page number mismatch`,
			);
			check(
				apiPage.pageSize === 100,
				`${publication.key} article API page ${articleEntry.apiPage}: page size is not 100`,
			);
			check(
				apiPage.total === publication.articleCount,
				`${publication.key} article API page ${articleEntry.apiPage}: total count mismatch`,
			);
			const apiPageArticles = Array.isArray(apiPage.articles)
				? apiPage.articles
				: [];
			check(
				Array.isArray(apiPage.articles),
				`${publication.key} article API page ${articleEntry.apiPage}: articles must be an array`,
			);
			const apiArticle = apiPageArticles.find(
				(item) => item?.id === articleEntry.id,
			);
			check(
				Boolean(apiArticle?.title),
				`${publication.key} article API page ${articleEntry.apiPage}: article ${articleEntry.id} or title missing`,
			);

			const articleUrl = new URL(articleEntry.url, `${origin}/`).href;
			const articleHtml = await fetchText(
				`${publication.key} article ${articleEntry.id}`,
				articleUrl,
			);
			if (articleHtml === undefined || !apiArticle) continue;
			checkPublicationBrand(
				articleHtml,
				publication,
				`${publication.key} article ${articleEntry.id}`,
			);
			checkCanonical(
				articleHtml,
				articleUrl,
				`${publication.key} article ${articleEntry.id}`,
			);
			const heading = extractTag(articleHtml, 'h1');
			check(
				Boolean(
					heading &&
					decodeHtml(heading.replace(/<[^>]+>/g, '').trim()) ===
						apiArticle.title,
				),
				`${publication.key} article ${articleEntry.id}: heading does not match API title`,
			);
			const relatedUrls = Array.isArray(articleEntry.relatedUrls)
				? articleEntry.relatedUrls
				: [];
			check(
				Array.isArray(articleEntry.relatedUrls),
				`${publication.key} manifest sample ${articleEntry.id}: relatedUrls must be an array`,
			);
			for (const relatedUrl of relatedUrls) {
				check(
					hasLink(articleHtml, relatedUrl, articleUrl),
					`${publication.key} article ${articleEntry.id}: declared related link is missing: ${relatedUrl}`,
				);
			}
		}
	}

	const authorIds =
		manifest && Array.isArray(manifest.authors) ? manifest.authors : [];
	const authorId = authorIds.find(
		(value): value is string => typeof value === 'string' && value.length > 0,
	);
	if (authorId) {
		const authorUrl = `${origin}/author/${encodeURIComponent(authorId)}/`;
		const authorHtml = await fetchText(
			`${publication.key} author ${authorId}`,
			authorUrl,
		);
		if (authorHtml !== undefined) {
			checkPublicationBrand(
				authorHtml,
				publication,
				`${publication.key} author ${authorId}`,
			);
			checkCanonical(
				authorHtml,
				authorUrl,
				`${publication.key} author ${authorId}`,
			);
			const portrait = (authorHtml.match(/<img\b[^>]*>/gi) ?? []).find(
				(tag) => {
					const alt = getAttribute(tag, 'alt') ?? '';
					return /^Portrait of .+/.test(alt);
				},
			);
			const portraitUrl = portrait ? getAttribute(portrait, 'src') : undefined;
			check(
				Boolean(portraitUrl),
				`${publication.key} author ${authorId}: optimized portrait image is missing`,
			);
			if (portraitUrl) {
				check(
					/\.webp(?:\?|$)/i.test(portraitUrl),
					`${publication.key} author ${authorId}: portrait is not WebP`,
				);
				try {
					const imageUrl = new URL(portraitUrl, `${origin}/`);
					if (imageUrl.origin !== origin) {
						recordFailure(
							`${publication.key} author ${authorId}: portrait URL leaves publication origin`,
						);
					} else {
						const image = await fetchRecorded(
							`${publication.key} author portrait ${authorId}`,
							imageUrl.href,
						);
						if (
							image &&
							expectStatus(
								image,
								200,
								`${publication.key} author portrait ${authorId}`,
							)
						) {
							expectContentType(
								image,
								/^image\/webp\b/i,
								`${publication.key} author portrait ${authorId}`,
							);
							const riff = utf8.decode(image.body.slice(0, 4));
							const webp = utf8.decode(image.body.slice(8, 12));
							check(
								riff === 'RIFF' && webp === 'WEBP',
								`${publication.key} author portrait ${authorId}: WebP signature is invalid`,
							);
						}
					}
				} catch (error) {
					recordFailure(
						`${publication.key} author ${authorId}: invalid portrait URL: ${errorMessage(error)}`,
					);
				}
			}
		} else {
			recordFailure(
				`${publication.key}: author IDs are present in manifest but no author page was checked`,
			);
		}
	} else if (manifest) {
		recordFailure(
			`${publication.key} benchmark manifest: no representative author ID is available`,
		);
	}

	const missingPath = `${origin}/__hosted-news-verification__/no-such-page/`;
	const missingHtml = await fetchText(
		`${publication.key} predictable missing page`,
		missingPath,
		404,
	);
	if (missingHtml !== undefined) {
		check(
			/we couldn[’']t find that page|not found/i.test(decodeHtml(missingHtml)),
			`${publication.key} missing page: 404 content is not the publication's not-found page`,
		);
	}

	await verifyRobotsAndSitemap(origin, publication.key);
}

async function main(): Promise<void> {
	const startedAt = new Date().toISOString();
	const runStarted = Date.now();
	try {
		await verifyRootSite();
	} catch (error) {
		recordFailure(
			`Unexpected root-site verifier error: ${errorMessage(error)}`,
		);
	}
	try {
		await verifyHub();
	} catch (error) {
		recordFailure(`Unexpected hub verifier error: ${errorMessage(error)}`);
	}
	for (const publication of publications) {
		try {
			await verifyPublication(publication);
		} catch (error) {
			recordFailure(
				`${publication.key}: unexpected verifier error: ${errorMessage(error)}`,
			);
		}
	}

	const report = {
		startedAt,
		finishedAt: new Date().toISOString(),
		durationMs: Date.now() - runStarted,
		hubOrigin: HUB_ORIGIN,
		publicationCount: publications.length,
		expectedArticleCount: publications.reduce(
			(total, paper) => total + paper.articleCount,
			0,
		),
		requestPolicy: {
			concurrentRequests: 1,
			timeoutMsPerAttempt: REQUEST_TIMEOUT_MS,
			maximumAttempts: MAX_ATTEMPTS,
			retryable: ['network errors', 'HTTP 5xx'],
		},
		requestCount: checks.length,
		passed: failures.length === 0,
		checkedUrls: checks,
		failures,
	};

	try {
		mkdirSync(join(process.cwd(), '.astro'), { recursive: true });
		writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
	} catch (error) {
		recordFailure(
			`Could not write hosted evidence report ${REPORT_PATH}: ${errorMessage(error)}`,
		);
		process.exitCode = 1;
	}

	console.log(
		JSON.stringify({
			passed: failures.length === 0,
			checkedUrls: checks.length,
			failedAssertions: failures.length,
			report: REPORT_PATH,
		}),
	);
	if (failures.length) {
		console.error(failures.join('\n'));
		process.exitCode = 1;
	}
}

void main();
