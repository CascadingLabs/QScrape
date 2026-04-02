import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	getBreaking,
	getLatest,
} from '../../../../data/news/articles';
import '../../../../styles/l3/news.css';
import styles from './NewsHeadlines.module.css';

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
		<span className={styles.k}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.l}>
					{word}
				</span>
			))}
		</span>
	);
}

export default function NewsHeadlines() {
	const [data, setData] = useState<{
		breaking: ArticleMeta[];
		top: ArticleMeta[];
	} | null>(null);

	useEffect(() => {
		fakeGetMs({ breaking: getBreaking(), top: getLatest(3) }, 400, 250).then(
			setData,
		);
	}, []);

	if (!data) {
		return <div className={styles.a}>Loading…</div>;
	}

	return (
		<div className={styles.b} data-island="react-headlines">
			{data.breaking.length > 0 && (
				<div className={styles.c}>
					<span className={styles.d}>BREAKING</span>
					<span className={styles.e}>
						<AssembledText text={data.breaking[0].headline} />
					</span>
				</div>
			)}
			<div className={styles.f}>
				{data.top.map((a) => (
					<article key={a.id} className={styles.g} data-0={a.id}>
						<span className={styles.h}>{a.category}</span>
						<h3 className={styles.i}>
							<AssembledText text={a.headline} />
						</h3>
						<span className={styles.j}>{a.published.slice(0, 10)}</span>
					</article>
				))}
			</div>
		</div>
	);
}
