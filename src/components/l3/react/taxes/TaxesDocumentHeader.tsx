import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import { type DeedRecord, indexLabels } from '../../../../data/taxes/deeds';
import '../../../../styles/l3/taxes.css';
import styles from './TaxesDocumentHeader.module.css';

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
		<span className={styles.n}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.o}>
					{word}
				</span>
			))}
		</span>
	);
}

interface Props {
	deed: DeedRecord;
}

export default function TaxesDocumentHeader({ deed }: Props) {
	const [data, setData] = useState<DeedRecord | null>(null);

	useEffect(() => {
		fakeGetMs(deed, 400, 250).then(setData);
	}, [deed]);

	if (!data) {
		return <div className={styles.a}>Loading…</div>;
	}

	const label = indexLabels[data.index];
	const statusClass =
		data.status === 'RECORDED'
			? styles.f
			: data.status === 'SATISFIED'
				? styles.g
				: styles.h;

	return (
		<div
			className={styles.b}
			data-island="react-document-header"
			data-0={data.fileNum}
		>
			<div className={styles.c}>
				<span className={styles.d}>{data.fileNum}</span>
				<span className={`${styles.e} ${statusClass}`}>{data.status}</span>
			</div>
			<h1 className={styles.i}>
				<AssembledText text={label} />
			</h1>
			<dl className={styles.j}>
				<div className={styles.k}>
					<dt className={styles.l}>
						<AssembledText text="Document Type" />
					</dt>
					<dd className={styles.m}>{data.index}</dd>
				</div>
				<div className={styles.k}>
					<dt className={styles.l}>
						<AssembledText text="Recording Date" />
					</dt>
					<dd className={styles.m}>{data.recordDate}</dd>
				</div>
				<div className={styles.k}>
					<dt className={styles.l}>
						<AssembledText text="Amount" />
					</dt>
					<dd className={styles.m}>{data.amount}</dd>
				</div>
			</dl>
		</div>
	);
}
