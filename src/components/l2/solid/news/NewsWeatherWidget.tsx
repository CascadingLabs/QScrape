/**
 * @qscrape L2 / solid / news / island
 * @component NewsWeatherWidget
 */
import { createSignal, For, onMount, Show } from 'solid-js';
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

const hdr: Record<string, string | number> = {
	background: 'var(--hn-masthead-bg)',
	padding: '8px 12px',
};
const ttl: Record<string, string | number> = {
	'font-family': 'var(--hn-font-ui)',
	'font-size': '11px',
	'font-weight': '700',
	color: 'var(--hn-masthead-text)',
	'text-transform': 'uppercase',
	'letter-spacing': '0.08em',
};
const box: Record<string, string | number> = {
	border: '1px solid var(--hn-border)',
	'border-radius': 'var(--hn-radius)',
	overflow: 'hidden',
	background: 'var(--hn-surface)',
};

export default function NewsWeatherWidget() {
	const [ready, setReady] = createSignal(false);

	onMount(() => {
		fakeGet(null).then(() => setReady(true));
	});

	return (
		<>
			<Show when={!ready()}>
				<div
					style={{
						padding: '12px',
						color: 'var(--hn-muted)',
						'font-family': 'var(--hn-font-ui)',
					}}
				>
					Loading…
				</div>
			</Show>
			<Show when={ready()}>
				<div data-component="news-weather-widget" data-framework="solid">
					<Show when={breaking.length > 0}>
						<div style={{ ...box, 'margin-bottom': '16px' }}>
							<div style={hdr}>
								<h4 style={ttl}>Breaking</h4>
							</div>
							<div>
								<For each={breaking}>
									{(a) => (
										<button
											type="button"
											data-article-id={a.id}
											onClick={() => goToArticle(a.id)}
											style={{
												display: 'block',
												width: '100%',
												background: 'none',
												border: 'none',
												'border-bottom': '1px solid var(--hn-border)',
												padding: '9px 12px',
												'text-align': 'left',
												cursor: 'pointer',
												'font-family': 'var(--hn-font-display)',
												'font-size': '13px',
												'font-weight': '600',
												color: 'var(--hn-text)',
												'line-height': '1.3',
											}}
										>
											{a.headline}
										</button>
									)}
								</For>
							</div>
						</div>
					</Show>

					<div style={box}>
						<div style={hdr}>
							<h4 style={ttl}>Geomantic Conditions</h4>
						</div>
						<table
							style={{
								width: '100%',
								'border-collapse': 'collapse',
								'font-family': 'var(--hn-font-ui)',
								'font-size': '11px',
							}}
						>
							<thead>
								<tr style={{ background: 'var(--hn-bg)' }}>
									<th
										style={{
											padding: '5px 8px',
											'text-align': 'left',
											color: 'var(--hn-muted)',
											'font-weight': '600',
											'border-bottom': '1px solid var(--hn-border)',
										}}
									>
										Zone
									</th>
									<th
										style={{
											padding: '5px 8px',
											'text-align': 'left',
											color: 'var(--hn-muted)',
											'font-weight': '600',
											'border-bottom': '1px solid var(--hn-border)',
										}}
									>
										Status
									</th>
									<th
										style={{
											padding: '5px 8px',
											'text-align': 'right',
											color: 'var(--hn-muted)',
											'font-weight': '600',
											'border-bottom': '1px solid var(--hn-border)',
										}}
									>
										Temp
									</th>
								</tr>
							</thead>
							<tbody>
								<For each={zones}>
									{(z) => (
										<tr style={{ 'border-top': '1px solid var(--hn-border)' }}>
											<td
												style={{
													padding: '4px 8px',
													color: 'var(--hn-text)',
													'white-space': 'nowrap',
												}}
											>
												{z.zone}
											</td>
											<td style={{ padding: '4px 8px' }}>
												<span
													data-status={z.statusClass}
													style={{
														color: statusColor[z.statusClass],
														'font-weight': '700',
														'font-size': '10px',
													}}
												>
													{z.status}
												</span>
											</td>
											<td
												style={{
													padding: '4px 8px',
													'text-align': 'right',
													color: 'var(--hn-muted)',
													'white-space': 'nowrap',
												}}
											>
												{z.temp}
											</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
						<div
							style={{
								padding: '8px 12px',
								'border-top': '1px solid var(--hn-border)',
								'font-family': 'var(--hn-font-ui)',
								'font-size': '11px',
							}}
						>
							<div
								style={{
									color: 'var(--hn-muted)',
									'margin-bottom': '6px',
									'line-height': '1.6',
								}}
							>
								<span style={{ color: 'var(--hn-text)', 'font-weight': '600' }}>
									Seismic:
								</span>{' '}
								{metrics.seismic}
								<br />
								<span style={{ color: 'var(--hn-text)', 'font-weight': '600' }}>
									Magma:
								</span>{' '}
								{metrics.magma}
								<br />
								<span style={{ color: 'var(--hn-text)', 'font-weight': '600' }}>
									Aquifer:
								</span>{' '}
								{metrics.aquifer}
								<br />
								<span style={{ color: 'var(--hn-text)', 'font-weight': '600' }}>
									Wind:
								</span>{' '}
								{metrics.wind}
							</div>
							<For each={advisories}>
								{(a) => (
									<div
										style={{
											color: '#dc2626',
											'font-size': '10px',
											'margin-bottom': '2px',
										}}
									>
										⚠ {a}
									</div>
								)}
							</For>
							<div
								style={{
									color: 'var(--hn-muted)',
									'font-size': '10px',
									'margin-top': '6px',
									'line-height': '1.5',
								}}
							>
								Updated: {updated}
								<br />
								Source: Geomancer's Office
							</div>
						</div>
					</div>
				</div>
			</Show>
		</>
	);
}
