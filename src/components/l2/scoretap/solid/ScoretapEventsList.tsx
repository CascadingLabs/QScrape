/**
 * @qscrape L2 / solid / scoretap / island
 * @component ScoretapEventsList
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
import { events, gameColors, gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
type View = 'list' | 'event';

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}
function getViewState(): { view: View; id: string | null } {
	const ev = new URLSearchParams(window.location.search).get('event');
	if (ev) {
		return { view: 'event', id: ev };
	}
	return { view: 'list', id: null };
}

function goToEvent(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('event', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:event', { detail: id }));
	window.scrollTo(0, 0);
}

export default function ScoretapEventsList() {
	const [ready, setReady] = createSignal(false);
	const [activeGame, setActiveGame] = createSignal<GameOrAll>('all');
	const [view, setView] = createSignal<View>('list');
	const [selectedId, setSelectedId] = createSignal<string | null>(null);

	const filtered = createMemo(() =>
		activeGame() === 'all'
			? events
			: events.filter((e) => e.game === activeGame()),
	);
	const selectedEvent = createMemo(() => {
		if (view() !== 'event' || !selectedId()) {
			return null;
		}
		return events.find((e) => e.id === selectedId()) ?? null;
	});

	const onPop = () => {
		setActiveGame(getActiveGame());
		const vs = getViewState();
		setView(vs.view);
		setSelectedId(vs.id);
	};
	const onGame = (e: Event) =>
		setActiveGame((e as CustomEvent<GameOrAll>).detail);
	const onEvent = (e: Event) => {
		const id = (e as CustomEvent<string>).detail;
		setView('event');
		setSelectedId(id);
	};

	onMount(() => {
		setActiveGame(getActiveGame());
		const vs = getViewState();
		setView(vs.view);
		setSelectedId(vs.id);
		fakeGet(null).then(() => setReady(true));
		window.addEventListener('popstate', onPop);
		window.addEventListener('scoretap:game', onGame);
		window.addEventListener('scoretap:event', onEvent);
	});
	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('scoretap:game', onGame);
		window.removeEventListener('scoretap:event', onEvent);
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
			<Show
				when={selectedEvent()}
				fallback={
					<div
						data-component="scoretap-events-list"
						data-framework="solid"
						style={widgetStyle}
					>
						<div style={headStyle}>Events</div>
						<Show when={filtered().length === 0}>
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
						<For each={filtered()}>
							{(ev) => (
								<div
									data-event-id={ev.id}
									data-game={ev.game}
									onClick={() => goToEvent(ev.id)}
									style={{
										padding: '10px 16px',
										'border-bottom': '1px solid var(--st-border)',
										cursor: 'pointer',
										display: 'flex',
										'flex-direction': 'column',
										gap: '6px',
									}}
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
												color:
													ev.status === 'live' ? '#fff' : 'var(--st-muted)',
											}}
										>
											{ev.status === 'live'
												? 'LIVE'
												: ev.status === 'completed'
													? 'ENDED'
													: 'UPCOMING'}
										</span>
									</div>
								</div>
							)}
						</For>
					</div>
				}
			>
				{(_) => {
					const ev = selectedEvent()!;
					return (
						<div
							data-component="scoretap-events-list"
							data-framework="solid"
							style={widgetStyle}
						>
							<div
								style={{
									...headStyle,
									display: 'flex',
									'align-items': 'center',
									gap: '8px',
									'text-transform': 'none',
								}}
							>
								<button
									type="button"
									onClick={() => history.back()}
									style={{
										background: 'none',
										border: 'none',
										color: 'var(--st-muted)',
										cursor: 'pointer',
										'font-size': '12px',
										padding: '0',
										'font-family': 'var(--st-font-ui)',
									}}
								>
									← Back
								</button>
								<span
									style={{
										'font-size': '12px',
										'font-weight': '600',
										'text-transform': 'uppercase',
										'letter-spacing': '0.06em',
										color: 'var(--st-muted)',
									}}
								>
									Event Detail
								</span>
							</div>
							<div
								style={{
									padding: '16px',
									display: 'flex',
									'flex-direction': 'column',
									gap: '10px',
								}}
							>
								<div
									style={{
										'font-size': '16px',
										'font-weight': '700',
										color: 'var(--st-text)',
									}}
									data-event-id={ev.id}
								>
									{ev.name}
								</div>
								<div
									style={{
										display: 'flex',
										gap: '8px',
										'flex-wrap': 'wrap',
										'align-items': 'center',
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
										data-game={ev.game}
									>
										{gameLabels[ev.game]}
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
										{ev.status === 'live'
											? 'LIVE'
											: ev.status === 'completed'
												? 'ENDED'
												: 'UPCOMING'}
									</span>
								</div>
								<div style={{ 'font-size': '13px', color: 'var(--st-muted)' }}>
									{ev.dates}
								</div>
							</div>
						</div>
					);
				}}
			</Show>
		</Show>
	);
}
