import { useCallback, useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import {
	CART_EVENT,
	getCart,
	getView,
	removeFromCart,
	setView,
	type ValidateType,
	VIEW_EVENT,
	type ViewState,
	validateInput,
} from '../../../../data/eshop/l3cart';
import type { ProductMeta } from '../../../../data/eshop/products';
import { getProductBySku } from '../../../../data/eshop/products';
import '../../../../styles/l3/eshop.css';
import styles from './EshopCartItems.module.css';

function seedHash(s: string): number {
	return Math.abs(
		s.split('').reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0),
	);
}

function AssembledText({ text }: { text: string }) {
	const words = text.split(' ');
	const seed = seedHash(text);
	const indexed = words.map((word, i) => ({ word, i }));
	const shuffled = [...indexed].sort(
		(a, b) =>
			((seed * (a.i + 3)) % (words.length + 1)) -
			((seed * (b.i + 3)) % (words.length + 1)),
	);
	return (
		<span className={styles.b}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.c}>
					{word}
				</span>
			))}
		</span>
	);
}

type CartDisplayItem = {
	sku: string;
	product: ProductMeta;
	qty: number;
};

function FormField({
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
		<div className={styles.s}>
			<label className={styles.t}>
				<AssembledText text={label} />
				<input
					type={type}
					className={styles.u}
					placeholder={placeholder}
					data-2="true"
					data-3={validate}
					data-4={label}
					onChange={(e) => {
						const err = validateInput(e.target.value, validate);
						e.target.style.borderColor = err
							? 'var(--vm3-sale)'
							: e.target.value.trim()
								? 'var(--vm3-cta)'
								: '';
					}}
				/>
			</label>
		</div>
	);
}

export default function EshopCartItems() {
	const [ready, setReady] = useState(false);
	const [items, setItems] = useState<CartDisplayItem[]>([]);
	const [view, setViewState] = useState<ViewState>(getView);

	const loadCart = useCallback(() => {
		const cart = getCart();
		const display: CartDisplayItem[] = [];
		for (const ci of cart) {
			const p = getProductBySku(ci.sku);
			if (p) {
				display.push({ sku: ci.sku, product: p, qty: ci.qty });
			}
		}
		setItems(display);
	}, []);

	useEffect(() => {
		fakeGetMs(null, 400, 250).then(() => {
			loadCart();
			setReady(true);
		});

		const cartHandler = () => loadCart();
		const viewHandler = (e: Event) =>
			setViewState((e as CustomEvent<ViewState>).detail);
		const popHandler = () => setViewState(getView());

		window.addEventListener(CART_EVENT, cartHandler);
		window.addEventListener(VIEW_EVENT, viewHandler);
		window.addEventListener('popstate', popHandler);

		return () => {
			window.removeEventListener(CART_EVENT, cartHandler);
			window.removeEventListener(VIEW_EVENT, viewHandler);
			window.removeEventListener('popstate', popHandler);
		};
	}, [loadCart]);

	if (!ready) {
		return <div className={styles.a}>Loading…</div>;
	}

	if (view === 'confirm') {
		return (
			<div className={styles.v}>
				<div className={styles.w}>✓</div>
				<h2 className={styles.x}>
					<AssembledText text="Order Confirmed" />
				</h2>
				<p className={styles.y}>
					<AssembledText text="Thank you for your order" />
				</p>
				<p className={styles.z}>A confirmation has been sent to your inbox.</p>
				<a href="/l3/eshop/" className={styles.q}>
					Continue Shopping
				</a>
			</div>
		);
	}

	if (view === 'checkout') {
		return (
			<div className={styles.d}>
				<button
					type="button"
					className={styles.f}
					onClick={() => setView('cart')}
				>
					← Back to cart
				</button>
				<h2 className={styles.e}>
					<AssembledText text="Shipping Information" />
				</h2>
				<div className={styles.r}>
					<FormField label="First Name" placeholder="Aldric" validate="name" />
					<FormField
						label="Last Name"
						placeholder="Blackwood"
						validate="name"
					/>
				</div>
				<FormField
					label="Email Address"
					placeholder="aldric@example.com"
					validate="email"
					type="email"
				/>
				<FormField
					label="Street Address"
					placeholder="12 Irongate Lane"
					validate="address"
				/>
				<div className={styles.r}>
					<FormField label="City" placeholder="Stonehaven" validate="text" />
					<FormField label="Province" placeholder="Valdris" validate="text" />
				</div>
				<FormField
					label="Post Code"
					placeholder="VD-1401"
					validate="postcode"
				/>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className={styles.o}>
				<p className={styles.p}>Your cart is empty</p>
				<a href="/l3/eshop/" className={styles.q}>
					Continue Shopping
				</a>
			</div>
		);
	}

	return (
		<div className={styles.d}>
			<h2 className={styles.e}>
				<AssembledText text="Your Cart" />
			</h2>
			<div className={styles.g}>
				{items.map((item) => (
					<div key={item.sku} className={styles.h} data-0={item.sku}>
						<img
							src={item.product.image}
							alt={item.product.name}
							className={styles.i}
							loading="lazy"
						/>
						<div className={styles.j}>
							<span className={styles.k}>
								<AssembledText text={item.product.name} />
							</span>
							<span className={styles.l}>
								<AssembledText text={item.sku} />
							</span>
						</div>
						<span className={styles.m} data-1={item.qty}>
							<AssembledText text={`×${item.qty}`} />
						</span>
						<button
							type="button"
							className={styles.n}
							onClick={() => removeFromCart(item.sku)}
						>
							Remove
						</button>
					</div>
				))}
			</div>
			<a href="/l3/eshop/" className={styles.q}>
				← Continue Shopping
			</a>
		</div>
	);
}
