/**
 * @qscrape L2 / solid / eshop / island
 * @component EshopPriceBadges
 */
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { products } from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

function goToProduct(sku: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('sku', sku);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('eshop:product', { detail: sku }));
	window.scrollTo(0, 0);
}

const saleItems = products
	.filter((p) => p.salePrice)
	.slice(0, 6)
	.map((p) => ({
		...p,
		discount: Math.round(((p.basePrice - p.salePrice!) / p.basePrice) * 100),
	}));

export default function EshopPriceBadges() {
	const [ready, setReady] = createSignal(false);

	onMount(() => {
		fakeGet(null).then(() => setReady(true));
	});

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{ padding: '12px', color: '#888', 'font-family': 'system-ui' }}
				>
					Loading…
				</div>
			}
		>
			<div
				data-component="eshop-price-badges"
				data-framework="solid"
				style={{
					border: '1px solid var(--vm-border)',
					'border-radius': 'var(--vm-radius)',
					padding: '16px',
					background: 'var(--vm-surface)',
				}}
			>
				<h3
					style={{
						'font-size': '13px',
						'font-weight': '700',
						'margin-bottom': '12px',
						color: 'var(--vm-text)',
						'text-transform': 'uppercase',
						'letter-spacing': '0.06em',
					}}
				>
					Sale Prices
				</h3>
				<ul
					style={{
						'list-style': 'none',
						display: 'flex',
						'flex-direction': 'column',
						gap: '10px',
					}}
				>
					<For each={saleItems}>
						{(p) => (
							<li
								data-sku={p.sku}
								onClick={() => goToProduct(p.sku)}
								style={{
									display: 'flex',
									'justify-content': 'space-between',
									'align-items': 'flex-start',
									gap: '8px',
									'padding-bottom': '10px',
									'border-bottom': '1px solid var(--vm-border)',
									cursor: 'pointer',
								}}
							>
								<span
									style={{
										'font-size': '13px',
										color: 'var(--vm-text)',
										flex: '1',
										'line-height': '1.3',
									}}
								>
									{p.name}
								</span>
								<span
									style={{
										display: 'flex',
										'flex-direction': 'column',
										'align-items': 'flex-end',
										'flex-shrink': '0',
									}}
								>
									<span
										data-sale-price={p.salePrice!.toFixed(2)}
										style={{
											'font-size': '14px',
											'font-weight': '700',
											color: 'var(--vm-sale)',
										}}
									>
										{p.salePrice!.toFixed(2)} GS
									</span>
									<span
										data-base-price={p.basePrice.toFixed(2)}
										style={{
											'font-size': '11px',
											color: 'var(--vm-muted)',
											'text-decoration': 'line-through',
										}}
									>
										{p.basePrice.toFixed(2)} GS
									</span>
									<span
										data-discount={p.discount}
										style={{
											'font-size': '10px',
											'font-weight': '700',
											color: 'var(--vm-cta)',
										}}
									>
										−{p.discount}%
									</span>
								</span>
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	);
}
