import { handleProducts } from '../../../../src/lib/eshop/api';
export function onRequest(context: {
	request: Request;
	params: { id?: string | string[] };
}): Response {
	return handleProducts(
		context.request,
		typeof context.params.id === 'string' ? context.params.id : undefined,
	);
}
