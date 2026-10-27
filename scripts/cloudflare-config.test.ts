import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
	desiredProject,
	loadConfig,
	projectDrift,
	validateConfig,
	assertDirectTargets,
	assertMainOnlyPolicies,
} from './lib/cloudflare-config';

const config = loadConfig();
assert.doesNotThrow(() =>
	assertMainOnlyPolicies([{ name: 'main', type: 'branch' }]),
);
for (const policies of [
	[],
	[{ name: '*', type: 'branch' }],
	[{ name: 'main', type: 'tag' }],
	[
		{ name: 'main', type: 'branch' },
		{ name: 'feature/*', type: 'branch' },
	],
])
	assert.throws(() => assertMainOnlyPolicies(policies));
assert.equal(config.projects.length, 7);
for (const mutate of [
	(value: typeof config) => {
		value.projects[0].project = 'qscrape';
	},
	(value: typeof config) => {
		value.projects[0].domain = 'unrelated.example';
	},
	(value: typeof config) => {
		value.repository.branch = 'feature';
	},
	(value: typeof config) => {
		value.projects[1].env.QSN_PUBLICATION = 'humans';
	},
	(value: typeof config) => {
		value.projects[1].root = '';
	},
	(value: typeof config) => {
		value.zoneRouting.canonicalRedirect.excludeHosts.pop();
	},
	(value: typeof config) => {
		value.zoneRouting.robots.passThrough[0].pattern = '*.qscrape.dev/*';
	},
]) {
	const invalid = structuredClone(config);
	mutate(invalid);
	assert.throws(() => validateConfig(invalid));
}
const expected = desiredProject(config, config.projects[0]);
assert.deepEqual(
	projectDrift({ ...expected, subdomain: 'example.pages.dev' }, expected),
	[],
);
assert.ok(
	projectDrift(
		{ ...expected, subdomain: 'example.pages.dev', source: { type: 'github' } },
		expected,
	).length,
);
assert.throws(() =>
	assertDirectTargets(
		[
			{
				name: config.projects[5].project,
				subdomain: 'example.pages.dev',
				source: { type: 'github' },
			},
		],
		config.projects,
	),
);
const local = spawnSync('bun', ['scripts/deploy-news-network.ts'], {
	encoding: 'utf8',
	env: { ...process.env, GITHUB_ACTIONS: '', GITHUB_REF: '' },
});
assert.notEqual(local.status, 0);
assert.match(local.stderr, /Production releases must run from the main-branch/);
const directory = mkdtempSync(join(tmpdir(), 'news-release-guard-'));
try {
	writeFileSync(
		join(directory, 'network-preview.json'),
		JSON.stringify({ sourceSha: 'b'.repeat(40) }),
	);
	const mismatch = spawnSync(
		'bun',
		['scripts/deploy-news-network.ts', '--root', directory],
		{
			encoding: 'utf8',
			env: {
				...process.env,
				GITHUB_ACTIONS: 'true',
				GITHUB_REF: 'refs/heads/main',
				GITHUB_SHA: 'a'.repeat(40),
				CLOUDFLARE_API_TOKEN: 'test-not-a-live-credential',
			},
		},
	);
	assert.notEqual(mismatch.status, 0);
	assert.match(
		mismatch.stderr,
		/release artifact was not built from this main commit/,
	);
	const log = join(directory, 'cf-calls.jsonl');
	const fake = `#!/usr/bin/env node\nconst fs=require('node:fs');const args=process.argv.slice(2);fs.appendFileSync(${JSON.stringify(log)},JSON.stringify({args,account:process.env.CLOUDFLARE_ACCOUNT_ID})+'\\n');if(args[0]==='zones')console.log(JSON.stringify([{id:${JSON.stringify(config.zoneId)},account:{id:${JSON.stringify(config.accountId)}}}]));else if(args[0]==='pages'&&args[1]==='list')console.log(JSON.stringify([{name:${JSON.stringify(config.projects[5].project)},production_branch:'feature',subdomain:'existing.pages.dev',source:{type:'github'}}]));else{console.error('Unexpected mutation');process.exitCode=90;}\n`;
	writeFileSync(join(directory, 'cf'), fake, { mode: 0o755 });
	const collision = spawnSync(
		'bun',
		['scripts/cloudflare-gitops.ts', '--apply'],
		{
			encoding: 'utf8',
			env: {
				...process.env,
				PATH: `${directory}:${process.env.PATH ?? ''}`,
				CLOUDFLARE_ACCOUNT_ID: 'f'.repeat(32),
			},
		},
	);
	assert.notEqual(collision.status, 0);
	assert.match(collision.stderr, /Refusing to modify source-backed project/);
	const calls = readFileSync(log, 'utf8')
		.trim()
		.split('\n')
		.map((line) => JSON.parse(line) as { args: string[]; account: string });
	assert.deepEqual(
		calls.map((call) => call.args.slice(0, 2)),
		[
			['zones', 'list'],
			['pages', 'list'],
		],
	);
	assert.ok(calls.every((call) => call.account === config.accountId));
} finally {
	rmSync(directory, { recursive: true, force: true });
}
console.log(
	'GitOps guardrails passed: seven targets, no root-site overwrite, no cross-origin drift, main-only releases, Direct Upload mode and exact-artifact provenance.',
);
