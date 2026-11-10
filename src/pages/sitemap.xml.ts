import { site } from "../data/site";

const paths = [
  "/",
  "/broker-licensing/",
  "/post-licensing/",
  "/14ce/",
  "/exam-prep/",
  "/florida-sales-associate-exam-prep/",
  "/florida-broker-exam-prep/",
  "/about/",
  "/refund-policy/",
  "/licensing-checklist/",
  "/license-guides/",
  "/license-guides/how-to-get-florida-real-estate-license/",
  "/license-guides/florida-broker-license-requirements/",
  "/license-guides/school-certificate-and-state-exam/",
  "/license-guides/sales-associate-vs-realtor/",
  "/license-guides/post-licensing-vs-ce/",
  "/license-guides/florida-real-estate-math/",
  "/license-guides/florida-real-estate-license-problems/",
];

export function GET() {
  // Actual page changes, not build dates. Regulatory source review dates stay with the content.
  const modified: Record<string, string> = {
    "/14ce/": "2026-11-09",
    "/post-licensing/": "2026-11-09",
    "/": "2026-11-09",
    "/about/": "2026-11-09",
    "/refund-policy/": "2026-11-09",
    "/exam-prep/": "2026-11-09",
    "/florida-sales-associate-exam-prep/": "2026-11-09",
    "/florida-broker-exam-prep/": "2026-11-09",
    "/broker-licensing/": "2026-11-09",
    "/licensing-checklist/": "2026-11-09",
    "/license-guides/": "2026-11-09",
    "/license-guides/florida-broker-license-requirements/": "2026-11-09",
    "/license-guides/how-to-get-florida-real-estate-license/": "2026-11-09",
    "/license-guides/school-certificate-and-state-exam/": "2026-11-09",
    "/license-guides/sales-associate-vs-realtor/": "2026-11-09",
    "/license-guides/post-licensing-vs-ce/": "2026-11-09",
    "/license-guides/florida-real-estate-math/": "2026-11-09",
    "/license-guides/florida-real-estate-license-problems/": "2026-11-09",
  };
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site.url).toString()}</loc>${modified[path] ? `<lastmod>${modified[path]}</lastmod>` : ""}</url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

