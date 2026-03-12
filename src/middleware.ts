import { defineMiddleware } from 'astro:middleware';

const aliases: Record<string, string> = {
	level1: 'l1',
	'level-1': 'l1',
	'1': 'l1',
	level2: 'l2',
	'level-2': 'l2',
	'2': 'l2',
	level3: 'l3',
	'level-3': 'l3',
	'3': 'l3',
	level4: 'l4',
	'level-4': 'l4',
	'4': 'l4',
};

export const onRequest = defineMiddleware((context, next) => {
	const parts = context.url.pathname.split('/').filter(Boolean);
	if (parts.length > 0 && aliases[parts[0]]) {
		const canonical = aliases[parts[0]];
		const rest = parts.slice(1).join('/');
		const newPath = rest ? `/${canonical}/${rest}` : `/${canonical}/`;
		return context.redirect(newPath, 301);
	}
	return next();
});
