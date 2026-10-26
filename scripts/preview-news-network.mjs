import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync, createReadStream } from 'node:fs';
import { resolve, dirname, extname, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const option = (name, fallback) => {
	const index = args.indexOf(name);
	return index >= 0 ? (args[index + 1] ?? fallback) : fallback;
};
const candidates = [
	resolve('qsn/dist'),
	dirname(fileURLToPath(import.meta.url)),
];
const root = resolve(
	option(
		'--root',
		candidates.find((path) => existsSync(join(path, 'network-preview.json'))) ??
			candidates[0],
	),
);
const port = Number(option('--port', '4329'));
const host = option('--host', '127.0.0.1');
const multiplePorts = args.includes('--ports');
if (!Number.isInteger(port) || port < 1 || port > 65535)
	throw new Error('Choose a valid preview port.');
if (!existsSync(join(root, 'network-preview.json')))
	throw new Error('Build the network first with vp run news:build.');
const network = JSON.parse(
	readFileSync(join(root, 'network-preview.json'), 'utf8'),
);
const sites = [network.hub, ...network.publications];
if (multiplePorts && port + sites.length - 1 > 65535)
	throw new Error('The preview port range exceeds 65535.');
const types = {
	'.html': 'text/html; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
	'.xml': 'application/xml',
	'.txt': 'text/plain; charset=utf-8',
	'.woff2': 'font/woff2',
};

function handle(request, response, selectedSite) {
	try {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
			return;
		}
		const url = new URL(
			request.url ?? '/',
			`http://${request.headers.host ?? 'localhost'}`,
		);
		const hostname = url.hostname.toLowerCase();
		const key = hostname.split('.')[0];
		const site =
			selectedSite ??
			sites.find(
				(item) =>
					item.key === key || new URL(item.origin).hostname === hostname,
			) ??
			network.hub;
		const siteRoot = resolve(root, site.key);
		let path = resolve(siteRoot, `.${decodeURIComponent(url.pathname)}`);
		if (path !== siteRoot && !path.startsWith(`${siteRoot}${sep}`)) {
			response.writeHead(403).end('Forbidden');
			return;
		}
		if (existsSync(path) && statSync(path).isDirectory())
			path = join(path, 'index.html');
		let status = 200;
		if (!existsSync(path) || !statSync(path).isFile()) {
			path = join(siteRoot, '404.html');
			status = 404;
			if (!existsSync(path)) {
				response.writeHead(404).end('Not found');
				return;
			}
		}
		const extension = extname(path);
		response.writeHead(status, {
			'Content-Type': types[extension] ?? 'application/octet-stream',
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
		});
		if (request.method === 'HEAD') {
			response.end();
			return;
		}
		if (['.html', '.json', '.xml', '.txt'].includes(extension)) {
			let text = readFileSync(path, 'utf8');
			const previewHost = hostname.endsWith('.localhost')
				? 'localhost'
				: hostname;
			for (const [index, paper] of sites.entries())
				text = text.replaceAll(
					paper.origin,
					multiplePorts
						? `http://${previewHost}:${port + index}`
						: `http://${paper.key}.localhost:${port}`,
				);
			response.end(text);
		} else createReadStream(path).pipe(response);
	} catch {
		if (!response.headersSent) response.writeHead(400);
		response.end('Invalid request');
	}
}
const servers = [];
for (const [index, paper] of (multiplePorts
	? sites
	: [network.hub]
).entries()) {
	const selected = multiplePorts && index > 0 ? paper : undefined;
	const server = createServer((request, response) =>
		handle(request, response, selected),
	);
	servers.push(server);
	server.on('error', (error) => {
		console.error(error.message);
		process.exitCode = 1;
		for (const running of servers) running.close();
	});
	server.listen(port + index, host, () => {
		if (index === 0) console.log(`Newsstand: http://localhost:${port}/`);
		if (multiplePorts)
			console.log(`${paper.key}: http://localhost:${port + index}/`);
		else
			for (const site of sites)
				console.log(`${site.key}: http://${site.key}.localhost:${port}/`);
	});
}
