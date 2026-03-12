export interface ArticleMeta {
  id: string;
  category: string;
  published: string;
  updated?: string;
  headline: string;
  author: string;
  byline: string;
  tags: string[];
  image: string;
  imageCaption: string;
  imageCredit: string;
  excerpt: string;
  breaking?: boolean;
}

export const categories = ['Politics', 'Crime', 'Economy', 'Culture', 'Sports', 'Weather'] as const;

export const reporters = [
  { name: 'Urist McReporter', title: 'Senior Correspondent', beat: 'Politics', email: 'urist.mcreporter@herald.mh' },
  { name: 'Bomrek Hammerfall', title: 'Staff Reporter', beat: 'Crime & Sports', email: 'bomrek.hammerfall@herald.mh' },
  { name: 'Rigoth Gemcutter', title: 'Economics Correspondent', beat: 'Economy', email: 'rigoth.gemcutter@herald.mh' },
  { name: 'Fikod Silentstone', title: 'Arts & Culture Reporter', beat: 'Culture', email: 'fikod.silentstone@herald.mh' },
  { name: 'Zulban Tunnelworks', title: 'Science Correspondent', beat: 'Weather', email: 'zulban.tunnelworks@herald.mh' },
  { name: 'Morul Chiselmark', title: 'Editor-in-Chief', beat: 'All Sections', email: 'editor@herald.mh' },
];

