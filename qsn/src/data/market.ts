import { publication } from './publications';
const regionalMarkets: Record<
	string,
	{
		place: string;
		currency: string;
		goods: string[];
		weather: { region: string; conditions: string }[];
	}
> = {
	dwarves: {
		place: 'Kharad Venn',
		currency: 'marks',
		goods: [
			'Grain sack',
			'Certified copper bar',
			'Salt barrel',
			'Mountain herbs',
		],
		weather: [
			{ region: 'Upper Bridges', conditions: '6°C, clear with a crosswind' },
			{ region: 'Lower Market Hall', conditions: '10°C, morning runoff' },
			{ region: 'East Ridge', conditions: '2°C, cold rain' },
		],
	},
	humans: {
		place: 'Bellwater',
		currency: 'crowns',
		goods: ['River wheat', 'Woven sailcloth', 'Lamp oil', 'Market apples'],
		weather: [
			{ region: 'River Quay', conditions: '14°C, mist lifting' },
			{ region: 'Old Assembly', conditions: '16°C, clear' },
			{ region: 'Eastern farms', conditions: '12°C, light rain' },
		],
	},
	elves: {
		place: 'Lethariel',
		currency: 'leaf bonds',
		goods: [
			'Medicinal moss',
			'Orchard fruit',
			'Woven canopy silk',
			'Living saplings',
		],
		weather: [
			{ region: 'High Canopy', conditions: '17°C, broken sunlight' },
			{ region: 'Rootwater', conditions: '15°C, damp and still' },
			{ region: 'Western Grove', conditions: '18°C, light breeze' },
		],
	},
	goblins: {
		place: 'Cinderwick',
		currency: 'cinders',
		goods: ['Reclaimed iron', 'Kiln fuel', 'Canal grain', 'Glass panels'],
		weather: [
			{ region: 'Furnace Ward', conditions: '21°C, warm with a south wind' },
			{ region: 'Canal Steps', conditions: '13°C, clear' },
			{ region: 'Ash Market', conditions: '16°C, light haze' },
		],
	},
	kobolds: {
		place: 'Underway',
		currency: 'tokens',
		goods: ['Copper wire', 'Tunnel mushrooms', 'Patchcloth', 'Lantern wicks'],
		weather: [
			{ region: 'Upper Vent', conditions: '11°C, fresh air' },
			{ region: 'Market Burrow', conditions: '16°C, dry' },
			{ region: 'Creek Entrance', conditions: '9°C, damp after rain' },
		],
	},
	vampires: {
		place: 'Vesperhold',
		currency: 'silver marks',
		goods: [
			'Night-bloom herbs',
			'Archival paper',
			'Black glass',
			'Winter velvet',
		],
		weather: [
			{ region: 'Moon Quay', conditions: '8°C, river fog' },
			{ region: 'Upper Terrace', conditions: '6°C, cloudless' },
			{ region: 'Old Observatory', conditions: '4°C, northerly wind' },
		],
	},
};
const region = regionalMarkets[publication.id];
export const marketLocation = region.place;
export const marketSnapshot = {
	asOf: 'Evening edition',
	markets: region.goods.map((commodity, index) => ({
		commodity,
		price: `${[8.2, 12, 4.6, 2.1][index]} ${region.currency}`,
		note: [
			'Local exchange quote',
			'Certified standard',
			'Delivered weight',
			'Small-lot price',
		][index],
	})),
	weather: region.weather,
};
