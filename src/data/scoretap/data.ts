import { mulberry32, seededInt, windowSeed } from '../seeded';

export interface Team {
	id: string;
	name: string;
	abbr: string;
	game: Game;
	rank?: number;
	rankPoints?: number;
	rankChange?: 'up' | 'down' | 'same';
	rankDelta?: number;
}

export interface Match {
	id: string;
	game: Game;
	teamA: string;
	teamAFull: string;
	teamB: string;
	teamBFull: string;
	scoreA: number;
	scoreB: number;
	status: 'live' | 'final' | 'upcoming';
	mapOrGame: string;
	event: string;
	time?: string;
}

export interface NewsItem {
	id: string;
	headline: string;
	game: Game;
	hoursAgo: number;
}

export interface EventItem {
	id: string;
	name: string;
	game: Game;
	dates: string;
	status: 'live' | 'upcoming' | 'completed';
}

export type Game = 'cs2' | 'valorant' | 'lol' | 'dota2' | 'rl';

export const gameLabels: Record<Game, string> = {
	cs2: 'CS2',
	valorant: 'Valorant',
	lol: 'LoL',
	dota2: 'Dota 2',
	rl: 'Rocket League',
};

export const gameColors: Record<Game, string> = {
	cs2: '#f0a500',
	valorant: '#ff4655',
	lol: '#c69b3a',
	dota2: '#a5373c',
	rl: '#5b9cf6',
};

export const liveMatches: Match[] = [
	{
		id: 'match-001',
		game: 'cs2',
		teamA: 'NAVI',
		teamAFull: 'Natus Vincere',
		teamB: 'G2',
		teamBFull: 'G2 Esports',
		scoreA: 11,
		scoreB: 8,
		status: 'live',
		mapOrGame: 'Map 2',
		event: 'IEM Katowice 2026',
	},
	{
		id: 'match-002',
		game: 'valorant',
		teamA: 'Sentinels',
		teamAFull: 'SEN',
		teamB: 'LOUD',
		teamBFull: 'LOUD',
		scoreA: 9,
		scoreB: 7,
		status: 'live',
		mapOrGame: 'Map 1',
		event: 'VCT Americas 2026',
	},
	{
		id: 'match-003',
		game: 'rl',
		teamA: 'Team Liquid',
		teamAFull: 'TL',
		teamB: 'Cloud9',
		teamBFull: 'C9',
		scoreA: 2,
		scoreB: 1,
		status: 'live',
		mapOrGame: 'Game 4',
		event: 'RLCS 2026 — Spring',
	},
];

export const recentResults: Match[] = [
	{
		id: 'result-001',
		game: 'cs2',
		teamA: 'Vitality',
		teamAFull: 'Team Vitality',
		teamB: 'FaZe',
		teamBFull: 'FaZe Clan',
		scoreA: 16,
		scoreB: 12,
		status: 'final',
		mapOrGame: '',
		event: 'IEM Katowice 2026',
	},
	{
		id: 'result-002',
		game: 'valorant',
		teamA: 'NRG',
		teamAFull: 'NRG Esports',
		teamB: '100T',
		teamBFull: '100 Thieves',
		scoreA: 13,
		scoreB: 9,
		status: 'final',
		mapOrGame: '',
		event: 'VCT Americas 2026',
	},
	{
		id: 'result-003',
		game: 'cs2',
		teamA: 'MOUZ',
		teamAFull: 'MOUZ',
		teamB: 'Heroic',
		teamBFull: 'Heroic',
		scoreA: 2,
		scoreB: 0,
		status: 'final',
		mapOrGame: '',
		event: 'IEM Katowice 2026',
	},
	{
		id: 'result-004',
		game: 'valorant',
		teamA: 'Paper Rex',
		teamAFull: 'PRX',
		teamB: 'Secret',
		teamBFull: 'Team Secret',
		scoreA: 13,
		scoreB: 10,
		status: 'final',
		mapOrGame: '',
		event: 'VCT Pacific 2026',
	},
	{
		id: 'result-005',
		game: 'cs2',
		teamA: 'Virtus.pro',
		teamAFull: 'VP',
		teamB: 'Cloud9',
		teamBFull: 'C9',
		scoreA: 16,
		scoreB: 14,
		status: 'final',
		mapOrGame: '',
		event: 'BLAST Premier 2026',
	},
];

