import { defineMiddleware } from "astro:middleware";

// Apply at prerender time so a preview never exposes a paid-checkout link,
// including before JavaScript loads or when it is disabled.
export function protectPreviewEnrollmentLinks(html: string, baseUrl: URL) {
  // Skip comments and raw text blocks; only rewrite actual anchor start tags.
  const tags = /<!--[\s\S]*?-->|<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<a\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
  const href = /\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i;
  const target = /\starget\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi;
  const previewAttributes = /\s(?:data-preview-checkout-path|aria-haspopup)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi;
  const escapeAttribute = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return html.replace(tags, (tag) => {
    if (!/^<a(?:\s|>)/i.test(tag)) return tag;
    const match = tag.match(href);
    if (!match) return tag;
    let url: URL;
    try { url = new URL(match[1] ?? match[2] ?? match[3], baseUrl); } catch { return tag; }
    if (url.hostname !== "portal.daniellarsontraining.com" || !url.pathname.toLowerCase().startsWith("/bundles/")) return tag;
    const path = escapeAttribute(url.pathname.replace(/\/$/, "").toLowerCase());
    return tag
      .replace(href, ' href="#preview-enrollment"')
      .replace(target, "")
      .replace(previewAttributes, "")
      .replace(/>$/, ` data-preview-checkout-path="${path}" aria-haspopup="dialog">`);
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const isPreview = process.env.VERCEL_ENV === "preview" || import.meta.env.PUBLIC_SITE_PREVIEW === "true";
  if (!isPreview) return next();

  const response = await next();
  if (!response.headers.get("content-type")?.toLowerCase().includes("text/html")) return response;
  const html = protectPreviewEnrollmentLinks(await response.text(), context.url);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
});
