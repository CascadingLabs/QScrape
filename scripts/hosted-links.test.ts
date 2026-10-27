import assert from 'node:assert/strict';
import { linksInclude } from './lib/hosted-links';
const hub = 'https://news.qscrape.dev/';
assert.equal(
	linksInclude(['/network-manifest.json'], `${hub}network-manifest.json`, hub),
	true,
);
assert.equal(
	linksInclude(['network-manifest.json'], `${hub}network-manifest.json`, hub),
	true,
);
assert.equal(
	linksInclude(
		['https://qsn.qscrape.dev/article/a/'],
		'/article/a/',
		'https://qsn.qscrape.dev/article/b/',
	),
	true,
);
assert.equal(linksInclude(['/'], 'https://qsn.qscrape.dev/', hub), false);
assert.equal(
	linksInclude(
		['https://other.example/article/a/'],
		'/article/a/',
		'https://qsn.qscrape.dev/',
	),
	false,
);
assert.equal(
	linksInclude(
		['http://[', 'javascript:void(0)'],
		`${hub}network-manifest.json`,
		hub,
	),
	false,
);
console.log(
	'Hosted link resolution passed: relative links resolve against their page, and other origins cannot masquerade as sister links.',
);
