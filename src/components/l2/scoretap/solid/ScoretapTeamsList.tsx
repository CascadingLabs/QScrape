/**
 * @qscrape L2 / solid / scoretap / island
 * @component ScoretapTeamsList
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
import { gameColors, gameLabels, teams } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
type View = 'list' | 'team';

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}
function getViewState(): { view: View; id: string | null } {
	const t = new URLSearchParams(window.location.search).get('team');
	if (t) {
		return { view: 'team', id: t };
	}
	return { view: 'list', id: null };
}

function goToTeam(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('team', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:team', { detail: id }));
	window.scrollTo(0, 0);
}

export default function ScoretapTeamsList() {
	const [ready, setReady] = createSignal(false);
	const [activeGame, setActiveGame] = createSignal<GameOrAll>('all');
	const [view, setView] = createSignal<View>('list');
	const [selectedId, setSelectedId] = createSignal<string | null>(null);

	const filtered = createMemo(() =>
		activeGame() === 'all'
			? teams
			: teams.filter((t) => t.game === activeGame()),
	);
	const selectedTeam = createMemo(() => {
		if (view() !== 'team' || !selectedId()) {
			return null;
		}
		return teams.find((t) => t.id === selectedId()) ?? null;
	});

	const onPop = () => {
		setActiveGame(getActiveGame());
		const vs = getViewState();
		setView(vs.view);
		setSelectedId(vs.id);
	};
	const onGame = (e: Event) =>
		setActiveGame((e as CustomEvent<GameOrAll>).detail);
	const onTeam = (e: Event) => {
		const id = (e as CustomEvent<string>).detail;
		setView('team');
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
		window.addEventListener('scoretap:team', onTeam);
	});
	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('scoretap:game', onGame);
		window.removeEventListener('scoretap:team', onTeam);
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
				when={selectedTeam()}
				fallback={
					<div
						data-component="scoretap-teams-list"
						data-framework="solid"
						style={widgetStyle}
					>
						<div style={headStyle}>Teams</div>
						<Show when={filtered().length === 0}>
							<div
								style={{
									padding: '16px',
									'font-size': '13px',
									color: 'var(--st-muted)',
								}}
							>
								No teams.
							</div>
						</Show>
						<div
							style={{
								display: 'grid',
								'grid-template-columns':
									'repeat(auto-fill, minmax(180px, 1fr))',
								gap: '1px',
								background: 'var(--st-border)',
							}}
						>
							<For each={filtered()}>
								{(t) => (
									<div
										data-team-id={t.id}
										data-game={t.game}
										onClick={() => goToTeam(t.id)}
										style={{
											padding: '14px 16px',
											background: 'var(--st-surface)',
											cursor: 'pointer',
											display: 'flex',
											'flex-direction': 'column',
											gap: '6px',
										}}
									>
										<div
											style={{
												'font-size': '14px',
												'font-weight': '700',
												color: 'var(--st-text)',
											}}
										>
											{t.name}
										</div>
										<div
											style={{
												'font-size': '11px',
												color: 'var(--st-muted)',
												'font-family': 'var(--st-font-score)',
											}}
										>
											{t.abbr}
										</div>
										<span
											style={{
												display: 'inline-block',
												padding: '2px 7px',
												'border-radius': '3px',
												'font-size': '11px',
												'font-weight': '600',
												color: '#fff',
												background: gameColors[t.game],
												'align-self': 'flex-start',
											}}
										>
											{gameLabels[t.game]}
										</span>
										<Show when={t.rank != null}>
											<div
												style={{
													'font-size': '11px',
													color: 'var(--st-muted)',
												}}
											>
												#{t.rank} · {t.rankPoints?.toLocaleString()} pts
											</div>
										</Show>
									</div>
								)}
							</For>
						</div>
					</div>
				}
			>
				{(_) => {
					const team = selectedTeam()!;
					return (
						<div
							data-component="scoretap-teams-list"
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
									Team Detail
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
									data-team-id={team.id}
								>
									{team.name}
								</div>
								<div style={{ 'font-size': '13px', color: 'var(--st-muted)' }}>
									{team.abbr}
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
											background: gameColors[team.game],
										}}
										data-game={team.game}
									>
										{gameLabels[team.game]}
									</span>
									<Show when={team.rank != null}>
										<span
											style={{ 'font-size': '12px', color: 'var(--st-muted)' }}
										>
											Rank #{team.rank} · {team.rankPoints?.toLocaleString()}{' '}
											pts
										</span>
									</Show>
									<Show
										when={team.rankChange != null && team.rankChange !== 'same'}
									>
										<span
											style={{
												'font-size': '11px',
												'font-weight': '600',
												color:
													team.rankChange === 'up'
														? 'var(--st-live)'
														: '#ef4444',
											}}
										>
											{team.rankChange === 'up'
												? `▲${team.rankDelta}`
												: `▼${team.rankDelta}`}
										</span>
									</Show>
								</div>
							</div>
						</div>
					);
				}}
			</Show>
		</Show>
	);
}
