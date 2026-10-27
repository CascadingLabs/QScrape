import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { loadConfig, assertMainOnlyPolicies } from './lib/cloudflare-config';

const config = loadConfig();
const repository = `${config.repository.owner}/${config.repository.name}`;
const environment = config.githubEnvironment;
if (!process.argv.includes('--apply')) {
	console.log(
		`Creates a main-only ${environment} environment and stores an account-scoped Pages Write token as CLOUDFLARE_API_TOKEN for ${repository}. Run with --apply.`,
	);
} else {
	const run = (command: string, args: string[], input?: string) =>
		spawnSync(
			command === 'gh' && existsSync('/usr/bin/gh') ? '/usr/bin/gh' : command,
			args,
			{ input, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
		);
	const gh = (args: string[], input?: string) => {
		const result = run('gh', args, input);
		if (result.error || result.status !== 0)
			throw result.error ?? new Error(result.stderr.trim());
		return result.stdout.trim() ? JSON.parse(result.stdout) : undefined;
	};
	const endpoint = `repos/${repository}/environments/${environment}`;
	const existing = run('gh', ['api', endpoint]);
	if (existing.status !== 0 && !existing.stderr.includes('404'))
		throw new Error(existing.stderr.trim());
	if (existing.status !== 0)
		gh(
			['api', endpoint, '--method', 'PUT', '--input', '-'],
			JSON.stringify({
				deployment_branch_policy: {
					protected_branches: false,
					custom_branch_policies: true,
				},
			}),
		);
	const state = gh(['api', endpoint]);
	if (
		!state.deployment_branch_policy?.custom_branch_policies ||
		state.deployment_branch_policy.protected_branches
	)
		throw new Error(
			'Production environment must restrict deployment to the explicit main branch',
		);
	let policies = gh(['api', `${endpoint}/deployment-branch-policies`]);
	if (policies.branch_policies.length === 0) {
		gh(
			[
				'api',
				`${endpoint}/deployment-branch-policies`,
				'--method',
				'POST',
				'--input',
				'-',
			],
			JSON.stringify({ name: 'main', type: 'branch' }),
		);
		policies = gh(['api', `${endpoint}/deployment-branch-policies`]);
	}
	assertMainOnlyPolicies(policies.branch_policies);
	const secrets = gh(['api', `${endpoint}/secrets`]);
	if (
		secrets.secrets.some(
			(secret: { name: string }) => secret.name === 'CLOUDFLARE_API_TOKEN',
		)
	) {
		console.log(
			'Protected deployment secret already exists; its value was not read or replaced.',
		);
	} else {
		const body = {
			name: 'QScrape news GitOps deploy',
			policies: [
				{
					effect: 'allow',
					resources: {
						[`com.cloudflare.api.account.${config.accountId}`]: '*',
					},
					permission_groups: [{ id: '8d28297797f24fb8a0c332fe0866ec89' }],
				},
			],
		};
		const created = run('cf', [
			'user',
			'tokens',
			'create',
			'--body',
			JSON.stringify(body),
		]);
		if (created.error || created.status !== 0)
			throw created.error ?? new Error(created.stderr.trim());
		const token = JSON.parse(created.stdout) as { id: string; value?: string };
		const stored = token.value
			? run(
					'gh',
					[
						'secret',
						'set',
						'CLOUDFLARE_API_TOKEN',
						'--env',
						environment,
						'--repo',
						repository,
					],
					token.value,
				)
			: undefined;
		if (!stored || stored.status !== 0) {
			const revoked = run('cf', ['user', 'tokens', 'delete', token.id]);
			throw new Error(
				`Secret installation failed; new token ${token.id} ${revoked.status === 0 ? 'was revoked' : 'requires revocation'}. No token value was logged.`,
			);
		}
		console.log(
			`Stored account-scoped Pages Write token ${token.id} in the protected ${environment} environment. The value was not logged or written to disk.`,
		);
	}
}
