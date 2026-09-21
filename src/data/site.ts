export const site = {
  name: "Daniel Larson Training",
  tagline: "Florida Real Estate Education",
  url: "https://daniellarsontraining.com",
  portalUrl: "https://portal.daniellarsontraining.com",
  studentDashboardUrl: "https://portal.daniellarsontraining.com/enrollments",
  phoneDisplay: "239.471.8500",
  phoneHref: "tel:+12394718500",
  email: "daniel@daniellarsontraining.com",
  schoolLicense: "ZH1002860",
  instructorName: "Daniel Larson",
  instructorLicense: "ZH1003217",
} as const;

export const navigation = [
  { label: "Sales Licensing", href: "/" },
  { label: "Broker Licensing", href: "/broker-licensing/" },
  { label: "Post Licensing", href: "/post-licensing/" },
  { label: "14-Hour CE", href: "/14ce/" },
  { label: "Exam Prep", href: "/exam-prep/" },
  { label: "About", href: "/about/" },
] as const;
