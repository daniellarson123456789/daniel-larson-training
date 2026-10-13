import { products } from "../data/products";

type LicensingPath = "sales" | "broker";

// School prices and coupon links come from the same source as the course cards.
// External fees were checked against the linked DBPR sources on October 13, 2026.
const feeSources = {
  exam: {
    amount: 57.75,
    url: "https://www2.myfloridalicense.com/servop/testing/documents/cbt_exam_admin_Fee_2023.pdf",
  },
  fingerprints: "https://www2.myfloridalicense.com/fingerprinting/",
};

const paths = {
  sales: {
    product: products.salesFastPass,
    application: 62.75,
    applicationUrl: "https://www2.myfloridalicense.com/re/documents/DBPR_RE_1_Sales_Associate_Application.pdf",
    course: "Course 1",
    label: "Sales FastPass",
    compareUrl: "/#compare",
    otherGuide: "/license-guides/florida-broker-license-requirements/#costs",
    otherLabel: "broker licensing costs",
  },
  broker: {
    product: products.brokerFastPass,
    application: 70,
    applicationUrl: "https://www2.myfloridalicense.com/re/documents/DBPR_RE_2_Broker_Application.pdf",
    course: "Course 2",
    label: "Broker FastPass",
    compareUrl: "/broker-licensing/#compare",
    otherGuide: "/license-guides/how-to-get-florida-real-estate-license/#costs",
    otherLabel: "sales associate licensing costs",
  },
};

const money = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
}).format(value);

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]!));

export function renderLicensingBudget(path: LicensingPath) {
  const config = paths[path];
  const product = config.product;
  const hasPromotion = Boolean(product.couponCode && (product.discountAmount ?? 0) > 0);
  const currentPrice = product.price - (hasPromotion ? product.discountAmount! : 0);
  const externalFees = config.application + feeSources.exam.amount;
  const amountCells = (standard: number, current = standard) =>
    `<td>${money(standard)}</td>${hasPromotion ? `<td>${money(current)}</td>` : ""}`;

  return `<section id="costs" class="licensing-budget" aria-labelledby="licensing-budget-title">
    <span class="budget-label">School + state fees</span>
    <h2 id="licensing-budget-title">Plan your licensing budget</h2>
    <p>This example uses <strong>${config.label}</strong>, including the required ${config.course}, FastPass certification, and state-exam preparation. Pay the school, DBPR, the fingerprint provider, and Pearson separately.</p>
    <div class="table-scroll">
      <table class="fact-table budget-table">
        <caption>${config.label} initial licensing costs in US dollars</caption>
        <thead><tr><th scope="col">Expense</th><th scope="col">Standard price</th>${hasPromotion ? '<th scope="col">Current offer</th>' : ""}</tr></thead>
        <tbody>
          <tr><th scope="row">${config.label}<small>Paid to Daniel Larson Training</small></th>${amountCells(product.price, currentPrice)}</tr>
          <tr><th scope="row"><a href="${config.applicationUrl}">State application</a><small>Paid to DBPR</small></th>${amountCells(config.application)}</tr>
          <tr><th scope="row"><a href="${feeSources.exam.url}">State licensing exam</a><small>One attempt, paid to Pearson</small></th>${amountCells(feeSources.exam.amount)}</tr>
        </tbody>
        <tfoot><tr><th scope="row">Subtotal<small>Before fingerprints</small></th>${amountCells(product.price + externalFees, currentPrice + externalFees)}</tr></tfoot>
      </table>
    </div>
    <div class="budget-fingerprints"><strong>Add your fingerprinting fee.</strong> <a href="${feeSources.fingerprints}">DBPR confirms that the charge varies by provider</a>. Add your provider’s quote to the subtotal above to complete your budget.</div>
    ${hasPromotion ? `<p class="budget-promotion">The current ${config.label} offer is <strong>${money(currentPrice)} with code ${escapeHtml(product.couponCode!)}</strong>; standard school enrollment is ${money(product.price)}. The enrollment link includes the code. Confirm the discounted total before paying.</p>` : ""}
    <p class="budget-scope">Includes the standard application fee and one state-exam attempt. Another exam attempt costs ${money(feeSources.exam.amount)}. Later renewal fees, Post-Licensing, and brokerage, business, or association expenses are separate. A FastPass + Post package includes the applicable first-renewal education.</p>
    <div class="actions"><a class="button primary" data-plan="${escapeHtml(product.id)}" data-placement="licensing_budget" href="${escapeHtml(product.checkoutUrl)}">Explore ${config.label}</a><a class="button outline" href="${config.compareUrl}">Compare school packages</a></div>
    <p class="source-credit">State fee sources checked October 13, 2026. Confirm the fees when applying and scheduling. Looking for <a href="${config.otherGuide}">${config.otherLabel}</a>?</p>
  </section>`;
}

export function addLicensingBudget(markup: string, path: LicensingPath) {
  const marker = "<!-- licensing-budget -->";
  if (!markup.includes(marker)) throw new Error(`Missing ${path} licensing budget placement`);
  return markup.replace(marker, renderLicensingBudget(path));
}
