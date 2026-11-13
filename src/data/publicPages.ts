export type PublicPage = {
  path: string;
  crumb: string;
  lastmod: string;
};

/** Canonical, indexable public pages. Exclude redirect stubs and noindex URLs. */
export const LASTMOD = "2026-11-10";

export const indexablePages: PublicPage[] = [
  { path: "/", crumb: "Home", lastmod: "2026-11-12" },
  { path: "/broker-licensing/", crumb: "Broker Licensing", lastmod: "2026-11-12" },
  { path: "/post-licensing/", crumb: "Post-Licensing", lastmod: "2026-11-12" },
  { path: "/14ce/", crumb: "14-Hour CE", lastmod: "2026-11-12" },
  { path: "/exam-prep/", crumb: "Exam Prep", lastmod: LASTMOD },
  { path: "/sample-questions/", crumb: "Sample Questions", lastmod: LASTMOD },
  { path: "/florida-sales-associate-exam-prep/", crumb: "Sales Exam Prep", lastmod: LASTMOD },
  { path: "/florida-broker-exam-prep/", crumb: "Broker Exam Prep", lastmod: LASTMOD },
  { path: "/about/", crumb: "About", lastmod: LASTMOD },
  { path: "/broker-connection/", crumb: "Find a Broker", lastmod: LASTMOD },
  { path: "/refund-policy/", crumb: "Refund Policy", lastmod: LASTMOD },
  { path: "/licensing-checklist/", crumb: "Licensing Checklist", lastmod: LASTMOD },
  { path: "/license-guides/", crumb: "Guides", lastmod: "2026-11-13" },
  { path: "/license-guides/how-to-get-florida-real-estate-license/", crumb: "Course 1 Licensing Guide", lastmod: LASTMOD },
  { path: "/license-guides/florida-broker-license-requirements/", crumb: "Course 2 Broker Guide", lastmod: LASTMOD },
  { path: "/license-guides/school-certificate-and-state-exam/", crumb: "School Certificate and State Exam", lastmod: LASTMOD },
  { path: "/license-guides/sales-associate-vs-realtor/", crumb: "License vs. REALTOR®", lastmod: LASTMOD },
  { path: "/license-guides/post-licensing-vs-ce/", crumb: "Post-Licensing vs. CE", lastmod: LASTMOD },
  { path: "/license-guides/florida-real-estate-math/", crumb: "Exam Math", lastmod: LASTMOD },
  { path: "/license-guides/florida-real-estate-license-problems/", crumb: "License Help", lastmod: LASTMOD },
  { path: "/license-guides/getting-licensed/", crumb: "How to Get Licensed", lastmod: "2026-11-13" },
  { path: "/license-guides/broker-license/", crumb: "Broker License Requirements", lastmod: "2026-11-13" },
  { path: "/license-guides/course-and-state-exam/", crumb: "Exams and Certification", lastmod: "2026-11-13" },
  { path: "/license-guides/continuing-education/", crumb: "Continuing Education", lastmod: "2026-11-13" },
  { path: "/license-guides/licensing-costs/", crumb: "Licensing Costs", lastmod: "2026-11-13" },
  { path: "/license-guides/realtor-membership-mls/", crumb: "License, REALTOR®, and MLS", lastmod: "2026-11-13" },
];

export const crumbForPath = (path: string) =>
  indexablePages.find((page) => page.path === path)?.crumb;
