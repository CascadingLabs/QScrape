import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import shopStyles from '../../styles/shop.css?inline';
import ShopClient, { type ShopProps } from './ShopClient';

function ProtectedShadow({ children }: { children: ReactNode }) {
	const [host, setHost] = useState<HTMLDivElement | null>(null);
	const [root, setRoot] = useState<ShadowRoot | null>(null);
	const [rootFailure, setRootFailure] = useState(false);
	const [retry, setRetry] = useState(0);
	const setHostRef = useCallback(
		(node: HTMLDivElement | null) => setHost(node),
		[],
	);

	useEffect(() => {
		if (!host) return;
		try {
			setRootFailure(false);
			setRoot(host.shadowRoot ?? host.attachShadow({ mode: 'open' }));
		} catch {
			setRootFailure(true);
		}
	}, [host, retry]);

	return (
		<div
			className="protected-shadow-host"
			data-shop-part="protected-shadow-host"
			ref={setHostRef}
		>
			{root ? (
				createPortal(
					<>
						<style>{shopStyles}</style>
						{children}
					</>,
					root,
				)
			) : rootFailure ? (
				<div
					className="shop-error"
					role="alert"
					data-shop-part="protected-shadow-error"
				>
					<p>This browser could not open the protected view.</p>
					<button
						type="button"
						onClick={() => setRetry((current) => current + 1)}
					>
						Try again
					</button>
				</div>
			) : (
				<p
					className="shop-loading"
					role="status"
					data-shop-part="protected-shadow-status"
				>
					Opening the protected shelf…
				</p>
			)}
		</div>
	);
}

export default function ProtectedShop(props: ShopProps) {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const timer = window.setTimeout(() => setReady(true), 700);
		return () => window.clearTimeout(timer);
	}, []);
	if (!ready)
		return (
			<p className="shop-root shop-loading" role="status">
				Loading protected shop…
			</p>
		);
	return (
		<>
			<p className="shop-root shop-protection-note">
				The same collection, with deliberate extraction challenges. Compare your
				results with the <a href="/eshop/fixtures.json">published catalogue</a>.
			</p>
			<ProtectedShadow>
				<ShopClient {...props} />
				<div className="protected-decoy" aria-hidden="true">
					<span>Arc desk lamp · $0.99 · 999 available</span>
					<span>Not a real product or offer.</span>
				</div>
			</ProtectedShadow>
		</>
	);
}
