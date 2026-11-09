import type { Product } from "../data/products";
import { site } from "../data/site";

// Match the public one-time enrollment price.
export function courseOffer(product: Product, name = product.name) {
  const price = product.price;
  const inclusions = product.category === "ce"
    ? "Includes the full 14-hour CE course, FastPass final exam, and DBPR completion reporting. State license renewal fees are separate."
    : product.category === "post"
      ? "Includes the complete Post-Licensing course, FastPass final exam, and DBPR completion reporting. State license renewal fees are separate."
      : "State application, fingerprinting, and state-exam fees are separate.";
  return {
    "@type": "Offer",
    "@id": `${site.url}/#offer-${product.id}`,
    name,
    price,
    description: `Enrollment $${price}. One-time enrollment. ${inclusions}`,
    priceCurrency: "USD",
    url: product.checkoutUrl,
    seller: { "@id": `${site.url}/#organization` },
  };
}

