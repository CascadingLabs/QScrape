import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import {
	formatPrice,
	getFeatured,
	getPromoted,
	type ProductMeta,
} from '../../../../data/eshop/products';
import '../../../../styles/l3/eshop.css';

function SkuCanvas(props: { sku: string }) {
	let canvas: HTMLCanvasElement | undefined;
	onMount(() => {
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = '11px "DM Sans", system-ui, sans-serif';
		ctx.fillStyle = 'var(--vm3-muted)';
		ctx.fillText(props.sku, 0, 12);
	});
	return (
		<canvas
			ref={canvas}
			width={140}
			height={16}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
		/>
	);
}

function RatingCanvas(props: { rating: number; count: number }) {
	let canvas: HTMLCanvasElement | undefined;
	onMount(() => {
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = '12px "DM Sans", system-ui, sans-serif';
		ctx.fillStyle = 'oklch(58% 0.22 25)';
		ctx.fillText(`★ ${props.rating.toFixed(1)} (${props.count})`, 0, 13);
	});
	return (
		<canvas
			ref={canvas}
			width={120}
			height={18}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
		/>
	);
}

type BannerItem = ProductMeta & { section: 'featured' | 'promoted' };

export default function EshopFeaturedBanner() {
	const [items, setItems] = createSignal<BannerItem[] | null>(null);

	onMount(() => {
		const featured = getFeatured().map(
			(p): BannerItem => ({ ...p, section: 'featured' }),
		);
		const promoted = getPromoted().map(
			(p): BannerItem => ({ ...p, section: 'promoted' }),
		);
		fakeGetMs([...featured, ...promoted], 300, 200).then(setItems);
	});

	return (
		<div>
			<Show when={!items()}>
				<div class="vm3-feat-loading">Loading…</div>
			</Show>
			<Show when={items()}>
				<div class="vm3-feat-root">
					<h3 class="vm3-feat-title">Featured &amp; Promoted</h3>
					<ul class="vm3-feat-list">
						<For each={items() ?? []}>
							{(item) => (
								<li class="vm3-feat-item" data-section={item.section}>
									<a
										href={`/l3/eshop/product/${item.sku}/`}
										class="vm3-feat-link"
									>
										<img
											src={item.image}
											alt={item.name}
											class="vm3-feat-img"
											loading="lazy"
										/>
										<div class="vm3-feat-info">
											<span class="vm3-feat-name">{item.name}</span>
											<span class="vm3-feat-sku">
												<SkuCanvas sku={item.sku} />
											</span>
											<span class="vm3-feat-price">
												{formatPrice(item.salePrice ?? item.basePrice)}
											</span>
											<span class="vm3-feat-rating">
												<RatingCanvas
													rating={item.rating}
													count={item.reviewCount}
												/>
											</span>
										</div>
									</a>
								</li>
							)}
						</For>
					</ul>
				</div>
			</Show>
			<style>{`
				.vm3-feat-loading {
					min-height: 80px;
					display: flex;
					align-items: center;
					color: var(--vm3-muted);
					font-family: var(--vm3-font);
					font-size: 14px;
				}
				.vm3-feat-root {
					background: var(--vm3-surface2);
					border: 1px solid var(--vm3-border);
					border-radius: var(--vm3-radius);
					padding: 16px;
				}
				.vm3-feat-title {
					font-family: var(--vm3-font);
					font-size: 14px;
					font-weight: 700;
					color: var(--vm3-text);
					text-transform: uppercase;
					letter-spacing: 0.06em;
					margin: 0 0 12px;
					padding-bottom: 8px;
					border-bottom: 2px solid var(--vm3-primary);
				}
				.vm3-feat-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.vm3-feat-item {
					border-bottom: 1px solid var(--vm3-border);
				}
				.vm3-feat-item:last-child { border-bottom: none; }
				.vm3-feat-link {
					display: flex;
					gap: 10px;
					align-items: center;
					padding: 10px 0;
					text-decoration: none;
					color: inherit;
				}
				.vm3-feat-link:hover .vm3-feat-name { color: var(--vm3-primary); }
				.vm3-feat-img {
					width: 52px;
					height: 40px;
					object-fit: cover;
					border-radius: 4px;
					flex-shrink: 0;
				}
				.vm3-feat-info {
					display: flex;
					flex-direction: column;
					gap: 2px;
					min-width: 0;
				}
				.vm3-feat-name {
					font-family: var(--vm3-font);
					font-size: 13px;
					font-weight: 600;
					color: var(--vm3-text);
					line-height: 1.3;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					transition: color 0.15s;
				}
				.vm3-feat-sku {
					display: block;
				}
				.vm3-feat-price {
					font-family: var(--vm3-font);
					font-size: 12px;
					font-weight: 600;
					color: var(--vm3-cta);
				}
				.vm3-feat-rating {
					display: block;
				}
			`}</style>
		</div>
	);
}
