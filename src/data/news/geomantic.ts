import {
	dwarvenTimestamp,
	mulberry32,
	seededPick,
	windowSeed,
} from '../seeded';

export type StatusClass = 'stable' | 'caution' | 'alert';

export interface GeomanticZone {
	zone: string;
	status: string;
	statusClass: StatusClass;
	temp: string;
}

export const zones: GeomanticZone[] = [
	{
		zone: 'Surface',
		status: 'BLIZZARD',
		statusClass: 'caution',
		temp: '-14°S',
	},
	{
		zone: 'Z-1 to Z-10',
		status: 'STABLE',
		statusClass: 'stable',
		temp: '58°S',
	},
	{
		zone: 'Z-11 to Z-30',
		status: 'STABLE',
		statusClass: 'stable',
		temp: '62°S',
	},
	{
		zone: 'Z-31 to Z-50',
		status: 'ADVISORY',
		statusClass: 'caution',
		temp: '65°S',
	},
	{
		zone: 'Z-51 to Z-80',
		status: 'STABLE',
		statusClass: 'stable',
		temp: '71°S',
	},
	{
		zone: 'Z-81 to Z-100',
		status: 'MONITOR',
		statusClass: 'caution',
		temp: '84°S',
	},
	{
		zone: 'Z-101+ (Magma)',
		status: 'ELEVATED',
		statusClass: 'alert',
		temp: '340°S',
	},
];

export const metrics = {
	seismic: '1.2 (Low)',
	magma: '12% of capacity',
	aquifer: 'Normal',
	wind: '45 kn NW',
};

export const advisories = [
	'Z-Level 45 Advisory remains active.',
	'Surface trade routes CLOSED.',
];

export const updated = 'Mar 11, 312 · 9:00 PM';

export const statusColor: Record<StatusClass, string> = {
	stable: '#16a34a',
	caution: '#d97706',
	alert: '#dc2626',
};

export interface LiveGeomantic {
	zones: GeomanticZone[];
	metrics: typeof metrics;
	advisories: string[];
	updated: string;
}

// Per-zone status pools: [status, statusClass][] — weighted by repetition
const zonePools: Array<[string, StatusClass][]> = [
	// Surface
	[
		['BLIZZARD', 'caution'],
		['BLIZZARD', 'caution'],
		['STABLE', 'stable'],
		['CLOUDY', 'stable'],
	],
	// Z-1 to Z-10
	[
		['STABLE', 'stable'],
		['STABLE', 'stable'],
		['STABLE', 'stable'],
		['MONITOR', 'caution'],
	],
	// Z-11 to Z-30
	[
		['STABLE', 'stable'],
		['STABLE', 'stable'],
		['STABLE', 'stable'],
		['MONITOR', 'caution'],
	],
	// Z-31 to Z-50
	[
		['STABLE', 'stable'],
		['STABLE', 'stable'],
		['ADVISORY', 'caution'],
		['ADVISORY', 'caution'],
		['MONITOR', 'caution'],
		['ELEVATED', 'alert'],
	],
	// Z-51 to Z-80
	[
		['STABLE', 'stable'],
		['STABLE', 'stable'],
		['STABLE', 'stable'],
		['MONITOR', 'caution'],
	],
	// Z-81 to Z-100
	[
		['STABLE', 'stable'],
		['MONITOR', 'caution'],
		['MONITOR', 'caution'],
		['ELEVATED', 'alert'],
	],
	// Z-101+ (Magma) — always alert
	[
		['ELEVATED', 'alert'],
		['ELEVATED', 'alert'],
		['CRITICAL', 'alert'],
	],
];

const windDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const aquiferStates = ['Normal', 'Normal', 'Normal', 'Elevated', 'Low'];

export function getLiveGeomantic(): LiveGeomantic {
	// 4-hour cycle — geological conditions shift slowly
	const rng = mulberry32(windowSeed(240));

	const liveZones: GeomanticZone[] = zones.map((z, i) => {
		const [status, statusClass] = seededPick(zonePools[i], rng);
		return { ...z, status, statusClass };
	});

	const seismicRaw = 0.8 + rng() * 2.7;
	const seismicLabel =
		seismicRaw < 1.5 ? 'Low' : seismicRaw < 2.5 ? 'Moderate' : 'Elevated';
	const magmaPct = 8 + Math.floor(rng() * 21);
	const windKn = 20 + Math.floor(rng() * 56);
	const windDir = seededPick(windDirs, rng);
	const aquifer = seededPick(aquiferStates, rng);

	const liveAdvisories: string[] = [];
	if (liveZones[3].statusClass !== 'stable') {
		liveAdvisories.push('Z-Level 45 Advisory remains active.');
	}
	if (liveZones[0].status === 'BLIZZARD') {
		liveAdvisories.push('Surface trade routes CLOSED.');
	}
	if (liveZones[5].statusClass === 'alert') {
		liveAdvisories.push('Z-Level 81-100 pressure differential: ELEVATED.');
	}

	return {
		zones: liveZones,
		metrics: {
			seismic: `${seismicRaw.toFixed(1)} (${seismicLabel})`,
			magma: `${magmaPct}% of capacity`,
			aquifer,
			wind: `${windKn} kn ${windDir}`,
		},
		advisories: liveAdvisories,
		updated: dwarvenTimestamp(),
	};
}
