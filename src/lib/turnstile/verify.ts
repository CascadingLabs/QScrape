import { TURNSTILE_ACTION } from './config';
export interface TurnstileEnv {
	TURNSTILE_SECRET?: string;
	TURNSTILE_HOSTNAMES?: string;
}
export type Verification =
	| { ok: true }
	| {
			ok: false;
			status: 403 | 503;
			code: 'verification_failed' | 'verification_unavailable';
	  };
export async function verifyTurnstile(
	token: unknown,
	env: TurnstileEnv,
	fetcher: typeof fetch = fetch,
	remoteIP?: string,
): Promise<Verification> {
	const hosts = (env.TURNSTILE_HOSTNAMES ?? '')
		.split(',')
		.map((host) => host.trim())
		.filter(Boolean);
	if (!env.TURNSTILE_SECRET?.trim() || hosts.length === 0)
		return { ok: false, status: 503, code: 'verification_unavailable' };
	if (typeof token !== 'string' || token.length === 0 || token.length > 2048)
		return { ok: false, status: 403, code: 'verification_failed' };
	const body = new URLSearchParams({
		secret: env.TURNSTILE_SECRET,
		response: token,
	});
	if (remoteIP) body.set('remoteip', remoteIP);
	try {
		const response = await fetcher(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body,
				signal: AbortSignal.timeout(10_000),
			},
		);
		if (!response.ok)
			return { ok: false, status: 503, code: 'verification_unavailable' };
		const result: unknown = await response.json();
		if (!result || typeof result !== 'object')
			return { ok: false, status: 503, code: 'verification_unavailable' };
		const data = result as Record<string, unknown>;
		return data.success === true &&
			data.action === TURNSTILE_ACTION &&
			typeof data.hostname === 'string' &&
			hosts.includes(data.hostname)
			? { ok: true }
			: { ok: false, status: 403, code: 'verification_failed' };
	} catch {
		return { ok: false, status: 503, code: 'verification_unavailable' };
	}
}
