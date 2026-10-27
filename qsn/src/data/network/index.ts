/**
 * Sister editions are materialized one publication at a time. Each edition
 * contains 30 recurring beats across 600 dated review cycles. Four spotlight
 * stories per edition are individually authored; the remaining 17,996 use
 * deterministic story facts, changing measurements and format-specific copy.
 * The generated records are not 18,000 individually reported articles.
 */
import type { Publication } from '../publications';
import type { Article, Author, Series } from '../types';
import { sectionArtwork } from '../visuals';

export type SisterDataset = {
	articles: Article[];
	authors: Author[];
	series: Series[];
	sections: string[];
	getArticle: (id: string) => Article | undefined;
};

type Format =
	| 'opinion'
	| 'feature'
	| 'investigation'
	| 'reporting'
	| 'interview'
	| 'explainer'
	| 'retrospective'
	| 'briefing'
	| 'narrative'
	| 'breaking';

const FORMATS: Format[] = [
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
];

type SisterAuthor = Author & { method: string };

interface BeatDraft {
	topic: string;
	title: string;
	place: string;
	principal: string;
	role: string;
	record: string;
	measure: string;
	detail: string;
	stake: string;
	dispute: string;
	next: string;
}

interface ResolvedBeat extends BeatDraft {
	section: string;
	seriesId: string;
}

interface DeskDraft {
	section: string;
	series: Omit<Series, 'id'> & { slug: string };
	stories: BeatDraft[];
}

interface SpotlightDraft {
	topic: string;
	format: Format;
	title: string;
	summary: string;
	authorId: string;
	body: string[];
	closeout: string;
}

interface Profile {
	publicationId: string;
	key: string;
	city: string;
	seasons: string[];
	voice: string;
	staff: SisterAuthor[];
	desks: DeskDraft[];
	spotlights: SpotlightDraft[];
	steps: string[];
	outcomes: string[];
}

