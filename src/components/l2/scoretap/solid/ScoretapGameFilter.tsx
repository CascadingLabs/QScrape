/**
 * @qscrape L2 / solid / scoretap / island
 * @component ScoretapGameFilter
 */
import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
const ALL_GAMES: GameOrAll[] = ['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'];

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}

function label(g: GameOrAll): string {
	return g === 'all' ? 'All Games' : gameLabels[g as Game];
}

export default function ScoretapGameFilter() {
	const [ready, setReady] = createSignal(false);
	const [active, setActive] = createSignal<GameOrAll>('all');

	const navigate = (game: GameOrAll) => {
		const url = new URL(window.location.href);
		if (game === 'all') {
			url.searchParams.delete('game');
		} else {
			url.searchParams.set('game', game);
		}
		history.pushState(null, '', url.toString());
		setActive(game);
		window.dispatchEvent(new CustomEvent('scoretap:game', { detail: game }));
	};

	const onPop = () => setActive(getActiveGame());
	const onGame = (e: Event) => setActive((e as CustomEvent<GameOrAll>).detail);

	onMount(() => {
		setActive(getActiveGame());
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
						padding: '12px 24px',
						color: 'var(--st-muted)',
						'font-family': 'var(--st-font-ui)',
					}}
				>
					Loading…
				</div>
			}
		>
			<div
				data-component="scoretap-game-filter"
				data-framework="solid"
				style={{
					background: 'var(--st-surface)',
					'border-bottom': '1px solid var(--st-border)',
					padding: '0 24px',
					display: 'flex',
					gap: '2px',
					'overflow-x': 'auto',
				}}
			>
				<For each={ALL_GAMES}>
					{(g) => (
						<button
							type="button"
							data-filter={g}
							data-active={active() === g ? 'true' : undefined}
							onClick={() => navigate(g)}
							style={{
								padding: '10px 16px',
								'font-size': '13px',
								'font-weight': active() === g ? '600' : '400',
								color: active() === g ? '#fff' : 'var(--st-muted)',
								background: 'none',
								border: 'none',
								'border-bottom':
									active() === g
										? '2px solid var(--st-live)'
										: '2px solid transparent',
								cursor: 'pointer',
								'font-family': 'var(--st-font-ui)',
								'white-space': 'nowrap',
							}}
						>
							{label(g)}
						</button>
					)}
				</For>
			</div>
		</Show>
	);
}
