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
