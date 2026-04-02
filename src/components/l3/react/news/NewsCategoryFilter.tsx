import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import { categories } from '../../../../data/news/articles';
import '../../../../styles/l3/news.css';
import styles from './NewsCategoryFilter.module.css';

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

export default function NewsCategoryFilter() {
	const [active, setActive] = useState<string | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const cat = new URLSearchParams(window.location.search).get('cat');
		setActive(cat);
		fakeGetMs(null, 400, 250).then(() => setReady(true));
	}, []);

	if (!ready) {
		return <div className={styles.loading}>Loading…</div>;
	}

	const allCats = ['All', ...categories] as string[];

	return (
		<div className={styles.root}>
			<span className={styles.label}>Filter by category</span>
			<div className={styles.tabs}>
				{allCats.map((cat) => {
					const href =
						cat === 'All'
							? '/l3/news/articles/'
							: `/l3/news/articles/?cat=${encodeURIComponent(cat)}`;
					const isActive = cat === 'All' ? !active : active === cat;
					return (
						<a
							key={cat}
							href={href}
							className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
						>
							<AssembledText text={cat} />
						</a>
					);
				})}
			</div>
		</div>
	);
}
