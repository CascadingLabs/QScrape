import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import {
	formatPrice,
	getFeatured,
	getPromoted,
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
				<div class="a">Loading…</div>
			</Show>
			<Show when={items()}>
				<div class="b">
					<h3 class="c">Featured &amp; Promoted</h3>
					<ul class="d">
						<For each={items() ?? []}>
							{(item) => (
								<li class="e" data-0={item.section}>
									<a href={`/l3/eshop/product/${item.sku}/`} class="f">
										<img
											src={item.image}
											alt={item.name}
											class="g"
											loading="lazy"
										/>
										<div class="h">
											<span class="i">
												<CanvasText
													text={item.name}
													width={200}
													fontSize={13}
													fontWeight="600"
												/>
											</span>
											<span class="j">
												<SkuCanvas sku={item.sku} />
											</span>
											<span class="k">
												<CanvasText
													text={formatPrice(item.salePrice ?? item.basePrice)}
													width={180}
													fontSize={12}
													fontWeight="600"
													color="oklch(55% 0.18 145)"
												/>
											</span>
											<span class="l">
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
					padding: 16px;
				}
				.c {
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
				.d {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.e {
					border-bottom: 1px solid var(--vm3-border);
				}
				.e:last-child { border-bottom: none; }
				.f {
					display: flex;
					gap: 10px;
					align-items: center;
					padding: 10px 0;
					text-decoration: none;
					color: inherit;
				}
				.f:hover .i { color: var(--vm3-primary); }
				.g {
					width: 52px;
					height: 40px;
					object-fit: cover;
					border-radius: 4px;
					flex-shrink: 0;
				}
				.h {
					display: flex;
					flex-direction: column;
					gap: 2px;
					min-width: 0;
				}
				.i {
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
				.j {
					display: block;
				}
				.k {
					font-family: var(--vm3-font);
					font-size: 12px;
					font-weight: 600;
					color: var(--vm3-cta);
				}
				.l {
					display: block;
				}
			`}</style>
		</div>
	);
}
