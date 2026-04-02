/**
 * @qscrape L2 / react / eshop / island
 * @component EshopPriceBadges
 */
import { useEffect, useState } from 'react';
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

export default function EshopPriceBadges() {
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

	const saleItems = products.filter((p) => p.salePrice).slice(0, 6);

	return (
		<div
			data-component="eshop-price-badges"
			data-framework="react"
			style={{
				border: '1px solid var(--vm-border)',
				borderRadius: 'var(--vm-radius)',
				padding: '16px',
				background: 'var(--vm-surface)',
			}}
		>
			<h3
				style={{
					fontSize: '13px',
					fontWeight: '700',
					marginBottom: '12px',
					color: 'var(--vm-text)',
					textTransform: 'uppercase',
					letterSpacing: '0.06em',
				}}
			>
				Sale Prices
			</h3>
			<ul
				style={{
					listStyle: 'none',
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',
				}}
			>
				{saleItems.map((p) => {
					const discount = Math.round(
						((p.basePrice - p.salePrice!) / p.basePrice) * 100,
					);
					return (
						<li
							key={p.sku}
							data-sku={p.sku}
							onClick={() => goToProduct(p.sku)}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								gap: '8px',
								paddingBottom: '10px',
								borderBottom: '1px solid var(--vm-border)',
								cursor: 'pointer',
							}}
						>
							<span
								style={{
									fontSize: '13px',
									color: 'var(--vm-text)',
									flex: 1,
									lineHeight: '1.3',
								}}
							>
								{p.name}
							</span>
							<span
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'flex-end',
									flexShrink: 0,
								}}
							>
								<span
									data-sale-price={p.salePrice!.toFixed(2)}
									style={{
										fontSize: '14px',
										fontWeight: '700',
										color: 'var(--vm-sale)',
									}}
								>
									{p.salePrice!.toFixed(2)} GS
								</span>
								<span
									data-base-price={p.basePrice.toFixed(2)}
									style={{
										fontSize: '11px',
										color: 'var(--vm-muted)',
										textDecoration: 'line-through',
									}}
								>
									{p.basePrice.toFixed(2)} GS
								</span>
								<span
									data-discount={discount}
									style={{
										fontSize: '10px',
										fontWeight: '700',
										color: 'var(--vm-cta)',
									}}
								>
									−{discount}%
								</span>
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
