/**
 * @qscrape L2 / solid / eshop / island
 * @component EshopProductGrid
 */
import {
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from 'solid-js';
import { fakeGet } from '../../../../data/api';
import type { CartItem } from '../../../../data/eshop/cart';
import {
	addToCart,
	cartCount,
	clearCart,
	getCart,
	removeFromCart,
	updateQty,
} from '../../../../data/eshop/cart';
import type { ProductMeta } from '../../../../data/eshop/products';
import {
	getByCategory,
	getProductBySku,
	products,
} from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

const PER_PAGE = 9;

type View = 'grid' | 'detail' | 'cart' | 'checkout' | 'confirm';

function getUrlState() {
	const p = new URLSearchParams(window.location.search);
	return { sku: p.get('sku'), cat: p.get('cat'), view: p.get('view') };
}

function goToProduct(sku: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('sku', sku);
	url.searchParams.delete('cat');
	url.searchParams.delete('view');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('eshop:product', { detail: sku }));
	window.scrollTo(0, 0);
}

function goToView(v: 'cart' | 'checkout') {
	const url = new URL(window.location.href);
	url.searchParams.set('view', v);
	url.searchParams.delete('sku');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('eshop:view', { detail: v }));
	window.scrollTo(0, 0);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProductCard(props: { p: ProductMeta; onClick: () => void }) {
	const p = props.p;
	return (
		<article
			data-sku={p.sku}
			data-category={p.category}
			onClick={props.onClick}
			style={{
				border: '1px solid var(--vm-border)',
				'border-radius': 'var(--vm-radius)',
				overflow: 'hidden',
				background: 'var(--vm-surface)',
				'box-shadow': 'var(--vm-shadow)',
				cursor: 'pointer',
			}}
		>
			<div style={{ position: 'relative' }}>
				<img
					src={p.image}
					alt={p.name}
					width="280"
					height="180"
					loading="lazy"
					style={{
						width: '100%',
						height: '160px',
						'object-fit': 'cover',
						display: 'block',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: '8px',
						left: '8px',
						display: 'flex',
						gap: '4px',
					}}
				>
					<Show when={p.isNew}>
						<span
							style={{
								background: 'var(--vm-primary)',
								color: '#fff',
								'font-size': '10px',
								'font-weight': '700',
								padding: '2px 6px',
								'border-radius': '3px',
							}}
						>
							NEW
						</span>
					</Show>
					<Show when={p.salePrice}>
						<span
							style={{
								background: 'var(--vm-sale)',
								color: '#fff',
								'font-size': '10px',
								'font-weight': '700',
								padding: '2px 6px',
								'border-radius': '3px',
							}}
						>
							SALE
						</span>
					</Show>
					<Show when={!p.inStock}>
						<span
							style={{
								background: '#6b7280',
								color: '#fff',
								'font-size': '10px',
								'font-weight': '700',
								padding: '2px 6px',
								'border-radius': '3px',
							}}
						>
							OOS
						</span>
					</Show>
				</div>
			</div>
			<div style={{ padding: '12px' }}>
				<div
					style={{
						'font-size': '11px',
						color: 'var(--vm-muted)',
						'text-transform': 'uppercase',
						'letter-spacing': '0.04em',
						'margin-bottom': '4px',
					}}
					data-category={p.category}
				>
					{p.category}
				</div>
				<h3
					style={{
						'font-size': '14px',
						'font-weight': '600',
						color: 'var(--vm-text)',
						'line-height': '1.3',
						'margin-bottom': '8px',
					}}
				>
					{p.name}
				</h3>
				<div style={{ display: 'flex', 'align-items': 'baseline', gap: '6px' }}>
					<span
						data-price={(p.salePrice ?? p.basePrice).toFixed(2)}
						style={{
							'font-size': '15px',
							'font-weight': '700',
							color: p.salePrice ? 'var(--vm-sale)' : 'var(--vm-text)',
						}}
					>
						{(p.salePrice ?? p.basePrice).toFixed(2)} GS
					</span>
					<Show when={p.salePrice}>
						<span
							data-original-price={p.basePrice.toFixed(2)}
							style={{
								'font-size': '12px',
								color: 'var(--vm-muted)',
								'text-decoration': 'line-through',
							}}
						>
							{p.basePrice.toFixed(2)} GS
						</span>
					</Show>
				</div>
				<div
					style={{
						'font-size': '12px',
						color: 'var(--vm-muted)',
						'margin-top': '4px',
					}}
				>
					{'★'.repeat(Math.floor(p.rating))}
					{'☆'.repeat(5 - Math.floor(p.rating))}
					{` (${p.reviewCount})`}
				</div>
			</div>
		</article>
	);
}

