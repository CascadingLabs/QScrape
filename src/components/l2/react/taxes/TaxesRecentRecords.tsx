/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesRecentRecords
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { deeds } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

function goToRecord(fileNum: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('file', fileNum);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('taxes:view', { detail: fileNum }));
	window.scrollTo(0, 0);
}

const recent = deeds.slice(0, 8);

export default function TaxesRecentRecords() {
	const [ready, setReady] = useState(false);
	const [hovered, setHovered] = useState<string | null>(null);

	useEffect(() => {
		fakeGet(null).then(() => setReady(true));
	}, []);

	if (!ready) {
		return (
			<div
				style={{
					padding: '12px',
					color: 'var(--er-muted)',
					fontFamily: 'var(--er-font)',
				}}
			>
				Loading…
			</div>
		);
	}

	return (
		<div
			data-component="taxes-recent-records"
			data-framework="react"
			style={{
				background: 'var(--er-surface)',
				border: '1px solid var(--er-border)',
				borderRadius: 'var(--er-radius)',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					background: 'var(--er-bg)',
					borderBottom: '1px solid var(--er-border)',
					padding: '10px 14px',
					fontSize: '12px',
					fontWeight: '700',
					color: 'var(--er-muted)',
					letterSpacing: '0.04em',
					textTransform: 'uppercase',
					fontFamily: 'var(--er-font)',
				}}
			>
				Recent Filings
			</div>
			<div style={{ padding: '8px' }}>
				{recent.map((d) => (
					<button
						key={d.fileNum}
						type="button"
						data-file-num={d.fileNum}
						onClick={() => goToRecord(d.fileNum)}
						onMouseEnter={() => setHovered(d.fileNum)}
						onMouseLeave={() => setHovered(null)}
						style={{
							width: '100%',
							textAlign: 'left',
							padding: '8px 10px',
							borderRadius: '3px',
							border: 'none',
							background:
								hovered === d.fileNum ? 'var(--er-bg)' : 'transparent',
							cursor: 'pointer',
							fontFamily: 'var(--er-font)',
							marginBottom: '2px',
							display: 'block',
						}}
					>
						<div
							style={{
								fontSize: '12px',
								fontFamily: 'monospace',
								fontWeight: '600',
								color: 'var(--er-primary)',
								marginBottom: '2px',
							}}
						>
							{d.fileNum}
						</div>
						<div
							style={{
								fontSize: '12px',
								color: 'var(--er-text)',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							<span
								style={{
									background: 'var(--er-bg)',
									border: '1px solid var(--er-border)',
									borderRadius: '2px',
									padding: '0 4px',
									fontSize: '10px',
									fontWeight: '700',
									marginRight: '5px',
								}}
							>
								{d.index}
							</span>
							{d.lastFirm}
						</div>
						<div
							style={{
								fontSize: '11px',
								color: 'var(--er-muted)',
								marginTop: '2px',
							}}
						>
							{d.recordDate}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
