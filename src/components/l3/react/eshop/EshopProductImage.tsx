// @qscrape L3 / react island / eshop — product image + badges (product detail page)
// Anti-bot: CSS-assembled text — product name words in shuffled DOM order, CSS flex order restores.
// element.textContent on .assembled returns words scrambled; scrapers must read CSS order properties.
import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import type { ProductMeta } from '../../../../data/eshop/products';
import '../../../../styles/l3/eshop.css';
import styles from './EshopProductImage.module.css';

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
	product: ProductMeta;
}

export default function EshopProductImage({ product }: Props) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		fakeGetMs(null, 400, 250).then(() => setReady(true));
	}, []);

	if (!ready) {
		return <div className={styles.loading}>Loading…</div>;
	}

	const onSale = product.salePrice !== undefined;

	return (
		<div className={styles.root} data-sku={product.sku}>
			<div className={styles.imageWrap}>
				<img
					src={product.image}
					alt={product.name}
					className={styles.image}
					loading="eager"
				/>
				<div className={styles.badges}>
					{product.isNew && (
						<span className={`${styles.badge} ${styles.badgeNew}`}>New</span>
					)}
					{onSale && (
						<span className={`${styles.badge} ${styles.badgeSale}`}>Sale</span>
					)}
					{!product.inStock && (
						<span className={`${styles.badge} ${styles.badgeOos}`}>
							Out of Stock
						</span>
					)}
				</div>
			</div>
			<h1 className={styles.name}>
				<AssembledText text={product.name} />
			</h1>
		</div>
	);
}
