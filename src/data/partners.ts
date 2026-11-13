export type PartnerContact = {
  firstName: string;
  /** Display number shown under the Text / Call buttons, e.g. 808-796-2014 */
  phoneDisplay: string;
  /** Direct sms: link. Do not use a generic office contact page. */
  smsHref: string;
  /** Direct tel: link. Do not use a generic office contact page. */
  telHref: string;
};

export type Partner = {
  id: string;
  name: string;
  office?: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  websiteUrl: string;
  careersUrl: string;
  contact?: PartnerContact;
  /** Short line under the name, e.g. why to reach Daniel on this card. */
  note?: string;
};

export const partners: Partner[] = [
  {
    id: "marzucco-fort-myers",
    name: "Marzucco Real Estate",
    office: "Fort Myers office",
    logoSrc: "/partners/marzucco-logo.png",
    logoAlt: "Marzucco Real Estate logo",
    logoWidth: 712,
    logoHeight: 115,
    websiteUrl: "https://www.marzuccolux.com/",
    careersUrl: "https://join.marzuccolux.com/",
    contact: {
      firstName: "Devon",
      phoneDisplay: "808-796-2014",
      smsHref: "sms:+18087962014",
      telHref: "tel:+18087962014",
    },
  },
  {
    id: "marzucco-naples",
    name: "Marzucco Real Estate",
    office: "Naples office",
    logoSrc: "/partners/marzucco-logo.png",
    logoAlt: "Marzucco Real Estate logo",
    logoWidth: 712,
    logoHeight: 115,
    websiteUrl: "https://www.marzuccolux.com/",
    careersUrl: "https://join.marzuccolux.com/",
    contact: {
      firstName: "Josh",
      phoneDisplay: "239-269-1584",
      smsHref: "sms:+12392691584",
      telHref: "tel:+12392691584",
    },
  },
  {
    id: "royal-shell",
    name: "Royal Shell Real Estate",
    logoSrc: "/partners/royal-shell-logo.png",
    logoAlt: "Royal Shell Real Estate logo",
    logoWidth: 1000,
    logoHeight: 331,
    websiteUrl: "https://www.royalshellrealestate.com/",
    careersUrl: "https://www.royalshellrealestate.com/join-our-team",
    note: "Reach out to Daniel for more details.",
    contact: {
      firstName: "Daniel",
      phoneDisplay: "239.471.8500",
      smsHref: "sms:+12394718500",
      telHref: "tel:+12394718500",
    },
  },
];
