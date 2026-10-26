/**
 * Deterministic editorial corpus for the QSN fixture site.
 *
 * Forty recurring beats each appear once per editorial cycle for 250 cycles.
 * Their formats rotate across the calendar, while a small set of authored
 * examples replaces matching generated slots. IDs derive from stable topic,
 * cycle and format coordinates.
 */

import {
	curatedAuthors,
	curatedSeries,
	curatedSlots,
} from '../editorial/curated';
import { tradeAuthors, tradeSeries, tradeSlots } from '../editorial/trade';

import type { Article, Author, Series } from './types';
export type { Article, Author, Series } from './types';

export const sections: string[] = [
	'Council & Public Life',
	'Water & Works',
	'Labor & Industry',
	'Markets & Trade',
	'Health & Community',
	'Memory & Arts',
	'Outer Roads',
];

const FORMATS = [
	'opinion',
	'feature',
	'investigation',
	'reporting',
	'interview',
	'explainer',
	'retrospective',
	'briefing',
	'narrative',
	'breaking',
] as const;

type ArticleFormat = (typeof FORMATS)[number];
export const formats: string[] = [...FORMATS];

const SEASON_NAMES = ['thaw season', 'long light', 'grain fall', 'deep winter'];
const MILESTONE_STEPS = [
	'a new complaint or proposal has been entered under a dated docket',
	'the clerk has matched the claim to its source register and named the missing record',
	'a field check has compared the written rule with the place where it is used',
	'residents and workers have had their first chance to question the measure in public',
	'a second set of hands has checked the count and recorded where the methods differ',
	'the responsible office has offered a limited remedy with an end date for review',
	'the affected crew has tried the revised procedure under ordinary working conditions',
	'a public vote has approved a narrow change while leaving the larger question open',
	'the first implementation notes have been compared with the promise in the minutes',
	'the docket has returned for review with the exceptions and unresolved objections attached',
];

const SEASON_BY_CYCLE = (cycle: number): string =>
	SEASON_NAMES[Math.floor((cycle % 48) / 12)];

const SERIES_DATA: Series[] = [
	{
		id: 'council-record',
		title: 'The Council Record',
		description:
			'Opinion and briefing coverage of decisions made in Kharad Venn’s public chamber, with claims checked against the docket.',
	},
	{
		id: 'public-table',
		title: 'At the Public Table',
		description:
			'How residents, ward delegates and elected stewards shape policy in open meetings.',
	},
	{
		id: 'city-works',
		title: 'The City Works',
		description:
			'Field reporting on water, bridges and the public systems cut into the mountain city.',
	},
	{
		id: 'deep-shift',
		title: 'The Deep Shift',
		description:
			'Mine safety, maintenance and the practical knowledge carried between underground crews.',
	},
	{
		id: 'market-ledger',
		title: 'The Market Ledger',
		description:
			'Prices, weights and supply routes examined from the stone market floor.',
	},
	{
		id: 'care-under-stone',
		title: 'Care Under Stone',
		description:
			'Public health, treatment capacity and the work of keeping a dense underground city well.',
	},
	{
		id: 'settlement-lines',
		title: 'Settlement Lines',
		description:
			'Housing, language access and the choices facing families who make a home in the fortress.',
	},
	{
		id: 'stone-memory',
		title: 'Stone & Memory',
		description:
			'Archives, public memory and the arts that carry a city’s history forward.',
	},
	{
		id: 'outer-road',
		title: 'The Outer Road',
		description:
			'Caravans, neighboring settlements and the negotiations that keep the ridge routes open.',
	},
	{
		id: 'foundry-floor',
		title: 'The Foundry Floor',
		description:
			'Workplace rules, skilled trades and industrial change across the lower chambers.',
	},
];

export const series: Series[] = [
	...curatedSeries,
	...tradeSeries,
	...SERIES_DATA,
];

interface Staffer extends Author {
	method: string;
}

const STAFF: Staffer[] = [
	{
		id: 'mara-veld',
		name: 'Mara Veld',
		bio: 'A former docket copyist who now reports on the language and limits of public decisions.',
		beat: 'Council procedure and public records',
		method:
			'begin with the signed text, then test it against the people asked to carry it out',
	},
	{
		id: 'oren-keld',
		name: 'Oren Keld',
		bio: 'A policy correspondent known for tracing how a line in a ledger changes daily work.',
		beat: 'Budgets, rules and civic accountability',
		method:
			'follow each figure back to its first entry before accepting a clean summary',
	},
	{
		id: 'sella-mor',
		name: 'Sella Mor',
		bio: 'Reports from ward assemblies and translates their decisions into practical stakes.',
		beat: 'Ward assemblies and representation',
		method:
			'listen for the point where an abstract rule becomes a household obligation',
	},
	{
		id: 'brann-esk',
		name: 'Brann Esk',
		bio: 'A meeting reporter who keeps close notes on what was decided, delayed and left unsaid.',
		beat: 'Public meetings and local government',
		method:
			'compare the minutes with the question that brought residents into the room',
	},
	{
		id: 'tavi-orr',
		name: 'Tavi Orr',
		bio: 'An engineer turned correspondent who reports on systems built for a steep, crowded city.',
		beat: 'Water, bridges and public infrastructure',
		method:
			'trace a system from its control gate to the last household it is meant to serve',
	},
	{
		id: 'ilen-far',
		name: 'Ilen Far',
		bio: 'Writes about maintenance as a form of public safety, with a focus on what routine logs reveal.',
		beat: 'Infrastructure maintenance and inspections',
		method:
			'read the maintenance marks in sequence instead of treating each repair as an isolated event',
	},
	{
		id: 'dara-vek',
		name: 'Dara Vek',
		bio: 'A mine correspondent who has worked as a survey assistant in the eastern galleries.',
		beat: 'Underground work and mine safety',
		method:
			'start at the shift handoff, where an official total can lose its context',
	},
	{
		id: 'kel-urun',
		name: 'Kel Urun',
		bio: 'Reports on mine crews, ventilation and the decisions made before a shift enters a new face.',
		beat: 'Mine operations and worker protections',
		method:
			'ask which warning a worker could have seen before the hazard reached the face',
	},
	{
		id: 'nima-thol',
		name: 'Nima Thol',
		bio: 'A market reporter who compares posted prices with the receipts kept by buyers and sellers.',
		beat: 'Food, household goods and market prices',
		method:
			'put the posted price beside the amount that actually changed hands',
	},
	{
		id: 'vesh-anar',
		name: 'Vesh Anar',
		bio: 'Covers trade rules and the long route a good takes before reaching the city stalls.',
		beat: 'Weights, tolls and supply chains',
		method:
			'follow a consignment across each handoff instead of stopping at the gate',
	},
	{
		id: 'runa-ash',
		name: 'Runa Ash',
		bio: 'A public-health reporter attentive to shortages that are hidden by citywide averages.',
		beat: 'Clinics and access to care',
		method:
			'separate available stock from stock that can reach a patient in time',
	},
	{
		id: 'hadrik-nel',
		name: 'Hadrik Nel',
		bio: 'Reports on treatment capacity, sanitation and the labor behind reliable care.',
		beat: 'Public health and sanitation',
		method:
			'check the schedule against the room, supplies and staff needed to keep it',
	},
	{
		id: 'eni-ved',
		name: 'Eni Ved',
		bio: 'A community reporter focused on the services people need when they arrive with little notice.',
		beat: 'Housing, schools and language access',
		method:
			'ask who can use a service without an interpreter, sponsor or spare hour',
	},
	{
		id: 'toren-sil',
		name: 'Toren Sil',
		bio: 'Covers housing and civic membership through the records families are asked to produce.',
		beat: 'Settlement policy and household records',
		method:
			'compare the form a family receives with the rule the office says it follows',
	},
	{
		id: 'ava-korr',
		name: 'Ava Korr',
		bio: 'An archivist by training who reports on the custody and interpretation of public memory.',
		beat: 'Archives and civic history',
		method:
			'note who made a record, who preserved it and who can still consult it',
	},
	{
		id: 'dren-hol',
		name: 'Dren Hol',
		bio: 'Writes about craft, performance and the spaces where a city tells its own history.',
		beat: 'Arts, ceremony and shared memory',
		method:
			'look at what a work asks its audience to remember after the room empties',
	},
	{
		id: 'varda-kin',
		name: 'Varda Kin',
		bio: 'Reports on the ridge roads and the local agreements that keep traffic moving.',
		beat: 'Roads, crossings and neighboring towns',
		method: 'trace the route from the first signal to the final gate receipt',
	},
	{
		id: 'sorin-vek',
		name: 'Sorin Vek',
		bio: 'A diplomatic correspondent who keeps a close account of commitments made at the border.',
		beat: 'Caravans and regional diplomacy',
		method:
			'separate a promise entered into the minutes from a delivery confirmed at the gate',
	},
	{
		id: 'maela-dorn',
		name: 'Maela Dorn',
		bio: 'Covers working conditions and the small design choices that shape an industrial shift.',
		beat: 'Foundries, schedules and workplace safety',
		method:
			'follow the task through a complete shift, including the cleanup after the bell',
	},
	{
		id: 'kiva-rel',
		name: 'Kiva Rel',
		bio: 'Reports on skilled trades and the knowledge apprentices inherit at the bench.',
		beat: 'Training, tools and craft labor',
		method:
			'ask the apprentice to show the step a written instruction leaves out',
	},
];

export const authors: Author[] = [
	...curatedAuthors,
	...tradeAuthors,
	...STAFF.map(({ id, name, bio, beat }) => ({ id, name, bio, beat })),
];

