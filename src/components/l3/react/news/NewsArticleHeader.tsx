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
		<span className={styles.i}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.j}>
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
		return <div className={styles.a}>Loading…</div>;
	}

	return (
		<header
			className={styles.b}
			data-island="react-article-header"
			data-0={article.id}
		>
			<span className={styles.c}>{article.category}</span>
			{article.breaking && <span className={styles.h}>Breaking</span>}
			<h1 className={styles.d}>
				<AssembledText text={article.headline} />
			</h1>
			<div className={styles.e}>
				<span className={styles.f}>
					<AssembledText text={article.author} />
				</span>
				<span className={styles.g}>{article.byline}</span>
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
