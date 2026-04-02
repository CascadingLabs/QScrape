/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesHowToInfo
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

export default function TaxesHowToInfo() {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		fakeGet(null).then(() => setReady(true));
	}, []);
	if (!ready) {
		return (
			<div
				style={{
					padding: '16px',
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
			data-component="taxes-how-to-info"
			data-framework="react"
			style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
		>
			<div
				style={{
					background: 'var(--er-surface)',
					border: '1px solid var(--er-border)',
					borderRadius: 'var(--er-radius)',
					padding: '16px',
					fontFamily: 'var(--er-font)',
				}}
			>
				<div
					style={{
						fontSize: '11px',
						fontWeight: '700',
						color: 'var(--er-muted)',
						textTransform: 'uppercase',
						letterSpacing: '0.04em',
						marginBottom: '10px',
					}}
				>
					About These Guides
				</div>
				<p
					style={{
						fontSize: '13px',
						color: 'var(--er-text)',
						lineHeight: '1.6',
						marginBottom: '10px',
					}}
				>
					Official guides for property owners, attorneys, contractors, and clan
					representatives. Each guide covers purpose, required elements, filing
					process, and common pitfalls.
				</p>
				<p style={{ fontSize: '13px', color: 'var(--er-muted)' }}>
					For the fee schedule see{' '}
					<a
						href="/l2/taxes/recording-fees/"
						style={{ color: 'var(--er-primary)' }}
					>
						Recording Fees
					</a>
					.
				</p>
			</div>
			<div
				style={{
					background: 'var(--er-surface)',
					border: '1px solid var(--er-border)',
					borderRadius: 'var(--er-radius)',
					overflow: 'hidden',
					fontFamily: 'var(--er-font)',
				}}
			>
				<div
					style={{
						background: 'var(--er-bg)',
						borderBottom: '1px solid var(--er-border)',
						padding: '10px 14px',
						fontSize: '11px',
						fontWeight: '700',
						color: 'var(--er-muted)',
						textTransform: 'uppercase',
						letterSpacing: '0.04em',
					}}
				>
					Public Counter
				</div>
				<div
					style={{
						padding: '14px',
						fontSize: '13px',
						color: 'var(--er-text)',
						lineHeight: '1.8',
					}}
				>
					<div data-field="address">Hall of Records, Level Z-1, Room 14</div>
					<div>Mountainhome Civic Quarter</div>
					<div data-field="phone">Rune-Wire: (555) 234-5678</div>
					<div data-field="hours">Hours: M–F 8:30AM–5:00PM</div>
					<div data-field="email">
						<a
							href="mailto:rod@eldoria.gov"
							style={{ color: 'var(--er-primary)' }}
						>
							rod@eldoria.gov
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