interface ImageSpec {
	src: string;
	alt: string;
	caption: string;
	format: ArticleFormat;
}

interface Story {
	topic: string;
	title: string;
	seriesId: string;
	section: string;
	place: string;
	principal: string;
	role: string;
	record: string;
	measure: string;
	detail: string;
	stake: string;
	dispute: string;
	next: string;
	image?: ImageSpec;
}

const IMAGE = {
	chamberOpinion: {
		src: '/images/qsn/editorial.png',
		alt: 'An empty stone council chamber prepared for a public sitting.',
		caption: 'The council chamber before delegates take their places.',
		format: 'opinion',
	},
	chamberBriefing: {
		src: '/images/qsn/editorial.png',
		alt: 'An empty stone council chamber prepared for a public sitting.',
		caption: 'The council chamber before delegates take their places.',
		format: 'briefing',
	},
	assemblyInterview: {
		src: '/images/qsn/council.png',
		alt: 'Ward delegates and residents gathered in a stone public chamber.',
		caption: 'Residents meet with ward delegates in Kharad Venn.',
		format: 'interview',
	},
	assemblyBriefing: {
		src: '/images/qsn/council.png',
		alt: 'Ward delegates and residents gathered in a stone public chamber.',
		caption: 'Residents meet with ward delegates in Kharad Venn.',
		format: 'briefing',
	},
	cityFeature: {
		src: '/images/qsn/mountain-city.png',
		alt: 'Stone bridges and lit halls climb the cliffside of Kharad Venn.',
		caption: 'A view across Kharad Venn’s upper bridges and cliffside wards.',
		format: 'feature',
	},
	cityNarrative: {
		src: '/images/qsn/mountain-city.png',
		alt: 'Stone bridges and lit halls climb the cliffside of Kharad Venn.',
		caption: 'A view across Kharad Venn’s upper bridges and cliffside wards.',
		format: 'narrative',
	},
	mineInvestigation: {
		src: '/images/qsn/mine.png',
		alt: 'Miners inspect a timbered working face beside a mine rail.',
		caption: 'A crew checks the timber supports before the next shift enters.',
		format: 'investigation',
	},
	mineReporting: {
		src: '/images/qsn/mine.png',
		alt: 'Miners inspect a timbered working face beside a mine rail.',
		caption: 'A crew checks the timber supports before the next shift enters.',
		format: 'reporting',
	},
	marketFeature: {
		src: '/images/qsn/market.png',
		alt: 'Vendors and buyers trade beneath the arches of a stone market hall.',
		caption: 'The lower market hall at the morning exchange.',
		format: 'feature',
	},
	marketReporting: {
		src: '/images/qsn/market.png',
		alt: 'Vendors and buyers trade beneath the arches of a stone market hall.',
		caption: 'The lower market hall at the morning exchange.',
		format: 'reporting',
	},
} satisfies Record<string, ImageSpec>;

