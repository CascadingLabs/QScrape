/**
 * @qscrape L2 / solid / eshop / island
 * @component EshopFeaturedBanner
 */
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { getFeatured } from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

const featured = getFeatured().slice(0, 4);

function goToProduct(sku: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('sku', sku);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('eshop:product', { detail: sku }));
	window.scrollTo(0, 0);
}

export default function EshopFeaturedBanner() {
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
				data-component="eshop-featured-banner"
				data-framework="solid"
				style={{
					border: '1px solid var(--vm-border)',
					'border-radius': 'var(--vm-radius)',
					overflow: 'hidden',
					background: 'var(--vm-surface)',
				}}
			>
				<div style={{ background: 'var(--vm-primary)', padding: '12px 16px' }}>
					<h3
						style={{
							'font-size': '13px',
							'font-weight': '700',
							color: '#fff',
							'text-transform': 'uppercase',
							'letter-spacing': '0.06em',
						}}
					>
						Featured Products
					</h3>
				</div>
				<div
					style={{
						padding: '12px 16px',
						display: 'flex',
						'flex-direction': 'column',
						gap: '12px',
					}}
				>
					<For each={featured}>
						{(p) => (
							<div
								data-sku={p.sku}
								data-featured="true"
								onClick={() => goToProduct(p.sku)}
								style={{
									display: 'flex',
									gap: '10px',
									'align-items': 'center',
									cursor: 'pointer',
								}}
							>
								<img
									src={p.image}
									alt={p.name}
									width="60"
									height="45"
									loading="lazy"
									style={{
										width: '60px',
										height: '45px',
										'object-fit': 'cover',
										'border-radius': '4px',
										'flex-shrink': '0',
									}}
								/>
								<div>
									<div
										style={{
											'font-size': '13px',
											'font-weight': '600',
											color: 'var(--vm-text)',
											'line-height': '1.3',
											'margin-bottom': '2px',
										}}
									>
										{p.name}
									</div>
									<div
										data-price={(p.salePrice ?? p.basePrice).toFixed(2)}
										style={{
											'font-size': '13px',
											color: p.salePrice
												? 'var(--vm-sale)'
												: 'var(--vm-primary)',
											'font-weight': '600',
										}}
									>
										{(p.salePrice ?? p.basePrice).toFixed(2)} GS
									</div>
								</div>
							</div>
						)}
					</For>
				</div>
			</div>
		</Show>
	);
}
