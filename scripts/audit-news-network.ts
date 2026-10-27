import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { publications } from '../qsn/src/data/publications';

function countFiles(path: string): number {
	let count = 0;
	for (const entry of readdirSync(path, { withFileTypes: true })) {
		const file = join(path, entry.name);
		if (entry.isDirectory()) count += countFiles(file);
		else {
			count++;
			if (statSync(file).size > 25 * 1024 * 1024)
				throw new Error(`Asset exceeds 25 MiB: ${file}`);
		}
	}
	return count;
}

let total = 0;
for (const paper of publications) {
	const root = join('qsn/dist', paper.key);
	const manifest = JSON.parse(
		readFileSync(join(root, 'benchmark-manifest.json'), 'utf8'),
	);
	if (
		manifest.articleCount !== paper.articleCount ||
		manifest.origin !== paper.origin
	)
		throw new Error(`Manifest mismatch: ${paper.key}`);
	total += manifest.articleCount;
	const result = spawnSync('bun', ['scripts/audit-qsn-output.ts'], {
		stdio: 'inherit',
		env: { ...process.env, QSN_PUBLICATION: paper.id },
	});
	if (result.error || result.status !== 0)
		throw result.error ?? new Error(`${paper.key} output audit failed`);
	const files = countFiles(root);
	if (files > 20_000)
		throw new Error(
			`${paper.key} has ${files} files, over the planned Pages Free budget`,
		);
	console.log(
		`${paper.shortName}: ${files} files, within the planned per-site file budget.`,
	);
}
if (total !== 100_000)
	throw new Error(`Network article count differs: ${total}`);
const hubRoot = 'qsn/dist/news';
const hubFiles = countFiles(hubRoot);
if (hubFiles > 20_000)
	throw new Error(`Newsstand exceeds the planned file budget: ${hubFiles}`);
const hub = readFileSync(join(hubRoot, 'index.html'), 'utf8');
for (const paper of publications) {
	if (
		!hub.includes(`${paper.origin}/`) ||
		!hub.includes(`${paper.origin}/benchmark-manifest.json`)
	)
		throw new Error(`Newsstand link missing: ${paper.key}`);
}
const network = JSON.parse(
	readFileSync(join(hubRoot, 'network-manifest.json'), 'utf8'),
);
if (
	network.totalArticleCount !== total ||
	network.sisterEdges.length !== 30 ||
	network.hubLinks.length !== 6 ||
	network.hubReturnLinks.length !== 6
)
	throw new Error('Network host graph differs from its expected inventory');
if (!existsSync('qsn/dist/preview.mjs'))
	throw new Error('Portable preview server missing');
if (
	!readFileSync('qsn/dist/preview.mjs').equals(
		readFileSync('scripts/preview-news-network.mjs'),
	)
)
	throw new Error('Packaged preview server differs from the reviewed source');
console.log(
	`Network audit passed: six publications, ${total.toLocaleString('en')} articles, six hub links and 30 directed sister links.`,
);