const PROFILES: Record<string, Profile> = {
	humans: {
		publicationId: 'humans',
		key: 'hsn',
		city: 'Bellwater',
		seasons: ['river rise', 'high summer', 'market fall', 'cold harbor'],
		voice:
			'follow a public decision from the signed page to the household that has to live with it',
		staff: [
			{
				id: 'hsn-ada-merrow',
				name: 'Ada Merrow',
				bio: 'Tracks how city policy changes rents, services and the choices available to a household.',
				beat: 'City hall and neighborhood life',
				method: 'ward records and interviews with people who use the service',
			},
			{
				id: 'hsn-tomas-reed',
				name: 'Tomas Reed',
				bio: 'A river and transport correspondent who follows each route from its first gate to its final stop.',
				beat: 'River works and public transport',
				method: 'time-stamped route logs checked against field visits',
			},
			{
				id: 'hsn-lina-vale',
				name: 'Lina Vale',
				bio: 'Reports with schools, clinics and the residents who depend on them between shifts.',
				beat: 'Care, schools and access',
				method:
					'service rosters compared with the hours a resident can actually reach a desk',
			},
			{
				id: 'hsn-marek-stone',
				name: 'Marek Stone',
				bio: 'Covers markets, public contracts and the figures posted for buyers and workers.',
				beat: 'Work, markets and public accounts',
				method: 'posted terms set beside signed receipts and final invoices',
			},
		],
		desks: [
			{
				section: 'Civic Life',
				series: {
					slug: 'civic-ledger',
					title: 'The Civic Ledger',
					description:
						'A record of city decisions, ward testimony and the dates attached to public promises.',
				},
				stories: [
					{
						topic: 'ward-budget-hearings',
						title: 'Ward Budget Hearings',
						place: 'the South Ward hall',
						principal: 'Mina Corbett',
						role: 'elected budget clerk',
						record: 'the ward allocation book and signed hearing notes',
						measure: 'budget lines checked against ward requests',
						detail:
							'a drainage repair entered as a shared cost in two neighboring wards',
						stake:
							'how repair money is divided when one street drains through two wards',
						dispute:
							'North Ward counts the upstream work while South Ward counts the homes reached by the runoff. Both figures describe part of the same repair.',
						next: 'the clerk will publish both ward estimates beside the engineer’s route map',
					},
					{
						topic: 'river-council-minutes',
						title: 'River Council Minutes',
						place: 'the public table in Ferry House',
						principal: 'Oren Lyle',
						role: 'minute keeper for the river council',
						record: 'the signed minutes and the clerk’s amendment register',
						measure: 'motions with a dated disposition',
						detail:
							'a margin correction added after the final reading of a ferry motion',
						stake:
							'whether a late amendment changed a ferry schedule or only clarified its start date',
						dispute:
							'One copy treats the change as a new service rule. The clerk says the vote kept the old rule and added a date for the trial.',
						next: 'the council will compare the amendment register with the recording made during the vote',
					},
					{
						topic: 'public-notice-translation',
						title: 'Public Notice Translation',
						place: 'the notice desk at Old Bell Square',
						principal: 'Sami Orr',
						role: 'coordinator for ward interpreters',
						record:
							'the translation rota and the first-print date on each notice',
						measure: 'hearing notices translated before the meeting date',
						detail: 'a draft date now travels with the notice request',
						stake:
							'how early residents can plan around a hearing when the meeting date is still tentative',
						dispute:
							'Clerks count a notice when the final date is set. Interpreters say a draft date is needed before residents can arrange work and travel.',
						next: 'the desk will compare translation requests with the dates printed on the next twelve notices',
					},
					{
						topic: 'riverfront-lease-register',
						title: 'Riverfront Lease Register',
						place: 'the registry at North Quay',
						principal: 'Tessa Burn',
						role: 'public records registrar',
						record: 'the lease register and the paper copies kept by tenants',
						measure: 'renewal clauses with a notice date in both copies',
						detail:
							'several older leases name a quay stair that has since been renumbered',
						stake:
							'whether a tenant received notice when the address on an old lease no longer matches the street board',
						dispute:
							'Landlords point to the registry entry. Tenants say the notice reached the wrong doorway after the quay was renumbered.',
						next: 'the registrar will compare delivery receipts with the current stair map',
					},
					{
						topic: 'civic-assembly-access',
						title: 'Civic Assembly Access',
						place: 'the east entrance of Common Hall',
						principal: 'Jory Fen',
						role: 'access steward for public sittings',
						record: 'the entrance log and requests for reserved seating',
						measure:
							'public sittings with a step-free route open at the first bell',
						detail:
							'a temporary ramp is moved aside when market carts use the same lane',
						stake:
							'how an accessible entrance can stay clear during market deliveries',
						dispute:
							'The market keeper wants a timed delivery lane. Residents say a route that is clear only by request is not reliably open.',
						next: 'the hall will test a marked delivery window with a reserved access lane',
					},
				],
			},
			{
				section: 'River & Transit',
				series: {
					slug: 'river-register',
					title: 'The River Register',
					description:
						'Ferries, bridges and gauges followed from the first measurement to the route used by residents.',
				},
				stories: [
					{
						topic: 'east-quay-gauge',
						title: 'The East Quay Gauge',
						place: 'the East Quay flood stair',
						principal: 'Nell Arven',
						role: 'river gauge keeper',
						record: 'the quay gauge book and the upstream water board',
						measure: 'readings paired with an upstream time stamp',
						detail:
							'the lower gauge sits in the shade for two hours after sunrise',
						stake:
							'how the city distinguishes a rising river from a local gauge warmed by direct sun',
						dispute:
							'Quay residents say the lower mark rises first. The water board says its upstream station gives the more stable warning.',
						next: 'a second gauge will be read at the same hour on both sides of the quay',
					},
					{
						topic: 'night-ferry-berths',
						title: 'Night Ferry Berths',
						place: 'the West Slip ferry landing',
						principal: 'Tomas Reed',
						role: 'transport correspondent',
						record: 'the evening manifest and the ferry crew’s berth log',
						measure: 'late crossings that reached the clinic connection',
						detail:
							'the last clinic transfer is four minutes earlier than the final boat on the public board',
						stake:
							'whether the timetable protects the connection for residents who finish a late shift',
						dispute:
							'The harbor office records the boat’s arrival. Clinic staff record whether passengers can make the connecting stair before it closes.',
						next: 'the harbor office will record both arrival and connection times for a full review window',
					},
					{
						topic: 'north-span-load-limit',
						title: 'North Span Load Limit',
						place: 'the North Span over Mill Channel',
						principal: 'Rell Doran',
						role: 'bridge inspector',
						record: 'the stone-load register and repair crew’s closure notes',
						measure: 'heavy crossings made under the temporary limit',
						detail:
							'a new seam is visible near the north bearing after a wet week',
						stake:
							'whether the span can carry ordinary freight while a bearing stone is reset',
						dispute:
							'Carriers say the detour adds a second toll. The inspector says the seam needs one measured load before the limit changes.',
						next: 'masons will record a test load after the new bearing stone is seated',
					},
					{
						topic: 'canal-sluice-schedule',
						title: 'Canal Sluice Schedule',
						place: 'the South Canal sluice house',
						principal: 'Iven Holt',
						role: 'canal operator',
						record: 'the gate release board and millers’ water receipts',
						measure: 'release minutes recorded at the lower gate',
						detail:
							'the downstream clock runs slow when its iron casing is cold',
						stake:
							'how water turns are apportioned when the clock and the gate marker disagree',
						dispute:
							'Millers use the gate clock to plan a shift. Canal crews compare it with the marked level on the stone wall.',
						next: 'the canal crew will post a checked clock reading beside each release',
					},
					{
						topic: 'cross-town-transfer',
						title: 'Cross-Town Transfer',
						place: 'the Three Bridges transfer stop',
						principal: 'Mara Noll',
						role: 'route planner for the city coaches',
						record: 'coach dispatch times and passenger transfer slips',
						measure: 'connections completed within the posted interval',
						detail: 'the coach stand moved one block during paving work',
						stake:
							'whether a route change still counts as a connection when the stand moves',
						dispute:
							'The dispatch book counts matching departures. Passengers say the extra block makes the old transfer interval unrealistic.',
						next: 'route planners will compare transfer slips from both sides of the temporary stop',
					},
				],
			},
			{
				section: 'Homes & Care',
				series: {
					slug: 'neighborhood-notebook',
					title: 'The Neighborhood Notebook',
					description:
						'Reporting on housing, clinics and school services through the records households encounter.',
				},
				stories: [
					{
						topic: 'flood-repair-grants',
						title: 'Flood Repair Grants',
						place: 'the low streets below West Wall',
						principal: 'Lea Morris',
						role: 'housing advocate at the west ward desk',
						record:
							'grant applications, assessor notes and household appeal letters',
						measure: 'homes with a completed repair visit',
						detail:
							'the visit schedule groups houses by street rather than by damage report date',
						stake:
							'whether urgent repairs are assessed in the order residents need them',
						dispute:
							'The office says street grouping saves travel time. Residents with older damage reports say the schedule hides how long they have waited.',
						next: 'the ward will publish wait time beside each repair category',
					},
					{
						topic: 'night-clinic-rota',
						title: 'Night Clinic Rota',
						place: 'the Lower Quay clinic',
						principal: 'Dr. Sena Vale',
						role: 'night physician and rota delegate',
						record:
							'the night schedule, medicine cupboard log and referral slips',
						measure: 'urgent visits reached within the posted interval',
						detail:
							'the second healer crosses the river after the last regular ferry',
						stake:
							'whether a named night shift means a clinician can reach the clinic in time',
						dispute:
							'The roster counts an assigned healer. Patients count the time between a call and a person at the door.',
						next: 'the clinic will compare call and arrival times before changing the rota',
					},
					{
						topic: 'school-meal-contracts',
						title: 'School Meal Contracts',
						place: 'the kitchens at East Gate School',
						principal: 'Nia Ball',
						role: 'school meal coordinator',
						record:
							'delivery slips, meal counts and the signed kitchen contract',
						measure: 'meals delivered before the midday bell',
						detail: 'two schools share one cold store during its repair',
						stake:
							'how to keep meals on time when separate schools use a temporary shared store',
						dispute:
							'The vendor counts a delivery at the store door. Kitchen staff count it when food reaches each school.',
						next: 'the school board will compare store receipts with kitchen arrival logs',
					},
					{
						topic: 'rental-register-notices',
						title: 'Rental Register Notices',
						place: 'the tenant desk at Alder Court',
						principal: 'Rhea Mint',
						role: 'tenant records adviser',
						record: 'lease renewal notices and tenants’ dated receipt copies',
						measure: 'renewals with a delivery receipt attached',
						detail:
							'some stair numbers changed before the lease register was updated',
						stake:
							'how a household can challenge a notice delivered to an old stair number',
						dispute:
							'Owners rely on the registered address. Tenants say a corrected map came after the notice period began.',
						next: 'the records office will compare the latest street map with delivery receipts',
					},
					{
						topic: 'accessible-stair-lift',
						title: 'Accessible Stair Lift',
						place: 'the lift between Market Lane and Upper Court',
						principal: 'Oli Fen',
						role: 'public access inspector',
						record: 'lift service logs and access requests filed by residents',
						measure: 'service hours when both landings are open',
						detail:
							'a replacement bell is audible at the top landing but not the lower platform',
						stake:
							'whether the lift is a reliable route when a resident cannot hear the upper signal',
						dispute:
							'The maintenance log marks the lift open. Residents say an unconfirmed arrival is not safe access.',
						next: 'the inspector will test a signal at both landings with the lift under load',
					},
				],
			},
			{
				section: 'Work & Markets',
				series: {
					slug: 'working-quay',
					title: 'The Working Quay',
					description:
						'Prices, public contracts and shift conditions followed from posted terms to finished work.',
				},
				stories: [
					{
						topic: 'fish-market-weighing',
						title: 'Fish Market Weighing',
						place: 'the covered fish hall at South Slip',
						principal: 'Marek Stone',
						role: 'market correspondent',
						record: 'scale tickets, board prices and stall challenge slips',
						measure: 'loads checked against the public scale',
						detail:
							'a standard weight has a worn maker mark near its lower rim',
						stake:
							'whether a disputed weight can be checked without closing the morning stall row',
						dispute:
							'Sellers favor one shared standard. Buyers want a second test when the ticket and board price diverge.',
						next: 'the market clerk will test the standard with a second stamped weight',
					},
					{
						topic: 'dock-shift-breaks',
						title: 'Dock Shift Breaks',
						place: 'the crane board on North Quay',
						principal: 'Cale Dorr',
						role: 'dock shift representative',
						record:
							'crane handoffs, pause cards and the shift assignment board',
						measure: 'heavy lifts with a recorded relief interval',
						detail:
							'a late barge can push the final relief bell into the night watch',
						stake:
							'how relief time is recorded when a delayed barge changes the shift end',
						dispute:
							'The operator records the scheduled pause. The crew asks that a delayed start move the pause too.',
						next: 'the board will compare planned breaks with actual crane handoffs',
					},
					{
						topic: 'cold-store-electricity',
						title: 'Cold Store Electricity',
						place: 'the municipal cold store beside the west canal',
						principal: 'Bea Carrow',
						role: 'cooperative store manager',
						record: 'meter readings, outage notices and cooperative invoices',
						measure: 'hours held within the posted temperature band',
						detail: 'the meter was replaced during a three-hour outage',
						stake:
							'how shared storage costs are split when a replacement meter spans two billing periods',
						dispute:
							'The utility counts from its exchange date. The cooperative says the new meter missed the outage at changeover.',
						next: 'the utility will align the exchange record with the outage notice',
					},
					{
						topic: 'foundry-safety-insurance',
						title: 'Foundry Safety Insurance',
						place: 'the fitting shop at Copper Row',
						principal: 'Hale Dunn',
						role: 'workplace claims clerk',
						record: 'inspection cards, shift logs and claim decisions',
						measure: 'claims reviewed with an attached inspection card',
						detail:
							'the shop uses one inspection card for a crew that changes at midday',
						stake:
							'whether a single card records a hazard seen by both halves of a split shift',
						dispute:
							'The insurer treats the card as a shift record. Workers ask that each handoff carry its own inspection line.',
						next: 'the claims board will test a second handoff line on the card',
					},
					{
						topic: 'dock-worker-guarantee',
						title: 'Dock Worker Guarantee',
						place: 'the hiring board at Old Rope Yard',
						principal: 'Perrin Shaw',
						role: 'day labor organizer',
						record: 'hiring slips, guarantee payments and the quay contract',
						measure: 'workers paid the minimum turn after a canceled load',
						detail:
							'the contract defines a canceled load but not a late gate closure',
						stake:
							'whether a gate closure should count as canceled work for a hired crew',
						dispute:
							'Contractors count only loads withdrawn by a shipper. Workers say a closed gate removes the same shift from their day.',
						next: 'the contract committee will publish examples for both kinds of cancellation',
					},
				],
			},
			{
				section: 'Schools & Culture',
				series: {
					slug: 'public-rooms',
					title: 'The Public Rooms',
					description:
						'Schools, archives and performance spaces examined through the people who share them.',
				},
				stories: [
					{
						topic: 'open-school-places',
						title: 'Open School Places',
						place: 'the East Gate school desk',
						principal: 'Yara Dell',
						role: 'school enrollment clerk',
						record:
							'class registers, transfer cards and the district placement list',
						measure: 'children placed before the first week of term',
						detail:
							'two classrooms are held for pupils arriving after the river crossing opens',
						stake:
							'how a school reserves places without leaving current families uncertain',
						dispute:
							'The district wants a firm count before term. Families say a provisional place is the only way to plan a move.',
						next: 'the school board will publish provisional and confirmed places separately',
					},
					{
						topic: 'multilingual-hearing-notices',
						title: 'Multilingual Hearing Notices',
						place: 'the public board in Lower Market Square',
						principal: 'Lina Vale',
						role: 'community correspondent',
						record: 'translated notices and the interpreter booking rota',
						measure:
							'public meetings with a language request confirmed before the notice date',
						detail:
							'the first copy is printed before the interpreter rota is complete',
						stake:
							'whether a translated notice can be useful when it arrives after the meeting date is chosen',
						dispute:
							'Clerks point to a copy on the board. Residents ask whether the copy reached them before they had to arrange work and travel.',
						next: 'the board will compare translation dates with the first public notice date',
					},
					{
						topic: 'lower-archive-flood-map',
						title: 'The Lower Archive Flood Map',
						place: 'the map room under Ferry House',
						principal: 'Ava Korr',
						role: 'municipal map archivist',
						record: 'the flood map, its copy register and later margin notes',
						measure: 'map marks with a dated source note',
						detail:
							'a blue channel line appears on one copy but not the filed public sheet',
						stake:
							'whether the line records a lost spill channel or a later copyist’s change',
						dispute:
							'The line is visible on the surviving copy. The archive has not found a matching field survey or a named hand.',
						next: 'the archive will publish the two copies with their later marks dated separately',
					},
					{
						topic: 'hall-acoustics-repair',
						title: 'Hall Acoustics Repair',
						place: 'the stone music room at North Hall',
						principal: 'Evi Noll',
						role: 'hall steward and chorus singer',
						record:
							'sound checks from the upper bench and repair notes from the masons',
						measure: 'seating rows where a spoken announcement is clear',
						detail:
							'the newest stone panel reflects a signal toward the rear doorway',
						stake:
							'how to improve announcement clarity without changing the hall’s music balance',
						dispute:
							'Singers value the hall’s old return. Public clerks need a clear spoken announcement at every seat.',
						next: 'masons will test a removable panel before proposing a permanent repair',
					},
					{
						topic: 'theatre-pay-register',
						title: 'Theatre Pay Register',
						place: 'the performers’ desk at Lantern Theatre',
						principal: 'Davin Pell',
						role: 'stage manager and pay steward',
						record:
							'show contracts, rehearsal calls and the public pay register',
						measure: 'rehearsal hours entered before the opening night',
						detail:
							'a cast change was entered on the notice board but not on the pay copy',
						stake:
							'whether late cast changes are reflected in the public pay record',
						dispute:
							'The producer says the board was updated in time. Performers say the signed copy still carries the earlier line.',
						next: 'the theatre will compare the call sheet with the copies signed by each performer',
					},
				],
			},
			{
				section: 'Regional Roads',
				series: {
					slug: 'beyond-the-bend',
					title: 'Beyond the Bend',
					description:
						'Regional agreements and road conditions followed across the river valley and its neighboring towns.',
				},
				stories: [
					{
						topic: 'northmere-ferry-charter',
						title: 'Northmere Ferry Charter',
						place: 'the shared landing between Bellwater and Northmere',
						principal: 'Rois Fen',
						role: 'joint ferry clerk',
						record: 'the charter, crew rota and intercity passenger log',
						measure: 'crossings completed under the shared timetable',
						detail: 'the timetable uses different bell names on the two banks',
						stake:
							'how to publish one timetable for travelers using two local clocks',
						dispute:
							'Each council says its clock is the public standard. Passengers need a departure time both ferry offices can honor.',
						next: 'both councils will publish a side-by-side clock conversion for the trial schedule',
					},
					{
						topic: 'bridge-toll-agreement',
						title: 'Bridge Toll Agreement',
						place: 'the toll booth at Westbank Bridge',
						principal: 'Marek Stone',
						role: 'regional accounts correspondent',
						record:
							'toll receipts, repair invoices and the two towns’ agreement',
						measure: 'receipts assigned to a dated repair line',
						detail:
							'one invoice includes a winter closure after the collection gate was closed',
						stake:
							'whether a town can charge a crossing fee on a day when its bridge was closed',
						dispute:
							'The toll keeper counts each calendar day. The neighboring council says a closed span cannot accrue a crossing fee.',
						next: 'the two treasurers will reconcile receipts with the bridge closure board',
					},
					{
						topic: 'winter-salt-convoy',
						title: 'Winter Salt Convoy',
						place: 'the salt shed on the east road',
						principal: 'Hale Voss',
						role: 'road supply coordinator',
						record: 'convoy manifests and the road crew’s surface reports',
						measure: 'loads arriving before a road advisory changes',
						detail: 'the final mile is shaded after the river bridge',
						stake:
							'whether a convoy can make the posted delivery time when the last mile freezes first',
						dispute:
							'Road crews report passable stone at the gate. Drivers report ice on the shaded turn just beyond it.',
						next: 'the road office will separate pedestrian and loaded-cart clearance times',
					},
					{
						topic: 'border-market-fees',
						title: 'Border Market Fees',
						place: 'the common market at Three Counties Gate',
						principal: 'Lena Orr',
						role: 'market fee auditor',
						record:
							'the joint fee schedule and seller receipts from both towns',
						measure: 'stalls charged the same listed rate on both sides',
						detail: 'one town applies a cleaning fee before the market bell',
						stake:
							'how sellers compare a posted stall fee when one side includes cleaning',
						dispute:
							'The town office calls cleaning a public service. Sellers ask that it appear beside the rate, not below it.',
						next: 'the market council will post the full amount for one comparison period',
					},
					{
						topic: 'regional-flood-table',
						title: 'Regional Flood Table',
						place: 'the shared flood board at South Ferry',
						principal: 'Tomas Reed',
						role: 'river correspondent for the joint table',
						record:
							'river marks, town gauge notes and the shared warning schedule',
						measure: 'warnings issued with both town readings attached',
						detail:
							'the upstream mark arrives one bell before the lower town gauge',
						stake:
							'how neighboring towns can share a warning before their readings align',
						dispute:
							'Upper towns want a warning as soon as their mark rises. Lower towns want a second reading before closing the ferry.',
						next: 'the joint table will publish a two-reading rule with the decision time recorded',
					},
				],
			},
		],
		spotlights: [
			{
				topic: 'east-quay-gauge',
				format: 'reporting',
				title: 'East Quay board opens a new gauge series after shade test',
				summary:
					'The city will post paired river readings at sunrise after a shade study showed the lower mark could lag the upstream board. The change starts with a fixed review date.',
				authorId: 'hsn-tomas-reed',
				body: [
					'The East Quay board will publish a second gauge reading at sunrise after the latest field test found the lower mark can remain in shade after the upstream station has warmed. The water office has not changed its river threshold. It has changed how the two readings will appear beside it.',
					'Gauge keeper Nell Arven and an upstream clerk made twelve paired checks during the last review window. The readings did not show one station was consistently wrong. They showed that the time of each reading matters when residents compare marks from different parts of the river.',
					'The new board will keep both measurements, the time stamp and the location. Quay residents can use the lower stair reading, while the river council will use the upstream line for its warning call.',
					'The trial closes at the end of the next river rise window. The council will compare the warning time with ferry closures before deciding whether the paired board becomes a permanent practice.',
				],
				closeout:
					'The council closed this docket by approving paired marks through the next river rise window. The next file will compare fresh readings with ferry closure times.',
			},
			{
				topic: 'night-ferry-berths',
				format: 'feature',
				title: 'The last boat keeps the clinic stair within reach',
				summary:
					'West Slip crew and clinic staff are testing a later berth call so a transfer remains possible after the evening shift ends.',
				authorId: 'hsn-lina-vale',
				body: [
					'At West Slip, the ferry crew keeps one berth empty until the clinic transfer bell. Tomas Reed checks the manifest while Dr. Sena Vale listens for the stair bell across the water. The same crossing appears twice in their books, once as a boat arrival and once as a patient connection.',
					'The two records once used the same time. They no longer do. A revised route moved the clinic stair call earlier, while the last boat kept its old berth. Neither change alone caused the gap, but together they made a connection harder to make after a late shift.',
					'For the current trial, the ferry will call the landing after the clinic transfer is confirmed. Staff will record both arrival and stair times, and passengers can report a missed transfer at the desk before the crew closes the log.',
					'The review will end after twelve weeks. The harbor office says it will decide on the final timetable from connection times, not only from the ferry arrival board.',
				],
				closeout:
					'The harbor board closed this docket by approving the later connection for the next timetable window. A new review will count completed clinic transfers.',
			},
			{
				topic: 'flood-repair-grants',
				format: 'opinion',
				title: 'A repair list should show need as well as street order',
				summary:
					'Grouping visits by street saves travel, but a public wait column would show whether urgent homes are being left behind.',
				authorId: 'hsn-ada-merrow',
				body: [
					'The flood repair list can be efficient and still be unfair to read. A crew that visits one street at a time saves travel, yet the posted list gives every household the same place in line even when one report concerns a wet foundation and another concerns a loose stair rail.',
					'The city has a record that could make the difference visible. Grant forms include the date of the damage report, the assessor’s category and the date of the first visit. The board currently posts only the street sequence.',
					'Neighbors who support street grouping are right about its value. Reordering every visit after every new report would waste crew hours. That is not an argument against showing the wait; it is a reason to publish both the travel plan and the time a household has been waiting.',
					'The grant office should add a wait column before the next river rise. Residents would see which cases are delayed, and the city would have a public measure for deciding whether a faster route is worth its cost.',
				],
				closeout:
					'The grant board closed this review by approving a wait-time column for the next repair cycle. This opinion argues for keeping that measure public after the trial.',
			},
			{
				topic: 'riverfront-lease-register',
				format: 'investigation',
				title: 'Old stair numbers still appear on renewal notices',
				summary:
					'A comparison of lease copies and delivery receipts found notices sent to addresses renumbered before the registry was updated.',
				authorId: 'hsn-marek-stone',
				body: [
					'Tenant copies from North Quay and the public lease register do not always identify the same stair. The registry shows an address update. Several delivery receipts still use the older number, which residents say points to a neighboring entrance.',
					'We compared renewal dates with the map revision and the receipt date in two ward files. In both files, the registry was updated after the street board changed. The review does not establish how many tenants missed a notice; the receipt copy records delivery but not who received it.',
					'Registrar Tessa Burn said the office has not been asked to attach the new map to older leases. Tenants argue that a notice sent to the wrong stair cannot start a fair appeal period. The records support a narrower finding: the public register and the delivery record need a common address field.',
					'The records office will compare current stair maps with the next set of notices. The current renewal periods remain in force while the address check is completed.',
				],
				closeout:
					'The records office closed this docket by adopting a dated address cross-reference for the next notice batch. A later review will compare those notices with tenant-held receipts.',
			},
		],
		steps: [
			'a new review window opens with a dated question and a named clerk',
			'the clerk matches the question to the original register and its last amendment',
			'a field visit checks the posted rule against the route residents actually use',
			'workers and residents submit accounts before the public hearing closes',
			'a second office checks the count and records any difference in method',
			'the responsible board publishes two options with a cost and end date for each',
			'a limited trial begins under the same public measure used in the old file',
			'the council records a decision for this window and gives its written reason',
			'the service office posts the new schedule and records its first operating count',
			'the clerk closes the docket and gives the next review a fresh scope',
		],
		outcomes: [
			'approved a limited trial with a named review date',
			'retained the existing rule and published the reason for doing so',
			'adopted an adjusted schedule for the next service window',
			'approved a narrower exception with an appeal route',
			'closed the request after an independent count confirmed the current measure',
			'returned one new question to a separate hearing without reopening this docket',
		],
	},
	elves: {
		publicationId: 'elves',
		key: 'esn',
		city: 'Lethariel',
		seasons: ['budbreak', 'canopy height', 'seedfall', 'rest season'],
		voice:
			'compare this season’s measurement with the living site and the people who steward it',
		staff: [
			{
				id: 'esn-sylva-reed',
				name: 'Sylva Reed',
				bio: 'Reports on ecological measures and the agreements that govern shared land.',
				beat: 'Canopy, water and habitat',
				method:
					'field transects paired with the season and location of each reading',
			},
			{
				id: 'esn-aeren-thorn',
				name: 'Aeren Thorn',
				bio: 'A council correspondent who follows how consent and review dates are recorded.',
				beat: 'Forest councils and public procedure',
				method:
					'signed council records checked against the amendments residents submitted',
			},
			{
				id: 'esn-lyra-ash',
				name: 'Lyra Ash',
				bio: 'Covers craft, household life and the practical work behind shared cultural spaces.',
				beat: 'Craft, schools and community rooms',
				method:
					'visits to the workshop or room alongside interviews with its users',
			},
			{
				id: 'esn-thalen-moss',
				name: 'Thalen Moss',
				bio: 'Reports on trade and regional agreements without treating a long history as a substitute for a current record.',
				beat: 'Trade routes and shared stewardship',
				method:
					'dated copies from both parties compared with the work completed at the site',
			},
		],
		desks: [
			{
				section: 'Council & Commons',
				series: {
					slug: 'canopy-commons',
					title: 'The Canopy Commons',
					description:
						'How Lethariel assigns shared canopy, water and public space across changing seasons.',
				},
				stories: [
					{
						topic: 'upper-brook-allotment',
						title: 'Upper Brook Allotment',
						place: 'the Mosswell upper brook',
						principal: 'Eryn Vail',
						role: 'brook steward for the north terraces',
						record: 'the upper release marks and household draw requests',
						measure: 'release turns with a paired downstream reading',
						detail:
							'the first channel divides below a root bridge before reaching three shared gardens',
						stake:
							'how water turns are shared when the upper and lower readings do not move together',
						dispute:
							'Garden stewards favor the upstream mark. Lower terrace households point to the level that reaches their channel.',
						next: 'the brook council will post both marks beside each release window',
					},
					{
						topic: 'canopy-council-seats',
						title: 'Canopy Council Seats',
						place: 'the open table at Elder Ash Hall',
						principal: 'Aeren Thorn',
						role: 'clerk for the canopy council',
						record: 'the seat register, speaking queue and amendment leaves',
						measure: 'amendments read before a vote',
						detail:
							'one rotating seat is shared by two neighborhoods for a full season',
						stake:
							'how a shared seat can give each neighborhood time to review a measure before a vote',
						dispute:
							'The council counts one seat. The two neighborhoods say one season is not enough time for both to hear from residents.',
						next: 'the clerk will record speaking time and submitted amendments separately for the next sitting',
					},
					{
						topic: 'commons-use-permits',
						title: 'Commons Use Permits',
						place: 'the shared meadow below the western canopy',
						principal: 'Mira Elowen',
						role: 'commons permit reader',
						record:
							'the use calendar and permits held by the neighboring circles',
						measure: 'permits with a restoration plan attached',
						detail:
							'the meadow hosts both seasonal craft gatherings and a monitored seed rest',
						stake:
							'how public use can continue while a particular patch is left undisturbed',
						dispute:
							'Gatherers say a shared calendar should remain flexible. Stewards say a rest period needs a date that cannot be displaced by a late booking.',
						next: 'the permit desk will mark the rest period on the same calendar as public events',
					},
					{
						topic: 'treeline-survey',
						title: 'Treeline Survey',
						place: 'the northern ridge survey path',
						principal: 'Talan Venn',
						role: 'survey lead for the ridge circle',
						record:
							'the ridge transects and the notes attached to older stakes',
						measure: 'survey points paired with a date and weather reading',
						detail:
							'a new marker sits one branch-width beyond the last clear-cut record',
						stake:
							'whether the line moved because of regeneration, an older map error or a different survey method',
						dispute:
							'The current transect records a wider canopy. Older notes were taken from a lower path and cannot be compared without adjustment.',
						next: 'the survey circle will publish a crosswalk between the old path and the new transect',
					},
					{
						topic: 'shared-seed-library',
						title: 'Shared Seed Library',
						place: 'the community seed room at Fern Steps',
						principal: 'Sela Rook',
						role: 'seed room keeper',
						record:
							'the drawer index and return notes from each neighborhood table',
						measure: 'seed lots returned with a germination note',
						detail:
							'several lots are catalogued by local name and by the nursery’s scientific name',
						stake:
							'how a shared index can preserve local names while making lots easy to compare',
						dispute:
							'Gardeners want names carried across generations. The nursery needs one index for tracking germination and storage.',
						next: 'the room will add a cross-reference without replacing the local drawer labels',
					},
				],
			},
			{
				section: 'Canopy & Water',
				series: {
					slug: 'seasonal-water-ledger',
					title: 'The Seasonal Water Ledger',
					description:
						'Water and habitat measures followed by season, site and the neighbors responsible for each reading.',
				},
				stories: [
					{
						topic: 'grove-water-cut',
						title: 'Grove Water Cut',
						place: 'the east grove feeder channel',
						principal: 'Neris Venn',
						role: 'feeder channel keeper',
						record:
							'the channel level book and the downstream moisture readings',
						measure: 'readings taken at the same root markers',
						detail:
							'the east branch receives meltwater two days later than the upper branch',
						stake:
							'how the seasonal cut is timed when two branches reach their wet period at different times',
						dispute:
							'The upper steward favors a shared calendar date. The east circle wants the cut tied to its own readings.',
						next: 'the water circle will compare two dates against the same root markers',
					},
					{
						topic: 'moss-bed-habitat',
						title: 'Moss Bed Habitat',
						place: 'the shaded flats below Starleaf Bridge',
						principal: 'Elya Thorne',
						role: 'habitat steward for the shaded flats',
						record: 'the moss cover survey and the path maintenance cards',
						measure: 'transects with an undisturbed comparison strip',
						detail:
							'footfall is concentrated at the single dry crossing after rain',
						stake:
							'whether the public path can stay open if its dry crossing concentrates wear',
						dispute:
							'Path keepers prefer one durable route. Habitat stewards say the rest strip must remain intact to measure recovery.',
						next: 'the circle will test a second stepping line while keeping the comparison strip closed',
					},
					{
						topic: 'windfall-salvage-permits',
						title: 'Windfall Salvage Permits',
						place: 'the western windfall lots',
						principal: 'Tiriel Moss',
						role: 'salvage permit steward',
						record: 'the fallen timber map and each lot’s restoration note',
						measure: 'lots cleared with a mapped regrowth boundary',
						detail:
							'one fallen trunk crosses a route used by both wood carriers and pollinator keepers',
						stake:
							'how fallen timber can be removed without erasing the boundary used for regrowth monitoring',
						dispute:
							'Carriers need the route reopened. Pollinator keepers ask that the trunk remain until the mapped bloom window closes.',
						next: 'the permit desk will mark a route clearance date and a separate bloom review date',
					},
					{
						topic: 'river-source-inspections',
						title: 'River Source Inspections',
						place: 'the Lethariel source springs',
						principal: 'Oren Leth',
						role: 'source inspection reader',
						record: 'spring flow marks and the sample jars held by two circles',
						measure: 'samples with a chain of custody from spring to room',
						detail: 'the same spring feeds a public bath and a teaching plot',
						stake:
							'how to publish water quality when the sample serves different uses',
						dispute:
							'Bath stewards test for safe use. Gardeners also track mineral changes that affect the teaching plot.',
						next: 'the next report will separate the common safety measure from each use-specific reading',
					},
					{
						topic: 'seasonal-road-gate',
						title: 'Seasonal Road Gate',
						place: 'the high path gate above the western grove',
						principal: 'Mira Fen',
						role: 'path gate keeper',
						record:
							'the gate calendar, repair notes and requests from neighboring paths',
						measure: 'open days recorded with a surface condition',
						detail: 'the north turn dries before the shaded bridge approaches',
						stake:
							'whether to open one branch before the full path is safe for carts',
						dispute:
							'Walkers can use the north branch earlier. Carriers want one opening date that applies to the whole route.',
						next: 'path keepers will publish separate foot and cart openings for one trial season',
					},
				],
			},
			{
				section: 'Craft & Study',
				series: {
					slug: 'living-craft',
					title: 'Living Craft',
					description:
						'Workshops and study rooms examined through their materials, apprentices and shared schedules.',
				},
				stories: [
					{
						topic: 'dye-cooperative-pigments',
						title: 'Dye Cooperative Pigments',
						place: 'the Blueleaf dye room',
						principal: 'Lira Ash',
						role: 'dye cooperative keeper',
						record:
							'batch cards, rinse readings and the shared pigment shelf list',
						measure: 'batches with a source and rinse note',
						detail: 'a shared pigment lot changes shade after a second rinse',
						stake:
							'how a cooperative can preserve a maker’s color record across different looms',
						dispute:
							'Makers want the local color name preserved. Buyers need a comparable sample before placing a second order.',
						next: 'the shelf list will keep the local name beside a dated comparison swatch',
					},
					{
						topic: 'shared-kiln-schedule',
						title: 'Shared Kiln Schedule',
						place: 'the common ceramic kiln at Reed Terrace',
						principal: 'Aven Rowe',
						role: 'kiln schedule steward',
						record: 'the firing board and the makers’ clay readiness cards',
						measure: 'firings started within the posted window',
						detail:
							'two makers need the same slow cooling period for different clay bodies',
						stake:
							'how to share a cooling period without giving one workshop permanent priority',
						dispute:
							'The old schedule alternates by week. Makers say clay readiness can change with the drying room temperature.',
						next: 'the kiln group will compare readiness cards with actual cooling times before changing turns',
					},
					{
						topic: 'apprentice-skill-record',
						title: 'Apprentice Skill Record',
						place: 'the joinery bench at Fern Hall',
						principal: 'Nerin Thal',
						role: 'master joiner and bench assessor',
						record: 'the apprenticeship book and samples signed at the bench',
						measure:
							'skills assessed with a dated sample from more than one project',
						detail:
							'the standard test uses the same joint even when the apprentice specializes elsewhere',
						stake:
							'whether one standard test describes a craft learned across several kinds of work',
						dispute:
							'Masters value a common comparison. Apprentices want the book to include work they completed in a real commission.',
						next: 'the bench will test a portfolio page beside the existing joint test',
					},
					{
						topic: 'archive-transcript-access',
						title: 'Archive Transcript Access',
						place: 'the public transcript room at Alder Root Archive',
						principal: 'Vela Thorne',
						role: 'archive reader and transcript editor',
						record:
							'hearing transcripts, correction leaves and the public reading rota',
						measure: 'corrections posted before a transcript is copied again',
						detail:
							'a spoken place name has three accepted spellings across old records',
						stake:
							'how a transcript can be corrected without erasing the earlier spelling from the record',
						dispute:
							'Readers ask for a clean current form. Local speakers want the older form retained as a searchable variant.',
						next: 'the archive will add a correction note and keep the earlier copy linked',
					},
					{
						topic: 'study-room-access',
						title: 'Study Room Access',
						place: 'the shared table at Starwell Study House',
						principal: 'Teren Vale',
						role: 'study house coordinator',
						record: 'the room booking ledger and light maintenance notes',
						measure: 'booked hours when the room is open and evenly lit',
						detail:
							'one lamp circle remains dim after a new branch was routed through the ceiling',
						stake:
							'how to keep the room usable during a repair without excluding evening learners',
						dispute:
							'The repair crew favors a full closure. Learners ask for the bright side of the room to stay available.',
						next: 'the coordinator will trial a divided room plan until the branch repair is complete',
					},
				],
			},
			{
				section: 'Homes & Generations',
				series: {
					slug: 'home-across-seasons',
					title: 'Home Across Seasons',
					description:
						'Housing, care and education reported across households with different needs and timelines.',
				},
				stories: [
					{
						topic: 'guest-quarter-allotment',
						title: 'Guest Quarter Allotment',
						place: 'the west guest quarter at Hazel Walk',
						principal: 'Selen Venn',
						role: 'guest quarter steward',
						record:
							'room requests, departure dates and the shared kitchen rota',
						measure:
							'households given a private room before their first review date',
						detail:
							'some residents arrive before a host circle can sign the room card',
						stake:
							'how temporary rooms are assigned when arrival and sponsorship dates differ',
						dispute:
							'The host circle favors a signed card before a room is assigned. The quarter steward says an empty room can be held safely for one review period.',
						next: 'the quarter will test a dated provisional card with a clear expiry mark',
					},
					{
						topic: 'community-care-shifts',
						title: 'Community Care Shifts',
						place: 'the care room beside Reed Terrace',
						principal: 'Ari Noll',
						role: 'care rota coordinator',
						record: 'the visit rota and handoff notes from household circles',
						measure: 'visits with a named handoff for the next shift',
						detail:
							'the evening shift begins before the last regular path shuttle returns',
						stake:
							'how a care visit is counted when a handoff crosses a transport gap',
						dispute:
							'The rota records a completed visit. Household circles say the handoff matters when the next helper cannot arrive.',
						next: 'the coordinator will pair visit times with the transport return board',
					},
					{
						topic: 'bridge-shelter-rooms',
						title: 'Bridge Shelter Rooms',
						place: 'the sheltered rooms under Starleaf Bridge',
						principal: 'Mira Ash',
						role: 'bridge shelter delegate',
						record: 'the room key ledger and the bridge repair calendar',
						measure: 'rooms available during a scheduled repair closure',
						detail: 'the bridge crew stores repair timber in one unused room',
						stake:
							'how to keep shelter space available without delaying a needed bridge repair',
						dispute:
							'Masons need dry storage close to the work. Residents ask the city to keep one room available for families displaced by rain.',
						next: 'the bridge office will mark a storage room and a separate reserve room on the key board',
					},
					{
						topic: 'seasonal-school-rota',
						title: 'Seasonal School Rota',
						place: 'the lesson room at West Root School',
						principal: 'Lyra Ash',
						role: 'teacher and school table representative',
						record: 'the room rota and pupil attendance marks',
						measure: 'lessons held when both teacher and route are available',
						detail:
							'one route to the school is closed while a canopy branch is supported',
						stake:
							'how to keep lessons available when the safest route changes with a repair',
						dispute:
							'Teachers prefer a fixed room and hour. Families on the outer path need a later start when the branch walk is closed.',
						next: 'the school table will compare attendance under a second start time for one season',
					},
					{
						topic: 'shared-lease-renewal',
						title: 'Shared Lease Renewal',
						place: 'the lease table at Fern Steps',
						principal: 'Rill Orin',
						role: 'housing table mediator',
						record: 'lease copies, repair plans and resident meeting notes',
						measure: 'renewals with a repair duty written in both copies',
						detail:
							'a shared roof garden is listed as an amenity in one copy and a duty in another',
						stake:
							'whether a shared amenity can become an unpriced household obligation at renewal',
						dispute:
							'The owner points to a customary repair share. Residents say a duty should be written with its amount and review date.',
						next: 'the mediator will compare signed copies before recommending standard wording',
					},
				],
			},
			{
				section: 'Trade Routes',
				series: {
					slug: 'forest-exchange',
					title: 'The Forest Exchange',
					description:
						'Regional agreements followed through the dates, quantities and sites named by both parties.',
				},
				stories: [
					{
						topic: 'seed-exchange-ledger',
						title: 'Seed Exchange Ledger',
						place: 'the shared table at East Canopy Gate',
						principal: 'Talen Moss',
						role: 'exchange record keeper',
						record: 'the two communities’ seed manifests and return notes',
						measure: 'lots with a return date and a germination note',
						detail:
							'one lot is returned as a local-name variety without a cross-index',
						stake:
							'how exchange partners keep local names while tracking a shared lot',
						dispute:
							'Each community has a valid local record. The joint table needs a cross-index before it can compare returns.',
						next: 'both record keepers will add a cross-index without replacing the original names',
					},
					{
						topic: 'canopy-corridor-agreement',
						title: 'Canopy Corridor Agreement',
						place: 'the ridge path shared with Stonewater',
						principal: 'Aeren Thorn',
						role: 'corridor agreement clerk',
						record: 'the signed path agreement and each town’s closure notices',
						measure: 'closures entered in both public boards on the same day',
						detail:
							'Stonewater posts from the lower gate while Lethariel posts from the upper path',
						stake:
							'how travelers can see a shared closure before reaching either gate',
						dispute:
							'Each town says it posted promptly. Travelers say the notice arrives only after they have crossed into the next jurisdiction.',
						next: 'the clerks will test a mirrored notice at both entrances for one review window',
					},
					{
						topic: 'resin-measure-standard',
						title: 'Resin Measure Standard',
						place: 'the resin weighing table at Alder Crossing',
						principal: 'Sylva Reed',
						role: 'measure correspondent',
						record: 'sealed sample tags, measure stones and buyers’ receipts',
						measure: 'lots weighed with the same dry-time note',
						detail:
							'a jar can lose mass between collection and the market table',
						stake:
							'how a standard weight accounts for drying time without disguising the amount sold',
						dispute:
							'Collectors favor the collection weight. Buyers ask for the weight at sale and a note about time between both readings.',
						next: 'the measure table will show collection and sale weights in separate columns',
					},
					{
						topic: 'outer-grove-water-pact',
						title: 'Outer Grove Water Pact',
						place: 'the boundary spring at Alder Pass',
						principal: 'Thalen Moss',
						role: 'regional water delegate',
						record:
							'the pact, spring marks and the field notes kept by both circles',
						measure: 'draws recorded with both spring and downstream marks',
						detail:
							'the downstream mark lags when the upper spring is measured after rain',
						stake:
							'how to divide a shared source when measurements are taken at different points in a rainfall cycle',
						dispute:
							'Upper stewards rely on the spring reading. Lower households rely on the mark that reaches their cistern.',
						next: 'both circles will take paired measurements on the same morning',
					},
					{
						topic: 'storm-refuge-terms',
						title: 'Storm Refuge Terms',
						place: 'the covered room at High Fern Crossing',
						principal: 'Elya Thorn',
						role: 'refuge room steward',
						record:
							'the refuge key ledger and the cross-border storm agreement',
						measure: 'nights with a room open before the warning bell',
						detail:
							'the key is held at one town office while the room is maintained by another',
						stake:
							'how a shared refuge can open when its key keeper and maintenance crew are in different towns',
						dispute:
							'The key ledger names the host town. The agreement assigns the repair crew to a neighboring circle.',
						next: 'the agreement will name a second key holder for the next storm season',
					},
				],
			},
			{
				section: 'Language & Memory',
				series: {
					slug: 'memory-in-practice',
					title: 'Memory in Practice',
					description:
						'Place names, public archives and shared performance reported as living records with room for correction.',
				},
				stories: [
					{
						topic: 'place-name-cross-index',
						title: 'Place Name Cross-Index',
						place: 'the map table at Lethariel’s west archive',
						principal: 'Vela Thorne',
						role: 'archive editor',
						record: 'map copies, spoken-name notes and the public search index',
						measure: 'entries with a source and a searchable local variant',
						detail:
							'one bend is named differently by the river circle and the west hall',
						stake:
							'how a public map can carry both names without confusing travelers',
						dispute:
							'Mappers favor one printed label. Residents want the name used at home to remain searchable.',
						next: 'the index will display a primary label and link the local form to the same place record',
					},
					{
						topic: 'hall-performance-rotation',
						title: 'Hall Performance Rotation',
						place: 'the shared stage at Hazel Hall',
						principal: 'Lira Ash',
						role: 'performance room coordinator',
						record: 'the stage calendar and the groups’ rehearsal requests',
						measure: 'public nights with a rehearsal period attached',
						detail:
							'a new sound screen changes the return heard from the back seats',
						stake:
							'how to share a stage while preserving time for groups to test a new arrangement',
						dispute:
							'The calendar favors equal nights. Performers ask for rehearsal time matched to the room’s acoustics.',
						next: 'the hall will trial a rehearsal note beside each public booking',
					},
					{
						topic: 'restoration-material-record',
						title: 'Restoration Material Record',
						place: 'the west arch at Reed Hall',
						principal: 'Aven Moss',
						role: 'restoration mason',
						record:
							'the arch repair book and samples held by the public archive',
						measure: 'replacement stones with a recorded source and date',
						detail: 'the repair uses a newer aggregate than the original arch',
						stake:
							'how a repair can preserve safety while making new material visible in the public record',
						dispute:
							'Masons prioritize a stable joint. Conservators want later readers to distinguish repair from original work.',
						next: 'the archive will attach the repair date and source sample to the arch record',
					},
					{
						topic: 'open-map-reading-room',
						title: 'Open Map Reading Room',
						place: 'the public map room at North Canopy House',
						principal: 'Sylva Reed',
						role: 'map room reader',
						record: 'the reading rota, map request slips and copy register',
						measure: 'requests fulfilled before a map copy is moved to storage',
						detail:
							'a fragile map can be consulted only during one staffed interval',
						stake:
							'how the room balances public access with the time needed to protect a fragile copy',
						dispute:
							'Readers request longer open hours. Conservators say unsupervised viewing increases handling risk.',
						next: 'the archive will compare staffed hours with requests that could not be completed',
					},
					{
						topic: 'shared-memorial-text',
						title: 'Shared Memorial Text',
						place: 'the remembrance stones at East Grove',
						principal: 'Thalen Moss',
						role: 'public record editor',
						record:
							'the submitted text, translator notes and the public stone index',
						measure:
							'entries with a submitted translation and a public correction path',
						detail:
							'two translation drafts differ in how they name a shared crossing',
						stake:
							'how a public memorial keeps a precise translation without hiding the earlier draft',
						dispute:
							'Editors want one settled text. The submitting families ask that the earlier wording remain available as a source.',
						next: 'the index will link the approved text to the dated translation drafts',
					},
				],
			},
		],
		spotlights: [
			{
				topic: 'upper-brook-allotment',
				format: 'reporting',
				title:
					'Mosswell council will post both brook marks before each release',
				summary:
					'The water circle approved a seasonal trial that pairs the upper release mark with the downstream reading. The two locations remain visible in the public record.',
				authorId: 'esn-sylva-reed',
				body: [
					'The Mosswell water circle will post the upper release mark beside the downstream reading before each household turn. The decision follows a season in which the upper channel appeared steady while the lower gardens received water later than the public calendar predicted.',
					'Brook steward Eryn Vail said the paired record does not replace the upper measurement. It gives the lower terraces a dated mark of their own and lets the council compare both locations after the same release.',
					'The trial runs through the next seedfall window. The two readings will be checked at the same hour, and any change in method will be written beside the earlier mark rather than replacing it.',
					'Garden stewards support the shared calendar but want the downstream level to remain visible. The council kept both concerns in the decision and set a public review before the next allocation season.',
				],
				closeout:
					'The council closed this docket by approving paired marks through the next river rise window. The next file will compare fresh readings with ferry closure times.',
			},
			{
				topic: 'apprentice-skill-record',
				format: 'feature',
				title: 'A second sample joins the joinery bench record',
				summary:
					'Fern Hall will add a completed commission beside its standard joint test so the assessment shows more than one kind of work.',
				authorId: 'esn-lyra-ash',
				body: [
					'At the Fern Hall bench, Nerin Thal lays two pieces of joinery on the assessment table. One is the familiar standard joint. The other comes from an apprentice’s completed commission, signed by the household that asked for the work.',
					'The existing test gives every apprentice a shared point of comparison. The portfolio page adds a record of skill used beyond the bench, where a measurement has to fit a real frame and a different set of tools.',
					'Thal is not replacing the common test. The bench will keep both samples, note who assessed each one and record any difference in the method. Apprentices asked for their actual work to count; masters asked that a common measure remain.',
					'The next assessment cycle will use the two-page record. The guild will review completed assessments at the end of the season before making the portfolio a regular part of its practice.',
				],
				closeout:
					'The guild closed this docket by adopting the two-page record for the next assessment cycle. A later review will compare samples from completed commissions.',
			},
			{
				topic: 'commons-use-permits',
				format: 'opinion',
				title: 'A commons calendar can leave room for rest and use',
				summary:
					'The meadow needs a clear restoration interval, but an open calendar should not make a seasonal gathering impossible to plan.',
				authorId: 'esn-aeren-thorn',
				body: [
					'A common meadow is not preserved by keeping every path closed, and it is not shared well if the rest period exists only in a steward’s memory. The permit calendar should show both public use and the interval when a patch is left undisturbed.',
					'Gatherers need a date early enough to plan a seasonal meeting. Stewards need a rest line that cannot be displaced by a late booking. Those needs can sit on the same calendar if the record says which patch is open and when its rest begins.',
					'The current permit book records events more carefully than recovery periods. That makes a gathering easy to find and a closure harder to verify. The fix is a visible rest mark with a named reviewer, not a permanent ban on the meadow.',
					'The next trial should carry a start date, end date and restoration note on every permit. At closeout, the commons council can compare use and recovery without asking one circle to accept an undocumented exception.',
				],
				closeout:
					'The commons council closed this review by placing a dated rest period on the public calendar. The next docket will cover a new meadow window.',
			},
			{
				topic: 'place-name-cross-index',
				format: 'explainer',
				title: 'How the west archive will link two names for one bend',
				summary:
					'The public index will keep one map location and make both the river-circle name and the west-hall name searchable.',
				authorId: 'esn-thalen-moss',
				body: [
					'The map table at Lethariel’s west archive has two names for the same bend. One comes from the river circle. The other appears on maps kept by the west hall. The archive’s problem is to connect them without erasing either source.',
					'The proposed index keeps one location record and adds a cross-reference for each local name. Searchers can find the place from either form, while the original map remains unchanged and keeps its own date.',
					'That distinction matters because a map label is both a travel aid and a record of who named a place. Replacing one form with another would make the index simpler and the historical record less complete.',
					'The archive will test the cross-index on three paths before applying it to the wider map shelf. Each entry will include its source and a correction route for residents who find a missing name.',
				],
				closeout:
					'The archive closed this docket by adopting the cross-index for the three tested paths. A new file will cover the next group of map entries.',
			},
		],
		steps: [
			'a new seasonal file opens with a named site and a dated measure',
			'the steward attaches the original field record and the last method note',
			'a second transect checks the reading against the living site',
			'neighbors and makers submit observations before the council table closes',
			'an independent reader compares the copy with the source record',
			'the circle publishes options with the seasonal limits stated beside them',
			'a limited trial begins without replacing the older record',
			'the council records a decision for this site and review window',
			'stewards post the result alongside the original measurement',
			'the clerk closes this file and gives the next season a fresh scope',
		],
		outcomes: [
			'approved a seasonal trial with a named habitat review',
			'retained the current practice and published the evidence for doing so',
			'adopted a revised schedule for the next measured window',
			'approved a limited exception with a restoration date',
			'closed the file after a second measure confirmed the existing threshold',
			'sent one separate question to a later public hearing without reopening this file',
		],
	},
	goblins: {
		publicationId: 'goblins',
		key: 'gsn',
		city: 'Cinderwick',
		seasons: ['smelt run', 'rain shift', 'cooling weeks', 'cinder winter'],
		voice:
			'keep contract terms, meter readings and worker testimony beside one another',
		staff: [
			{
				id: 'gsn-grikka-ash',
				name: 'Grikka Ash',
				bio: 'Reports on labor conditions and the inspection records workers need to challenge a decision.',
				beat: 'Shift work and safety',
				method:
					'crew logs compared with the inspection card for the same shift',
			},
			{
				id: 'gsn-vek-cinder',
				name: 'Vek Cinder',
				bio: 'Covers production systems, water and the neighborhood cost of industrial change.',
				beat: 'Foundries, water and air',
				method:
					'meter readings checked against a dated shift and operating condition',
			},
			{
				id: 'gsn-nazza-wire',
				name: 'Nazza Wire',
				bio: 'A neighborhood correspondent following how public boards affect tenants and small shops.',
				beat: 'Cinder wards and household services',
				method:
					'public notices checked against the copies households actually received',
			},
			{
				id: 'gsn-orrik-smelt',
				name: 'Orrik Smelt',
				bio: 'Reports on contracts, market measures and the cost of keeping shared infrastructure running.',
				beat: 'Contracts, markets and repair',
				method:
					'contract clauses set beside paid invoices and the work completed',
			},
		],
		desks: [
			{
				section: 'Civic Power',
				series: {
					slug: 'cinder-ward-ledger',
					title: 'The Cinder Ward Ledger',
					description:
						'Public decisions followed through the records kept by neighborhoods, councils and shop stewards.',
				},
				stories: [
					{
						topic: 'cinder-ward-election-register',
						title: 'Cinder Ward Election Register',
						place: 'the ward table at Furnace Square',
						principal: 'Nikka Brim',
						role: 'election registrar',
						record:
							'the voter roll, shift exemptions and ballot challenge cards',
						measure: 'eligible workers able to reach a ballot table',
						detail:
							'the evening table opens before the last furnace shift is released',
						stake:
							'how a shift worker can vote when release time changes without notice',
						dispute:
							'The registrar counts a ballot table as open. Workers say they need a published release window to reach it.',
						next: 'the ward will compare release slips with the table opening log',
					},
					{
						topic: 'foundry-commission-minutes',
						title: 'Foundry Commission Minutes',
						place: 'the public board outside Cinder Hall',
						principal: 'Rik Varn',
						role: 'commission minute keeper',
						record:
							'signed minutes, contract amendments and the public change log',
						measure: 'amendments posted before a new shift begins',
						detail:
							'a machine lease changed after the vote but before the posted copy was replaced',
						stake:
							'how workers can see a contract change before operating under it',
						dispute:
							'The commission says the signed amendment is authoritative. Crew delegates say a rule not posted at shift start is not usable notice.',
						next: 'the commission will time-stamp the vote copy and the board copy separately',
					},
					{
						topic: 'cooling-water-allocation',
						title: 'Cooling Water Allocation',
						place: 'the west cooling channel',
						principal: 'Hessa Cinder',
						role: 'water allocation clerk',
						record: 'cooling meter cards and the neighborhood draw schedule',
						measure: 'draws with both a meter mark and a discharge note',
						detail: 'the discharge channel warms after a long furnace run',
						stake:
							'how the city assigns cooling water when a shared discharge warms over a work shift',
						dispute:
							'Foundry managers count intake volume. Downstream residents want the discharge temperature recorded too.',
						next: 'the water office will add a downstream reading to each intake card',
					},
					{
						topic: 'smoke-corridor-boundaries',
						title: 'Smoke Corridor Boundaries',
						place: 'the westward vent corridor',
						principal: 'Vela Orr',
						role: 'ward air monitor',
						record:
							'air sample locations, vent fan hours and ward complaint cards',
						measure: 'samples with a location and a fan setting attached',
						detail:
							'one sample point sits below the fan outlet while the public board uses the upper reading',
						stake:
							'how to compare air measurements taken on different sides of a vent outlet',
						dispute:
							'The operator relies on the upper monitor. Residents ask for a sample from the corridor where they work and sleep.',
						next: 'the ward monitor will publish paired samples with fan hours on the same card',
					},
					{
						topic: 'ward-hall-rent-roll',
						title: 'Ward Hall Rent Roll',
						place: 'the rent desk at New Ember Hall',
						principal: 'Tikka Marr',
						role: 'tenant board clerk',
						record: 'rent notices, repair claims and tenant copy receipts',
						measure: 'notices with a repair credit shown on both copies',
						detail:
							'an approved roof credit appears in the hall register but not on some tenant slips',
						stake:
							'how a household disputes a rent notice when a repair credit is missing from its copy',
						dispute:
							'The hall says the register controls the amount. Tenants say a credit they cannot see cannot be checked before payment.',
						next: 'the clerk will compare receipt copies with the posted repair credit register',
					},
				],
			},
			{
				section: 'Work & Safety',
				series: {
					slug: 'the-shift-ledger',
					title: 'The Shift Ledger',
					description:
						'Workers, inspectors and managers tracked through the same shift records and paid time.',
				},
				stories: [
					{
						topic: 'furnace-oxygen-monitoring',
						title: 'Furnace Oxygen Monitoring',
						place: 'the north furnace aisle at Cinder Works',
						principal: 'Grikka Ash',
						role: 'shift safety reporter',
						record:
							'oxygen monitor slips, fan settings and shift handoff notes',
						measure: 'readings with a fan setting and worker location attached',
						detail:
							'the wall monitor remains active during the ten-minute handoff',
						stake:
							'whether one wall reading describes conditions at each occupied work station',
						dispute:
							'Managers prefer a single stable monitor. Crew representatives want a location note when the fan setting changes.',
						next: 'the next review will compare the wall monitor with two hand-held readings',
					},
					{
						topic: 'paid-inspection-hour',
						title: 'Paid Inspection Hour',
						place: 'the handoff room at Cinder Works',
						principal: 'Dara Flint',
						role: 'crew delegate for the east furnace',
						record:
							'shift totals, inspection cards and payroll adjustment slips',
						measure: 'inspection minutes included in paid time',
						detail:
							'the safety card is completed before the payroll clock begins',
						stake:
							'whether required inspection work belongs inside the paid shift',
						dispute:
							'The mill counts production hours. Workers say a required safety check is still work even when it precedes the first charge.',
						next: 'the board will compare card times with payroll start marks for one trial period',
					},
					{
						topic: 'tool-repair-credit',
						title: 'Tool Repair Credit',
						place: 'the common tool bench at Ash Yard',
						principal: 'Orrik Smelt',
						role: 'shared tool steward',
						record:
							'repair tickets, check-out marks and the shop credit ledger',
						measure: 'tools returned with a completed repair ticket',
						detail:
							'several crews share one grinding wheel during the same hour',
						stake:
							'how to assign repair time when a shared tool is worn by several crews',
						dispute:
							'The steward assigns the whole cost to the last borrower. Crews say the check-out slate should show a shared handoff.',
						next: 'the bench will trial a two-crew handoff mark beside the repair ticket',
					},
					{
						topic: 'protective-gear-standard',
						title: 'Protective Gear Standard',
						place: 'the fitting room at Red Coil Foundry',
						principal: 'Vek Cinder',
						role: 'foundry process correspondent',
						record: 'gear issue slips, repair tags and the temperature log',
						measure:
							'issued masks with a fit check recorded for the current task',
						detail:
							'one mask size is listed as a general fit for three kinds of task',
						stake:
							'whether a common issue mark describes a fit that workers can use safely',
						dispute:
							'The storekeeper needs a compact inventory. Workers ask that fit be checked by task rather than by stock size alone.',
						next: 'the fitting room will record the task beside each fit check',
					},
					{
						topic: 'shift-change-handoff',
						title: 'Shift Change Handoff',
						place: 'the furnace board at Blackslag Row',
						principal: 'Nazza Wire',
						role: 'ward and shift correspondent',
						record:
							'the assignment board and the outgoing crew’s condition notes',
						measure:
							'handoffs with a signed condition note before the next bell',
						detail:
							'the outgoing shift sometimes leaves after the incoming crew takes the board',
						stake:
							'how the next crew can verify a machine condition after the board changes hands',
						dispute:
							'Supervisors count a completed handoff when the board is signed. Workers want the condition note to travel with it.',
						next: 'the board will test a two-signature handoff with a separate condition line',
					},
				],
			},
			{
				section: 'Water & Air',
				series: {
					slug: 'air-and-water-audit',
					title: 'The Air and Water Audit',
					description:
						'Industrial readings followed from meter location to the neighborhood that receives the discharge.',
				},
				stories: [
					{
						topic: 'slag-water-samples',
						title: 'Slag Water Samples',
						place: 'the west discharge culvert',
						principal: 'Nera Brim',
						role: 'water sample clerk',
						record: 'sample jars, culvert flow notes and mill operating cards',
						measure:
							'samples with a time, flow and operating condition attached',
						detail: 'the culvert flow rises after the late furnace rinse',
						stake:
							'how a discharge sample can be compared when flow changes across a shift',
						dispute:
							'The mill tests at the end of a run. Residents ask for a sample during the rinse as well as after it.',
						next: 'the sample desk will collect paired jars before and after the rinse',
					},
					{
						topic: 'vent-fan-hours',
						title: 'Vent Fan Hours',
						place: 'the south vent trunk',
						principal: 'Ketta Ash',
						role: 'ventilation board reader',
						record:
							'fan-hour totals, temperature notes and the neighborhood air board',
						measure: 'fan hours recorded with a matching air sample',
						detail:
							'the fan is reduced during maintenance while the public board remains unchanged',
						stake:
							'how residents can tell a normal reading from a maintenance interval',
						dispute:
							'The plant totals are posted monthly. Nearby households want the maintenance hours listed on the same board.',
						next: 'the vent office will add maintenance intervals to each public reading',
					},
					{
						topic: 'cooling-tower-water-turns',
						title: 'Cooling Tower Water Turns',
						place: 'the shared cooling tower at Copper Loop',
						principal: 'Vek Cinder',
						role: 'process correspondent',
						record: 'intake meters, tower temperature cards and shift requests',
						measure: 'water turns with an intake and return temperature',
						detail:
							'two workshops share the same tower during the hottest part of the smelt run',
						stake:
							'how to schedule shared cooling when one workshop’s return water arrives warmer',
						dispute:
							'Each shop counts its own intake. The common board does not show the return temperature at the tower.',
						next: 'operators will post paired intake and return readings during the shared turn',
					},
					{
						topic: 'cinder-air-sample-map',
						title: 'Cinder Air Sample Map',
						place: 'the east ward sample posts',
						principal: 'Grikka Ash',
						role: 'shift safety reporter',
						record: 'sample cards and the posted map of monitoring points',
						measure: 'samples with a point name and shift recorded',
						detail:
							'the newest post is on a roof rather than beside the work lane',
						stake:
							'whether a roof reading describes the air workers breathe at street level',
						dispute:
							'Operators say the roof gives an unblocked regional reading. Workers request a paired street-level sample.',
						next: 'the next map will mark the height of each sample post',
					},
					{
						topic: 'water-reuse-ledger',
						title: 'Water Reuse Ledger',
						place: 'the reuse tank at Ash Yard',
						principal: 'Orrik Smelt',
						role: 'contract and utility correspondent',
						record: 'tank transfer slips and the contract’s reuse allowance',
						measure: 'transfers with a destination and a second-use note',
						detail:
							'the agreement records water entering the tank but not the workshop that receives it',
						stake:
							'how a shared reuse credit is assigned when several shops draw from one tank',
						dispute:
							'The mill counts input saved. Shops ask the contract board to show which line received the reused water.',
						next: 'the utility will add a destination field before calculating the next shared credit',
					},
				],
			},
			{
				section: 'Markets & Contracts',
				series: {
					slug: 'market-contracts',
					title: 'Markets and Contracts',
					description:
						'Stall fees, repair agreements and buyer measures examined from the posted term to the final receipt.',
				},
				stories: [
					{
						topic: 'day-market-weight-standard',
						title: 'Day Market Weight Standard',
						place: 'the common scale at Red Coil Market',
						principal: 'Orrik Smelt',
						role: 'market measure correspondent',
						record: 'scale stamps, seller slips and buyer challenge cards',
						measure: 'loads checked against the common weight',
						detail:
							'the common weight has a maker mark worn smooth on one side',
						stake:
							'how a buyer can compare a load when the stamp is difficult to read',
						dispute:
							'Sellers say the weight remains within tolerance. Buyers ask the assay room to publish a second reference mark.',
						next: 'the market clerk will add a second stamped reference to the board',
					},
					{
						topic: 'slag-block-reuse-market',
						title: 'Slag Block Reuse Market',
						place: 'the reclaimed material row at South Stack',
						principal: 'Pera Cinder',
						role: 'cooperative yard manager',
						record: 'block origin tags, yard receipts and the reuse test cards',
						measure: 'blocks with a source and test result on the same tag',
						detail: 'blocks from two cooling runs have different edge strength',
						stake:
							'how buyers identify a suitable block without discarding useful material',
						dispute:
							'The yard groups blocks by size. Masons want the cooling run and test result visible before purchase.',
						next: 'the cooperative will trial a source tag on each cooling run',
					},
					{
						topic: 'small-shop-license-wait',
						title: 'Small Shop License Wait',
						place: 'the licensing window at Cinder Hall',
						principal: 'Nazza Wire',
						role: 'ward correspondent',
						record:
							'application cards, inspection dates and license issue slips',
						measure: 'applications issued or returned with a dated reason',
						detail: 'a single inspector covers three wards during a rain shift',
						stake:
							'whether a small shop can know how long an application is likely to take',
						dispute:
							'The hall posts a total wait. Shopkeepers ask for inspection waits separate from paperwork waits.',
						next: 'the office will split its queue into record review and site inspection',
					},
					{
						topic: 'waste-heat-cooperative',
						title: 'Waste Heat Cooperative',
						place: 'the shared heat line at Ember Court',
						principal: 'Vek Cinder',
						role: 'process correspondent',
						record: 'heat transfer meters and cooperative invoices',
						measure: 'hours a shared line stays within its promised range',
						detail:
							'one branch warms a workshop before it reaches the upper apartments',
						stake:
							'how the cooperative credits a household when the shared line warms unevenly',
						dispute:
							'The operator measures total heat sent. Residents ask for a reading at each branch before credits are calculated.',
						next: 'the next invoice will include paired readings from the apartment and workshop branches',
					},
					{
						topic: 'contract-arbitration-cards',
						title: 'Contract Arbitration Cards',
						place: 'the contract table at North Furnace Hall',
						principal: 'Grikka Ash',
						role: 'labor correspondent',
						record: 'the signed job card, arbitration note and final pay slip',
						measure:
							'disputes resolved with the pay change visible on both copies',
						detail:
							'the arbitration note is filed separately from the shift card',
						stake:
							'how workers can verify a contract adjustment after a dispute is closed',
						dispute:
							'The contractor points to a signed note. Workers say the final pay slip should show how that note changed the amount.',
						next: 'the table will attach a pay-change line to the closeout copy',
					},
				],
			},
			{
				section: 'Neighborhoods',
				series: {
					slug: 'cinder-neighborhoods',
					title: 'Cinder Neighborhoods',
					description:
						'Household services, shared rooms and neighborhood decisions across the cinder wards.',
				},
				stories: [
					{
						topic: 'heat-credit-register',
						title: 'Heat Credit Register',
						place: 'the tenant board at Ember Court',
						principal: 'Tari Voss',
						role: 'resident heat delegate',
						record: 'household meter notes and the shared line credit book',
						measure: 'credits with a household reading attached',
						detail: 'the meter was replaced halfway through the cold shift',
						stake: 'how a household checks a credit across a meter change',
						dispute:
							'The utility averages both meters. Residents ask for separate readings before and after replacement.',
						next: 'the tenant board will publish the exchange mark beside both readings',
					},
					{
						topic: 'school-coach-route',
						title: 'School Coach Route',
						place: 'the coach board at Ash Yard School',
						principal: 'Miri Coil',
						role: 'school route clerk',
						record: 'route cards, bell times and family transfer notes',
						measure: 'children reaching school on a route marked open',
						detail:
							'a cooling pipe repair closes the shortest stair two mornings each week',
						stake:
							'how the school posts a reliable route when maintenance changes by shift',
						dispute:
							'The route office posts the planned closure. Families say the change also affects the return coach.',
						next: 'the school will publish an outbound and return route for every repair day',
					},
					{
						topic: 'clinic-route-under-shift',
						title: 'Clinic Route Under Shift',
						place: 'the health room below Blackslag Row',
						principal: 'Asha Flint',
						role: 'clinic access steward',
						record:
							'arrival slips, corridor closure notices and the clinic rota',
						measure: 'clinic arrivals with a route open at the recorded time',
						detail: 'the nearest lift closes during a routine tool check',
						stake:
							'whether the posted clinic route remains usable when the nearest lift is checked',
						dispute:
							'The route office records planned closures. Patients say the lift check is often moved after the board is posted.',
						next: 'the clinic and lift crew will share a dated closure notice before each check',
					},
					{
						topic: 'air-sample-public-board',
						title: 'Air Sample Public Board',
						place: 'the sample board in Cinder Ward',
						principal: 'Grikka Ash',
						role: 'shift safety reporter',
						record: 'sample cards, site maps and resident comment slips',
						measure: 'public samples with a named site and shift',
						detail:
							'a card was posted without identifying whether the nearby furnace was active',
						stake:
							'how residents can compare air readings with the work taking place at the time',
						dispute:
							'The plant says the sample meets the public interval. Residents ask for the operating state beside the reading.',
						next: 'the board will add an active, idle or maintenance mark to each card',
					},
					{
						topic: 'rent-council-repair-credit',
						title: 'Rent Council Repair Credit',
						place: 'the housing table at New Ember Hall',
						principal: 'Nazza Wire',
						role: 'neighborhood correspondent',
						record: 'repair requests, rent notices and tenant-held copies',
						measure: 'repair credits visible on the notice before payment day',
						detail:
							'the office updates the register after the payment slips are printed',
						stake:
							'how a household can challenge a repair charge when the copy was printed too early',
						dispute:
							'The housing office treats the online register as current. Tenants rely on the paper copy they receive at the desk.',
						next: 'the council will delay printing until the repair credit register is reconciled',
					},
				],
			},
			{
				section: 'Routes & Repair',
				series: {
					slug: 'border-furnaces',
					title: 'Routes and Repair',
					description:
						'Freight lanes, shared infrastructure and regional agreements followed from the gate to the work site.',
				},
				stories: [
					{
						topic: 'border-freight-scales',
						title: 'Border Freight Scales',
						place: 'the twin scales at Three Kilns Gate',
						principal: 'Orrik Smelt',
						role: 'regional accounts correspondent',
						record:
							'arrival tickets from both scales and the shared freight agreement',
						measure: 'loads with the same tare value at both gates',
						detail: 'one gate resets its scale after the night cooling period',
						stake:
							'how two gates compare a load when one scale resets hours before the other',
						dispute:
							'Each town says its scale passed inspection. Carriers want the reset time printed beside the load ticket.',
						next: 'both gates will add the reset time to the next shared manifest',
					},
					{
						topic: 'rail-signal-handoff',
						title: 'Rail Signal Handoff',
						place: 'the rail switch at Blackglass Junction',
						principal: 'Perrin Coal',
						role: 'signal shift lead',
						record:
							'switch checks, arrival cards and the outgoing crew’s handoff note',
						measure:
							'departures with a signed signal check before the next crew arrives',
						detail:
							'a relief worker uses a different mark from the full-time switch crew',
						stake:
							'how the next operator verifies a signal check made by a temporary relief worker',
						dispute:
							'The rail board accepts both marks. Carriers want the name and time attached to each one.',
						next: 'the junction will test a shared handoff card with a named operator field',
					},
					{
						topic: 'cinder-road-bridge',
						title: 'Cinder Road Bridge',
						place: 'the bridge over Dry Channel',
						principal: 'Vek Cinder',
						role: 'process and infrastructure correspondent',
						record: 'load cards, repair invoices and the closure board',
						measure: 'heavy crossings during the repair limit',
						detail:
							'the lower support is reinforced while one lane remains open',
						stake:
							'whether one-lane access can continue while a support is being reset',
						dispute:
							'Carriers favor a supervised crossing. Masons say the second lane changes vibration on the support.',
						next: 'the bridge crew will compare readings with the lane closed and under one supervised load',
					},
					{
						topic: 'port-sack-manifest',
						title: 'Port Sack Manifest',
						place: 'the cargo ramp at Ash Port',
						principal: 'Narra Vale',
						role: 'freight manifest clerk',
						record:
							'sealed cargo lists, weigh slips and the port transfer book',
						measure: 'sacks matched from ship seal to market receipt',
						detail:
							'the ramp transfer is recorded before the market scale opens',
						stake:
							'how buyers trace a short shipment across two shifts and two scales',
						dispute:
							'The carrier counts the sealed load. The market counts what remains after the ramp transfer.',
						next: 'the port will test a shared seal number on the ramp and market slips',
					},
					{
						topic: 'market-gate-queue',
						title: 'Market Gate Queue',
						place: 'the lower gate at Coal Row Market',
						principal: 'Nazza Wire',
						role: 'ward and market correspondent',
						record:
							'queue tickets, gate opening marks and stall delivery receipts',
						measure: 'deliveries admitted before the first public bell',
						detail: 'the freight lane is shared with a neighborhood water cart',
						stake:
							'how to keep early market freight moving without blocking a neighborhood service',
						dispute:
							'Merchants want a dedicated lane. Residents say the water cart cannot wait until the market is stocked.',
						next: 'the gate steward will test alternating freight and water-cart windows',
					},
				],
			},
		],
		spotlights: [
			{
				topic: 'paid-inspection-hour',
				format: 'reporting',
				title: 'Cinder Works will count inspection time inside the paid shift',
				summary:
					'The board approved a limited payroll trial after comparing safety cards with clock marks. Required inspection work will be recorded before the first production charge.',
				authorId: 'gsn-grikka-ash',
				body: [
					'Cinder Works will record the required inspection hour inside paid shift time during a six-week trial. The decision follows a comparison of safety cards with payroll marks at the east furnace.',
					'Crew delegate Dara Flint said workers already completed the card before the first production charge. The payroll register began later, leaving the inspection outside the paid total even though the board required it.',
					'Mill managers supported the trial after asking that each card carry a start time and a crew signature. The board accepted both requests and kept production output separate from safety time.',
					'The closeout review will compare inspection minutes with payroll entries. It will decide whether to make the line permanent or change the card before another trial.',
				],
				closeout:
					'The board closed this docket by approving a paid inspection line for the next shift window. The next file will compare clock marks with completed cards.',
			},
			{
				topic: 'cooling-water-allocation',
				format: 'investigation',
				title: 'Water board adds a downstream reading to shared cooling cards',
				summary:
					'Paired intake and return readings show why one volume count cannot describe the water reaching workshops and nearby homes.',
				authorId: 'gsn-vek-cinder',
				body: [
					'The west cooling channel has been measured at intake for years. The latest review found no paired record for water leaving the tower after a long furnace run, when its temperature can change before it reaches downstream households.',
					'We compared meter cards from three shifts with the water office’s own release book. Intake totals matched. Return temperatures did not appear on the public card, so residents could not compare the shared allotment with the condition at the culvert.',
					'The water office said the old form was designed to count volume, not temperature. That is supported by the form itself. The gap is that the permit also uses the count to decide who receives a cooling turn.',
					'The next card will include paired readings and the furnace operating state. This docket closes with a new measurement, not a finding that the current allocation was deliberately misreported.',
				],
				closeout:
					'The water board closed this docket by requiring paired intake and return readings in the next allocation window. The earlier intake record remains in the archive.',
			},
			{
				topic: 'rent-council-repair-credit',
				format: 'feature',
				title:
					'A repair credit now appears before tenants receive the payment slip',
				summary:
					'New Ember Hall moved its print run until the tenant copy and repair register match, after several residents found different totals on the same day.',
				authorId: 'gsn-nazza-wire',
				body: [
					'At the New Ember housing table, Nazza Wire lays two repair notices side by side. One shows a roof credit; the other, delivered to a tenant, shows the charge before that credit was entered.',
					'The difference came from timing rather than from two versions of the repair work. The register was updated after the payment slips had been printed. Residents found the missing line only when they brought their copies back to the desk.',
					'The council has moved the print run until the register is reconciled. The clerk will compare tenant-held copies with the public book before releasing a new set, and each correction will carry a date.',
					'Tenants say the change makes the charge easier to question. The office says the delay can be managed if the repair credits close before the payment week. The next window will show whether the later print date holds.',
				],
				closeout:
					'The housing council closed this file by moving the print run after reconciliation. A new docket will check the tenant copies from the next payment week.',
			},
			{
				topic: 'market-gate-queue',
				format: 'opinion',
				title: 'A market lane should not make a neighborhood wait for water',
				summary:
					'Freight deserves a reliable delivery window, but so does the water cart that supplies the residents on the same route.',
				authorId: 'gsn-orrik-smelt',
				body: [
					'The Coal Row market needs a clear freight lane. A neighborhood water cart also needs to cross the lower gate before residents begin their day. The current board gives the first bell to deliveries without recording what the water route loses.',
					'Merchants are right that a slow gate leaves goods waiting and stalls unstocked. Residents are right that water cannot be delayed until the market is ready. A shared lane requires a schedule that names both duties, not a queue that treats one as an exception.',
					'The gate has records that can support a fair trial: delivery tickets, opening marks and the water cart’s arrival times. Publishing those times would let both sides challenge the schedule with evidence rather than guesswork.',
					'The steward should test alternating windows for freight and water service, then review missed deliveries and missed household turns together. The trial can close on a date everyone sees on the board.',
				],
				closeout:
					'The gate steward closed this docket by approving alternating freight and water windows for the next market cycle. The next review will count both missed deliveries and household turns.',
			},
		],
		steps: [
			'a new work docket opens with a named machine, shift and measure',
			'the clerk attaches the contract copy and the crew’s original handoff card',
			'an inspector checks the recorded condition at the work site',
			'workers and neighbors submit accounts before the hearing closes',
			'a second office compares the count with the posted operating state',
			'the board publishes options with paid time, water use or cost shown separately',
			'a time-limited trial begins under a dated card visible to the crew',
			'the committee records a decision and the reason on the public board',
			'the office posts the change and records its first operating measure',
			'the clerk closes this docket and assigns the next window a fresh scope',
		],
		outcomes: [
			'approved a paid-time trial with a closeout date',
			'retained the existing rule and published the operating record',
			'adopted a revised schedule with a worker review period',
			'approved a narrow exception with a public inspection card',
			'closed the request after a second measure confirmed the current threshold',
			'sent a separate contract question to a new hearing without reopening this file',
		],
	},
	kobolds: {
		publicationId: 'kobolds',
		key: 'ksn',
		city: 'Underway',
		seasons: ['first seep', 'vent change', 'store season', 'deep rest'],
		voice:
			'trace each route from its entrance marker to the last branch that residents rely on',
		staff: [
			{
				id: 'ksn-tikka-reed',
				name: 'Tikka Reed',
				bio: 'Reports on public access and the route details that determine who can use a service.',
				beat: 'Passage access and public maps',
				method:
					'walk-through notes from every branch paired with the posted passage map',
			},
			{
				id: 'ksn-kip-copper',
				name: 'Kip Copper',
				bio: 'Covers market stalls, workshops and the records behind shared neighborhood tools.',
				beat: 'Markets and workshop commons',
				method:
					'check-out slips compared with the handoff mark at the next station',
			},
			{
				id: 'ksn-niri-flint',
				name: 'Niri Flint',
				bio: 'Reports on air, water and public maintenance across a city of connected branches.',
				beat: 'Ventilation and water service',
				method: 'paired readings from the source and the last occupied branch',
			},
			{
				id: 'ksn-rook-moss',
				name: 'Rook Moss',
				bio: 'Follows housing, learning and the civic systems that link inner and surface districts.',
				beat: 'Housing, learning and surface routes',
				method:
					'household copies and route logs checked against the public board',
			},
		],
		desks: [
			{
				section: 'Passage & Access',
				series: {
					slug: 'the-passage-map',
					title: 'The Passage Map',
					description:
						'Access routes traced from entry marker through each branch to the rooms and services beyond.',
				},
				stories: [
					{
						topic: 'branch-map-audit',
						title: 'Branch Map Audit',
						place: 'the West Entry map board',
						principal: 'Tikka Reed',
						role: 'passage map correspondent',
						record:
							'the branch map, door markers and residents’ route corrections',
						measure: 'junctions with a confirmed name and a direction mark',
						detail:
							'one side passage is labeled from its entrance but not from the return branch',
						stake:
							'whether a resident can retrace the route after passing through an unmarked junction',
						dispute:
							'The map office counts labeled entrances. Residents ask that every branch show how to return to the same junction.',
						next: 'the map crew will test the return path from both sides of each junction',
					},
					{
						topic: 'branch-wayfinding-signs',
						title: 'Branch Wayfinding Signs',
						place: 'the four-way split at Copper Bend',
						principal: 'Sera Tunn',
						role: 'wayfinding sign keeper',
						record:
							'sign placement cards and route corrections submitted at each junction',
						measure: 'signs legible from both the incoming and return passage',
						detail:
							'a lamp bracket casts a shadow over the lower direction arrow',
						stake:
							'how a sign remains clear when the same bracket serves a lamp and a marker',
						dispute:
							'The repair crew says the arrow is readable at close range. Travelers say they need to choose a branch before they reach the wall.',
						next: 'the sign crew will trial a high and low arrow on both approaches',
					},
					{
						topic: 'accessible-bypass-route',
						title: 'Accessible Bypass Route',
						place: 'the bypass between Lantern Well and Market Loop',
						principal: 'Rell Moss',
						role: 'access route steward',
						record: 'the bypass grade card and service closure notices',
						measure: 'open hours when the bypass reaches both public rooms',
						detail:
							'a repair cart is stored across the turning space during the second shift',
						stake:
							'whether a posted bypass stays usable after the repair crew stores its equipment',
						dispute:
							'The maintenance log marks the route open. Residents say the cart leaves too little room to turn at the lower door.',
						next: 'the steward will measure the turning space before and after the next repair shift',
					},
					{
						topic: 'cargo-lift-handoff',
						title: 'Cargo Lift Handoff',
						place: 'the cargo lift at Three Roots Junction',
						principal: 'Mina Copper',
						role: 'lift handoff clerk',
						record:
							'load cards, bell signals and the outgoing operator’s handoff slate',
						measure: 'loads with a confirmed signal at both landings',
						detail:
							'the upper bell can be heard at the lower landing only when the tool screen is closed',
						stake:
							'how an operator knows a load is ready when the two landings do not hear the same bell',
						dispute:
							'Operators rely on the signal at their own landing. Loaders ask for a shared confirmation before the lift moves.',
						next: 'the lift board will test a two-landing signal before the next heavy load',
					},
					{
						topic: 'flood-gate-branch-markers',
						title: 'Flood Gate Branch Markers',
						place: 'the low branch gates beneath Moss Row',
						principal: 'Kip Moss',
						role: 'branch marker inspector',
						record: 'gate cards and the water crew’s route diagram',
						measure: 'gates with a marker visible from the dry side',
						detail: 'one gate marker is placed behind the turn wheel',
						stake:
							'whether a gate can be identified before a crew enters a wet branch',
						dispute:
							'The water crew can see the marker while operating the wheel. Residents need to identify the gate from the dry passage.',
						next: 'the inspector will test marker visibility from the dry approach and wheel station',
					},
				],
			},
			{
				section: 'Air & Water',
				series: {
					slug: 'ventilation-notes',
					title: 'Ventilation Notes',
					description:
						'Air and water readings followed from source chambers through the branches that residents occupy.',
				},
				stories: [
					{
						topic: 'fresh-air-regulator',
						title: 'Fresh Air Regulator',
						place: 'the North Fan chamber',
						principal: 'Niri Flint',
						role: 'ventilation correspondent',
						record: 'fan settings, air readings and the branch occupancy map',
						measure: 'readings with a fan setting and occupied branch attached',
						detail:
							'the fan is lowered during a stone inspection near one return shaft',
						stake:
							'how to compare an air reading when the fan setting changes during inspection',
						dispute:
							'The maintenance office posts a single average. Residents ask for the reading at the occupied branch during the change.',
						next: 'the fan board will pair each reading with its setting and branch name',
					},
					{
						topic: 'condensation-drain-repair',
						title: 'Condensation Drain Repair',
						place: 'the east condensation channel',
						principal: 'Tikka Reed',
						role: 'public works reporter',
						record: 'drain cards, wall moisture marks and repair tickets',
						measure: 'sections with a dry wall mark after a full cycle',
						detail: 'the lower joint drains only after the upper branch clears',
						stake:
							'how residents can tell whether a wet wall comes from a blocked drain or a delayed release',
						dispute:
							'Repair crews use the upper drain card. Households ask for a mark from the lower joint that stayed wet.',
						next: 'the next inspection will note both upper release and lower wall condition',
					},
					{
						topic: 'shared-cistern-levels',
						title: 'Shared Cistern Levels',
						place: 'the cistern at Lantern Well',
						principal: 'Rook Moss',
						role: 'household water delegate',
						record: 'the draw board and readings kept by three connected rooms',
						measure: 'draw turns recorded at each branch connection',
						detail: 'the nearest room fills before the far branch opens',
						stake:
							'how a shared cistern turn is measured at the branch that fills last',
						dispute:
							'The cistern keeper counts one release. The far branch residents say their turn begins after the near room has closed its valve.',
						next: 'the draw board will show start and end marks at each branch valve',
					},
					{
						topic: 'low-pressure-well',
						title: 'Low Pressure Well',
						place: 'the southern well beneath Moss Row',
						principal: 'Ari Flint',
						role: 'well level reader',
						record:
							'pump cycle cards, water level marks and the lower room queue',
						measure: 'pump cycles with a matching level reading',
						detail:
							'the level falls after a long market draw and returns during the quiet shift',
						stake:
							'how to schedule a shared draw when the well recovers at a different time than the pump cycle',
						dispute:
							'The pump operator counts cycles. Households track the level at the lower room before the next draw.',
						next: 'the well board will place recovery marks beside the pump schedule',
					},
					{
						topic: 'waste-salt-ledger',
						title: 'Waste Salt Ledger',
						place: 'the salt settling chamber at West Reservoir',
						principal: 'Niri Flint',
						role: 'water quality correspondent',
						record:
							'settling cards, filter changes and household distribution notes',
						measure: 'filter runs with a source and destination mark',
						detail: 'two filters share one replacement card',
						stake:
							'how residents can trace a water change to one of two filters',
						dispute:
							'The chamber records a combined run. The distribution crew needs the filter number before sending water onward.',
						next: 'the next card will keep the filter number with the distribution route',
					},
				],
			},
			{
				section: 'Markets & Workshops',
				series: {
					slug: 'underway-market',
					title: 'The Underway Market',
					description:
						'Stall leases, workshop tools and local exchange tracked across the connected rooms of Underway.',
				},
				stories: [
					{
						topic: 'stall-lease-turns',
						title: 'Stall Lease Turns',
						place: 'the market pocket at Three Roots Junction',
						principal: 'Kip Copper',
						role: 'market stall clerk',
						record:
							'stall leases, turn schedules and the shared storage ledger',
						measure: 'leases with a storage turn visible on both copies',
						detail: 'two stalls share one dry shelf during the first seep',
						stake:
							'how sellers can plan stock when a shared storage turn changes',
						dispute:
							'The market board lists the stall turn. Sellers want the shared shelf turn on the same copy.',
						next: 'the clerk will attach the storage rotation to the next lease copy',
					},
					{
						topic: 'night-market-route',
						title: 'Night Market Route',
						place: 'the lower market loop',
						principal: 'Tikka Reed',
						role: 'market route correspondent',
						record: 'lamp checks, stall arrival cards and branch closure marks',
						measure: 'stalls reached by an open public route',
						detail: 'one lamp is switched off during a ventilation check',
						stake:
							'how sellers can move goods when the marked market route passes a temporary closure',
						dispute:
							'The route board is updated after each check. Sellers ask for the next branch to be marked before the light goes out.',
						next: 'the route keeper will post the ventilation window beside the market map',
					},
					{
						topic: 'shared-tool-treasury',
						title: 'Shared Tool Treasury',
						place: 'the common tool chest at Slate Bend',
						principal: 'Kip Copper',
						role: 'tool chest steward',
						record:
							'checkout tabs, repair tickets and workshop contribution marks',
						measure: 'tools returned with a signed handoff and repair note',
						detail:
							'the same hand drill moves between three workbenches in one shift',
						stake:
							'how a repair cost is shared when a tool passes through several hands',
						dispute:
							'The chest charges the last borrower. Workshops say the handoff tabs show a shared use.',
						next: 'the chest will trial a split handoff mark on frequently shared tools',
					},
					{
						topic: 'workbench-shift-rotation',
						title: 'Workbench Shift Rotation',
						place: 'the shared bench room near Copper Bend',
						principal: 'Rook Moss',
						role: 'workbench delegate',
						record: 'bench reservations, tool handoffs and the repair board',
						measure: 'reserved hours completed without a tool conflict',
						detail:
							'two adjacent benches share one clamp during the second shift',
						stake:
							'how work can stay on schedule when a shared tool cannot be used at both benches at once',
						dispute:
							'The reservation book allocates benches. Workers ask that shared tools appear in the same schedule.',
						next: 'the room will test a combined bench and tool reservation card',
					},
					{
						topic: 'weight-board-common-measure',
						title: 'Weight Board Common Measure',
						place: 'the scale pocket at Moss Market',
						principal: 'Kip Copper',
						role: 'market measure keeper',
						record: 'scale stamps, buyer slips and the common measure board',
						measure: 'loads with a second check from a public reference weight',
						detail:
							'a reference weight was moved from the lower pocket during a floor repair',
						stake:
							'how a buyer can compare a load when the shared reference is temporarily elsewhere',
						dispute:
							'The repair crew says the weight is secure in storage. Buyers ask for a replacement reference before trading resumes.',
						next: 'the market will install a temporary stamped weight and record its calibration date',
					},
				],
			},
			{
				section: 'Homes & Learning',
				series: {
					slug: 'shared-rooms',
					title: 'Shared Rooms',
					description:
						'Housing, care and learning reported from the rooms and branches residents use every day.',
				},
				stories: [
					{
						topic: 'school-passage-route',
						title: 'School Passage Route',
						place: 'the route from North Entry to Moss School',
						principal: 'Tikka Reed',
						role: 'school access correspondent',
						record: 'route cards, class start marks and branch closure notices',
						measure: 'open school routes with a second marked branch',
						detail:
							'the shortest route passes a repair gate before the first bell',
						stake:
							'how pupils can reach class when the usual branch closes for a repair',
						dispute:
							'The route office counts the main branch. Families ask for a second route on the same morning notice.',
						next: 'the school board will test a two-route notice during the next repair window',
					},
					{
						topic: 'clinic-lateral-approach',
						title: 'Clinic Lateral Approach',
						place: 'the clinic branch below Lantern Well',
						principal: 'Niri Flint',
						role: 'clinic route access steward',
						record: 'arrival marks, lift notices and the clinic shift rota',
						measure: 'arrivals with a route confirmed open at that time',
						detail:
							'the nearer lift closes for a regular rope check during the evening rota',
						stake:
							'how a patient can confirm a route before starting down the main branch',
						dispute:
							'The lift board lists a planned closure. Clinic staff say the notice does not reach the lower approach.',
						next: 'the clinic will post the closure at both the upper and lower route boards',
					},
					{
						topic: 'room-heat-turns',
						title: 'Room Heat Turns',
						place: 'the warm line beneath Flint Steps',
						principal: 'Ari Moss',
						role: 'household heat delegate',
						record: 'room meter cards and the shared line maintenance schedule',
						measure: 'rooms with a reading before and after a maintenance turn',
						detail:
							'the lowest room cools before the shared line reaches its final branch',
						stake:
							'how households compare service when heat reaches a branch at different times',
						dispute:
							'The service board reports the shared line. Residents ask for the room reading after the final branch.',
						next: 'the board will pair a source mark with one reading at each branch end',
					},
					{
						topic: 'accessible-room-signage',
						title: 'Accessible Room Signage',
						place: 'the public rooms at Underway Hall',
						principal: 'Rook Moss',
						role: 'community hall map keeper',
						record: 'door signs, room maps and resident correction cards',
						measure: 'rooms whose sign matches both route boards',
						detail:
							'one meeting room changed doors when a support post was added',
						stake:
							'how a visitor can find the changed room without needing a guide',
						dispute:
							'The room host says the new sign is visible inside the hall. Visitors need the route board changed before entering.',
						next: 'the hall will update both entry boards and the room sign on the same day',
					},
					{
						topic: 'language-marker-cards',
						title: 'Language Marker Cards',
						place: 'the notice wall at East Entry',
						principal: 'Kip Moss',
						role: 'community notice clerk',
						record:
							'route cards, spoken-name notes and translations requested at the wall',
						measure:
							'public cards with a translated destination and a route mark',
						detail:
							'a place has a spoken name that does not fit the current carved label',
						stake:
							'how a new resident can ask for directions when a sign and a spoken name differ',
						dispute:
							'Mappers favor the shorter carved label. Residents want the local name kept on the card as a search term.',
						next: 'the notice wall will add a cross-name card beside the carved label',
					},
				],
			},
			{
				section: 'Surface & Environment',
				series: {
					slug: 'surface-links',
					title: 'Surface Links',
					description:
						'Rain entries, shared routes and the agreements that connect Underway to the surface.',
				},
				stories: [
					{
						topic: 'surface-pass-gate',
						title: 'Surface Pass Gate',
						place: 'the east surface pass',
						principal: 'Niri Flint',
						role: 'surface access correspondent',
						record: 'pass slips, weather readings and the gate opening board',
						measure: 'open hours with a posted weather reading',
						detail:
							'the outside cloud mark can change after the lower gate is checked',
						stake:
							'how travelers know the upper route is still clear after they pass the lower gate',
						dispute:
							'The gate crew posts conditions at entry. Travelers ask for an update before committing to the upper climb.',
						next: 'the pass office will add a second notice at the halfway shelter',
					},
					{
						topic: 'rain-entry-barrier',
						title: 'Rain Entry Barrier',
						place: 'the South Rain Entry',
						principal: 'Tikka Reed',
						role: 'entry route reporter',
						record:
							'barrier checks, runoff marks and the maintenance shift log',
						measure:
							'rain events with a clear bypass marked before water reaches the first branch',
						detail:
							'the temporary barrier leaves one narrow bypass for repair crews',
						stake:
							'how to keep a bypass open for residents while the barrier protects the lower rooms',
						dispute:
							'The works office measures the barrier. Residents ask that the bypass width be measured during runoff.',
						next: 'the next test will record barrier height and bypass width together',
					},
					{
						topic: 'hill-station-connection',
						title: 'Hill Station Connection',
						place: 'the hill station above West Entry',
						principal: 'Rook Moss',
						role: 'route clerk for the hill station',
						record:
							'carriage times, pass tickets and the station’s connection board',
						measure: 'connections completed within one route interval',
						detail:
							'the upper carriage uses a bell that does not carry to the lower platform',
						stake:
							'how a traveler knows a connection is held when the two levels cannot hear the same signal',
						dispute:
							'The upper crew records a held carriage. The lower desk cannot verify the hold until the next ticket arrives.',
						next: 'the station will test a visual connection mark at both levels',
					},
					{
						topic: 'surface-mail-tunnel',
						title: 'Surface Mail Tunnel',
						place: 'the mail branch between Underway and Flint Ridge',
						principal: 'Kip Copper',
						role: 'mail route correspondent',
						record:
							'sealed mail lists, transfer marks and the ridge carrier book',
						measure: 'sealed packets with a mark at both route transfers',
						detail:
							'the packet list is copied before the ridge carrier accepts the seal',
						stake:
							'how a sender checks a packet that changes hands between the tunnel and ridge routes',
						dispute:
							'The tunnel office counts a packet at dispatch. The ridge office counts it after the seal is checked.',
						next: 'the next list will carry one seal mark from entry through final handoff',
					},
					{
						topic: 'hill-route-agreement',
						title: 'Hill Route Agreement',
						place: 'the shared path marker at Flint Ridge',
						principal: 'Niri Flint',
						role: 'route agreement reader',
						record:
							'the route agreement, repair notices and the two public marker boards',
						measure: 'repairs posted at both ends before a path closes',
						detail:
							'one notice board is inside the tunnel and the second faces the ridge',
						stake:
							'how each side posts a closure before travelers reach the shared marker',
						dispute:
							'Each town posts promptly at its own end. Travelers need the same closure time on both boards.',
						next: 'the route offices will share a dated notice before the next repair',
					},
				],
			},
			{
				section: 'Culture & Records',
				series: {
					slug: 'underway-records',
					title: 'Underway Records',
					description:
						'Local names, signal systems and civic rooms treated as records residents can inspect and revise.',
				},
				stories: [
					{
						topic: 'oral-map-index',
						title: 'Oral Map Index',
						place: 'the route table at Lantern Hall',
						principal: 'Tikka Reed',
						role: 'map index editor',
						record:
							'spoken route notes, carved markers and the public branch map',
						measure: 'spoken names linked to a direction and junction',
						detail:
							'one route name describes the sound heard at a junction rather than its shape',
						stake:
							'how a map can hold a spoken name without mistaking it for a physical direction',
						dispute:
							'The map room wants direction names. Residents use sound names to remember the route.',
						next: 'the index will link the spoken name to the junction and branch arrows',
					},
					{
						topic: 'signal-registry',
						title: 'Signal Registry',
						place: 'the signal board at Three Roots Junction',
						principal: 'Kip Moss',
						role: 'signal registry keeper',
						record:
							'signal patterns, maintenance cards and changes submitted by route crews',
						measure: 'signals with a dated source and a matching branch label',
						detail:
							'two adjacent branches use a different pause after the second knock',
						stake:
							'how route users can distinguish two signals when the branches share an echo',
						dispute:
							'The registry follows the written pattern. Route crews say an echo changes how the pause is heard at the junction.',
						next: 'the keeper will test both signals from the approach path and the branch interior',
					},
					{
						topic: 'craft-guild-ballot',
						title: 'Craft Guild Ballot',
						place: 'the shared bench room at Slate Bend',
						principal: 'Kip Copper',
						role: 'bench room delegate',
						record: 'guild roll, reservation slips and the ballot box seal log',
						measure:
							'members able to cast a ballot during an open bench interval',
						detail:
							'the only box is stored at a branch that closes for tool service',
						stake:
							'how a member casts a vote when the meeting room and workbench schedule conflict',
						dispute:
							'The guild wants one sealed box. Members ask for a second ballot interval after the tool service ends.',
						next: 'the guild will test a second staffed ballot interval with the same seal log',
					},
					{
						topic: 'hall-stage-rotation',
						title: 'Hall Stage Rotation',
						place: 'the public stage at Underway Hall',
						principal: 'Rook Moss',
						role: 'hall stage coordinator',
						record: 'the booking slate, rehearsal requests and sound checks',
						measure: 'public nights with a rehearsal interval confirmed',
						detail:
							'a new sound screen changes the return heard from the last bench',
						stake:
							'how groups share the stage when a change in the room alters the sound check',
						dispute:
							'The hall rotates public nights equally. Performers ask for the same rehearsal interval after a sound screen moves.',
						next: 'the coordinator will add a sound check to the booking record for one rotation',
					},
					{
						topic: 'water-history-standard',
						title: 'Water History Standard',
						place: 'the archive niche at Moss Reservoir',
						principal: 'Niri Flint',
						role: 'water records editor',
						record:
							'reservoir marks, pump log copies and the public archive index',
						measure: 'historic marks with a date and reading location',
						detail:
							'the earliest level marks use a handspan scale that changed between crews',
						stake:
							'how residents compare old and current water levels when the scale changed',
						dispute:
							'The archive wants one present-day scale. Pump crews ask that old marks keep their original unit alongside a conversion.',
						next: 'the archive will add a conversion note without removing the original mark',
					},
				],
			},
		],
		spotlights: [
			{
				topic: 'branch-map-audit',
				format: 'investigation',
				title: 'Underway map review adds return arrows at three junctions',
				summary:
					'A field walk found entrance labels without a return mark. The map crew has updated three branch cards and scheduled a second resident walk before closing its trial.',
				authorId: 'ksn-tikka-reed',
				body: [
					'The West Entry map now carries return arrows at three junctions where the old card named the entrance but not the route back. The change follows a resident walk with the map crew through the same branches used on market and school days.',
					'The walk found one side passage whose label was clear from the entrance and absent from the return branch. The crew marked both sides and kept the original route name. It did not redraw the passage or change its maintenance status.',
					'Map editor Tikka Reed said the new arrows are a trial, not a claim that one label works for every traveler. Residents can submit a correction at the hall table; each accepted change will carry its source and date.',
					'The second walk is scheduled after the next vent change, when a different shift uses the branch. The file will close after both routes have been checked from entrance to return.',
				],
				closeout:
					'The map table closed this docket by adopting return arrows at the three tested junctions. A new file will begin with a different branch walk.',
			},
			{
				topic: 'shared-cistern-levels',
				format: 'reporting',
				title: 'Lantern Well board will show the last branch turn',
				summary:
					'The water keeper accepted a paired mark at the near and far valves after households showed the first room filled before the final branch opened.',
				authorId: 'ksn-niri-flint',
				body: [
					'The Lantern Well board will show start and end marks at the near and far branch valves after residents said one release count hid when the last room received water.',
					'Water delegate Rook Moss said the existing board records the cistern draw. It does not distinguish a turn that reaches the first room from one that reaches the final branch after a valve closes upstream.',
					'The new marks will be tested during the next store season. The keeper will record the same release at both valves and leave the old shared count on the card for comparison.',
					'The review ends after a complete rotation. If the paired reading changes how turns are assigned, the board must identify the new rule and the date it begins.',
				],
				closeout:
					'The water board closed this docket by adopting paired marks at both branch valves for the next allocation window. The shared count stays on the card for comparison.',
			},
			{
				topic: 'accessible-bypass-route',
				format: 'feature',
				title: 'A route can be open and still leave too little turning room',
				summary:
					'Residents and repair crews are testing a marked equipment space so the Lantern Well bypass stays usable through a maintenance shift.',
				authorId: 'ksn-rook-moss',
				body: [
					'At the bypass between Lantern Well and Market Loop, the repair cart has a marked place to wait. Before that mark, the cart often sat across the turning space while the crew checked the lower support.',
					'Access steward Rell Moss says the route can appear open on the board and still be hard to use at the door. Residents asked for a clear width measure taken after the repair team places its equipment, not before it arrives.',
					'The maintenance crew agreed to keep one equipment bay beside the wall. It keeps tools near the work and leaves the turn clear while the bypass remains open. The arrangement will be checked by residents and the crew together.',
					'The trial ends when the lower support is repaired. The city will decide whether to keep the bay mark for future work or return to a full closure during tool checks.',
				],
				closeout:
					'The ward council closed this docket by keeping the equipment bay mark for the next maintenance schedule. A new review will measure the clear turning width.',
			},
			{
				topic: 'surface-mail-tunnel',
				format: 'explainer',
				title: 'How a seal mark follows a packet from tunnel to ridge',
				summary:
					'The revised list uses one seal number at dispatch, transfer and arrival, so a sender can see which office last checked a packet.',
				authorId: 'ksn-kip-copper',
				body: [
					'The tunnel mail list records a packet when it leaves Underway. The ridge book records it when a carrier accepts the seal. A sender could see two totals but not which handoff accounted for a missing mark.',
					'The new list repeats one seal number at dispatch, at the tunnel exit and at the ridge station. It does not reveal what a packet contains. It gives the two route offices a shared reference for finding where the transfer record stops.',
					'That difference matters when a packet changes hands between the tunnel and surface crews. Each office can keep its own log while preserving a common route history.',
					'The trial will end after one full mail rotation. The route board will publish the number of packets with all three marks before deciding whether the shared seal field becomes standard.',
				],
				closeout:
					'The route offices closed this docket by adopting the shared seal number for dispatch, transfer and arrival. The next file will count packets from a new mail rotation.',
			},
		],
		steps: [
			'a new route file opens with an entrance, branch and service named',
			'the clerk attaches the current passage map and the last change card',
			'a field walk checks the route from entry point to final branch',
			'residents and route crews submit corrections before the public table closes',
			'a second reader compares each mark with the location on the wall',
			'the board publishes two route options with access and repair limits stated',
			'a limited route trial starts with a dated sign at each affected junction',
			'the table records the result and the branches included in the decision',
			'the map crew posts an updated card while keeping the earlier copy linked',
			'the clerk closes this route file and gives the next window a fresh walk',
		],
		outcomes: [
			'adopted a marked route trial with a resident review date',
			'retained the current map and published the route walk that supports it',
			'added a second branch mark for the next passage window',
			'approved a limited bypass with a named maintenance turn',
			'closed the file after both approaches matched the public map',
			'sent a separate sign question to a new route review without reopening this one',
		],
	},
	vampires: {
		publicationId: 'vampires',
		key: 'vsn',
		city: 'Vesperhold',
		seasons: ['late winter', 'fog season', 'long dusk', 'early thaw'],
		voice:
			'date every record and distinguish a current rule from a custom that has simply lasted a long time',
		staff: [
			{
				id: 'vsn-sera-voss',
				name: 'Sera Voss',
				bio: 'Reports on public health and the services residents use across night and day schedules.',
				beat: 'Health, care and city services',
				method:
					'service hours compared with arrival records from the same window',
			},
			{
				id: 'vsn-lucien-vale',
				name: 'Lucien Vale',
				bio: 'Covers city records and asks how old rules change when residents and institutions do.',
				beat: 'Civic procedure and public records',
				method:
					'the original record checked against the date it was amended and used',
			},
			{
				id: 'vsn-mira-noct',
				name: 'Mira Noct',
				bio: 'Reports on culture, housing and how a city makes room for residents with different daily hours.',
				beat: 'Housing, culture and neighborhood life',
				method:
					'household interviews paired with the posted schedule and room calendar',
			},
			{
				id: 'vsn-adrian-veil',
				name: 'Adrian Veil',
				bio: 'A market and transport correspondent who follows a rule from public notice to its final receipt.',
				beat: 'Transit, markets and regional agreements',
				method: 'dated handoffs followed from dispatch to the last public stop',
			},
		],
		desks: [
			{
				section: 'Night City',
				series: {
					slug: 'the-night-ledger',
					title: 'The Night Ledger',
					description:
						'Transit, public decisions and city services followed across the hours when most residents are moving.',
				},
				stories: [
					{
						topic: 'late-transit-connection',
						title: 'Late Transit Connection',
						place: 'the west platform at Bell Arch',
						principal: 'Sera Voss',
						role: 'night service correspondent',
						record:
							'last-car dispatch times and connection slips from the clinic route',
						measure: 'late connections completed within one route interval',
						detail:
							'the final eastbound car leaves shortly before the clinic transfer bell',
						stake:
							'whether the posted last connection works for residents leaving the late clinic shift',
						dispute:
							'Transit counts the car arrival. Clinic staff count whether a passenger can reach the connecting stair in time.',
						next: 'the transit office will record both platform arrival and connection time',
					},
					{
						topic: 'dusk-streetlight-budget',
						title: 'Dusk Streetlight Budget',
						place: 'the lamps between Veil Market and East Steps',
						principal: 'Eda Fell',
						role: 'night lighting steward',
						record:
							'lamp maintenance cards and requests from residents on both shifts',
						measure: 'public lamps working during the change between schedules',
						detail:
							'a lamp row is dimmed for maintenance before the market closes',
						stake:
							'how public lighting is budgeted when maintenance overlaps the busiest transfer hour',
						dispute:
							'The repair office schedules a quiet hour. Market workers say the quiet hour is also the time they travel home.',
						next: 'the council will compare maintenance hours with transfer counts before setting the next budget',
					},
					{
						topic: 'night-council-ballot-access',
						title: 'Night Council Ballot Access',
						place: 'the vote room at South Gate Hall',
						principal: 'Lucien Vale',
						role: 'public records correspondent',
						record:
							'the voter roll, ballot room hours and workplace release notices',
						measure:
							'registered residents able to reach a ballot table during posted hours',
						detail:
							'the last ballot interval overlaps the shift handoff at the east foundry',
						stake:
							'how a public vote can serve residents whose work schedule changes by season',
						dispute:
							'The council measures the room’s open hours. Workers ask that release times and travel between districts also be counted.',
						next: 'the clerk will compare ballot marks with the workplace release board',
					},
					{
						topic: 'shared-hour-courtyard',
						title: 'Shared Hour Courtyard',
						place: 'the courtyard at Juniper House',
						principal: 'Mira Noct',
						role: 'neighborhood correspondent',
						record:
							'the courtyard calendar and maintenance requests from residents',
						measure: 'quiet hours that leave at least one shared interval open',
						detail:
							'residents who keep different daily hours use the same warming room',
						stake:
							'how a shared room can offer quiet and still remain open to neighbors',
						dispute:
							'One group requests a single quiet block. Another says the block removes its only shared meal interval.',
						next: 'the residents’ table will test two shorter quiet blocks for one calendar window',
					},
					{
						topic: 'public-clock-maintenance',
						title: 'Public Clock Maintenance',
						place: 'the clock face at Vesper Steps',
						principal: 'Adrian Veil',
						role: 'transit and city services correspondent',
						record:
							'clock calibration cards and the service board that uses its signal',
						measure: 'public services with the calibration date posted',
						detail:
							'the clock is adjusted during the quiet interval but its board stays visible',
						stake:
							'how a service announces time when the public clock is being calibrated',
						dispute:
							'The clock keeper trusts the calibration card. Residents rely on the time board at the route entrance.',
						next: 'the keeper will post the calibration window on the route board before work begins',
					},
				],
			},
			{
				section: 'Public Health',
				series: {
					slug: 'care-after-dusk',
					title: 'Care After Dusk',
					description:
						'Clinic hours and public care tracked through staffing, arrival times and the routes residents use.',
				},
				stories: [
					{
						topic: 'night-clinic-rota',
						title: 'Night Clinic Rota',
						place: 'the North Hall clinic',
						principal: 'Sera Voss',
						role: 'clinic schedule correspondent',
						record:
							'the night roster, medicine cupboard log and referral slips',
						measure: 'urgent visits reached within the posted interval',
						detail:
							'the second practitioner crosses two districts after the last coach transfer',
						stake:
							'whether a named shift means a practitioner can reach the clinic in time',
						dispute:
							'The office counts an assigned clinician. Patients count the time between a call and a person at the door.',
						next: 'the clinic will compare call and arrival times before changing the rota',
					},
					{
						topic: 'rest-interval-board',
						title: 'Rest Interval Board',
						place: 'the shared rest room at North Hall Clinic',
						principal: 'Iria Venn',
						role: 'rest room coordinator',
						record: 'room bookings, cleaning checks and resident requests',
						measure: 'rest intervals with a confirmed room and attendant',
						detail:
							'a cleaning block is posted after the last room booking rather than before it',
						stake:
							'how a resident can plan a rest interval when cleaning time moves',
						dispute:
							'The clinic posts room availability. Residents ask for a separate cleaning interval so they know when the room is ready.',
						next: 'the room board will show booking and cleaning hours in separate columns',
					},
					{
						topic: 'clinic-route-dispatch',
						title: 'Clinic Route Dispatch',
						place: 'the stair and lift network near Night Gate',
						principal: 'Dema Orin',
						role: 'clinic route dispatcher',
						record: 'dispatch cards, lift closure notes and arrival slips',
						measure:
							'arrivals with a route confirmed open at the dispatch time',
						detail:
							'the nearest lift changes its maintenance hour during the fog season',
						stake:
							'how a dispatcher chooses a route when the nearest lift may close before arrival',
						dispute:
							'The lift office posts planned maintenance. The clinic says it needs confirmation that the change was carried out.',
						next: 'dispatchers will record both the planned and completed closure time',
					},
					{
						topic: 'community-care-rounds',
						title: 'Community Care Rounds',
						place: 'the lower district care rooms',
						principal: 'Nera Vale',
						role: 'community care coordinator',
						record: 'visit rota, household handoffs and care room notes',
						measure: 'visits with a named handoff to the next shift',
						detail:
							'a regular route passes a locked stair during the third night window',
						stake:
							'how a handoff is counted when the next helper must use a longer route',
						dispute:
							'The coordinator records a completed visit. Households ask that the next helper’s arrival also be recorded.',
						next: 'the care table will pair each visit with the next handoff time',
					},
					{
						topic: 'public-service-quiet-room',
						title: 'Public Service Quiet Room',
						place: 'the quiet room at Vesperhold Health House',
						principal: 'Mira Noct',
						role: 'health access correspondent',
						record: 'room calendar, interpreter requests and closure cards',
						measure:
							'open periods with an interpreter available when requested',
						detail:
							'the interpreter rota is filed after the room calendar is printed',
						stake:
							'how residents can arrange a visit when the interpreter time is posted later',
						dispute:
							'The desk can schedule a room without an interpreter. Residents ask for one calendar that shows both.',
						next: 'the house will publish the interpreter rota before its next room calendar',
					},
				],
			},
			{
				section: 'Housing & Memory',
				series: {
					slug: 'lease-and-memory',
					title: 'Lease and Memory',
					description:
						'Long-running housing records checked against the current rights and duties of residents.',
				},
				stories: [
					{
						topic: 'old-lease-index',
						title: 'Old Lease Index',
						place: 'the housing archive at Vesper Steps',
						principal: 'Lucien Vale',
						role: 'public records correspondent',
						record:
							'lease copies, amendment leaves and the current address register',
						measure:
							'leases with each amendment date linked to the current address',
						detail:
							'some buildings have kept the same residents through several street renumberings',
						stake:
							'how a resident can verify which amendment governs a current address',
						dispute:
							'The archive preserves original language. The housing desk needs a current reference that residents can locate.',
						next: 'the index will link the original lease to a dated current-address note',
					},
					{
						topic: 'mixed-hours-housing',
						title: 'Mixed Hours Housing',
						place: 'the south courtyard houses',
						principal: 'Mira Noct',
						role: 'housing correspondent',
						record:
							'quiet-hour rules, shared room bookings and tenant requests',
						measure:
							'households with a usable shared room across both schedules',
						detail:
							'the same warming room serves residents who sleep at different hours',
						stake:
							'how a building can set quiet hours without excluding one group from the only shared room',
						dispute:
							'The building board prefers one long quiet block. Residents ask for shorter periods that leave a shared meal hour open.',
						next: 'the tenant table will compare two quiet schedules during one calendar window',
					},
					{
						topic: 'new-resident-register',
						title: 'New Resident Register',
						place: 'the welcome desk at West Lantern House',
						principal: 'Iria Venn',
						role: 'resident intake clerk',
						record: 'temporary addresses, service notices and lease copies',
						measure:
							'new residents receiving a service notice before the first review date',
						detail:
							'temporary addresses expire before the shared notice list is refreshed',
						stake:
							'how residents receive a meeting notice when their first room is temporary',
						dispute:
							'The desk removes expired addresses for accuracy. Residents say the notice list should be refreshed before removal.',
						next: 'the intake desk will test a reminder before a temporary address expires',
					},
					{
						topic: 'inherited-repair-duty',
						title: 'Inherited Repair Duty',
						place: 'the stone stair housing row at Old Clock Court',
						principal: 'Sera Voss',
						role: 'public service correspondent',
						record: 'lease addenda, repair invoices and tenant-held copies',
						measure: 'repair duties with a current amount and review date',
						detail:
							'an old addendum names a repair share without stating how long it lasts',
						stake:
							'how a resident can question a repair duty that predates the current lease copy',
						dispute:
							'The board says the addendum remains in force. Tenants ask for an amount and an end date before renewal.',
						next: 'the housing desk will attach dated addenda to each current lease copy',
					},
					{
						topic: 'long-record-correction',
						title: 'Long Record Correction',
						place: 'the public archive at Vesperhold Hall',
						principal: 'Lucien Vale',
						role: 'archive correspondent',
						record:
							'civic registers, correction requests and the published index',
						measure:
							'corrections linked to the record and the date they were made',
						detail:
							'a decades-old neighborhood boundary is copied differently in two public books',
						stake:
							'how to correct a long-used index without erasing the versions residents relied on',
						dispute:
							'The registry wants one current boundary. Residents ask that the earlier line remain visible with its date.',
						next: 'the archive will publish a correction note linked to both boundary copies',
					},
				],
			},
			{
				section: 'Work & Markets',
				series: {
					slug: 'market-after-hours',
					title: 'The Market After Hours',
					description:
						'Prices and working arrangements followed across the late market, storage rooms and shared routes.',
				},
				stories: [
					{
						topic: 'late-market-price-board',
						title: 'Late Market Price Board',
						place: 'the covered market at South Arch',
						principal: 'Adrian Veil',
						role: 'market correspondent',
						record: 'stall tickets, posted prices and the shared scale ledger',
						measure: 'prices with a weight and measure method shown',
						detail:
							'the late market uses a second scale after the day market closes',
						stake:
							'how a buyer compares a price posted under a different scale',
						dispute:
							'Sellers say the late scale is certified. Buyers ask for both methods on the same board.',
						next: 'the market office will post a paired scale comparison for one review window',
					},
					{
						topic: 'shared-cold-store-hours',
						title: 'Shared Cold Store Hours',
						place: 'the common cold store beside South Arch',
						principal: 'Marek Voss',
						role: 'store cooperative manager',
						record: 'entry logs, temperature marks and member invoices',
						measure: 'hours held inside the posted temperature range',
						detail:
							'the store changes its cooling schedule between the late and early market',
						stake:
							'how members share a cooling cost when the store uses different schedules',
						dispute:
							'The cooperative counts powered hours. Members ask for a temperature record at the time goods change hands.',
						next: 'the store will add a transfer reading to each member invoice',
					},
					{
						topic: 'night-work-schedule',
						title: 'Night Work Schedule',
						place: 'the schedule board at Veil Market',
						principal: 'Mira Noct',
						role: 'work and culture correspondent',
						record:
							'posted shifts, quiet-room bookings and market delivery slips',
						measure: 'shift changes posted before a worker’s rest interval',
						detail:
							'a delivery window was moved after the quiet-room schedule was printed',
						stake:
							'how market workers plan rest when a delivery time changes late',
						dispute:
							'Market managers count a schedule as current once posted. Workers ask for a notice when the posted time changes.',
						next: 'the board will attach a revision time to every late shift change',
					},
					{
						topic: 'market-repair-contract',
						title: 'Market Repair Contract',
						place: 'the repair counter at South Arch Market',
						principal: 'Lucien Vale',
						role: 'contract correspondent',
						record: 'repair scope, market closures and final invoices',
						measure: 'work orders with a closure period and a final amount',
						detail:
							'the repair contract lists parts but not the hours stalls must close',
						stake:
							'how sellers can plan around a repair price that does not show lost stall hours',
						dispute:
							'The contractor prices materials and work. Sellers ask the board to disclose how long the aisle will be closed.',
						next: 'the next contract will list the work period separately from the material cost',
					},
					{
						topic: 'late-route-safety-board',
						title: 'Late Route Safety Board',
						place: 'the path between the market and north coach stop',
						principal: 'Adrian Veil',
						role: 'transport correspondent',
						record: 'lamp checks, coach departures and worker route requests',
						measure: 'late departures with a lit path confirmed at both ends',
						detail:
							'the last lamp check occurs before the final coach departure',
						stake:
							'how a worker confirms a safe route after the lamp check has ended',
						dispute:
							'The city counts scheduled checks. Workers ask for a final check aligned with the last departure.',
						next: 'the route office will move one lamp check to the final coach window',
					},
				],
			},
			{
				section: 'Culture & Time',
				series: {
					slug: 'time-and-culture',
					title: 'Time and Culture',
					description:
						'Calendars, performance rooms and records examined across residents with different daily hours.',
				},
				stories: [
					{
						topic: 'calendar-reconciliation',
						title: 'Calendar Reconciliation',
						place: 'the civic calendar table at Vesperhold Hall',
						principal: 'Lucien Vale',
						role: 'calendar records editor',
						record: 'district calendars, event notices and correction leaves',
						measure: 'public events with a date in both local and city formats',
						detail: 'one district begins its civic day at the late bell',
						stake:
							'how a shared calendar prevents residents from arriving a day early or late',
						dispute:
							'The central office uses one day boundary. District organizers say their local boundary is part of the event record.',
						next: 'the calendar board will show both date forms for the next public season',
					},
					{
						topic: 'night-stage-opening',
						title: 'Night Stage Opening',
						place: 'the shared stage at Lantern Theatre',
						principal: 'Mira Noct',
						role: 'arts correspondent',
						record:
							'stage bookings, rehearsal cards and the room’s sound notes',
						measure: 'performances with an open rehearsal interval',
						detail: 'the room is used by both late and early audience groups',
						stake:
							'how an opening schedule leaves rehearsal time for groups with different hours',
						dispute:
							'The theatre wants one standard rehearsal block. Performers ask that the room be tested at both audience times.',
						next: 'the next booking will include a sound check before each public interval',
					},
					{
						topic: 'library-hour-ledger',
						title: 'Library Hour Ledger',
						place: 'the reading room at West Veil Library',
						principal: 'Sera Voss',
						role: 'public service correspondent',
						record: 'room hours, request slips and staff handoff notes',
						measure: 'requests filled during the hours printed on the door',
						detail:
							'the staff handoff overlaps the only quiet hour for readers on the late schedule',
						stake:
							'how public reading hours are counted when no desk attendant is available during a handoff',
						dispute:
							'The calendar counts the room as open. Readers say a room without a staffed request desk is not full access.',
						next: 'the library will record room hours and staffed request hours separately',
					},
					{
						topic: 'public-clock-calibration',
						title: 'Public Clock Calibration',
						place: 'the civic clock at South Arch',
						principal: 'Adrian Veil',
						role: 'city services correspondent',
						record:
							'clock calibration cards and service boards that use the signal',
						measure: 'service boards with a matching calibration date',
						detail: 'the clock is adjusted while transit notices remain posted',
						stake:
							'how a service announces its time while the public clock is being calibrated',
						dispute:
							'The clock keeper trusts the calibration card. Residents rely on the displayed signal at the route entrance.',
						next: 'the clock office will post the calibration window on every connected service board',
					},
					{
						topic: 'museum-record-provenance',
						title: 'Museum Record Provenance',
						place: 'the city collection room at North Veil Museum',
						principal: 'Lucien Vale',
						role: 'archive correspondent',
						record:
							'collection labels, transfer notes and the public catalog index',
						measure: 'objects with a dated transfer and a named source',
						detail:
							'one object was catalogued before its transfer note was copied',
						stake:
							'how a public collection distinguishes what is known from what is attributed later',
						dispute:
							'Curators say the label describes the accepted history. Researchers ask that the earlier source note remain attached.',
						next: 'the museum will publish the label and transfer note as separate linked records',
					},
				],
			},
			{
				section: 'Regional Affairs',
				series: {
					slug: 'regional-night-dispatch',
					title: 'The Regional Night Dispatch',
					description:
						'Ferries, shared routes and intercity agreements followed through their dated public records.',
				},
				stories: [
					{
						topic: 'night-ferry-agreement',
						title: 'Night Ferry Agreement',
						place: 'the ferry crossing between Vesperhold and Far Quay',
						principal: 'Adrian Veil',
						role: 'regional transport correspondent',
						record:
							'the joint timetable, crew rota and passenger connection slips',
						measure: 'connections completed within the agreed transfer time',
						detail:
							'the two towns publish departure times from different clock boards',
						stake:
							'how a passenger can plan a transfer when the towns use different day boundaries',
						dispute:
							'Each port says its departure time is locally correct. Travelers need a conversion on the shared board.',
						next: 'both ports will publish the same conversion beside their local time',
					},
					{
						topic: 'daylight-room-charter',
						title: 'Daylight Room Charter',
						place: 'the public shelter at Glass Ridge',
						principal: 'Sera Voss',
						role: 'public health correspondent',
						record: 'room key log, care requests and the shared charter',
						measure: 'public hours when a staffed room is available',
						detail:
							'the host town holds the key while a neighboring service supplies the attendant',
						stake:
							'how a shared public room opens when its key holder and attendant live in different towns',
						dispute:
							'The charter names a host town but not who confirms the attendant’s arrival.',
						next: 'the towns will add a two-party opening mark to the shared room log',
					},
					{
						topic: 'intercity-supply-ledger',
						title: 'Intercity Supply Ledger',
						place: 'the shared goods table at Far Quay',
						principal: 'Mira Noct',
						role: 'regional markets correspondent',
						record:
							'sealed manifests, inspection slips and receiving store cards',
						measure: 'loads with a matching seal from dispatch to receipt',
						detail:
							'one storage handoff occurs before the receiving city’s public desk opens',
						stake:
							'how a buyer traces a load transferred while one city desk is closed',
						dispute:
							'The carrier counts the seal at dispatch. The receiving clerk counts it when the store opens.',
						next: 'both cities will add a transfer mark to the shared manifest',
					},
					{
						topic: 'shared-shade-route',
						title: 'Shared Shade Route',
						place: 'the covered path through the south ridge',
						principal: 'Lucien Vale',
						role: 'public records correspondent',
						record:
							'route maintenance agreement and closure notices from both towns',
						measure:
							'closures posted at both route entrances before work begins',
						detail:
							'the path has two maintenance crews with separate notice boards',
						stake:
							'how travelers receive one closure time when the crews work on different schedules',
						dispute:
							'Each crew posts its own interval. Travelers ask which notice applies where the two sections meet.',
						next: 'the route clerks will publish a single shared interval before the next repair',
					},
					{
						topic: 'regional-calendar-notices',
						title: 'Regional Calendar Notices',
						place: 'the joint notice room at East Arch',
						principal: 'Sera Voss',
						role: 'public notices correspondent',
						record:
							'regional calendars, meeting notices and the public correction book',
						measure: 'shared events listed in both towns’ calendar format',
						detail:
							'the towns change their day marker at different public bells',
						stake:
							'how residents avoid missing a joint hearing when the two calendars change at different hours',
						dispute:
							'The joint room prints one date. Local clerks ask that the town-specific day marker remain visible.',
						next: 'the notice room will show both local dates on the next joint hearing card',
					},
				],
			},
		],
		spotlights: [
			{
				topic: 'late-transit-connection',
				format: 'reporting',
				title:
					'Vesperhold keeps the last clinic transfer during a transit trial',
				summary:
					'The transit board approved a six-week later connection after comparing clinic release times with eastbound car arrivals.',
				authorId: 'vsn-adrian-veil',
				body: [
					'The west platform will hold one eastbound connection for residents leaving the North Hall clinic during a six-week trial. The change follows a comparison of the clinic transfer bell with the last-car dispatch log.',
					'Transit counted each car arrival as a completed route. Clinic staff showed the board that some passengers reached the platform after the connecting stair had closed. The two measures described different parts of the same trip.',
					'The new board will record arrival and connection times separately. Transit will also post the date when the trial ends so residents can see when the timetable is reviewed.',
					'The final report will compare completed connections with extra wait time for the crew. The board has not made the later departure permanent.',
				],
				closeout:
					'The transit board closed this docket by retaining the later connection for the next timetable window. A new file will measure completed transfers under that schedule.',
			},
			{
				topic: 'night-clinic-rota',
				format: 'investigation',
				title: 'Clinic roster counted an assigned practitioner, not an arrival',
				summary:
					'A comparison of rota sheets and referral slips found that the public staffing total did not show whether the second clinician reached the clinic before a call.',
				authorId: 'vsn-sera-voss',
				body: [
					'The North Hall clinic described a night as staffed when a practitioner accepted the rota. The rota and referral slips do not record the same time: one names a shift, and the other marks when a patient was sent onward.',
					'We compared the schedule with arrival notes kept by the clinic and with the transfer bell record. The documents show that the second practitioner crossed two districts after the last coach connection on several nights. They do not establish how many calls went unanswered.',
					'The clinic says the rota is intended to show assigned coverage rather than response time. That description matches the form, but the public summary did not state the limit. Residents cannot compare two staffing plans from a figure that records only the assignment.',
					'The board will begin recording arrival times in the next review window. It will close the current file with a narrower claim: the rota counted an assignment, not an arrival.',
				],
				closeout:
					'The health board closed this docket by separating assigned coverage from arrival time. The next rota review will begin a new call and arrival record.',
			},
			{
				topic: 'old-lease-index',
				format: 'retrospective',
				title:
					'The lease archive adds a dated address link without erasing old copies',
				summary:
					'Vesper Steps will link each old lease to a current address note while preserving the amendment dates and original wording.',
				authorId: 'vsn-lucien-vale',
				body: [
					'The first housing archive copy at Vesper Steps used an address that has since been renumbered. Later amendments changed the room reference, but the public index did not link the old form to the current street board.',
					'The archive reviewed leases, amendment leaves and the current register. It found copies with matching names and dates but different address references. That does not change the rights written in a lease; it changes how a resident finds the controlling copy.',
					'The new index will preserve the original language, add a dated current-address note and link the two records. Residents can search by the old stair name without replacing it in the historical file.',
					'This closes the address-link review. A future amendment will be recorded as a new dated note, not silently applied to earlier copies.',
				],
				closeout:
					'The archive committee closed this file by adopting the dated address link while retaining each original copy. The next docket will check the new notice batch.',
			},
			{
				topic: 'late-market-price-board',
				format: 'opinion',
				title: 'A late market price needs the scale method beside it',
				summary:
					'Buyers should be able to compare late and early prices without guessing which scale produced the number.',
				authorId: 'vsn-adrian-veil',
				body: [
					'A price board is useful only when it says what was measured. At South Arch, late sellers use a second scale after the day market closes. Both scales are certified, but a buyer cannot compare their totals if the board hides which one was used.',
					'Sellers are right that the late scale is tested. Buyers are right that certification alone does not make two methods interchangeable. The market should publish the scale mark with the price and keep the older record available for comparison.',
					'This is a small change with a public benefit. A shared method note lets a buyer ask a precise question and lets a seller challenge an incorrect conversion with a record in hand.',
					'The market office should add paired scale readings before the next late-season window. It can close the file after the method appears beside the price, not merely in an office ledger.',
				],
				closeout:
					'The market board closed this review by adding the scale method beside each posted price. The next window will compare buyer slips with the paired readings.',
			},
		],
		steps: [
			'a new review window opens with a current date and a named record keeper',
			'the clerk matches the current rule to the dated amendment and public notice',
			'a site visit checks the service during the hours residents use it',
			'residents and workers submit accounts before the hearing closes',
			'a second office compares arrival, service and publication times',
			'the board publishes options with the people and dates affected stated clearly',
			'a limited schedule trial begins with a public end date',
			'the council records a decision for this window and its reason',
			'the service board posts the result and its first operating date',
			'the clerk closes this file and opens the next window with a new date',
		],
		outcomes: [
			'approved a short trial with an end date and public review',
			'retained the current schedule and published the records supporting it',
			'adopted an amended service interval for the next window',
			'approved a limited exception with a posted access route',
			'closed the file after two records confirmed the same service interval',
			'sent a separate date question to a new hearing without reopening this file',
		],
	},
};

