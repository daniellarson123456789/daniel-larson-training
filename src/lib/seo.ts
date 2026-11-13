import { site } from "../data/site";
import { crumbForPath } from "../data/publicPages";

export type FaqItem = { name: string; text: string };

export const organizationNode = () => ({
  "@type": "EducationalOrganization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.schoolName,
  alternateName: [site.schoolName, "RealEstateFastPass", "Daniel Larson Training School"],
  description:
    "Online Florida real estate school offering self-paced Sales Associate and Broker licensing, Post-Licensing, 14-hour continuing education, and exam preparation. Real Estate FastPass is the online home of Daniel Larson Training, Florida Licensed Real Estate School #ZH1002860.",
  url: site.url,
  logo: `${site.url}${site.logoPath}`,
  image: `${site.url}${site.defaultOgImage}`,
  telephone: site.phoneE164,
  email: site.email,
  areaServed: { "@type": "State", name: "Florida" },
  address: {
    "@type": "PostalAddress",
    name: "Mailing address",
    streetAddress: site.mailingAddress.streetAddress,
    addressLocality: site.mailingAddress.addressLocality,
    addressRegion: site.mailingAddress.addressRegion,
    postalCode: site.mailingAddress.postalCode,
    addressCountry: site.mailingAddress.addressCountry,
  },
  identifier: {
    "@type": "PropertyValue",
    name: "Florida Licensed Real Estate School",
    value: site.schoolLicense,
  },
  founder: { "@id": `${site.url}/#daniel-larson` },
  employee: { "@id": `${site.url}/#daniel-larson` },
  sameAs: [site.trustpilotUrl],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: site.phoneE164,
    email: site.email,
    areaServed: "US-FL",
    availableLanguage: "English",
  },
});

export const personNode = () => ({
  "@type": "Person",
  "@id": `${site.url}/#daniel-larson`,
  name: site.instructorName,
  jobTitle: "Florida Real Estate Instructor",
  url: `${site.url}/about/`,
  image: `${site.url}/daniel-larson-suit.webp`,
  sameAs: ["https://www.royalshellrealestate.com/real-estate-agent/846/daniel-larson"],
  worksFor: { "@id": `${site.url}/#organization` },
  affiliation: { "@id": `${site.url}/#organization` },
  identifier: {
    "@type": "PropertyValue",
    name: "Florida Real Estate Instructor",
    value: site.instructorLicense,
  },
});

export const websiteNode = () => ({
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  alternateName: ["RealEstateFastPass", site.schoolName],
  description:
    "Florida real estate licensing, exam preparation, Post-Licensing, and 14-hour continuing education from Daniel Larson Training.",
  inLanguage: "en-US",
  publisher: { "@id": `${site.url}/#organization` },
});

export const globalGraph = () => [organizationNode(), personNode(), websiteNode()];

const normalizePath = (canonicalPath: string) => {
  if (canonicalPath === "/" || canonicalPath === "") return "/";
  return canonicalPath.endsWith("/") ? canonicalPath : `${canonicalPath}/`;
};

const shortName = (pageTitle: string) =>
  pageTitle
    .replace(/\s*\|\s*Real Estate FastPass\s*$/i, "")
    .replace(/\s*\|\s*Daniel Larson Training\s*$/i, "")
    .trim() || pageTitle;

export const breadcrumbList = (canonicalPath: string, pageTitle: string) => {
  const path = normalizePath(canonicalPath);
  const items: { name: string; path: string }[] = [{ name: "Home", path: "/" }];
  if (path !== "/") {
    if (path.startsWith("/license-guides/") && path !== "/license-guides/") {
      items.push({ name: "Guides", path: "/license-guides/" });
    }
    items.push({ name: crumbForPath(path) ?? shortName(pageTitle), path });
  }
  return {
    "@type": "BreadcrumbList",
    "@id": `${new URL(path, site.url).toString()}#breadcrumb`,
    itemListElement: items.map((item, position) => ({
      "@type": "ListItem",
      position: position + 1,
      name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
};

export const faqPage = (id: string, faqs: FaqItem[]) => ({
  "@type": "FAQPage",
  "@id": id,
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.name,
    acceptedAnswer: { "@type": "Answer", text: faq.text },
  })),
});

export const webPage = (opts: {
  path: string;
  name: string;
  description: string;
  type?: string;
  about?: unknown;
  mainEntity?: unknown;
  dateModified?: string;
}) => {
  const url = new URL(opts.path, site.url).toString();
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${site.url}/#website` },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
    dateModified: opts.dateModified ?? "2026-11-10",
    ...(opts.about ? { about: opts.about } : {}),
    ...(opts.mainEntity ? { mainEntity: opts.mainEntity } : {}),
  };
};

export const enrichSchemaNode = (node: Record<string, unknown>) => {
  if (node["@type"] === "Course" && node.offers && !node.hasCourseInstance) {
    return {
      ...node,
      isAccessibleForFree: node.isAccessibleForFree ?? false,
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        offers: node.offers,
      },
    };
  }
  return node;
};
