// @qscrape L3 / react island / scoretap — team search + filtered list
// Anti-bot: CSS-assembled text — team names rendered in shuffled DOM order,
// CSS flex order restores visual sequence. textContent returns words scrambled.
import { useEffect, useState } from 'react';
import { fakeGetMs } from '../../../../data/api';
import {
	type Game,
	gameColors,
	gameLabels,
	type Team,
	teams,
} from '../../../../data/scoretap/data';
import '../../../../styles/l3/scoretap.css';
import styles from './ScoretapTeamSearch.module.css';

function seedHash(s: string): number {
	return Math.abs(
		s.split('').reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0),
	);
}

function AssembledText({ text }: { text: string }) {
	const words = text.split(' ');
	const seed = seedHash(text);
	const indexed = words.map((word, i) => ({ word, i }));
	const shuffled = [...indexed].sort(
		(a, b) =>
			((seed * (a.i + 3)) % (words.length + 1)) -
			((seed * (b.i + 3)) % (words.length + 1)),
	);
	return (
		<span className={styles.assembled}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.assembledWord}>
					{word}
				</span>
			))}
		</span>
	);
}

export default function ScoretapTeamSearch() {
	const [allTeams, setAllTeams] = useState<Team[] | null>(null);
	const [query, setQuery] = useState('');

	useEffect(() => {
		fakeGetMs(teams, 400, 250).then(setAllTeams);
	}, []);

	if (!allTeams) {
		return <div className={styles.loading}>Loading…</div>;
	}

	const q = query.toLowerCase().trim();
	const filtered = q
		? allTeams.filter(
				(t) =>
					t.name.toLowerCase().includes(q) ||
					t.abbr.toLowerCase().includes(q) ||
					gameLabels[t.game].toLowerCase().includes(q),
			)
		: allTeams;

	return (
		<div className={styles.root} data-island="react-team-search">
			<div className={styles.searchBar}>
				<input
					type="search"
					className={styles.input}
					placeholder="Search teams…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					aria-label="Search teams"
				/>
			</div>
			<ul className={styles.list}>
				{filtered.map((team) => {
					const color = gameColors[team.game as Game];
					return (
						<li
							key={team.id}
							className={styles.item}
							data-team-id={team.id}
							data-game={team.game}
						>
							<span className={styles.abbr} style={{ color }}>
								{team.abbr}
							</span>
							<span className={styles.name}>
								<AssembledText text={team.name} />
							</span>
							<span className={styles.game} style={{ color }}>
								{gameLabels[team.game]}
							</span>
						</li>
					);
				})}
				{filtered.length === 0 && (
					<li className={styles.empty}>No teams found.</li>
				)}
			</ul>
		</div>
	);
}
