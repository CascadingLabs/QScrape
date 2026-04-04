import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import {
	type Game,
	gameColors,
	gameLabels,
	type NewsItem,
	newsItems,
} from '../../../../data/scoretap/data';
import '../../../../styles/l3/scoretap.css';
import styles from './ScoretapNewsTicker.module.css';

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

export default function ScoretapNewsTicker() {
	const [items, setItems] = useState<NewsItem[] | null>(null);
	const [activeGame, setActiveGame] = useState<string>('all');
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setActiveGame(params.get('game') ?? 'all');
		fakeGetMs(newsItems, 400, 250).then(setItems);

		const onGame = (e: Event) => {
			setActiveGame((e as CustomEvent).detail.game);
			setIndex(0);
		};
		window.addEventListener('scoretap:game', onGame);
		return () => window.removeEventListener('scoretap:game', onGame);
	}, []);

	if (!items) {
		return <div className={styles.loading}>Loading…</div>;
	}

	const filtered =
		activeGame === 'all' ? items : items.filter((n) => n.game === activeGame);
	const total = filtered.length;
	const safeIdx = total > 0 ? index % total : 0;
	const current = filtered[safeIdx] ?? null;

	if (!current) {
		return (
			<div className={styles.root}>
				<div className={styles.empty}>No news for this game.</div>
			</div>
		);
	}

	const timeLabel =
		current.hoursAgo < 24
			? `${current.hoursAgo}h ago`
			: `${Math.floor(current.hoursAgo / 24)}d ago`;

	function prev() {
		setIndex((i) => {
			const t = filtered.length;
			return t > 0 ? (i - 1 + t) % t : 0;
		});
	}
	function next() {
		setIndex((i) => {
			const t = filtered.length;
			return t > 0 ? (i + 1) % t : 0;
		});
	}

	return (
		<div className={styles.root} data-news-id={current.id}>
			<div className={styles.header}>
				<span className={styles.sectionTitle}>
					<AssembledText text="Latest News" />
				</span>
			</div>
			<div className={styles.card} data-game={current.game}>
				<span
					className={styles.gameBadge}
					style={{ color: gameColors[current.game as Game] }}
				>
					<AssembledText text={gameLabels[current.game]} />
				</span>
				<div className={styles.headline}>
					<AssembledText text={current.headline} />
				</div>
				<span className={styles.time}>
					<AssembledText text={timeLabel} />
				</span>
			</div>
			<div className={styles.controls}>
				<button
					type="button"
					className={styles.arrow}
					onClick={prev}
					aria-label="Previous news"
				>
					←
				</button>
				<span className={styles.counter}>
					{safeIdx + 1} / {total}
				</span>
				<button
					type="button"
					className={styles.arrow}
					onClick={next}
					aria-label="Next news"
				>
					→
				</button>
			</div>
		</div>
	);
}
