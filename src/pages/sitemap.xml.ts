import { site } from "../data/site";
import { indexablePages } from "../data/publicPages";

export function GET() {
  const urls = indexablePages
    .map((page) => {
      const loc = new URL(page.path, site.url).toString();
      return `  <url><loc>${loc}</loc><lastmod>${page.lastmod}</lastmod></url>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
