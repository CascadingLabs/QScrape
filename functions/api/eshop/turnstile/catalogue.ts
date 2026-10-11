import { handleTurnstileCatalogue } from '../../../../src/lib/turnstile/api';
import type { TurnstileEnv } from '../../../../src/lib/turnstile/verify';
export async function onRequest(context: {
	request: Request;
	env: TurnstileEnv;
}): Promise<Response> {
	return handleTurnstileCatalogue(context.request, context.env);
}
