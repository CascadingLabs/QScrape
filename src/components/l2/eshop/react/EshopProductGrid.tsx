/**
 * @qscrape L2 / react / eshop / island
 * @component EshopProductGrid
 */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
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

// ── Shared sub-components ────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
	border: '1px solid var(--vm-border)',
	borderRadius: 'var(--vm-radius)',
	overflow: 'hidden',
	background: 'var(--vm-surface)',
	boxShadow: 'var(--vm-shadow)',
	cursor: 'pointer',
	transition: 'box-shadow 0.15s',
};

function ProductCard({ p, onClick }: { p: ProductMeta; onClick: () => void }) {
	return (
		<article
			data-sku={p.sku}
			data-category={p.category}
			style={cardStyle}
			onClick={onClick}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.boxShadow =
					'var(--vm-shadow-hover)';
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.boxShadow = 'var(--vm-shadow)';
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
						objectFit: 'cover',
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
					{p.isNew && (
						<span
							style={{
								background: 'var(--vm-primary)',
								color: '#fff',
								fontSize: '10px',
								fontWeight: '700',
								padding: '2px 6px',
								borderRadius: '3px',
							}}
						>
							NEW
						</span>
					)}
					{p.salePrice && (
						<span
							style={{
								background: 'var(--vm-sale)',
								color: '#fff',
								fontSize: '10px',
								fontWeight: '700',
								padding: '2px 6px',
								borderRadius: '3px',
							}}
						>
							SALE
						</span>
					)}
					{!p.inStock && (
						<span
							style={{
								background: '#6b7280',
								color: '#fff',
								fontSize: '10px',
								fontWeight: '700',
								padding: '2px 6px',
								borderRadius: '3px',
							}}
						>
							OOS
						</span>
					)}
				</div>
			</div>
			<div style={{ padding: '12px' }}>
				<div
					style={{
						fontSize: '11px',
						color: 'var(--vm-muted)',
						textTransform: 'uppercase',
						letterSpacing: '0.04em',
						marginBottom: '4px',
					}}
					data-category={p.category}
				>
					{p.category}
				</div>
				<h3
					style={{
						fontSize: '14px',
						fontWeight: '600',
						color: 'var(--vm-text)',
						lineHeight: '1.3',
						marginBottom: '8px',
					}}
				>
					{p.name}
				</h3>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
					<span
						data-price={(p.salePrice ?? p.basePrice).toFixed(2)}
						style={{
							fontSize: '15px',
							fontWeight: '700',
							color: p.salePrice ? 'var(--vm-sale)' : 'var(--vm-text)',
						}}
					>
						{(p.salePrice ?? p.basePrice).toFixed(2)} GS
					</span>
					{p.salePrice && (
						<span
							data-original-price={p.basePrice.toFixed(2)}
							style={{
								fontSize: '12px',
								color: 'var(--vm-muted)',
								textDecoration: 'line-through',
							}}
						>
							{p.basePrice.toFixed(2)} GS
						</span>
					)}
				</div>
				<div
					style={{
						fontSize: '12px',
						color: 'var(--vm-muted)',
						marginTop: '4px',
					}}
				>
					{'★'.repeat(Math.floor(p.rating))}
					{'☆'.repeat(5 - Math.floor(p.rating))} ({p.reviewCount})
				</div>
			</div>
		</article>
	);
}

