/**
 * @qscrape L2 / react / scoretap / island
 * @component ScoretapRankings
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import {
	cs2Rankings,
	events,
	gameColors,
	gameLabels,
} from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}

function goToTeam(id: string) {
	const url = new URL(window.location.href);
	for (const k of ['match', 'article', 'team', 'event']) {
		url.searchParams.delete(k);
	}
	url.searchParams.set('team', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:team', { detail: id }));
	window.scrollTo(0, 0);
}

function goToEvent(id: string) {
	const url = new URL(window.location.href);
	for (const k of ['match', 'article', 'team', 'event']) {
		url.searchParams.delete(k);
	}
	url.searchParams.set('event', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:event', { detail: id }));
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

export default function ScoretapRankings() {
	const [ready, setReady] = useState(false);
	const [activeGame, setActiveGame] = useState<GameOrAll>('all');

	useEffect(() => {
		setActiveGame(getActiveGame());
		fakeGet(null).then(() => setReady(true));

		const onPop = () => setActiveGame(getActiveGame());
		const onGame = (e: Event) =>
			setActiveGame((e as CustomEvent<GameOrAll>).detail);
		window.addEventListener('popstate', onPop);
		window.addEventListener('scoretap:game', onGame);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('scoretap:game', onGame);
		};
	}, []);

	if (!ready) {
		return (
			<div
				style={{
					padding: '12px',
					color: 'var(--st-muted)',
					fontFamily: 'var(--st-font-ui)',
				}}
			>
				Loading…
			</div>
		);
	}

	const widgetStyle: React.CSSProperties = {
		background: 'var(--st-surface)',
		border: '1px solid var(--st-border)',
		borderRadius: 'var(--st-radius)',
		overflow: 'hidden',
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

	const showRankings = activeGame === 'all' || activeGame === 'cs2';
	const topEvents = (
		activeGame === 'all' ? events : events.filter((e) => e.game === activeGame)
	)
		.filter((e) => e.status !== 'completed')
		.slice(0, 5);

	return (
		<div data-component="scoretap-rankings" data-framework="react">
			{showRankings && (
				<div style={{ ...widgetStyle, marginBottom: '16px' }}>
					<div style={headStyle}>CS2 World Rankings</div>
					{cs2Rankings.map((r) => (
						<div
							key={r.rank}
							data-rank={r.rank}
							onClick={r.teamId ? () => goToTeam(r.teamId!) : undefined}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								padding: '8px 16px',
								borderBottom: '1px solid var(--st-border)',
								fontSize: '13px',
								cursor: r.teamId ? 'pointer' : 'default',
							}}
							onMouseEnter={(e) => {
								if (r.teamId) {
									(e.currentTarget as HTMLElement).style.background =
										'var(--st-surface2)';
								}
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.background = '';
							}}
						>
							<span
								style={{
									width: '24px',
									color: 'var(--st-muted)',
									fontSize: '12px',
									flexShrink: 0,
								}}
							>
								#{r.rank}
							</span>
							<span
								style={{
									flex: 1,
									color: 'var(--st-text)',
									fontWeight: '500',
									textDecoration: r.teamId
										? 'underline dotted var(--st-muted)'
										: 'none',
								}}
								data-team-id={r.teamId}
							>
								{r.team}
							</span>
							<span
								style={{
									fontSize: '12px',
									color: 'var(--st-muted)',
									fontFamily: 'var(--st-font-score)',
								}}
								data-points={r.points}
							>
								{r.points.toLocaleString()}
							</span>
							<span
								style={{
									fontSize: '11px',
									fontWeight: '600',
									color:
										r.change === 'up'
											? 'var(--st-live)'
											: r.change === 'down'
												? '#ef4444'
												: 'var(--st-muted)',
									width: '28px',
									textAlign: 'right',
									flexShrink: 0,
								}}
							>
								{r.change === 'up'
									? `▲${r.delta}`
									: r.change === 'down'
										? `▼${r.delta}`
										: '—'}
							</span>
						</div>
					))}
				</div>
			)}

			<div style={widgetStyle}>
				<div style={headStyle}>Top Events</div>
				{topEvents.length === 0 && (
					<div
						style={{
							padding: '16px',
							fontSize: '13px',
							color: 'var(--st-muted)',
						}}
					>
						No events.
					</div>
				)}
				{topEvents.map((ev) => (
					<div
						key={ev.id}
						data-event-id={ev.id}
						data-game={ev.game}
						onClick={() => goToEvent(ev.id)}
						style={{
							padding: '10px 16px',
							borderBottom: '1px solid var(--st-border)',
							display: 'flex',
							flexDirection: 'column',
							gap: '6px',
							cursor: 'pointer',
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.background =
								'var(--st-surface2)';
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.background = '';
						}}
					>
						<div
							style={{
								fontSize: '13px',
								fontWeight: '500',
								color: 'var(--st-text)',
								textDecoration: 'underline dotted var(--st-muted)',
							}}
						>
							{ev.name}
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<GameTag game={ev.game} />
							<span style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
								{ev.dates}
							</span>
							<span
								style={{
									fontSize: '10px',
									fontWeight: '700',
									padding: '1px 6px',
									borderRadius: '3px',
									background:
										ev.status === 'live'
											? 'var(--st-live)'
											: 'var(--st-surface2)',
									color: ev.status === 'live' ? '#fff' : 'var(--st-muted)',
								}}
							>
								{ev.status === 'live' ? 'LIVE' : 'UPCOMING'}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
