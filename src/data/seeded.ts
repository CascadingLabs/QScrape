/** Seed = floor(Date.now() / windowMs) — same value for all callers within the window */
export function windowSeed(windowMinutes: number): number {
	return Math.floor(Date.now() / (windowMinutes * 60 * 1000));
}

/** mulberry32 — deterministic PRNG from a uint32 seed */
export function mulberry32(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s |= 0;
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Pick n items from arr without replacement using rng */
export function seededSample<T>(arr: T[], n: number, rng: () => number): T[] {
	const copy = [...arr];
	const result: T[] = [];
	const take = Math.min(n, copy.length);
	for (let i = 0; i < take; i++) {
		const idx = Math.floor(rng() * (copy.length - i));
		result.push(copy[idx]);
		copy[idx] = copy[copy.length - i - 1];
	}
	return result;
}

/** Random integer in [min, max] inclusive */
export function seededInt(min: number, max: number, rng: () => number): number {
	return min + Math.floor(rng() * (max - min + 1));
}

/** Pick one item from arr */
export function seededPick<T>(arr: T[], rng: () => number): T {
	return arr[Math.floor(rng() * arr.length)];
}

/** Returns true if the current local hour is in [startHour, endHour) */
export function isActiveHour(startHour: number, endHour: number): boolean {
	const h = new Date().getHours();
	return startHour <= endHour
		? h >= startHour && h < endHour
		: h >= startHour || h < endHour;
}

/** Real wall-clock time as an in-universe dwarven timestamp, e.g. "Apr 2, 312 · 3:17 PM" */
export function dwarvenTimestamp(): string {
	const now = new Date();
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	const h = now.getHours();
	const min = now.getMinutes().toString().padStart(2, '0');
	const ampm = h >= 12 ? 'PM' : 'AM';
	const h12 = h % 12 || 12;
	return `${months[now.getMonth()]} ${now.getDate()}, 312 · ${h12}:${min} ${ampm}`;
}
