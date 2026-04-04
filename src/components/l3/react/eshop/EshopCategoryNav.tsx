import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import { categories } from '../../../../data/eshop/products';
import '../../../../styles/l3/eshop.css';
import styles from './EshopCategoryNav.module.css';

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
		<span className={styles.e}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.f}>
					{word}
				</span>
			))}
		</span>
	);
}

export default function EshopCategoryNav() {
	const [activeCat, setActiveCat] = useState<string | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		fakeGetMs(null, 400, 250).then(() => {
			const params = new URLSearchParams(window.location.search);
			setActiveCat(params.get('cat'));
			setReady(true);
		});
	}, []);

	if (!ready) {
		return <div className={styles.a}>Loading…</div>;
	}

	return (
		<nav className={styles.b}>
			<a
				href="/l3/eshop/"
				className={`${styles.c}${!activeCat ? ` ${styles.d}` : ''}`}
			>
				All
			</a>
			{categories.map((cat) => (
				<a
					key={cat}
					href={`/l3/eshop/?cat=${encodeURIComponent(cat)}`}
					className={`${styles.c}${activeCat === cat ? ` ${styles.d}` : ''}`}
					data-0={cat}
				>
					<AssembledText text={cat} />
				</a>
			))}
		</nav>
	);
}