function ProductDetail(props: { sku: string; onAddToCart: () => void }) {
	const p = getProductBySku(props.sku);
	if (!p) {
		return (
			<div style={{ padding: '24px', color: 'var(--vm-muted)' }}>
				Product not found.
			</div>
		);
	}
	const price = (p.salePrice ?? p.basePrice).toFixed(2);
	const stockLabel = !p.inStock
		? 'Out of Stock'
		: p.stock && p.stock <= 5
			? `Only ${p.stock} left in stock`
			: 'In Stock';
	return (
		<div
			data-component="eshop-product-detail"
			data-framework="solid"
			data-sku={p.sku}
			style={{ 'padding-bottom': '32px' }}
		>
			<button
				type="button"
				onClick={() => history.back()}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--vm-primary)',
					cursor: 'pointer',
					'font-family': 'var(--vm-font)',
					'font-size': '13px',
					padding: '0',
					margin: '16px 24px 0',
					display: 'flex',
					'align-items': 'center',
					gap: '4px',
				}}
			>
				← Back to catalog
			</button>
			<div
				style={{
					display: 'grid',
					'grid-template-columns': '1fr 1fr',
					gap: '24px',
					padding: '16px 24px 24px',
				}}
			>
				<div style={{ position: 'relative' }}>
					<img
						src={p.image}
						alt={p.name}
						width="560"
						height="400"
						style={{
							width: '100%',
							'border-radius': 'var(--vm-radius)',
							display: 'block',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							top: '10px',
							left: '10px',
							display: 'flex',
							gap: '4px',
						}}
					>
						<Show when={p.isNew}>
							<span
								style={{
									background: 'var(--vm-primary)',
									color: '#fff',
									'font-size': '11px',
									'font-weight': '700',
									padding: '3px 8px',
									'border-radius': '3px',
								}}
							>
								NEW
							</span>
						</Show>
						<Show when={p.salePrice}>
							<span
								style={{
									background: 'var(--vm-sale)',
									color: '#fff',
									'font-size': '11px',
									'font-weight': '700',
									padding: '3px 8px',
									'border-radius': '3px',
								}}
							>
								SALE
							</span>
						</Show>
						<Show when={!p.inStock}>
							<span
								style={{
									background: '#6b7280',
									color: '#fff',
									'font-size': '11px',
									'font-weight': '700',
									padding: '3px 8px',
									'border-radius': '3px',
								}}
							>
								OUT OF STOCK
							</span>
						</Show>
					</div>
				</div>
				<div>
					<div
						data-category={p.category}
						style={{
							display: 'inline-block',
							'font-size': '11px',
							'font-weight': '600',
							color: 'var(--vm-primary)',
							background: '#2563eb18',
							padding: '3px 8px',
							'border-radius': '3px',
							'margin-bottom': '10px',
							'text-transform': 'uppercase',
							'letter-spacing': '0.04em',
						}}
					>
						{p.category}
					</div>
					<h1
						style={{
							'font-size': '22px',
							'font-weight': '700',
							color: 'var(--vm-text)',
							'line-height': '1.25',
							'margin-bottom': '8px',
						}}
					>
						{p.name}
					</h1>
					<div
						style={{
							'font-size': '12px',
							color: 'var(--vm-muted)',
							'margin-bottom': '12px',
						}}
					>
						SKU: <span data-sku={p.sku}>{p.sku}</span>
						{' · '}
						{'★'.repeat(Math.floor(p.rating))}
						{'☆'.repeat(5 - Math.floor(p.rating))}
						{` (${p.reviewCount} reviews)`}
					</div>
					<div
						style={{
							display: 'flex',
							'align-items': 'baseline',
							gap: '10px',
							'margin-bottom': '16px',
						}}
					>
						<span
							data-price={price}
							style={{
								'font-size': '26px',
								'font-weight': '700',
								color: p.salePrice ? 'var(--vm-sale)' : 'var(--vm-text)',
							}}
						>
							{price} GS
						</span>
						<Show when={p.salePrice}>
							<span
								data-original-price={p.basePrice.toFixed(2)}
								style={{
									'font-size': '16px',
									color: 'var(--vm-muted)',
									'text-decoration': 'line-through',
								}}
							>
								{p.basePrice.toFixed(2)} GS
							</span>
						</Show>
					</div>
					<p
						style={{
							'font-size': '14px',
							color: 'var(--vm-muted)',
							'line-height': '1.6',
							'margin-bottom': '16px',
						}}
					>
						{p.excerpt}
					</p>
					<div
						data-in-stock={p.inStock ? 'true' : 'false'}
						style={{
							'font-size': '13px',
							'font-weight': '600',
							color: p.inStock ? 'var(--vm-cta)' : 'var(--vm-sale)',
							'margin-bottom': '16px',
						}}
					>
						{stockLabel}
					</div>
					<Show when={p.inStock}>
						<button
							type="button"
							onClick={props.onAddToCart}
							style={{
								background: 'var(--vm-cta)',
								color: '#fff',
								border: 'none',
								'border-radius': 'var(--vm-radius)',
								padding: '11px 24px',
								'font-size': '15px',
								'font-weight': '600',
								cursor: 'pointer',
								'font-family': 'var(--vm-font)',
								width: '100%',
							}}
						>
							Add to Cart
						</button>
					</Show>
				</div>
			</div>
		</div>
	);
}

