/**
 * @qscrape L2 / react / scoretap / island
 * @component ScoretapLiveScores
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import {
	events,
	gameColors,
	gameLabels,
	getInitialLiveScores,
	liveMatches,
	newsItems,
	recentResults,
	teams,
	upcomingMatches,
} from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
type View = 'home' | 'match' | 'article' | 'team' | 'event';

const allMatches = [...liveMatches, ...recentResults, ...upcomingMatches];

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}
function getViewState(): { view: View; id: string | null } {
	const p = new URLSearchParams(window.location.search);
	const match = p.get('match');
	const article = p.get('article');
	const team = p.get('team');
	const event = p.get('event');
	if (match) {
		return { view: 'match', id: match };
	}
	if (article) {
		return { view: 'article', id: article };
	}
	if (team) {
		return { view: 'team', id: team };
	}
	if (event) {
		return { view: 'event', id: event };
	}
	return { view: 'home', id: null };
}

function goTo(view: Exclude<View, 'home'>, id: string) {
	const url = new URL(window.location.href);
	for (const k of ['match', 'article', 'team', 'event']) {
		url.searchParams.delete(k);
	}
	url.searchParams.set(view, id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent(`scoretap:${view}`, { detail: id }));
	window.scrollTo(0, 0);
}

function GameTag({ game }: { game: Game }) {
	return (
		<span
			data-game-tag={game}
			style={{
				display: 'inline-block',
				padding: '2px 7px',
				borderRadius: '3px',
				fontSize: '11px',
				fontWeight: '600',
				color: '#fff',
				background: gameColors[game],
			}}
		>
			{gameLabels[game]}
		</span>
	);
}

function BackBtn({ label }: { label: string }) {
	return (
		<button
			type="button"
			onClick={() => history.back()}
			style={{
				background: 'none',
				border: 'none',
				color: 'var(--st-live)',
				cursor: 'pointer',
				fontSize: '13px',
				fontFamily: 'var(--st-font-ui)',
				padding: '0',
				marginBottom: '16px',
				display: 'flex',
				alignItems: 'center',
				gap: '4px',
			}}
		>
			← {label}
		</button>
	);
}

function MatchDetail({ id }: { id: string }) {
	const m = allMatches.find((x) => x.id === id);
	if (!m) {
		return (
			<div style={{ padding: '24px', color: 'var(--st-muted)' }}>
				Match not found.
			</div>
		);
	}
	return (
		<div
			data-component="scoretap-match-detail"
			data-match-id={m.id}
			style={{ padding: '24px' }}
		>
			<BackBtn label="Back to scores" />
			<div
				style={{
					background: 'var(--st-surface)',
					border: '1px solid var(--st-border)',
					borderRadius: 'var(--st-radius)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						padding: '12px 16px',
						borderBottom: '1px solid var(--st-border)',
						display: 'flex',
						gap: '8px',
						alignItems: 'center',
					}}
				>
					<GameTag game={m.game} />
					<span
						style={{
							fontSize: '11px',
							fontWeight: '700',
							padding: '2px 7px',
							borderRadius: '3px',
							background:
								m.status === 'live'
									? 'var(--st-live)'
									: m.status === 'final'
										? 'var(--st-surface2)'
										: 'var(--st-surface2)',
							color: m.status === 'live' ? '#fff' : 'var(--st-muted)',
						}}
					>
						{m.status === 'live'
							? '● LIVE'
							: m.status === 'final'
								? 'FINAL'
								: 'UPCOMING'}
					</span>
					<span
						style={{
							fontSize: '12px',
							color: 'var(--st-muted)',
							marginLeft: 'auto',
						}}
					>
						{m.event}
					</span>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr auto 1fr',
						alignItems: 'center',
						gap: '16px',
						padding: '24px 16px',
					}}
				>
					<div style={{ textAlign: 'right' }}>
						<div
							style={{
								fontSize: '22px',
								fontWeight: '700',
								color: 'var(--st-text)',
							}}
						>
							{m.teamA}
						</div>
						<div
							style={{
								fontSize: '13px',
								color: 'var(--st-muted)',
								marginTop: '4px',
							}}
						>
							{m.teamAFull}
						</div>
					</div>
					<div style={{ textAlign: 'center' }}>
						<div
							data-score-a={m.scoreA}
							data-score-b={m.scoreB}
							style={{
								fontSize: '36px',
								fontWeight: '700',
								fontFamily: 'var(--st-font-score)',
								color: 'var(--st-text)',
							}}
						>
							{m.scoreA} : {m.scoreB}
						</div>
						{m.mapOrGame && (
							<div
								style={{
									fontSize: '12px',
									color: 'var(--st-muted)',
									marginTop: '4px',
								}}
							>
								{m.mapOrGame}
							</div>
						)}
					</div>
					<div>
						<div
							style={{
								fontSize: '22px',
								fontWeight: '700',
								color: 'var(--st-text)',
							}}
						>
							{m.teamB}
						</div>
						<div
							style={{
								fontSize: '13px',
								color: 'var(--st-muted)',
								marginTop: '4px',
							}}
						>
							{m.teamBFull}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ArticleDetail({ id }: { id: string }) {
	const a = newsItems.find((x) => x.id === id);
	if (!a) {
		return (
			<div style={{ padding: '24px', color: 'var(--st-muted)' }}>
				Article not found.
			</div>
		);
	}
	return (
		<div
			data-component="scoretap-article-detail"
			data-article-id={a.id}
			style={{ padding: '24px' }}
		>
			<BackBtn label="Back to news" />
			<div
				style={{
					background: 'var(--st-surface)',
					border: '1px solid var(--st-border)',
					borderRadius: 'var(--st-radius)',
					padding: '24px',
				}}
			>
				<div
					style={{
						marginBottom: '12px',
						display: 'flex',
						gap: '8px',
						alignItems: 'center',
					}}
				>
					<GameTag game={a.game} />
					<span style={{ fontSize: '12px', color: 'var(--st-muted)' }}>
						{a.hoursAgo}h ago
					</span>
				</div>
				<h1
					style={{
						fontSize: '22px',
						fontWeight: '700',
						color: 'var(--st-text)',
						lineHeight: '1.3',
						marginBottom: '16px',
					}}
				>
					{a.headline}
				</h1>
				<div
					style={{
						fontSize: '14px',
						color: 'var(--st-muted)',
						lineHeight: '1.7',
					}}
				>
					<p>
						ScoreTap is continuing to follow this story. Our reporters on the
						ground are gathering additional details and this article will be
						updated as new information becomes available.
					</p>
					<p style={{ marginTop: '12px' }}>
						Check back for live updates, player quotes, and post-match analysis
						from our editorial team.
					</p>
				</div>
			</div>
		</div>
	);
}

function TeamDetail({ id }: { id: string }) {
	const t = teams.find((x) => x.id === id);
	if (!t) {
		return (
			<div style={{ padding: '24px', color: 'var(--st-muted)' }}>
				Team not found.
			</div>
		);
	}
	return (
		<div
			data-component="scoretap-team-detail"
			data-team-id={t.id}
			style={{ padding: '24px' }}
		>
			<BackBtn label="Back to scores" />
			<div
				style={{
					background: 'var(--st-surface)',
					border: '1px solid var(--st-border)',
					borderRadius: 'var(--st-radius)',
					padding: '24px',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						gap: '16px',
						marginBottom: '16px',
					}}
				>
					<div>
						<h1
							style={{
								fontSize: '24px',
								fontWeight: '700',
								color: 'var(--st-text)',
								marginBottom: '6px',
							}}
						>
							{t.name}
						</h1>
						<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
							<GameTag game={t.game} />
							<span
								style={{
									fontSize: '13px',
									color: 'var(--st-muted)',
									fontFamily: 'var(--st-font-score)',
								}}
							>
								{t.abbr}
							</span>
						</div>
					</div>
				</div>
				{t.rank && (
					<div
						style={{
							display: 'flex',
							gap: '16px',
							marginTop: '16px',
							padding: '12px',
							background: 'var(--st-surface2)',
							borderRadius: 'var(--st-radius)',
						}}
					>
						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									fontSize: '20px',
									fontWeight: '700',
									color: 'var(--st-text)',
									fontFamily: 'var(--st-font-score)',
								}}
								data-rank={t.rank}
							>
								#{t.rank}
							</div>
							<div
								style={{
									fontSize: '11px',
									color: 'var(--st-muted)',
									marginTop: '2px',
								}}
							>
								World Rank
							</div>
						</div>
						{t.rankPoints && (
							<div style={{ textAlign: 'center' }}>
								<div
									style={{
										fontSize: '20px',
										fontWeight: '700',
										color: 'var(--st-text)',
										fontFamily: 'var(--st-font-score)',
									}}
									data-points={t.rankPoints}
								>
									{t.rankPoints.toLocaleString()}
								</div>
								<div
									style={{
										fontSize: '11px',
										color: 'var(--st-muted)',
										marginTop: '2px',
									}}
								>
									Points
								</div>
							</div>
						)}
						{t.rankChange && (
							<div style={{ textAlign: 'center' }}>
								<div
									style={{
										fontSize: '20px',
										fontWeight: '700',
										color:
											t.rankChange === 'up'
												? 'var(--st-live)'
												: t.rankChange === 'down'
													? '#ef4444'
													: 'var(--st-muted)',
									}}
								>
									{t.rankChange === 'up'
										? `▲${t.rankDelta ?? ''}`
										: t.rankChange === 'down'
											? `▼${t.rankDelta ?? ''}`
											: '—'}
								</div>
								<div
									style={{
										fontSize: '11px',
										color: 'var(--st-muted)',
										marginTop: '2px',
									}}
								>
									Trend
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

function EventDetail({ id }: { id: string }) {
	const ev = events.find((x) => x.id === id);
	if (!ev) {
		return (
			<div style={{ padding: '24px', color: 'var(--st-muted)' }}>
				Event not found.
			</div>
		);
	}
	return (
		<div
			data-component="scoretap-event-detail"
			data-event-id={ev.id}
			style={{ padding: '24px' }}
		>
			<BackBtn label="Back to events" />
			<div
				style={{
					background: 'var(--st-surface)',
					border: '1px solid var(--st-border)',
					borderRadius: 'var(--st-radius)',
					padding: '24px',
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '8px',
						alignItems: 'center',
						marginBottom: '12px',
					}}
				>
					<GameTag game={ev.game} />
					<span
						style={{
							fontSize: '11px',
							fontWeight: '700',
							padding: '2px 7px',
							borderRadius: '3px',
							background:
								ev.status === 'live' ? 'var(--st-live)' : 'var(--st-surface2)',
							color: ev.status === 'live' ? '#fff' : 'var(--st-muted)',
						}}
					>
						{ev.status === 'live'
							? '● LIVE'
							: ev.status === 'completed'
								? 'ENDED'
								: 'UPCOMING'}
					</span>
				</div>
				<h1
					style={{
						fontSize: '22px',
						fontWeight: '700',
						color: 'var(--st-text)',
						lineHeight: '1.3',
						marginBottom: '12px',
					}}
				>
					{ev.name}
				</h1>
				<div
					style={{
						fontSize: '14px',
						color: 'var(--st-muted)',
						display: 'flex',
						gap: '16px',
					}}
				>
					<span data-dates={ev.dates}>📅 {ev.dates}</span>
					<span data-game={ev.game}>🎮 {gameLabels[ev.game]}</span>
				</div>
			</div>
		</div>
	);
}

export default function ScoretapLiveScores() {
	const [ready, setReady] = useState(false);
	const [activeGame, setActiveGame] = useState<GameOrAll>('all');
	const [view, setView] = useState<View>('home');
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [scores, setScores] = useState(() => getInitialLiveScores());

	useEffect(() => {
		const { view: v, id } = getViewState();
		setView(v);
		setSelectedId(id);
		setActiveGame(getActiveGame());
		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const s = getViewState();
			setView(s.view);
			setSelectedId(s.id);
			setActiveGame(getActiveGame());
		};
		const onGame = (e: Event) =>
			setActiveGame((e as CustomEvent<GameOrAll>).detail);
		const onMatch = (e: Event) => {
			setView('match');
			setSelectedId((e as CustomEvent<string>).detail);
		};
		const onArticle = (e: Event) => {
			setView('article');
			setSelectedId((e as CustomEvent<string>).detail);
		};
		const onTeam = (e: Event) => {
			setView('team');
			setSelectedId((e as CustomEvent<string>).detail);
		};
		const onEvent = (e: Event) => {
			setView('event');
			setSelectedId((e as CustomEvent<string>).detail);
		};

		window.addEventListener('popstate', onPop);
		window.addEventListener('scoretap:game', onGame);
		window.addEventListener('scoretap:match', onMatch);
		window.addEventListener('scoretap:article', onArticle);
		window.addEventListener('scoretap:team', onTeam);
		window.addEventListener('scoretap:event', onEvent);

		const caps: Record<string, number> = {
			'match-001': 30,
			'match-002': 30,
			'match-003': 5,
		};
		const ticker = setInterval(() => {
			setScores((prev) => {
				const keys = Object.keys(prev);
				const key = keys[Math.floor(Math.random() * keys.length)];
				const side = Math.random() < 0.5 ? 'a' : 'b';
				const cap = caps[key] ?? 30;
				const cur = prev[key][side as 'a' | 'b'];
				if (cur >= cap) {
					return prev;
				}
				return { ...prev, [key]: { ...prev[key], [side]: cur + 1 } };
			});
		}, 8000);

		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('scoretap:game', onGame);
			window.removeEventListener('scoretap:match', onMatch);
			window.removeEventListener('scoretap:article', onArticle);
			window.removeEventListener('scoretap:team', onTeam);
			window.removeEventListener('scoretap:event', onEvent);
			clearInterval(ticker);
		};
	}, []);

	if (!ready) {
		return (
			<div
				style={{
					padding: '24px',
					color: 'var(--st-muted)',
					fontFamily: 'var(--st-font-ui)',
				}}
			>
				Loading…
			</div>
		);
	}

	if (view === 'match' && selectedId) {
		return <MatchDetail id={selectedId} />;
	}
	if (view === 'article' && selectedId) {
		return <ArticleDetail id={selectedId} />;
	}
	if (view === 'team' && selectedId) {
		return <TeamDetail id={selectedId} />;
	}
	if (view === 'event' && selectedId) {
		return <EventDetail id={selectedId} />;
	}

	const filter = <T extends { game: Game }>(arr: T[]) =>
		activeGame === 'all' ? arr : arr.filter((x) => x.game === activeGame);

	const widgetStyle: React.CSSProperties = {
		background: 'var(--st-surface)',
		border: '1px solid var(--st-border)',
		borderRadius: 'var(--st-radius)',
		overflow: 'hidden',
		marginBottom: '16px',
	};
	const headStyle: React.CSSProperties = {
		padding: '10px 16px',
		borderBottom: '1px solid var(--st-border)',
		fontSize: '12px',
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: '0.06em',
		color: 'var(--st-muted)',
	};
	const matchRowStyle: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: '1fr auto 1fr',
		alignItems: 'center',
		gap: '12px',
		padding: '10px 16px',
		borderBottom: '1px solid var(--st-border)',
		cursor: 'pointer',
	};

	return (
		<div data-component="scoretap-live-scores" data-framework="react">
			{/* Live scores */}
			<div style={widgetStyle}>
				<div style={headStyle}>Live Scores</div>
				{filter(liveMatches).map((m) => (
					<div
						key={m.id}
						data-match-id={m.id}
						data-game={m.game}
						style={{ ...matchRowStyle, background: 'var(--st-live-dim)' }}
						onClick={() => goTo('match', m.id)}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.opacity = '0.85';
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.opacity = '1';
						}}
					>
						<div style={{ textAlign: 'right' }}>
							<div
								style={{
									fontSize: '13px',
									fontWeight: '600',
									color: 'var(--st-text)',
								}}
							>
								{m.teamA}
							</div>
							<div style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
								{m.teamAFull}
							</div>
						</div>
						<div
							style={{
								textAlign: 'center',
								minWidth: '80px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '3px',
							}}
						>
							<div
								id={`score-${m.id}`}
								data-score-a={scores[m.id]?.a}
								data-score-b={scores[m.id]?.b}
								style={{
									fontSize: '20px',
									fontWeight: '700',
									fontFamily: 'var(--st-font-score)',
									color: 'var(--st-text)',
								}}
							>
								{scores[m.id]?.a ?? m.scoreA}&nbsp;:&nbsp;
								{scores[m.id]?.b ?? m.scoreB}
							</div>
							<div
								style={{
									fontSize: '11px',
									color: 'var(--st-live)',
									fontWeight: '600',
								}}
							>
								● LIVE · {m.mapOrGame}
							</div>
							<div style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
								{m.event}
							</div>
							<GameTag game={m.game} />
						</div>
						<div>
							<div
								style={{
									fontSize: '13px',
									fontWeight: '600',
									color: 'var(--st-text)',
								}}
							>
								{m.teamB}
							</div>
							<div style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
								{m.teamBFull}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Recent results */}
			<div style={widgetStyle}>
				<div style={headStyle}>Recent Results</div>
				{filter(recentResults).map((m) => (
					<div
						key={m.id}
						data-match-id={m.id}
						data-game={m.game}
						style={matchRowStyle}
						onClick={() => goTo('match', m.id)}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.background =
								'var(--st-surface2)';
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.background = '';
						}}
					>
						<div style={{ textAlign: 'right' }}>
							<div
								style={{
									fontSize: '13px',
									fontWeight: m.scoreA > m.scoreB ? '700' : '400',
									color: 'var(--st-text)',
								}}
							>
								{m.teamA}
							</div>
						</div>
						<div
							style={{
								textAlign: 'center',
								minWidth: '80px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '3px',
							}}
						>
							<div
								data-score-a={m.scoreA}
								data-score-b={m.scoreB}
								style={{
									fontSize: '16px',
									fontWeight: '700',
									fontFamily: 'var(--st-font-score)',
									color: 'var(--st-text)',
								}}
							>
								{m.scoreA} : {m.scoreB}
							</div>
							<div style={{ fontSize: '10px', color: 'var(--st-muted)' }}>
								FINAL
							</div>
							<GameTag game={m.game} />
						</div>
						<div>
							<div
								style={{
									fontSize: '13px',
									fontWeight: m.scoreB > m.scoreA ? '700' : '400',
									color: 'var(--st-text)',
								}}
							>
								{m.teamB}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* News */}
			<div style={widgetStyle}>
				<div style={headStyle}>Latest News</div>
				<div
					style={{
						padding: '8px',
						display: 'flex',
						flexDirection: 'column',
						gap: '4px',
					}}
				>
					{filter(newsItems)
						.slice(0, 6)
						.map((item) => (
							<div
								key={item.id}
								data-game={item.game}
								onClick={() => goTo('article', item.id)}
								style={{
									padding: '10px',
									borderRadius: '4px',
									background: 'var(--st-surface2)',
									cursor: 'pointer',
								}}
								onMouseEnter={(e) => {
									(e.currentTarget as HTMLElement).style.opacity = '0.8';
								}}
								onMouseLeave={(e) => {
									(e.currentTarget as HTMLElement).style.opacity = '1';
								}}
							>
								<div
									style={{
										fontSize: '13px',
										color: 'var(--st-text)',
										lineHeight: '1.4',
										marginBottom: '6px',
										fontWeight: '500',
									}}
								>
									{item.headline}
								</div>
								<div
									style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
								>
									<GameTag game={item.game} />
									<span style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
										{item.hoursAgo}h ago
									</span>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
