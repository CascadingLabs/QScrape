import { spawnSync } from 'node:child_process';
import { publications } from '../qsn/src/data/publications';

const total = publications.reduce(
	(count, paper) => count + paper.articleCount,
	0,
);
if (total !== 100_000)
	throw new Error(`Expected 100,000 articles; registry has ${total}`);
const globalIds = new Set<string>();
for (const paper of publications) {
	const result = spawnSync('bun', ['scripts/verify-qsn.ts', '--ids'], {
		stdio: ['ignore', 'pipe', 'inherit'],
		encoding: 'utf8',
		maxBuffer: 8 * 1024 * 1024,
		env: { ...process.env, QSN_PUBLICATION: paper.id },
	});
	if (result.error || result.status !== 0)
		throw result.error ?? new Error(`${paper.name} fixture failed`);
	const inventory = JSON.parse(result.stdout) as {
		ids: string[];
		summary: string;
	};
	for (const id of inventory.ids) {
		if (globalIds.has(id))
			throw new Error(`Article ID collides across publications: ${id}`);
		globalIds.add(id);
	}
	console.log(inventory.summary);
}
console.log(
	`Verified six independent fixtures totaling ${total.toLocaleString('en')} articles.`,
);