const pad = (value: number, width: number): string =>
	String(value).padStart(width, '0');

function formatOrdinal(value: number): string {
	const ordinals = ['first', 'second', 'third', 'fourth', 'fifth'];
	return ordinals[value - 1] ?? String(value);
}

const headlinePatterns: Record<Format, string[]> = {
	opinion: [
		'Opinion: the case for a review date on {title}',
		'Who carries the cost of {title}?',
		'A public rule for {title} should show its exceptions',
		'Why the {title} measure needs a second count',
		'Keep the next {title} decision open to residents',
	],
	feature: [
		'A shift at {place} follows the {title} file',
		'The people who keep {title} in motion',
		'At {place}, a public record meets daily work',
		'The route behind {title}',
		'After the bell at {place}',
	],
	investigation: [
		'The missing entry in the {title} file',
		'A second look at the records behind {title}',
		'What the public count leaves out of {title}',
		'Two records disagree on {title}',
		'Following the figures in the {title} review',
	],
	reporting: [
		'{title}: the latest review sets a new date',
		'The board advances {title} with a limited trial',
		'{title}: what changed in the latest count',
		'The next test for {title} moves to {place}',
		'{title} returns to the public table',
	],
	interview: [
		'{principal} on what the {title} record can prove',
		'Five questions for {principal} about {title}',
		'At the table with {principal}, keeper of the {title} file',
		'{principal} explains the unresolved {title} measure',
		'What {principal} wants the next {title} count to show',
	],
	explainer: [
		'How the {title} rule works and where it stops',
		'What residents need to know about {title}',
		'The record, rule and open question in {title}',
		'Why two totals matter in the {title} file',
		'{title}, explained from the source register up',
	],
	retrospective: [
		'{title}: what changed after the first notice',
		'A review window of records on {title}',
		'The {title} decision measured against its first promise',
		'From first mark to closeout: the {title} timeline',
		'What the city learned from this {title} file',
	],
	briefing: [
		'{title}: status, next date and open questions',
		'The {title} file in five points',
		'What is confirmed and still unsettled in {title}',
		'{title}: figures behind the next vote',
		'A short guide to the {title} docket',
	],
	narrative: [
		'At {place}, the next mark matters',
		'The quiet check before the crew enters {place}',
		'One shift, two counts and the {title} question',
		'The line on the slate at {place}',
		'Before the bell: a day inside {title}',
	],
	breaking: [
		'Update: the {title} review reaches a new step',
		'{title}: the latest confirmed change',
		'New finding in the {title} file; a wider question remains',
		'Breaking: {principal} reports a new {title} check',
		'{title} docket advances; the next test is pending',
	],
};

