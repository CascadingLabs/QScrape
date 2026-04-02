/**
 * @qscrape L2 / solid / scoretap / island
 * @component ScoretapRankings
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

export default function ScoretapRankings() {
	const [ready, setReady] = createSignal(false);
	const [activeGame, setActiveGame] = createSignal<GameOrAll>('all');

	const showRankings = createMemo(
		() => activeGame() === 'all' || activeGame() === 'cs2',
	);
	const topEvents = createMemo(() =>
		(activeGame() === 'all'
			? events
			: events.filter((e) => e.game === activeGame())
		)
			.filter((e) => e.status !== 'completed')
			.slice(0, 5),
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

	const widgetStyle = {
		background: 'var(--st-surface)',
		border: '1px solid var(--st-border)',
		'border-radius': 'var(--st-radius)',
		overflow: 'hidden',
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
			<div data-component="scoretap-rankings" data-framework="solid">
				<Show when={showRankings()}>
					<div style={{ ...widgetStyle, 'margin-bottom': '16px' }}>
						<div style={headStyle}>CS2 World Rankings</div>
						<For each={cs2Rankings}>
							{(r) => (
								<div
									data-rank={r.rank}
									style={{
										display: 'flex',
										'align-items': 'center',
										gap: '8px',
										padding: '8px 16px',
										'border-bottom': '1px solid var(--st-border)',
										'font-size': '13px',
										cursor: r.teamId ? 'pointer' : 'default',
									}}
									onClick={() => {
										if (r.teamId) {
											goToTeam(r.teamId);
										}
									}}
								>
									<span
										style={{
											width: '24px',
											color: 'var(--st-muted)',
											'font-size': '12px',
											'flex-shrink': '0',
										}}
									>
										#{r.rank}
									</span>
									<span
										style={{
											flex: '1',
											color: 'var(--st-text)',
											'font-weight': '500',
											'text-decoration': r.teamId
												? 'underline dotted var(--st-muted)'
												: 'none',
										}}
										data-team-id={r.teamId}
									>
										{r.team}
									</span>
									<span
										style={{
											'font-size': '12px',
											color: 'var(--st-muted)',
											'font-family': 'var(--st-font-score)',
										}}
										data-points={r.points}
									>
										{r.points.toLocaleString()}
									</span>
									<span
										style={{
											'font-size': '11px',
											'font-weight': '600',
											color:
												r.change === 'up'
													? 'var(--st-live)'
													: r.change === 'down'
														? '#ef4444'
														: 'var(--st-muted)',
											width: '28px',
											'text-align': 'right',
											'flex-shrink': '0',
										}}
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
					</div>
				</Show>

				<div style={widgetStyle}>
					<div style={headStyle}>Top Events</div>
					<Show when={topEvents().length === 0}>
						<div
							style={{
								padding: '16px',
								'font-size': '13px',
								color: 'var(--st-muted)',
							}}
						>
							No events.
						</div>
					</Show>
					<For each={topEvents()}>
						{(ev) => (
							<div
								data-event-id={ev.id}
								data-game={ev.game}
								style={{
									padding: '10px 16px',
									'border-bottom': '1px solid var(--st-border)',
									display: 'flex',
									'flex-direction': 'column',
									gap: '6px',
									cursor: 'pointer',
								}}
								onClick={() => goToEvent(ev.id)}
							>
								<div
									style={{
										'font-size': '13px',
										'font-weight': '500',
										color: 'var(--st-text)',
										'text-decoration': 'underline dotted var(--st-muted)',
									}}
								>
									{ev.name}
								</div>
								<div
									style={{
										display: 'flex',
										'align-items': 'center',
										gap: '8px',
										'flex-wrap': 'wrap',
									}}
								>
									<span
										style={{
											display: 'inline-block',
											padding: '2px 7px',
											'border-radius': '3px',
											'font-size': '11px',
											'font-weight': '600',
											color: '#fff',
											background: gameColors[ev.game],
										}}
									>
										{gameLabels[ev.game]}
									</span>
									<span
										style={{ 'font-size': '11px', color: 'var(--st-muted)' }}
									>
										{ev.dates}
									</span>
									<span
										style={{
											'font-size': '10px',
											'font-weight': '700',
											padding: '1px 6px',
											'border-radius': '3px',
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
						)}
					</For>
				</div>
			</div>
		</Show>
	);
}
