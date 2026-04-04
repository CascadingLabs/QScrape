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

interface Props {
	product: ProductMeta;
}

export default function EshopProductImage({ product }: Props) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		fakeGetMs(null, 400, 250).then(() => setReady(true));
	}, []);

	if (!ready) {
		return <div className={styles.a}>Loading…</div>;
	}

	const onSale = product.salePrice !== undefined;

	return (
		<div className={styles.b} data-0={product.sku}>
			<div className={styles.c}>
				<img
					src={product.image}
					alt={product.name}
					className={styles.d}
					loading="eager"
				/>
				<div className={styles.e}>
					{product.isNew && (
						<span className={`${styles.f} ${styles.g}`}>New</span>
					)}
					{onSale && <span className={`${styles.f} ${styles.h}`}>Sale</span>}
					{!product.inStock && (
						<span className={`${styles.f} ${styles.i}`}>Out of Stock</span>
					)}
				</div>
			</div>
			<h1 className={styles.j}>
				<AssembledText text={product.name} />
			</h1>
		</div>
	);
}