function storyName(story: BeatDraft): string {
	return story.title.replace(/^(?:the|a|an)\s+/i, '').toLowerCase();
}

function sentence(value: string): string {
	const start = value.charAt(0).toUpperCase() + value.slice(1).trim();
	return /[.!?]$/.test(start) ? start : `${start}.`;
}

function ordinalDate(ordinal: number): string {
	const base = Date.UTC(2032, 0, 1, 8, 0, 0);
	return new Date(base + ordinal * 2 * 60 * 60 * 1000).toISOString();
}

function generateSummary(
	format: Format,
	story: BeatDraft,
	season: string,
	windowLabel: string,
	measure: number,
	step: string,
	outcome: string,
	stepIndex: number,
): string {
	switch (format) {
		case 'opinion':
			return stepIndex >= 7
				? `The ${storyName(story)} file compares ${measure} ${story.measure} with the conditions at ${story.place}. The board has recorded that it ${outcome}.`
				: `The ${storyName(story)} file compares ${measure} ${story.measure} with the conditions at ${story.place}. This ${windowLabel}, the city must decide whether the current rule can be checked by the people it affects.`;
		case 'feature':
			return `At ${story.place}, ${story.principal} shows how the ${season} routine shapes the ${storyName(story)} and the residents who use it.`;
		case 'investigation':
			return `A review of ${story.record} finds what the ${windowLabel} count can establish and what remains outside the public summary.`;
		case 'reporting':
			return stepIndex >= 7
				? `${sentence(step)} The board records the outcome that it ${outcome}.`
				: `${sentence(step)} The existing arrangement remains in force until the board publishes its outcome.`;
		case 'interview':
			return `${story.principal}, ${story.role}, explains why the latest ${measure} ${story.measure} do not settle the question at ${story.place}.`;
		case 'explainer':
			return `How ${story.record} supports the rule at ${story.place}, what the latest count measures and what remains in this review.`;
		case 'retrospective':
			return stepIndex >= 7
				? `The ${windowLabel} file compares ${story.record} with the previous window and records the outcome for this review.`
				: `The ${windowLabel} file compares ${story.record} with the previous window and records what changes before closeout.`;
		case 'briefing':
			return `A dated status note on ${storyName(story)}: the count, the disagreement, ${stepIndex >= 7 ? `the outcome that it ${outcome}` : 'the open decision'} and the next review date.`;
		case 'narrative':
			return `A shift at ${story.place} follows ${story.principal} from the first entry to the close of the ${windowLabel} file.`;
		case 'breaking':
			return stepIndex >= 7
				? `The latest confirmed update is that ${step}. The board outcome for this window is that it ${outcome}.`
				: `The latest confirmed update is that ${step}. The board has not yet published an outcome for this window.`;
	}
}