const STORIES: Story[] = [
	{
		topic: 'ash-assessment',
		title: 'The Ash Assessment',
		seriesId: 'council-record',
		section: 'Council & Public Life',
		place: 'the Upper Chamber of Measures',
		principal: 'Marda Thenn',
		role: 'keeper of the municipal fuel register',
		record: 'the kiln-duty roll and its exemption slips',
		measure: 'hearth entries',
		detail:
			'a pair of soot-darkened brass weights used to compare household allotments',
		stake:
			'whether the city’s largest kilns should carry a larger share of the ash levy',
		dispute:
			'The levy is assessed by furnace capacity, while small workshops say capacity does not show how many hours a kiln actually runs.',
		next: 'the chamber’s committee must publish a revised rate table before the next firing season',
		image: IMAGE.chamberOpinion,
	},
	{
		topic: 'winter-allotment',
		title: 'The Winter Allotment',
		seriesId: 'council-record',
		section: 'Council & Public Life',
		place: 'the Upper Chamber of Measures',
		principal: 'Ira Dannel',
		role: 'delegate for the Lower Steps ward',
		record: 'the household allocation book and the ward’s signed objections',
		measure: 'registered households',
		detail:
			'a slate board on which each ward marks the days its reserve will last',
		stake:
			'how reserve grain is divided when two wards reach the ration line in the same week',
		dispute:
			'The old rule favors wards by population; delegates from the steepest passages argue that travel time and storage loss also matter.',
		next: 'ward delegates will return with separate estimates of loss and delivery time',
		image: IMAGE.chamberOpinion,
	},
	{
		topic: 'stair-permit',
		title: 'The Stair Permit',
		seriesId: 'council-record',
		section: 'Council & Public Life',
		place: 'the Upper Chamber of Measures',
		principal: 'Eda Korrin',
		role: 'surveyor for the North Rise ward',
		record:
			'the public works docket and the surveyor’s marked elevation sheets',
		measure: 'permit applications',
		detail:
			'the handrail that narrows where the old stair meets a newer stone landing',
		stake:
			'whether a new public stair can pass through a shared landing without closing the older route',
		dispute:
			'The proposed alignment shortens the climb for upper homes but leaves less turning room for freight carriers.',
		next: 'a second survey must test the turning radius with loaded handcarts',
		image: IMAGE.chamberBriefing,
	},
	{
		topic: 'quiet-hour-rule',
		title: 'The Quiet-Hour Rule',
		seriesId: 'council-record',
		section: 'Council & Public Life',
		place: 'the Upper Chamber of Measures',
		principal: 'Harn Udel',
		role: 'convener of the lower-ward hearing',
		record:
			'the noise petitions, foundry schedules and the chamber’s hearing minutes',
		measure: 'signed petitions',
		detail:
			'a small bronze bell used to mark the end of each speaker’s allotted time',
		stake:
			'whether night work can continue beside homes without making the hearing rule a blanket industrial ban',
		dispute:
			'Residents describe interrupted sleep; the foundry says several orders can only be completed after the water-powered line slows.',
		next: 'the clerk is to publish the proposed quiet hours with the affected shift rosters attached',
		image: IMAGE.chamberBriefing,
	},
	{
		topic: 'lower-ward-hearing',
		title: 'The Lower Ward Hearing',
		seriesId: 'public-table',
		section: 'Council & Public Life',
		place: 'the Lower Ward meeting hall',
		principal: 'Sera Venn',
		role: 'chair of the ward’s elected table',
		record: 'the speaker queue, interpreter roster and final meeting minutes',
		measure: 'speakers who stayed through the vote',
		detail:
			'a chalk-marked speaking board beside the hall’s narrow stone entrance',
		stake:
			'whether ward residents can question a proposal before it is reduced to a yes-or-no vote',
		dispute:
			'The old queue gives precedence to registered household heads; younger workers and recent arrivals say that rule screens out people most affected by the night schedule.',
		next: 'the ward table will test a second speaking queue at its next open sitting',
		image: IMAGE.assemblyInterview,
	},
	{
		topic: 'newcomer-roll',
		title: 'The Newcomer Roll',
		seriesId: 'public-table',
		section: 'Council & Public Life',
		place: 'the Lower Ward meeting hall',
		principal: 'Vara Nemm',
		role: 'delegate for residents in their first year in the fortress',
		record:
			'the hall’s household roll and the separate list of unrepresented lodgers',
		measure: 'new household registrations',
		detail:
			'a second table set aside for people who need the proceedings interpreted',
		stake:
			'whether residents can raise a service problem before a sponsor or permanent address is recorded',
		dispute:
			'The housing office says sponsorship helps prevent duplicate allotments; residents without local kin say the wait leaves them uncounted.',
		next: 'the hall will compare registration wait times across three wards',
		image: IMAGE.assemblyInterview,
	},
	{
		topic: 'apprentice-vote',
		title: 'The Apprentice Vote',
		seriesId: 'public-table',
		section: 'Council & Public Life',
		place: 'the Lower Ward meeting hall',
		principal: 'Tova Brann',
		role: 'delegate for the shared workshops',
		record: 'the workshop roster and the rules for ward representation',
		measure: 'apprentices listed by trade',
		detail:
			'a workbench token each apprentice receives before the evening meeting',
		stake:
			'whether apprentices may elect a voting delegate while still bound to a master’s shop',
		dispute:
			'Guild stewards argue that apprentices lack independent contracts; the apprentices say they already carry independent duties and risk.',
		next: 'the table has asked the guilds to produce their current contract forms',
		image: IMAGE.assemblyBriefing,
	},
	{
		topic: 'water-queue',
		title: 'The Water Queue',
		seriesId: 'public-table',
		section: 'Water & Works',
		place: 'the Seventh Bridge landing',
		principal: 'Deli Arven',
		role: 'elected steward for the bridge households',
		record: 'the public queue board and the sluice keeper’s release marks',
		measure: 'posted collection turns',
		detail:
			'a line of copper tags that households move when a release is delayed',
		stake:
			'whether a posted queue can remain fair when the flow slows at the end of a long stair',
		dispute:
			'The water office counts collection turns; residents count the hours they wait beside a dry cistern.',
		next: 'an observer from the Upper Reservoir will time a full release at both landings',
		image: IMAGE.assemblyBriefing,
	},
	{
		topic: 'north-sluice',
		title: 'The North Sluice',
		seriesId: 'city-works',
		section: 'Water & Works',
		place: 'the North Sluice above the Lantern Stair',
		principal: 'Dema Orr',
		role: 'senior keeper of the north water gate',
		record: 'the gate’s release board and the ward cistern level marks',
		measure: 'measured release turns',
		detail:
			'a stone channel that narrows at the final bend above the lower cisterns',
		stake:
			'how much reserve water reaches the lower wards after a thaw pushes grit through the upper channel',
		dispute:
			'Keepers point to a steady total at the gate; residents point to a sharper fall in the last two cisterns.',
		next: 'a mason crew will inspect the final bend during the next low-flow window',
		image: IMAGE.cityFeature,
	},
	{
		topic: 'seven-arches',
		title: 'The Seven Arches',
		seriesId: 'city-works',
		section: 'Water & Works',
		place: 'the Seven Arches crossing above the east ravine',
		principal: 'Teren Bel',
		role: 'bridge inspector for the upper road',
		record: 'the stone-load register and the night watch’s closure notices',
		measure: 'loaded crossings',
		detail:
			'a pale repair seam beneath the fourth arch, visible from the lower path',
		stake:
			'whether the fourth arch can carry trade carts while repair stones are brought up the same road',
		dispute:
			'The inspector’s limit protects the oldest span; carriers say the alternate route adds a full stair and a second toll.',
		next: 'the masons will place a temporary measure stone before authorizing the next heavy load',
		image: IMAGE.cityFeature,
	},
	{
		topic: 'upper-reservoir',
		title: 'The Upper Reservoir',
		seriesId: 'city-works',
		section: 'Water & Works',
		place: 'the upper reservoir cut into the west face',
		principal: 'Pera Durn',
		role: 'water surveyor for the west face',
		record: 'the reservoir depth marks and the household release schedule',
		measure: 'depth marks checked at dawn',
		detail:
			'a narrow spillway whose lip sits one thumb above the older survey mark',
		stake:
			'whether the city can retain a larger reserve without flooding the maintenance walk below',
		dispute:
			'The reserve proposal uses a recent high-water mark; older surveyors say the mark was taken before the spillway was cleared.',
		next: 'the survey office will publish both measurements and their dates side by side',
		image: IMAGE.cityNarrative,
	},
	{
		topic: 'cliffside-lift',
		title: 'The Cliffside Lift',
		seriesId: 'city-works',
		section: 'Water & Works',
		place: 'the east cliff lift between the quarry road and the upper wards',
		principal: 'Hessi Varn',
		role: 'lift master on the east ascent',
		record: 'the lift’s rope-change log and its passenger closure notices',
		measure: 'completed lift runs',
		detail:
			'a wind bell on the upper landing that sounds when the lift is held for inspection',
		stake:
			'how to keep the lift available to residents while its main rope is replaced',
		dispute:
			'A full closure is safer and shorter; a staged closure preserves access but leaves less time for a second inspection.',
		next: 'the lift office will post a day-by-day access plan with the rope crew’s sign-off',
		image: IMAGE.cityNarrative,
	},
	{
		topic: 'east-seam',
		title: 'The East Seam',
		seriesId: 'deep-shift',
		section: 'Labor & Industry',
		place: 'the East Seam, four galleries below the old cart rail',
		principal: 'Uldra Ker',
		role: 'shift foreman on the east face',
		record: 'the soundings book and the crew’s pre-entry inspection cards',
		measure: 'soundings recorded before entry',
		detail: 'a hairline change in the slate above the second timber brace',
		stake:
			'whether the new iron markers reveal movement early enough to keep crews out of a failing face',
		dispute:
			'The foreman calls the readings a useful warning; the survey office says the marks need a second instrument before they can justify a closure.',
		next: 'a second surveyor will repeat the readings from the opposite wall',
		image: IMAGE.mineInvestigation,
	},
	{
		topic: 'lantern-fault',
		title: 'The Lantern Fault',
		seriesId: 'deep-shift',
		section: 'Labor & Industry',
		place: 'the Lantern Fault below the east water gallery',
		principal: 'Gevra Sol',
		role: 'geology reader assigned to the east crews',
		record:
			'the fault map, lamp checks and a sealed bag of recovered stone chips',
		measure: 'lamp readings taken at the marked stations',
		detail: 'a warm draft that changes direction just beyond the fourth marker',
		stake:
			'whether a new side passage can be surveyed without drawing the east crew into an unmeasured seam',
		dispute:
			'The draft suggests an open connection, but the old map records a collapse in the same direction.',
		next: 'the crew will hold the face while a remote lamp is lowered beyond the fourth marker',
		image: IMAGE.mineInvestigation,
	},
	{
		topic: 'south-ventilation',
		title: 'The South Ventilation Line',
		seriesId: 'deep-shift',
		section: 'Labor & Industry',
		place: 'the South Ventilation Line beside the old ore pass',
		principal: 'Kora Ennet',
		role: 'ventilation mechanic on the south shift',
		record: 'the fan register and the handwritten checks at each junction',
		measure: 'air checks entered per shift',
		detail:
			'a canvas test strip that catches the draft at the last occupied junction',
		stake:
			'whether the new fan can support an added working face without weakening the old return route',
		dispute:
			'The mill’s output plan assumes the new fan runs at full power; mechanics note that the return door still sticks on cold starts.',
		next: 'a loaded test will be repeated with the return door fitted to its replacement hinge',
		image: IMAGE.mineReporting,
	},
	{
		topic: 'eastern-hoist',
		title: 'The Eastern Hoist',
		seriesId: 'deep-shift',
		section: 'Labor & Industry',
		place: 'the eastern hoist chamber above the deep cart line',
		principal: 'Dori Tharn',
		role: 'rope examiner for the east hoist',
		record: 'the rope fiber samples and the hoist’s load-and-stop book',
		measure: 'test lifts completed under load',
		detail: 'a pale strand showing through the outer twist near the lower drum',
		stake:
			'when to retire the main rope without cutting the only heavy route to the lower workshops',
		dispute:
			'The examiner has found no failed fibers; the crew argues that a rope can pass a bench test and still behave badly under a stop.',
		next: 'the next trial will record a full stop with a stone load matched to the heaviest routine cart',
		image: IMAGE.mineReporting,
	},
	{
		topic: 'grain-market',
		title: 'The Grain Market',
		seriesId: 'market-ledger',
		section: 'Markets & Trade',
		place: 'the Lower Market Hall beside the east stair',
		principal: 'Nella Voss',
		role: 'grain measure on the morning exchange',
		record: 'the market scale book and the merchants’ sealed delivery chits',
		measure: 'sacks weighed before the first bell',
		detail: 'a chipped bronze weight kept beside the market’s standard measure',
		stake:
			'whether the morning price rise reflects a smaller harvest or a bottleneck at the lift',
		dispute:
			'Merchants cite fewer sacks at the gate; carriers say several loads waited below the cliff lift overnight.',
		next: 'the market clerk will publish weights from the gate and the hall on the same day',
		image: IMAGE.marketFeature,
	},
	{
		topic: 'copper-weight',
		title: 'The Copper Weight',
		seriesId: 'market-ledger',
		section: 'Markets & Trade',
		place: 'the assay table in the Lower Market Hall',
		principal: 'Ola Senn',
		role: 'licensed copper assayer',
		record:
			'the assay slips, stamped weights and the merchants’ challenge book',
		measure: 'bars checked against the common weight',
		detail:
			'a shallow notch on the old standard weight where a maker’s mark has worn smooth',
		stake:
			'whether the market should replace one shared standard or allow each guild to keep a certified weight',
		dispute:
			'Guilds say one standard hides differences in bar shape; buyers say multiple standards make a fair comparison harder.',
		next: 'the assay table will test both systems against the same set of bars',
		image: IMAGE.marketFeature,
	},
	{
		topic: 'salt-stall',
		title: 'The Salt Stall',
		seriesId: 'market-ledger',
		section: 'Markets & Trade',
		place: 'the salt arcade of the Lower Market Hall',
		principal: 'Yara Deth',
		role: 'keeper of the salt arcade cooperative',
		record: 'the warehouse issue slips and the stall’s daily brine-loss tally',
		measure: 'barrels opened for sale',
		detail:
			'a dry white line left on the stone shelf after a barrel is decanted',
		stake: 'how much spoilage the cooperative may include in the posted price',
		dispute:
			'The cooperative counts salt lost to damp air; buyers question whether the warehouse count already includes that loss.',
		next: 'the next price board will list the delivered weight before and after storage',
		image: IMAGE.marketReporting,
	},
	{
		topic: 'medicine-trade',
		title: 'The Medicine Trade',
		seriesId: 'market-ledger',
		section: 'Markets & Trade',
		place: 'the covered remedy row in the Lower Market Hall',
		principal: 'Tessa Orun',
		role: 'seller of dried mountain herbs',
		record: 'the remedy row’s origin tags and the public price board',
		measure: 'bundles carrying a verified origin mark',
		detail:
			'the blue thread tied around each bundle inspected by the remedy steward',
		stake:
			'whether the origin check protects buyers without pricing local gatherers out of the hall',
		dispute:
			'The steward says a traceable mark prevents substitution; gatherers say the new inspection fee exceeds the value of a small bundle.',
		next: 'the hall will review the fee beside the last three market prices',
		image: IMAGE.marketReporting,
	},
	{
		topic: 'clinic-roster',
		title: 'The Lower Clinic Roster',
		seriesId: 'care-under-stone',
		section: 'Health & Community',
		place: 'the Lower Ward clinic beside the warm-water hall',
		principal: 'Issen Thal',
		role: 'night physician at the lower clinic',
		record: 'the night roster, medicine cupboard log and referral slips',
		measure: 'unfilled clinic hours',
		detail:
			'a slate schedule with a blank space where the second night healer should be',
		stake:
			'whether one rotating healer can cover the lower ward without delaying urgent referrals',
		dispute:
			'The office counts a filled post when a substitute is named; patients count the hours between the first call and an arrival.',
		next: 'the health table will compare roster gaps with arrival times for the same nights',
	},
	{
		topic: 'herb-reserve',
		title: 'The Herb Reserve',
		seriesId: 'care-under-stone',
		section: 'Health & Community',
		place: 'the dry herb room behind the public infirmary',
		principal: 'Meri Sarn',
		role: 'keeper of the city’s dried-herb reserve',
		record: 'the reserve labels and the healers’ weekly issue notes',
		measure: 'bundles still within their marked use period',
		detail:
			'a shelf kept clear beneath the drip line from the upper stone seam',
		stake:
			'whether reserve bundles can be moved closer to the clinics without raising the risk of damp damage',
		dispute:
			'The central store is dry but distant; the neighborhood cabinets are faster to reach but vary in temperature.',
		next: 'two cabinets will be monitored through the next deep-winter cycle',
	},
	{
		topic: 'warm-water-hall',
		title: 'The Warm-Water Hall',
		seriesId: 'care-under-stone',
		section: 'Health & Community',
		place: 'the public warm-water hall in the Lower Ward',
		principal: 'Gelda Venn',
		role: 'sanitation steward for the public baths',
		record: 'the bath rotation chart and the settling basin checks',
		measure: 'water rotations completed before the final bell',
		detail:
			'a chalk line on the basin wall showing the last safe draw before cleaning',
		stake:
			'how to preserve access to the public baths while the settling basin is repaired',
		dispute:
			'A shortened schedule reduces wear on the basin; families who rely on the evening rotation say daytime hours are not an equal substitute.',
		next: 'the steward will post an evening rotation for residents who work the late shift',
	},
	{
		topic: 'garden-rot',
		title: 'The Deep Garden Blight',
		seriesId: 'care-under-stone',
		section: 'Health & Community',
		place: 'the Deep Garden terraces beneath the south cistern',
		principal: 'Nera Doss',
		role: 'cultivator responsible for the south beds',
		record: 'the bed rotation map and the growers’ sample notes',
		measure: 'beds showing the same pale edge on their leaves',
		detail:
			'a faint ring on the underside of leaves nearest the shared watering trench',
		stake:
			'whether the affected beds should be isolated before the next communal harvest',
		dispute:
			'Growers see the pattern spreading along one trench; the garden office says the samples do not yet distinguish rot from mineral stress.',
		next: 'the soil readers will take paired samples from both sides of the trench',
	},
	{
		topic: 'first-room-keys',
		title: 'The First-Room Keys',
		seriesId: 'settlement-lines',
		section: 'Health & Community',
		place: 'the South Welcome House above the lower market stairs',
		principal: 'Bera Noll',
		role: 'housing advocate at the welcome desk',
		record: 'the key register and the waiting list for family rooms',
		measure: 'families assigned a room before their temporary bed expires',
		detail:
			'a row of numbered keys hanging beside the house’s shared water board',
		stake:
			'how the city assigns a first room when family size and district capacity do not line up',
		dispute:
			'The current list favors earlier arrival; advocates say it can split a household whose members reached the gate on different caravans.',
		next: 'the housing table will publish the wait by household size, not only by place in line',
	},
	{
		topic: 'language-hall',
		title: 'The Language Hall',
		seriesId: 'settlement-lines',
		section: 'Health & Community',
		place: 'the shared language hall near the South Welcome House',
		principal: 'Leth Aran',
		role: 'interpreter coordinator for the south wards',
		record: 'the interpreter rota and the notices requested by ward offices',
		measure: 'public notices translated before a meeting',
		detail:
			'a wooden board with the same hearing notice written in four scripts',
		stake:
			'which city decisions need a translated notice before residents can give meaningful comment',
		dispute:
			'The clerk counts a notice as available once a copy is requested; interpreters say requests often arrive after a meeting is set.',
		next: 'the hall will compare request dates with the dates printed on the hearing notices',
	},
	{
		topic: 'shared-cistern-lease',
		title: 'The Shared Cistern Lease',
		seriesId: 'settlement-lines',
		section: 'Health & Community',
		place: 'the residents’ desk at Lantern Stair House',
		principal: 'Toma Vesh',
		role: 'tenant delegate for the Lantern Stair rooms',
		record: 'the lease copies and the cistern maintenance ledger',
		measure: 'leases that name a shared repair duty',
		detail:
			'a repair clause copied by hand into a margin too narrow for the full schedule',
		stake:
			'whether tenants can be billed for a repair when the lease does not say how the cost is divided',
		dispute:
			'The landlord cites a customary duty; residents say a custom cannot replace a written amount.',
		next: 'the housing clerk will compare the disputed clause with the signed copies held by both sides',
	},
	{
		topic: 'ward-school-slates',
		title: 'The Ward School Slates',
		seriesId: 'settlement-lines',
		section: 'Health & Community',
		place: 'the slate room at North Rise school',
		principal: 'Ari Deth',
		role: 'teacher responsible for the evening slate room',
		record: 'the lesson rota and the slate-room attendance marks',
		measure: 'evening lessons held with a full teaching pair',
		detail:
			'a set of practice slates shared between the day and evening groups',
		stake:
			'whether the school can add language lessons without taking the only writing hour from apprentices',
		dispute:
			'Families ask for more lessons after the work bell; teachers say the same hour is already promised to trade apprentices.',
		next: 'the school table will test a split session and record who can attend each half',
	},
	{
		topic: 'flood-map',
		title: 'The Flood Map',
		seriesId: 'stone-memory',
		section: 'Memory & Arts',
		place: 'the lower archive’s map room',
		principal: 'Ava Korr',
		role: 'keeper of the flood map collection',
		record:
			'the sealed flood map, the copy register and the mapmaker’s loose notes',
		measure: 'marked waterways compared with the modern survey',
		detail:
			'a faded blue line that bends around a sealed door absent from the modern map',
		stake:
			'whether the old route is evidence of a lost spill channel or simply a copyist’s correction mark',
		dispute:
			'The mapmaker’s notes were added decades later; the archive has not found a matching field survey.',
		next: 'the archive will publish a high-resolution copy with each later mark dated separately',
	},
	{
		topic: 'bell-foundry',
		title: 'The Bell Foundry',
		seriesId: 'stone-memory',
		section: 'Memory & Arts',
		place: 'the bell foundry above the old ceremonial stair',
		principal: 'Kelm Orra',
		role: 'sounder responsible for the city’s signal bells',
		record: 'the casting ledger and the pitch checks from the west gallery',
		measure: 'bells that held their assigned note after cooling',
		detail: 'a soft beat at the rim that appears only after the second cooling',
		stake:
			'whether the foundry can cast a new public bell without losing the pitch used for flood warnings',
		dispute:
			'The master caster says the alloy change is harmless; the signal crew says a narrow pitch shift can confuse a warning heard through stone.',
		next: 'the next casting will be tested from three listening posts before installation',
	},
	{
		topic: 'sealed-gallery-catalogue',
		title: 'The Sealed Gallery Catalogue',
		seriesId: 'stone-memory',
		section: 'Memory & Arts',
		place: 'the catalogue desk at the Old Gallery threshold',
		principal: 'Reldan Oss',
		role: 'cataloguer for objects recovered from sealed chambers',
		record:
			'the threshold inventory and the release slips signed by conservators',
		measure: 'objects with a public catalogue entry',
		detail:
			'a small clay tag whose number does not match the number in the register',
		stake:
			'how to describe objects from the sealed gallery without claiming a history the evidence cannot support',
		dispute:
			'The first catalogue calls the objects ceremonial; conservators say the recovered context is too mixed to confirm their use.',
		next: 'the archive will separate observed material from attributed history in each entry',
	},
	{
		topic: 'stone-chorus',
		title: 'The Stone Chorus',
		seriesId: 'stone-memory',
		section: 'Memory & Arts',
		place: 'the public chorus steps in the Hall of Echoes',
		principal: 'Neri Varn',
		role: 'conductor of the mixed-ward stone chorus',
		record: 'the hall’s rehearsal schedule and the chorus’s shared verse book',
		measure: 'ward groups represented at open rehearsals',
		detail:
			'a low ledge where singers can hear the second return of the hall’s echo',
		stake:
			'whether the city can preserve a shared chorus while allowing each ward to keep its own verses',
		dispute:
			'The music steward wants one agreed version for the annual ceremony; singers say variants are part of the record, not errors.',
		next: 'the next rehearsal will mark shared lines and ward-specific verses separately',
	},
	{
		topic: 'ridge-caravan',
		title: 'The Ridge Caravan',
		seriesId: 'outer-road',
		section: 'Outer Roads',
		place: 'the East Ridge gate above the cloud stair',
		principal: 'Varda Kin',
		role: 'road clerk on the east ascent',
		record: 'the gate manifest and the signal log from the ridge watch',
		measure: 'caravan loads checked before the cloud stair opens',
		detail:
			'a white route marker visible from the last switchback below the gate',
		stake:
			'whether the ridge road can reopen to ordinary freight before the late snow has cleared the outer turn',
		dispute:
			'The watch sees a passable surface from the wall; carriers report that the shaded turn remains slick under a loaded cart.',
		next: 'the road crew will post separate clearance times for foot traffic and freight',
	},
	{
		topic: 'envoy-ledger',
		title: 'The Envoy Ledger',
		seriesId: 'outer-road',
		section: 'Outer Roads',
		place: 'the guest table at the East Ridge gatehouse',
		principal: 'Enna Rusk',
		role: 'interpreter for the visiting Stonewater delegation',
		record:
			'the joint minutes and the delivery receipts for the last three exchanges',
		measure: 'promises matched to a confirmed delivery',
		detail:
			'two copies of the same agreement with different dates in the margin',
		stake:
			'whether an exchange can be renewed before both settlements agree on what the previous one delivered',
		dispute:
			'Kharad Venn’s copy records a timber shipment; Stonewater’s copy records a promise to send one after the thaw.',
		next: 'the interpreters will prepare a single dated record for both tables to initial',
	},
	{
		topic: 'west-switchback',
		title: 'The West Switchback',
		seriesId: 'outer-road',
		section: 'Outer Roads',
		place: 'the west switchback above the mule rest',
		principal: 'Hessa Tor',
		role: 'route marshal for the west road',
		record: 'the road crew’s stonefall notices and the mule train delay book',
		measure: 'switchback closures lasting longer than one bell',
		detail: 'a fresh fan of chips below the retaining wall’s third drain',
		stake:
			'whether to reopen the route between inspections or hold all freight until the retaining wall is rebuilt',
		dispute:
			'Carriers call short closures manageable; masons say repeated traffic shakes loose stone from the same seam.',
		next: 'the route marshal will time a loaded test after the drain has been cleared',
	},
	{
		topic: 'border-mill-accord',
		title: 'The Border Mill Accord',
		seriesId: 'outer-road',
		section: 'Outer Roads',
		place: 'the shared flour table at the north border mill',
		principal: 'Dorin Nel',
		role: 'grain delegate for the Kharad Venn trade table',
		record: 'the mill’s joint scale slips and the accord’s water-use clause',
		measure: 'mill turns recorded under the shared water allotment',
		detail:
			'a marked stone channel that feeds the mill only during the agreed hours',
		stake:
			'how two settlements can share a mill without turning each dry week into a dispute over priority',
		dispute:
			'The accord assigns turns by season; both delegations say the other has carried forward last season’s exception as a rule.',
		next: 'the joint table will publish the turn schedule with every exception dated',
	},
	{
		topic: 'furnace-breath',
		title: 'The Furnace Breath',
		seriesId: 'foundry-floor',
		section: 'Labor & Industry',
		place: 'the north furnace aisle in the communal ironworks',
		principal: 'Mera Doss',
		role: 'first smelter on the north furnace crew',
		record: 'the furnace heat marks and the crew’s pause-and-return log',
		measure: 'cooling pauses per completed charge',
		detail:
			'a soot line on the draft door that shifts when the intake starts to narrow',
		stake:
			'whether the new fuel mix can cut smoke without requiring a longer hot shift',
		dispute:
			'The mill measures fuel by charge; the crew says time spent clearing a slow draft is missing from that total.',
		next: 'the next trial will record both charge time and the minutes spent clearing the intake',
	},
	{
		topic: 'apprentice-bench',
		title: 'The Apprentice Bench',
		seriesId: 'foundry-floor',
		section: 'Labor & Industry',
		place: 'the shared apprentice bench below the north furnace',
		principal: 'Kelva Orr',
		role: 'master smith responsible for the shared bench',
		record: 'the bench sign-in board and the apprentices’ tool issue slips',
		measure: 'apprentices who completed a supervised tool check',
		detail:
			'a worn wooden gauge used to teach the difference between a clean edge and a sharp one',
		stake:
			'whether the city’s training mark should certify completed hours or demonstrated skill',
		dispute:
			'Masters favor observed work; apprentices say a single test can hide what they have learned across a full season.',
		next: 'the guild will trial a portfolio of completed pieces beside the bench examination',
	},
	{
		topic: 'foundry-schedule',
		title: 'The Foundry Schedule',
		seriesId: 'foundry-floor',
		section: 'Labor & Industry',
		place: 'the shift board outside the communal ironworks',
		principal: 'Reth Varn',
		role: 'scheduler for the communal ironworks',
		record: 'the posted shift board and the workers’ signed change requests',
		measure: 'shift changes approved before the prior bell',
		detail:
			'a red chalk mark showing where a double shift crosses the night bell',
		stake:
			'whether the mill can meet a large order without assigning a second shift at short notice',
		dispute:
			'The order is time-sensitive, but workers say the board records the assigned hours and leaves out the extra time needed to cool and reset the line.',
		next: 'the scheduler will compare planned hours with the line’s full reset time',
	},
	{
		topic: 'shared-tool-chest',
		title: 'The Shared Tool Chest',
		seriesId: 'foundry-floor',
		section: 'Labor & Industry',
		place: 'the common repair alcove between the forge and the rail shop',
		principal: 'Sarn Elt',
		role: 'repair steward for the common tool chest',
		record: 'the tool check-out slate and the rail shop’s breakage notes',
		measure: 'tools returned before the next crew’s starting bell',
		detail:
			'a shallow drawer where mismatched chisels collect after the rush shift',
		stake:
			'how to keep shared tools available without charging one crew for another crew’s wear',
		dispute:
			'The tool steward wants a single accountable borrower; crews say the chest is shared precisely because no one shop owns it.',
		next: 'the repair alcove will test a handoff mark signed by both outgoing and incoming crews',
	},
];

