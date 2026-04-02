/**
 * @qscrape L2 / react / news / island
 * @component NewsStaffSpotlight
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { reporters } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

export default function NewsStaffSpotlight() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		fakeGet(null).then(() => setReady(true));
	}, []);

	if (!ready) {
		return (
			<div style={{ padding: '12px', color: '#888', fontFamily: 'system-ui' }}>
				Loading…
			</div>
		);
	}

	return (
		<div
			data-component="news-staff-spotlight"
			data-framework="react"
			style={{
				border: '1px solid var(--hn-border)',
				borderRadius: 'var(--hn-radius)',
				overflow: 'hidden',
				background: 'var(--hn-surface)',
			}}
		>
			<div
				style={{ background: 'var(--hn-masthead-bg)', padding: '10px 14px' }}
			>
				<h3
					style={{
						fontFamily: 'var(--hn-font-display)',
						fontSize: '12px',
						fontWeight: '700',
						color: 'var(--hn-masthead-text)',
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
					}}
				>
					Our Staff
				</h3>
			</div>
			<ul style={{ listStyle: 'none' }}>
				{reporters.map((r) => (
					<li
						key={r.email}
						data-reporter={r.name}
						data-beat={r.beat}
						style={{
							padding: '10px 14px',
							borderBottom: '1px solid var(--hn-border)',
						}}
					>
						<div
							style={{
								fontFamily: 'var(--hn-font-display)',
								fontSize: '13px',
								fontWeight: '600',
								color: 'var(--hn-text)',
							}}
						>
							{r.name}
						</div>
						<div
							style={{
								fontSize: '11px',
								color: 'var(--hn-muted)',
								fontFamily: 'var(--hn-font-ui)',
								marginTop: '2px',
							}}
						>
							{r.title}
						</div>
						<div
							style={{
								fontSize: '11px',
								color: 'var(--hn-accent)',
								fontFamily: 'var(--hn-font-ui)',
								marginTop: '1px',
							}}
						>
							{r.beat}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