function CartView(props: {
	cart: CartItem[];
	onCheckout: () => void;
	onBack: () => void;
}) {
	const total = () =>
		props.cart.reduce((sum, item) => {
			const p = getProductBySku(item.sku);
			return sum + (p ? (p.salePrice ?? p.basePrice) * item.qty : 0);
		}, 0);
	const count = () => cartCount(props.cart);

	const btnStyle = {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		'font-family': 'var(--vm-font)',
		'font-size': '14px',
		color: 'var(--vm-primary)',
		padding: '0 6px',
	};

	return (
		<div
			data-component="eshop-cart"
			data-framework="solid"
			style={{ 'padding-bottom': '32px' }}
		>
			<button
				type="button"
				onClick={props.onBack}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--vm-primary)',
					cursor: 'pointer',
					'font-family': 'var(--vm-font)',
					'font-size': '13px',
					padding: '0',
					margin: '16px 24px 0',
					display: 'flex',
					'align-items': 'center',
					gap: '4px',
				}}
			>
				← Continue shopping
			</button>
			<h2
				style={{
					'font-size': '18px',
					'font-weight': '700',
					color: 'var(--vm-text)',
					margin: '16px 24px',
				}}
			>
				Your Cart
			</h2>
			<Show when={props.cart.length === 0}>
				<p
					style={{
						padding: '0 24px',
						'font-size': '14px',
						color: 'var(--vm-muted)',
					}}
				>
					Your cart is empty.
				</p>
			</Show>
			<Show when={props.cart.length > 0}>
				<div
					style={{
						border: '1px solid var(--vm-border)',
						'border-radius': 'var(--vm-radius)',
						overflow: 'hidden',
						margin: '0 24px 20px',
					}}
				>
					<For each={props.cart}>
						{(item, idx) => {
							const p = getProductBySku(item.sku);
							if (!p) {
								return null;
							}
							const unitPrice = p.salePrice ?? p.basePrice;
							const lineTotal = () => (unitPrice * item.qty).toFixed(2);
							return (
								<div
									data-sku={item.sku}
									style={{
										display: 'flex',
										'align-items': 'center',
										gap: '14px',
										padding: '14px 16px',
										'border-bottom':
											idx() < props.cart.length - 1
												? '1px solid var(--vm-border)'
												: 'none',
										background: 'var(--vm-surface)',
									}}
								>
									<img
										src={p.image}
										alt={p.name}
										width="60"
										height="45"
										style={{
											width: '60px',
											height: '45px',
											'object-fit': 'cover',
											'border-radius': '4px',
											'flex-shrink': '0',
										}}
									/>
									<div style={{ flex: '1', 'min-width': '0' }}>
										<div
											style={{
												'font-size': '14px',
												'font-weight': '600',
												color: 'var(--vm-text)',
												'margin-bottom': '2px',
											}}
										>
											{p.name}
										</div>
										<div
											style={{ 'font-size': '12px', color: 'var(--vm-muted)' }}
										>
											{unitPrice.toFixed(2)} GS each
										</div>
									</div>
									<div
										style={{
											display: 'flex',
											'align-items': 'center',
											gap: '6px',
										}}
									>
										<button
											type="button"
											style={btnStyle}
											onClick={() => updateQty(item.sku, item.qty - 1)}
										>
											−
										</button>
										<span
											data-qty={item.qty}
											style={{
												'min-width': '24px',
												'text-align': 'center',
												'font-size': '14px',
												'font-weight': '600',
												color: 'var(--vm-text)',
											}}
										>
											{item.qty}
										</span>
										<button
											type="button"
											style={btnStyle}
											onClick={() => updateQty(item.sku, item.qty + 1)}
										>
											+
										</button>
									</div>
									<div
										data-line-total={lineTotal()}
										style={{
											'font-size': '14px',
											'font-weight': '700',
											color: 'var(--vm-text)',
											'min-width': '70px',
											'text-align': 'right',
										}}
									>
										{lineTotal()} GS
									</div>
									<button
										type="button"
										onClick={() => removeFromCart(item.sku)}
										style={{
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											color: 'var(--vm-muted)',
											'font-size': '16px',
											padding: '0 4px',
											'line-height': '1',
										}}
									>
										×
									</button>
								</div>
							);
						}}
					</For>
				</div>
				<div
					style={{
						background: 'var(--vm-surface)',
						border: '1px solid var(--vm-border)',
						'border-radius': 'var(--vm-radius)',
						padding: '16px',
						margin: '0 24px 16px',
					}}
				>
					<div
						style={{
							display: 'flex',
							'justify-content': 'space-between',
							'font-size': '13px',
							color: 'var(--vm-muted)',
							'margin-bottom': '8px',
						}}
					>
						<span>
							Subtotal ({count()} item{count() !== 1 ? 's' : ''})
						</span>
						<span>{total().toFixed(2)} GS</span>
					</div>
					<div
						style={{
							display: 'flex',
							'justify-content': 'space-between',
							'font-size': '13px',
							color: 'var(--vm-muted)',
							'margin-bottom': '12px',
						}}
					>
						<span>Shipping</span>
						<span>Free</span>
					</div>
					<div
						style={{
							display: 'flex',
							'justify-content': 'space-between',
							'font-size': '16px',
							'font-weight': '700',
							color: 'var(--vm-text)',
							'border-top': '1px solid var(--vm-border)',
							'padding-top': '12px',
						}}
					>
						<span>Total</span>
						<span data-cart-total={total().toFixed(2)}>
							{total().toFixed(2)} GS
						</span>
					</div>
				</div>
				<button
					type="button"
					onClick={props.onCheckout}
					style={{
						background: 'var(--vm-cta)',
						color: '#fff',
						border: 'none',
						'border-radius': 'var(--vm-radius)',
						padding: '13px 24px',
						'font-size': '15px',
						'font-weight': '600',
						cursor: 'pointer',
						'font-family': 'var(--vm-font)',
						width: 'calc(100% - 48px)',
						margin: '0 24px',
					}}
				>
					Proceed to Checkout
				</button>
			</Show>
		</div>
	);
}

