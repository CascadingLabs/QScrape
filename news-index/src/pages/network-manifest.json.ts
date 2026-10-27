import { publications } from '../../../qsn/src/data/publications';

export const prerender = true;

const hubOrigin = 'https://news.qscrape.dev/';
const normalizeOrigin = (origin: string) => `${origin.replace(/\/+$/, '')}/`;
const registered = publications.map((publication) => ({
	id: publication.id,
	key: publication.key,
	species: publication.species,
	name: publication.name,
	shortName: publication.shortName,
	origin: normalizeOrigin(publication.origin),
	manifest: `${normalizeOrigin(publication.origin)}benchmark-manifest.json`,
	articleCount: publication.articleCount,
}));
const hubLinks = registered.map((publication) => ({
	from: hubOrigin,
	to: publication.origin,
	publicationId: publication.id,
	relation: 'publication-homepage',
}));
const sisterEdges = registered.flatMap((source) =>
	registered
		.filter((destination) => destination.id !== source.id)
		.map((destination) => ({
			sourceId: source.id,
			destinationId: destination.id,
			sourceOrigin: source.origin,
			destinationOrigin: destination.origin,
			relation: 'sister-publication',
		})),
);
const totalArticles = registered.reduce(
	(total, publication) => total + publication.articleCount,
	0,
);

export function GET() {
	return new Response(
		JSON.stringify({
			network: 'QScrape News Network',
			schemaVersion: 1,
			hubOrigin,
			publicationCount: registered.length,
			totalArticleCount: totalArticles,
			publications: registered,
			hubLinks,
			hubReturnLinks: registered.map((paper) => ({
				from: paper.origin,
				to: hubOrigin,
			})),
			sisterEdges,
		}),
		{ headers: { 'Content-Type': 'application/json; charset=utf-8' } },
	);
}
