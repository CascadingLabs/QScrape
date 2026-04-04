/**
 * @qscrape L2 / solid / scoretap / island
 * @component ScoretapLiveScores
 */
import {
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from 'solid-js';
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
function goTo(v: Exclude<View, 'home'>, id: string) {
	const url = new URL(window.location.href);
	for (const k of ['match', 'article', 'team', 'event']) {
		url.searchParams.delete(k);
	}
	url.searchParams.set(v, id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent(`scoretap:${v}`, { detail: id }));
	window.scrollTo(0, 0);
}

function GameTag(props: { game: Game }) {
	return (
		<span
			data-game-tag={props.game}
			style={{
				display: 'inline-block',
				padding: '2px 7px',
				'border-radius': '3px',
				'font-size': '11px',
				'font-weight': '600',
				color: '#fff',
				background: gameColors[props.game],
				'font-family': 'var(--st-font-ui)',
			}}
		>
			{gameLabels[props.game]}
		</span>
	);
}

function BackBtn(props: { label: string }) {
	return (
		<button
			type="button"
			onClick={() => history.back()}
			style={{
				background: 'none',
				border: 'none',
				color: 'var(--st-live)',
				cursor: 'pointer',
				'font-size': '13px',
				'font-family': 'var(--st-font-ui)',
				padding: '0',
				'margin-bottom': '16px',
				display: 'flex',
				'align-items': 'center',
				gap: '4px',
			}}
		>
			← {props.label}
		</button>
	);
}

export default function ScoretapLiveScores() {
	const [ready, setReady] = createSignal(false);
	const [activeGame, setActiveGame] = createSignal<GameOrAll>('all');
	const [view, setView] = createSignal<View>('home');
	const [selectedId, setSelectedId] = createSignal<string | null>(null);
	const [scores, setScores] = createSignal(getInitialLiveScores());

	const filter = <T extends { game: Game }>(arr: T[]) =>
		activeGame() === 'all' ? arr : arr.filter((x) => x.game === activeGame());

	const filteredLive = createMemo(() => filter(liveMatches));
	const filteredResults = createMemo(() => filter(recentResults));
	const filteredNews = createMemo(() => filter(newsItems).slice(0, 6));

	const matchData = createMemo(() => {
		const id = selectedId();
		return id ? (allMatches.find((x) => x.id === id) ?? null) : null;
	});
	const articleData = createMemo(() => {
		const id = selectedId();
		return id ? (newsItems.find((x) => x.id === id) ?? null) : null;
	});
	const teamData = createMemo(() => {
		const id = selectedId();
		return id ? (teams.find((x) => x.id === id) ?? null) : null;
	});
	const eventData = createMemo(() => {
		const id = selectedId();
		return id ? (events.find((x) => x.id === id) ?? null) : null;
	});

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

	onMount(() => {
		const s = getViewState();
		setView(s.view);
		setSelectedId(s.id);
		setActiveGame(getActiveGame());
		fakeGet(null).then(() => setReady(true));
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
			const prev = scores();
			const keys = Object.keys(prev);
			const key = keys[Math.floor(Math.random() * keys.length)];
			const side = Math.random() < 0.5 ? 'a' : 'b';
			const cap = caps[key] ?? 30;
			const cur = prev[key][side as 'a' | 'b'];
			if (cur < cap) {
				setScores({ ...prev, [key]: { ...prev[key], [side]: cur + 1 } });
			}
		}, 8000);
		onCleanup(() => clearInterval(ticker));
	});
	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('scoretap:game', onGame);
		window.removeEventListener('scoretap:match', onMatch);
		window.removeEventListener('scoretap:article', onArticle);
		window.removeEventListener('scoretap:team', onTeam);
		window.removeEventListener('scoretap:event', onEvent);
	});

	const widgetStyle = {
		background: 'var(--st-surface)',
		border: '1px solid var(--st-border)',
		'border-radius': 'var(--st-radius)',
		overflow: 'hidden',
		'margin-bottom': '16px',
	};
	const headStyle = {
		padding: '10px 16px',
		'border-bottom': '1px solid var(--st-border)',
		'font-size': '12px',
		'font-weight': '600',
		'text-transform': 'uppercase' as const,
		'letter-spacing': '0.06em',
		color: 'var(--st-muted)',
	};
	const matchRowStyle = {
		display: 'grid',
		'grid-template-columns': '1fr auto 1fr',
		'align-items': 'center',
		gap: '12px',
		padding: '10px 16px',
		'border-bottom': '1px solid var(--st-border)',
		cursor: 'pointer',
	};

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{
						padding: '24px',
						color: 'var(--st-muted)',
						'font-family': 'var(--st-font-ui)',
					}}
				>
					Loading…
				</div>
			}
		>
			{/* Match detail */}
			<Show when={view() === 'match' && selectedId() && matchData()}>
				{(_) => {
					const m = matchData()!;
					return (
						<div
							data-component="scoretap-match-detail"
							data-match-id={m.id}
							style={{ padding: '24px' }}
						>
							<BackBtn label="Back to scores" />
							<div style={{ ...widgetStyle, 'margin-bottom': '0' }}>
								<div
									style={{
										padding: '12px 16px',
										'border-bottom': '1px solid var(--st-border)',
										display: 'flex',
										gap: '8px',
										'align-items': 'center',
									}}
								>
									<GameTag game={m.game} />
									<span
										style={{
											'font-size': '11px',
											'font-weight': '700',
											padding: '2px 7px',
											'border-radius': '3px',
											background:
												m.status === 'live'
													? 'var(--st-live)'
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
											'font-size': '12px',
											color: 'var(--st-muted)',
											'margin-left': 'auto',
										}}
									>
										{m.event}
									</span>
								</div>
								<div
									style={{
										display: 'grid',
										'grid-template-columns': '1fr auto 1fr',
										'align-items': 'center',
										gap: '16px',
										padding: '24px 16px',
									}}
								>
									<div style={{ 'text-align': 'right' }}>
										<div
											style={{
												'font-size': '22px',
												'font-weight': '700',
												color: 'var(--st-text)',
											}}
										>
											{m.teamA}
										</div>
										<div
											style={{
												'font-size': '13px',
												color: 'var(--st-muted)',
												'margin-top': '4px',
											}}
										>
											{m.teamAFull}
										</div>
									</div>
									<div style={{ 'text-align': 'center' }}>
										<div
											data-score-a={m.scoreA}
											data-score-b={m.scoreB}
											style={{
												'font-size': '36px',
												'font-weight': '700',
												'font-family': 'var(--st-font-score)',
												color: 'var(--st-text)',
											}}
										>
											{m.scoreA} : {m.scoreB}
										</div>
										{m.mapOrGame && (
											<div
												style={{
													'font-size': '12px',
													color: 'var(--st-muted)',
													'margin-top': '4px',
												}}
											>
												{m.mapOrGame}
											</div>
										)}
									</div>
									<div>
										<div
											style={{
												'font-size': '22px',
												'font-weight': '700',
												color: 'var(--st-text)',
											}}
										>
											{m.teamB}
										</div>
										<div
											style={{
												'font-size': '13px',
												color: 'var(--st-muted)',
												'margin-top': '4px',
											}}
										>
											{m.teamBFull}
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				}}
			</Show>

			{/* Article detail */}
			<Show when={view() === 'article' && selectedId() && articleData()}>
				{(_) => {
					const a = articleData()!;
					return (
						<div
							data-component="scoretap-article-detail"
							data-article-id={a.id}
							style={{ padding: '24px' }}
						>
							<BackBtn label="Back to news" />
							<div
								style={{
									...widgetStyle,
									'margin-bottom': '0',
									padding: '24px',
								}}
							>
								<div
									style={{
										'margin-bottom': '12px',
										display: 'flex',
										gap: '8px',
										'align-items': 'center',
									}}
								>
									<GameTag game={a.game} />
									<span
										style={{ 'font-size': '12px', color: 'var(--st-muted)' }}
									>
										{a.hoursAgo}h ago
									</span>
								</div>
								<h1
									style={{
										'font-size': '22px',
										'font-weight': '700',
										color: 'var(--st-text)',
										'line-height': '1.3',
										'margin-bottom': '16px',
									}}
								>
									{a.headline}
								</h1>
								<div
									style={{
										'font-size': '14px',
										color: 'var(--st-muted)',
										'line-height': '1.7',
									}}
								>
									<p>
										ScoreTap is continuing to follow this story. Our reporters
										on the ground are gathering additional details and this
										article will be updated as new information becomes
										available.
									</p>
									<p style={{ 'margin-top': '12px' }}>
										Check back for live updates, player quotes, and post-match
										analysis from our editorial team.
									</p>
								</div>
							</div>
						</div>
					);
				}}
			</Show>

			{/* Team detail */}
			<Show when={view() === 'team' && selectedId() && teamData()}>
				{(_) => {
					const t = teamData()!;
					return (
						<div
							data-component="scoretap-team-detail"
							data-team-id={t.id}
							style={{ padding: '24px' }}
						>
							<BackBtn label="Back to scores" />
							<div
								style={{
									...widgetStyle,
									'margin-bottom': '0',
									padding: '24px',
								}}
							>
								<h1
									style={{
										'font-size': '24px',
										'font-weight': '700',
										color: 'var(--st-text)',
										'margin-bottom': '6px',
									}}
								>
									{t.name}
								</h1>
								<div
									style={{
										display: 'flex',
										gap: '8px',
										'align-items': 'center',
										'margin-bottom': '16px',
									}}
								>
									<GameTag game={t.game} />
									<span
										style={{
											'font-size': '13px',
											color: 'var(--st-muted)',
											'font-family': 'var(--st-font-score)',
										}}
									>
										{t.abbr}
									</span>
								</div>
								{t.rank && (
									<div
										style={{
											display: 'flex',
											gap: '16px',
											padding: '12px',
											background: 'var(--st-surface2)',
											'border-radius': 'var(--st-radius)',
										}}
									>
										<div style={{ 'text-align': 'center' }}>
											<div
												style={{
													'font-size': '20px',
													'font-weight': '700',
													color: 'var(--st-text)',
													'font-family': 'var(--st-font-score)',
												}}
												data-rank={t.rank}
											>
												#{t.rank}
											</div>
											<div
												style={{
													'font-size': '11px',
													color: 'var(--st-muted)',
													'margin-top': '2px',
												}}
											>
												World Rank
											</div>
										</div>
										{t.rankPoints && (
											<div style={{ 'text-align': 'center' }}>
												<div
													style={{
														'font-size': '20px',
														'font-weight': '700',
														color: 'var(--st-text)',
														'font-family': 'var(--st-font-score)',
													}}
													data-points={t.rankPoints}
												>
													{t.rankPoints.toLocaleString()}
												</div>
												<div
													style={{
														'font-size': '11px',
														color: 'var(--st-muted)',
														'margin-top': '2px',
													}}
												>
													Points
												</div>
											</div>
										)}
										{t.rankChange && (
											<div style={{ 'text-align': 'center' }}>
												<div
													style={{
														'font-size': '20px',
														'font-weight': '700',
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
														'font-size': '11px',
														color: 'var(--st-muted)',
														'margin-top': '2px',
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
				}}
			</Show>

			{/* Event detail */}
			<Show when={view() === 'event' && selectedId() && eventData()}>
				{(_) => {
					const ev = eventData()!;
					return (
						<div
							data-component="scoretap-event-detail"
							data-event-id={ev.id}
							style={{ padding: '24px' }}
						>
							<BackBtn label="Back to events" />
							<div
								style={{
									...widgetStyle,
									'margin-bottom': '0',
									padding: '24px',
								}}
							>
								<div
									style={{
										display: 'flex',
										gap: '8px',
										'align-items': 'center',
										'margin-bottom': '12px',
									}}
								>
									<GameTag game={ev.game} />
									<span
										style={{
											'font-size': '11px',
											'font-weight': '700',
											padding: '2px 7px',
											'border-radius': '3px',
											background:
												ev.status === 'live'
													? 'var(--st-live)'
													: 'var(--st-surface2)',
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
										'font-size': '22px',
										'font-weight': '700',
										color: 'var(--st-text)',
										'line-height': '1.3',
										'margin-bottom': '12px',
									}}
								>
									{ev.name}
								</h1>
								<div
									style={{
										'font-size': '14px',
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
				}}
			</Show>

			{/* Home view */}
			<Show when={view() === 'home'}>
				<div data-component="scoretap-live-scores" data-framework="solid">
					{/* Live scores */}
					<div style={widgetStyle}>
						<div style={headStyle}>Live Scores</div>
						<For each={filteredLive()}>
							{(m) => (
								<div
									data-match-id={m.id}
									data-game={m.game}
									style={{ ...matchRowStyle, background: 'var(--st-live-dim)' }}
									onClick={() => goTo('match', m.id)}
								>
									<div style={{ 'text-align': 'right' }}>
										<div
											style={{
												'font-size': '13px',
												'font-weight': '600',
												color: 'var(--st-text)',
											}}
										>
											{m.teamA}
										</div>
										<div
											style={{ 'font-size': '11px', color: 'var(--st-muted)' }}
										>
											{m.teamAFull}
										</div>
									</div>
									<div
										style={{
											'text-align': 'center',
											'min-width': '80px',
											display: 'flex',
											'flex-direction': 'column',
											'align-items': 'center',
											gap: '3px',
										}}
									>
										<div
											id={`score-${m.id}`}
											data-score-a={scores()[m.id]?.a}
											data-score-b={scores()[m.id]?.b}
											style={{
												'font-size': '20px',
												'font-weight': '700',
												'font-family': 'var(--st-font-score)',
												color: 'var(--st-text)',
											}}
										>
											{scores()[m.id]?.a ?? m.scoreA}&nbsp;:&nbsp;
											{scores()[m.id]?.b ?? m.scoreB}
										</div>
										<div
											style={{
												'font-size': '11px',
												color: 'var(--st-live)',
												'font-weight': '600',
											}}
										>
											● LIVE · {m.mapOrGame}
										</div>
										<div
											style={{ 'font-size': '11px', color: 'var(--st-muted)' }}
										>
											{m.event}
										</div>
										<GameTag game={m.game} />
									</div>
									<div>
										<div
											style={{
												'font-size': '13px',
												'font-weight': '600',
												color: 'var(--st-text)',
											}}
										>
											{m.teamB}
										</div>
										<div
											style={{ 'font-size': '11px', color: 'var(--st-muted)' }}
										>
											{m.teamBFull}
										</div>
									</div>
								</div>
							)}
						</For>
					</div>

					{/* Recent results */}
					<div style={widgetStyle}>
						<div style={headStyle}>Recent Results</div>
						<For each={filteredResults()}>
							{(m) => (
								<div
									data-match-id={m.id}
									data-game={m.game}
									style={matchRowStyle}
									onClick={() => goTo('match', m.id)}
								>
									<div style={{ 'text-align': 'right' }}>
										<div
											style={{
												'font-size': '13px',
												'font-weight': m.scoreA > m.scoreB ? '700' : '400',
												color: 'var(--st-text)',
											}}
										>
											{m.teamA}
										</div>
									</div>
									<div
										style={{
											'text-align': 'center',
											'min-width': '80px',
											display: 'flex',
											'flex-direction': 'column',
											'align-items': 'center',
											gap: '3px',
										}}
									>
										<div
											data-score-a={m.scoreA}
											data-score-b={m.scoreB}
											style={{
												'font-size': '16px',
												'font-weight': '700',
												'font-family': 'var(--st-font-score)',
												color: 'var(--st-text)',
											}}
										>
											{m.scoreA} : {m.scoreB}
										</div>
										<div
											style={{ 'font-size': '10px', color: 'var(--st-muted)' }}
										>
											FINAL
										</div>
										<GameTag game={m.game} />
									</div>
									<div>
										<div
											style={{
												'font-size': '13px',
												'font-weight': m.scoreB > m.scoreA ? '700' : '400',
												color: 'var(--st-text)',
											}}
										>
											{m.teamB}
										</div>
									</div>
								</div>
							)}
						</For>
					</div>

					{/* News */}
					<div style={widgetStyle}>
						<div style={headStyle}>Latest News</div>
						<div
							style={{
								padding: '8px',
								display: 'flex',
								'flex-direction': 'column',
								gap: '4px',
							}}
						>
							<For each={filteredNews()}>
								{(item) => (
									<div
										data-game={item.game}
										style={{
											padding: '10px',
											'border-radius': '4px',
											background: 'var(--st-surface2)',
											cursor: 'pointer',
										}}
										onClick={() => goTo('article', item.id)}
									>
										<div
											style={{
												'font-size': '13px',
												color: 'var(--st-text)',
												'line-height': '1.4',
												'margin-bottom': '6px',
												'font-weight': '500',
											}}
										>
											{item.headline}
										</div>
										<div
											style={{
												display: 'flex',
												'align-items': 'center',
												gap: '8px',
											}}
										>
											<GameTag game={item.game} />
											<span
												style={{
													'font-size': '11px',
													color: 'var(--st-muted)',
												}}
											>
												{item.hoursAgo}h ago
											</span>
										</div>
									</div>
								)}
							</For>
						</div>
					</div>
				</div>
			</Show>
		</Show>
	);
}
