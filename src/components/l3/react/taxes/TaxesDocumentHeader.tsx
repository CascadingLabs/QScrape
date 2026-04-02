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
	deed: DeedRecord;
}

export default function TaxesDocumentHeader({ deed }: Props) {
	const [data, setData] = useState<DeedRecord | null>(null);

	useEffect(() => {
		fakeGetMs(deed, 400, 250).then(setData);
	}, [deed]);

	if (!data) {
		return <div className={styles.loading}>Loading…</div>;
	}

	const label = indexLabels[data.index];
	const statusClass =
		data.status === 'RECORDED'
			? styles.statusRecorded
			: data.status === 'SATISFIED'
				? styles.statusSatisfied
				: styles.statusDelinquent;

	return (
		<div className={styles.root} data-file-num={data.fileNum}>
			<div className={styles.topRow}>
				<span className={styles.fileNum}>{data.fileNum}</span>
				<span className={`${styles.statusBadge} ${statusClass}`}>
					{data.status}
				</span>
			</div>
			<h1 className={styles.docType}>
				<AssembledText text={label} />
			</h1>
			<dl className={styles.meta}>
				<div className={styles.metaItem}>
					<dt className={styles.metaLabel}>
						<AssembledText text="Document Type" />
					</dt>
					<dd className={styles.metaValue}>{data.index}</dd>
				</div>
				<div className={styles.metaItem}>
					<dt className={styles.metaLabel}>
						<AssembledText text="Recording Date" />
					</dt>
					<dd className={styles.metaValue}>{data.recordDate}</dd>
				</div>
				<div className={styles.metaItem}>
					<dt className={styles.metaLabel}>
						<AssembledText text="Amount" />
					</dt>
					<dd className={styles.metaValue}>{data.amount}</dd>
				</div>
			</dl>
		</div>
	);
}
