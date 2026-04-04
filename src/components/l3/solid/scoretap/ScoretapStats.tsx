import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import '../../../../styles/l3/scoretap.css';

type StatRow = {
	id: string;
	label: string;
	game: string;
	value: string;
	detail: string;
};

const TOP_STATS: StatRow[] = [
	{
		id: 'zywoo-rating',
		label: 'ZywOo',
		game: 'CS2',
		value: '1.42',
		detail: 'Rating · IEM Katowice',
	},
	{
		id: 'faker-kda',
		label: 'Faker',
		game: 'LoL',
		value: '8.3',
		detail: 'KDA · LCK Spring',
	},
	{
		id: 'tenz-acs',
		label: 'TenZ',
		game: 'Valorant',
		value: '284',
		detail: 'ACS · VCT Americas',
	},
	{
		id: 'miracle-gpm',
		label: 'Miracle-',
		game: 'Dota 2',
		value: '812',
		detail: 'GPM · ESL Stockholm',
	},
	{
		id: 'jstn-goals',
		label: 'jstn',
		game: 'Rocket League',
		value: '3.8',
		detail: 'Goals/game · RLCS Spring',
	},
];

function StatCanvas(props: { value: string; width?: number }) {
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
		ctx.font = '700 15px "Roboto Mono", monospace';
		ctx.fillStyle = '#eaeef5';
		ctx.fillText(props.value, 2, 16);
	});
	return (
		<canvas
			ref={canvas}
			width={props.width ?? 60}
			height={20}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
		/>
	);
}

export default function ScoretapStats() {
	const [stats, setStats] = createSignal<StatRow[] | null>(null);

	onMount(() => {
		fakeGetMs(TOP_STATS, 300, 200).then(setStats);
	});

	return (
		<div data-island="solid-stats">
			<Show when={!stats()}>
				<div class="a">Loading…</div>
			</Show>
			<Show when={stats()}>
				<div class="b">
					<h3 class="c">Top Performers</h3>
					<ul class="d">
						<For each={stats() ?? []}>
							{(row) => (
								<li class="e" data-0={row.id}>
									<div class="f">
										<span class="g">{row.label}</span>
										<span class="h">{row.game}</span>
										<span class="i">{row.detail}</span>
									</div>
									<div class="j">
										<StatCanvas value={row.value} width={64} />
									</div>
								</li>
							)}
						</For>
					</ul>
				</div>
			</Show>
			<style>{`
				[data-island="solid-stats"] .a {
					min-height: 100px;
					display: flex;
					align-items: center;
					color: var(--st3-muted);
					font-family: var(--st3-font-ui);
					font-size: 14px;
				}
				[data-island="solid-stats"] .b {
					background: var(--st3-surface);
					border: 1px solid var(--st3-border);
					border-radius: var(--st3-radius);
					padding: 16px;
				}
				[data-island="solid-stats"] .c {
					font-family: var(--st3-font-ui);
					font-size: 13px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.07em;
					color: var(--st3-muted);
					margin: 0 0 12px;
					padding-bottom: 10px;
					border-bottom: 1px solid var(--st3-border);
				}
				[data-island="solid-stats"] .d {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				[data-island="solid-stats"] .e {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10px 0;
					border-bottom: 1px solid var(--st3-border);
					gap: 12px;
				}
				[data-island="solid-stats"] .e:last-child { border-bottom: none; }
				[data-island="solid-stats"] .f {
					display: flex;
					flex-direction: column;
					gap: 2px;
					overflow: hidden;
				}
				[data-island="solid-stats"] .g {
					font-family: var(--st3-font-ui);
					font-size: 14px;
					font-weight: 600;
					color: var(--st3-text);
				}
				[data-island="solid-stats"] .h {
					font-family: var(--st3-font-ui);
					font-size: 11px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.06em;
					color: var(--st3-muted);
				}
				[data-island="solid-stats"] .i {
					font-family: var(--st3-font-ui);
					font-size: 11px;
					color: var(--st3-muted);
				}
				[data-island="solid-stats"] .j {
					flex-shrink: 0;
				}
				[data-island="solid-stats"] .j canvas { display: block; }
			`}</style>
		</div>
	);
}
