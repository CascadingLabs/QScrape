import { useEffect, useRef, useState } from 'react';
import { ShopApp, type ShopProps } from '../javascript-eshop/ShopClient';
import { parseCatalogue } from '../../lib/eshop/api-client';
import type { Product } from '../../data/eshop/catalog';
import {
	TURNSTILE_ACTION,
	TURNSTILE_SITE_KEY,
} from '../../lib/turnstile/config';

interface Turnstile {
	render(
		container: HTMLElement,
		options: {
			sitekey: string;
			action: string;
			callback: (token: string) => void;
			'expired-callback': () => void;
			'error-callback': () => boolean;
			theme: 'light';
		},
	): string;
	reset(id: string): void;
	remove(id: string): void;
}
declare global {
	interface Window {
		turnstile?: Turnstile;
	}
}
let scriptPromise: Promise<void> | undefined;
function loadWidget(): Promise<void> {
	if (window.turnstile) return Promise.resolve();
	if (scriptPromise) return scriptPromise;
	const pending = new Promise<void>((resolve, reject) => {
		const script = document.createElement('script');
		script.src =
			'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
		script.async = true;
		const timer = window.setTimeout(
			() => reject(new Error('Widget timeout')),
			15_000,
		);
		script.onload = () => {
			window.clearTimeout(timer);
			if (window.turnstile) resolve();
			else reject(new Error('Widget unavailable'));
		};
		script.onerror = () => {
			window.clearTimeout(timer);
			reject(new Error('Widget unavailable'));
		};
		document.head.append(script);
	}).catch((error: unknown) => {
		scriptPromise = undefined;
		throw error;
	});
	scriptPromise = pending;
	return pending;
}
export default function TurnstileShop(props: ShopProps) {
	const container = useRef<HTMLDivElement>(null);
	const widget = useRef<string | undefined>(undefined);
	const [token, setToken] = useState('');
	const [products, setProducts] = useState<readonly Product[] | null>(null);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState('');
	const [attempt, setAttempt] = useState(0);
	useEffect(() => {
		if (products) return;
		let disposed = false;
		loadWidget()
			.then(() => {
				if (disposed || !container.current || !window.turnstile) return;
				widget.current = window.turnstile.render(container.current, {
					sitekey:
						import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || TURNSTILE_SITE_KEY,
					action: TURNSTILE_ACTION,
					theme: 'light',
					callback: (value) => {
						if (!disposed) {
							setToken(value);
							setMessage('');
						}
					},
					'expired-callback': () => {
						if (!disposed) {
							setToken('');
							setMessage('The check expired. Please try again.');
						}
					},
					'error-callback': () => {
						if (!disposed) {
							setToken('');
							setMessage('The browser check is unavailable. Please try again.');
						}
						return true;
					},
				});
			})
			.catch(() => {
				if (!disposed)
					setMessage('The browser check could not load. Please try again.');
			});
		return () => {
			disposed = true;
			if (widget.current && window.turnstile)
				window.turnstile.remove(widget.current);
			widget.current = undefined;
		};
	}, [attempt, products]);
	async function continueToShop() {
		if (!token || busy) return;
		setBusy(true);
		setMessage('');
		try {
			const response = await fetch('/api/eshop/turnstile/catalogue/', {
				method: 'POST',
				signal: AbortSignal.timeout(15_000),
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 'cf-turnstile-response': token }),
			});
			if (!response.ok) throw new Error('Verification failed');
			setProducts(parseCatalogue(await response.json()));
		} catch {
			setMessage('We couldn’t verify this request. Please try again.');
		} finally {
			setBusy(false);
			setToken('');
			if (widget.current && window.turnstile)
				window.turnstile.reset(widget.current);
		}
	}
	if (products) return <ShopApp {...props} products={products} />;
	return (
		<section className="shop-root shop-access" aria-labelledby="access-title">
			<p className="shop-wordmark">Objects</p>
			<h1 id="access-title">A quick check before you browse.</h1>
			<div ref={container} />
			{message && <p role="alert">{message}</p>}
			<button
				className="shop-add-button"
				type="button"
				disabled={!token || busy}
				onClick={continueToShop}
			>
				{busy ? 'Checking…' : 'Continue to shop'}
			</button>
			{message && (
				<button
					className="shop-remove-button"
					type="button"
					onClick={() => {
						setToken('');
						setMessage('');
						setAttempt((value) => value + 1);
					}}
				>
					Try again
				</button>
			)}
		</section>
	);
}
