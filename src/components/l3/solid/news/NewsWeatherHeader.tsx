import { createSignal, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import { getLiveGeomantic } from '../../../../data/news/geomantic';
import '../../../../styles/l3/news.css';

function CanvasText(props: {
	text: string;
	width?: number;
	fontSize?: number;
	color?: string;
}) {
	let canvas: HTMLCanvasElement | undefined;
	onMount(() => {
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		const size = props.fontSize ?? 13;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = `700 ${size}px "Plus Jakarta Sans", system-ui, sans-serif`;
		const c = props.color ?? 'var(--hn3-text)';
		ctx.fillStyle = c;
		ctx.fillText(props.text, 0, size + 1);
	});
	return (
		<canvas
			ref={canvas}
			width={props.width ?? 280}
			height={(props.fontSize ?? 13) + 6}
			aria-label={props.text}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
		/>
	);
}

export default function NewsWeatherHeader() {
	const [updated, setUpdated] = createSignal<string | null>(null);

	onMount(() => {
		const geo = getLiveGeomantic();
		fakeGetMs(geo.updated, 300, 200).then(setUpdated);
	});

	return (
		<div>
			<Show when={!updated()}>
				<div class="hn3-wx-hdr-loading">Loading…</div>
			</Show>
			<Show when={updated()}>
				<div class="hn3-wx-hdr">
					<div class="hn3-wx-hdr-title">
						<CanvasText
							text="Geomantic Conditions"
							width={240}
							fontSize={15}
							color="var(--hn3-text)"
						/>
					</div>
					<div class="hn3-wx-hdr-updated">
						<CanvasText
							text={`Updated: ${updated()}`}
							width={320}
							fontSize={11}
							color="var(--hn3-muted)"
						/>
					</div>
				</div>
			</Show>
			<style>{`
				.hn3-wx-hdr-loading {
					min-height: 40px;
					display: flex;
					align-items: center;
					color: var(--hn3-muted);
					font-family: var(--hn3-font-body);
					font-size: 14px;
				}
				.hn3-wx-hdr {
					padding: 14px;
					background: var(--hn3-surface);
					display: flex;
					flex-direction: column;
					gap: 4px;
				}
				.hn3-wx-hdr-title {
					line-height: 1;
				}
				.hn3-wx-hdr-updated {
					line-height: 1;
				}
			`}</style>
		</div>
	);
}
