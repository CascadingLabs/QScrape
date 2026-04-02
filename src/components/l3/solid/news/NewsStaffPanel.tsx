import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import { reporters } from '../../../../data/news/articles';
import '../../../../styles/l3/news.css';

function EmailCanvas(props: { email: string }) {
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
		ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';
		ctx.fillStyle = 'var(--hn3-accent)';
		ctx.fillText(props.email, 0, 14);
	});
	return (
		<canvas
			ref={canvas}
			width={220}
			height={18}
			style={{ display: 'inline-block', vertical: 'middle' }}
		/>
	);
}

export default function NewsStaffPanel() {
	const [staff, setStaff] = createSignal<typeof reporters | null>(null);

	onMount(() => {
		fakeGetMs(reporters.slice(0, 3), 300, 200).then(setStaff);
	});

	return (
		<div>
			<Show when={!staff()}>
				<div class="hn3-staff-loading">Loading…</div>
			</Show>
			<Show when={staff()}>
				<div class="hn3-staff-panel">
					<h3 class="hn3-staff-title">Newsroom</h3>
					<ul class="hn3-staff-list">
						<For each={staff() ?? []}>
							{(person) => (
								<li class="hn3-staff-item" data-reporter={person.name}>
									<span class="hn3-staff-name">{person.name}</span>
									<span class="hn3-staff-role">
										{person.title} · {person.beat}
									</span>
									<span class="hn3-staff-email">
										<EmailCanvas email={person.email} />
									</span>
								</li>
							)}
						</For>
					</ul>
				</div>
			</Show>
			<style>{`
				.hn3-staff-loading {
					min-height: 100px;
					display: flex;
					align-items: center;
					color: var(--hn3-muted);
					font-family: var(--hn3-font-body);
					font-size: 14px;
				}
				.hn3-staff-panel {
					background: var(--hn3-surface2);
					border: 1px solid var(--hn3-border);
					padding: 20px;
				}
				.hn3-staff-title {
					font-family: var(--hn3-font-display);
					font-size: 15px;
					font-weight: 700;
					color: var(--hn3-text);
					margin: 0 0 12px;
					padding-bottom: 10px;
					border-bottom: 2px solid var(--hn3-accent);
					letter-spacing: -0.2px;
				}
				.hn3-staff-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.hn3-staff-item {
					display: flex;
					flex-direction: column;
					gap: 2px;
					padding: 10px 0;
					border-bottom: 1px solid var(--hn3-border);
				}
				.hn3-staff-item:last-child { border-bottom: none; }
				.hn3-staff-name {
					font-family: var(--hn3-font-body);
					font-size: 14px;
					font-weight: 600;
					color: var(--hn3-text);
				}
				.hn3-staff-role {
					font-family: var(--hn3-font-body);
					font-size: 12px;
					color: var(--hn3-muted);
					font-style: italic;
				}
				.hn3-staff-email {
					display: block;
					margin-top: 2px;
				}
			`}</style>
		</div>
	);
}
