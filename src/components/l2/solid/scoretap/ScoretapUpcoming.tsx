/**
 * @qscrape L2 / solid / scoretap / island
 * @component ScoretapUpcoming
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

const teamNameToId: Record<string, string> = Object.fromEntries(
	teams
		.map((t) => [t.name.toLowerCase(), t.id])
		.concat(teams.map((t) => [t.abbr.toLowerCase(), t.id])),
);

function getTeamId(name: string): string | undefined {
	return teamNameToId[name.toLowerCase()];
}

function TeamBtn(props: { name: string }) {
	const id = getTeamId(props.name);
	if (!id) {
		return <span>{props.name}</span>;
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
				'font-weight': '600',
				'font-size': '13px',
				cursor: 'pointer',
				'font-family': 'var(--st-font-ui)',
				padding: '0',
				'text-decoration': 'underline',
				'text-decoration-style': 'dotted',
				'text-decoration-color': 'var(--st-muted)',
			}}
			data-team-id={id}
		>
			{props.name}
		</button>
	);
}

export default function ScoretapUpcoming() {
	const [ready, setReady] = createSignal(false);
	const [activeGame, setActiveGame] = createSignal<GameOrAll>('all');

	const filtered = createMemo(() =>
		activeGame() === 'all'
			? upcomingMatches
			: upcomingMatches.filter((m) => m.game === activeGame()),
	);

	const onPop = () => setActiveGame(getActiveGame());
	const onGame = (e: Event) =>
		setActiveGame((e as CustomEvent<GameOrAll>).detail);

	onMount(() => {
		setActiveGame(getActiveGame());
		fakeGet(null).then(() => setReady(true));
		window.addEventListener('popstate', onPop);
		window.addEventListener('scoretap:game', onGame);
	});
	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('scoretap:game', onGame);
	});

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{
						padding: '12px',
						color: 'var(--st-muted)',
						'font-family': 'var(--st-font-ui)',
					}}
				>
					Loading…
				</div>
			}
		>
			<div
				data-component="scoretap-upcoming"
				data-framework="solid"
				style={{
					background: 'var(--st-surface)',
					border: '1px solid var(--st-border)',
					'border-radius': 'var(--st-radius)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						padding: '10px 16px',
						'border-bottom': '1px solid var(--st-border)',
						'font-size': '12px',
						'font-weight': '600',
						'text-transform': 'uppercase',
						'letter-spacing': '0.06em',
						color: 'var(--st-muted)',
					}}
				>
					Upcoming
				</div>
				<Show when={filtered().length === 0}>
					<div
						style={{
							padding: '16px',
							'font-size': '13px',
							color: 'var(--st-muted)',
						}}
					>
						No upcoming matches.
					</div>
				</Show>
				<For each={filtered()}>
					{(m) => (
						<div
							data-match-id={m.id}
							data-game={m.game}
							style={{
								padding: '10px 16px',
								'border-bottom': '1px solid var(--st-border)',
								display: 'flex',
								'justify-content': 'space-between',
								'align-items': 'flex-start',
								gap: '8px',
							}}
						>
							<div
								style={{
									display: 'flex',
									'flex-direction': 'column',
									gap: '4px',
								}}
							>
								<div
									style={{
										'font-size': '13px',
										'font-weight': '600',
										color: 'var(--st-text)',
										display: 'flex',
										'align-items': 'center',
										gap: '4px',
										'flex-wrap': 'wrap',
									}}
								>
									<TeamBtn name={m.teamA} />
									<span
										style={{ color: 'var(--st-muted)', 'font-weight': '400' }}
									>
										vs
									</span>
									<TeamBtn name={m.teamB} />
								</div>
								<span
									style={{
										display: 'inline-block',
										padding: '2px 7px',
										'border-radius': '3px',
										'font-size': '11px',
										'font-weight': '600',
										color: '#fff',
										background: gameColors[m.game],
										'align-self': 'flex-start',
									}}
								>
									{gameLabels[m.game]}
								</span>
								<div style={{ 'font-size': '11px', color: 'var(--st-muted)' }}>
									{m.event}
								</div>
							</div>
							<div style={{ 'text-align': 'right', 'flex-shrink': '0' }}>
								<div
									style={{
										'font-size': '11px',
										'font-weight': '600',
										color: 'var(--st-text)',
									}}
								>
									{m.time}
								</div>
								<div
									style={{
										'font-size': '10px',
										color: 'var(--st-muted)',
										'margin-top': '2px',
									}}
								>
									UPCOMING
								</div>
							</div>
						</div>
					)}
				</For>
			</div>
		</Show>
	);
}
