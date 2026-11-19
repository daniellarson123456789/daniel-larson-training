/**
 * Florida real estate mutual recognition ("reciprocity") pages.
 * State list, all-state history rule (KY, WV) and dissolved agreements checked against DBPR on Nov 13, 2026.
 * Residency, home-state certification steps, fees and timing match the Nov 14, 2026 state walkthroughs
 * (/workspace/mutual-rec/state-walkthroughs-build/states.py and alabama-walkthrough/thinkific-html-v3),
 * Nov 15, 2026 (Daniel approved Index Bot's accuracy fixes): residency uses DBPR's public wording only
 * (not a Florida resident at the time of application) for every state; the KY/WV 1-year sales note is removed;
 * Alabama and Arkansas broker applicants need an active broker or sales associate license for at least
 * 24 months during the preceding five years (DBPR Mutual Recognition States page). RE 2's certification
 * must be dated within 30 days.
 * Price $130 per state package; buy buttons go straight to Thinkific checkout (/enroll/<id>).
 */

export const MR_CHECKED = "November 13, 2026";
export const MR_LASTMOD = "2026-11-15";
export const MR_PRICE = 130;

export const MR_LINKS = {
  dbprStates: "https://www2.myfloridalicense.com/real-estate-commission/mutual-recognition-states/",
  dbprDivision: "https://www2.myfloridalicense.com/real-estate-commission/",
  re1: "https://www.myfloridalicense.com/CheckListDetail.asp?SID=&XACT_DEFN_ID=747&clientCode=2501&xactCode=1011",
  re2: "https://www.myfloridalicense.com/CheckListDetail.asp?SID=&XACT_DEFN_ID=347&clientCode=2501&xactCode=1013",
  booklet: "https://www2.myfloridalicense.com/servop/testing/documents/RE_law_cibs.pdf",
  prints: "https://www2.myfloridalicense.com/fingerprinting/",
  pearson: "https://home.pearsonvue.com/fl/realestate",
  sms: "sms:+12394718500",
};

export type License = "sales-associate" | "broker";

export type MrState = {
  code: string;
  name: string;
  slug: string;
  /** "an" or "a" */
  article: "a" | "an";
  agency: string;
  agencyShort: string;
  doc: string;
  docLink: string;
  docLinkLabel: string;
  /** Course-level detail (click paths); kept for reference, not shown on the site. */
  docHow: string;
  /** Short, site-safe answer to "where do I get it?" (no click paths). */
  docWhere: string;
  agreementPdf: string;
  /** Fee and timing, only where an official page or form states it. */
  docCost: string;
  /** Who to contact with questions about the certification. */
  docContact: string;
  /** Retired Nov 15, 2026: residency now uses DBPR's wording for every state. Always false. */
  homeRes: boolean;
  /** The state's own residency wording for the qualify checklist. */
  residency: string;
  /** What the home state calls its sales license. */
  salesHome: string;
  allStates: boolean;
  /** Retired Nov 15, 2026 (KY/WV 1-year note removed). Always false. */
  oneYear: boolean;
  /** DBPR wording for GA and MS mentions "experience requirements, if any". */
  experienceWording: boolean;
  /** Public Thinkific bundle page (backup; buy buttons use checkoutUrl). */
  bundleUrl: string;
  /** Direct Thinkific checkout for the state bundle. */
  checkoutUrl: string;
};

const ENROLL = "https://portal.daniellarsontraining.com/enroll/";
const RES_DBPR = "You don't live in Florida. DBPR says you can't be a Florida resident at the time you apply.";

