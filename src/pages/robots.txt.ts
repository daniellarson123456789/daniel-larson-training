import { site } from "../data/site";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
] as const;

export function GET() {
  const preview = process.env.VERCEL_ENV === "preview" || import.meta.env.PUBLIC_SITE_PREVIEW === "true";
  const production = !preview && import.meta.env.PUBLIC_SITE_ENV === "production";
  const aiAllows = AI_CRAWLERS.map((bot) => `User-agent: ${bot}\nAllow: /\n`).join("\n");
  const body = production
    ? `# Real Estate FastPass
# LLM content: ${site.url}/llms.txt
# Full source: ${site.url}/llms-full.txt

User-agent: *
Allow: /

${aiAllows}
Sitemap: ${site.url}/sitemap.xml
`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