const AUTHOR_SEEDS: Array<{
	topic: string;
	cycle: number;
	format: ArticleFormat;
	article: Omit<Article, 'publishedAt' | 'relatedIds'>;
}> = [
	{
		topic: 'clinic-roster',
		cycle: 0,
		format: 'opinion',
		article: {
			id: 'qsn-seed-opinion',
			slug: 'qsn-seed-opinion',
			title: 'A clinic roster is a promise measured in hours',
			summary:
				'Kharad Venn should count the hours a healer is actually reachable, not only the names written on a night roster.',
			body: [
				'On the Lower Ward roster, a filled square means a healer has agreed to take the night. It does not tell a patient when that healer can leave the East Gallery, cross two gates and reach the clinic. The distinction is the whole argument now before the health table.',
				'The office counts unfilled posts. The patients who came to the clinic after the second bell count a longer measure: how long the room stayed without a second pair of hands. The cupboard log and referral slips show that these hours cluster around shift changes, not evenly across the week.',
				'No one is arguing that a name on a roster is worthless. It is the starting point for planning. But a staffing report that stops at the roster answers the easiest question and leaves the urgent one untouched: can the person assigned to care arrive in time to provide it?',
				'The next review should publish both measures side by side: assigned hours and arrival intervals. That would let the city compare a rotating healer with a second fixed post without pretending those arrangements serve every call equally.',
				'Care is a public system. A promise recorded in chalk becomes credible only when the door opens while someone still needs help.',
			],
			section: 'Health & Community',
			format: 'opinion',
			authorId: 'runa-ash',
			topic: 'clinic-roster',
			seriesId: 'care-under-stone',
		},
	},
	{
		topic: 'ward-school-slates',
		cycle: 4,
		format: 'feature',
		article: {
			id: 'qsn-seed-feature',
			slug: 'qsn-seed-feature',
			title: 'A lesson carried from the shared slate room',
			summary:
				'At North Rise school, one teacher is testing whether a split evening session can serve apprentices and newly arrived families.',
			body: [
				'When the work bell fades, Ari Deth turns the largest slate toward the doorway. A child who arrived with the late caravan can see the first letters from there without taking a seat from the apprentices already bent over their trade sums.',
				'The room is not large enough for two classes at once. Deth has begun splitting the evening: writing first, then the arithmetic the workshop apprentices need before their next bench examination. The change sounds modest until the attendance marks are read beside the lesson rota. The same hour has been promised twice.',
				'Families say the earlier part is reachable if supper can wait. Guild stewards say apprentices cannot learn a measuring rule in fragments. No one in the room describes the choice as a conflict between children and work; the question is how long the school can keep asking one small set of slates to serve both.',
				'The trial is being recorded by who attends each half, which lessons are finished and how many slates must be shared. Deth has asked the school table not to call a quiet first week a success until the full cycle of guild examinations has passed.',
				'At closing, Deth wipes only the examples that have been copied correctly. The unfinished sums remain for the next group, a small sign that the room’s schedule is still being negotiated.',
			],
			section: 'Health & Community',
			format: 'feature',
			authorId: 'eni-ved',
			topic: 'ward-school-slates',
			seriesId: 'settlement-lines',
		},
	},
	{
		topic: 'clinic-roster',
		cycle: 2,
		format: 'investigation',
		article: {
			id: 'qsn-seed-investigation',
			slug: 'qsn-seed-investigation',
			title: 'The roster records the post, not the response',
			summary:
				'A review of clinic schedules and referral slips finds that the city’s staffing measure does not capture late-night arrival gaps.',
			body: [
				'The Lower Clinic reports a staffed night whenever a healer has accepted the shift. A review of the roster, cupboard log and referral slips finds no corresponding measure for the time between a call and a healer’s arrival.',
				'We compared the clinic’s posted schedule with the referral copies kept by the ward table. Each record contains a different kind of time: the roster names a shift, while a referral notes when a patient was sent onward. Neither file, on its own, identifies the first call.',
				'The pattern is narrow but consistent. The longest waits described in the ward notes cluster around the change from forge shift to night watch. The clinic’s public summary counts the same nights as covered because the rotating healer remained assigned to them.',
				'The health office says the roster is meant to show coverage, not response. That explanation is supported by the form’s wording, but the office has not produced a second report that measures response intervals. A missing measure is not evidence of neglect; it is a reason the public cannot compare staffing plans on equal terms.',
				'The city has agreed to compare the arrival notes with the night schedule next. Until the first-call record is kept consistently, the exact size of the gap remains unknown.',
			],
			section: 'Health & Community',
			format: 'investigation',
			authorId: 'hadrik-nel',
			topic: 'clinic-roster',
			seriesId: 'care-under-stone',
		},
	},
	{
		topic: 'ridge-caravan',
		cycle: 1,
		format: 'reporting',
		article: {
			id: 'qsn-seed-reporting',
			slug: 'qsn-seed-reporting',
			title: 'East Ridge freight remains closed above the shaded turn',
			summary:
				'The gate is open to foot traffic while a loaded-cart test waits for the west-facing ice to clear.',
			body: [
				'The East Ridge gate reopened to foot traffic at first bell, but the road marshal has kept loaded freight below the shaded switchback while the late-season ice is assessed.',
				'Route Marshal Hessa Tor said the road crew cleared the upper marker and checked the wall from the gate. Carriers waiting at the mule rest described a slick surface on the final turn, where the sun reaches the road last.',
				'The two accounts describe different parts of the route. The watch can see the upper pass; the carriers are reporting from the switchback below it. The marshal has asked the crew to separate foot clearance from freight clearance on the next notice.',
				'No cart injury has been reported during the closure, and the gate office has not estimated when the loaded test can take place. Trade loads remain staged at the lower rest with their manifests intact.',
				'The next update is due after the road crew tests a loaded cart and records the condition of the west-facing turn.',
			],
			section: 'Outer Roads',
			format: 'reporting',
			authorId: 'varda-kin',
			topic: 'ridge-caravan',
			seriesId: 'outer-road',
		},
	},
	{
		topic: 'flood-map',
		cycle: 6,
		format: 'interview',
		article: {
			id: 'qsn-seed-interview',
			slug: 'qsn-seed-interview',
			title: 'What the archive can and cannot say about the flood map',
			summary:
				'Archivist Ava Korr explains why the map’s later blue line must be separated from the hand that first drew the route.',
			body: [
				'Q: The blue channel has become the center of the flood-map debate. What do we know about it?\nAva Korr: We know it is present on the surviving sheet and absent from the map copy made for the public catalogue. We do not yet know which hand added it.',
				'Q: The note beside it is sometimes described as a surveyor’s mark.\nKorr: That is an attribution, not a fact. The paper shows a later ink and a different hand. The loose notes in the same folder do not identify the writer.',
				'Q: Could the line show a real spill channel?\nKorr: It could. The mapmaker’s original work places a sealed door nearby. But the modern survey has not found a matching channel, and the map’s scale is not precise enough to settle that alone.',
				'Q: Why publish the uncertainty instead of waiting for an answer?\nKorr: Because people are already using the line to make claims about the old flood route. The catalogue should say what is observed and keep the interpretation open.',
				'Korr says the archive will release a high-resolution copy with the later marks dated separately. That will not prove who added the line; it will let readers examine the evidence on which the claim rests.',
			],
			section: 'Memory & Arts',
			format: 'interview',
			authorId: 'ava-korr',
			topic: 'flood-map',
			seriesId: 'stone-memory',
		},
	},
	{
		topic: 'shared-cistern-lease',
		cycle: 9,
		format: 'explainer',
		article: {
			id: 'qsn-seed-explainer',
			slug: 'qsn-seed-explainer',
			title: 'How the shared cistern lease divides repair costs',
			summary:
				'The disputed clause names a shared duty but not a formula; that difference determines what a tenant can challenge.',
			body: [
				'The Lantern Stair lease requires tenants to share cistern maintenance. It does not say whether that means equal shares, shares by room count or payment only when a household uses the cistern.',
				'That distinction matters because a maintenance duty and a bill are not the same thing. The lease copies identify who must take part in a repair, while the maintenance ledger records the cost after the work is done. Neither record currently supplies a division rule.',
				'The landlord points to the ward’s customary practice. The residents’ delegate points to the written clause. A customary arrangement may guide a repair, but without a dated amount it is difficult for either side to show how the bill was calculated.',
				'The housing clerk is comparing the copies held by the landlord and tenants. A difference in wording would change the question from how to read the rule to which version was agreed.',
				'What remains open is whether the city will require a formula in future leases or decide the current dispute under the practice already used in this ward.',
			],
			section: 'Health & Community',
			format: 'explainer',
			authorId: 'toren-sil',
			topic: 'shared-cistern-lease',
			seriesId: 'settlement-lines',
		},
	},
	{
		topic: 'seven-arches',
		cycle: 7,
		format: 'retrospective',
		article: {
			id: 'qsn-seed-retrospective',
			slug: 'qsn-seed-retrospective',
			title: 'The Seven Arches have carried less freight and more scrutiny',
			summary:
				'A season after the fourth-arch inspection began, the route is still open under a lower load limit while masons finish their test.',
			body: [
				'The first closure notice for the Seven Arches followed a fresh seam beneath the fourth span. The road inspector lowered the permitted load and sent heavy carts to the longer east route while masons examined the repair.',
				'In the weeks that followed, the city added a public load register and began posting the night watch’s closure marks beside it. The change made the rule easier to check, though carriers still paid a second toll when they could not use the crossing.',
				'The inspection has not found a failed stone. It has also not restored the earlier limit. The masons’ test asks whether the repaired seam shifts under a load that matches the heaviest ordinary cart, not whether the arch can bear a single ceremonial weight.',
				'The current arrangement trades time for caution: freight moves, but more slowly and at greater cost. Residents who use the upper bridge on foot have not faced the same restriction.',
				'The next measure stone will not resolve the wider question of when an old span is safe. It will show whether this particular crossing has changed under a defined load, which is the evidence the city did not have at the start.',
			],
			section: 'Water & Works',
			format: 'retrospective',
			authorId: 'ilen-far',
			topic: 'seven-arches',
			seriesId: 'city-works',
		},
	},
	{
		topic: 'west-switchback',
		cycle: 3,
		format: 'briefing',
		article: {
			id: 'qsn-seed-briefing',
			slug: 'qsn-seed-briefing',
			title: 'Ridge road: what is open, what is still being tested',
			summary:
				'Foot traffic has resumed at the East Ridge gate; loaded carts remain below the west-facing turn pending an inspection.',
			body: [
				'ACCESS: The East Ridge gate is open to pedestrians. Loaded freight remains staged at the mule rest below the shaded switchback.',
				'REASON: The watch cleared the upper pass, while carriers reported slick stone on the lower turn. The route marshal has separated foot clearance from freight clearance.',
				'CONFIRMED: The gate manifest is intact and no injury has been reported during the closure. The road crew has not yet completed a loaded-cart test.',
				'NEXT: The crew will post a separate clearance time for freight after checking the retaining wall and the west-facing surface.',
				'OPEN QUESTION: The gate office has not given a reopening estimate for heavy loads. This briefing will change when the road crew records the test result.',
			],
			section: 'Outer Roads',
			format: 'briefing',
			authorId: 'sorin-vek',
			topic: 'west-switchback',
			seriesId: 'outer-road',
		},
	},
	{
		topic: 'east-seam',
		cycle: 6,
		format: 'narrative',
		article: {
			id: 'qsn-seed-narrative',
			slug: 'qsn-seed-narrative',
			title: 'At the East Seam, the shift begins with a sound',
			summary:
				'Before the first cart moves, a crew listens to the slate above its second brace and writes down what changed.',
			body: [
				'Uldra Ker puts one lamp on the cart rail and another against the east wall. The crew waits for the shaft to settle into its morning hush; only then can a small change in the slate carry across the gallery.',
				'The soundings book is open to the same page that the surveyor marked at the end of the last shift. A hairline change above the second brace is not a verdict. It is a place to listen again, from the other side of the wall.',
				'One worker taps the timber while another records the pitch. Nobody steps beyond the chalk line. The inspection card has a box for a clear face and a separate box for a face held pending review; the crew marks the second.',
				'The east gallery will lose a morning of work if the brace needs replacement. It could lose more if a warning is treated as a delay instead of a piece of evidence.',
				'When the second surveyor arrives, Ker carries the lamp around the far wall. The note in the book is short: repeat the reading before entry. For now, the cart remains still.',
			],
			section: 'Labor & Industry',
			format: 'narrative',
			authorId: 'dara-vek',
			topic: 'east-seam',
			seriesId: 'deep-shift',
		},
	},
	{
		topic: 'eastern-hoist',
		cycle: 4,
		format: 'breaking',
		article: {
			id: 'qsn-seed-breaking',
			slug: 'qsn-seed-breaking',
			title: 'East hoist held after examiner finds a pale strand',
			summary:
				'The rope examiner has stopped heavy lifts for a second inspection; no failed fibers or injuries have been reported.',
			body: [
				'The eastern hoist is holding heavy loads after the rope examiner found a pale strand near the lower drum. The lift office has paused the next loaded run while a second examination is arranged.',
				'Examiner Dori Tharn said the visible strand has not been identified as a failed fiber. The stop is a precaution while the crew compares the sample with the rope’s load-and-stop book.',
				'No worker has been reported injured, and the mine has not closed the adjacent galleries. Light maintenance traffic is being routed through the west passage while the hoist remains held.',
				'The next test is expected to use a stone load matched to the heaviest routine cart and record a full stop at the lower drum. The office has not said when that test will begin.',
				'This is a developing report. The confirmed finding is a visible strand and a pause in heavy lifting; whether the rope needs replacement remains unresolved.',
			],
			section: 'Labor & Industry',
			format: 'breaking',
			authorId: 'kel-urun',
			topic: 'eastern-hoist',
			seriesId: 'deep-shift',
		},
	},
];

