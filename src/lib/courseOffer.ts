import type { Product } from "../data/products";
import { site } from "../data/site";

// Match the public enrollment offer, including its required coupon.
export function courseOffer(product: Product, name = product.name) {
  const price = product.price - (product.discountAmount ?? 0);
  return {
    "@type": "Offer",
    "@id": `${site.url}/#offer-${product.id}`,
    name,
    price,
    ...(product.couponCode ? {
      description: `Pay $${price} with ${product.couponCode}; regular price $${product.price}. One-time enrollment. The product link includes the code; confirm the discounted total at checkout. State application, fingerprinting, and state-exam fees are separate.`,
    } : {}),
    priceCurrency: "USD",
    url: product.checkoutUrl,
    seller: { "@id": `${site.url}/#organization` },
  };
}
