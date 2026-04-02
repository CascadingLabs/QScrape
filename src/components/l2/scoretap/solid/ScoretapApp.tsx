/**
 * @qscrape L2 / solid / scoretap
 * @component ScoretapApp
 */

import type { JSX } from 'solid-js';
import {
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from 'solid-js';
import { fakeGet } from '../../../../data/api';
import type { Game, Match as MatchType } from '../../../../data/scoretap/data';
import {
	cs2Rankings,
	events,
	gameColors,
	gameLabels,
	liveMatches,
	newsItems,
	recentResults,
	teams,
	upcomingMatches,
} from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';
import styles from '../../react/scoretap/ScoretapApp.module.css';

// ── URL routing helpers ──────────────────────────────────────────────────────

function getBase(): string {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}

function pathToPage(): Page {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	if (seg === 'events') {
		return 'events';
	}
	if (seg === 'teams') {
		return 'teams';
	}
	return 'home';
}

function pageToPath(p: Page): string {
	const base = getBase();
	if (p === 'events') {
		return `${base}events`;
	}
	if (p === 'teams') {
		return `${base}teams`;
	}
	return base;
}

type Page = 'home' | 'events' | 'event' | 'teams' | 'team';

function GameTag(props: { game: Game }) {
	return (
		<span
			class={styles.gameTag}
			style={`--game-color: ${gameColors[props.game]}`}
		>
			{gameLabels[props.game]}
		</span>
	);
}

function StatusBadge(props: {
	status: 'live' | 'final' | 'upcoming' | 'completed';
}) {
	return (
		<span class={`${styles.statusBadge} ${styles[`status_${props.status}`]}`}>
			<Show when={props.status === 'live'}>
				<span class={styles.liveDot} />
			</Show>
			{props.status === 'live'
				? 'LIVE'
				: props.status === 'final'
					? 'FINAL'
					: props.status === 'completed'
						? 'ENDED'
						: 'UPCOMING'}
		</span>
	);
}

function MatchCard(props: { match: MatchType; onClick?: () => void }) {
	return (
		<div
			class={`${styles.matchCard} ${props.match.status === 'live' ? styles.matchCardLive : ''}`}
			data-game={props.match.game}
			data-match-id={props.match.id}
			onClick={props.onClick}
			style={props.onClick ? { cursor: 'pointer' } : undefined}
			onKeyDown={
				props.onClick
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								props.onClick!();
							}
						}
					: undefined
			}
		>
			<div class={styles.matchTeam}>
				<span class={styles.teamName}>{props.match.teamA}</span>
				<span class={styles.teamAbbr}>{props.match.teamAFull}</span>
			</div>
			<div class={styles.matchCenter}>
				<div
					class={styles.scoreNums}
					id={`score-${props.match.id}`}
					data-score-a={props.match.scoreA}
					data-score-b={props.match.scoreB}
				>
					{props.match.scoreA}&nbsp;:&nbsp;{props.match.scoreB}
				</div>
				<div class={styles.matchMeta}>
					<Show when={props.match.mapOrGame}>
						<span>{props.match.mapOrGame} · </span>
					</Show>
					<StatusBadge status={props.match.status} />
				</div>
				<div class={styles.matchEvent}>{props.match.event}</div>
				<div class={styles.matchGame}>
					<GameTag game={props.match.game} />
				</div>
			</div>
			<div class={`${styles.matchTeam} ${styles.matchTeamRight}`}>
				<span class={styles.teamName}>{props.match.teamB}</span>
				<span class={styles.teamAbbr}>{props.match.teamBFull}</span>
			</div>
		</div>
	);
}

