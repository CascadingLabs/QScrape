// @qscrape L2 / fake async API layer
// Simulates network latency so scrapers must wait for JS-rendered content.
// All L2 SPAs load data through these helpers instead of importing synchronously.

const BASE_MS = 300;
const JITTER_MS = 250;

/** Resolves with `data` after a simulated 300–550 ms network delay. */
export function fakeGet<T>(data: T): Promise<T> {
	return new Promise((resolve) =>
		setTimeout(() => resolve(data), BASE_MS + Math.random() * JITTER_MS),
	);
}

/**
 * L3 variant — resolves with `data` after a custom delay.
 * Each L3 framework island uses different values to create staggered hydration.
 * @param baseMs  Minimum delay in milliseconds.
 * @param jitterMs  Max random jitter added on top.
 */
export function fakeGetMs<T>(
	data: T,
	baseMs: number,
	jitterMs: number,
): Promise<T> {
	return new Promise((resolve) =>
		setTimeout(() => resolve(data), baseMs + Math.random() * jitterMs),
	);
}
