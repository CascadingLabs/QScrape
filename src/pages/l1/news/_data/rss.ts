import { type ArticleMeta, getLatest, getByCategory } from './articles';

const CHANNEL_STATIC = {
	language: 'en',
	copyright: '© 2026 Mountainhome Herald. All rights reserved.',
	managingEditor: 'editor@herald.mh (Morul Chiselmark)',
	webMaster: 'tech@herald.mh (Herald Technical Services)',
	ttl: 15,
	generator: 'Mountainhome Herald CMS v1.0.2004',
};

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** Build a sentinel-encoded article URL identical to navigateToArticle() in HeraldShell */
function articleUrl(site: string, a: ArticleMeta): string {
	const hash = a.id.replace(/-/g, '').toLowerCase() + 'rss';
	const payload =
		'MHH_v1_Kp9rXm2bQs' +
		'XXXNNNXXX' +
		'ID=' + encodeURIComponent(a.id) + '&HASH=' + hash +
		'XXXNNNXXX' +
		'tR7vYw1hF3dG' +
		'XXXNNNXXX';
	return `${site}/l1/news/article?postData=${encodeURIComponent(payload)}&utm_source=rss&utm_medium=feed&utm_campaign=herald_rss&utm_content=${a.id}`;
}

function itemXml(site: string, a: ArticleMeta): string {
	const pubDate = new Date(a.published).toUTCString();
	const url = articleUrl(site, a);
	return `    <item>
      <title>${escapeXml(a.headline)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="false">${a.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(a.author)}</dc:creator>
      <category>${escapeXml(a.category)}</category>
      <description><![CDATA[${a.excerpt}]]></description>
      <content:encoded><![CDATA[<p>${a.excerpt}</p><p><a href="${escapeXml(url)}">Read full article »</a></p>]]></content:encoded>
      <media:content url="${a.image}" medium="image" />
      <media:description>${escapeXml(a.imageCaption)}</media:description>
    </item>`;
}

export function buildFeed(opts: {
	site: string;
	title: string;
	description: string;
	feedUrl: string;
	items: ArticleMeta[];
}): string {
	const lastBuild =
		opts.items.length > 0
			? new Date(opts.items[0].published).toUTCString()
			: new Date('2026-03-11T21:00:00').toUTCString();

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(opts.title)}</title>
    <link>${opts.site}/l1/news/</link>
    <atom:link href="${opts.site}${opts.feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(opts.description)}</description>
    <language>${CHANNEL_STATIC.language}</language>
    <copyright>${CHANNEL_STATIC.copyright}</copyright>
    <managingEditor>${CHANNEL_STATIC.managingEditor}</managingEditor>
    <webMaster>${CHANNEL_STATIC.webMaster}</webMaster>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <ttl>${CHANNEL_STATIC.ttl}</ttl>
    <generator>${CHANNEL_STATIC.generator}</generator>
    <image>
      <url>${opts.site}/favicon.ico</url>
      <title>${escapeXml(opts.title)}</title>
      <link>${opts.site}/l1/news/</link>
    </image>
${opts.items.map((a) => itemXml(opts.site, a)).join('\n')}
  </channel>
</rss>`;
}

export function allFeed(site: string): string {
	return buildFeed({
		site,
		title: 'Mountainhome Herald — All Stories',
		description:
			'Complete feed of all Mountainhome Herald articles across all categories',
		feedUrl: '/l1/news/rss/all.xml',
		items: getLatest(),
	});
}

export function categoryFeed(site: string, category: string): string {
	const descriptions: Record<string, string> = {
		Politics:
			'Arcane Council proceedings, legislation, diplomatic relations, and Grand Duchy governance',
		Crime: 'Fortress Guard reports, criminal cases, civil suits, and public safety incidents',
		Economy:
			'Commodity markets, property transactions, guild reports, and commercial development',
		Culture:
			'Arts, theatre, museum exhibitions, awards, and cultural events across the fortress',
		Sports:
			'Wrestling league coverage, Z-Level Games results, and athletic competition',
		Weather:
			'Geomantic reports, seismic advisories, surface conditions, and subterranean stability',
	};
	const slug = category.toLowerCase();
	const items = getByCategory(category).sort(
		(a, b) =>
			new Date(b.published).getTime() - new Date(a.published).getTime(),
	);
	return buildFeed({
		site,
		title: `Mountainhome Herald — ${category}`,
		description:
			descriptions[category] ||
			`${category} articles from the Mountainhome Herald`,
		feedUrl: `/l1/news/rss/${slug}.xml`,
		items,
	});
}
