/**
 * @qscrape L2 / react / scoretap / island
 * @component ScoretapEventsList
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { events, gameColors, gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
type View = 'list' | 'event';

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}
function getViewState(): { view: View; id: string | null } {
	const ev = new URLSearchParams(window.location.search).get('event');
	if (ev) {
		return { view: 'event', id: ev };
	}
	return { view: 'list', id: null };
}

function goToEvent(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('event', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:event', { detail: id }));
	window.scrollTo(0, 0);
}

const widgetStyle: React.CSSProperties = {
	background: 'var(--st-surface)',
	border: '1px solid var(--st-border)',
	borderRadius: 'var(--st-radius)',
	overflow: 'hidden',
};
const headStyle: React.CSSProperties = {
	padding: '10px 16px',
	borderBottom: '1px solid var(--st-border)',
	fontSize: '12px',
	fontWeight: '600',
	textTransform: 'uppercase',
	letterSpacing: '0.06em',
	color: 'var(--st-muted)',
};

export default function ScoretapEventsList() {
	const [ready, setReady] = useState(false);
	const [activeGame, setActiveGame] = useState<GameOrAll>('all');
	const [view, setView] = useState<View>('list');
	const [selectedId, setSelectedId] = useState<string | null>(null);

	useEffect(() => {
		setActiveGame(getActiveGame());
		const vs = getViewState();
		setView(vs.view);
		setSelectedId(vs.id);
		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			setActiveGame(getActiveGame());
			const vs2 = getViewState();
			setView(vs2.view);
			setSelectedId(vs2.id);
		};
		const onGame = (e: Event) =>
			setActiveGame((e as CustomEvent<GameOrAll>).detail);
		const onEvent = (e: Event) => {
			const id = (e as CustomEvent<string>).detail;
			setView('event');
			setSelectedId(id);
		};
		window.addEventListener('popstate', onPop);
		window.addEventListener('scoretap:game', onGame);
		window.addEventListener('scoretap:event', onEvent);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('scoretap:game', onGame);
			window.removeEventListener('scoretap:event', onEvent);
		};
	}, []);

	if (!ready) {
		return (
			<div
				style={{
					padding: '12px',
					color: 'var(--st-muted)',
					fontFamily: 'var(--st-font-ui)',
				}}
			>
				Loading…
			</div>
		);
	}

	const filtered =
		activeGame === 'all' ? events : events.filter((e) => e.game === activeGame);

	if (view === 'event' && selectedId) {
		const ev = events.find((e) => e.id === selectedId);
		if (ev) {
			return (
				<div
					data-component="scoretap-events-list"
					data-framework="react"
					style={widgetStyle}
				>
					<div
						style={{
							...headStyle,
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							textTransform: 'none',
						}}
					>
						<button
							type="button"
							onClick={() => history.back()}
							style={{
								background: 'none',
								border: 'none',
								color: 'var(--st-muted)',
								cursor: 'pointer',
								fontSize: '12px',
								padding: '0',
								fontFamily: 'var(--st-font-ui)',
							}}
						>
							← Back
						</button>
						<span
							style={{
								fontSize: '12px',
								fontWeight: '600',
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
								color: 'var(--st-muted)',
							}}
						>
							Event Detail
						</span>
					</div>
					<div
						style={{
							padding: '16px',
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
						}}
					>
						<div
							style={{
								fontSize: '16px',
								fontWeight: '700',
								color: 'var(--st-text)',
							}}
							data-event-id={ev.id}
						>
							{ev.name}
						</div>
						<div
							style={{
								display: 'flex',
								gap: '8px',
								flexWrap: 'wrap',
								alignItems: 'center',
							}}
						>
							<span
								style={{
									display: 'inline-block',
									padding: '2px 7px',
									borderRadius: '3px',
									fontSize: '11px',
									fontWeight: '600',
									color: '#fff',
									background: gameColors[ev.game],
								}}
								data-game={ev.game}
							>
								{gameLabels[ev.game]}
							</span>
							<span
								style={{
									fontSize: '10px',
									fontWeight: '700',
									padding: '1px 6px',
									borderRadius: '3px',
									background:
										ev.status === 'live'
											? 'var(--st-live)'
											: 'var(--st-surface2)',
									color: ev.status === 'live' ? '#fff' : 'var(--st-muted)',
								}}
							>
								{ev.status === 'live'
									? 'LIVE'
									: ev.status === 'completed'
										? 'ENDED'
										: 'UPCOMING'}
							</span>
						</div>
						<div style={{ fontSize: '13px', color: 'var(--st-muted)' }}>
							{ev.dates}
						</div>
					</div>
				</div>
			);
		}
	}

	return (
		<div
			data-component="scoretap-events-list"
			data-framework="react"
			style={widgetStyle}
		>
			<div style={headStyle}>Events</div>
			{filtered.length === 0 && (
				<div
					style={{
						padding: '16px',
						fontSize: '13px',
						color: 'var(--st-muted)',
					}}
				>
					No events.
				</div>
			)}
			{filtered.map((ev) => (
				<div
					key={ev.id}
					data-event-id={ev.id}
					data-game={ev.game}
					onClick={() => goToEvent(ev.id)}
					style={{
						padding: '10px 16px',
						borderBottom: '1px solid var(--st-border)',
						cursor: 'pointer',
						display: 'flex',
						flexDirection: 'column',
						gap: '6px',
					}}
				>
					<div
						style={{
							fontSize: '13px',
							fontWeight: '500',
							color: 'var(--st-text)',
							textDecoration: 'underline dotted var(--st-muted)',
						}}
					>
						{ev.name}
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							flexWrap: 'wrap',
						}}
					>
						<span
							style={{
								display: 'inline-block',
								padding: '2px 7px',
								borderRadius: '3px',
								fontSize: '11px',
								fontWeight: '600',
								color: '#fff',
								background: gameColors[ev.game],
							}}
						>
							{gameLabels[ev.game]}
						</span>
						<span style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
							{ev.dates}
						</span>
						<span
							style={{
								fontSize: '10px',
								fontWeight: '700',
								padding: '1px 6px',
								borderRadius: '3px',
								background:
									ev.status === 'live'
										? 'var(--st-live)'
										: 'var(--st-surface2)',
								color: ev.status === 'live' ? '#fff' : 'var(--st-muted)',
							}}
						>
							{ev.status === 'live'
								? 'LIVE'
								: ev.status === 'completed'
									? 'ENDED'
									: 'UPCOMING'}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