function composeBody(
	format: Format,
	story: BeatDraft,
	profile: Profile,
	writer: SisterAuthor,
	cycle: number,
	windowLabel: string,
	season: string,
	count: number,
	previous: number,
	step: string,
	outcome: string,
	closing: boolean,
): string[] {
	const recordComparison = `The ${story.record} lists ${count} ${story.measure}; the previous window lists ${previous}. ${writer.name} checked both against ${writer.method}.`;
	const conflict = sentence(story.dispute);
	const condition =
		story.detail.charAt(0).toLowerCase() + story.detail.slice(1);
	const stage = sentence(step);
	const stepIndex = cycle % 10;
	const docketState =
		stepIndex < 7
			? `The ${windowLabel} file remains open for its scheduled decision. ${sentence(story.next)}`
			: stepIndex === 7
				? `The board recorded the outcome that it ${outcome}.`
				: stepIndex === 8
					? `The responsible office has begun the follow-up set by the board, which ${outcome}.`
					: `The board closed this docket after it ${outcome}. The next window starts with a fresh record.`;

	switch (format) {
		case 'opinion':
			return [
				`A decision on the ${storyName(story)} should be judged at ${story.place}, where the rule changes an ordinary route, shift or service. ${profile.voice.charAt(0).toUpperCase()}${profile.voice.slice(1)}. The current file is the ${windowLabel} review, not a permanent settlement of every future case.`,
				`${recordComparison} The difference matters because ${story.stake}.`,
				`${conflict} Those objections deserve a clear answer. They are not a reason to keep an uncheckable rule simply because its wording is familiar.`,
				`A useful decision names who will do the work, which count will change and when the result comes back to the public table. In this case, ${condition}.`,
				`${docketState}`,
			];
		case 'feature':
			return [
				`At ${story.place}, ${story.principal} puts ${story.record} beside ${condition}. The detail is easy to miss in a summary, but it determines whether a posted rule describes the place people actually use.`,
				`${story.principal} is the ${story.role}. On this ${season} visit, the work begins with a dated entry and ends with a second check from someone who did not make the first one.`,
				`${recordComparison} The number is one part of a larger handoff between the office, the people who use the service and the staff expected to maintain it.`,
				`${conflict} Residents and workers have asked the clerk to keep their accounts beside the source count rather than turn them into a single average.`,
				`${stage} ${docketState}`,
			];
		case 'investigation':
			return [
				`A review of ${story.record} finds a gap between the total in the public summary and the conditions recorded at ${story.place}. The difference does not prove that anyone misstated the file. It shows what the public count leaves out: ${condition}.`,
				`${recordComparison} The source was checked against a second copy held by ${story.principal}. No dated correction to either copy was present when the comparison closed.`,
				`${conflict} The office has not supplied a separate measure that would settle the disagreement, so the two explanations remain competing accounts.`,
				`This report supports a narrower finding: the count is repeatable, but it is not enough to decide ${story.stake}.`,
				`${stage} ${docketState}`,
			];
		case 'reporting':
			return [
				`The ${windowLabel} review of the ${storyName(story)} reached a new step at ${story.place}. ${stage} ${docketState}`,
				`${story.principal}, ${story.role}, said the latest file records ${count} ${story.measure}. The preceding window recorded ${previous}; the figures cover entries on the register, not every condition at the site.`,
				`${conflict} At the latest public meeting, residents asked the clerk to keep their account beside the source count.`,
				`${recordComparison} The next measurement is assigned to a second office and will be published with its method.`,
				`${docketState}`,
			];
		case 'interview':
			return [
				`Q: What changed in the ${windowLabel} file?\n${story.principal}: ${stage} That changes what is in the record; it does not automatically change the rule.`,
				`Q: Which evidence should residents read first?\n${story.principal}: ${story.record}. This window records ${count} ${story.measure}; the previous window records ${previous}. The dates and the method matter as much as the total.`,
				`Q: Why is the disagreement still open?\n${story.principal}: ${story.dispute} Both accounts describe a different part of ${story.place}.`,
				`Q: What happens at closeout?\n${story.principal}: ${closing ? docketState : `The next step is ${sentence(story.next)}`}`,
				`Q: What should the public not assume?\n${story.principal}: That one window answers every future case. A new file starts with a new date and a new count.`,
			];
		case 'explainer':
			return [
				`Start with ${story.record}. It is the source used to decide ${story.stake}; it is not the decision itself. The rule only works if the source describes conditions at ${story.place}.`,
				`Known: the current file counts ${count} ${story.measure}, compared with ${previous} in the prior window. ${stage} The entries have dates and a named clerk.`,
				`Disputed: ${story.dispute} One side emphasizes the posted total; the other points to ${condition}.`,
				`Why it matters: the decision determines which residents can rely on the service and which staff must carry out the change. The file does not settle that by itself.`,
				`Next: ${docketState}`,
			];
		case 'retrospective':
			return [
				`The first file on the ${storyName(story)} began with ${story.record}. The city then checked the source, heard affected residents and sent a second office to repeat the count.`,
				`The current ${windowLabel} file records ${count} ${story.measure}; the previous window records ${previous}. The longer sequence makes the change visible, while each count remains tied to its own dates.`,
				`A turning point was the observation that ${condition}. It narrowed the discussion from a general claim to a question about how the rule works at the site.`,
				`${conflict} The shared record is larger than it was at the start, although the parties still assign it different weight.`,
				`${stage} ${docketState}`,
			];
		case 'briefing':
			return [
				`STATUS: ${stage} ${closing ? docketState : `The current arrangement remains in place at ${story.place}.`}`,
				`RECORD: ${story.record}. The count is ${count} ${story.measure}; the prior window recorded ${previous}.`,
				`DISPUTE: ${conflict}`,
				`OUTCOME: ${closing ? `The board ${outcome}.` : 'The hearing is still open and no permanent rule has changed.'}`,
				`NEXT: ${docketState}`,
			];
		case 'narrative':
			return [
				`${story.principal} opens ${story.record} at ${story.place}. Before anyone changes a mark, the crew checks ${condition}. The ${season} period sets the pace of the work.`,
				`The page holds ${count} ${story.measure}. ${story.principal} reads the preceding count, ${previous}, before the next line is entered. A number without a date would not tell the next crew what changed.`,
				`${conflict} Here the difference is visible between the posted rule and the route, service or shift just beyond the door.`,
				`${stage} ${docketState}`,
				`The shift closes with the source page attached to the board. The next file uses a new date and scope.`,
			];
		case 'breaking':
			return [
				`The latest confirmed development in the ${storyName(story)} is that ${step}. The update comes from ${story.place}; ${closing ? `the board outcome is that it ${outcome}.` : 'the existing arrangement remains in force until the board closes this window.'}`,
				`${story.principal}, ${story.role}, confirmed ${count} ${story.measure} in the file. The previous window recorded ${previous}; the totals do not settle ${story.stake}.`,
				`The unresolved point is specific: ${conflict} ${closing ? `The board has recorded that it ${outcome}.` : 'No final outcome has been posted before the scheduled decision.'}`,
				`${closing ? `The current action follows the board outcome that it ${outcome}.` : 'Residents and staff continue under the current schedule while the review is open.'}`,
				`NEXT UPDATE: ${docketState} A fresh window will use a new date and source record.`,
			];
	}
}

