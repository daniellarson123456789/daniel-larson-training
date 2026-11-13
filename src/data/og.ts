import pages from "./og-pages.json";
import { site } from "./site";

export type OgPage = {
  id: string;
  paths: string[];
  image: string;
  headline: string;
  title: string;
  description: string;
};

export const ogPages = pages as OgPage[];

const byPath = new Map<string, OgPage>();
for (const page of ogPages) {
  for (const path of page.paths) {
    byPath.set(path, page);
  }
}

export const defaultOg = ogPages.find((page) => page.id === "default")!;
export const guidesOg = ogPages.find((page) => page.id === "guides")!;

const normalize = (path: string) => {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
};

export const stripPrices = (text: string) =>
  text
    .replace(/\s*[—–-]\s*\$\d+(?:\.\d+)?/g, "")
    .replace(/\s*from\s+\$\d+(?:\.\d+)?/gi, "")
    .replace(/\s*·\s*Sales\s*\$\d+\s*\/\s*Broker\s*\$\d+/gi, "")
    .replace(/\$\d+(?:\.\d+)?/g, "")
    .replace(/ {2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+\/\s+$/g, "")
    .trim();

const shortName = (pageTitle: string) =>
  pageTitle
    .replace(/\s*\|\s*Real Estate FastPass\s*$/i, "")
    .replace(/\s*\|\s*Daniel Larson Training\s*$/i, "")
    .trim() || pageTitle;

const withBrand = (title: string) =>
  /^real estate fastpass\b/i.test(title) ? title : `Real Estate FastPass | ${title}`;

export const resolveOg = (canonicalPath: string, pageTitle: string, pageDescription: string) => {
  const path = normalize(canonicalPath);
  const configured = byPath.get(path) ?? (path.startsWith("/license-guides/") ? guidesOg : defaultOg);
  const title = configured.paths.includes(path)
    ? configured.title
    : withBrand(shortName(pageTitle));
  return {
    image: configured.image,
    title: stripPrices(title),
    description: stripPrices(configured.paths.includes(path) ? configured.description : pageDescription),
    headline: configured.headline.replace(/\n/g, " "),
    alt: `${site.name} — ${configured.headline.replace(/\n/g, " ")}`,
  };
};
