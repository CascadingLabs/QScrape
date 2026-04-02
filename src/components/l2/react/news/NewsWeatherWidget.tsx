/**
 * @qscrape L2 / react / news / island
 * @component NewsWeatherWidget
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { getBreaking } from '../../../../data/news/articles';
import {
	advisories,
	metrics,
	statusColor,
	updated,
	zones,
} from '../../../../data/news/geomantic';
import '../../../../styles/l2/news.css';

const breaking = getBreaking();

function goToArticle(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('id', id);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('news:article', { detail: id }));
	window.scrollTo(0, 0);
}

export default function NewsWeatherWidget() {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		fakeGet(null).then(() => setReady(true));
	}, []);

	if (!ready) {
		return (
			<div
				style={{
					padding: '12px',
					color: 'var(--hn-muted)',
					fontFamily: 'var(--hn-font-ui)',
				}}
			>
				Loading…
			</div>
		);
	}

	return (
		<div data-component="news-weather-widget" data-framework="react">
			{breaking.length > 0 && (
				<div
					style={{
						border: '1px solid var(--hn-border)',
						borderRadius: 'var(--hn-radius)',
						overflow: 'hidden',
						background: 'var(--hn-surface)',
						marginBottom: '16px',
					}}
				>
					<div
						style={{ background: 'var(--hn-masthead-bg)', padding: '8px 12px' }}
					>
						<h4
							style={{
								fontFamily: 'var(--hn-font-ui)',
								fontSize: '11px',
								fontWeight: '700',
								color: 'var(--hn-masthead-text)',
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
							}}
						>
							Breaking
						</h4>
					</div>
					<div>
						{breaking.map((a) => (
							<button
								key={a.id}
								type="button"
								data-article-id={a.id}
								onClick={() => goToArticle(a.id)}
								style={{
									display: 'block',
									width: '100%',
									background: 'none',
									border: 'none',
									borderBottom: '1px solid var(--hn-border)',
									padding: '9px 12px',
									textAlign: 'left',
									cursor: 'pointer',
									fontFamily: 'var(--hn-font-display)',
									fontSize: '13px',
									fontWeight: '600',
									color: 'var(--hn-text)',
									lineHeight: '1.3',
								}}
							>
								{a.headline}
							</button>
						))}
					</div>
				</div>
			)}

			<div
				style={{
					border: '1px solid var(--hn-border)',
					borderRadius: 'var(--hn-radius)',
					overflow: 'hidden',
					background: 'var(--hn-surface)',
				}}
			>
				<div
					style={{ background: 'var(--hn-masthead-bg)', padding: '8px 12px' }}
				>
					<h4
						style={{
							fontFamily: 'var(--hn-font-ui)',
							fontSize: '11px',
							fontWeight: '700',
							color: 'var(--hn-masthead-text)',
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
						}}
					>
						Geomantic Conditions
					</h4>
				</div>
				<table
					style={{
						width: '100%',
						borderCollapse: 'collapse',
						fontFamily: 'var(--hn-font-ui)',
						fontSize: '11px',
					}}
				>
					<thead>
						<tr style={{ background: 'var(--hn-bg)' }}>
							<th
								style={{
									padding: '5px 8px',
									textAlign: 'left',
									color: 'var(--hn-muted)',
									fontWeight: '600',
									borderBottom: '1px solid var(--hn-border)',
								}}
							>
								Zone
							</th>
							<th
								style={{
									padding: '5px 8px',
									textAlign: 'left',
									color: 'var(--hn-muted)',
									fontWeight: '600',
									borderBottom: '1px solid var(--hn-border)',
								}}
							>
								Status
							</th>
							<th
								style={{
									padding: '5px 8px',
									textAlign: 'right',
									color: 'var(--hn-muted)',
									fontWeight: '600',
									borderBottom: '1px solid var(--hn-border)',
								}}
							>
								Temp
							</th>
						</tr>
					</thead>
					<tbody>
						{zones.map((z) => (
							<tr
								key={z.zone}
								style={{ borderTop: '1px solid var(--hn-border)' }}
							>
								<td
									style={{
										padding: '4px 8px',
										color: 'var(--hn-text)',
										whiteSpace: 'nowrap',
									}}
								>
									{z.zone}
								</td>
								<td style={{ padding: '4px 8px' }}>
									<span
										data-status={z.statusClass}
										style={{
											color: statusColor[z.statusClass],
											fontWeight: '700',
											fontSize: '10px',
										}}
									>
										{z.status}
									</span>
								</td>
								<td
									style={{
										padding: '4px 8px',
										textAlign: 'right',
										color: 'var(--hn-muted)',
										whiteSpace: 'nowrap',
									}}
								>
									{z.temp}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div
					style={{
						padding: '8px 12px',
						borderTop: '1px solid var(--hn-border)',
						fontFamily: 'var(--hn-font-ui)',
						fontSize: '11px',
					}}
				>
					<div
						style={{
							color: 'var(--hn-muted)',
							marginBottom: '6px',
							lineHeight: '1.6',
						}}
					>
						<span style={{ color: 'var(--hn-text)', fontWeight: '600' }}>
							Seismic:
						</span>{' '}
						{metrics.seismic}
						<br />
						<span style={{ color: 'var(--hn-text)', fontWeight: '600' }}>
							Magma:
						</span>{' '}
						{metrics.magma}
						<br />
						<span style={{ color: 'var(--hn-text)', fontWeight: '600' }}>
							Aquifer:
						</span>{' '}
						{metrics.aquifer}
						<br />
						<span style={{ color: 'var(--hn-text)', fontWeight: '600' }}>
							Wind:
						</span>{' '}
						{metrics.wind}
					</div>
					{advisories.map((a) => (
						<div
							key={a}
							style={{
								color: '#dc2626',
								fontSize: '10px',
								marginBottom: '2px',
							}}
						>
							⚠ {a}
						</div>
					))}
					<div
						style={{
							color: 'var(--hn-muted)',
							fontSize: '10px',
							marginTop: '6px',
							lineHeight: '1.5',
						}}
					>
						Updated: {updated}
						<br />
						Source: Geomancer's Office
					</div>
				</div>
			</div>
		</div>
	);
}
