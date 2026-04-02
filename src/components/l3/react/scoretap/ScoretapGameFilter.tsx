// @qscrape L3 / react island / scoretap — game filter tabs
// Anti-bot: CSS-assembled text — game names rendered in shuffled DOM order,
// CSS flex order restores visual sequence. textContent returns words scrambled.
import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import '../../../../styles/l3/scoretap.css';
import styles from './ScoretapGameFilter.module.css';

function seedHash(s: string): number {
	return Math.abs(
		s.split('').reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0),
	);
}

function AssembledText({ text }: { text: string }) {
	const words = text.split(' ');
	const seed = seedHash(text);
	const indexed = words.map((word, i) => ({ word, i }));
	const shuffled = [...indexed].sort(
		(a, b) =>
			((seed * (a.i + 3)) % (words.length + 1)) -
			((seed * (b.i + 3)) % (words.length + 1)),
	);
	return (
		<span className={styles.assembled}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.assembledWord}>
					{word}
				</span>
			))}
		</span>
	);
}

type FilterTab = { key: string; label: string; game: Game | null };

const TABS: FilterTab[] = [
	{ key: 'all', label: 'All Games', game: null },
	{ key: 'cs2', label: 'CS2', game: 'cs2' },
	{ key: 'valorant', label: 'Valorant', game: 'valorant' },
	{ key: 'lol', label: 'League of Legends', game: 'lol' },
	{ key: 'dota2', label: 'Dota 2', game: 'dota2' },
	{ key: 'rl', label: 'Rocket League', game: 'rl' },
];

export default function ScoretapGameFilter() {
	const [tabs, setTabs] = useState<FilterTab[] | null>(null);
	const [activeGame, setActiveGame] = useState<string>('all');

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const game = params.get('game') ?? 'all';
		setActiveGame(game);
		fakeGetMs(TABS, 400, 250).then(setTabs);
	}, []);

	if (!tabs) {
		return <div className={styles.loading}>Loading…</div>;
	}

	return (
		<nav className={styles.root}>
			{tabs.map((tab) => {
				const isActive = tab.key === activeGame;
				const href = tab.game
					? `/l3/scoretap/?game=${tab.game}`
					: '/l3/scoretap/';
				return (
					<a
						key={tab.key}
						href={href}
						className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
						data-game={tab.key}
					>
						<AssembledText text={tab.label} />
					</a>
				);
			})}
		</nav>
	);
}
