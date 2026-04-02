// @qscrape L3 / react island / news — article headline + byline + date
// Anti-bot: CSS-assembled text on headline and author name
import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	formatDateTime,
} from '../../../../data/news/articles';
import '../../../../styles/l3/news.css';
import styles from './NewsArticleHeader.module.css';

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

interface Props {
	article: ArticleMeta;
}

export default function NewsArticleHeader({ article }: Props) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		fakeGetMs(null, 400, 250).then(() => setReady(true));
	}, []);

	if (!ready) {
		return <div className={styles.loading}>Loading…</div>;
	}

	return (
		<header className={styles.root} data-article-id={article.id}>
			<span className={styles.category}>{article.category}</span>
			{article.breaking && <span className={styles.breakingTag}>Breaking</span>}
			<h1 className={styles.headline}>
				<AssembledText text={article.headline} />
			</h1>
			<div className={styles.byline}>
				<span className={styles.author}>
					<AssembledText text={article.author} />
				</span>
				<span className={styles.bylineTitle}>{article.byline}</span>
				<time dateTime={article.published}>
					{formatDateTime(article.published)}
				</time>
				{article.updated && (
					<span>Updated: {formatDateTime(article.updated)}</span>
				)}
			</div>
		</header>
	);
}
