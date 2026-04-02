/**
 * @qscrape L2 / solid / eshop / island
 * @component EshopCategoryNav
 */
import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { categories } from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

function getActiveCat(): string {
	return new URLSearchParams(window.location.search).get('cat') ?? 'All';
}

export default function EshopCategoryNav() {
	const [ready, setReady] = createSignal(false);
	const [active, setActive] = createSignal('All');

	const navigate = (cat: string) => {
		const url = new URL(window.location.href);
		if (cat === 'All') {
			url.searchParams.delete('cat');
		} else {
			url.searchParams.set('cat', cat);
		}
		history.pushState(null, '', url.toString());
		setActive(cat);
		window.dispatchEvent(
			new CustomEvent('eshop:cat', { detail: cat === 'All' ? null : cat }),
		);
	};

	const onPop = () => setActive(getActiveCat());
	const onCat = (e: Event) =>
		setActive((e as CustomEvent<string | null>).detail ?? 'All');

	onMount(() => {
		setActive(getActiveCat());
		fakeGet(null).then(() => setReady(true));
		window.addEventListener('popstate', onPop);
		window.addEventListener('eshop:cat', onCat);
	});

	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('eshop:cat', onCat);
	});

	const allCats = ['All', ...categories] as string[];

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{ padding: '12px', color: '#888', 'font-family': 'system-ui' }}
				>
					Loading…
				</div>
			}
		>
			<nav
				data-component="eshop-category-nav"
				data-framework="solid"
				style={{
					padding: '14px 24px',
					'border-bottom': '1px solid var(--vm-border)',
					display: 'flex',
					gap: '8px',
					'flex-wrap': 'wrap',
				}}
			>
				<For each={allCats}>
					{(cat) => (
						<button
							type="button"
							data-category={cat}
							data-active={active() === cat ? 'true' : undefined}
							onClick={() => navigate(cat)}
							style={{
								padding: '6px 14px',
								border:
									'1px solid ' +
									(active() === cat ? 'var(--vm-primary)' : 'var(--vm-border)'),
								'border-radius': 'var(--vm-radius)',
								background:
									active() === cat ? 'var(--vm-primary)' : 'transparent',
								color: active() === cat ? '#fff' : 'var(--vm-text)',
								cursor: 'pointer',
								'font-family': 'var(--vm-font)',
								'font-size': '13px',
								'font-weight': active() === cat ? '600' : '400',
							}}
						>
							{cat}
						</button>
					)}
				</For>
			</nav>
		</Show>
	);
}