export const upcomingMatches: Match[] = [
	{
		id: 'upcoming-001',
		game: 'cs2',
		teamA: 'Vitality',
		teamAFull: 'Team Vitality',
		teamB: 'MOUZ',
		teamBFull: 'MOUZ',
		scoreA: 0,
		scoreB: 0,
		status: 'upcoming',
		mapOrGame: '',
		event: 'IEM Katowice 2026',
		time: 'Today 18:00',
	},
	{
		id: 'upcoming-002',
		game: 'valorant',
		teamA: '100T',
		teamAFull: '100 Thieves',
		teamB: 'NRG',
		teamBFull: 'NRG Esports',
		scoreA: 0,
		scoreB: 0,
		status: 'upcoming',
		mapOrGame: '',
		event: 'VCT Americas 2026',
		time: 'Today 20:00',
	},
	{
		id: 'upcoming-003',
		game: 'lol',
		teamA: 'T1',
		teamAFull: 'T1',
		teamB: 'Gen.G',
		teamBFull: 'Gen.G',
		scoreA: 0,
		scoreB: 0,
		status: 'upcoming',
		mapOrGame: '',
		event: 'LCK Spring 2026',
		time: 'Tomorrow 14:00',
	},
	{
		id: 'upcoming-004',
		game: 'dota2',
		teamA: 'Spirit',
		teamAFull: 'Team Spirit',
		teamB: 'OG',
		teamBFull: 'OG',
		scoreA: 0,
		scoreB: 0,
		status: 'upcoming',
		mapOrGame: '',
		event: 'ESL One Stockholm 2026',
		time: 'Tomorrow 16:00',
	},
	{
		id: 'upcoming-005',
		game: 'rl',
		teamA: 'BDS',
		teamAFull: 'Team BDS',
		teamB: 'G2',
		teamBFull: 'G2 Esports',
		scoreA: 0,
		scoreB: 0,
		status: 'upcoming',
		mapOrGame: '',
		event: 'RLCS 2026 Spring',
		time: 'Mar 12 15:00',
	},
];

export const newsItems: NewsItem[] = [
	{
		id: 'zywoo-katowice-record',
		headline: 'ZywOo sets new career-high rating record at IEM Katowice 2026',
		game: 'cs2',
		hoursAgo: 2,
	},
	{
		id: 'navi-blamef-signing',
		headline: 'NAVI confirm signing of rifler blameF ahead of Major qualifier',
		game: 'cs2',
		hoursAgo: 4,
	},
	{
		id: 'cs2-major-copenhagen',
		headline:
			'CS2 Major 2026 location officially announced — Copenhagen confirmed',
		game: 'cs2',
		hoursAgo: 6,
	},
	{
		id: 'sentinels-group-stage',
		headline:
			'Sentinels sweep VCT Americas group stage with perfect 5-0 record',
		game: 'valorant',
		hoursAgo: 8,
	},
	{
		id: 'faker-contract-2028',
		headline: 'T1 Faker extends contract through 2028 in landmark deal',
		game: 'lol',
		hoursAgo: 10,
	},
	{
		id: 'rlcs-prize-pool',
		headline: 'RLCS 2026 Spring Split prize pool revealed at $2.5 million',
		game: 'rl',
		hoursAgo: 12,
	},
	{
		id: 'spirit-dreamleague',
		headline:
			'Team Spirit win DreamLeague Season 25 after stunning Grand Final comeback',
		game: 'dota2',
		hoursAgo: 14,
	},
	{
		id: 'g2-niko-interview',
		headline:
			'G2 NiKo: "We came to Katowice to win everything, not just qualify"',
		game: 'cs2',
		hoursAgo: 16,
	},
	{
		id: 'paper-rex-flippzjder',
		headline: 'Paper Rex sign flippzjder as IGL ahead of VCT Pacific',
		game: 'valorant',
		hoursAgo: 20,
	},
	{
		id: 'vct-pacific-standings',
		headline: 'VCT Pacific standings after week 3: PRX lead with 6-0 record',
		game: 'valorant',
		hoursAgo: 24,
	},
	{
		id: 'nrg-americas-playoffs',
		headline: 'NRG qualify for VCT Americas playoffs with comeback win',
		game: 'valorant',
		hoursAgo: 28,
	},
	{
		id: 'loud-vct-preview',
		headline: 'LOUD preview VCT Americas campaign: "This is our year"',
		game: 'valorant',
		hoursAgo: 32,
	},
	{
		id: 'valorant-episode-9',
		headline: 'Valorant Episode 9 patch notes: major agent balance changes',
		game: 'valorant',
		hoursAgo: 36,
	},
	{
		id: 'geng-ruler-contract',
		headline: 'Gen.G extend Ruler contract through 2027 LCK season',
		game: 'lol',
		hoursAgo: 40,
	},
	{
		id: 'lec-g2-standings',
		headline: 'LEC Spring Week 4: G2 extend lead at top of table',
		game: 'lol',
		hoursAgo: 44,
	},
	{
		id: 'lck-spring-preview',
		headline: 'LCK Spring 2026 preview: Can anyone dethrone T1?',
		game: 'lol',
		hoursAgo: 48,
	},
	{
		id: 'msi-2026-location',
		headline: 'MSI 2026 to be held in Seoul, Riot confirms',
		game: 'lol',
		hoursAgo: 52,
	},
	{
		id: 'og-rebuild-roster',
		headline: 'OG complete roster rebuild ahead of ESL One Stockholm',
		game: 'dota2',
		hoursAgo: 56,
	},
	{
		id: 'ti12-format-changes',
		headline: 'TI12 format changes announced: expanded group stage',
		game: 'dota2',
		hoursAgo: 60,
	},
	{
		id: 'bds-karmine-win',
		headline: 'Team BDS defeat Karmine Corp 4-2 in RLCS Spring opener',
		game: 'rl',
		hoursAgo: 64,
	},
	{
		id: 'liquid-rl-roster',
		headline: 'Team Liquid unveil new Rocket League roster for 2026 season',
		game: 'rl',
		hoursAgo: 68,
	},
	{
		id: 'cs2-patch-notes',
		headline: 'CS2 patch 1.40 — Dust2 rework, economy changes detailed',
		game: 'cs2',
		hoursAgo: 72,
	},
	{
		id: 'mouz-heroic-semifinal',
		headline: 'MOUZ edge Heroic in five-map IEM Katowice semifinal thriller',
		game: 'cs2',
		hoursAgo: 76,
	},
	{
		id: 'vitality-faze-results',
		headline: 'Vitality dominate FaZe 16-8, 16-12 in IEM Katowice quarterfinal',
		game: 'cs2',
		hoursAgo: 80,
	},
	{
		id: 'blast-premier-schedule',
		headline: 'BLAST Premier 2026 Spring schedule confirmed — 12 teams',
		game: 'cs2',
		hoursAgo: 84,
	},
];

