// @qscrape L3 / solid island / eshop — product rating + related products (product detail page)
// Anti-bot: rating value and review count drawn to <canvas> — not present in DOM text at all
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import {
	getByCategory,
	getProductBySku,
	type ProductMeta,
} from '../../../../data/eshop/products';
import '../../../../styles/l3/eshop.css';

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
		const w = canvas.width;
		const h = canvas.height;
		ctx.clearRect(0, 0, w, h);

		// Draw star bar background
		ctx.fillStyle = '#2a2a2a';
		ctx.fillRect(0, 0, w, h);

		// Draw filled stars proportional to rating
		const starFill = (props.rating / 5) * w;
		ctx.fillStyle = 'oklch(58% 0.22 25)';
		ctx.fillRect(0, 0, starFill, h);

		// Draw rating text over bar
		ctx.font = 'bold 13px "DM Sans", system-ui, sans-serif';
		ctx.fillStyle = '#fff';
		ctx.textBaseline = 'middle';
		ctx.fillText(
			`${props.rating.toFixed(1)} / 5.0  (${props.count} reviews)`,
			8,
			h / 2,
		);
	});
	return (
		<canvas
			ref={canvas}
			width={240}
			height={28}
			style={{ display: 'block', 'border-radius': '4px' }}
			aria-label="product rating"
		/>
	);
}

type RatingData = {
	product: ProductMeta;
	related: ProductMeta[];
};

export default function EshopProductRating(props: { sku: string }) {
	const [data, setData] = createSignal<RatingData | null>(null);

	onMount(() => {
		const p = getProductBySku(props.sku);
		if (!p) {
			return;
		}
		const related = getByCategory(p.category)
			.filter((r) => r.sku !== p.sku)
			.slice(0, 4);
		fakeGetMs({ product: p, related }, 300, 200).then(setData);
	});

	return (
		<div data-island="solid-product-rating">
			<Show when={!data()}>
				<div class="vm3-rat-loading">Loading…</div>
			</Show>
			<Show when={data()}>
				<div class="vm3-rat-root" data-sku={data()?.product.sku}>
					<div class="vm3-rat-section">
						<span class="vm3-rat-label">Rating</span>
						<RatingCanvas
							rating={data()?.product.rating}
							count={data()?.product.reviewCount}
						/>
					</div>
					<Show when={data()?.related.length > 0}>
						<div class="vm3-rat-related">
							<span class="vm3-rat-label">
								More in {data()?.product.category}
							</span>
							<ul class="vm3-rat-rel-list">
								<For each={data()?.related}>
									{(rel) => (
										<li>
											<a
												href={`/l3/eshop/product/${rel.sku}/`}
												class="vm3-rat-rel-link"
											>
												{rel.name}
											</a>
										</li>
									)}
								</For>
							</ul>
						</div>
					</Show>
				</div>
			</Show>
			<style>{`
				.vm3-rat-loading {
					min-height: 80px;
					display: flex;
					align-items: center;
					color: var(--vm3-muted);
					font-family: var(--vm3-font);
					font-size: 14px;
				}
				.vm3-rat-root {
					background: var(--vm3-surface2);
					border: 1px solid var(--vm3-border);
					border-radius: var(--vm3-radius);
					padding: 20px;
					display: flex;
					flex-direction: column;
					gap: 16px;
				}
				.vm3-rat-label {
					display: block;
					font-family: var(--vm3-font);
					font-size: 11px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.07em;
					color: var(--vm3-muted);
					margin-bottom: 6px;
				}
				.vm3-rat-section {
					display: flex;
					flex-direction: column;
					gap: 4px;
				}
				.vm3-rat-related {
					display: flex;
					flex-direction: column;
				}
				.vm3-rat-rel-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 6px;
				}
				.vm3-rat-rel-link {
					font-family: var(--vm3-font);
					font-size: 13px;
					color: var(--vm3-primary);
					text-decoration: none;
				}
				.vm3-rat-rel-link:hover {
					text-decoration: underline;
				}
			`}</style>
		</div>
	);
}
