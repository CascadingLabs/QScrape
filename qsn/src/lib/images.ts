import type { ImageMetadata } from 'astro';

const editorial = import.meta.glob<{ default: ImageMetadata }>(
	'../assets/editorial/*.png',
	{ eager: true },
);
const portraits = import.meta.glob<{ default: ImageMetadata }>(
	'../assets/authors/*.png',
	{ eager: true },
);

export function editorialImage(path: string): ImageMetadata {
	const name = path.split('/').pop();
	const image = editorial[`../assets/editorial/${name}`]?.default;
	if (!image) throw new Error(`Missing editorial image: ${path}`);
	return image;
}

export function authorPortrait(id: string): ImageMetadata | undefined {
	return portraits[`../assets/authors/${id}.png`]?.default;
}
