/**
 * @qscrape L2 / react / scoretap / island
 * @component ScoretapTeamsList
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { gameColors, gameLabels, teams } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
type View = 'list' | 'team';

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}
function getViewState(): { view: View; id: string | null } {
	const team = new URLSearchParams(window.location.search).get('team');
	if (team) {
		return { view: 'team', id: team };
	}
	return { view: 'list', id: null };
}

function goToTeam(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('team', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:team', { detail: id }));
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

export default function ScoretapTeamsList() {
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
		const onTeam = (e: Event) => {
			const id = (e as CustomEvent<string>).detail;
			setView('team');
			setSelectedId(id);
		};
		window.addEventListener('popstate', onPop);
		window.addEventListener('scoretap:game', onGame);
		window.addEventListener('scoretap:team', onTeam);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('scoretap:game', onGame);
			window.removeEventListener('scoretap:team', onTeam);
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
		activeGame === 'all' ? teams : teams.filter((t) => t.game === activeGame);

	if (view === 'team' && selectedId) {
		const team = teams.find((t) => t.id === selectedId);
		if (team) {
			return (
				<div
					data-component="scoretap-teams-list"
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
							Team Detail
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
							data-team-id={team.id}
						>
							{team.name}
						</div>
						<div style={{ fontSize: '13px', color: 'var(--st-muted)' }}>
							{team.abbr}
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
									background: gameColors[team.game],
								}}
								data-game={team.game}
							>
								{gameLabels[team.game]}
							</span>
							{team.rank != null && (
								<span style={{ fontSize: '12px', color: 'var(--st-muted)' }}>
									Rank #{team.rank} · {team.rankPoints?.toLocaleString()} pts
								</span>
							)}
							{team.rankChange != null && team.rankChange !== 'same' && (
								<span
									style={{
										fontSize: '11px',
										fontWeight: '600',
										color:
											team.rankChange === 'up' ? 'var(--st-live)' : '#ef4444',
									}}
								>
									{team.rankChange === 'up'
										? `▲${team.rankDelta}`
										: `▼${team.rankDelta}`}
								</span>
							)}
						</div>
					</div>
				</div>
			);
		}
	}

	return (
		<div
			data-component="scoretap-teams-list"
			data-framework="react"
			style={widgetStyle}
		>
			<div style={headStyle}>Teams</div>
			{filtered.length === 0 && (
				<div
					style={{
						padding: '16px',
						fontSize: '13px',
						color: 'var(--st-muted)',
					}}
				>
					No teams.
				</div>
			)}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
					gap: '1px',
					background: 'var(--st-border)',
				}}
			>
				{filtered.map((t) => (
					<div
						key={t.id}
						data-team-id={t.id}
						data-game={t.game}
						onClick={() => goToTeam(t.id)}
						style={{
							padding: '14px 16px',
							background: 'var(--st-surface)',
							cursor: 'pointer',
							display: 'flex',
							flexDirection: 'column',
							gap: '6px',
						}}
					>
						<div
							style={{
								fontSize: '14px',
								fontWeight: '700',
								color: 'var(--st-text)',
							}}
						>
							{t.name}
						</div>
						<div
							style={{
								fontSize: '11px',
								color: 'var(--st-muted)',
								fontFamily: 'var(--st-font-score)',
							}}
						>
							{t.abbr}
						</div>
						<span
							style={{
								display: 'inline-block',
								padding: '2px 7px',
								borderRadius: '3px',
								fontSize: '11px',
								fontWeight: '600',
								color: '#fff',
								background: gameColors[t.game],
								alignSelf: 'flex-start',
							}}
						>
							{gameLabels[t.game]}
						</span>
						{t.rank != null && (
							<div style={{ fontSize: '11px', color: 'var(--st-muted)' }}>
								#{t.rank} · {t.rankPoints?.toLocaleString()} pts
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
