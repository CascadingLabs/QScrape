export interface ProductMeta {
	sku: string;
	name: string;
	category:
		| 'Mining & Excavation'
		| 'Forge & Smithing'
		| 'Food & Brewing'
		| 'Furniture & Housing'
		| 'Surface Imports';
	basePrice: number;
	salePrice?: number;
	image: string;
	excerpt: string;
	inStock: boolean;
	isNew: boolean;
	isFeatured: boolean;
	isPromoted: boolean;
	rating: number;
	reviewCount: number;
	stock?: number;
}

export const categories = [
	'Mining & Excavation',
	'Forge & Smithing',
	'Food & Brewing',
	'Furniture & Housing',
	'Surface Imports',
] as const;

export const products: ProductMeta[] = [
	// ── Mining & Excavation ──────────────────────────────────────
	{
		sku: 'VM-MIN-001',
		name: 'Standard Iron Pickaxe',
		category: 'Mining & Excavation',
		basePrice: 14.5,
		image: 'https://picsum.photos/seed/vmmin001/280/200',
		excerpt:
			'Reliable forged-iron pickaxe suitable for limestone, sandstone, and upper chalk formations. Standard issue for entry-level miners.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: true,
		rating: 4.0,
		reviewCount: 47,
		stock: 12,
	},
	{
		sku: 'VM-MIN-002',
		name: 'Masterwork Steel Pickaxe',
		category: 'Mining & Excavation',
		basePrice: 45.0,
		image: 'https://picsum.photos/seed/vmmin002/280/200',
		excerpt:
			'Dwarven Iron Guild-certified masterwork pickaxe. Rated for granite, gabbro, and deep-layer igneous formations. Exceptional edge retention.',
		inStock: false,
		isNew: false,
		isFeatured: true,
		isPromoted: false,
		rating: 4.9,
		reviewCount: 23,
	},
	{
		sku: 'VM-MIN-003',
		name: 'Stone Chisel Set (5-piece)',
		category: 'Mining & Excavation',
		basePrice: 8.75,
		salePrice: 6.5,
		image: 'https://picsum.photos/seed/vmmin003/280/200',
		excerpt:
			'Five iron chisels in graduated widths (8 mm to 32 mm). Suitable for shaping stone blocks and carving furniture blanks.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 3.8,
		reviewCount: 31,
	},
	{
		sku: 'VM-MIN-004',
		name: 'Blasting Charge (3-pack)',
		category: 'Mining & Excavation',
		basePrice: 22.5,
		image: 'https://picsum.photos/seed/vmmin004/280/200',
		excerpt:
			'Pre-measured obsidian-cased blasting charges for controlled tunnel expansion. Requires Excavation Permit Class 2.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.2,
		reviewCount: 18,
	},
	{
		sku: 'VM-MIN-005',
		name: 'Cave Torch (12-pack)',
		category: 'Mining & Excavation',
		basePrice: 6.0,
		image: 'https://picsum.photos/seed/vmmin005/280/200',
		excerpt:
			'Slow-burning tallow torches in a 12-unit bundle. Approximately 4 hours burn time per torch. Standard compliance for mine illumination.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 3.5,
		reviewCount: 64,
	},
	{
		sku: 'VM-MIN-006',
		name: 'Iron Ore Cart',
		category: 'Mining & Excavation',
		basePrice: 38.0,
		image: 'https://picsum.photos/seed/vmmin006/280/200',
		excerpt:
			'Single-axle ore transport cart with 0.4 cubic z-metre capacity. Rail-compatible. Includes two spare wheel assemblies.',
		inStock: true,
		isNew: true,
		isFeatured: false,
		isPromoted: false,
		rating: 4.1,
		reviewCount: 9,
		stock: 6,
	},
	// ── Forge & Smithing ─────────────────────────────────────────
	{
		sku: 'VM-FRG-001',
		name: 'Iron Ingot Bundle (10-bar)',
		category: 'Forge & Smithing',
		basePrice: 12.0,
		image: 'https://picsum.photos/seed/vmfrg001/280/200',
		excerpt:
			'Ten standard iron ingots, Dwarven Iron Guild grade B. Each bar weighs 1.2 kg and meets Bureau of Deep Works dimensional standards.',
		inStock: true,
		isNew: true,
		isFeatured: false,
		isPromoted: false,
		rating: 4.3,
		reviewCount: 82,
	},
	{
		sku: 'VM-FRG-002',
		name: 'Steel Ingot Bundle (10-bar)',
		category: 'Forge & Smithing',
		basePrice: 28.5,
		image: 'https://picsum.photos/seed/vmfrg002/280/200',
		excerpt:
			'Ten premium steel ingots, Guild grade A. Consistent carbon content verified by assay. Suitable for weapons, tools, and structural components.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.6,
		reviewCount: 55,
	},
	{
		sku: 'VM-FRG-003',
		name: 'Masterwork Smithing Hammer',
		category: 'Forge & Smithing',
		basePrice: 55.0,
		image: 'https://picsum.photos/seed/vmfrg003/280/200',
		excerpt:
			'Balanced 2.8 kg cross-peen hammer with hardened steel head and hickory handle. Recommended for finish work and detailed shaping.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.7,
		reviewCount: 29,
		stock: 8,
	},
	{
		sku: 'VM-FRG-004',
		name: 'Forge Bellows (Leather)',
		category: 'Forge & Smithing',
		basePrice: 16.0,
		image: 'https://picsum.photos/seed/vmfrg004/280/200',
		excerpt:
			'Double-action leather bellows with hardwood frame. Output: 220 litres per minute at full stroke. Suitable for standard and charcoal forges.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 3.9,
		reviewCount: 21,
	},
	{
		sku: 'VM-FRG-005',
		name: 'Cast Iron Anvil',
		category: 'Forge & Smithing',
		basePrice: 120.0,
		image: 'https://picsum.photos/seed/vmfrg005/280/200',
		excerpt:
			'Single-horn cast iron anvil, 180 kg. Hardened face plate rated for repeated heavy forming. Requires reinforced floor mounting (not included).',
		inStock: false,
		isNew: false,
		isFeatured: true,
		isPromoted: true,
		rating: 4.8,
		reviewCount: 14,
	},
	{
		sku: 'VM-FRG-006',
		name: 'Quench Barrel (Oak)',
		category: 'Forge & Smithing',
		basePrice: 24.0,
		image: 'https://picsum.photos/seed/vmfrg006/280/200',
		excerpt:
			'Iron-banded oak barrel, 80-litre capacity, for water or oil quenching. Includes spigot drain and iron lid.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 3.7,
		reviewCount: 12,
	},
	// ── Food & Brewing ───────────────────────────────────────────
	{
		sku: 'VM-FDB-001',
		name: 'Plump Helmet Seeds (50-pack)',
		category: 'Food & Brewing',
		basePrice: 3.5,
		image: 'https://picsum.photos/seed/vmfdb001/280/200',
		excerpt:
			'Certified plump helmet spore-seeds from Bureau of Subterranean Agriculture registered growers. Germination rate 94% in z-levels 10–50.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.4,
		reviewCount: 108,
	},
	{
		sku: 'VM-FDB-002',
		name: 'Dwarven Ale (6-flagon case)',
		category: 'Food & Brewing',
		basePrice: 18.0,
		image: 'https://picsum.photos/seed/vmfdb002/280/200',
		excerpt:
			"Six flagons of the Mountainhome Ale Guild's seasonal plump helmet ale. 8.4% ABV. Brewed under Guild Charter Year 89. Best served cold.",
		inStock: true,
		isNew: false,
		isFeatured: true,
		isPromoted: true,
		rating: 4.5,
		reviewCount: 143,
		stock: 4,
	},
	{
		sku: 'VM-FDB-003',
		name: 'Cave Wheat Flour (10 kg sack)',
		category: 'Food & Brewing',
		basePrice: 5.25,
		image: 'https://picsum.photos/seed/vmfdb003/280/200',
		excerpt:
			'Stone-ground cave wheat flour, grade 1. Suitable for bread, dumplings, and standard ration biscuits. Shelf life 18 months in dry storage.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.0,
		reviewCount: 67,
	},
	{
		sku: 'VM-FDB-004',
		name: 'Plump Helmet Roast (Prepared)',
		category: 'Food & Brewing',
		basePrice: 7.5,
		salePrice: 5.25,
		image: 'https://picsum.photos/seed/vmfdb004/280/200',
		excerpt:
			'Ready-to-serve plump helmet roast in preserved form. Serves 4. Prepared under Bureau of Subterranean Agriculture hygiene standards.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 3.6,
		reviewCount: 39,
	},
	{
		sku: 'VM-FDB-005',
		name: 'Mushroom Wine (Vintage 309, 3-bottle)',
		category: 'Food & Brewing',
		basePrice: 32.0,
		image: 'https://picsum.photos/seed/vmfdb005/280/200',
		excerpt:
			'Limited vintage 309 mushroom wine from the Fungiwood Cavern Biome. Light body, earthy notes, 11% ABV. Award-winning batch, 3-bottle set.',
		inStock: true,
		isNew: true,
		isFeatured: false,
		isPromoted: false,
		rating: 4.7,
		reviewCount: 17,
		stock: 2,
	},
	// ── Furniture & Housing ──────────────────────────────────────
	{
		sku: 'VM-FUR-001',
		name: 'Carved Granite Chair',
		category: 'Furniture & Housing',
		basePrice: 22.0,
		image: 'https://picsum.photos/seed/vmfur001/280/200',
		excerpt:
			'Hand-carved granite chair with smooth finish and carved backrest. Rated for standard residential quarters. Weight: 38 kg.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.1,
		reviewCount: 26,
	},
	{
		sku: 'VM-FUR-002',
		name: 'Surface Oak Door',
		category: 'Furniture & Housing',
		basePrice: 34.0,
		image: 'https://picsum.photos/seed/vmfur002/280/200',
		excerpt:
			'Solid oak door with iron hinges and latch, sourced from surface trade routes. Standard fortress door frame compatible (78×195 cm).',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.3,
		reviewCount: 18,
	},
	{
		sku: 'VM-FUR-003',
		name: 'Gabbro Table (Large)',
		category: 'Furniture & Housing',
		basePrice: 48.0,
		image: 'https://picsum.photos/seed/vmfur003/280/200',
		excerpt:
			'Large gabbro dining table, seats six. Polished surface with carved legs. Suitable for great halls and official dining chambers.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.6,
		reviewCount: 11,
	},
	{
		sku: 'VM-FUR-004',
		name: 'Obsidian Display Cabinet',
		category: 'Furniture & Housing',
		basePrice: 85.0,
		image: 'https://picsum.photos/seed/vmfur004/280/200',
		excerpt:
			'Three-shelf obsidian display cabinet with iron frame. Used for trophy display, gemstone collections, or valued goods storage.',
		inStock: true,
		isNew: true,
		isFeatured: false,
		isPromoted: false,
		rating: 4.4,
		reviewCount: 7,
	},
	{
		sku: 'VM-FUR-005',
		name: 'Rope Bed (Basic)',
		category: 'Furniture & Housing',
		basePrice: 14.0,
		salePrice: 9.5,
		image: 'https://picsum.photos/seed/vmfur005/280/200',
		excerpt:
			'Standard-issue rope bed with hardwood frame. Compliant with Bureau of Residential Standards minimum sleeping quarters specification.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 3.2,
		reviewCount: 94,
	},
	// ── Surface Imports ──────────────────────────────────────────
	{
		sku: 'VM-SRF-001',
		name: 'Elven Cloth Bolt (5 m)',
		category: 'Surface Imports',
		basePrice: 42.0,
		image: 'https://picsum.photos/seed/vmsrf001/280/200',
		excerpt:
			'Five-metre bolt of fine elven woven cloth from the Elven Forest Trading Post. Lightweight, colourfast. Supply currently limited due to route closure.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.5,
		reviewCount: 33,
		stock: 5,
	},
	{
		sku: 'VM-SRF-002',
		name: 'Surface Pine Lumber (10-plank bundle)',
		category: 'Surface Imports',
		basePrice: 19.5,
		image: 'https://picsum.photos/seed/vmsrf002/280/200',
		excerpt:
			'Ten planks of kiln-dried surface pine (2 m × 20 cm × 4 cm). Used for furniture-making, shelving, and door frames. Sourced via Bureau of Surface Commerce.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: true,
		rating: 4.0,
		reviewCount: 44,
		stock: 3,
	},
	{
		sku: 'VM-SRF-003',
		name: 'Human Spice Pack (Mixed)',
		category: 'Surface Imports',
		basePrice: 11.0,
		salePrice: 8.0,
		image: 'https://picsum.photos/seed/vmsrf003/280/200',
		excerpt:
			'Assorted surface spices from human trade contacts: cumin, black pepper, dried chilli, and cinnamon. 200 g net weight per spice.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 4.2,
		reviewCount: 56,
	},
	{
		sku: 'VM-SRF-004',
		name: 'Silver Thread Spool',
		category: 'Surface Imports',
		basePrice: 28.0,
		image: 'https://picsum.photos/seed/vmsrf004/280/200',
		excerpt:
			'One spool (50 m) of fine silver thread, imported via human trade contacts. Suitable for embroidery, ceremonial garments, and rune-marking.',
		inStock: true,
		isNew: true,
		isFeatured: false,
		isPromoted: false,
		rating: 4.6,
		reviewCount: 8,
	},
	{
		sku: 'VM-SRF-005',
		name: 'Exotic Feather Bundle',
		category: 'Surface Imports',
		basePrice: 16.75,
		image: 'https://picsum.photos/seed/vmsrf005/280/200',
		excerpt:
			'Bundle of 30 assorted surface-bird feathers (quill length 25–40 cm). Used in decorative applications, quill-pen crafting, and ceremonial headwear.',
		inStock: true,
		isNew: true,
		isFeatured: false,
		isPromoted: false,
		rating: 3.9,
		reviewCount: 14,
	},
	{
		sku: 'VM-SRF-006',
		name: 'Coloured Glass Beads (Assorted)',
		category: 'Surface Imports',
		basePrice: 9.0,
		salePrice: 6.5,
		image: 'https://picsum.photos/seed/vmsrf006/280/200',
		excerpt:
			'Two hundred assorted glass beads in six colours, sourced from human artisan trade. Used in jewellery, mosaics, and decorative inlay work.',
		inStock: true,
		isNew: false,
		isFeatured: false,
		isPromoted: false,
		rating: 3.7,
		reviewCount: 29,
	},
];

export function getByCategory(cat: string): ProductMeta[] {
	return products.filter((p) => p.category === cat);
}

export function getFeatured(): ProductMeta[] {
	return products.filter((p) => p.isFeatured);
}

export function getNew(): ProductMeta[] {
	return products.filter((p) => p.isNew);
}

export function getPromoted(): ProductMeta[] {
	return products.filter((p) => p.isPromoted);
}

export function getProductBySku(sku: string): ProductMeta | undefined {
	return products.find((p) => p.sku === sku);
}

export function formatPrice(price: number): string {
	return `${price.toFixed(2)} Gold Sovereigns`;
}