export const mrStates: MrState[] = [
  {
    code: "AL", name: "Alabama", slug: "alabama", article: "an",
    agency: "Alabama Real Estate Commission (AREC)", agencyShort: "AREC",
    doc: "Certification of Licensure",
    docLink: "https://www.arec.alabama.gov/pages/professionals/licensing/licensure.aspx",
    docLinkLabel: "AREC: Certificate of Licensure",
    docHow: "Log in to AREC's Online Services, choose the Certificate of Licensure option and download it as a PDF. AREC also takes requests by mail. It's not a copy of your license.",
    docWhere: "Download it from AREC's Online Services as a PDF, or request it from AREC by mail. It's not a copy of your license.",
    docCost: "AREC's published fee schedule lists it at $10. Downloading is the fastest way to get it; a mail request takes longer.",
    docContact: "AREC: (334) 242-5544 · arec@arec.alabama.gov",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/MutRecAL07.pdf",
    homeRes: false,
    residency: RES_DBPR,
    salesHome: "salesperson",
    allStates: false, oneYear: false, experienceWording: false,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/alabama-mutual-recognition",
    checkoutUrl: `${ENROLL}3939129`,
  },
  {
    code: "AR", name: "Arkansas", slug: "arkansas", article: "an",
    agency: "Arkansas Real Estate Commission (AREC)", agencyShort: "AREC",
    doc: "Certificate of Licensure (License History)",
    docLink: "https://arec.arkansas.gov/wp-content/uploads/Licensure-History-RequestLKA.pdf",
    docLinkLabel: "Arkansas AREC: Request for Certificate of Licensure (PDF)",
    docHow: "Fill out AREC's mailed request form, sign it, and mail it with your payment (personal or company check, money order or cashier's check) to AREC in Little Rock. AREC can mail or email the certificate to you.",
    docWhere: "Order it from AREC with AREC's mailed request form and payment. AREC mails or emails the certificate to you.",
    docCost: "AREC's form lists $10 per copy and says requests are processed within 7–10 business days after AREC receives them. Mail time is extra.",
    docContact: "AREC: (501) 683-8010",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/MutRecAR07.pdf",
    homeRes: false, residency: RES_DBPR, salesHome: "salesperson",
    allStates: false, oneYear: false, experienceWording: false,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/arkansas-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941719`,
  },
  {
    code: "CT", name: "Connecticut", slug: "connecticut", article: "a",
    agency: "Connecticut Department of Consumer Protection (DCP)", agencyShort: "DCP",
    doc: "License History Certification",
    docLink: "https://portal.ct.gov/-/media/dcp/licensing/real-estate/online-license-history-request.pdf",
    docLinkLabel: "Connecticut DCP: How to request a license history certification (PDF)",
    docHow: "Request it online in Connecticut eLicense: Online Services, then License Maintenance, then Start next to your license, then License Certification. Complete the form and pay the invoice. DCP mails the letter.",
    docWhere: "Request it online through Connecticut eLicense and pay DCP's invoice. DCP mails the letter to you.",
    docCost: "DCP's instructions list $25 per request (non-refundable) and say to allow 5–7 business days for processing. Mail time is extra.",
    docContact: "DCP: dcp.licenseservices@ct.gov",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/mutrec_con.pdf",
    homeRes: false, residency: RES_DBPR, salesHome: "salesperson",
    allStates: false, oneYear: false, experienceWording: false,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/connecticut-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941720`,
  },
  {
    code: "GA", name: "Georgia", slug: "georgia", article: "a",
    agency: "Georgia Real Estate Commission (GREC)", agencyShort: "GREC",
    doc: "Certified License History",
    docLink: "https://grec.state.ga.us/wp-content/uploads/2023/09/Reciprocity-for-Real-Estate-Licensees.pdf",
    docLinkLabel: "GREC: Certified license histories (PDF)",
    docHow: "GREC says you can get it from its website (Certified License History, under Licensed Professionals) or by emailing GRECMAIL@grec.state.ga.us with your Georgia license number and mailing address.",
    docWhere: "Order it from GREC's website (Certified License History) or by email to GREC with your Georgia license number and mailing address.",
    docCost: "GREC doesn't publish a fee or processing time, so check both when you order. Get it right before you apply.",
    docContact: "GREC: 404-656-3916",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/mutrec_geo.pdf",
    homeRes: false,
    residency: RES_DBPR,
    salesHome: "salesperson",
    allStates: false, oneYear: false, experienceWording: true,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/georgia-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941722`,
  },
  {
    code: "KY", name: "Kentucky", slug: "kentucky", article: "a",
    agency: "Kentucky Real Estate Commission (KREC)", agencyShort: "KREC",
    doc: "License History Certification",
    docLink: "https://krec.ky.gov/Documents/license%20history%20verification%20instructions.pdf",
    docLinkLabel: "KREC: License history verification instructions and Form 201 (PDF)",
    docHow: "Complete KREC Form 201 (sections 1, 3 and 5) and mail it with a check or money order made out to the Kentucky State Treasurer to KREC in Frankfort.",
    docWhere: "Order it from KREC by mail with KREC Form 201 and a check or money order.",
    docCost: "KREC's instructions list $10 per certificate. KREC doesn't publish a processing time, so order it first.",
    docContact: "KREC: (502) 564-7760",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/Signed_Florida_Kentucky_AGreement.pdf",
    homeRes: false,
    residency: RES_DBPR,
    salesHome: "sales associate",
    allStates: true, oneYear: false, experienceWording: false,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/kentucky-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941725`,
  },
  {
    code: "MS", name: "Mississippi", slug: "mississippi", article: "a",
    agency: "Mississippi Real Estate Commission (MREC)", agencyShort: "MREC",
    doc: "Certificate of Licensure",
    docLink: "https://www.mrec.ms.gov/",
    docLinkLabel: "Mississippi Real Estate Commission",
    docHow: "Call MREC at (601) 321-6970 and ask for a Certificate of Licensure for a Florida mutual recognition application. MREC's own forms say a copy of your license is not a certificate of licensure.",
    docWhere: "Call MREC at (601) 321-6970 and ask for a Certificate of Licensure for a Florida mutual recognition application.",
    docCost: "Ask MREC about the fee and timing when you call. Order it close to when you'll apply.",
    docContact: "MREC: (601) 321-6970",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/mutrec_mis.pdf",
    homeRes: false,
    residency: RES_DBPR,
    salesHome: "salesperson",
    allStates: false, oneYear: false, experienceWording: true,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/mississippi-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941729`,
  },
  {
    code: "NE", name: "Nebraska", slug: "nebraska", article: "a",
    agency: "Nebraska Real Estate Commission (NREC)", agencyShort: "NREC",
    doc: "Certification of License History",
    docLink: "https://nrec.nebraska.gov/licensing/current-licensee-manage-your-license",
    docLinkLabel: "NREC: Certifications of License History",
    docHow: "Complete NREC's Request for Certification of License History form, name the Florida DBPR Division of Real Estate as the entity, choose delivery to you (Licensee), sign it yourself and send it with the fee.",
    docWhere: "Order it from NREC with NREC's Request for Certification of License History form and the fee.",
    docCost: "NREC's form and fee schedule list $25, and the form says to allow 24 to 48 hours for processing.",
    docContact: "NREC: (402) 471-2004 · realestate.commission@nebraska.gov",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/MutRecNE1107.pdf",
    homeRes: false, residency: RES_DBPR, salesHome: "salesperson",
    allStates: false, oneYear: false, experienceWording: false,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/nebraska-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941730`,
  },
  {
    code: "RI", name: "Rhode Island", slug: "rhode-island", article: "a",
    agency: "Rhode Island Department of Business Regulation (DBR)", agencyShort: "DBR",
    doc: "Certificate of Licensure (Letter of Good Standing)",
    docLink: "https://dbr.ri.gov/media/6621/download",
    docLinkLabel: "Rhode Island DBR: Certificate of Licensure requests (PDF)",
    docHow: "Log in to your existing DBR eLicensing account (don't create a new one), request the Letter of Good Standing / Certificate of Licensure and enter Florida as the jurisdiction. DBR emails the letter only to you, so save it for your Florida application.",
    docWhere: "Request it through your existing Rhode Island DBR eLicensing account. DBR emails the letter to you.",
    docCost: "DBR's paper request form lists $25 per certificate. The online fee isn't stated, so check it when you pay.",
    docContact: "DBR: DBR.REInquiry@dbr.ri.gov",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/mutrec_RI.pdf",
    homeRes: false,
    residency: RES_DBPR,
    salesHome: "salesperson",
    allStates: false, oneYear: false, experienceWording: false,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/rhode-island-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941731`,
  },
  {
    code: "WV", name: "West Virginia", slug: "west-virginia", article: "a",
    agency: "West Virginia Real Estate Commission (WVREC)", agencyShort: "WVREC",
    doc: "Certificate of Licensure (Letter of Good Standing)",
    docLink: "https://apps.wv.gov/REC/Licensing/Application/LicenseInfoService",
    docLinkLabel: "WVREC: License Information Service",
    docHow: "Request it online through WVREC's License Information Service: choose Certificate of Licensure (Letter of Good Standing) and have your West Virginia license number ready.",
    docWhere: "Order it online through WVREC's License Information Service, with your West Virginia license number ready.",
    docCost: "WVREC's service lists it at $20. WVREC doesn't publish a processing time.",
    docContact: "WVREC: (304) 558-3555 · wvrec@wv.gov",
    agreementPdf: "https://www2.myfloridalicense.com/re/documents/Signed_Florida_WestVirginia_Agreement.pdf",
    homeRes: false,
    residency: RES_DBPR,
    salesHome: "salesperson",
    allStates: true, oneYear: false, experienceWording: false,
    bundleUrl: "https://portal.daniellarsontraining.com/bundles/west-virginia-to-florida-mutual-recognition",
    checkoutUrl: `${ENROLL}3941733`,
  },
];

export const licenseInfo = {
  "sales-associate": {
    label: "Sales Associate",
    lower: "sales associate",
    form: "RE 1",
    formLink: MR_LINKS.re1,
    homeLicense: "salesperson or sales associate",
    postHours: 45,
  },
  broker: {
    label: "Broker",
    lower: "broker",
    form: "RE 2",
    formLink: MR_LINKS.re2,
    homeLicense: "broker",
    postHours: 60,
  },
} as const;

export const mrPagePath = (state: MrState, license: License) =>
  `/mutual-recognition/${state.slug}-${license}/`;

export const mrPageCrumb = (state: MrState, license: License) =>
  `${state.name} ${licenseInfo[license].label}`;

export const mrPageTitle = (state: MrState, license: License) =>
  `${state.name} to Florida Real Estate Reciprocity (${license === "broker" ? "Broker" : "Sales"}) | FastPass`;

/** The one-line specialty statement used in meta, FAQ, JSON-LD and llms content. */
export const MR_SPECIALTY = "Real Estate FastPass specializes in Florida mutual recognition";

/** States where DBPR adds a broker experience rule (24 months active in the preceding five years). */
export const MR_BROKER_24_CODES = ["AL", "AR"];
export const mrBroker24 = (s: MrState) => MR_BROKER_24_CODES.includes(s.code);
export const MR_BROKER_24_RULE = "an active broker or sales associate license for at least 24 months during the preceding five years";

export const mrStateList = mrStates.map((s) => s.name).join(", ").replace(/, (?=[^,]*$)/, " and ");

/** Dissolved agreements listed on DBPR's Division of Real Estate page (checked Nov 13, 2026). */
export const mrDissolved = [
  { name: "Illinois", date: "December 31, 2025" },
  { name: "Indiana", date: "June 30, 2014" },
  { name: "Tennessee", date: "September 30, 2012" },
  { name: "Oklahoma", date: "February 15, 2016" },
  { name: "Colorado", date: "January 31, 2009" },
];

/** Every public mutual recognition URL, for the sitemap. */
export const mrAllPages = [
  { path: "/mutual-recognition/", crumb: "Mutual Recognition" },
  ...mrStates.flatMap((state) =>
    (["sales-associate", "broker"] as License[]).map((license) => ({
      path: mrPagePath(state, license),
      crumb: mrPageCrumb(state, license),
    })),
  ),
];

/**
 * "What's inside" benefits, named from the 13 lessons in each state's walkthrough course
 * (/workspace/mutual-rec/<slug>-walkthrough/thinkific-html/). Names the help; the how stays in the course.
 */
export const mrInside = (state: MrState) => [
  { title: `Every step of your ${state.name} ${state.doc}`, text: `What to order from ${state.agencyShort}, how to request it and what it has to show before Florida will accept it.` },
  { title: "Field-by-field help with your Florida application", text: "We go through the RE 1 or RE 2 application section by section, then a pre-submit check so nothing gets kicked back." },
  { title: "What to do if something goes wrong", text: "A deficiency letter from DBPR, unreadable fingerprints, a name mismatch or an old certification: what each one means and the fix." },
  { title: "What to have ready, and how long it all takes", text: "Everything to gather before day one, which steps you control and which ones you wait on." },
  { title: "Fingerprints, done in the right order", text: "When to get printed, what kind of provider to use and what to tell them." },
  { title: "Booking the exam, and after you pass", text: "When you can book the Florida law exam, exam day, your license number, activating your license and post-licensing." },
  { title: `Printable ${state.name}-to-Florida checklist`, text: "One checklist for the sales associate path and one for the broker path, so you can tick off each step." },
  { title: `FAQ and troubleshooting for ${state.name} licensees`, text: `Answers to the questions ${state.name} applicants ask, plus text Daniel at 239.471.8500 with the step you're on.` },
];

/** Generic version for the hub. */
export const mrInsideHub = [
  { title: "Every step of your state's certification", text: "What to order from your state's commission, how to request it and what it has to show before Florida will accept it." },
  { title: "Field-by-field help with your Florida application", text: "The RE 1 or RE 2 application section by section, then a pre-submit check so nothing gets kicked back." },
  { title: "What to do if something goes wrong", text: "Deficiency letters from DBPR, fingerprint problems, name mismatches and more: what each one means and the fix." },
  { title: "What to have ready, and how long it all takes", text: "Everything to gather before day one, which steps you control and which ones you wait on." },
  { title: "Fingerprints, booking the exam and after you pass", text: "The right order for prints, booking the Florida law exam, your license number, activation and post-licensing." },
  { title: "A printable checklist for your state", text: "Sales associate and broker versions, built around your state's own paperwork." },
];

/**
 * Florida law exam prep in every state package. Counts verified Nov 14, 2026 against
 * /workspace/mutual-rec/mr-fastpass (three 100-question tests, explanation on every item),
 * mr-fastpass/ebook-outline.md (seven audio review sections) and mr-workbook (PDF, answer pages at the back).
 * Questions were mapped to the DBPR Laws and Rules candidate booklet outline (law-exam-mapping).
 */
export const mrPrep = [
  { title: "Mutual Recognition FastPass Exam Prep", short: "Three 100-question Florida law practice exams, with an explanation for every answer.", text: "Three 100-question practice exams built from questions mapped to the official Florida Laws and Rules exam outline, with a plain-language explanation for every answer. Take them until you can pass all three." },
  { title: "Mutual Recognition Audio Ebook Review", short: "Seven audio reviews of the Florida law the exam covers.", text: "Seven audio reviews of the Florida material the exam leans on: homestead and government rights, ownership and landlord-tenant, title, financing, brokerage relationships, licensee regulations and licensing guidelines." },
  { title: "Mutual Recognition FastPass Workbook", short: "A downloadable PDF that goes with the audio reviews and the practice exams.", text: "A downloadable PDF that follows the audio reviews, with the answer pages for all three practice exams at the back." },
];
export const MR_PREP_SUMMARY = "Florida law exam prep built just for the mutual recognition exam: three 100-question practice exams with an explanation for every answer, seven audio reviews and the Mutual Recognition FastPass Workbook (PDF)";
