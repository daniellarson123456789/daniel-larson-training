export const site = {
  name: "Real Estate FastPass",
  schoolName: "Daniel Larson Training",
  tagline: "A Daniel Larson Training School",
  url: "https://realestatefastpass.com",
  portalUrl: "https://portal.daniellarsontraining.com",
  studentDashboardUrl: "https://portal.daniellarsontraining.com/enrollments",
  studentHubUrl: "https://portal.daniellarsontraining.com/hub",
  phoneDisplay: "239.471.8500",
  phoneHref: "tel:+12394718500",
  email: "daniel@daniellarsontraining.com",
  schoolLicense: "ZH1002860",
  instructorName: "Daniel Larson",
  instructorLicense: "ZH1003217",
  phoneE164: "+1-239-471-8500",
  logoPath: "/fastpass-logo.webp",
  defaultOgImage: "/og/default-v2.png",
  trustpilotUrl: "https://www.trustpilot.com/review/daniellarsontraining.com",
  // Mailing address only — not a physical campus.
  mailingAddress: {
    streetAddress: "2655 Airport Rd N #61236",
    addressLocality: "Fort Myers",
    addressRegion: "FL",
    postalCode: "33907",
    addressCountry: "US",
  },
} as const;

export const navigation = [
  { label: "Sales", href: "/" },
  { label: "Broker", href: "/broker-licensing/" },
  { label: "Post", href: "/post-licensing/" },
  { label: "14-Hour CE", href: "/14ce/" },
  { label: "Exam Prep", href: "/exam-prep/" },
  { label: "Sample Questions", href: "/sample-questions/" },
  { label: "About", href: "/about/" },
  { label: "Guides", href: "/license-guides/" },
  { label: "Find a Broker", href: "/broker-connection/" },
] as const;
