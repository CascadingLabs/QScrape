export interface Product {
	id: string;
	name: string;
	category: 'Desk' | 'Home' | 'Carry';
	price: number;
	stock: number;
	color: string;
	description: string;
	material: string;
	image: string;
}

export const products: readonly Product[] = [
	{
		id: 'obj-001',
		name: 'Arc desk lamp',
		category: 'Desk',
		price: 6800,
		stock: 12,
		color: 'Burnt orange',
		description:
			'A small pool of warm light for your next good idea. A curved metal shade and weighted base keep the silhouette simple.',
		material: 'Powder-coated steel',
		image: '/products/lamp.svg',
	},
	{
		id: 'obj-002',
		name: 'Loop ceramic mug',
		category: 'Home',
		price: 2400,
		stock: 8,
		color: 'Chalk',
		description:
			'Your daily ritual, with a little more room. A generous loop handle and smooth glaze make this an everyday favorite.',
		material: 'Glazed stoneware',
		image: '/products/mug.svg',
	},
	{
		id: 'obj-003',
		name: 'Grid notebook',
		category: 'Desk',
		price: 1800,
		stock: 24,
		color: 'Moss',
		description:
			'A place for lists, sketches, and thoughts worth keeping. Lay-flat binding and quiet grid pages give your ideas space.',
		material: 'Recycled paper, cloth cover',
		image: '/products/notebook.svg',
	},
	{
		id: 'obj-004',
		name: 'Daybreak tote',
		category: 'Carry',
		price: 3200,
		stock: 5,
		color: 'Sand',
		description:
			'For the market, the library, and the long way home. A sturdy canvas bag with a roomy interior and comfortable handles.',
		material: 'Heavyweight cotton canvas',
		image: '/products/tote.svg',
	},
	{
		id: 'obj-005',
		name: 'Pebble catchall',
		category: 'Home',
		price: 2800,
		stock: 0,
		color: 'Terracotta',
		description:
			'A soft landing for keys and small essentials. An organic, shallow shape brings a little order to the end of the day.',
		material: 'Unglazed terracotta',
		image: '/products/tray.svg',
	},
	{
		id: 'obj-006',
		name: 'Still glass bottle',
		category: 'Carry',
		price: 3600,
		stock: 9,
		color: 'Smoke',
		description:
			'Keep water close, wherever the day takes you. A clean glass body with a screw-top cap and a protective silicone sleeve.',
		material: 'Borosilicate glass, silicone',
		image: '/products/bottle.svg',
	},
];

export type ShopVersion = 'html' | 'javascript' | 'turnstile';
export const versions: readonly ShopVersion[] = [
	'html',
	'javascript',
	'turnstile',
];
export const versionLabels = {
	html: 'HTML eShop',
	javascript: 'JavaScript eShop',
	turnstile: 'Turnstile JavaScript eShop',
} satisfies Record<ShopVersion, string>;
export const categories = ['All', 'Desk', 'Home', 'Carry'] as const;
export type ShopCategory = (typeof categories)[number];

const priceFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export function getProduct(id: string): Product | undefined {
	return products.find((product) => product.id === id);
}
export function formatPrice(cents: number): string {
	return priceFormatter.format(cents / 100);
}
