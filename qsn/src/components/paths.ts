export const LIST_PAGE_SIZE = 60;

export function sectionPath(section: string): string {
	const slug = section
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	return `/section/${slug}/`;
}

export function articlePath(id: string): string {
	return `/article/${encodeURIComponent(id)}/`;
}

export function authorPath(id: string): string {
	return `/author/${encodeURIComponent(id)}/`;
}

export function seriesPath(id: string): string {
	return `/series/${encodeURIComponent(id)}/`;
}

export function formatDate(
	value: string,
	options: Intl.DateTimeFormatOptions = {},
): string {
	const date = new Date(value);
	if (Number.isNaN(date.valueOf())) return value;
	return new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'long',
		timeZone: 'UTC',
		year: 'numeric',
		...options,
	}).format(date);
}
