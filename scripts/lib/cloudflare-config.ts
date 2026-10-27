import { readFileSync } from 'node:fs';
import { publications } from '../../qsn/src/data/publications';

export interface PagesTarget {
	key: string;
	project: string;
	domain: string;
	root: string;
	output: string;
	task: string;
	env: Record<string, string>;
}
export interface GitOpsConfig {
	schemaVersion: number;
	accountId: string;
	zone: string;
	zoneId: string;
	repository: {
		owner: string;
		ownerId: string;
		name: string;
		id: string;
		branch: string;
	};
	projects: PagesTarget[];
	delivery: string;
	githubEnvironment: string;
}
export function loadConfig(): GitOpsConfig {
	const config = JSON.parse(
		readFileSync(
			new URL('../../deployment/cloudflare-pages.json', import.meta.url),
			'utf8',
		),
	) as GitOpsConfig;
	return validateConfig(config);
}
export function validateConfig(config: GitOpsConfig): GitOpsConfig {
	if (
		config.schemaVersion !== 1 ||
		!/^[a-f0-9]{32}$/.test(config.accountId) ||
		!/^[a-f0-9]{32}$/.test(config.zoneId)
	)
		throw new Error('Invalid Cloudflare account/zone configuration');
	if (
		config.delivery !== 'github-actions' ||
		config.repository.branch !== 'main' ||
		!config.githubEnvironment
	)
		throw new Error(
			'Expected a protected main-branch GitHub Actions deployment',
		);
	const expected = new Map<string, string>([
		['news', `news.${config.zone}`],
		...publications.map(
			(paper) => [paper.key, new URL(paper.origin).hostname] as const,
		),
	]);
	if (
		config.projects.length !== expected.size ||
		new Set(config.projects.map((target) => target.key)).size !== expected.size
	)
		throw new Error(
			'Expected one GitOps target for the hub and each publication',
		);
	for (const target of config.projects) {
		if (
			expected.get(target.key) !== target.domain ||
			target.project !== `qscrape-${target.key}`
		)
			throw new Error(`Invalid target: ${target.key}`);
		if (
			target.root !== (target.key === 'news' ? 'news-index' : 'qsn') ||
			target.output !== `dist/${target.key}`
		)
			throw new Error(`Build boundary differs: ${target.key}`);
		if (
			target.task !==
			(target.key === 'news' ? 'news:index:build' : 'publication:build')
		)
			throw new Error(`Invalid build task: ${target.key}`);
		if (target.env.QSN_BUILD_ROOT !== './dist')
			throw new Error(`Output root must remain within the app: ${target.key}`);
		const selected =
			target.key === 'news'
				? 'dwarves'
				: publications.find((paper) => paper.key === target.key)?.id;
		if (target.env.QSN_PUBLICATION !== selected)
			throw new Error(`Publication selection differs: ${target.key}`);
	}
	return config;
}
export interface PagesProject {
	name: string;
	production_branch?: string;
	subdomain: string;
	source?: unknown;
}
export function assertDirectTargets(
	projects: PagesProject[],
	targets: PagesTarget[],
): void {
	for (const target of targets) {
		if (projects.find((project) => project.name === target.project)?.source)
			throw new Error(
				`Refusing to modify source-backed project: ${target.project}`,
			);
	}
}
export function assertMainOnlyPolicies(
	policies: { name: string; type: string }[],
): void {
	if (
		policies.length !== 1 ||
		policies[0]?.name !== 'main' ||
		policies[0].type !== 'branch'
	)
		throw new Error(
			'Production secret access must allow exactly the main branch, without additional branch or tag policies',
		);
}
export function desiredProject(config: GitOpsConfig, target: PagesTarget) {
	return { name: target.project, production_branch: config.repository.branch };
}
export function projectDrift(
	actual: PagesProject,
	expected: ReturnType<typeof desiredProject>,
): string[] {
	const drift: string[] = [];
	if (actual.production_branch !== expected.production_branch)
		drift.push('production branch');
	if (actual.source)
		drift.push('project must use Direct Upload from GitHub Actions');
	return drift;
}
