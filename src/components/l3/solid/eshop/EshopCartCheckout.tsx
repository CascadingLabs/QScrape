import { createEffect, createSignal, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import {
	CART_EVENT,
	cartCount,
	clearCart,
	getCart,
	getView,
	ORDER_EVENT,
	setView,
	type ValidateType,
	VIEW_EVENT,
	type ViewState,
	validateInput,
} from '../../../../data/eshop/l3cart';
import { formatPrice, getProductBySku } from '../../../../data/eshop/products';
import '../../../../styles/l3/eshop.css';

function TotalCanvas(props: { total: number }) {
	let canvas: HTMLCanvasElement | undefined;

	createEffect(() => {
		const t = props.total;
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#1e1e1e';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = 'bold 16px "DM Sans", system-ui, sans-serif';
		ctx.fillStyle = 'oklch(55% 0.18 145)';
		ctx.textBaseline = 'middle';
		ctx.fillText(formatPrice(t), 10, canvas.height / 2);
	});

	return (
		<canvas
			ref={canvas}
			width={260}
			height={32}
			style={{ display: 'block', 'border-radius': '4px' }}
		/>
	);
}

function ErrorCanvas(props: { errors: string[] }) {
	let canvas: HTMLCanvasElement | undefined;

	createEffect(() => {
		const errs = props.errors;
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		const lineH = 18;
		canvas.height = Math.max(errs.length * lineH + 8, 1);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (errs.length === 0) {
			return;
		}
		ctx.font = '12px "DM Sans", system-ui, sans-serif';
		ctx.fillStyle = 'oklch(58% 0.22 25)';
		for (let i = 0; i < errs.length; i++) {
			ctx.fillText(`\u2022 ${errs[i]}`, 4, (i + 1) * lineH);
		}
	});

	return (
		<canvas
			ref={canvas}
			width={280}
			height={1}
			style={{ display: 'block', 'border-radius': '4px' }}
		/>
	);
}

function OrderIdCanvas(props: { orderId: string }) {
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
		ctx.font = 'bold 14px "DM Sans", system-ui, sans-serif';
		ctx.fillStyle = '#888888';
		ctx.fillText(props.orderId, 0, 15);
	});

	return (
		<canvas
			ref={canvas}
			width={240}
			height={20}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
		/>
	);
}

export default function EshopCartCheckout() {
	let rootEl: HTMLDivElement | undefined;
	const [ready, setReady] = createSignal(false);
	const [total, setTotal] = createSignal(0);
	const [count, setCount] = createSignal(0);
	const [view, setViewState] = createSignal<ViewState>(getView());
	const [errors, setErrors] = createSignal<string[]>([]);
	const [orderId, setOrderId] = createSignal('');

	function loadCart() {
		const cart = getCart();
		let t = 0;
		for (const ci of cart) {
			const p = getProductBySku(ci.sku);
			if (p) {
				t += (p.salePrice ?? p.basePrice) * ci.qty;
			}
		}
		setTotal(t);
		setCount(cartCount(cart));
	}

	function handleOrderNow() {
		const root = rootEl?.getRootNode() ?? document;
		const inputs = Array.from(
			(root as Document | ShadowRoot).querySelectorAll<HTMLInputElement>(
				'input[data-9]',
			),
		);
		const msgs: string[] = [];
		for (const el of inputs) {
			const type = (el.dataset['10'] ?? 'text') as ValidateType;
			const err = validateInput(el.value, type);
			if (err) {
				el.style.borderColor = 'var(--vm3-sale)';
				msgs.push(`${el.dataset['3']}: ${err}`);
			} else {
				el.style.borderColor = 'var(--vm3-cta)';
			}
		}
		if (msgs.length > 0) {
			setErrors(msgs);
			return;
		}
		setErrors([]);
		const id = `VM3-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
		setOrderId(id);
		window.dispatchEvent(
			new CustomEvent(ORDER_EVENT, { detail: { orderId: id, total: total() } }),
		);
		clearCart();
		setView('confirm');
	}

	onMount(() => {
		fakeGetMs(null, 300, 200).then(() => {
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
	});

	return (
		<div ref={rootEl}>
			<Show when={!ready()}>
				<div class="a">Loading…</div>
			</Show>

			<Show when={ready() && view() === 'confirm'}>
				<div class="b h">
					<h3 class="c">Order Reference</h3>
					<OrderIdCanvas orderId={orderId()} />
					<a href="/l3/eshop/" class="i">
						Return to Shop
					</a>
				</div>
			</Show>

			<Show when={ready() && view() === 'checkout'}>
				<div class="b">
					<h3 class="c">Checkout</h3>
					<Show when={count() > 0}>
						<div class="d">
							<span class="e">Order Total</span>
							<TotalCanvas total={total()} />
						</div>
						<Show when={errors().length > 0}>
							<ErrorCanvas errors={errors()} />
						</Show>
						<button type="button" class="f" onClick={handleOrderNow}>
							Order Now
						</button>
					</Show>
					<Show when={count() === 0}>
						<span class="g">Add items to checkout</span>
					</Show>
				</div>
			</Show>

			<Show when={ready() && view() === 'cart'}>
				<div class="b">
					<h3 class="c">Quick Checkout</h3>
					<Show when={count() > 0}>
						<div class="d">
							<span class="e">Cart Total</span>
							<TotalCanvas total={total()} />
						</div>
					</Show>
					<Show when={count() === 0}>
						<span class="g">Your cart is empty</span>
					</Show>
				</div>
			</Show>

			<style>{`
				.a { min-height: 150px; display: flex; align-items: center; color: var(--vm3-muted); font-family: var(--vm3-font); font-size: 14px; }
				.b { background: var(--vm3-surface2); border: 1px solid var(--vm3-border); border-radius: var(--vm3-radius); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
				.c { font-family: var(--vm3-font); font-size: 14px; font-weight: 700; color: var(--vm3-text); text-transform: uppercase; letter-spacing: 0.06em; margin: 0; padding-bottom: 8px; border-bottom: 2px solid var(--vm3-primary); }
				.d { display: flex; flex-direction: column; gap: 6px; }
				.e { font-family: var(--vm3-font); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vm3-muted); }
				.f { padding: 12px 20px; background: var(--vm3-cta); color: #fff; border: none; border-radius: var(--vm3-radius); font-family: var(--vm3-font); font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.15s; width: 100%; }
				.f:hover { background: var(--vm3-cta-hover); }
				.g { font-family: var(--vm3-font); font-size: 14px; color: var(--vm3-muted); }
				.h { text-align: center; align-items: center; }
				.i { font-family: var(--vm3-font); font-size: 14px; color: var(--vm3-primary); text-decoration: none; }
				.i:hover { text-decoration: underline; }
			`}</style>
		</div>
	);
}
