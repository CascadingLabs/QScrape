import { handleProducts } from '../../../../src/lib/eshop/api';
export function onRequest(context: { request: Request }): Response {
	return handleProducts(context.request);
}
