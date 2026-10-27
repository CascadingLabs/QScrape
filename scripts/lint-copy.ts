import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

// Scan authored text, including templates, SVG metadata, and editorial fixtures.
// Encoded forms are rejected too, so escaping punctuation cannot bypass the rule.
const forbidden = new RegExp(
	`${String.fromCodePoint(0x2014)}|&(?:mdash|#0*8212|#x0*2014);?|\\\\(?:u(?:2014|\\{0*2014\\})|0*2014(?![0-9a-f]))`,
	'giu',
);
const extensions = new Set([
	'.astro',
	'.ts',
	'.tsx',
	'.js',
	'.mjs',
	'.cjs',
	'.css',
	'.svg',
	'.json',
	'.md',
	'.txt',
	'.yaml',
	'.yml',
	'.toml',
	'.html',
]);
const ignored = new Set([
	'node_modules',
	'dist',
	'.astro',
	'.git',
	'.jj',
	'.wtf',
]);
const failures: string[] = [];
let checked = 0;

function scan(path: string): void {
	if (statSync(path).isDirectory()) {
		for (const entry of readdirSync(path, { withFileTypes: true })) {
			if (entry.isSymbolicLink() || ignored.has(entry.name)) continue;
			if (entry.name.startsWith('.') && entry.name !== '.github') continue;
			scan(join(path, entry.name));
		}
		return;
	}
	if (!extensions.has(extname(path))) return;
	checked++;
	const text = readFileSync(path, 'utf8');
	for (const match of text.matchAll(forbidden)) {
		const before = text.slice(0, match.index);
		const line = before.split('\n').length;
		const column = before.length - before.lastIndexOf('\n');
		failures.push(
			`${relative(process.cwd(), path)}:${line}:${column}: Em dashes are not allowed. Rewrite the sentence or use a comma, colon, or parentheses.`,
		);
	}
}

for (const path of process.argv.slice(2).length ? process.argv.slice(2) : ['.'])
	scan(path);
if (failures.length) {
	console.error(failures.join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Copy lint passed for ${checked} authored text files.`);
}