function ProductDetail({
	sku,
	onAddToCart,
}: {
	sku: string;
	onAddToCart: () => void;
}) {
	const p = getProductBySku(sku);
	if (!p) {
		return (
			<div style={{ padding: '24px', color: 'var(--vm-muted)' }}>
				Product not found.
			</div>
		);
	}
	return (
		<div
			data-component="eshop-product-detail"
			data-framework="react"
			data-sku={p.sku}
			style={{ padding: '24px' }}
		>
			<button
				type="button"
				onClick={() => history.back()}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--vm-primary)',
					cursor: 'pointer',
					fontFamily: 'var(--vm-font)',
					fontSize: '13px',
					padding: '0',
					marginBottom: '16px',
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
				}}
			>
				← Back to catalog
			</button>
			<div
				style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
			>
				<div style={{ position: 'relative' }}>
					<img
						src={p.image}
						alt={p.name}
						width="560"
						height="400"
						style={{
							width: '100%',
							borderRadius: 'var(--vm-radius)',
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
						{p.isNew && (
							<span
								style={{
									background: 'var(--vm-primary)',
									color: '#fff',
									fontSize: '11px',
									fontWeight: '700',
									padding: '3px 8px',
									borderRadius: '3px',
								}}
							>
								NEW
							</span>
						)}
						{p.salePrice && (
							<span
								style={{
									background: 'var(--vm-sale)',
									color: '#fff',
									fontSize: '11px',
									fontWeight: '700',
									padding: '3px 8px',
									borderRadius: '3px',
								}}
							>
								SALE
							</span>
						)}
						{!p.inStock && (
							<span
								style={{
									background: '#6b7280',
									color: '#fff',
									fontSize: '11px',
									fontWeight: '700',
									padding: '3px 8px',
									borderRadius: '3px',
								}}
							>
								OUT OF STOCK
							</span>
						)}
					</div>
				</div>
				<div>
					<div
						style={{
							display: 'inline-block',
							fontSize: '11px',
							fontWeight: '600',
							color: 'var(--vm-primary)',
							background: '#2563eb18',
							padding: '3px 8px',
							borderRadius: '3px',
							marginBottom: '10px',
							textTransform: 'uppercase',
							letterSpacing: '0.04em',
						}}
						data-category={p.category}
					>
						{p.category}
					</div>
					<h1
						style={{
							fontSize: '22px',
							fontWeight: '700',
							color: 'var(--vm-text)',
							lineHeight: '1.25',
							marginBottom: '8px',
						}}
					>
						{p.name}
					</h1>
					<div
						style={{
							fontSize: '12px',
							color: 'var(--vm-muted)',
							marginBottom: '12px',
						}}
					>
						SKU: <span data-sku={p.sku}>{p.sku}</span>
						{' · '}
						{'★'.repeat(Math.floor(p.rating))}
						{'☆'.repeat(5 - Math.floor(p.rating))} ({p.reviewCount} reviews)
					</div>
					<div style={{ marginBottom: '16px' }}>
						<span
							data-price={(p.salePrice ?? p.basePrice).toFixed(2)}
							style={{
								fontSize: '26px',
								fontWeight: '700',
								color: p.salePrice ? 'var(--vm-sale)' : 'var(--vm-text)',
							}}
						>
							{(p.salePrice ?? p.basePrice).toFixed(2)} GS
						</span>
						{p.salePrice && (
							<span
								data-original-price={p.basePrice.toFixed(2)}
								style={{
									fontSize: '16px',
									color: 'var(--vm-muted)',
									textDecoration: 'line-through',
									marginLeft: '10px',
								}}
							>
								{p.basePrice.toFixed(2)} GS
							</span>
						)}
					</div>
					<p
						style={{
							fontSize: '14px',
							color: 'var(--vm-muted)',
							lineHeight: '1.6',
							marginBottom: '16px',
						}}
					>
						{p.excerpt}
					</p>
					<div
						style={{
							fontSize: '13px',
							fontWeight: '600',
							color: p.inStock ? 'var(--vm-cta)' : 'var(--vm-sale)',
							marginBottom: '16px',
						}}
						data-in-stock={p.inStock ? 'true' : 'false'}
					>
						{p.inStock
							? p.stock && p.stock <= 5
								? `Only ${p.stock} left in stock`
								: 'In Stock'
							: 'Out of Stock'}
					</div>
					{p.inStock && (
						<button
							type="button"
							onClick={onAddToCart}
							style={{
								background: 'var(--vm-cta)',
								color: '#fff',
								border: 'none',
								borderRadius: 'var(--vm-radius)',
								padding: '11px 24px',
								fontSize: '15px',
								fontWeight: '600',
								cursor: 'pointer',
								fontFamily: 'var(--vm-font)',
								width: '100%',
							}}
						>
							Add to Cart
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

function CartView({
	cart,
	onCheckout,
	onBack,
}: {
	cart: CartItem[];
	onCheckout: () => void;
	onBack: () => void;
}) {
	const total = cart.reduce((sum, item) => {
		const p = getProductBySku(item.sku);
		return sum + (p ? (p.salePrice ?? p.basePrice) * item.qty : 0);
	}, 0);

	const btnStyle: React.CSSProperties = {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		fontFamily: 'var(--vm-font)',
		fontSize: '14px',
		color: 'var(--vm-primary)',
		padding: '0 6px',
	};

	return (
		<div
			data-component="eshop-cart"
			data-framework="react"
			style={{ padding: '24px' }}
		>
			<button
				type="button"
				onClick={onBack}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--vm-primary)',
					cursor: 'pointer',
					fontFamily: 'var(--vm-font)',
					fontSize: '13px',
					padding: '0',
					marginBottom: '20px',
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
				}}
			>
				← Continue shopping
			</button>
			<h2
				style={{
					fontSize: '18px',
					fontWeight: '700',
					color: 'var(--vm-text)',
					marginBottom: '20px',
				}}
			>
				Your Cart
			</h2>

			{cart.length === 0 ? (
				<p style={{ color: 'var(--vm-muted)', fontSize: '14px' }}>
					Your cart is empty.
				</p>
			) : (
				<>
					<div
						style={{
							border: '1px solid var(--vm-border)',
							borderRadius: 'var(--vm-radius)',
							overflow: 'hidden',
							marginBottom: '20px',
						}}
					>
						{cart.map((item, idx) => {
							const p = getProductBySku(item.sku);
							if (!p) {
								return null;
							}
							const price = p.salePrice ?? p.basePrice;
							return (
								<div
									key={item.sku}
									data-sku={item.sku}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '14px',
										padding: '14px 16px',
										borderBottom:
											idx < cart.length - 1
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
											objectFit: 'cover',
											borderRadius: '4px',
											flexShrink: 0,
										}}
									/>
									<div style={{ flex: 1, minWidth: 0 }}>
										<div
											style={{
												fontSize: '14px',
												fontWeight: '600',
												color: 'var(--vm-text)',
												marginBottom: '2px',
											}}
										>
											{p.name}
										</div>
										<div style={{ fontSize: '12px', color: 'var(--vm-muted)' }}>
											{price.toFixed(2)} GS each
										</div>
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
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
												minWidth: '24px',
												textAlign: 'center',
												fontSize: '14px',
												fontWeight: '600',
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
										data-line-total={(price * item.qty).toFixed(2)}
										style={{
											fontSize: '14px',
											fontWeight: '700',
											color: 'var(--vm-text)',
											minWidth: '70px',
											textAlign: 'right',
										}}
									>
										{(price * item.qty).toFixed(2)} GS
									</div>
									<button
										type="button"
										onClick={() => removeFromCart(item.sku)}
										style={{
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											color: 'var(--vm-muted)',
											fontSize: '16px',
											padding: '0 4px',
											lineHeight: '1',
										}}
									>
										×
									</button>
								</div>
							);
						})}
					</div>

					<div
						style={{
							background: 'var(--vm-surface)',
							border: '1px solid var(--vm-border)',
							borderRadius: 'var(--vm-radius)',
							padding: '16px',
							marginBottom: '16px',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								fontSize: '13px',
								color: 'var(--vm-muted)',
								marginBottom: '8px',
							}}
						>
							<span>
								Subtotal ({cartCount(cart)} item
								{cartCount(cart) !== 1 ? 's' : ''})
							</span>
							<span>{total.toFixed(2)} GS</span>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								fontSize: '13px',
								color: 'var(--vm-muted)',
								marginBottom: '12px',
							}}
						>
							<span>Shipping</span>
							<span>Free</span>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								fontSize: '16px',
								fontWeight: '700',
								color: 'var(--vm-text)',
								borderTop: '1px solid var(--vm-border)',
								paddingTop: '12px',
							}}
						>
							<span>Total</span>
							<span data-cart-total={total.toFixed(2)}>
								{total.toFixed(2)} GS
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={onCheckout}
						style={{
							background: 'var(--vm-cta)',
							color: '#fff',
							border: 'none',
							borderRadius: 'var(--vm-radius)',
							padding: '13px 24px',
							fontSize: '15px',
							fontWeight: '600',
							cursor: 'pointer',
							fontFamily: 'var(--vm-font)',
							width: '100%',
						}}
					>
						Proceed to Checkout
					</button>
				</>
			)}
		</div>
	);
}