export const events: EventItem[] = [
	{
		id: 'iem-katowice-2026',
		name: 'IEM Katowice 2026',
		game: 'cs2',
		dates: 'Mar 5–15',
		status: 'live',
	},
	{
		id: 'blast-premier-spring-2026',
		name: 'BLAST Premier Spring 2026',
		game: 'cs2',
		dates: 'Mar 18–Apr 2',
		status: 'upcoming',
	},
	{
		id: 'cs2-major-2026',
		name: 'CS2 Major 2026 — Copenhagen',
		game: 'cs2',
		dates: 'May 10–25',
		status: 'upcoming',
	},
	{
		id: 'iem-dallas-2026',
		name: 'IEM Dallas 2026',
		game: 'cs2',
		dates: 'Jun 1–8',
		status: 'upcoming',
	},
	{
		id: 'vct-americas-2026',
		name: 'VCT Americas 2026',
		game: 'valorant',
		dates: 'Mar 1–20',
		status: 'live',
	},
	{
		id: 'vct-pacific-2026',
		name: 'VCT Pacific 2026',
		game: 'valorant',
		dates: 'Mar 3–22',
		status: 'live',
	},
	{
		id: 'lck-spring-2026',
		name: 'LCK Spring 2026',
		game: 'lol',
		dates: 'Feb 15–Apr 5',
		status: 'live',
	},
	{
		id: 'lec-spring-2026',
		name: 'LEC Spring 2026',
		game: 'lol',
		dates: 'Feb 20–Apr 12',
		status: 'live',
	},
	{
		id: 'msi-2026',
		name: 'MSI 2026',
		game: 'lol',
		dates: 'May 6–18',
		status: 'upcoming',
	},
	{
		id: 'esl-one-stockholm-2026',
		name: 'ESL One Stockholm 2026',
		game: 'dota2',
		dates: 'Mar 20–30',
		status: 'upcoming',
	},
	{
		id: 'dreamleague-season-25',
		name: 'DreamLeague Season 25',
		game: 'dota2',
		dates: 'Feb 28–Mar 10',
		status: 'completed',
	},
	{
		id: 'rlcs-spring-2026',
		name: 'RLCS 2026 Spring',
		game: 'rl',
		dates: 'Mar 8–22',
		status: 'live',
	},
];

