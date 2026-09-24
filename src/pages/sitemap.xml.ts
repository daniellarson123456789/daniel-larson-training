import { site } from "../data/site";

const paths = [
  "/",
  "/broker-licensing/",
  "/post-licensing/",
  "/14ce/",
  "/exam-prep/",
  "/about/",
  "/license-guides/",
  "/license-guides/how-to-get-florida-real-estate-license/",
  "/license-guides/florida-broker-license-requirements/",
  "/license-guides/school-certificate-and-state-exam/",
  "/license-guides/sales-associate-vs-realtor/",
  "/license-guides/post-licensing-vs-ce/",
];

export function GET() {
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site.url).toString()}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
