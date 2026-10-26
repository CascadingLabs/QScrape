export interface Article {
	id: string;
	slug: string;
	title: string;
	summary: string;
	body: string[];
	section: string;
	format: string;
	authorId: string;
	publishedAt: string;
	updatedAt?: string;
	topic: string;
	seriesId?: string;
	relatedIds: string[];
	image?: { src: string; alt: string; caption: string };
}

export interface Author {
	id: string;
	name: string;
	bio: string;
	beat: string;
}

export interface Series {
	id: string;
	title: string;
	description: string;
}