function seedCellKey(topic: string, cycle: number): string {
	return `${topic}:${cycle}`;
}

function pad(value: number, width: number): string {
	return String(value).padStart(width, '0');
}

function ordinalDate(ordinal: number): string {
	const epoch = Date.UTC(2031, 0, 1, 8, 0, 0) + ordinal * 3 * 60 * 60 * 1000;
	return new Date(epoch).toISOString();
}

function staffFor(
	storyIndex: number,
	round: number,
	formatIndex: number,
): Staffer {
	const seriesIndex = Math.floor(storyIndex / 4);
	const pairStart = seriesIndex * 2;
	const pairOffset = (round + formatIndex + storyIndex) % 2;
	return STAFF[pairStart + pairOffset];
}

const HEADLINE_VARIANTS: Record<ArticleFormat, string[]> = {
	opinion: [
		'The case for a checkable {title} rule',
		'Who bears the cost of {title}?',
		'Opinion: Keep a review date on {title}',
		'An exception is not a plan for {title}',
		'The {title} measure belongs in public',
	],
	feature: [
		'A shift at {place} follows the {title} record',
		'The people who carry the {title} rule',
		'What the record cannot show at {place}',
		'The daily work behind {title}',
		'After the bell at {place}',
	],
	investigation: [
		'The missing entry in the {title} file',
		'A second look at the {title} record',
		'The public total omits a condition at {place}',
		'Two records disagree on {title}',
		'A closer audit of {title}',
	],
	reporting: [
		'{title}: a new check is due at {place}',
		'The {title} review advances; the rule stays in force',
		'{title}: what changed in the latest review',
		'The next test for {title} will use a separate crew',
		'{title} returns to the public table',
	],
	interview: [
		'{principal} on what the {title} record can prove',
		'Five questions for {principal} about {title}',
		'{principal} discusses the limits of the {title} count',
		'At the table with {principal}, keeper of the {title} file',
		'{principal} explains the unresolved {title} measure',
	],
	explainer: [
		'How the {title} rule works and where it stops',
		'What residents need to know about {title}',
		'The record, the rule and the open question in {title}',
		'Why two totals matter in the {title} file',
		'{title}, explained from the source register up',
	],
	retrospective: [
		'{title}: what changed after the first warning',
		'A season of records on {title}',
		'The {title} decision, measured against its first promise',
		'From first notice to review: the {title} timeline',
		'What the city has learned from {title}',
	],
	briefing: [
		'{title}: status, next date and open questions',
		'The {title} file in five points',
		'What is confirmed and still unsettled in {title}',
		'{title}: the figures behind the next vote',
		'A short guide to the {title} docket',
	],
	narrative: [
		'At {place}, the next mark matters',
		'The quiet check before a crew enters {place}',
		'One shift, two counts and the {title} question',
		'The line on the slate at {place}',
		'Before the bell: a day inside {title}',
	],
	breaking: [
		'Update: the {title} review reaches a new step',
		'{title}: the latest confirmed change',
		'New finding in the {title} file; larger question remains',
		'Breaking: {principal} reports a new {title} check',
		'{title} docket advances; next test is pending',
	],
};

