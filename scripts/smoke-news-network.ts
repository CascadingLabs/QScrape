import { spawn } from 'node:child_process';
import { publications } from '../qsn/src/data/publications';

const multiplePorts = process.argv.includes('--ports');
const port = multiplePorts ? 4400 : 4399;
const base = `http://127.0.0.1:${port}`;
const keys = ['news', ...publications.map((paper) => paper.key)];
const previewOrigin = (key: string) =>
	multiplePorts
		? `http://127.0.0.1:${port + keys.indexOf(key)}`
		: `http://${key}.localhost:${port}`;
const server = spawn(
	'node',
	[
		'qsn/dist/preview.mjs',
		'--host',
		'127.0.0.1',
		'--port',
		String(port),
		...(multiplePorts ? ['--ports'] : []),
	],
	{ stdio: ['ignore', 'pipe', 'pipe'] },
);
let output = '';
server.stdout.on('data', (data) => {
	output += data;
});
server.stderr.on('data', (data) => {
	output += data;
});
async function request(key: string, path = '/', method = 'GET') {
	return fetch(`${multiplePorts ? previewOrigin(key) : base}${path}`, {
		method,
		headers: multiplePorts ? undefined : { Host: `${key}.localhost:${port}` },
	});
}
try {
	const deadline = Date.now() + 10_000;
	while (true) {
		if (server.exitCode !== null) throw new Error(`Preview exited: ${output}`);
		try {
			if (output.includes('Newsstand:') && (await request('news')).ok) break;
		} catch {
			/* Wait for this specific child to bind. */
		}
		if (Date.now() > deadline)
			throw new Error(`Preview startup timeout: ${output}`);
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	const hub = await (await request('news')).text();
	for (const paper of publications) {
		if (!hub.includes(`${previewOrigin(paper.key)}/`))
			throw new Error(`Hub preview link missing: ${paper.key}`);
		const home = await request(paper.key);
		const html = await home.text();
		if (
			!home.ok ||
			!html.includes(`data-publication="${paper.id}"`) ||
			!html.includes(`data-consent-key="${paper.key}-consent"`) ||
			!html.includes(paper.name)
		)
			throw new Error(`Host routing failed: ${paper.key}`);
		for (const sister of publications.filter((item) => item.id !== paper.id)) {
			if (!html.includes(`${previewOrigin(sister.key)}/`))
				throw new Error(
					`Sister preview link missing: ${paper.key} -> ${sister.key}`,
				);
		}
		const manifest = (await (
			await request(paper.key, '/benchmark-manifest.json')
		).json()) as {
			articleCount: number;
			articles: { id: string; url: string }[];
		};
		if (manifest.articleCount !== paper.articleCount)
			throw new Error(`Wrong host manifest: ${paper.key}`);
		const first = manifest.articles[0];
		if (!first) throw new Error('Empty article inventory');
		if (!(await request(paper.key, first.url)).ok)
			throw new Error(`Article failed: ${paper.key}`);
		const api = (await (
			await request(paper.key, '/api/articles/1.json')
		).json()) as { articles: { id: string }[] };
		if (!api.articles.some((article) => article.id === first.id))
			throw new Error(`API host mismatch: ${paper.key}`);
		const ids = new Set(manifest.articles.map((article) => article.id));
		const latest = (await (
			await request(paper.key, '/api/latest.json')
		).json()) as { articles: { id: string }[] };
		if (
			!latest.articles.length ||
			latest.articles.some((article) => !ids.has(article.id))
		)
			throw new Error(`Latest feed host mismatch: ${paper.key}`);
		const market = (await (
			await request(paper.key, '/api/markets.json')
		).json()) as { markets: unknown[]; weather: unknown[] };
		if (!market.markets.length || !market.weather.length)
			throw new Error(`Market feed failed: ${paper.key}`);
		const photo = /<img\b[^>]*src="([^"]+\.webp)"/.exec(html)?.[1];
		if (!photo) throw new Error(`Optimized photo missing: ${paper.key}`);
		const image = await request(paper.key, photo);
		if (!image.ok || image.headers.get('content-type') !== 'image/webp')
			throw new Error(`Optimized image request failed: ${paper.key}`);
		if ((await request(paper.key, '/not-a-real-story/')).status !== 404)
			throw new Error(`Missing 404: ${paper.key}`);
		if ((await request(paper.key, '/', 'HEAD')).status !== 200)
			throw new Error(`HEAD failed: ${paper.key}`);
	}
	if ((await request('news', '/', 'POST')).status !== 405)
		throw new Error('Preview accepted unsupported write method');
	if ((await request('qsn', '/%2e%2e%2fnetwork-preview.json')).status !== 403)
		throw new Error('Preview allowed path traversal');
	console.log(
		'HTTP smoke passed for all seven hosts, sister links, articles, API records, optimized images, 404s, methods and traversal protection.',
	);
} finally {
	server.kill('SIGTERM');
}
