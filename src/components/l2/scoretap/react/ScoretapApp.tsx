/**
 * @qscrape L2 / react / scoretap
 * @component ScoretapApp
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { Game, Match } from '../../../../data/scoretap/data';
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
import styles from './ScoretapApp.module.css';

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

interface ScoretapAppProps {
	initialPage?: Page;
	initialId?: string;
}

function GameTag({ game }: { game: Game }) {
	return (
		<span
			className={styles.gameTag}
			style={{ '--game-color': gameColors[game] } as React.CSSProperties}
		>
			{gameLabels[game]}
		</span>
	);
}

function StatusBadge({
	status,
}: {
	status: 'live' | 'final' | 'upcoming' | 'completed';
}) {
	return (
		<span className={`${styles.statusBadge} ${styles[`status_${status}`]}`}>
			{status === 'live' && <span className={styles.liveDot} />}
			{status === 'live'
				? 'LIVE'
				: status === 'final'
					? 'FINAL'
					: status === 'completed'
						? 'ENDED'
						: 'UPCOMING'}
		</span>
	);
}

function MatchCard({ match, onClick }: { match: Match; onClick?: () => void }) {
	return (
		<div
			className={`${styles.matchCard} ${match.status === 'live' ? styles.matchCardLive : ''}`}
			data-game={match.game}
			data-match-id={match.id}
			onClick={onClick}
			style={{ cursor: onClick ? 'pointer' : undefined }}
			onKeyDown={
				onClick
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								onClick();
							}
						}
					: undefined
			}
		>
			<div className={styles.matchTeam}>
				<span className={styles.teamName}>{match.teamA}</span>
				<span className={styles.teamAbbr}>{match.teamAFull}</span>
			</div>
			<div className={styles.matchCenter}>
				<div
					className={styles.scoreNums}
					id={`score-${match.id}`}
					data-score-a={match.scoreA}
					data-score-b={match.scoreB}
				>
					{match.scoreA}&nbsp;:&nbsp;{match.scoreB}
				</div>
				<div className={styles.matchMeta}>
					{match.mapOrGame && <span>{match.mapOrGame} · </span>}
					<StatusBadge status={match.status} />
				</div>
				<div className={styles.matchEvent}>{match.event}</div>
				<div className={styles.matchGame}>
					<GameTag game={match.game} />
				</div>
			</div>
			<div className={`${styles.matchTeam} ${styles.matchTeamRight}`}>
				<span className={styles.teamName}>{match.teamB}</span>
				<span className={styles.teamAbbr}>{match.teamBFull}</span>
			</div>
		</div>
	);
}

function ScoretapShell({
	children,
	activePage,
	activeGame,
	onNavigate,
	onGameChange,
}: {
	children: React.ReactNode;
	activePage: Page;
	activeGame: Game | 'all';
	onNavigate: (page: Page, id?: string) => void;
	onGameChange: (g: Game | 'all') => void;
}) {
	return (
		<div className={styles.shell} data-active-game={activeGame}>
			<header className={styles.header}>
				<div className={styles.headerInner}>
					<button
						type="button"
						className={styles.logo}
						onClick={() => onNavigate('home')}
					>
						ScoreTap
					</button>
					<nav className={styles.headerNav}>
						{(['home', 'events', 'teams'] as Page[]).map((p) => (
							<button
								type="button"
								key={p}
								className={`${styles.navBtn} ${activePage === p ? styles.navBtnActive : ''}`}
								onClick={() => onNavigate(p)}
							>
								{p.charAt(0).toUpperCase() + p.slice(1)}
							</button>
						))}
					</nav>
				</div>
			</header>

			{/* Game filter */}
			<div className={styles.gameFilter} id="game-filter">
				{(
					['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'] as (Game | 'all')[]
				).map((g) => (
					<button
						type="button"
						key={g}
						className={`${styles.gameTab} ${activeGame === g ? styles.gameTabActive : ''}`}
						data-filter={g}
						onClick={() => onGameChange(g)}
					>
						{g === 'all' ? 'All Games' : gameLabels[g as Game]}
					</button>
				))}
			</div>

			<main className={styles.main}>
				<div className={styles.pageLayout}>{children}</div>
			</main>

			<footer className={styles.footer}>
				<div className={styles.footerInner}>
					<p>&copy; 2026 ScoreTap. QScrape L2 Test Site.</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage({ activeGame }: { activeGame: Game | 'all' }) {
	const [scores, setScores] = useState(() =>
		Object.fromEntries(
			liveMatches.map((m) => [m.id, { a: m.scoreA, b: m.scoreB }]),
		),
	);

	const filter = <T extends { game: Game }>(arr: T[]) =>
		activeGame === 'all' ? arr : arr.filter((x) => x.game === activeGame);

	// Live score ticker
	useEffect(() => {
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
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<div className={styles.mainCol}>
				{/* Live scores */}
				<section className={styles.widget}>
					<div className={styles.widgetHeader}>
						<h2 className={styles.widgetTitle}>Live Scores</h2>
					</div>
					{filter(liveMatches).map((m) => (
						<div
							key={m.id}
							className={`${styles.matchCard} ${styles.matchCardLive}`}
							data-game={m.game}
							data-match-id={m.id}
						>
							<div className={styles.matchTeam}>
								<span className={styles.teamName}>{m.teamA}</span>
								<span className={styles.teamAbbr}>{m.teamAFull}</span>
							</div>
							<div className={styles.matchCenter}>
								<div
									className={styles.scoreNums}
									id={`score-${m.id}`}
									data-score-a={scores[m.id]?.a}
									data-score-b={scores[m.id]?.b}
								>
									{scores[m.id]?.a ?? m.scoreA}&nbsp;:&nbsp;
									{scores[m.id]?.b ?? m.scoreB}
								</div>
								<div className={styles.matchMeta}>
									{m.mapOrGame} · <StatusBadge status="live" />
								</div>
								<div className={styles.matchEvent}>{m.event}</div>
								<div className={styles.matchGame}>
									<GameTag game={m.game} />
								</div>
							</div>
							<div className={`${styles.matchTeam} ${styles.matchTeamRight}`}>
								<span className={styles.teamName}>{m.teamB}</span>
								<span className={styles.teamAbbr}>{m.teamBFull}</span>
							</div>
						</div>
					))}
				</section>

				{/* Recent results */}
				<section className={styles.widget}>
					<div className={styles.widgetHeader}>
						<h2 className={styles.widgetTitle}>Recent Results</h2>
					</div>
					{filter(recentResults).map((m) => (
						<MatchCard key={m.id} match={m} />
					))}
				</section>

				{/* News */}
				<section className={styles.widget}>
					<div className={styles.widgetHeader}>
						<h2 className={styles.widgetTitle}>Latest News</h2>
					</div>
					<div className={styles.newsGrid}>
						{filter(newsItems)
							.slice(0, 8)
							.map((item) => (
								<div
									key={item.id}
									className={styles.newsCard}
									data-game={item.game}
								>
									<span className={styles.newsHeadline}>{item.headline}</span>
									<div className={styles.newsMeta}>
										<GameTag game={item.game} />
										<span>{item.hoursAgo}h ago</span>
									</div>
								</div>
							))}
					</div>
				</section>
			</div>

			<div className={styles.sidebar}>
				{/* Upcoming */}
				<section className={styles.widget}>
					<div className={styles.widgetHeader}>
						<h2 className={styles.widgetTitle}>Upcoming</h2>
					</div>
					{filter(upcomingMatches).map((m) => (
						<div key={m.id} className={styles.upcomingCard} data-game={m.game}>
							<div>
								<div className={styles.upcomingTeams}>
									{m.teamA} vs {m.teamB}
								</div>
								<div style={{ marginTop: 4 }}>
									<GameTag game={m.game} />
								</div>
							</div>
							<div className={styles.upcomingTime}>
								<StatusBadge status="upcoming" />
								<div style={{ marginTop: 4, fontSize: 12 }}>{m.time}</div>
							</div>
						</div>
					))}
				</section>

				{/* CS2 Rankings */}
				{(activeGame === 'all' || activeGame === 'cs2') && (
					<section className={styles.widget}>
						<div className={styles.widgetHeader}>
							<h2 className={styles.widgetTitle}>CS2 World Rankings</h2>
						</div>
						{cs2Rankings.map((r) => (
							<div key={r.rank} className={styles.rankRow}>
								<span className={styles.rankNum}>#{r.rank}</span>
								<span className={styles.rankTeam}>{r.team}</span>
								<span className={styles.rankPts}>
									{r.points.toLocaleString()} pts
								</span>
								<span
									className={`${styles.rankChange} ${styles[`change_${r.change}`]}`}
								>
									{r.change === 'up'
										? `▲${r.delta}`
										: r.change === 'down'
											? `▼${r.delta}`
											: '—'}
								</span>
							</div>
						))}
					</section>
				)}

				{/* Top events */}
				<section className={styles.widget}>
					<div className={styles.widgetHeader}>
						<h2 className={styles.widgetTitle}>Top Events</h2>
					</div>
					{filter(events.filter((e) => e.status !== 'completed'))
						.slice(0, 5)
						.map((ev) => (
							<div key={ev.id} className={styles.eventRow} data-game={ev.game}>
								<div className={styles.eventName}>{ev.name}</div>
								<div className={styles.eventRight}>
									<GameTag game={ev.game} />
									<div className={styles.eventDates}>{ev.dates}</div>
								</div>
								<StatusBadge
									status={ev.status as 'live' | 'upcoming' | 'completed'}
								/>
							</div>
						))}
				</section>
			</div>
		</>
	);
}

function EventsPage({
	activeGame,
	onGameChange,
}: {
	activeGame: Game | 'all';
	onGameChange: (g: Game | 'all') => void;
}) {
	const filtered =
		activeGame === 'all' ? events : events.filter((e) => e.game === activeGame);

	return (
		<div className={styles.fullCol}>
			<h1 className={styles.pageTitle}>Events</h1>
			<div className={styles.filterTabs}>
				{(
					['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'] as (Game | 'all')[]
				).map((g) => (
					<button
						type="button"
						key={g}
						className={`${styles.filterTab} ${activeGame === g ? styles.filterTabActive : ''}`}
						onClick={() => onGameChange(g)}
						data-game={g === 'all' ? undefined : g}
					>
						{g === 'all' ? 'All' : gameLabels[g as Game]}
					</button>
				))}
			</div>
			<div className={styles.eventsTable}>
				{filtered.map((ev) => (
					<div
						key={ev.id}
						className={styles.eventTableRow}
						data-game={ev.game}
						data-event-id={ev.id}
					>
						<div className={styles.eventTableName}>{ev.name}</div>
						<GameTag game={ev.game} />
						<div className={styles.eventTableDates}>{ev.dates}</div>
						<StatusBadge
							status={ev.status as 'live' | 'upcoming' | 'completed'}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

function TeamsPage({
	activeGame,
	onGameChange,
}: {
	activeGame: Game | 'all';
	onGameChange: (g: Game | 'all') => void;
}) {
	const filtered =
		activeGame === 'all' ? teams : teams.filter((t) => t.game === activeGame);

	return (
		<div className={styles.fullCol}>
			<h1 className={styles.pageTitle}>Teams</h1>
			<div className={styles.filterTabs}>
				{(
					['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'] as (Game | 'all')[]
				).map((g) => (
					<button
						type="button"
						key={g}
						className={`${styles.filterTab} ${activeGame === g ? styles.filterTabActive : ''}`}
						onClick={() => onGameChange(g)}
						data-game={g === 'all' ? undefined : g}
					>
						{g === 'all' ? 'All' : gameLabels[g as Game]}
					</button>
				))}
			</div>
			<div className={styles.teamsGrid}>
				{filtered.map((t) => (
					<div
						key={t.id}
						className={styles.teamCard}
						data-team-id={t.id}
						data-game={t.game}
					>
						<div className={styles.teamCardName}>{t.name}</div>
						<div className={styles.teamCardAbbr}>{t.abbr}</div>
						<GameTag game={t.game} />
						{t.rank && (
							<div className={styles.teamCardRank}>
								Rank #{t.rank} · {t.rankPoints?.toLocaleString()} pts
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default function ScoretapApp({
	initialPage = 'home',
	initialId,
}: ScoretapAppProps) {
	const [ready, setReady] = useState(false);
	const [page, setPage] = useState<Page>(initialPage);
	const [_id, setId] = useState<string | undefined>(initialId);
	const [activeGame, setActiveGame] = useState<Game | 'all'>('all');

	useEffect(() => {
		setPage(pathToPage());
		fakeGet(null).then(() => setReady(true));
		const onPop = () => {
			setPage(pathToPage());
			window.scrollTo(0, 0);
		};
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, []);

	const navigate = (p: Page, newId?: string) => {
		setPage(p);
		if (newId) {
			setId(newId);
		}
		history.pushState(null, '', pageToPath(p));
		window.scrollTo(0, 0);
	};

	if (!ready) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
					fontFamily: 'Inter,system-ui',
					color: '#6b7280',
					background: '#0f1117',
				}}
			>
				Loading…
			</div>
		);
	}

	const renderPage = () => {
		switch (page) {
			case 'home':
				return <HomePage activeGame={activeGame} />;
			case 'events':
				return (
					<EventsPage activeGame={activeGame} onGameChange={setActiveGame} />
				);
			case 'teams':
				return (
					<TeamsPage activeGame={activeGame} onGameChange={setActiveGame} />
				);
			default:
				return <HomePage activeGame={activeGame} />;
		}
	};

	return (
		<ScoretapShell
			activePage={page}
			activeGame={activeGame}
			onNavigate={navigate}
			onGameChange={setActiveGame}
		>
			{renderPage()}
		</ScoretapShell>
	);
}
