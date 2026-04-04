import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import {
	type GeomanticZone,
	getLiveGeomantic,
	statusColor,
} from '../../../../data/news/geomantic';
import '../../../../styles/l3/news.css';
import styles from './NewsWeatherZones.module.css';

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

export default function NewsWeatherZones() {
	const [zones, setZones] = useState<GeomanticZone[] | null>(null);

	useEffect(() => {
		fakeGetMs(getLiveGeomantic().zones, 400, 250).then(setZones);
	}, []);

	if (!zones) {
		return <div className={styles.loading}>Loading…</div>;
	}

	return (
		<div className={styles.root}>
			<table className={styles.table}>
				<thead>
					<tr className={styles.headRow}>
						<th className={styles.th}>Zone</th>
						<th className={styles.th}>Status</th>
						<th className={`${styles.th} ${styles.thRight}`}>Temp</th>
					</tr>
				</thead>
				<tbody>
					{zones.map((z) => (
						<tr key={z.zone} className={styles.row} data-zone={z.zone}>
							<td className={styles.td}>
								<AssembledText text={z.zone} />
							</td>
							<td className={styles.td}>
								<span
									className={styles.status}
									data-status={z.statusClass}
									style={{ color: statusColor[z.statusClass] }}
								>
									<AssembledText text={z.status} />
								</span>
							</td>
							<td className={`${styles.td} ${styles.tdRight}`}>
								<AssembledText text={z.temp} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
