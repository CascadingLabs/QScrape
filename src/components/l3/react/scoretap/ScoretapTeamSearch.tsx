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
		<span className={styles.k}>
			{shuffled.map(({ word, i }) => (
				<span key={i} style={{ order: i }} className={styles.l}>
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
		return <div className={styles.a}>Loading…</div>;
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
		<div className={styles.b} data-island="react-team-search">
			<div className={styles.c}>
				<input
					type="search"
					className={styles.d}
					placeholder="Search teams…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>
			<ul className={styles.e}>
				{filtered.map((team) => {
					const color = gameColors[team.game as Game];
					return (
						<li
							key={team.id}
							className={styles.f}
							data-0={team.id}
							data-1={team.game}
						>
							<span className={styles.g} style={{ color }}>
								{team.abbr}
							</span>
							<span className={styles.h}>
								<AssembledText text={team.name} />
							</span>
							<span className={styles.i} style={{ color }}>
								{gameLabels[team.game]}
							</span>
						</li>
					);
				})}
				{filtered.length === 0 && <li className={styles.j}>No teams found.</li>}
			</ul>
		</div>
	);
}