function createGeneratedArticle(
	publication: Publication,
	profile: Profile,
	story: ResolvedBeat,
	storyIndex: number,
	cycle: number,
	format: Format,
	publishedAt: string,
): Article {
	const docket = Math.floor(cycle / 10) + 1;
	const stepIndex = cycle % 10;
	const year = Math.floor((docket - 1) / 12) + 1;
	const seasonIndex = Math.floor(((docket - 1) % 12) / 3);
	const season = profile.seasons[seasonIndex];
	const windowInSeason = ((docket - 1) % 3) + 1;
	const windowLabel = `Year ${formatOrdinal(year)}, ${season} window ${windowInSeason}`;
	const outcome =
		profile.outcomes[(storyIndex + docket * 3) % profile.outcomes.length];
	const closing = stepIndex >= 7;
	const step = profile.steps[stepIndex];
	const writer =
		profile.staff[(storyIndex * 3 + docket + FORMATS.indexOf(format)) % 4];
	const count = 17 + ((storyIndex * 23 + docket * 19 + cycle * 7) % 83);
	const previous = Math.max(3, count + ((storyIndex + docket) % 13) - 6);
	const subject = story.title.replace(/^(?:the|a|an)\s+/i, '');
	const headlineVariant = (storyIndex * 2 + docket * 7 + stepIndex) % 5;
	const headline = headlinePatterns[format][headlineVariant]
		.replaceAll('{title}', subject)
		.replaceAll('{place}', story.place)
		.replaceAll('{principal}', story.principal);
	const id = `${publication.key}-${story.topic}-c${pad(cycle + 1, 3)}-${format}`;
	const article: Article = {
		id,
		slug: id,
		title: `${headline} (${windowLabel})`,
		summary: generateSummary(
			format,
			story,
			season,
			windowLabel,
			count,
			step,
			outcome,
			stepIndex,
		),
		body: composeBody(
			format,
			story,
			profile,
			writer,
			cycle,
			windowLabel,
			season,
			count,
			previous,
			step,
			outcome,
			closing,
		),
		section: story.section,
		format,
		authorId: writer.id,
		publishedAt,
		topic: story.topic,
		seriesId: story.seriesId,
		relatedIds: [],
	};
	if (format === 'breaking' && cycle % 11 === 4) {
		article.updatedAt = new Date(
			Date.parse(publishedAt) + 55 * 60 * 1000,
		).toISOString();
	}
	if (cycle % 20 === storyIndex % 20) {
		article.image = {
			src: `/images/qsn/${publication.hero}.png`,
			alt: `A city view of ${profile.city}, the setting for reporting on ${subject}.`,
			caption: `The ${story.place} area of ${profile.city}. This ${season} file follows ${story.title.toLowerCase()} through a dated public review.`,
		};
	}
	return article;
}

