import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import {
	desiredProject,
	loadConfig,
	projectDrift,
	assertDirectTargets,
	type PagesProject,
} from './lib/cloudflare-config';

const config = loadConfig();
if (process.argv.includes('--validate')) {
	console.log(
		`Validated seven GitOps build targets for ${config.repository.owner}/${config.repository.name}.`,
	);
} else {
	const apply = process.argv.includes('--apply');
	const cf = (args: string[]) => {
		const result = spawnSync('cf', args, {
			encoding: 'utf8',
			maxBuffer: 16 * 1024 * 1024,
			env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: config.accountId },
		});
		if (result.error || result.status !== 0)
			throw (
				result.error ??
				new Error(
					result.stderr.trim() || `cf ${args.slice(0, 3).join(' ')} failed`,
				)
			);
		return JSON.parse(result.stdout);
	};
	const zones = cf(['zones', 'list', '--name', config.zone]) as {
		id: string;
		account?: { id: string };
	}[];
	const zone = zones.find((item) => item.id === config.zoneId);
	if (!zone || zone.account?.id !== config.accountId)
		throw new Error(
			'Cloudflare zone/account does not match the checked-in target',
		);
	const projects = cf(['pages', 'list']) as PagesProject[];
	assertDirectTargets(projects, config.projects);
	const report: Record<string, unknown>[] = [];
	for (const target of config.projects) {
		const expected = desiredProject(config, target);
		let actual = projects.find((item) => item.name === target.project);
		if (!actual) {
			if (!apply) throw new Error(`Missing Pages project: ${target.project}`);
			actual = cf(['pages', 'create', '--body', JSON.stringify(expected)]);
			console.log(`Created Actions-managed Pages project ${target.project}.`);
		} else {
			const drift = projectDrift(actual, expected);
			if (drift.length) {
				if (!apply)
					throw new Error(
						`${target.project} configuration drift: ${drift.join(', ')}`,
					);
				actual = cf([
					'pages',
					'edit',
					target.project,
					'--body',
					JSON.stringify(expected),
				]);
				console.log(`Updated ${target.project}: ${drift.join(', ')}.`);
			}
		}
		if (!actual)
			throw new Error(`Pages project unavailable: ${target.project}`);
		const drift = projectDrift(actual, expected);
		if (drift.length)
			throw new Error(`${target.project} still differs: ${drift.join(', ')}`);
		const domains = cf([
			'pages',
			'domains',
			'list',
			'--project-name',
			target.project,
		]) as Record<string, any>[];
		let domain = domains.find((item) => item.name === target.domain);
		if (!domain) {
			if (!apply) throw new Error(`Missing Pages domain: ${target.domain}`);
			domain = cf([
				'pages',
				'domains',
				'create',
				target.project,
				'--name',
				target.domain,
			]);
			console.log(`Attached ${target.domain}.`);
		}
		const records = cf([
			'dns',
			'records',
			'list',
			'--zone',
			config.zone,
			'--name',
			target.domain,
		]) as Record<string, any>[];
		const record = records.find((item) => item.name === target.domain);
		if (
			record &&
			(record.type !== 'CNAME' ||
				record.content !== actual.subdomain ||
				!record.proxied)
		)
			throw new Error(
				`Conflicting DNS record for ${target.domain}; no record was overwritten`,
			);
		if (!record) {
			if (!apply) throw new Error(`Missing DNS record: ${target.domain}`);
			cf([
				'dns',
				'records',
				'create',
				'--zone',
				config.zone,
				'--body',
				JSON.stringify({
					type: 'CNAME',
					name: target.domain,
					content: actual.subdomain,
					proxied: true,
					ttl: 1,
					comment: 'QScrape news GitOps publication',
				}),
			]);
			console.log(`Mapped ${target.domain} to ${actual.subdomain}.`);
		}
		report.push({
			project: target.project,
			domain: target.domain,
			pagesDomain: actual.subdomain,
			domainStatus: domain?.status,
			root: target.root,
			output: target.output,
		});
		console.log(`${target.key}: Pages target and DNS mapping verified.`);
	}
	mkdirSync('.astro', { recursive: true });
	writeFileSync(
		'.astro/cloudflare-gitops-report.json',
		JSON.stringify(
			{ checkedAt: new Date().toISOString(), applied: apply, projects: report },
			null,
			2,
		),
	);
}