export const teams: Team[] = [
	// CS2
	{
		id: 'vitality',
		name: 'Team Vitality',
		abbr: 'VIT',
		game: 'cs2',
		rank: 1,
		rankPoints: 1842,
		rankChange: 'same',
	},
	{
		id: 'navi',
		name: 'Natus Vincere',
		abbr: 'NAVI',
		game: 'cs2',
		rank: 2,
		rankPoints: 1710,
		rankChange: 'up',
		rankDelta: 2,
	},
	{
		id: 'g2',
		name: 'G2 Esports',
		abbr: 'G2',
		game: 'cs2',
		rank: 3,
		rankPoints: 1655,
		rankChange: 'down',
		rankDelta: 1,
	},
	{
		id: 'mouz',
		name: 'MOUZ',
		abbr: 'MOUZ',
		game: 'cs2',
		rank: 5,
		rankPoints: 1490,
		rankChange: 'up',
		rankDelta: 1,
	},
	// Valorant
	{ id: 'sentinels', name: 'Sentinels', abbr: 'SEN', game: 'valorant' },
	{ id: 'paper-rex', name: 'Paper Rex', abbr: 'PRX', game: 'valorant' },
	{ id: 'nrg', name: 'NRG Esports', abbr: 'NRG', game: 'valorant' },
	// LoL
	{ id: 't1', name: 'T1', abbr: 'T1', game: 'lol' },
	{ id: 'gen-g', name: 'Gen.G', abbr: 'GEN', game: 'lol' },
	{ id: 'g2-lol', name: 'G2 Esports', abbr: 'G2', game: 'lol' },
	// Dota 2
	{ id: 'spirit', name: 'Team Spirit', abbr: 'SPIRIT', game: 'dota2' },
	{ id: 'og', name: 'OG', abbr: 'OG', game: 'dota2' },
	// Rocket League
	{ id: 'bds', name: 'Team BDS', abbr: 'BDS', game: 'rl' },
	{ id: 'liquid-rl', name: 'Team Liquid', abbr: 'TL', game: 'rl' },
	{ id: 'cloud9-rl', name: 'Cloud9', abbr: 'C9', game: 'rl' },
];

export const cs2Rankings: {
	rank: number;
	team: string;
	teamId?: string;
	points: number;
	change: 'up' | 'down' | 'same';
	delta?: number;
}[] = [
	{
		rank: 1,
		team: 'Vitality',
		teamId: 'vitality',
		points: 1842,
		change: 'same',
	},
	{
		rank: 2,
		team: 'NAVI',
		teamId: 'navi',
		points: 1710,
		change: 'up',
		delta: 2,
	},
	{
		rank: 3,
		team: 'G2 Esports',
		teamId: 'g2',
		points: 1655,
		change: 'down',
		delta: 1,
	},
	{ rank: 4, team: 'FaZe Clan', points: 1580, change: 'down', delta: 1 },
	{
		rank: 5,
		team: 'MOUZ',
		teamId: 'mouz',
		points: 1490,
		change: 'up',
		delta: 1,
	},
	{ rank: 6, team: 'Heroic', points: 1320, change: 'same' },
	{ rank: 7, team: 'Virtus.pro', points: 1210, change: 'up', delta: 3 },
	{ rank: 8, team: 'Cloud9', points: 1150, change: 'down', delta: 2 },
	{ rank: 9, team: 'Team Liquid', points: 1080, change: 'same' },
	{ rank: 10, team: 'Spirit', points: 1020, change: 'up', delta: 1 },
];

// Score caps per match (mirrors the ticker caps in ScoretapLiveScores)
const scoreCaps: Record<string, number> = {
	'match-001': 30, // CS2
	'match-002': 30, // Valorant
	'match-003': 5, // Rocket League
};

// Per-game half-time midpoint for seeding plausible mid-match scores
const halfCaps: Record<Game, number> = {
	cs2: 15,
	valorant: 12,
	lol: 0, // not used as live game
	dota2: 0,
	rl: 4,
};

/**
 * Returns seeded initial live scores for the current 8-minute time window.
 * Produces plausible mid-match scores that differ across windows so each visitor
 * sees the match at a different point, then the ticker continues from there.
 */
export function getInitialLiveScores(): Record<
	string,
	{ a: number; b: number }
> {
	const rng = mulberry32(windowSeed(8));
	return Object.fromEntries(
		liveMatches.map((m) => {
			const cap = scoreCaps[m.id] ?? 30;
			const half = halfCaps[m.game] ?? Math.floor(cap / 2);
			const a = seededInt(0, half, rng);
			const b = seededInt(0, Math.min(half, cap - a), rng);
			return [m.id, { a, b }];
		}),
	);
}