export const articles: ArticleMeta[] = [
  {
    id: 'MHH-001',
    category: 'Politics',
    published: '2026-01-01T08:15:00',
    headline: 'Arcane Council Votes 7-2 to Expand Magma Infrastructure Eastward',
    author: 'Urist McReporter',
    byline: 'Senior Correspondent, Politics Desk',
    tags: ['Arcane Council', 'Magma Infrastructure', 'East Expansion', 'Public Works'],
    image: 'https://picsum.photos/seed/mhh001/580/320',
    imageCaption: 'Council members deliberate in the Arcane Chamber during Thursday\'s vote on the Magma Infrastructure bill.',
    imageCredit: 'Herald Archive / Staff',
    excerpt: 'The Arcane Council voted 7-2 to approve the Eastern Magma Infrastructure Expansion Act, authorising the Bureau of Deep Works to extend the main magma channel network 340 z-meters eastward into the Granite Flats sector. Construction to cost an estimated 14,000 Gold Sovereigns over four seasons.',
  },
  {
    id: 'MHH-002',
    category: 'Crime',
    published: '2026-01-08T11:42:00',
    headline: 'Fortress Guard Arrest Three in Trophy Hall Gem-Skimming Scheme',
    author: 'Bomrek Hammerfall',
    byline: 'Staff Reporter, Crime Desk',
    tags: ['Fortress Guard', 'Gem Theft', 'Trophy Hall', 'Arrest'],
    image: 'https://picsum.photos/seed/mhh002/580/320',
    imageCaption: 'The Grand Trophy Hall on Z-Level 14, where investigators say at least 94 carats of gemstones were substituted.',
    imageCredit: 'Fortress Guard / Public Affairs',
    excerpt: 'Three dwarves arrested in connection with an alleged gem-skimming operation at the Grand Trophy Hall. An estimated 80 to 120 carats of raw emerald and sapphire diverted over six months through inventory substitution scheme.',
  },
  {
    id: 'MHH-003',
    category: 'Economy',
    published: '2026-01-14T09:30:00',
    headline: 'Dwarven Iron Guild Reports Record Smelting Output for Fifth Consecutive Season',
    author: 'Rigoth Gemcutter',
    byline: 'Economics Correspondent',
    tags: ['Dwarven Iron Guild', 'Smelting', 'Production Record', 'Economy'],
    image: 'https://picsum.photos/seed/mhh003/580/320',
    imageCaption: 'Iron ingots stacked for transport at the Koganusan Processing Complex on Z-Level 72.',
    imageCredit: 'Dwarven Iron Guild / Press Office',
    excerpt: 'The Dwarven Iron Guild produced 48,200 iron ingots last season, up 6.4 per cent. Spot price falling from 12 GP to 10.5 GP per ingot as expanded ore access from new Z-Level 60\u201380 shafts drives sustained output growth.',
  },
  {
    id: 'MHH-004',
    category: 'Culture',
    published: '2026-01-20T19:15:00',
    headline: "Mountainhome Bard's Troupe Premieres 'The Ballad of Boatmurdered'",
    author: 'Fikod Silentstone',
    byline: 'Arts & Culture Reporter',
    tags: ['Bard Troupe', 'Boatmurdered', 'Theatre', 'Performance', 'Culture'],
    image: 'https://picsum.photos/seed/mhh004/580/320',
    imageCaption: 'The ensemble cast takes a curtain call after Monday\'s premiere at the Grand Amphitheatre.',
    imageCredit: 'Fikod Silentstone / Herald Arts',
    excerpt: 'Three-hour production chronicles the legendary fall of Boatmurdered Fortress using recently declassified historical records. Near-capacity crowd of 320 at the Grand Amphitheatre gives extended standing ovation. Runs through end of month.',
  },
  {
    id: 'MHH-005',
    category: 'Weather',
    published: '2026-01-23T14:08:00',
    updated: '2026-01-25T09:00:00',
    headline: "Geomancer's Office Issues Seismic Advisory for Z-Level 45",
    author: 'Zulban Tunnelworks',
    byline: 'Science Correspondent',
    tags: ['Geomancer', 'Seismic', 'Z-Level 45', 'Safety Advisory'],
    image: 'https://picsum.photos/seed/mhh005/580/320',
    imageCaption: 'Monitoring station 45-C, one of two stations that flagged anomalous tectonic stress readings.',
    imageCredit: 'Bureau of Deep Works',
    excerpt: 'Level 2 (Elevated Concern) seismic advisory issued for Z-Level 45 and adjacent corridors after anomalous tectonic stress readings detected at monitoring stations 45-C and 45-D. Approximately 1,200 dwarves affected. No evacuation recommended at this time.',
  },
  {
    id: 'MHH-006',
    category: 'Politics',
    published: '2026-02-02T10:22:00',
    headline: 'Goblin Diplomatic Envoy Expelled After Alleged Theft of Council Minutes',
    author: 'Urist McReporter',
    byline: 'Senior Correspondent, Politics Desk',
    tags: ['Goblin Diplomacy', 'Arcane Council', 'Espionage', 'Foreign Relations'],
    image: 'https://picsum.photos/seed/mhh006/580/320',
    imageCaption: 'The Upper Gate checkpoint where Fortress Guard inspectors intercepted the sealed documents.',
    imageCredit: 'Herald Staff',
    excerpt: 'Goblin envoy Snatchtooth the Mild expelled after sealed Arcane Council session minutes found in his diplomatic pouch during routine Upper Gate inspection. Truce negotiations with Goblin Confederation suspended indefinitely.',
  },
  {
    id: 'MHH-007',
    category: 'Sports',
    published: '2026-02-05T16:45:00',
    headline: 'Mountainhome Wrestlers Triumph at Z-Level Games',
    author: 'Bomrek Hammerfall',
    byline: 'Staff Reporter, Sports Desk',
    tags: ['Wrestling', 'Z-Level Games', 'Sports', 'Mountainhome'],
    image: 'https://picsum.photos/seed/mhh007/580/320',
    imageCaption: 'Avar Ironhand celebrates his twelfth Z-Level Games heavyweight victory at the Grand Arena.',
    imageCredit: 'Bomrek Hammerfall / Herald Sports',
    excerpt: 'Mountainhome sweeps four of six wrestling weight classes at the annual Z-Level Games. Avar Ironhand takes Heavyweight and Dumed Stoneback becomes youngest Middleweight champion since Year 298. Crowd of 540 at the Grand Arena.',
  },
  {
    id: 'MHH-008',
    category: 'Crime',
    published: '2026-02-11T13:30:00',
    headline: 'Headshoots LLC Faces Civil Suit Over Catapult Safety Logs',
    author: 'Bomrek Hammerfall',
    byline: 'Staff Reporter, Crime Desk',
    tags: ['Headshoots LLC', 'Catapult', 'Civil Suit', 'Safety', 'Legal'],
    image: 'https://picsum.photos/seed/mhh008/580/320',
    imageCaption: 'The Eastern Rampart catapult battery, where the Year 311 malfunction injured five crew members.',
    imageCredit: 'Herald Archive',
    excerpt: 'Fortress\u2019s largest siege equipment contractor sued over alleged failure to maintain safety inspection logs for the Eastern Rampart battery. Five dwarves injured in Year 311 catapult malfunction. Headshoots LLC denies allegations, cites misfiled records.',
  },
  {
    id: 'MHH-009',
    category: 'Economy',
    published: '2026-02-17T08:55:00',
    headline: 'Armok Holdings LLC Acquires Three Magma Sea Sector Parcels',
    author: 'Rigoth Gemcutter',
    byline: 'Economics Correspondent',
    tags: ['Armok Holdings', 'Magma Sea', 'Real Estate', 'Acquisition', 'Economy'],
    image: 'https://picsum.photos/seed/mhh009/580/320',
    imageCaption: 'The Magma Sea Sector at Z-Level 114, where Armok Holdings acquired three industrial parcels.',
    imageCredit: 'Bureau of Deep Works / Survey Division',
    excerpt: 'Three commercial-industrial parcels at Z-Level 114 acquired from Fungiwood Trust, Steelthunder Clan, and an undisclosed seller for approximately 48,000 Gold Sovereigns. Armok Holdings to expand refined-metal production capacity.',
  },
  {
    id: 'MHH-010',
    category: 'Culture',
    published: '2026-02-21T10:00:00',
    headline: "Grand Duchy Museum Unveils 'Forgotten Beast Collection'",
    author: 'Fikod Silentstone',
    byline: 'Arts & Culture Reporter',
    tags: ['Grand Duchy Museum', 'Forgotten Beasts', 'Exhibition', 'Culture', 'History'],
    image: 'https://picsum.photos/seed/mhh010/580/320',
    imageCaption: 'The near-complete skeleton of Ozan Moltenwing, centrepiece of the new Forgotten Beast Collection.',
    imageCredit: 'Grand Duchy Museum / Exhibition Department',
    excerpt: 'New permanent exhibition on Z-Level 4 presents remains and artefacts from 31 Forgotten Beast encounters since Year 42. Over 800 dwarves attend opening day. Interactive rune-displays cross-reference Registry of Deeds filings.',
  },
  {
    id: 'MHH-011',
    category: 'Weather',
    published: '2026-02-25T15:20:00',
    updated: '2026-03-01T16:00:00',
    headline: 'Surface Trade Route Closure Extended Through Mid-March',
    author: 'Zulban Tunnelworks',
    byline: 'Science Correspondent',
    tags: ['Trade Route', 'Surface Closure', 'Weather', 'Supply Chain'],
    image: 'https://picsum.photos/seed/mhh011/580/320',
    imageCaption: 'Snow accumulation on the primary surface trade route near the Outer Surface Zone.',
    imageCredit: 'Bureau of Surface Commerce',
    excerpt: 'Primary route to Elven Forest Trading Post remains closed due to blizzard conditions and goblin raiding. Prices for timber, surface grain, and elf cloth rising. Bureau seeking alternative supply channels through mountain passes.',
  },
  {
    id: 'MHH-012',
    category: 'Politics',
    published: '2026-03-02T11:10:00',
    headline: 'Arcane Council Debates Mandatory Literacy Rune Testing',
    author: 'Urist McReporter',
    byline: 'Senior Correspondent, Politics Desk',
    tags: ['Arcane Council', 'Literacy', 'Rune Testing', 'Education Policy'],
    image: 'https://picsum.photos/seed/mhh012/580/320',
    imageCaption: 'Councillor Stonesinger (left) and Councillor Deepvein (right) exchange remarks during Monday\'s debate.',
    imageCredit: 'Herald Staff / Politics Desk',
    excerpt: 'Proposal to require standardised literacy rune examinations for all civic position applicants draws sharp debate. Supporters cite operational safety; opponents call it an unfair barrier to apprenticeship-trained dwarves. Referred to committee.',
  },
  {
    id: 'MHH-013',
    category: 'Crime',
    published: '2026-03-06T17:35:00',
    headline: 'Rune-Wire Fraud Ring Dismantled; 12 Arrested',
    author: 'Bomrek Hammerfall',
    byline: 'Staff Reporter, Crime Desk',
    tags: ['Rune-Wire Fraud', 'Arrest', 'Fortress Guard', 'Financial Crime'],
    image: 'https://picsum.photos/seed/mhh013/580/320',
    imageCaption: 'Fortress Guard officers at the Z-Level 6 Guard Station following the arrest of 12 suspects.',
    imageCredit: 'Fortress Guard / Public Affairs',
    excerpt: 'Eight-month Operation Hollow Stone dismantles fraud network responsible for 6,200 Gold Sovereigns in losses. Twelve arrested across four z-levels including two former Bureau technicians. At least 47 merchants identified as victims.',
  },
  {
    id: 'MHH-014',
    category: 'Economy',
    published: '2026-03-09T12:48:00',
    headline: 'Plump Helmet Harvest Forecast Slashed 18% After Cave Mold Infestation',
    author: 'Rigoth Gemcutter',
    byline: 'Economics Correspondent',
    tags: ['Plump Helmets', 'Agriculture', 'Cave Mold', 'Food Supply', 'Economy'],
    image: 'https://picsum.photos/seed/mhh014/580/320',
    imageCaption: 'Deeprock Gray Mold visible on plump helmet crops in Growing Sector 9 on Z-Level 25.',
    imageCredit: 'Bureau of Subterranean Agriculture',
    excerpt: 'Aggressive Deeprock Gray Mold infestation in Growing Sectors 7\u201311 forces 18% downward revision in harvest forecast. Strategic reserves sufficient for 14 months. Ale Guild reformulating seasonal batches. Rationing under consideration.',
  },
  {
    id: 'MHH-015',
    category: 'Sports',
    published: '2026-03-11T20:15:00',
    headline: 'Fortress Wrestling League Opens Season; Avar Ironhand Defends Championship',
    author: 'Bomrek Hammerfall',
    byline: 'Staff Reporter, Sports Desk',
    tags: ['Wrestling', 'Fortress Wrestling League', 'Avar Ironhand', 'Season Opener'],
    image: 'https://picsum.photos/seed/mhh015/580/320',
    imageCaption: 'Avar Ironhand raises his fist after retaining the Heavyweight Championship at the Grand Arena.',
    imageCredit: 'Bomrek Hammerfall / Herald Sports',
    excerpt: 'Sold-out season opener at Grand Arena sees Ironhand submit challenger Urist Stoneback in round two to retain Heavyweight title. Newcomer Dumed Rockhammer, 21, impresses with first-round TKO debut. Next event March 25.',
  },
  {
    id: 'MHH-016',
    category: 'Politics',
    published: '2026-03-11T10:30:00',
    updated: '2026-03-11T16:45:00',
    headline: 'Surface Relations Act Passes Second Reading',
    author: 'Urist McReporter',
    byline: 'Senior Correspondent, Politics Desk',
    tags: ['Surface Relations Act', 'Arcane Council', 'Legislation', 'Foreign Policy'],
    image: 'https://picsum.photos/seed/mhh016/580/320',
    imageCaption: 'The Arcane Council chamber during Wednesday\'s 6-3 vote on the Surface Relations Normalisation Act.',
    imageCredit: 'Urist McReporter / Herald Politics',
    excerpt: 'Arcane Council advances most comprehensive surface relations framework in four decades by 6-3 vote. Act would create Bureau of Surface Affairs, establish ambassador designations, and set Upper Gate inspection protocols. Third reading within 30 days.',
    breaking: true,
  },
  {
    id: 'MHH-017',
    category: 'Culture',
    published: '2026-03-11T14:00:00',
    headline: "Goden Boulderback's Platinum Statue Wins Grand Duke's Medal",
    author: 'Fikod Silentstone',
    byline: 'Arts & Culture Reporter',
    tags: ['Goden Boulderback', 'Grand Duke Medal', 'Sculpture', 'Platinum', 'Arts Award'],
    image: 'https://picsum.photos/seed/mhh017/580/320',
    imageCaption: 'Goden Boulderback receives the Grand Duke\'s Medal from Grand Duke Aban the Steadfast.',
    imageCredit: 'Fikod Silentstone / Herald Arts',
    excerpt: 'Master sculptor receives Duchy\'s highest cultural honour for "The Overseer\'s Burden," a 4.2-meter platinum statue cast from a single 840-kilogram block. Twenty-three years in the making. On view in Grand Hall, Z-Level 1.',
  },
  {
    id: 'MHH-018',
    category: 'Crime',
    published: '2026-03-11T01:45:00',
    updated: '2026-03-11T14:30:00',
    headline: 'Z-Level 28 Tavern Brawl Leaves Five Hospitalized',
    author: 'Bomrek Hammerfall',
    byline: 'Staff Reporter, Crime Desk',
    tags: ['Tavern Brawl', 'Z-Level 28', 'Hospitalized', 'Fortress Guard'],
    image: 'https://picsum.photos/seed/mhh018/580/320',
    imageCaption: 'The Cracked Anvil tavern on Z-Level 28 remained closed Thursday following the incident.',
    imageCredit: 'Bomrek Hammerfall / Herald Crime',
    excerpt: 'Late-night brawl at the Cracked Anvil involving at least 15 participants leaves five injured, two seriously. One fractured orbital bone, one dislocated shoulder. Tavern closed pending Guard inspection. Investigation ongoing.',
    breaking: true,
  },
  {
    id: 'MHH-019',
    category: 'Economy',
    published: '2026-03-11T09:15:00',
    headline: 'Steelthunder Clan Files Injunction Against Koganusan Estates LLC',
    author: 'Rigoth Gemcutter',
    byline: 'Economics Correspondent',
    tags: ['Steelthunder Clan', 'Koganusan Estates', 'Injunction', 'Property Dispute', 'Legal'],
    image: 'https://picsum.photos/seed/mhh019/580/320',
    imageCaption: 'The disputed excavation site in the Z-Level 35 Eastern Cavern Network.',
    imageCredit: 'Herald Staff',
    excerpt: 'Emergency injunction seeks to halt Z-Level 35 excavation that allegedly encroaches on 137-year ancestral mineral claim ST-189-EAST. Koganusan Estates says claim expired under Year 302 amendments. Hearing Friday morning.',
    breaking: true,
  },
  {
    id: 'MHH-020',
    category: 'Weather',
    published: '2026-03-11T11:00:00',
    headline: "Geomancer's Annual Report: Year 312 Trending 'Exceptionally Stable'",
    author: 'Zulban Tunnelworks',
    byline: 'Science Correspondent',
    tags: ['Geomancer', 'Annual Report', 'Stability', 'Year 312', 'Forecast'],
    image: 'https://picsum.photos/seed/mhh020/580/320',
    imageCaption: 'Chief Geomancer Zulban Deepstone presents the Year 312 annual stability report.',
    imageCredit: 'Zulban Tunnelworks / Herald Science',
    excerpt: 'Highest stability rating in 14 years. Tectonic stress at lowest quarterly average since Year 298, magma sea pressure in bottom 10% of historical readings. Z-Level 45 advisory and Z-Level 90\u2013100 pressure differential remain on watchlist.',
  },
];

export function getArticleById(id: string): ArticleMeta | undefined {
  return articles.find(a => a.id === id);
}

export function getLatest(n: number = 20): ArticleMeta[] {
  return [...articles]
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, n);
}

export function getByCategory(cat: string): ArticleMeta[] {
  return articles.filter(a => a.category === cat);
}

export function getBreaking(): ArticleMeta[] {
  return articles.filter(a => a.breaking);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return (d.getMonth() + 1).toString().padStart(2, '0') + '/' +
         d.getDate().toString().padStart(2, '0') + '/' +
         d.getFullYear();
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${h12}:${m} ${ampm}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export const categoryBadgeClass: Record<string, string> = {
  Politics: 'statusReview',
  Crime: 'statusPending',
  Economy: 'statusApproved',
  Culture: 'statusReview',
  Sports: 'statusApproved',
  Weather: 'statusPending',
};
