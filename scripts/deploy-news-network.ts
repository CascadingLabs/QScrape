import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { loadConfig } from './lib/cloudflare-config';

const config = loadConfig();
const rootIndex = process.argv.indexOf('--root');
const root = resolve(
	rootIndex >= 0 ? (process.argv[rootIndex + 1] ?? '') : 'qsn/dist',
);
const plan = config.projects.map((target) => ({
	target,
	directory: join(root, target.key),
}));
if (process.argv.includes('--plan')) {
	console.log(
		JSON.stringify(
			plan.map(({ target, directory }) => ({
				project: target.project,
				directory,
				branch: 'main',
			})),
			null,
			2,
		),
	);
} else {
	const sha = process.env.GITHUB_SHA ?? '';
	const token = process.env.CLOUDFLARE_API_TOKEN;
	if (
		process.env.GITHUB_ACTIONS !== 'true' ||
		process.env.GITHUB_REF !== 'refs/heads/main' ||
		!/^[a-f0-9]{40}$/.test(sha)
	)
		throw new Error(
			'Production releases must run from the main-branch GitHub Actions workflow',
		);
	if (!token)
		throw new Error('Missing protected Cloudflare Pages deployment credential');
	const provenance = JSON.parse(
		readFileSync(join(root, 'network-preview.json'), 'utf8'),
	) as { sourceSha?: string };
	if (provenance.sourceSha !== sha)
		throw new Error('The release artifact was not built from this main commit');
	const wrangler = resolve('node_modules/.bin/wrangler');
	if (!existsSync(wrangler))
		throw new Error('Install the locked dependencies before deployment');
	interface Deployment {
		id: string;
		url: string;
		environment: string;
		uses_functions?: boolean;
		latest_stage?: { status: string };
		deployment_trigger?: { metadata?: { commit_hash?: string } };
	}
	interface Project {
		production_branch: string;
		source?: unknown;
		canonical_deployment?: Deployment;
	}
	const api = async (project: string): Promise<Project> => {
		for (let attempt = 1; attempt <= 3; attempt++) {
			let response: Response;
			try {
				response = await fetch(
					`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/pages/projects/${project}`,
					{
						headers: { Authorization: `Bearer ${token}` },
						signal: AbortSignal.timeout(20_000),
					},
				);
			} catch (error) {
				if (attempt === 3) throw error;
				await new Promise((resolve) => setTimeout(resolve, 2_000));
				continue;
			}
			if ((response.status === 429 || response.status >= 500) && attempt < 3) {
				await response.body?.cancel();
				await new Promise((resolve) => setTimeout(resolve, 2_000));
				continue;
			}
			if (!response.ok)
				throw new Error(
					`Cloudflare project verification failed: ${project}, HTTP ${response.status}`,
				);
			const body = (await response.json()) as {
				success: boolean;
				result: Project;
			};
			if (!body.success)
				throw new Error(`Cloudflare project verification failed: ${project}`);
			return body.result;
		}
		throw new Error(`Cloudflare project verification exhausted: ${project}`);
	};
	const receipts: Record<string, unknown>[] = [];
	mkdirSync('.astro', { recursive: true });
	const saveReceipts = () =>
		writeFileSync(
			'.astro/cloudflare-deployment-receipts.json',
			JSON.stringify(
				{
					sha,
					checkedAt: new Date().toISOString(),
					complete: receipts.length === plan.length,
					deployments: receipts,
				},
				null,
				2,
			),
		);
	for (const { target, directory } of plan) {
		if (!existsSync(join(directory, 'index.html')))
			throw new Error(`Missing built site: ${target.key}`);
		if (
			existsSync(join(directory, 'functions')) ||
			existsSync(join(directory, '_worker.js'))
		)
			throw new Error(
				`Unexpected Functions in static publication ${target.key}`,
			);
		const manifest =
			target.key === 'news'
				? 'network-manifest.json'
				: 'benchmark-manifest.json';
		if (!existsSync(join(directory, manifest)))
			throw new Error(`Missing release inventory: ${target.key}`);
		const inventory = JSON.parse(
			readFileSync(join(directory, manifest), 'utf8'),
		) as { origin?: string; hubOrigin?: string };
		if (
			(inventory.origin ?? inventory.hubOrigin)?.replace(/\/$/, '') !==
			`https://${target.domain}`
		)
			throw new Error(`Release origin mismatch: ${target.key}`);
		const project = await api(target.project);
		if (project.source || project.production_branch !== 'main')
			throw new Error(
				`Remote project is not a main-branch Direct Upload target: ${target.project}`,
			);
		console.log(`GitOps deploying ${target.project} from ${sha}.`);
		const result = spawnSync(
			wrangler,
			[
				'pages',
				'deploy',
				'.',
				'--project-name',
				target.project,
				'--branch',
				'main',
				'--commit-hash',
				sha,
				'--commit-message',
				`GitOps main ${sha}`,
				'--commit-dirty=false',
			],
			{
				cwd: directory,
				stdio: 'inherit',
				env: {
					...process.env,
					CLOUDFLARE_ACCOUNT_ID: config.accountId,
					WRANGLER_SEND_METRICS: 'false',
					CI: 'true',
				},
			},
		);
		if (result.error || result.status !== 0)
			throw result.error ?? new Error(`${target.project} upload failed`);
		const deadline = Date.now() + 180_000;
		while (true) {
			const deployment = (await api(target.project)).canonical_deployment;
			if (
				deployment?.deployment_trigger?.metadata?.commit_hash === sha &&
				deployment.latest_stage?.status === 'success' &&
				deployment.environment === 'production'
			) {
				if (deployment.uses_functions)
					throw new Error(
						`Static publication unexpectedly deployed Functions: ${target.project}`,
					);
				receipts.push({
					project: target.project,
					domain: target.domain,
					sha,
					deploymentId: deployment.id,
					deploymentUrl: deployment.url,
					usesFunctions: deployment.uses_functions,
				});
				saveReceipts();
				break;
			}
			if (Date.now() > deadline)
				throw new Error(
					`Production deployment did not become current: ${target.project}`,
				);
			await new Promise((resolve) => setTimeout(resolve, 5_000));
		}
	}
	saveReceipts();
	console.log('All seven production deployments match the main commit.');
}
