// @qscrape L3 / react island / news — breaking ticker + top 3 headlines
// Anti-bot: CSS-assembled text — words rendered in shuffled DOM order, CSS order restores
// visual sequence. element.textContent returns words scrambled with no spaces.
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

/** Renders text with words in shuffled DOM order but correct CSS flex order. */
function AssembledText({ text }: { text: string }) {
	const words = text.split(' ');
	const seed = seedHash(text);
	const indexed = words.map((word, i) => ({ word, i }));
	// Deterministic DOM-order shuffle seeded by text
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
		return <div className={styles.loading}>Loading…</div>;
	}

	return (
		<div className={styles.root} data-island="react-headlines">
			{data.breaking.length > 0 && (
				<div className={styles.breakingBar}>
					<span className={styles.breakingLabel}>BREAKING</span>
					<span className={styles.breakingTicker}>
						<AssembledText text={data.breaking[0].headline} />
					</span>
				</div>
			)}
			<div className={styles.topStories}>
				{data.top.map((a) => (
					<article key={a.id} className={styles.topItem} data-article-id={a.id}>
						<span className={styles.topCat}>{a.category}</span>
						<h3 className={styles.topHeadline}>
							<AssembledText text={a.headline} />
						</h3>
						<span className={styles.topDate}>{a.published.slice(0, 10)}</span>
					</article>
				))}
			</div>
		</div>
	);
}
