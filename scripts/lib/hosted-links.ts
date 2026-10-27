export function linksInclude(
	links: string[],
	expectedHref: string,
	pageUrl: string,
): boolean {
	const expected = new URL(expectedHref, pageUrl).href;
	return links.some((href) => {
		try {
			return new URL(href, pageUrl).href === expected;
		} catch {
			return false;
		}
	});
}