function validateInput(value: string, type: string): string | null {
	const v = value.trim();
	if (!v) {
		return 'required';
	}
	if (type === 'name' && v.length < 2) {
		return 'at least 2 characters';
	}
	if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
		return 'invalid email';
	}
	if (type === 'postcode' && v.length < 3) {
		return 'too short';
	}
	if (type === 'card' && !/^\d{13,19}$/.test(v.replace(/[\s-]/g, ''))) {
		return 'must be 13–19 digits';
	}
	if (type === 'expiry' && !/^(0[1-9]|1[0-2])[\s/]+\d{2}$/.test(v)) {
		return 'use MM / YY';
	}
	if (type === 'cvv' && !/^\d{3,4}$/.test(v)) {
		return '3 or 4 digits';
	}
	return null;
}

function CheckoutView(props: {
	cart: CartItem[];
	onConfirm: () => void;
	onBack: () => void;
}) {
	const [formErrors, setFormErrors] = createSignal<string[]>([]);
	let formEl: HTMLDivElement | undefined;

	const total = () =>
		props.cart.reduce((sum, item) => {
			const p = getProductBySku(item.sku);
			return sum + (p ? (p.salePrice ?? p.basePrice) * item.qty : 0);
		}, 0);

	function handlePlaceOrder() {
		if (formEl) {
			const inputs = Array.from(
				formEl.querySelectorAll<HTMLInputElement>('input[data-required]'),
			);
			const msgs: string[] = [];
			for (const el of inputs) {
				const err = validateInput(el.value, el.dataset.validate ?? 'text');
				if (err) {
					el.style.borderColor = 'var(--vm-sale)';
					msgs.push(`${el.dataset.label}: ${err}`);
				} else {
					el.style.borderColor = 'var(--vm-cta)';
				}
			}
			if (msgs.length > 0) {
				setFormErrors(msgs);
				return;
			}
		}
		setFormErrors([]);
		props.onConfirm();
	}

	const inputSt = {
		width: '100%',
		padding: '9px 12px',
		border: '1px solid var(--vm-border)',
		'border-radius': 'var(--vm-radius)',
		'font-size': '14px',
		color: 'var(--vm-text)',
		background: 'var(--vm-surface)',
		'font-family': 'var(--vm-font)',
		'box-sizing': 'border-box' as const,
	};
	const labelSt = {
		display: 'block',
		'font-size': '12px',
		'font-weight': '600',
		color: 'var(--vm-muted)',
		'margin-bottom': '4px',
		'text-transform': 'uppercase',
		'letter-spacing': '0.04em',
	};
	const fieldSt = { 'margin-bottom': '14px' };

	return (
		<div
			data-component="eshop-checkout"
			data-framework="solid"
			style={{ 'padding-bottom': '32px' }}
		>
			<button
				type="button"
				onClick={props.onBack}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--vm-primary)',
					cursor: 'pointer',
					'font-family': 'var(--vm-font)',
					'font-size': '13px',
					padding: '0',
					margin: '16px 24px 0',
					display: 'flex',
					'align-items': 'center',
					gap: '4px',
				}}
			>
				← Back to cart
			</button>
			<h2
				style={{
					'font-size': '18px',
					'font-weight': '700',
					color: 'var(--vm-text)',
					margin: '16px 24px',
				}}
			>
				Checkout
			</h2>
			<Show when={formErrors().length > 0}>
				<div
					role="alert"
					style={{
						background: '#fef2f2',
						border: '1px solid var(--vm-sale)',
						'border-radius': 'var(--vm-radius)',
						padding: '12px 16px',
						margin: '0 24px 16px',
						'font-size': '13px',
						color: 'var(--vm-sale)',
					}}
				>
					<strong>Please fix:</strong>
					<ul style={{ margin: '4px 0 0 16px' }}>
						<For each={formErrors()}>{(e) => <li>{e}</li>}</For>
					</ul>
				</div>
			</Show>
			<div
				ref={formEl}
				style={{
					display: 'grid',
					'grid-template-columns': '1fr 300px',
					gap: '28px',
					padding: '0 24px 24px',
				}}
			>
				<div>
					<h3
						style={{
							'font-size': '14px',
							'font-weight': '700',
							color: 'var(--vm-text)',
							'margin-bottom': '14px',
							'text-transform': 'uppercase',
							'letter-spacing': '0.05em',
						}}
					>
						Shipping Information
					</h3>
					<div
						style={{
							display: 'grid',
							'grid-template-columns': '1fr 1fr',
							gap: '12px',
						}}
					>
						<div style={fieldSt}>
							<label style={labelSt}>First name</label>
							<input
								style={inputSt}
								type="text"
								placeholder="Aldric"
								data-required="true"
								data-label="First name"
								data-validate="name"
							/>
						</div>
						<div style={fieldSt}>
							<label style={labelSt}>Last name</label>
							<input
								style={inputSt}
								type="text"
								placeholder="Blackwood"
								data-required="true"
								data-label="Last name"
								data-validate="name"
							/>
						</div>
					</div>
					<div style={fieldSt}>
						<label style={labelSt}>Email</label>
						<input
							style={inputSt}
							type="email"
							placeholder="aldric@example.com"
							data-required="true"
							data-label="Email"
							data-validate="email"
						/>
					</div>
					<div style={fieldSt}>
						<label style={labelSt}>Address</label>
						<input
							style={inputSt}
							type="text"
							placeholder="12 Irongate Lane"
							data-required="true"
							data-label="Address"
							data-validate="address"
						/>
					</div>
					<div
						style={{
							display: 'grid',
							'grid-template-columns': '1fr 1fr 100px',
							gap: '12px',
						}}
					>
						<div style={fieldSt}>
							<label style={labelSt}>City</label>
							<input
								style={inputSt}
								type="text"
								placeholder="Stonehaven"
								data-required="true"
								data-label="City"
								data-validate="text"
							/>
						</div>
						<div style={fieldSt}>
							<label style={labelSt}>Province</label>
							<input
								style={inputSt}
								type="text"
								placeholder="Valdris"
								data-required="true"
								data-label="Province"
								data-validate="text"
							/>
						</div>
						<div style={fieldSt}>
							<label style={labelSt}>Post code</label>
							<input
								style={inputSt}
								type="text"
								placeholder="VD-1401"
								data-required="true"
								data-label="Post code"
								data-validate="postcode"
							/>
						</div>
					</div>
					<h3
						style={{
							'font-size': '14px',
							'font-weight': '700',
							color: 'var(--vm-text)',
							'margin-bottom': '6px',
							'margin-top': '20px',
							'text-transform': 'uppercase',
							'letter-spacing': '0.05em',
						}}
					>
						Payment
					</h3>
					<p
						style={{
							'font-size': '12px',
							color: 'var(--vm-muted)',
							'margin-bottom': '14px',
						}}
					>
						Test card: 4111 1111 1111 1111 · any future date · any CVV
					</p>
					<div style={fieldSt}>
						<label style={labelSt}>Card number</label>
						<input
							style={inputSt}
							type="text"
							placeholder="4111 1111 1111 1111"
							data-required="true"
							data-label="Card number"
							data-validate="card"
						/>
					</div>
					<div
						style={{
							display: 'grid',
							'grid-template-columns': '1fr 1fr',
							gap: '12px',
						}}
					>
						<div style={fieldSt}>
							<label style={labelSt}>Expiry</label>
							<input
								style={inputSt}
								type="text"
								placeholder="MM / YY"
								data-required="true"
								data-label="Expiry"
								data-validate="expiry"
							/>
						</div>
						<div style={fieldSt}>
							<label style={labelSt}>CVV</label>
							<input
								style={inputSt}
								type="text"
								placeholder="···"
								data-required="true"
								data-label="CVV"
								data-validate="cvv"
							/>
						</div>
					</div>
					<button
						type="button"
						onClick={handlePlaceOrder}
						style={{
							background: 'var(--vm-cta)',
							color: '#fff',
							border: 'none',
							'border-radius': 'var(--vm-radius)',
							padding: '13px 24px',
							'font-size': '15px',
							'font-weight': '600',
							cursor: 'pointer',
							'font-family': 'var(--vm-font)',
							width: '100%',
							'margin-top': '8px',
						}}
					>
						Place Order
					</button>
				</div>
				<div
					style={{
						background: 'var(--vm-surface)',
						border: '1px solid var(--vm-border)',
						'border-radius': 'var(--vm-radius)',
						padding: '16px',
						'align-self': 'start',
					}}
				>
					<h3
						style={{
							'font-size': '13px',
							'font-weight': '700',
							color: 'var(--vm-text)',
							'margin-bottom': '14px',
							'text-transform': 'uppercase',
							'letter-spacing': '0.05em',
						}}
					>
						Order Summary
					</h3>
					<For each={props.cart}>
						{(item) => {
							const p = getProductBySku(item.sku);
							if (!p) {
								return null;
							}
							const lineTotal = (
								(p.salePrice ?? p.basePrice) * item.qty
							).toFixed(2);
							return (
								<div
									style={{
										display: 'flex',
										'justify-content': 'space-between',
										'font-size': '13px',
										'margin-bottom': '8px',
										gap: '8px',
									}}
								>
									<span style={{ color: 'var(--vm-text)', flex: '1' }}>
										{p.name}{' '}
										<span style={{ color: 'var(--vm-muted)' }}>
											×{item.qty}
										</span>
									</span>
									<span
										style={{
											color: 'var(--vm-text)',
											'font-weight': '600',
											'flex-shrink': '0',
										}}
									>
										{lineTotal} GS
									</span>
								</div>
							);
						}}
					</For>
					<div
						style={{
							'border-top': '1px solid var(--vm-border)',
							'padding-top': '12px',
							'margin-top': '8px',
							display: 'flex',
							'justify-content': 'space-between',
							'font-weight': '700',
							'font-size': '15px',
							color: 'var(--vm-text)',
						}}
					>
						<span>Total</span>
						<span data-checkout-total={total().toFixed(2)}>
							{total().toFixed(2)} GS
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function ConfirmView(props: { orderNum: string; onDone: () => void }) {
	return (
		<div
			data-component="eshop-confirm"
			data-framework="solid"
			style={{ padding: '48px 24px', 'text-align': 'center' }}
		>
			<div style={{ 'font-size': '48px', 'margin-bottom': '16px' }}>✓</div>
			<h2
				style={{
					'font-size': '22px',
					'font-weight': '700',
					color: 'var(--vm-text)',
					'margin-bottom': '8px',
				}}
			>
				Order Confirmed!
			</h2>
			<p
				style={{
					'font-size': '14px',
					color: 'var(--vm-muted)',
					'margin-bottom': '8px',
				}}
			>
				Thank you for your order. A confirmation has been sent to your inbox.
			</p>
			<p
				style={{
					'font-size': '13px',
					color: 'var(--vm-muted)',
					'margin-bottom': '28px',
				}}
			>
				Order reference:{' '}
				<strong
					data-order-id={props.orderNum}
					style={{ color: 'var(--vm-text)' }}
				>
					{props.orderNum}
				</strong>
			</p>
			<button
				type="button"
				onClick={props.onDone}
				style={{
					background: 'var(--vm-primary)',
					color: '#fff',
					border: 'none',
					'border-radius': 'var(--vm-radius)',
					padding: '11px 28px',
					'font-size': '14px',
					'font-weight': '600',
					cursor: 'pointer',
					'font-family': 'var(--vm-font)',
				}}
			>
				Continue Shopping
			</button>
		</div>
	);
}

