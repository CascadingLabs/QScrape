import {
	mkdirSync,
	openSync,
	closeSync,
	readFileSync,
	writeFileSync,
	rmSync,
	copyFileSync,
	renameSync,
	existsSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { publications } from '../qsn/src/data/publications';

const output = resolve('qsn/dist');
const staging = resolve('.astro/network-output');
const previous = resolve('.astro/network-previous');
// Astro's image queue follows CPU affinity independently of build.concurrency.
// On Linux, one inherited CPU keeps its image processing from fanning out.
const cpu =
	process.platform === 'linux'
		? /Cpus_allowed_list:\s*(\d+)/.exec(
				readFileSync('/proc/self/status', 'utf8'),
			)?.[1]
		: undefined;
rmSync(staging, { recursive: true, force: true });
mkdirSync('.astro/network-logs', { recursive: true });

function build(task: string, id: string): void {
	const path = join('.astro/network-logs', `${id}.log`);
	const log = openSync(path, 'w');
	const started = Date.now();
	console.log(`Building ${id} with one prerender worker...`);
	const result = spawnSync(
		cpu ? 'taskset' : 'vp',
		cpu ? ['-c', cpu, 'vp', 'run', task] : ['run', task],
		{
			stdio: ['ignore', log, log],
			env: {
				...process.env,
				UV_THREADPOOL_SIZE: '1',
				QSN_PUBLICATION: id === 'news' ? 'dwarves' : id,
				QSN_BUILD_ROOT: staging,
			},
		},
	);
	closeSync(log);
	if (result.error || result.status !== 0) {
		console.error(readFileSync(path, 'utf8').split('\n').slice(-60).join('\n'));
		throw (
			result.error ??
			new Error(`${id} build failed with status ${result.status}`)
		);
	}
	console.log(`${id} built in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
}

for (const paper of publications) build('publication:build', paper.id);
build('news:index:build', 'news');
writeFileSync(
	join(staging, 'network-preview.json'),
	JSON.stringify(
		{
			version: 1,
			sourceSha: process.env.GITHUB_SHA ?? null,
			hub: { key: 'news', origin: 'https://news.qscrape.dev' },
			publications: publications.map(({ id, key, origin, articleCount }) => ({
				id,
				key,
				origin,
				articleCount,
			})),
		},
		null,
		2,
	),
);
copyFileSync('scripts/preview-news-network.mjs', join(staging, 'preview.mjs'));
rmSync(previous, { recursive: true, force: true });
if (existsSync(output)) renameSync(output, previous);
try {
	renameSync(staging, output);
} catch (error) {
	if (existsSync(previous) && !existsSync(output)) renameSync(previous, output);
	throw error;
}
rmSync(previous, { recursive: true, force: true });
console.log('Newsstand and six publications are ready in qsn/dist.');
