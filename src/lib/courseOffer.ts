import type { Product } from "../data/products";
import { site } from "../data/site";

// Describe the regular, one-time enrollment shown on the school website.
// Promotional guide coupons belong to the separate guide's offers.
export function courseOffer(product: Product, name = product.name) {
  return {
    "@type": "Offer",
    "@id": `${site.url}/#offer-${product.id}`,
    name,
    price: product.price,
    priceCurrency: "USD",
    url: product.checkoutUrl,
    seller: { "@id": `${site.url}/#organization` },
  };
}