function ScoretapShell(props: {
	children: JSX.Element;
	activePage: Page;
	activeGame: Game | 'all';
	onNavigate: (page: Page, id?: string) => void;
	onGameChange: (g: Game | 'all') => void;
}) {
	return (
		<div class={styles.shell} data-active-game={props.activeGame}>
			<header class={styles.header}>
				<div class={styles.headerInner}>
					<button
						type="button"
						class={styles.logo}
						onClick={() => props.onNavigate('home')}
					>
						ScoreTap
					</button>
					<nav class={styles.headerNav}>
						<For each={['home', 'events', 'teams'] as Page[]}>
							{(p) => (
								<button
									type="button"
									class={`${styles.navBtn} ${props.activePage === p ? styles.navBtnActive : ''}`}
									onClick={() => props.onNavigate(p)}
								>
									{p.charAt(0).toUpperCase() + p.slice(1)}
								</button>
							)}
						</For>
					</nav>
				</div>
			</header>
			<div class={styles.gameFilter} id="game-filter">
				<For
					each={
						['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'] as (Game | 'all')[]
					}
				>
					{(g) => (
						<button
							type="button"
							class={`${styles.gameTab} ${props.activeGame === g ? styles.gameTabActive : ''}`}
							data-filter={g}
							onClick={() => props.onGameChange(g)}
						>
							{g === 'all' ? 'All Games' : gameLabels[g as Game]}
						</button>
					)}
				</For>
			</div>
			<main class={styles.main}>
				<div class={styles.pageLayout}>{props.children}</div>
			</main>
			<footer class={styles.footer}>
				<div class={styles.footerInner}>
					<p>&copy; 2026 ScoreTap. QScrape L2 Test Site.</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage(props: { activeGame: Game | 'all' }) {
	const [scores, setScores] = createSignal(
		Object.fromEntries(
			liveMatches.map((m) => [m.id, { a: m.scoreA, b: m.scoreB }]),
		),
	);

	const filter = <T extends { game: Game }>(arr: T[]) =>
		props.activeGame === 'all'
			? arr
			: arr.filter((x) => x.game === props.activeGame);

	onMount(() => {
		const caps: Record<string, number> = {
			'match-001': 30,
			'match-002': 30,
			'match-003': 5,
		};
		const interval = setInterval(() => {
			setScores((prev) => {
				const keys = Object.keys(prev);
				const key = keys[Math.floor(Math.random() * keys.length)];
				const side = Math.random() < 0.5 ? 'a' : 'b';
				const cap = caps[key] || 30;
				const cur = prev[key][side];
				if (cur >= cap) {
					return prev;
				}
				return { ...prev, [key]: { ...prev[key], [side]: cur + 1 } };
			});
		}, 8000);
		onCleanup(() => clearInterval(interval));
	});

	return (
		<>
			<div class={styles.mainCol}>
				<section class={styles.widget}>
					<div class={styles.widgetHeader}>
						<h2 class={styles.widgetTitle}>Live Scores</h2>
					</div>
					<For each={filter(liveMatches)}>
						{(m) => (
							<div
								class={`${styles.matchCard} ${styles.matchCardLive}`}
								data-game={m.game}
								data-match-id={m.id}
							>
								<div class={styles.matchTeam}>
									<span class={styles.teamName}>{m.teamA}</span>
									<span class={styles.teamAbbr}>{m.teamAFull}</span>
								</div>
								<div class={styles.matchCenter}>
									<div
										class={styles.scoreNums}
										id={`score-${m.id}`}
										data-score-a={scores()[m.id]?.a}
										data-score-b={scores()[m.id]?.b}
									>
										{scores()[m.id]?.a ?? m.scoreA}&nbsp;:&nbsp;
										{scores()[m.id]?.b ?? m.scoreB}
									</div>
									<div class={styles.matchMeta}>
										{m.mapOrGame} · <StatusBadge status="live" />
									</div>
									<div class={styles.matchEvent}>{m.event}</div>
									<div class={styles.matchGame}>
										<GameTag game={m.game} />
									</div>
								</div>
								<div class={`${styles.matchTeam} ${styles.matchTeamRight}`}>
									<span class={styles.teamName}>{m.teamB}</span>
									<span class={styles.teamAbbr}>{m.teamBFull}</span>
								</div>
							</div>
						)}
					</For>
				</section>
				<section class={styles.widget}>
					<div class={styles.widgetHeader}>
						<h2 class={styles.widgetTitle}>Recent Results</h2>
					</div>
					<For each={filter(recentResults)}>
						{(m) => <MatchCard match={m} />}
					</For>
				</section>
				<section class={styles.widget}>
					<div class={styles.widgetHeader}>
						<h2 class={styles.widgetTitle}>Latest News</h2>
					</div>
					<div class={styles.newsGrid}>
						<For each={filter(newsItems).slice(0, 8)}>
							{(item) => (
								<div class={styles.newsCard} data-game={item.game}>
									<span class={styles.newsHeadline}>{item.headline}</span>
									<div class={styles.newsMeta}>
										<GameTag game={item.game} />
										<span>{item.hoursAgo}h ago</span>
									</div>
								</div>
							)}
						</For>
					</div>
				</section>
			</div>
			<div class={styles.sidebar}>
				<section class={styles.widget}>
					<div class={styles.widgetHeader}>
						<h2 class={styles.widgetTitle}>Upcoming</h2>
					</div>
					<For each={filter(upcomingMatches)}>
						{(m) => (
							<div class={styles.upcomingCard} data-game={m.game}>
								<div>
									<div class={styles.upcomingTeams}>
										{m.teamA} vs {m.teamB}
									</div>
									<div style={{ 'margin-top': '4px' }}>
										<GameTag game={m.game} />
									</div>
								</div>
								<div class={styles.upcomingTime}>
									<StatusBadge status="upcoming" />
									<div style={{ 'margin-top': '4px', 'font-size': '12px' }}>
										{m.time}
									</div>
								</div>
							</div>
						)}
					</For>
				</section>
				<Show when={props.activeGame === 'all' || props.activeGame === 'cs2'}>
					<section class={styles.widget}>
						<div class={styles.widgetHeader}>
							<h2 class={styles.widgetTitle}>CS2 World Rankings</h2>
						</div>
						<For each={cs2Rankings}>
							{(r) => (
								<div class={styles.rankRow}>
									<span class={styles.rankNum}>#{r.rank}</span>
									<span class={styles.rankTeam}>{r.team}</span>
									<span class={styles.rankPts}>
										{r.points.toLocaleString()} pts
									</span>
									<span
										class={`${styles.rankChange} ${styles[`change_${r.change}`]}`}
									>
										{r.change === 'up'
											? `▲${r.delta}`
											: r.change === 'down'
												? `▼${r.delta}`
												: '—'}
									</span>
								</div>
							)}
						</For>
					</section>
				</Show>
				<section class={styles.widget}>
					<div class={styles.widgetHeader}>
						<h2 class={styles.widgetTitle}>Top Events</h2>
					</div>
					<For
						each={filter(events.filter((e) => e.status !== 'completed')).slice(
							0,
							5,
						)}
					>
						{(ev) => (
							<div class={styles.eventRow} data-game={ev.game}>
								<div class={styles.eventName}>{ev.name}</div>
								<div class={styles.eventRight}>
									<GameTag game={ev.game} />
									<div class={styles.eventDates}>{ev.dates}</div>
								</div>
								<StatusBadge
									status={ev.status as 'live' | 'upcoming' | 'completed'}
								/>
							</div>
						)}
					</For>
				</section>
			</div>
		</>
	);
}

function EventsPage(props: {
	activeGame: Game | 'all';
	onGameChange: (g: Game | 'all') => void;
}) {
	const filtered = () =>
		props.activeGame === 'all'
			? events
			: events.filter((e) => e.game === props.activeGame);

	return (
		<div class={styles.fullCol}>
			<h1 class={styles.pageTitle}>Events</h1>
			<div class={styles.filterTabs}>
				<For
					each={
						['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'] as (Game | 'all')[]
					}
				>
					{(g) => (
						<button
							type="button"
							class={`${styles.filterTab} ${props.activeGame === g ? styles.filterTabActive : ''}`}
							onClick={() => props.onGameChange(g)}
							data-game={g === 'all' ? undefined : g}
						>
							{g === 'all' ? 'All' : gameLabels[g as Game]}
						</button>
					)}
				</For>
			</div>
			<div class={styles.eventsTable}>
				<For each={filtered()}>
					{(ev) => (
						<div
							class={styles.eventTableRow}
							data-game={ev.game}
							data-event-id={ev.id}
						>
							<div class={styles.eventTableName}>{ev.name}</div>
							<GameTag game={ev.game} />
							<div class={styles.eventTableDates}>{ev.dates}</div>
							<StatusBadge
								status={ev.status as 'live' | 'upcoming' | 'completed'}
							/>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

function TeamsPage(props: {
	activeGame: Game | 'all';
	onGameChange: (g: Game | 'all') => void;
}) {
	const filtered = () =>
		props.activeGame === 'all'
			? teams
			: teams.filter((t) => t.game === props.activeGame);

	return (
		<div class={styles.fullCol}>
			<h1 class={styles.pageTitle}>Teams</h1>
			<div class={styles.filterTabs}>
				<For
					each={
						['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'] as (Game | 'all')[]
					}
				>
					{(g) => (
						<button
							type="button"
							class={`${styles.filterTab} ${props.activeGame === g ? styles.filterTabActive : ''}`}
							onClick={() => props.onGameChange(g)}
							data-game={g === 'all' ? undefined : g}
						>
							{g === 'all' ? 'All' : gameLabels[g as Game]}
						</button>
					)}
				</For>
			</div>
			<div class={styles.teamsGrid}>
				<For each={filtered()}>
					{(t) => (
						<div class={styles.teamCard} data-team-id={t.id} data-game={t.game}>
							<div class={styles.teamCardName}>{t.name}</div>
							<div class={styles.teamCardAbbr}>{t.abbr}</div>
							<GameTag game={t.game} />
							<Show when={t.rank}>
								<div class={styles.teamCardRank}>
									Rank #{t.rank} · {t.rankPoints?.toLocaleString()} pts
								</div>
							</Show>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

export default function ScoretapApp(props: {
	initialPage?: Page;
	initialId?: string;
}) {
	const [ready, setReady] = createSignal(false);
	const [page, setPage] = createSignal<Page>(props.initialPage || 'home');
	const [activeGame, setActiveGame] = createSignal<Game | 'all'>('all');

	onMount(() => {
		setPage(pathToPage());
		fakeGet(null).then(() => setReady(true));
		const onPop = () => {
			setPage(pathToPage());
			window.scrollTo(0, 0);
		};
		window.addEventListener('popstate', onPop);
		onCleanup(() => window.removeEventListener('popstate', onPop));
	});

	const navigate = (p: Page) => {
		setPage(p);
		history.pushState(null, '', pageToPath(p));
		window.scrollTo(0, 0);
	};

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{
						display: 'flex',
						'align-items': 'center',
						'justify-content': 'center',
						'min-height': '100vh',
						'font-family': 'Inter,system-ui',
						color: '#6b7280',
						background: '#0f1117',
					}}
				>
					Loading…
				</div>
			}
		>
			<ScoretapShell
				activePage={page()}
				activeGame={activeGame()}
				onNavigate={navigate}
				onGameChange={setActiveGame}
			>
				<Switch>
					<Match when={page() === 'home'}>
						<HomePage activeGame={activeGame()} />
					</Match>
					<Match when={page() === 'events'}>
						<EventsPage
							activeGame={activeGame()}
							onGameChange={setActiveGame}
						/>
					</Match>
					<Match when={page() === 'teams'}>
						<TeamsPage activeGame={activeGame()} onGameChange={setActiveGame} />
					</Match>
					<Match when={true}>
						<HomePage activeGame={activeGame()} />
					</Match>
				</Switch>
			</ScoretapShell>
		</Show>
	);
}