type ValidateType =
	| 'name'
	| 'email'
	| 'address'
	| 'postcode'
	| 'card'
	| 'expiry'
	| 'cvv'
	| 'text';

function validateInput(value: string, type: ValidateType): string | null {
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

function CheckoutView({
	cart,
	onConfirm,
	onBack,
}: {
	cart: CartItem[];
	onConfirm: () => void;
	onBack: () => void;
}) {
	const [errors, setErrors] = useState<string[]>([]);
	const formRef = useRef<HTMLDivElement>(null);

	const total = cart.reduce((sum, item) => {
		const p = getProductBySku(item.sku);
		return sum + (p ? (p.salePrice ?? p.basePrice) * item.qty : 0);
	}, 0);

	function handlePlaceOrder() {
		if (!formRef.current) {
			return;
		}
		const inputs = Array.from(
			formRef.current.querySelectorAll<HTMLInputElement>(
				'input[data-required]',
			),
		);
		const msgs: string[] = [];
		for (const el of inputs) {
			const type = (el.dataset.validate ?? 'text') as ValidateType;
			const err = validateInput(el.value, type);
			if (err) {
				el.style.borderColor = 'var(--vm-sale)';
				msgs.push(`${el.dataset.label}: ${err}`);
			} else {
				el.style.borderColor = 'var(--vm-cta)';
			}
		}
		if (msgs.length > 0) {
			setErrors(msgs);
			return;
		}
		setErrors([]);
		onConfirm();
	}

	const inputStyle: React.CSSProperties = {
		width: '100%',
		padding: '9px 12px',
		border: '1px solid var(--vm-border)',
		borderRadius: 'var(--vm-radius)',
		fontSize: '14px',
		color: 'var(--vm-text)',
		background: 'var(--vm-surface)',
		fontFamily: 'var(--vm-font)',
		boxSizing: 'border-box',
	};
	const labelStyle: React.CSSProperties = {
		display: 'block',
		fontSize: '12px',
		fontWeight: '600',
		color: 'var(--vm-muted)',
		marginBottom: '4px',
		textTransform: 'uppercase',
		letterSpacing: '0.04em',
	};
	const rowStyle: React.CSSProperties = { marginBottom: '14px' };

	function Field({
		label,
		placeholder,
		validate = 'text',
		type = 'text',
	}: {
		label: string;
		placeholder: string;
		validate?: ValidateType;
		type?: string;
	}) {
		return (
			<div style={rowStyle}>
				<label style={labelStyle}>{label}</label>
				<input
					style={inputStyle}
					type={type}
					placeholder={placeholder}
					data-required="true"
					data-label={label}
					data-validate={validate}
					onChange={(e) => {
						const err = validateInput(e.target.value, validate);
						e.target.style.borderColor = err
							? 'var(--vm-sale)'
							: e.target.value.trim()
								? 'var(--vm-cta)'
								: '';
					}}
				/>
			</div>
		);
	}

	return (
		<div
			data-component="eshop-checkout"
			data-framework="react"
			style={{ padding: '24px' }}
		>
			<button
				type="button"
				onClick={onBack}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--vm-primary)',
					cursor: 'pointer',
					fontFamily: 'var(--vm-font)',
					fontSize: '13px',
					padding: '0',
					marginBottom: '20px',
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
				}}
			>
				← Back to cart
			</button>
			<h2
				style={{
					fontSize: '18px',
					fontWeight: '700',
					color: 'var(--vm-text)',
					marginBottom: '20px',
				}}
			>
				Checkout
			</h2>

			{errors.length > 0 && (
				<div
					role="alert"
					style={{
						background: '#fef2f2',
						border: '1px solid var(--vm-sale)',
						borderRadius: 'var(--vm-radius)',
						padding: '12px 16px',
						marginBottom: '20px',
						fontSize: '13px',
						color: 'var(--vm-sale)',
					}}
				>
					<strong>Please fix:</strong>
					<ul style={{ margin: '4px 0 0 16px' }}>
						{errors.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				</div>
			)}

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 320px',
					gap: '28px',
				}}
				ref={formRef}
			>
				<div>
					{/* Shipping */}
					<div style={{ marginBottom: '24px' }}>
						<h3
							style={{
								fontSize: '14px',
								fontWeight: '700',
								color: 'var(--vm-text)',
								marginBottom: '14px',
								textTransform: 'uppercase',
								letterSpacing: '0.05em',
							}}
						>
							Shipping Information
						</h3>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: '12px',
							}}
						>
							<Field label="First name" placeholder="Aldric" validate="name" />
							<Field
								label="Last name"
								placeholder="Blackwood"
								validate="name"
							/>
						</div>
						<Field
							label="Email"
							placeholder="aldric@example.com"
							validate="email"
							type="email"
						/>
						<Field
							label="Address"
							placeholder="12 Irongate Lane"
							validate="address"
						/>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr 100px',
								gap: '12px',
							}}
						>
							<Field label="City" placeholder="Stonehaven" validate="text" />
							<Field label="Province" placeholder="Valdris" validate="text" />
							<Field
								label="Post code"
								placeholder="VD-1401"
								validate="postcode"
							/>
						</div>
					</div>

					{/* Payment */}
					<div>
						<h3
							style={{
								fontSize: '14px',
								fontWeight: '700',
								color: 'var(--vm-text)',
								marginBottom: '6px',
								textTransform: 'uppercase',
								letterSpacing: '0.05em',
							}}
						>
							Payment
						</h3>
						<p
							style={{
								fontSize: '12px',
								color: 'var(--vm-muted)',
								marginBottom: '14px',
							}}
						>
							Test card: 4111 1111 1111 1111 · any future date · any CVV
						</p>
						<Field
							label="Card number"
							placeholder="4111 1111 1111 1111"
							validate="card"
						/>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: '12px',
							}}
						>
							<Field label="Expiry" placeholder="MM / YY" validate="expiry" />
							<Field label="CVV" placeholder="···" validate="cvv" />
						</div>
					</div>

					<button
						type="button"
						onClick={handlePlaceOrder}
						style={{
							background: 'var(--vm-cta)',
							color: '#fff',
							border: 'none',
							borderRadius: 'var(--vm-radius)',
							padding: '13px 24px',
							fontSize: '15px',
							fontWeight: '600',
							cursor: 'pointer',
							fontFamily: 'var(--vm-font)',
							width: '100%',
							marginTop: '8px',
						}}
					>
						Place Order
					</button>
				</div>

				{/* Order summary sidebar */}
				<div
					style={{
						background: 'var(--vm-surface)',
						border: '1px solid var(--vm-border)',
						borderRadius: 'var(--vm-radius)',
						padding: '16px',
						alignSelf: 'start',
					}}
				>
					<h3
						style={{
							fontSize: '13px',
							fontWeight: '700',
							color: 'var(--vm-text)',
							marginBottom: '14px',
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
						}}
					>
						Order Summary
					</h3>
					{cart.map((item) => {
						const p = getProductBySku(item.sku);
						if (!p) {
							return null;
						}
						return (
							<div
								key={item.sku}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									fontSize: '13px',
									marginBottom: '8px',
									gap: '8px',
								}}
							>
								<span style={{ color: 'var(--vm-text)', flex: 1 }}>
									{p.name}{' '}
									<span style={{ color: 'var(--vm-muted)' }}>×{item.qty}</span>
								</span>
								<span
									style={{
										color: 'var(--vm-text)',
										fontWeight: '600',
										flexShrink: 0,
									}}
								>
									{((p.salePrice ?? p.basePrice) * item.qty).toFixed(2)} GS
								</span>
							</div>
						);
					})}
					<div
						style={{
							borderTop: '1px solid var(--vm-border)',
							paddingTop: '12px',
							marginTop: '8px',
							display: 'flex',
							justifyContent: 'space-between',
							fontWeight: '700',
							fontSize: '15px',
							color: 'var(--vm-text)',
						}}
					>
						<span>Total</span>
						<span data-checkout-total={total.toFixed(2)}>
							{total.toFixed(2)} GS
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function ConfirmView({
	orderNum,
	onDone,
}: {
	orderNum: string;
	onDone: () => void;
}) {
	return (
		<div
			data-component="eshop-confirm"
			data-framework="react"
			style={{ padding: '48px 24px', textAlign: 'center' }}
		>
			<div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
			<h2
				style={{
					fontSize: '22px',
					fontWeight: '700',
					color: 'var(--vm-text)',
					marginBottom: '8px',
				}}
			>
				Order Confirmed!
			</h2>
			<p
				style={{
					fontSize: '14px',
					color: 'var(--vm-muted)',
					marginBottom: '8px',
				}}
			>
				Thank you for your order. A confirmation has been sent to your inbox.
			</p>
			<p
				style={{
					fontSize: '13px',
					color: 'var(--vm-muted)',
					marginBottom: '28px',
				}}
			>
				Order reference:{' '}
				<strong data-order-id={orderNum} style={{ color: 'var(--vm-text)' }}>
					{orderNum}
				</strong>
			</p>
			<button
				type="button"
				onClick={onDone}
				style={{
					background: 'var(--vm-primary)',
					color: '#fff',
					border: 'none',
					borderRadius: 'var(--vm-radius)',
					padding: '11px 28px',
					fontSize: '14px',
					fontWeight: '600',
					cursor: 'pointer',
					fontFamily: 'var(--vm-font)',
				}}
			>
				Continue Shopping
			</button>
		</div>
	);
}

