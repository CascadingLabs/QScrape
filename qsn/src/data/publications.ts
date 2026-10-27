export interface Publication {
	id: string;
	key: string;
	species: string;
	name: string;
	shortName: string;
	tagline: string;
	description: string;
	origin: string;
	articleCount: number;
	hero: string;
}
export const publications: Publication[] = [
	{
		id: 'dwarves',
		key: 'qsn',
		species: 'Dwarves',
		name: 'QScrape News',
		shortName: 'QSN',
		tagline: 'From the halls. Across the realms.',
		description:
			'Independent reporting from the mountain halls, forge floor and caravan roads.',
		origin: 'https://qsn.qscrape.dev',
		articleCount: 10000,
		hero: 'mountain-city',
	},
	{
		id: 'humans',
		key: 'hsn',
		species: 'Humans',
		name: 'The Common Chronicle',
		shortName: 'HSN',
		tagline: 'Every street has a story.',
		description:
			'City politics, trade, migration and the public life of the river kingdoms.',
		origin: 'https://hsn.qscrape.dev',
		articleCount: 18000,
		hero: 'human-city',
	},
	{
		id: 'elves',
		key: 'esn',
		species: 'Elves',
		name: 'The Verdant Dispatch',
		shortName: 'ESN',
		tagline: 'The long view. The living world.',
		description:
			'Forest councils, ecology, craft and diplomacy across generations.',
		origin: 'https://esn.qscrape.dev',
		articleCount: 18000,
		hero: 'elven-city',
	},
	{
		id: 'goblins',
		key: 'gsn',
		species: 'Goblins',
		name: 'The Cinder Ledger',
		shortName: 'GSN',
		tagline: 'Follow the work. Question the power.',
		description:
			'Industry, neighborhood life, civic power and the border economies of the cinder cities.',
		origin: 'https://gsn.qscrape.dev',
		articleCount: 18000,
		hero: 'goblin-city',
	},
	{
		id: 'kobolds',
		key: 'ksn',
		species: 'Kobolds',
		name: 'The Burrow Bulletin',
		shortName: 'KSN',
		tagline: 'Small passages. Big stories.',
		description:
			'Tunnel neighborhoods, local enterprise, resourcefulness and the routes beneath the routes.',
		origin: 'https://ksn.qscrape.dev',
		articleCount: 18000,
		hero: 'kobold-city',
	},
	{
		id: 'vampires',
		key: 'vsn',
		species: 'Vampires',
		name: 'The Nocturne Review',
		shortName: 'VSN',
		tagline: 'After dusk. Beyond the moment.',
		description:
			'Night-city affairs, long memory, culture and the politics of living across centuries.',
		origin: 'https://vsn.qscrape.dev',
		articleCount: 18000,
		hero: 'vampire-city',
	},
];
export function getPublication(
	id = process.env.QSN_PUBLICATION ?? 'dwarves',
): Publication {
	const publication = publications.find(
		(item) => item.id === id || item.key === id,
	);
	if (!publication) throw new Error(`Unknown publication: ${id}`);
	return publication;
}
export const publication = getPublication();
