import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import {
	getByCategory,
	getProductBySku,
	type ProductMeta,
} from '../../../../data/eshop/products';
import '../../../../styles/l3/eshop.css';

function CanvasText(props: {
	text: string;
	width?: number;
	fontSize?: number;
	color?: string;
	fontWeight?: string;
}) {
	let canvas: HTMLCanvasElement | undefined;
	onMount(() => {
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		const size = props.fontSize ?? 12;
		const weight = props.fontWeight ?? '400';
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = `${weight} ${size}px "DM Sans", system-ui, sans-serif`;
		ctx.fillStyle = props.color ?? 'var(--vm3-text)';
		ctx.fillText(props.text, 0, size + 2);
	});
	return (
		<canvas
			ref={canvas}
			width={props.width ?? 200}
			height={(props.fontSize ?? 12) + 6}
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
		const w = canvas.width;
		const h = canvas.height;
		ctx.clearRect(0, 0, w, h);

		ctx.fillStyle = '#2a2a2a';
		ctx.fillRect(0, 0, w, h);

		const starFill = (props.rating / 5) * w;
		ctx.fillStyle = 'oklch(58% 0.22 25)';
		ctx.fillRect(0, 0, starFill, h);

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
		<div>
			<Show when={!data()}>
				<div class="a">Loading…</div>
			</Show>
			<Show when={data()}>
				<div class="b" data-0={data()?.product.sku}>
					<div class="d">
						<span class="c">Rating</span>
						<RatingCanvas
							rating={data()?.product.rating}
							count={data()?.product.reviewCount}
						/>
					</div>
					<Show when={data()?.related.length > 0}>
						<div class="e">
							<span class="c">
								<CanvasText
									text={`More in ${data()?.product.category}`}
									width={200}
									fontSize={11}
									fontWeight="700"
									color="var(--vm3-muted)"
								/>
							</span>
							<ul class="f">
								<For each={data()?.related}>
									{(rel) => (
										<li>
											<a href={`/l3/eshop/product/${rel.sku}/`} class="g">
												<CanvasText
													text={rel.name}
													width={220}
													fontSize={13}
													color="oklch(58% 0.2 255)"
												/>
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
				.a {
					min-height: 80px;
					display: flex;
					align-items: center;
					color: var(--vm3-muted);
					font-family: var(--vm3-font);
					font-size: 14px;
				}
				.b {
					background: var(--vm3-surface2);
					border: 1px solid var(--vm3-border);
					border-radius: var(--vm3-radius);
					padding: 20px;
					display: flex;
					flex-direction: column;
					gap: 16px;
				}
				.c {
					display: block;
					font-family: var(--vm3-font);
					font-size: 11px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.07em;
					color: var(--vm3-muted);
					margin-bottom: 6px;
				}
				.d {
					display: flex;
					flex-direction: column;
					gap: 4px;
				}
				.e {
					display: flex;
					flex-direction: column;
				}
				.f {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 6px;
				}
				.g {
					font-family: var(--vm3-font);
					font-size: 13px;
					color: var(--vm3-primary);
					text-decoration: none;
				}
				.g:hover {
					text-decoration: underline;
				}
			`}</style>
		</div>
	);
}
