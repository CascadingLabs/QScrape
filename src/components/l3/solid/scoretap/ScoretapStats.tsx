// @qscrape L3 / solid island / scoretap — top performers / stats panel
// Anti-bot: stats values drawn via ctx.fillText() to canvas — not in DOM text
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
			aria-label={props.value}
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
				<div class="st3-stats-loading">Loading…</div>
			</Show>
			<Show when={stats()}>
				<div class="st3-stats-panel">
					<h3 class="st3-stats-title">Top Performers</h3>
					<ul class="st3-stats-list">
						<For each={stats() ?? []}>
							{(row) => (
								<li class="st3-stats-item" data-stat-id={row.id}>
									<div class="st3-stats-left">
										<span class="st3-stats-name">{row.label}</span>
										<span class="st3-stats-game">{row.game}</span>
										<span class="st3-stats-detail">{row.detail}</span>
									</div>
									<div class="st3-stats-val">
										<StatCanvas value={row.value} width={64} />
									</div>
								</li>
							)}
						</For>
					</ul>
				</div>
			</Show>
			<style>{`
				.st3-stats-loading {
					min-height: 100px;
					display: flex;
					align-items: center;
					color: var(--st3-muted);
					font-family: var(--st3-font-ui);
					font-size: 14px;
				}
				.st3-stats-panel {
					background: var(--st3-surface);
					border: 1px solid var(--st3-border);
					border-radius: var(--st3-radius);
					padding: 16px;
				}
				.st3-stats-title {
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
				.st3-stats-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.st3-stats-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10px 0;
					border-bottom: 1px solid var(--st3-border);
					gap: 12px;
				}
				.st3-stats-item:last-child { border-bottom: none; }
				.st3-stats-left {
					display: flex;
					flex-direction: column;
					gap: 2px;
					overflow: hidden;
				}
				.st3-stats-name {
					font-family: var(--st3-font-ui);
					font-size: 14px;
					font-weight: 600;
					color: var(--st3-text);
				}
				.st3-stats-game {
					font-family: var(--st3-font-ui);
					font-size: 11px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.06em;
					color: var(--st3-muted);
				}
				.st3-stats-detail {
					font-family: var(--st3-font-ui);
					font-size: 11px;
					color: var(--st3-muted);
				}
				.st3-stats-val {
					flex-shrink: 0;
				}
				.st3-stats-val canvas { display: block; }
			`}</style>
		</div>
	);
}
