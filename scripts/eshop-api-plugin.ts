import { loadEnv, type Plugin } from 'vite-plus';
import { handleProducts } from '../src/lib/eshop/api';
import { handleTurnstileCatalogue } from '../src/lib/turnstile/api';

export function eshopAPIPlugin(): Plugin {
	return {
		name: 'qscrape-local-eshop-api',
		configureServer(server) {
			// Private env values are used only by the local server middleware.
			const values = loadEnv(server.config.mode, server.config.root, '');
			const env = {
				TURNSTILE_SECRET: values.TURNSTILE_SECRET,
				TURNSTILE_HOSTNAMES: values.TURNSTILE_HOSTNAMES,
			};
			server.middlewares.use(async (req, res, next) => {
				const url = new URL(req.url ?? '/', 'http://localhost');
				const publicMatch = /^\/api\/eshop\/products(?:\/([^/]+))?\/?$/.exec(
					url.pathname,
				);
				const protectedPath =
					url.pathname.replace(/\/$/, '') === '/api/eshop/turnstile/catalogue';
				if (!publicMatch && !protectedPath) return next();
				try {
					let body: string | undefined;
					if (req.method === 'POST') {
						const chunks: Buffer[] = [];
						let size = 0;
						for await (const chunk of req) {
							const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
							size += bytes.length;
							if (size > 8192) {
								res.statusCode = 413;
								res.end('Request too large');
								return;
							}
							chunks.push(bytes);
						}
						body = Buffer.concat(chunks).toString('utf8');
					}
					const request = new Request(url, {
						method: req.method,
						headers: {
							'Content-Type':
								typeof req.headers['content-type'] === 'string'
									? req.headers['content-type']
									: '',
						},
						body,
					});
					const response = protectedPath
						? await handleTurnstileCatalogue(request, env)
						: handleProducts(request, publicMatch?.at(1));
					res.statusCode = response.status;
					response.headers.forEach((value, key) => res.setHeader(key, value));
					res.end(await response.text());
				} catch {
					res.statusCode = 500;
					res.end('API request failed');
				}
			});
		},
	};
}