const DOCKET_WINDOWS = [
	'opening docket',
	'first register',
	'public reading',
	'field review',
	'midyear count',
	'second register',
	'second reading',
	'public comment',
	'trial period',
	'interim review',
	'winter count',
	'renewal hearing',
	'follow-up survey',
	'maintenance audit',
	'district return',
	'late-season check',
	'interim finding',
	'open-book review',
	'common measure',
	'inspection order',
	'service audit',
	'public comment close',
	'review week',
	'annual return',
	'closeout hearing',
];

function substituteHeadline(template: string, story: Story): string {
	const displayName = story.title.replace(/^(?:the|a|an)\s+/i, '');
	return template
		.replaceAll('{title}', displayName)
		.replaceAll('{place}', story.place)
		.replaceAll('{record}', story.record)
		.replaceAll('{principal}', story.principal);
}

function storyName(story: Story): string {
	return story.title.replace(/^(?:the|a|an)\s+/i, '').toLowerCase();
}

function capitalize(sentence: string): string {
	return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function asSentence(text: string): string {
	const normalized = capitalize(text.trim());
	return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function formatSummary(
	format: ArticleFormat,
	story: Story,
	docket: number,
	season: string,
	step: string,
	count: number,
): string {
	const docketName = DOCKET_WINDOWS[docket - 1];
	switch (format) {
		case 'opinion':
			return `In the ${docketName} file, the ${storyName(story)} rule turns on who carries its cost. The record includes ${count} ${story.measure}; the harder question is whether the rule can be checked in ${story.place}.`;
		case 'feature':
			return `At ${story.place}, ${story.principal} works through the ${season} routine around the ${storyName(story)}. This installment follows the file from the first mark to the people who rely on it.`;
		case 'investigation':
			return `A comparison of ${story.record} finds what the ${docketName} count can establish and what remains absent from the public summary.`;
		case 'reporting':
			return `A new step in ${storyName(story)}: ${asSentence(step)} The current rule remains in place.`;
		case 'interview':
			return `${story.principal}, ${story.role}, explains why ${count} ${story.measure} do not settle the question raised at ${story.place}.`;
		case 'explainer':
			return `The file on ${storyName(story)} compares ${story.record} with the rule used at ${story.place}. Here is what the latest step changes.`;
		case 'retrospective':
			return `The ${docketName} review marks another point in the ${storyName(story)} record, from its first notice to the current test.`;
		case 'briefing':
			return `A dated status note on ${storyName(story)}: current evidence, the unresolved objection and the next public date.`;
		case 'narrative':
			return `${story.principal} follows ${story.record} at ${story.place} as the ${season} shift reaches its next decision.`;
		case 'breaking':
			return `The latest confirmed step is that ${step}. Next: ${asSentence(story.next)}`;
	}
}

function composeBody(
	format: ArticleFormat,
	story: Story,
	cycle: number,
	docket: number,
	season: string,
	step: string,
	writer: Staffer,
	storyIndex: number,
): string[] {
	const count = 9 + ((storyIndex * 19 + docket * 13 + cycle * 7) % 61);
	const previous = Math.max(2, count + ((storyIndex + docket) % 9) - 4);
	const docketName = DOCKET_WINDOWS[docket - 1];
	const docketCode = `${story.topic.toUpperCase()}-${pad(docket, 2)}`;
	const subject = storyName(story);
	const condition =
		story.detail.charAt(0).toLowerCase() + story.detail.slice(1);
	const stageLine = `${asSentence(step)} The entry belongs to the ${docketName} file at ${story.place}.`;
	const measured = `${count} ${story.measure} were entered this cycle, compared with ${previous} in the prior file.`;
	const methodLine = `${writer.name} checked ${story.record} against the field notes. The method is to ${writer.method}; it confirms the entries, but not every interpretation attached to them.`;
	const outstanding = `${asSentence(story.dispute)} The current record does not settle that disagreement.`;

	switch (format) {
		case 'opinion':
			return [
				`A decision on the ${subject} should be judged by what happens at ${story.place}. The docket is at step ${(cycle % 10) + 1} of the current review. Its latest entry reads: ${asSentence(step)} A rule that looks complete in the chamber can still leave the people who use it carrying an unmeasured cost.`,
				`${measured} That comparison matters because the public summary counts entries. The open question is ${story.stake}.`,
				`${outstanding} The objection deserves a direct answer, but it is not a reason to make the rule permanent before the affected residents can check the method.`,
				`${methodLine} The practical evidence is ${condition}; any new measure should record that condition beside the total.`,
				`The chamber should approve a limited trial with a published end date, a way to record exceptions and a named reviewer. ${asSentence(story.next)} That is the narrowest decision that can be defended from the evidence now available.`,
			];
		case 'feature':
			return [
				`At ${story.place}, ${story.principal} keeps the ${docketName} file beside ${condition}. The two details are easy to miss in a summary: one is a line in a ledger, the other is the condition that decides whether the line is useful.`,
				`${story.principal} is the ${story.role}. On this ${season} visit, the work begins with ${story.record}; only after the entry is checked can the crew say what the rule asks of the people below.`,
				`${measured} The figure is one part of a longer handoff. ${methodLine}`,
				`${outstanding} Residents closest to the work describe the difference as a route, a wait or a shift that cannot be moved on a slate. Their accounts have been attached to the docket rather than folded into the total.`,
				`${stageLine} ${asSentence(story.next)} The next visit will show whether the revision travels beyond the office that wrote it.`,
			];
		case 'investigation':
			return [
				`The public account of the ${subject} relies on ${story.record}. A review of that source and the field notes finds a specific limit: the count can be repeated, but it does not include ${condition}.`,
				`${methodLine} The comparison covers ${count} ${story.measure}; ${previous} appear in the prior file. No signed correction to either entry was present when this review closed.`,
				`${story.principal}, ${story.role}, said the source register was complete for its stated purpose. The office has not provided a separate measure for ${story.stake}, so the public record cannot yet show which account is more representative.`,
				`${outstanding} This report does not establish that either side misstated the evidence. It establishes that the published total is narrower than the conclusion being drawn from it.`,
				`${stageLine} ${asSentence(story.next)} The next file should preserve the original entries and explain any change in method.`,
			];
		case 'reporting':
			return [
				`The latest file on the ${subject} records that ${step}. The existing rule remains in force; officials have not announced a permanent change.`,
				`${story.principal}, ${story.role}, said the latest file records ${count} ${story.measure}, compared with ${previous} in the previous count. The figures cover the entries on the register, not every condition at the site.`,
				`${outstanding} At the latest public table, residents asked the clerk to keep their account beside the source count. No final finding has been issued.`,
				`${methodLine} The docket is marked ${docketCode}, and the next check is assigned to a second crew.`,
				`${asSentence(story.next)} Until that check is complete, the schedule already in force continues to govern.`,
			];
		case 'interview':
			return [
				`Q: What changed in the ${docketName} review?\n${story.principal}: ${asSentence(step)} That changes what is in the file; it does not, by itself, change the rule.`,
				`Q: Which entry should residents look at first?\n${story.principal}: ${story.record}. This cycle records ${count} ${story.measure}, against ${previous} in the last count. The dates and the method matter as much as the total.`,
				`Q: Why is there still a disagreement?\n${story.principal}: ${asSentence(story.dispute)} We have not found a single measure that answers both accounts.`,
				`Q: What will the next check tell you?\n${story.principal}: ${asSentence(story.next)} If it is recorded by another crew, we can see whether the first result was about the method or about the place.`,
				`Q: What should the public not infer yet?\n${story.principal}: That a lower or higher count settles ${story.stake}. It tells us what was entered, not who should carry the cost.`,
			];
		case 'explainer':
			return [
				`Start with ${story.record}. It is the source used to make a decision about ${story.stake}; it is not the decision itself. The rule only works if the source describes the conditions at ${story.place}.`,
				`The latest count is ${count} ${story.measure}; the prior file listed ${previous}. ${asSentence(step)} The difference is a signal to check, not a verdict about who is right.`,
				`The disputed point is practical: ${asSentence(story.dispute)} One side relies on the posted total, while the other points to ${condition}.`,
				`The risk of reading the file too broadly is that an entry becomes a conclusion. ${methodLine}`,
				`Next: ${asSentence(story.next)} A useful update will publish the method, exceptions and review date with the number.`,
			];
		case 'retrospective':
			return [
				`The first ${subject} notice began with ${story.record}. Since then, the city has moved through a source check, a public hearing and a trial at ${story.place}.`,
				`The current docket records ${count} ${story.measure}; the earlier file recorded ${previous}. The count is more specific than the first summary, but still does not answer ${story.stake}.`,
				`A key point in the timeline was the discovery of ${condition}. It narrowed the dispute from a general claim about the rule to a question about how the rule behaves at the site.`,
				`${outstanding} The parties now share more of the record than they did at the start, though they assign it different weight.`,
				`${stageLine} ${asSentence(story.next)} The next review will show whether the change lasts beyond this docket or returns as another temporary exception.`,
			];
		case 'briefing':
			return [
				`STATUS: ${capitalize(step)}. The current rule remains in force at ${story.place}.`,
				`RECORD: ${capitalize(story.record)}. This file counts ${count} ${story.measure}; the prior count was ${previous}.`,
				`DISPUTE: ${asSentence(story.dispute)}`,
				`WHY IT MATTERS: The decision concerns ${story.stake}. The current count does not settle how the rule should allocate the cost.`,
				`NEXT: ${asSentence(story.next)} The clerk has marked the file ${docketCode} for the next public review.`,
			];
		case 'narrative':
			return [
				`${story.principal} opens ${story.record} at ${story.place}. Before anyone moves a cart or changes a mark, the crew checks ${condition}. The ${season} air brings its own pace to the passage.`,
				`The latest page holds ${count} ${story.measure}. ${story.principal} reads the previous count (${previous}) before the next mark is made. It is a small pause, long enough for the people at the rail to hear what the number leaves out.`,
				`${outstanding} The difference between those accounts is visible here: a rule on the board and a working condition just beyond it.`,
				`${stageLine} The next check will be made by another crew, asked to repeat the measure without borrowing the first crew’s conclusion.`,
				`When the shift closes, the file remains beside the marked place. ${asSentence(story.next)} Until then, the route, schedule or allotment stays as it was at the opening bell.`,
			];
		case 'breaking':
			return [
				`The latest confirmed development in ${subject} is that ${step}. The update comes from ${story.place}; officials have not announced a permanent change to the rule.`,
				`${story.principal}, ${story.role}, confirmed ${count} ${story.measure} in the latest file. The previous count was ${previous}. The figures do not yet resolve ${story.stake}.`,
				`The unresolved point is specific: ${asSentence(story.dispute)} No finding has established that either account is final.`,
				`The current arrangement remains in place. The office has not said whether it will change before the next review.`,
				`NEXT UPDATE: ${asSentence(story.next)} The file will be updated when the second check is complete; until then, the confirmed record is narrower than the claims around it.`,
			];
	}
}

function buildGeneratedArticle(
	storyIndex: number,
	cycle: number,
	formatIndex: number,
	publishedAt: string,
): Article {
	const story = STORIES[storyIndex];
	const format = FORMATS[formatIndex];
	const docket = Math.floor(cycle / 10) + 1;
	const season = SEASON_BY_CYCLE(cycle);
	const step = MILESTONE_STEPS[cycle % MILESTONE_STEPS.length];
	const writer = staffFor(storyIndex, cycle, formatIndex);
	const variant = (docket - 1 + storyIndex * 2) % 5;
	const generatedHeadline = substituteHeadline(
		HEADLINE_VARIANTS[format][variant],
		story,
	);
	const id = `qsn-${story.topic}-c${pad(cycle + 1, 3)}-${format}`;
	const count = 9 + ((storyIndex * 19 + docket * 13 + cycle * 7) % 61);
	const article: Article = {
		id,
		slug: id,
		title: `${generatedHeadline}: ${DOCKET_WINDOWS[docket - 1]}`,
		summary: formatSummary(format, story, docket, season, step, count),
		body: composeBody(
			format,
			story,
			cycle,
			docket,
			season,
			step,
			writer,
			storyIndex,
		),
		section: story.section,
		format,
		authorId: writer.id,
		publishedAt,
		topic: story.topic,
		seriesId: story.seriesId,
		relatedIds: [],
	};
	if (story.image?.format === format) {
		article.image = {
			src: story.image.src,
			alt: story.image.alt,
			caption: story.image.caption,
		};
	}
	if (format === 'breaking' && cycle % 7 === 3) {
		article.updatedAt = new Date(
			Date.parse(publishedAt) + 75 * 60 * 1000,
		).toISOString();
	}
	return article;
}

function buildAuthoredArticle(
	article: Omit<Article, 'publishedAt' | 'relatedIds'>,
	publishedAt: string,
): Article {
	return { ...article, publishedAt, relatedIds: [] };
}

function buildCorpus(): Article[] {
	const seedCoordinates = new Map<
		string,
		(typeof AUTHOR_SEEDS)[number]['article']
	>();
	for (const seed of AUTHOR_SEEDS) {
		seedCoordinates.set(seedCellKey(seed.topic, seed.cycle), seed.article);
	}
	for (const slot of tradeSlots) {
		seedCoordinates.set(
			seedCellKey(slot.article.topic, slot.cycle),
			slot.article,
		);
	}
	for (const slot of curatedSlots) {
		seedCoordinates.set(
			seedCellKey(slot.article.topic, slot.cycle),
			slot.article,
		);
	}

	const output: Article[] = [];
	for (let cycle = 0; cycle < 250; cycle += 1) {
		for (let position = 0; position < STORIES.length; position += 1) {
			// 17 is coprime to 40, so every topic appears once in each cycle.
			const storyIndex = (position * 17 + cycle * 13) % STORIES.length;
			const formatIndex = (storyIndex + cycle) % FORMATS.length;
			const story = STORIES[storyIndex];
			const seed = seedCoordinates.get(seedCellKey(story.topic, cycle));
			const publishedAt = ordinalDate(output.length);
			const article = seed
				? buildAuthoredArticle(seed, publishedAt)
				: buildGeneratedArticle(storyIndex, cycle, formatIndex, publishedAt);
			if (!article.image && story.image?.format === article.format) {
				article.image = {
					src: story.image.src,
					alt: story.image.alt,
					caption: story.image.caption,
				};
			}
			output.push(article);
		}
	}

	const byTopic = new Map<string, Article[]>();
	const bySeries = new Map<string, Article[]>();
	for (const article of output) {
		const topicArticles = byTopic.get(article.topic) ?? [];
		topicArticles.push(article);
		byTopic.set(article.topic, topicArticles);
		if (article.seriesId) {
			const seriesArticles = bySeries.get(article.seriesId) ?? [];
			seriesArticles.push(article);
			bySeries.set(article.seriesId, seriesArticles);
		}
	}

	for (const article of output) {
		const topicArticles = byTopic.get(article.topic) ?? [];
		const topicIndex = topicArticles.indexOf(article);
		const related = [
			topicArticles[topicIndex - 1],
			topicArticles[topicIndex + 1],
		]
			.filter((candidate): candidate is Article => candidate !== undefined)
			.map((candidate) => candidate.id);
		const seriesArticles = article.seriesId
			? (bySeries.get(article.seriesId) ?? [])
			: [];
		const sameIssueFromSeries = seriesArticles.find(
			(candidate) =>
				candidate.id !== article.id &&
				candidate.publishedAt.slice(0, 10) === article.publishedAt.slice(0, 10),
		);
		if (sameIssueFromSeries && !related.includes(sameIssueFromSeries.id)) {
			related.push(sameIssueFromSeries.id);
		}
		article.relatedIds = related;
	}

	return output;
}

export const articles: Article[] = buildCorpus();

const articlesById = new Map<string, Article>(
	articles.map((article) => [article.id, article]),
);

export function getArticle(id: string): Article | undefined {
	return articlesById.get(id);
}
