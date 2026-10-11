import { apiJSON, catalogueResponse } from '../eshop/api';
import { verifyTurnstile, type TurnstileEnv } from './verify';

async function readJSON(request: Request): Promise<unknown> {
	if (!request.body) return null;
	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let bytes = 0;
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			bytes += value.byteLength;
			if (bytes > 8192) {
				await reader.cancel();
				throw new Error('Body too large');
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const data = new Uint8Array(bytes);
	let offset = 0;
	for (const chunk of chunks) {
		data.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return JSON.parse(new TextDecoder().decode(data));
}
export async function handleTurnstileCatalogue(
	request: Request,
	env: TurnstileEnv,
	fetcher: typeof fetch = fetch,
): Promise<Response> {
	if (request.method !== 'POST')
		return apiJSON({ error: 'method_not_allowed' }, 405);
	if (
		(request.headers.get('Content-Type') ?? '')
			.split(';')
			.at(0)
			?.trim()
			.toLowerCase() !== 'application/json'
	)
		return apiJSON({ error: 'invalid_request' }, 400);
	let input: unknown;
	try {
		input = await readJSON(request);
	} catch {
		return apiJSON({ error: 'invalid_request' }, 400);
	}
	const token =
		input && typeof input === 'object'
			? (input as Record<string, unknown>)['cf-turnstile-response']
			: undefined;
	const result = await verifyTurnstile(
		token,
		env,
		fetcher,
		request.headers.get('CF-Connecting-IP') ?? undefined,
	);
	if (!result.ok) return apiJSON({ error: result.code }, result.status);
	return apiJSON(catalogueResponse());
}
