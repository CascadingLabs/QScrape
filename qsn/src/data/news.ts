import { publication } from './publications';
import { createSisterDataset } from './network';
export type { Article, Author, Series } from './types';
const dataset =
	publication.id === 'dwarves'
		? await import('./dwarves')
		: createSisterDataset(publication);
export const { articles, authors, series, sections, getArticle } = dataset;
export { publication };
