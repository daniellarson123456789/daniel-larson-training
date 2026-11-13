import { llmsTxt } from "../lib/llmsContent";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
