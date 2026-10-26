import { publication } from '../data/publications';
export function GET() {
	return new Response(
		`User-agent: *\nAllow: /\n\nSitemap: ${publication.origin}/sitemap-index.xml\n`,
		{
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		},
	);
}
