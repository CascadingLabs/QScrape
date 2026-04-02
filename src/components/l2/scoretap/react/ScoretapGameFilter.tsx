/**
 * @qscrape L2 / react / scoretap / island
 * @component ScoretapGameFilter
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

const ALL_GAMES = ['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'] as const;
type GameOrAll = Game | 'all';

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}

export default function ScoretapGameFilter() {
	const [ready, setReady] = useState(false);
	const [active, setActive] = useState<GameOrAll>('all');

	useEffect(() => {
		setActive(getActiveGame());
		fakeGet(null).then(() => setReady(true));

		const onPop = () => setActive(getActiveGame());
		const onGame = (e: Event) =>
			setActive((e as CustomEvent<GameOrAll>).detail);
		window.addEventListener('popstate', onPop);
		window.addEventListener('scoretap:game', onGame);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('scoretap:game', onGame);
		};
	}, []);

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

	if (!ready) {
		return (
			<div
				style={{
					padding: '12px 24px',
					color: 'var(--st-muted)',
					fontFamily: 'var(--st-font-ui)',
				}}
			>
				Loading…
			</div>
		);
	}

	return (
		<div
			data-component="scoretap-game-filter"
			data-framework="react"
			style={{
				background: 'var(--st-surface)',
				borderBottom: '1px solid var(--st-border)',
				padding: '0 24px',
				display: 'flex',
				gap: '2px',
				overflowX: 'auto',
			}}
		>
			{ALL_GAMES.map((g) => (
				<button
					key={g}
					type="button"
					data-filter={g}
					data-active={active === g ? 'true' : undefined}
					onClick={() => navigate(g)}
					style={{
						padding: '10px 16px',
						fontSize: '13px',
						fontWeight: active === g ? '600' : '400',
						color: active === g ? '#fff' : 'var(--st-muted)',
						background: 'none',
						border: 'none',
						borderBottom:
							active === g
								? '2px solid var(--st-live)'
								: '2px solid transparent',
						cursor: 'pointer',
						fontFamily: 'var(--st-font-ui)',
						whiteSpace: 'nowrap',
						transition: 'color 0.12s',
					}}
				>
					{g === 'all' ? 'All Games' : gameLabels[g as Game]}
				</button>
			))}
		</div>
	);
}
