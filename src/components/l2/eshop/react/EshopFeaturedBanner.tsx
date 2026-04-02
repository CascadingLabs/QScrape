/**
 * @qscrape L2 / react / eshop / island
 * @component EshopFeaturedBanner
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { getFeatured } from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

function goToProduct(sku: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('sku', sku);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('eshop:product', { detail: sku }));
	window.scrollTo(0, 0);
}

export default function EshopFeaturedBanner() {
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

	const featured = getFeatured().slice(0, 4);

	return (
		<div
			data-component="eshop-featured-banner"
			data-framework="react"
			style={{
				border: '1px solid var(--vm-border)',
				borderRadius: 'var(--vm-radius)',
				overflow: 'hidden',
				background: 'var(--vm-surface)',
			}}
		>
			<div
				style={{
					background: 'var(--vm-primary)',
					padding: '12px 16px',
					color: '#fff',
				}}
			>
				<h3
					style={{
						fontSize: '13px',
						fontWeight: '700',
						textTransform: 'uppercase',
						letterSpacing: '0.06em',
					}}
				>
					Featured Products
				</h3>
			</div>
			<div
				style={{
					padding: '12px 16px',
					display: 'flex',
					flexDirection: 'column',
					gap: '12px',
				}}
			>
				{featured.map((p) => (
					<div
						key={p.sku}
						data-sku={p.sku}
						data-featured="true"
						onClick={() => goToProduct(p.sku)}
						style={{
							display: 'flex',
							gap: '10px',
							alignItems: 'center',
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
								objectFit: 'cover',
								borderRadius: '4px',
								flexShrink: 0,
							}}
						/>
						<div>
							<div
								style={{
									fontSize: '13px',
									fontWeight: '600',
									color: 'var(--vm-text)',
									lineHeight: '1.3',
									marginBottom: '2px',
								}}
							>
								{p.name}
							</div>
							<div
								style={{
									fontSize: '13px',
									color: p.salePrice ? 'var(--vm-sale)' : 'var(--vm-primary)',
									fontWeight: '600',
								}}
								data-price={(p.salePrice ?? p.basePrice).toFixed(2)}
							>
								{(p.salePrice ?? p.basePrice).toFixed(2)} GS
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
