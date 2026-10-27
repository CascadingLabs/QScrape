import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	articles,
	authors,
	getArticle,
	sections,
	series,
} from '../qsn/src/data/news';
import { publication } from '../qsn/src/data/publications';

const failures: string[] = [];
const articleIds = new Set<string>();
const authorIds = new Set(authors.map((author) => author.id));
const seriesIds = new Set(series.map((item) => item.id));
const articleFormats = new Set<string>();
const checkedImages = new Set<string>();
let illustrated = 0;

if (articles.length !== publication.articleCount)
	failures.push(
		`Expected ${publication.articleCount} articles; found ${articles.length}`,
	);
for (const author of authors) {
	if (!existsSync(join('qsn/src/assets/authors', `${author.id}.png`)))
		failures.push(`Missing portrait: ${author.id}`);
}
for (const article of articles) {
	if (articleIds.has(article.id))
		failures.push(`Duplicate article ID: ${article.id}`);
	articleIds.add(article.id);
	articleFormats.add(article.format);
	if (
		!article.title ||
		!article.summary ||
		!article.body.length ||
		article.body.some((paragraph) => !paragraph.trim())
	) {
		failures.push(`Missing editorial content: ${article.id}`);
	}
	if (!authorIds.has(article.authorId))
		failures.push(`Unknown author: ${article.id}`);
	if (!sections.includes(article.section))
		failures.push(`Unknown section: ${article.id}`);
	if (article.seriesId && !seriesIds.has(article.seriesId))
		failures.push(`Unknown series: ${article.id}`);
	if (Number.isNaN(Date.parse(article.publishedAt)))
		failures.push(`Invalid publication date: ${article.id}`);
	if (getArticle(article.id)?.id !== article.id)
		failures.push(`Article lookup failed: ${article.id}`);
	if (article.image) {
		illustrated++;
		if (
			!article.image.alt ||
			!article.image.caption ||
			!article.image.src.startsWith('/images/qsn/')
		) {
			failures.push(`Invalid image metadata: ${article.id}`);
		} else if (!existsSync(join('qsn/public', article.image.src))) {
			failures.push(
				`Missing image asset: ${article.id} (${article.image.src})`,
			);
		} else if (!checkedImages.has(article.image.src)) {
			checkedImages.add(article.image.src);
			const name = article.image.src.split('/').pop();
			const source = join('qsn/src/assets/editorial', name ?? '');
			if (
				!existsSync(source) ||
				!readFileSync(source).equals(
					readFileSync(join('qsn/public', article.image.src)),
				)
			)
				failures.push(
					`Image source and API alias differ: ${article.image.src}`,
				);
		}
	}
}
for (const article of articles) {
	for (const related of article.relatedIds) {
		if (!articleIds.has(related))
			failures.push(`Broken related link: ${article.id} -> ${related}`);
	}
}
if (
	illustrated < articles.length * 0.045 ||
	illustrated > articles.length * 0.055
)
	failures.push(
		`Expected approximately 5% illustrated articles; found ${illustrated}/${articles.length}`,
	);
if (articleFormats.size < 10)
	failures.push(`Expected at least 10 formats; found ${articleFormats.size}`);
if (failures.length) {
	console.error(failures.slice(0, 30).join('\n'));
	console.error(`${failures.length} fixture validation error(s)`);
	process.exitCode = 1;
} else {
	const summary = `${publication.shortName}: validated ${articles.length} articles, ${authors.length} authors and portraits, ${series.length} series, ${articleFormats.size} formats, and ${illustrated} illustrated articles.`;
	console.log(
		process.argv.includes('--ids')
			? JSON.stringify({ ids: [...articleIds], summary })
			: summary,
	);
}
