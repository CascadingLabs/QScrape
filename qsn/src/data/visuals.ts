import type { Publication } from './publications';

const scenes: Record<string, Record<string, string>> = {
	humans: { 'Civic Life': 'human-council', 'Work & Markets': 'human-market' },
	elves: {
		'Council & Commons': 'elven-council',
		'Canopy & Water': 'elven-garden',
		'Homes & Generations': 'elven-garden',
	},
	goblins: {
		'Work & Safety': 'goblin-foundry',
		'Routes & Repair': 'goblin-foundry',
		'Markets & Contracts': 'goblin-market',
		Neighborhoods: 'goblin-market',
	},
	kobolds: {
		'Air & Water': 'kobold-cistern',
		'Surface & Environment': 'kobold-cistern',
		'Markets & Workshops': 'kobold-workshop',
		'Culture & Records': 'kobold-workshop',
	},
	vampires: {
		'Housing & Memory': 'vampire-archive',
		'Culture & Time': 'vampire-archive',
		'Night City': 'vampire-council',
		'Regional Affairs': 'vampire-council',
	},
};
const descriptions: Record<string, string> = {
	'human-council': 'Human delegates in a river-city council chamber.',
	'human-market': 'Merchants trading goods at a human river-port market.',
	'elven-council': 'Elven delegates meeting in a living-wood canopy hall.',
	'elven-garden': 'Elven gardeners tending an orchard and its water channels.',
	'goblin-foundry': 'Goblin workers inspecting foundry machinery.',
	'goblin-market': 'Traders and residents in a goblin canal-side market.',
	'kobold-workshop':
		'Kobold craftspeople working at an underground repair bench.',
	'kobold-cistern': 'Kobold engineers inspecting an underground water channel.',
	'vampire-archive': 'Vampire historians studying records in a night archive.',
	'vampire-council': 'Vampire delegates meeting in a moonlit civic chamber.',
};
export function sectionArtwork(paper: Publication, section: string) {
	const name = scenes[paper.id]?.[section] ?? paper.hero;
	const alt =
		descriptions[name] ??
		`A cityscape from the ${paper.species.toLowerCase()} realm.`;
	return { name, src: `/images/qsn/${name}.png`, alt, caption: alt };
}
