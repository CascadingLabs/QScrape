/**
 * @qscrape L2 / react / scoretap / island
 * @component ScoretapUpcoming
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import {
	gameColors,
	gameLabels,
	teams,
	upcomingMatches,
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

// Map team abbreviations/names to team IDs for linking
const teamNameToId: Record<string, string> = Object.fromEntries(
	teams
		.map((t) => [t.name.toLowerCase(), t.id])
		.concat(teams.map((t) => [t.abbr.toLowerCase(), t.id])),
);

function TeamBtn({ name }: { name: string }) {
	const id = teamNameToId[name.toLowerCase()];
	if (!id) {
		return <span>{name}</span>;
	}
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				goToTeam(id);
			}}
			style={{
				background: 'none',
				border: 'none',
				color: 'var(--st-text)',
				fontWeight: '600',
				fontSize: '13px',
				cursor: 'pointer',
				fontFamily: 'var(--st-font-ui)',
				padding: '0',
				textDecoration: 'underline',
				textDecorationStyle: 'dotted',
				textDecorationColor: 'var(--st-muted)',
			}}
			data-team-id={id}
		>
			{name}
		</button>
	);
}

export default function ScoretapUpcoming() {
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

	const filtered =
		activeGame === 'all'
			? upcomingMatches
			: upcomingMatches.filter((m) => m.game === activeGame);

	return (
		<div
			data-component="scoretap-upcoming"
			data-framework="react"
			style={{
				background: 'var(--st-surface)',
				border: '1px solid var(--st-border)',
				borderRadius: 'var(--st-radius)',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					padding: '10px 16px',
					borderBottom: '1px solid var(--st-border)',
					fontSize: '12px',
					fontWeight: '600',
					textTransform: 'uppercase',
					letterSpacing: '0.06em',
					color: 'var(--st-muted)',
				}}
			>
				Upcoming
			</div>
			{filtered.length === 0 && (
				<div
					style={{
						padding: '16px',
						fontSize: '13px',
						color: 'var(--st-muted)',
					}}
				>
					No upcoming matches.
				</div>
			)}
			{filtered.map((m) => (
				<div
					key={m.id}
					data-match-id={m.id}
					data-game={m.game}
					style={{
						padding: '10px 16px',
						borderBottom: '1px solid var(--st-border)',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						gap: '8px',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
						<div style={{ fontSize: '13px', color: 'var(--st-text)' }}>
							<TeamBtn name={m.teamA} />{' '}
							<span style={{ color: 'var(--st-muted)', fontWeight: '400' }}>
								vs
							</span>{' '}
							<TeamBtn name={m.teamB} />
						</div>
						<GameTag game={m.game} />
						<div style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
							{m.event}
						</div>
					</div>
					<div style={{ textAlign: 'right', flexShrink: 0 }}>
						<div
							style={{
								fontSize: '11px',
								fontWeight: '600',
								color: 'var(--st-text)',
							}}
						>
							{m.time}
						</div>
						<div
							style={{
								fontSize: '10px',
								color: 'var(--st-muted)',
								marginTop: '2px',
							}}
						>
							UPCOMING
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
