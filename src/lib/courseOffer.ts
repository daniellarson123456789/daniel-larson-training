import type { Product } from "../data/products";
import { site } from "../data/site";

// Match the public one-time enrollment price.
export function courseOffer(product: Product, name = product.name) {
  const price = product.price;
  const examPrepInclusions =
    product.id === "sales-exam-prep"
      ? "Includes all the explainer videos, plus optional Course 1. Does not issue a Course 1 completion certificate. State application, fingerprinting, and state-exam fees are separate."
      : "Includes all the explainer videos, plus optional Course 2. Does not issue a Course 2 completion certificate. State application, fingerprinting, and state-exam fees are separate.";
  const inclusions = product.category === "ce"
    ? "Includes the full 14-hour CE course, FastPass final exam, and DBPR completion reporting. State license renewal fees are separate."
    : product.category === "post"
      ? "Includes the complete Post-Licensing course, FastPass final exam, and DBPR completion reporting. State license renewal fees are separate."
      : product.category === "exam-prep"
        ? examPrepInclusions
        : "State application, fingerprinting, and state-exam fees are separate.";
  return {
    "@type": "Offer",
    "@id": `${site.url}/#offer-${product.id}`,
    name,
    price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: product.checkoutUrl,
    description: `Enrollment $${price}. One-time enrollment. ${inclusions}`,
    seller: { "@id": `${site.url}/#organization` },
  };
}
