export type SampleChoice = { key: "A" | "B" | "C" | "D"; text: string };

export type SampleQuestion = {
  id: string;
  question: string;
  choices: SampleChoice[];
  answer: "A" | "B" | "C" | "D";
  videoId?: string;
  content: string;
  explanation: string;
};

// Stems, choices, and answers: course1-library cards-info / consolidated-question-mapping.json.
// Video IDs: published practice videos only. Content and explainers written to teach enough
// to answer each item under Ch. 475 F.S. / 61J2 F.A.C. (and IRS useful-life figures for 04.01 / 04.02).
// corrections-log exclusions respected (no interest-bearing escrow claim, no kickback-legalized-by-disclosure,
// no "transition before showing" / disclosure-makes-dual-agency-legal claims).
export const sampleQuestions: SampleQuestion[] = [
  {
    id: "10.15",
    question: "All are owed in a transaction broker relationship except:",
    choices: [
      { key: "A", text: "limited confidentiality for price, terms, motives" },
      { key: "B", text: "fair dealing" },
      { key: "C", text: "full disclosure" },
      { key: "D", text: "disclosure for known facts" },
    ],
    answer: "C",
    videoId: "NudGKs9T0p8",
    content:
      "In Florida, a transaction broker provides limited, non-fiduciary representation to the buyer, the seller, or both, and it is the default brokerage relationship in a residential transaction. The duties include dealing honestly and fairly, accounting for all funds, using skill, care, and diligence, presenting all offers and counteroffers in a timely manner, limited confidentiality, and disclosing known facts that materially affect the value of residential real property and are not readily observable.\n\nFull disclosure is different. It is a single-agent fiduciary duty: the agent must tell the client everything material, even facts or rumors that may not help that client’s bargaining position. A transaction broker does not owe full disclosure.",
    explanation:
      "A transaction broker owes fair dealing, disclosure of known material facts that are not readily observable, and limited confidentiality for price, terms, and motives. Full disclosure is a single-agency duty, not a transaction-broker duty. The duty that is not owed is full disclosure.",
  },
  {
    id: "10.16",
    question: "Transaction broker owes which duty?",
    choices: [
      { key: "A", text: "disclosure of all material facts" },
      { key: "B", text: "obedience" },
      { key: "C", text: "loyalty" },
      { key: "D", text: "limited confidentiality" },
    ],
    answer: "D",
    videoId: "b-LqTfA7788",
    content:
      "A transaction broker does not owe the fiduciary duties of a single agent. Loyalty and obedience belong to single agency, not to a transaction broker relationship. The disclosure duty is also narrower: a transaction broker must disclose known facts that materially affect value and are not readily observable — not “all material facts.”\n\nWhat a transaction broker does owe is limited confidentiality. Unless the party agrees otherwise in writing, the broker may not disclose that the seller will accept a lower price, that the buyer will pay a higher price, or either party’s motivating circumstances.",
    explanation:
      "Limited confidentiality is a transaction-broker duty. Loyalty and obedience are single-agency duties. “Disclosure of all material facts” is broader than the transaction-broker duty, which is disclosure of known facts that materially affect value and are not readily observable.",
  },
  {
    id: "12.49",
    question: "Broker is not authorized to do which of the following?",
    choices: [
      { key: "A", text: "act as a dual agent" },
      { key: "B", text: "fillout purchase contracts, and get them signed" },
      { key: "C", text: "sell a business opportunity" },
      { key: "D", text: "hold $5000 of their own money in a Florida trust account, if conducting property management services" },
    ],
    answer: "A",
    videoId: "B2HwGDLcuQg",
    content:
      "A Florida real estate broker may fill out a purchase contract and get it signed, and may sell a business opportunity as part of authorized brokerage. When the broker is providing property management services, the broker may also keep up to $5,000 of personal or brokerage funds in a property management escrow account.\n\nWhat a broker may not do is act as a dual agent. Dual agency means representing both the buyer and the seller as a single agent in the same transaction. Dual agency is illegal in Florida under Chapter 475 and can lead to discipline by the FREC.",
    explanation:
      "A broker is not authorized to act as a dual agent. Filling out purchase contracts, selling a business opportunity, and keeping up to $5,000 of personal funds in a property management escrow account are authorized. Dual agency is illegal in Florida.",
  },
  {
    id: "04.02",
    question: "The established useful asset life, under IRS code, for an income-producing commercial property is:",
    choices: [
      { key: "A", text: "5 years" },
      { key: "B", text: "2 years" },
      { key: "C", text: "39 years" },
      { key: "D", text: "27.5 years" },
    ],
    answer: "C",
    videoId: "IxltUWpzW0M",
    content:
      "For depreciation under the IRS code, the established useful (asset) life of an income-producing building depends on the type of property, not simply on the fact that it is being rented. An income-producing residential building is depreciated over 27.5 years.\n\nAn income-producing commercial (nonresidential) building is depreciated over 39 years. If the question asks for the commercial figure, the answer is 39 years — not 27.5.",
    explanation:
      "Under IRS code, the established useful asset life for an income-producing commercial building is 39 years. 27.5 years is the figure for an income-producing residential building.",
  },
  {
    id: "10.20",
    question: "Which is not residential real estate?",
    choices: [
      { key: "A", text: "1-4 residential units" },
      { key: "B", text: "1-4 unimproved lots zoned residential" },
      { key: "C", text: "10 acres of agricultural" },
      { key: "D", text: "14 acres of agricultural" },
    ],
    answer: "D",
    videoId: "qhN1a8Em-Ms",
    content:
      "For Florida brokerage-relationship purposes, a residential sale is the sale of improved residential property of four units or fewer, the sale of unimproved residential property intended for four units or fewer, or the sale of agricultural property of 10 acres or fewer.\n\nOne to four residential units, and vacant lots zoned or intended for one to four residential units, are residential under that definition. Agricultural property of 10 acres is also residential. Agricultural property of 14 acres is over the 10-acre limit, so it is not residential real estate.",
    explanation:
      "Residential real estate includes one to four units, unimproved property intended for one to four units, and agricultural property of 10 acres or fewer. Fourteen acres of agricultural property exceeds that 10-acre limit, so it is not residential.",
  },
  {
    id: "10.19",
    question: "Full confidentiality is required in which relationship?",
    choices: [
      { key: "A", text: "transaction broker" },
      { key: "B", text: "no broker" },
      { key: "C", text: "single agency" },
      { key: "D", text: "dual agency" },
    ],
    answer: "C",
    videoId: "yBtp78nu_ds",
    content:
      "Florida authorizes three brokerage relationships: transaction broker, single agent, and no brokerage relationship. Dual agency is not an authorized relationship; it is illegal.\n\nA transaction broker owes only limited confidentiality — covering price, terms, and motives. A no-brokerage relationship does not include a confidentiality duty. A single agent is a fiduciary and owes full confidentiality, along with loyalty, obedience to lawful instructions, and full disclosure. Full confidentiality is required in single agency.",
    explanation:
      "Full confidentiality is a single-agency duty. A transaction broker owes only limited confidentiality for price, terms, and motives. A no-brokerage relationship does not owe confidentiality. Dual agency is illegal in Florida, so it is not an authorized relationship in which that duty is required.",
  },
  {
    id: "04.01",
    question: "The established useful asset life, under IRS code, for an income-producing residential property is:",
    choices: [
      { key: "A", text: "5 years" },
      { key: "B", text: "2 years" },
      { key: "C", text: "39 years" },
      { key: "D", text: "27.5 years" },
    ],
    answer: "D",
    videoId: "8ZzsTV_zNZA",
    content:
      "For depreciation under the IRS code, the established useful (asset) life of an income-producing building depends on the type of property. If a residential building is used as a rental, its useful life is 27.5 years.\n\nIf a commercial (nonresidential) building is used as a rental, its useful life is 39 years. When the question asks for the residential figure, the answer is 27.5 years — not 39.",
    explanation:
      "Under IRS code, the established useful asset life for an income-producing residential building is 27.5 years. 39 years is the figure for an income-producing commercial building.",
  },
  {
    id: "10.07",
    question: "The property is listed for $55,000. Seller tells listing broker they will accept $50,000. Which is true?",
    choices: [
      { key: "A", text: "listing broker must tell all buyers to offer $50,000" },
      { key: "B", text: "listing broker must keep the information confidential" },
      { key: "C", text: "listing broker must cancel the listing" },
      { key: "D", text: "listing broker must relist the property at $50,000" },
    ],
    answer: "B",
    videoId: "fjOSVqyYKwM",
    content:
      "If a seller lists a property at $55,000 and then tells the listing broker they will accept $50,000, that is information about price. In a transaction broker relationship — Florida’s default — and in a single-agent relationship, the broker owes confidentiality as to price, terms, and motives unless the seller authorizes disclosure in writing.\n\nThat means the listing broker must not tell buyers to offer $50,000, must not relist the property at $50,000, and is not required to cancel the listing because of that number. The confidentiality duty would not apply in a no-brokerage relationship, but for a listing broker the correct handling is to keep the information confidential.",
    explanation:
      "The seller’s willingness to accept $50,000 is a matter of price. Unless it is a no-brokerage relationship, confidentiality for price, terms, and motives is owed. The listing broker must keep the information confidential.",
  },
  {
    id: "11.01",
    question: "If seller requests property only be shown to people of a certain race, religion, or national origin, broker should:",
    choices: [
      { key: "A", text: "comply with the request" },
      { key: "B", text: "cancel the listing" },
      { key: "C", text: "send a special notice to all buyers" },
      { key: "D", text: "steer some buyers away" },
    ],
    answer: "B",
    videoId: "6JC6unYnDug",
    content:
      "Federal fair housing law and Florida law prohibit a broker from refusing to show a property, or from steering buyers, because of race, religion, or national origin. A single agent owes the seller obedience, but only as to lawful instructions.\n\nA request to limit showings by race, religion, or national origin is not lawful. The broker must not comply, must not steer buyers away, and must not send a special notice to carry out that request. If the seller persists, the broker must cancel the listing.",
    explanation:
      "Obedience is limited to lawful requests. A discriminatory showing request is not lawful, so the broker must not comply, steer, or send a special notice to carry it out. If the seller persists, the listing must be canceled.",
  },
  {
    id: "10.22",
    question: "Broker has a single agency listing. Buyer desires representation from the same broker in buying broker’s listing. Which of the following is true?",
    choices: [
      { key: "A", text: "buyer seeks a no brokerage relationship" },
      { key: "B", text: "this is okay, with disclosure" },
      { key: "C", text: "this creates two single agents, which is legal" },
      { key: "D", text: "this would create an illegal dual agency" },
    ],
    answer: "D",
    videoId: "7P-nEgVnAlE",
    content:
      "A single agent represents one party in a fiduciary capacity. If the broker already has a single-agency listing, and a buyer wants that same broker to represent the buyer in buying that listed property, the broker would be a single agent for both the seller and the buyer in the same transaction.\n\nThat is dual agency. Dual agency is illegal in Florida under Chapter 475. Disclosure alone does not make it legal, and it is not “two single agents, which is legal.” A no-brokerage relationship with the buyer would be a different arrangement, and it is not what this question describes.",
    explanation:
      "If the broker is already the seller’s single agent and the buyer wants representation from that same broker on the same listing, the broker would be a single agent for both sides. That is dual agency, which is illegal in Florida. Disclosure alone does not make it legal.",
  },

  {
    id: "10.26",
    question: "broker is a no broker to buyer who wants to see a property listed for $150,000. The property is worth $160,000. Which is true?",
    choices: [
      { key: "A", text: "broker must steer buyers away" },
      { key: "B", text: "broker must hide latent facts from buyer" },
      { key: "C", text: "The broker must act honestly and fairly, disclose known latent facts materially affecting residential value, and account for entrusted funds." },
      { key: "D", text: "broker must cancel the no brokerage buyer rep agreement" },
    ],
    answer: "C",
    videoId: "Z1RLbY7oDac",
    content:
      "In Florida, a licensee who has no brokerage relationship with a buyer or seller still owes three duties under Chapter 475: dealing honestly and fairly; disclosing known facts that materially affect the value of residential real property and are not readily observable to the buyer; and accounting for all funds entrusted to the licensee.\n\nThe licensee is not required to steer buyers away, hide latent facts, or cancel the no-brokerage arrangement. The duties that are owed are honest and fair dealing, disclosure of known latent facts that materially affect residential value, and accounting for entrusted funds.",
    explanation:
      "A no-brokerage licensee must act honestly and fairly, disclose known latent facts that materially affect residential value, and account for entrusted funds. Steering, hiding latent facts, and canceling the no-brokerage relationship are not required.",
  },
  {
    id: "10.12",
    question: "When seller grants power of attorney, broker is operating in what capacity?",
    choices: [
      { key: "A", text: "trustee" },
      { key: "B", text: "guardian" },
      { key: "C", text: "attorney in fact" },
      { key: "D", text: "dual agent" },
    ],
    answer: "C",
    videoId: "iljLRmRBkm0",
    content:
      "When a seller grants a power of attorney, the person authorized to act under that power is called an attorney in fact. Florida’s real estate license law uses that same term for a person acting under a power of attorney to execute contracts or conveyances.\n\nThat capacity is not trustee, guardian, or dual agent.",
    explanation:
      "The person acting under a power of attorney is an attorney in fact. Trustee, guardian, and dual agent are different capacities.",
  },
  {
    id: "10.04",
    question: "a buyer-brokerage agreement may be any of the following except:",
    choices: [
      { key: "A", text: "a transaction broker" },
      { key: "B", text: "a single agent" },
      { key: "C", text: "a dual agent" },
      { key: "D", text: "a nonrepresentative" },
    ],
    answer: "C",
    videoId: "WhbMFXKrExY",
    content:
      "Florida authorizes a licensee to work as a transaction broker or as a single agent, and also authorizes a no-brokerage (nonrepresentation) relationship. A licensee may not operate as a disclosed or nondisclosed dual agent.\n\nDual agency is illegal in Florida under Chapter 475. Of the arrangements listed, a dual agent is the one that is not authorized.",
    explanation:
      "A buyer-brokerage relationship may be a transaction broker, a single agent, or a nonrepresentative. Dual agency is illegal in Florida, so a dual agent is not an authorized arrangement.",
  },
  {
    id: "10.24",
    question: "Broker who works in limited representation of buyer, or seller, or both is a:",
    choices: [
      { key: "A", text: "dual agent" },
      { key: "B", text: "single agent" },
      { key: "C", text: "transaction broker" },
      { key: "D", text: "no broker" },
    ],
    answer: "C",
    videoId: "_qGyS_27GFA",
    content:
      "A transaction broker provides a limited form of representation to a buyer, a seller, or both in a real estate transaction, but does not represent either in a fiduciary capacity or as a single agent.\n\nDual agency is illegal in Florida. A single agent is a fiduciary of one side only. A no-brokerage relationship is non-representation, not limited representation.",
    explanation:
      "Limited representation of a buyer, a seller, or both is a transaction broker. That is not dual agency, single agency, or a no-brokerage relationship.",
  },
  {
    id: "10.30",
    question: "Broker is told by Contractor that the roof has a leak. Broker must:",
    choices: [
      { key: "A", text: "cancel the listing" },
      { key: "B", text: "disclose all known hidden facts" },
      { key: "C", text: "ask the contractor to keep silent" },
      { key: "D", text: "sign a privacy agreement with Seller" },
    ],
    answer: "B",
    videoId: "8y6wE3azE-s",
    content:
      "A roof leak is a known fact that can materially affect the value of residential property and is not readily observable. In a transaction-broker, single-agent, or no-brokerage relationship, the licensee must disclose known facts of that kind.\n\nCanceling the listing, asking the contractor to keep silent, or signing a privacy agreement with the seller would not satisfy that disclosure duty.",
    explanation:
      "The broker must disclose the known hidden defect. The statutory duty is to disclose known facts that materially affect the value of residential real property and are not readily observable. Canceling the listing or keeping the leak quiet does not meet that duty.",
  },
  {
    id: "11.46",
    question: "The Real Estate Professional Practice Act:",
    choices: [
      { key: "A", text: "475" },
      { key: "B", text: "455" },
      { key: "C", text: "720" },
      { key: "D", text: "61J2" },
    ],
    answer: "A",
    videoId: "uHGsCBOM1qM",
    content:
      "The Real Estate Professional Practice Act is the course and exam name for Florida’s real estate practice chapter, Chapter 475. The official statutory heading is “Real Estate Brokers, Sales Associates, Schools, and Appraisers.”\n\nChapter 455 is the general provisions chapter for the Department of Business and Professional Regulation. 61J2 is the Florida Real Estate Commission’s administrative rules, not a statute chapter. Chapter 720 is unrelated.",
    explanation:
      "The Real Estate Professional Practice Act is Chapter 475. 455 is the general DBPR chapter, 61J2 is FREC’s rules, and 720 is not the real estate practice act.",
  },
  {
    id: "11.45",
    question: "The chapter of Florida statutes defining the general legal practice and procedure for the DBPR, and licensees of all professionals regulated by DBPR:",
    choices: [
      { key: "A", text: "475" },
      { key: "B", text: "455" },
      { key: "C", text: "720" },
      { key: "D", text: "61J2" },
    ],
    answer: "B",
    videoId: "zEC54Oh2S_E",
    content:
      "Chapter 455 of the Florida Statutes is titled “Business and Professional Regulation: General Provisions.” It sets the general legal practice and procedure for the Department of Business and Professional Regulation and for licensees of the professions the department regulates.\n\nChapter 475 is the real estate practice act. 61J2 is FREC’s administrative rules, not a statute chapter.",
    explanation:
      "The general DBPR practice-and-procedure chapter is 455. 475 is the real estate practice act, and 61J2 is FREC’s administrative rules.",
  },
  {
    id: "11.44",
    question: "Rules which expand upon the FREC provisions of statutes by providing greater details, and rules regarding principles and practices required by real estate licensees?",
    choices: [
      { key: "A", text: "475" },
      { key: "B", text: "455" },
      { key: "C", text: "720" },
      { key: "D", text: "61J2" },
    ],
    answer: "D",
    videoId: "z7nFRXRJC9s",
    content:
      "The Florida Real Estate Commission’s administrative rules are in the Florida Administrative Code, Division 61J2. Those rules implement Chapter 475 and provide greater detail on the principles and practices required of real estate licensees.\n\n475 and 455 are statutes, not the administrative-rule chapter. Chapter 720 is unrelated (homeowners’ associations).",
    explanation:
      "FREC’s rules are in 61J2. 475 and 455 are statutes, not the administrative-rule chapter.",
  },
  {
    id: "12.56",
    question: "What is the experience requirement for a broker license?",
    choices: [
      { key: "A", text: "24 months active under any broker in any state" },
      { key: "B", text: "12 months active under any broker in any state" },
      { key: "C", text: "18 months active under any broker in any state" },
      { key: "D", text: "36 months active under any broker in any state" },
    ],
    answer: "A",
    videoId: "yPxZPaCnHJE",
    content:
      "To be licensed as a Florida real estate broker, a person must have held an active sales associate’s license for at least 24 months during the preceding 5 years in the office of one or more real estate brokers licensed in this state or another state, territory, or jurisdiction, or meet one of the statute’s other 24-month paths, including certain government employment or a broker’s license from another jurisdiction.\n\nThe tested figure is 24 months, not 12, 18, or 36. The 24 months must fall within the preceding 5 years. Experience under an unlicensed owner-developer does not satisfy the “in the office of one or more real estate brokers licensed” path.",
    explanation:
      "The broker experience requirement is 24 months of active experience, during the preceding 5 years, under a licensed broker, or another statutory 24-month path. 12, 18, and 36 months are incorrect.",
  },
  {
    id: "12.54",
    question: "A license is required for sales all of the following except:",
    choices: [
      { key: "A", text: "timeshares" },
      { key: "B", text: "business opportunities" },
      { key: "C", text: "residential single-family homes" },
      { key: "D", text: "cemetery lots" },
    ],
    answer: "D",
    videoId: "8xRXPJ0fBls",
    content:
      "For purposes of Chapter 475, “real property” or “real estate” includes an interest in land and an interest in business enterprises or business opportunities, but the term does not include any cemetery lot or right of burial in any cemetery.\n\nTimeshares, business opportunities, and residential homes are within that definition, so those sales generally require a license, subject to other exemptions. Cemetery lots are excluded from the definition, so a real estate license is not required for that sale.",
    explanation:
      "A license is required for sales of timeshares, business opportunities, and residential homes, subject to other exemptions. Cemetery lots are not real estate under Chapter 475, so that sale is the exception.",
  },
];

export const homeTeaserIds = ["10.15", "04.01", "10.22"] as const;

export const homeTeaserQuestions = homeTeaserIds.map((id) => {
  const question = sampleQuestions.find((item) => item.id === id);
  if (!question) throw new Error(`Missing teaser question ${id}`);
  return question;
});