// ── Main island ────────────────────────────────────────────────────────────────

export default function EshopProductGrid() {
	const [ready, setReady] = createSignal(false);
	const [view, setView] = createSignal<View>('grid');
	const [currentSku, setCurrentSku] = createSignal<string | null>(null);
	const [cat, setCat] = createSignal<string | null>(null);
	const [page, setPage] = createSignal(1);
	const [cart, setCartState] = createSignal<CartItem[]>([]);
	const [orderNum, setOrderNum] = createSignal('');

	const filtered = createMemo(() => (cat() ? getByCategory(cat()!) : products));
	const totalPages = createMemo(() => Math.ceil(filtered().length / PER_PAGE));
	const items = createMemo(() =>
		filtered().slice((page() - 1) * PER_PAGE, page() * PER_PAGE),
	);

	const onPop = () => {
		const { sku, cat: c, view: v } = getUrlState();
		if (v === 'cart') {
			setView('cart');
		} else if (v === 'checkout') {
			setView('checkout');
		} else if (sku) {
			setView('detail');
			setCurrentSku(sku);
		} else {
			setView('grid');
			setCat(c);
			setPage(1);
		}
	};
	const onCat = (e: Event) => {
		setCat((e as CustomEvent<string | null>).detail);
		setView('grid');
		setPage(1);
	};
	const onProduct = (e: Event) => {
		setCurrentSku((e as CustomEvent<string>).detail);
		setView('detail');
	};
	const onCartEvent = (e: Event) => {
		setCartState([...(e as CustomEvent<CartItem[]>).detail]);
	};
	const onViewEvent = (e: Event) => {
		setView((e as CustomEvent<View>).detail);
	};

	onMount(() => {
		const { sku, cat: c, view: v } = getUrlState();
		if (v === 'cart') {
			setView('cart');
		} else if (v === 'checkout') {
			setView('checkout');
		} else if (sku) {
			setView('detail');
			setCurrentSku(sku);
		}
		setCat(c);
		setCartState(getCart());
		fakeGet(null).then(() => setReady(true));
		window.addEventListener('popstate', onPop);
		window.addEventListener('eshop:cat', onCat);
		window.addEventListener('eshop:product', onProduct);
		window.addEventListener('eshop:cart', onCartEvent);
		window.addEventListener('eshop:view', onViewEvent);
	});

	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('eshop:cat', onCat);
		window.removeEventListener('eshop:product', onProduct);
		window.removeEventListener('eshop:cart', onCartEvent);
		window.removeEventListener('eshop:view', onViewEvent);
	});

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{
						padding: '40px 24px',
						color: '#888',
						'font-family': 'system-ui',
					}}
				>
					Loading…
				</div>
			}
		>
			<Show when={view() === 'confirm'}>
				<ConfirmView
					orderNum={orderNum()}
					onDone={() => {
						const url = new URL(window.location.href);
						url.searchParams.delete('view');
						history.pushState(null, '', url.toString());
						setView('grid');
					}}
				/>
			</Show>
			<Show when={view() === 'checkout'}>
				<CheckoutView
					cart={cart()}
					onBack={() => goToView('cart')}
					onConfirm={() => {
						const num = `VM-312-${Math.floor(100000 + Math.random() * 900000)}`;
						setOrderNum(num);
						clearCart();
						const url = new URL(window.location.href);
						url.searchParams.delete('view');
						history.pushState(null, '', url.toString());
						setView('confirm');
					}}
				/>
			</Show>
			<Show when={view() === 'cart'}>
				<CartView
					cart={cart()}
					onBack={() => {
						const url = new URL(window.location.href);
						url.searchParams.delete('view');
						url.searchParams.delete('sku');
						history.pushState(null, '', url.toString());
						setView('grid');
					}}
					onCheckout={() => goToView('checkout')}
				/>
			</Show>
			<Show when={view() === 'detail' && currentSku()}>
				<ProductDetail
					sku={currentSku()!}
					onAddToCart={() => {
						addToCart(currentSku()!);
						goToView('cart');
					}}
				/>
			</Show>
			<Show when={view() === 'grid'}>
				<div
					data-component="eshop-product-grid"
					data-framework="solid"
					style={{ padding: '24px' }}
				>
					<div
						style={{
							'margin-bottom': '14px',
							color: 'var(--vm-muted)',
							'font-size': '13px',
						}}
					>
						{filtered().length} product{filtered().length !== 1 ? 's' : ''}
						{cat() ? ` in "${cat()}"` : ''}
					</div>
					<div
						style={{
							display: 'grid',
							'grid-template-columns': 'repeat(auto-fill, minmax(190px, 1fr))',
							gap: '16px',
						}}
					>
						<For each={items()}>
							{(p) => <ProductCard p={p} onClick={() => goToProduct(p.sku)} />}
						</For>
					</div>
					<Show when={totalPages() > 1}>
						<div
							style={{
								display: 'flex',
								gap: '8px',
								'margin-top': '24px',
								'justify-content': 'center',
							}}
						>
							<For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
								{(n) => (
									<button
										type="button"
										onClick={() => setPage(n)}
										style={{
											padding: '6px 12px',
											border: `1px solid ${n === page() ? 'var(--vm-primary)' : 'var(--vm-border)'}`,
											'border-radius': 'var(--vm-radius)',
											background:
												n === page() ? 'var(--vm-primary)' : 'transparent',
											color: n === page() ? '#fff' : 'var(--vm-text)',
											cursor: 'pointer',
											'font-family': 'var(--vm-font)',
											'font-size': '13px',
										}}
									>
										{n}
									</button>
								)}
							</For>
						</div>
					</Show>
				</div>
			</Show>
		</Show>
	);
}
