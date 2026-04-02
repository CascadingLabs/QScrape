// @qscrape L3 / react island / taxes — search form
// Anti-bot: CSS-assembled text — field labels rendered in shuffled DOM order,
// CSS flex `order` restores visual sequence. textContent returns scrambled words.
import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import { type IndexType, indexTypes } from '../../../../data/taxes/deeds';
import '../../../../styles/l3/taxes.css';
import styles from './TaxesSearchForm.module.css';

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

interface FormState {
	ready: boolean;
	indexTypes: IndexType[];
}

export default function TaxesSearchForm() {
	const [form, setForm] = useState<FormState | null>(null);

	useEffect(() => {
		fakeGetMs({ ready: true, indexTypes }, 400, 250).then(setForm);
	}, []);

	if (!form) {
		return <div className={styles.loading}>Loading…</div>;
	}

	return (
		<div className={styles.root}>
			<h2 className={styles.heading}>
				<AssembledText text="Search Property Records" />
			</h2>
			<form method="get" action="/l3/taxes/" className={styles.form}>
				<div className={styles.fieldGroup}>
					<label htmlFor="er3-parcel" className={styles.label}>
						<AssembledText text="Parcel ID" />
					</label>
					<input
						id="er3-parcel"
						name="q"
						type="text"
						placeholder="e.g. 26-008492"
						className={styles.input}
						autoComplete="off"
					/>
				</div>
				<div className={styles.fieldGroup}>
					<label htmlFor="er3-owner" className={styles.label}>
						<AssembledText text="Owner Name or Firm" />
					</label>
					<input
						id="er3-owner"
						name="q"
						type="text"
						placeholder="e.g. ARMOK HOLDINGS"
						className={styles.input}
						autoComplete="off"
					/>
				</div>
				<div className={styles.fieldGroup}>
					<label htmlFor="er3-index" className={styles.label}>
						<AssembledText text="Document Type" />
					</label>
					<select id="er3-index" name="index" className={styles.select}>
						<option value="ALL">All Types</option>
						{form.indexTypes.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>
				<div className={styles.actions}>
					<button type="submit" className={styles.btn}>
						Search Records
					</button>
				</div>
			</form>
		</div>
	);
}