function createSpotlightArticle(
	publication: Publication,
	story: ResolvedBeat,
	spotlight: SpotlightDraft,
	publishedAt: string,
): Article {
	const id = `${publication.key}-spotlight-${story.topic}`;
	return {
		id,
		slug: id,
		title: spotlight.title,
		summary: spotlight.summary,
		body: [...spotlight.body, spotlight.closeout],
		section: story.section,
		format: spotlight.format,
		authorId: spotlight.authorId,
		publishedAt,
		topic: story.topic,
		seriesId: story.seriesId,
		relatedIds: [],
	};
}

export function createSisterDataset(publication: Publication): SisterDataset {
	const profile = PROFILES[publication.id];
	if (
		!profile ||
		profile.publicationId !== publication.id ||
		profile.key !== publication.key
	) {
		throw new Error(`No sister corpus is configured for ${publication.id}.`);
	}
	const stories: ResolvedBeat[] = profile.desks.flatMap((desk) =>
		desk.stories.map((story) => ({
			...story,
			section: desk.section,
			seriesId: `${publication.key}-${desk.series.slug}`,
		})),
	);
	if (stories.length !== 30 || publication.articleCount !== 18_000) {
		throw new Error(
			`The ${publication.shortName} fixture must contain 18,000 articles across 30 story beats.`,
		);
	}
	const spotlightByTopic = new Map(
		profile.spotlights.map((spotlight) => [spotlight.topic, spotlight]),
	);
	const output: Article[] = [];
	const cycleById = new Map<string, number>();
	for (let cycle = 0; cycle < 600; cycle += 1) {
		for (let position = 0; position < stories.length; position += 1) {
			const storyIndex = (position * 7 + cycle * 13) % stories.length;
			const story = stories[storyIndex];
			const format = FORMATS[(storyIndex + cycle) % FORMATS.length];
			const spotlight =
				cycle === 599 ? spotlightByTopic.get(story.topic) : undefined;
			const publishedAt = ordinalDate(output.length);
			const article = spotlight
				? createSpotlightArticle(publication, story, spotlight, publishedAt)
				: createGeneratedArticle(
						publication,
						profile,
						story,
						storyIndex,
						cycle,
						format,
						publishedAt,
					);
			if (!article.image && (spotlight || cycle % 20 === storyIndex % 20)) {
				const docket = Math.floor(cycle / 10) + 1;
				const season = profile.seasons[Math.floor(((docket - 1) % 12) / 3)];
				const visual = sectionArtwork(publication, story.section);
				article.image = {
					src: visual.src,
					alt: visual.alt,
					caption: `${visual.caption} Illustration for the ${season} reporting from ${profile.city}.`,
				};
			}
			output.push(article);
			cycleById.set(article.id, cycle);
		}
	}

	const byTopic = new Map<string, Article[]>();
	const bySeriesWindow = new Map<string, Article[]>();
	for (const article of output) {
		const topicArticles = byTopic.get(article.topic) ?? [];
		topicArticles.push(article);
		byTopic.set(article.topic, topicArticles);
		if (article.seriesId) {
			const docket = Math.floor((cycleById.get(article.id) ?? 0) / 10) + 1;
			const key = `${article.seriesId}:${docket}`;
			const windowArticles = bySeriesWindow.get(key) ?? [];
			windowArticles.push(article);
			bySeriesWindow.set(key, windowArticles);
		}
	}

	for (const article of output) {
		const topicArticles = byTopic.get(article.topic) ?? [];
		const topicPosition = topicArticles.indexOf(article);
		const related = [
			topicArticles[topicPosition - 1],
			topicArticles[topicPosition + 1],
		]
			.filter((candidate): candidate is Article => candidate !== undefined)
			.map((candidate) => candidate.id);
		const cycle = cycleById.get(article.id) ?? 0;
		const docket = Math.floor(cycle / 10) + 1;
		const sameSeriesWindow = article.seriesId
			? (bySeriesWindow.get(`${article.seriesId}:${docket}`) ?? [])
			: [];
		const seriesNeighbor = sameSeriesWindow.find(
			(candidate) => candidate.id !== article.id,
		);
		if (seriesNeighbor && !related.includes(seriesNeighbor.id)) {
			related.push(seriesNeighbor.id);
		}
		article.relatedIds = related;
	}

	const authors: Author[] = profile.staff.map(({ id, name, bio, beat }) => ({
		id,
		name,
		bio,
		beat,
	}));
	const series: Series[] = profile.desks.map((desk) => ({
		id: `${publication.key}-${desk.series.slug}`,
		title: desk.series.title,
		description: desk.series.description,
	}));
	const articleById = new Map<string, Article>(
		output.map((article) => [article.id, article]),
	);
	const sections = [...new Set(profile.desks.map((desk) => desk.section))];
	return {
		articles: output,
		authors,
		series,
		sections,
		getArticle: (id: string) => articleById.get(id),
	};
}
