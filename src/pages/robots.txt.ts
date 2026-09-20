import { site } from "../data/site";

export function GET() {
  const production = import.meta.env.PUBLIC_SITE_ENV === "production";
  const body = production
    ? `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