// ── Main island ──────────────────────────────────────────────────────────────

export default function EshopProductGrid() {
	const [ready, setReady] = useState(false);
	const [view, setView] = useState<View>('grid');
	const [currentSku, setCurrentSku] = useState<string | null>(null);
	const [cat, setCat] = useState<string | null>(null);
	const [visibleCount, setVisibleCount] = useState(PER_PAGE);
	const [cart, setCartState] = useState<CartItem[]>([]);
	const [orderNum, setOrderNum] = useState('');

	useEffect(() => {
		const { sku, cat: urlCat, view: urlView } = getUrlState();
		if (urlView === 'cart') {
			setView('cart');
		} else if (urlView === 'checkout') {
			setView('checkout');
		} else if (sku) {
			setView('detail');
			setCurrentSku(sku);
		}
		setCat(urlCat);
		setCartState(getCart());
		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const { sku: s, cat: c, view: v } = getUrlState();
			if (v === 'cart') {
				setView('cart');
			} else if (v === 'checkout') {
				setView('checkout');
			} else if (s) {
				setView('detail');
				setCurrentSku(s);
			} else {
				setView('grid');
				setCat(c);
				setVisibleCount(PER_PAGE);
			}
		};
		const onCat = (e: Event) => {
			setCat((e as CustomEvent<string | null>).detail);
			setView('grid');
			setVisibleCount(PER_PAGE);
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

		window.addEventListener('popstate', onPop);
		window.addEventListener('eshop:cat', onCat);
		window.addEventListener('eshop:product', onProduct);
		window.addEventListener('eshop:cart', onCartEvent);
		window.addEventListener('eshop:view', onViewEvent);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('eshop:cat', onCat);
			window.removeEventListener('eshop:product', onProduct);
			window.removeEventListener('eshop:cart', onCartEvent);
			window.removeEventListener('eshop:view', onViewEvent);
		};
	}, []);

	if (!ready) {
		return (
			<div
				style={{ padding: '40px 24px', color: '#888', fontFamily: 'system-ui' }}
			>
				Loading…
			</div>
		);
	}

	if (view === 'confirm') {
		return (
			<ConfirmView
				orderNum={orderNum}
				onDone={() => {
					const url = new URL(window.location.href);
					url.searchParams.delete('view');
					history.pushState(null, '', url.toString());
					setView('grid');
				}}
			/>
		);
	}

	if (view === 'checkout') {
		return (
			<CheckoutView
				cart={cart}
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
		);
	}

	if (view === 'cart') {
		return (
			<CartView
				cart={cart}
				onBack={() => {
					const url = new URL(window.location.href);
					url.searchParams.delete('view');
					url.searchParams.delete('sku');
					history.pushState(null, '', url.toString());
					setView('grid');
				}}
				onCheckout={() => goToView('checkout')}
			/>
		);
	}

	if (view === 'detail' && currentSku) {
		return (
			<ProductDetail
				sku={currentSku}
				onAddToCart={() => {
					addToCart(currentSku);
					goToView('cart');
				}}
			/>
		);
	}

	const all = cat ? getByCategory(cat) : products;
	const items = all.slice(0, visibleCount);

	return (
		<div
			data-component="eshop-product-grid"
			data-framework="react"
			style={{ padding: '24px' }}
		>
			<div
				style={{
					marginBottom: '14px',
					color: 'var(--vm-muted)',
					fontSize: '13px',
				}}
			>
				{all.length} product{all.length !== 1 ? 's' : ''}
				{cat ? ` in "${cat}"` : ''}
			</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
					gap: '16px',
				}}
			>
				{items.map((p) => (
					<ProductCard key={p.sku} p={p} onClick={() => goToProduct(p.sku)} />
				))}
			</div>
			{visibleCount < all.length && (
				<div style={{ textAlign: 'center', marginTop: '24px' }}>
					<button
						type="button"
						onClick={() => setVisibleCount((c) => c + PER_PAGE)}
						style={{
							padding: '8px 20px',
							border: '1px solid var(--vm-border)',
							borderRadius: 'var(--vm-radius)',
							background: 'transparent',
							color: 'var(--vm-accent)',
							cursor: 'pointer',
							fontFamily: 'var(--vm-font-ui)',
							fontSize: '13px',
						}}
					>
						Load more ({all.length - visibleCount} remaining)
					</button>
				</div>
			)}
		</div>
	);
}
