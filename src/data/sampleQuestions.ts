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
      "A Florida real estate broker may fill out a purchase contract and get it signed, and may sell a business opportunity as part of authorized brokerage. When the broker is providing property management services, the broker may also keep up to $5,000 of personal or brokerage funds in a property management escrow account.\n\nWhat a broker may not do is act as a dual agent. Dual agency means representing both the buyer and the seller as a single agent in the same transaction. Dual agency is illegal in Florida and can lead to discipline by the FREC.",
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
      "A single agent represents one party in a fiduciary capacity. If the broker already has a single-agency listing, and a buyer wants that same broker to represent the buyer in buying that listed property, the broker would be a single agent for both the seller and the buyer in the same transaction.\n\nThat is dual agency. Dual agency is illegal in Florida. Disclosure alone does not make it legal, and it is not “two single agents, which is legal.” A no-brokerage relationship with the buyer would be a different arrangement, and it is not what this question describes.",
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
      "In Florida, a licensee who has no brokerage relationship with a buyer or seller still owes three duties under Florida law: dealing honestly and fairly; disclosing known facts that materially affect the value of residential real property and are not readily observable to the buyer; and accounting for all funds entrusted to the licensee.\n\nThe licensee is not required to steer buyers away, hide latent facts, or cancel the no-brokerage arrangement. The duties that are owed are honest and fair dealing, disclosure of known latent facts that materially affect residential value, and accounting for entrusted funds.",
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
      "Florida authorizes a licensee to work as a transaction broker or as a single agent, and also authorizes a no-brokerage (nonrepresentation) relationship. A licensee may not operate as a disclosed or nondisclosed dual agent.\n\nDual agency is illegal in Florida. Of the arrangements listed, a dual agent is the one that is not authorized.",
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
  {
    id: "01.03",
    question: "The government exercises which of its rights through condemnation?",
    choices: [
      { key: "A", text: "escheat" },
      { key: "B", text: "taxes and assessments" },
      { key: "C", text: "police power" },
      { key: "D", text: "eminent domain" },
    ],
    answer: "D",
    videoId: "0jcUNjkg05A",
    content:
      "The government’s rights in private property are often remembered as PETE: police power, escheat, taxation, and eminent domain. Eminent domain is the right to take private property for a public purpose, with full compensation paid to the owner.\n\nCondemnation is the proceeding that exercises that eminent-domain right. Escheat, taxation, and police power are the other rights, and they are not exercised by condemnation.",
    explanation:
      "Condemnation exercises eminent domain. Escheat, taxes and assessments, and police power are different government rights.",
  },
  {
    id: "01.09",
    question: "The government’s right to take property when the owner dies intestate and with no heirs:",
    choices: [
      { key: "A", text: "taxes" },
      { key: "B", text: "escheat" },
      { key: "C", text: "eminent domain" },
      { key: "D", text: "police power" },
    ],
    answer: "B",
    videoId: "nKr9_mdBOH4",
    content:
      "When a person dies leaving an estate and is not survived by anyone entitled to a part of it — in exam language, when the owner dies intestate and with no heirs — that part escheats to the state.\n\nEscheat is the government’s right to take that property. It is not taxation, eminent domain, or police power.",
    explanation:
      "The government’s right to take property when the owner dies intestate and with no heirs is escheat. Taxes, eminent domain, and police power are different government rights.",
  },
  {
    id: "01.20",
    question: "Which Florida law limits the amount assessed value can increase on a homestead in a given year?",
    choices: [
      { key: "A", text: "Save Our Home" },
      { key: "B", text: "Chapter 475" },
      { key: "C", text: "Chapter 455" },
      { key: "D", text: "Rules 61J2" },
    ],
    answer: "A",
    videoId: "POQqzw3l6y4",
    content:
      "Save Our Home limits how much the assessed value of a homestead can increase in a given year. After the homestead exemption is in place, annual reassessment may not raise the assessed value by more than the lower of 3 percent of the prior year’s assessed value, or the percentage change in the Consumer Price Index.\n\nChapter 475, Chapter 455, and Rules 61J2 do not limit homestead assessed-value increases.",
    explanation:
      "Save Our Home is the Florida law that limits how much the assessed value of a homestead can increase in a given year. Chapter 475, Chapter 455, and Rules 61J2 do not set that limit.",
  },
  {
    id: "01.04",
    question: "Local planning commission members are required to do which of the following, under state law?",
    choices: [
      { key: "A", text: "advise elected officials" },
      { key: "B", text: "hold professional licenses" },
      { key: "C", text: "hold elected office" },
      { key: "D", text: "hold management certifications" },
    ],
    answer: "A",
    videoId: "4tJYLFtKmMw",
    content:
      "A local planning commission, acting as the local planning agency, prepares the comprehensive plan or plan amendment and makes recommendations to the governing body. That is the requirement to advise elected officials on adoption or amendment of the plan.\n\nState law does not require planning commission members to hold a professional license, hold elected office, or hold management certifications.",
    explanation:
      "Under state law, local planning commission members are required to advise elected officials. They are not required to hold professional licenses, elected office, or management certifications.",
  },
  {
    id: "01.12",
    question: "Land-use controls, under the authority of which government right, protect the community’s integrity, health, welfare and safety?",
    choices: [
      { key: "A", text: "property taxes" },
      { key: "B", text: "escheat" },
      { key: "C", text: "eminent domain" },
      { key: "D", text: "police power" },
    ],
    answer: "D",
    videoId: "F5fb3kidz9Q",
    content:
      "Land-use controls, such as zoning and related ordinances, are an exercise of the government’s police power. That power is used to protect the community’s health, safety, and welfare.\n\nProperty taxes, escheat, and eminent domain are other government rights. They are not the source of general land-use controls.",
    explanation:
      "Land-use controls that protect the community’s integrity, health, welfare, and safety are an exercise of police power. Property taxes, escheat, and eminent domain are different government rights.",
  },
  {
    id: "01.10",
    question: "Which of the following is not a land use zone?",
    choices: [
      { key: "A", text: "commercial use zone" },
      { key: "B", text: "residential use zone" },
      { key: "C", text: "architectural use zone" },
      { key: "D", text: "mixed use zone" },
    ],
    answer: "C",
    videoId: "H7blfXxKzw4",
    content:
      "Land is classified into use categories such as residential, commercial, industrial, agricultural, and mixed use. Those are standard land-use zones.\n\nAn “architectural use zone” is not a standard land-use classification, so it is the one that is not a land use zone.",
    explanation:
      "Commercial, residential, and mixed use are standard land-use zones. An architectural use zone is not a standard land-use classification.",
  },
  {
    id: "01.08",
    question: "By what date must the property be owned in order to qualify for the homestead exemption?",
    choices: [
      { key: "A", text: "January 1st" },
      { key: "B", text: "March 1st" },
      { key: "C", text: "March 31st" },
      { key: "D", text: "September 31st" },
    ],
    answer: "A",
    videoId: "epMRncfWB5Y",
    content:
      "To qualify for the homestead exemption, the owner must have legal or beneficial title to the property on January 1 and make it a permanent residence, or the permanent residence of a legal or natural dependent.\n\nMarch 1 is the application-filing deadline, not the ownership date. March 31 and September 31st are not the ownership qualification date.",
    explanation:
      "The property must be owned on January 1 to qualify for the homestead exemption. March 1 is the application-filing deadline, not the ownership date.",
  },
  {
    id: "01.11",
    question: "Owner is allowed to continue their present use that no longer complies with zoning, without allowing for structural changes:",
    choices: [
      { key: "A", text: "nonconforming use" },
      { key: "B", text: "variance" },
      { key: "C", text: "buffer zone" },
      { key: "D", text: "setback" },
    ],
    answer: "A",
    videoId: "mns7k8Cv6b8",
    content:
      "When a legally established use no longer complies with zoning after a zoning change, the owner is commonly allowed to continue that present use as a nonconforming use, typically without a right to make structural changes.\n\nA variance is a different form of relief. A buffer zone and a setback are different zoning concepts, not the right to continue a use that no longer complies.",
    explanation:
      "The right to continue a present use that no longer complies with zoning, without structural changes, is a nonconforming use. A variance, a buffer zone, and a setback are different concepts.",
  },
  {
    id: "01.16",
    question: "A military facility is:",
    choices: [
      { key: "A", text: "immune" },
      { key: "B", text: "exempt" },
      { key: "C", text: "a homestead" },
      { key: "D", text: "privately owned" },
    ],
    answer: "A",
    videoId: "R-GUEfO_IC4",
    content:
      "On the Florida exam, government-owned property is labeled “immune.” A military facility is federal government property and is not on the tax roll.\n\nQualifying private or nonprofit property may be “exempt.” A military facility is not a homestead and is not privately owned.",
    explanation:
      "A military facility is immune. Exempt refers to qualifying private or nonprofit property. It is not a homestead and is not privately owned.",
  },
  {
    id: "01.28",
    question: "The distance a zoning ordinance requires between the property line and the improvements is called:",
    choices: [
      { key: "A", text: "a buffer zone" },
      { key: "B", text: "a special use zone" },
      { key: "C", text: "a setback" },
      { key: "D", text: "an encumbrance" },
    ],
    answer: "C",
    videoId: "k_L6aFkd3dw",
    content:
      "A setback is the required minimum distance from a property line to an improvement, set by a zoning ordinance.\n\nA buffer zone is different: it separates different land-use zones. A special use zone and an encumbrance are not the name for that required distance.",
    explanation:
      "The required distance between the property line and the improvements is a setback. A buffer zone separates different land-use zones, and a special use zone or an encumbrance is not that distance.",
  },
  {
    id: "01.02",
    question: "Local zoning restrictions are called:",
    choices: [
      { key: "A", text: "deed restrictions" },
      { key: "B", text: "statutes" },
      { key: "C", text: "restrictive covenants" },
      { key: "D", text: "ordinances" },
    ],
    answer: "D",
    videoId: "uby9aGDVbWs",
    content:
      "Local zoning restrictions are set by ordinances. An ordinance is a law passed by a city or county government, and zoning is one of the ways local governments use their police power to control land use.\n\nDeed restrictions and restrictive covenants are private limits written into a deed or recorded by a developer. Statutes are laws passed by the state legislature, not by a local government.",
    explanation:
      "Local zoning restrictions are called ordinances. Deed restrictions and restrictive covenants are private limits, and statutes are state laws.",
  },
  {
    id: "01.30",
    question: "The local planning commission or board members are required to hold which professional license?",
    choices: [
      { key: "A", text: "Real estate broker" },
      { key: "B", text: "CAM" },
      { key: "C", text: "No professional license is required" },
      { key: "D", text: "General contractor" },
    ],
    answer: "C",
    videoId: "PAViV9sa6vI",
    content:
      "Members of a local planning commission or board are not required to hold any professional license. They are typically appointed to advise the local governing body, and a real estate license, a CAM license, or a contractor license is not a requirement for serving.",
    explanation:
      "No professional license is required to serve on a local planning commission or board. A real estate broker license, a CAM license, and a general contractor license are not requirements.",
  },
  {
    id: "01.17",
    question: "A church facility is:",
    choices: [
      { key: "A", text: "immune" },
      { key: "B", text: "exempt" },
      { key: "C", text: "a homestead" },
      { key: "D", text: "residential" },
    ],
    answer: "B",
    videoId: "33MkTpLVXD0",
    content:
      "On the Florida exam, government-owned property is labeled “immune.” Qualifying nonprofit property, such as a church facility, is labeled “exempt” from property taxes.\n\nA church facility is not government property, so it is not immune. It is not a homestead, which is an owner-occupied residence, and it is not residential.",
    explanation:
      "A church facility is exempt. Immune refers to government-owned property. A church facility is not a homestead and is not residential.",
  },
  {
    id: "01.15",
    question: "When taxes are unpaid, the government raises money by auctioning off a:",
    choices: [
      { key: "A", text: "quit claim deed" },
      { key: "B", text: "sheriff's deed" },
      { key: "C", text: "tax deed" },
      { key: "D", text: "property tax certificate" },
    ],
    answer: "D",
    videoId: "LIJBmUPr3_U",
    content:
      "When property taxes go unpaid, the county sells a tax certificate at auction. The certificate is a lien against the property for the unpaid taxes, and the investor who buys it earns interest. If the owner does not pay what is owed, the certificate holder can later apply for a tax deed.\n\nThe item auctioned off to raise the money is the tax certificate, not a deed. A quit claim deed and a sheriff’s deed are not what the county auctions for unpaid taxes, and a tax deed comes later.",
    explanation:
      "The government raises money by auctioning a property tax certificate. A tax deed can follow later if the certificate is not redeemed, but the certificate is what is auctioned.",
  },
  {
    id: "01.07",
    question: "Which of the following is true of special assessments?",
    choices: [
      { key: "A", text: "they are charged only to benefitting owners" },
      { key: "B", text: "they are charged to the entire municipality" },
      { key: "C", text: "they are charged on all property’s in the state" },
      { key: "D", text: "they are charged only on homesteads" },
    ],
    answer: "A",
    videoId: "JnRrqyEgcmU",
    content:
      "A special assessment pays for a specific local improvement, such as a sidewalk, a sewer line, or street paving. It is charged only to the owners whose property benefits from the improvement.\n\nIt is not charged to the entire municipality, not to all property in the state, and not only to homesteads.",
    explanation:
      "Special assessments are charged only to benefitting owners. They are not charged to the entire municipality, to all property in the state, or only to homesteads.",
  },
  {
    id: "01.14",
    question: "A new owner who buys a residence before January 1st 2019, has until what date to file for homestead exemption?",
    choices: [
      { key: "A", text: "January 1st, 2019" },
      { key: "B", text: "March 1st, 2019" },
      { key: "C", text: "March 31st, 2020" },
      { key: "D", text: "September 30th, 2020" },
    ],
    answer: "B",
    videoId: "TVRdkosiJJ0",
    content:
      "A new owner who buys and moves into a residence before January 1 must file the homestead exemption application by March 1 of that year. Here the owner bought before January 1, 2019, so the deadline was March 1, 2019.\n\nThe other dates do not match the filing deadline for that tax year.",
    explanation:
      "The deadline to file for homestead exemption is March 1 of the tax year. For a purchase before January 1, 2019, that date is March 1, 2019.",
  },
  {
    id: "11.03",
    question: "The 1968 fair housing act applies to:",
    choices: [
      { key: "A", text: "single-family homes listed with a broker" },
      { key: "B", text: "commercial lease" },
      { key: "C", text: "commercial sale" },
      { key: "D", text: "commercial option" },
    ],
    answer: "A",
    videoId: "tMs67NjdcAQ",
    content:
      "The federal fair housing law has some exemptions for owners who sell or rent on their own, such as certain single-family homes sold without a broker. Those exemptions go away once a licensed broker is used.\n\nSo a single-family home listed with a broker is covered by the Act. The other choices are commercial transactions, and the question is about the housing law, which is about residential property.",
    explanation:
      "Owner-only sales of certain single-family homes can be exempt, but not when a broker lists the property. A single-family home listed with a broker is covered.",
  },
  {
    id: "11.05",
    question: "The 1988 amendment the Fair Housing Act bars discrimination based on:",
    choices: [
      { key: "A", text: "public assistance" },
      { key: "B", text: "age" },
      { key: "C", text: "familial status and handicap" },
      { key: "D", text: "marital status" },
    ],
    answer: "C",
    videoId: "cweTSSZL9Rg",
    content:
      "The original fair housing law of 1968 protected race, color, religion, and national origin. Sex was added later, and the 1988 amendment added two more protected classes: familial status and handicap (disability).\n\nFamilial status protects families with children under 18, and handicap protects people with a disability. Age, public assistance, and marital status are not among the federally protected classes.",
    explanation:
      "The 1988 amendment added familial status and handicap. Age, public assistance, and marital status are not federal protected classes.",
  },
  {
    id: "11.07",
    question: "Broker says, “Stay out of this Hispanic neighborhood.” Which is true?",
    choices: [
      { key: "A", text: "this is legal salesmanship" },
      { key: "B", text: "this is blockbusting" },
      { key: "C", text: "this is steering" },
      { key: "D", text: "this is redlining" },
    ],
    answer: "C",
    videoId: "vQ0g263wlIc",
    content:
      "Steering means channeling home seekers toward or away from a neighborhood based on a protected class. It can come from what a licensee says, such as telling someone they would not fit in over there, or from simply going along with what a client asks for.\n\nA broker telling a buyer to stay out of a neighborhood because of its ethnic makeup is steering. It is not legal salesmanship, blockbusting, or redlining.",
    explanation:
      "Telling a buyer to stay out of a neighborhood because of who lives there steers them away based on a protected class. That is steering.",
  },
  {
    id: "11.09",
    question: "Lender says, “No loans in this neighborhood. It’s too Hispanic.” Which is true?",
    choices: [
      { key: "A", text: "this is legal salesmanship" },
      { key: "B", text: "this is blockbusting" },
      { key: "C", text: "this is steering" },
      { key: "D", text: "this is redlining" },
    ],
    answer: "D",
    videoId: "weJAphL03gc",
    content:
      "Redlining is refusing to make loans in certain neighborhoods because of who lives there. The name comes from the practice of drawing lines around areas on a map and denying loans inside them.\n\nA lender who says no loans will be made in a neighborhood because of its ethnic makeup is redlining. Steering is directing buyers, and blockbusting is pressuring owners to sell, so neither fits a lender refusing to lend.",
    explanation:
      "Refusing to issue loans in a neighborhood because of who lives there is redlining. It is not legal salesmanship, blockbusting, or steering.",
  },
  {
    id: "11.12",
    question: "Broker says, “This new integration will damage your value. You had better sell now.” Which is true?",
    choices: [
      { key: "A", text: "this is legal salesmanship" },
      { key: "B", text: "this is blockbusting" },
      { key: "C", text: "this is steering" },
      { key: "D", text: "this is redlining" },
    ],
    answer: "B",
    videoId: "JxWIzSCDFus",
    content:
      "Blockbusting, also called panic selling, means using the arrival or rumored arrival of a protected class in a neighborhood to persuade owners to sell. The pitch is usually that values will drop, so owners had better sell now.\n\nA broker who tells owners that integration will damage their value and that they had better sell now is blockbusting. This is illegal, and it is different from steering buyers or redlining by a lender.",
    explanation:
      "Using the entry of a protected class into a neighborhood to push owners to sell is blockbusting, also called panic selling.",
  },
  {
    id: "03.37",
    question: "When does title transfer?",
    choices: [
      { key: "A", text: "when the seller signs the deed" },
      { key: "B", text: "when the tenant signs the lease" },
      { key: "C", text: "when the deed is delivered and accepted" },
      { key: "D", text: "when the deed is recorded" },
    ],
    answer: "C",
    videoId: "xEnVjbSmBrk",
    content:
      "A deed is complete when the grantor signs it, delivers it, and the grantee accepts it. Title transfers at delivery and acceptance.\n\nSigning alone is not enough, because the deed must also be delivered. Recording the deed does not move title either. Recording gives notice to the public, which is a separate step. A lease signed by a tenant has nothing to do with transferring title.",
    explanation:
      "Title passes when the deed is delivered to and accepted by the grantee. Signing by itself is not enough, and recording gives public notice rather than transferring title.",
  },
  {
    id: "04.06",
    question: "Which of the following best provides for constructive notice?",
    choices: [
      { key: "A", text: "recordation" },
      { key: "B", text: "insurance" },
      { key: "C", text: "destruction of improvements" },
      { key: "D", text: "delivery and acceptance" },
    ],
    answer: "A",
    videoId: "GUsdFTvS5SM",
    content:
      "Notice is about who is treated as knowing about an interest in a property. Constructive notice, also called legal notice, comes from recording the document in the county public records. Once it is recorded, the interest is known or knowable to the public, whether or not anyone actually looked.\n\nActual notice is different, because it means a person really knows. Insurance, destruction of improvements, and delivery and acceptance do not provide constructive notice.",
    explanation:
      "Recording a document in the public records provides constructive notice, because the interest is then knowable by anyone.",
  },
  {
    id: "11.04",
    question: "Which is not protected under discrimination law?",
    choices: [
      { key: "A", text: "race" },
      { key: "B", text: "age" },
      { key: "C", text: "religion" },
      { key: "D", text: "color" },
    ],
    answer: "B",
    videoId: "O7zMeN4hfFQ",
    content:
      "The federal fair housing law protects race, color, religion, sex, national origin, familial status, and handicap (disability). Treating someone differently in housing because of one of those classes is discrimination.\n\nOf the choices, race, religion, and color are all on that list. Age is not a federally protected class, so it is the one that is not protected.",
    explanation:
      "Race, color, and religion are protected classes under the federal fair housing law. Age is not on the list, so age is the answer.",
  },
  {
    id: "11.10",
    question: "African-American buyer requests to see property in an all African-American area. What should broker do?",
    choices: [
      { key: "A", text: "assume the buyer is interested in the number of bed and bath, and likes the design" },
      { key: "B", text: "accuse the buyer of steering" },
      { key: "C", text: "refuse to show the property" },
      { key: "D", text: "turn the buyer into the DBPR" },
    ],
    answer: "A",
    videoId: "TNvRchGf0OE",
    content:
      "Steering is channeling home seekers toward or away from an area because of a protected class. A licensee should not choose neighborhoods for a buyer, and should not refuse a buyer’s request because of the buyer’s race or the makeup of the area.\n\nWhen a buyer asks to see homes in a particular area, the broker follows the buyer’s request and shows those properties, without assuming anything about the buyer or lecturing about the neighborhood. Refusing to show the property, or accusing the buyer of steering, would be the wrong response.",
    explanation:
      "The buyer made the request, so the broker shows the properties and treats the buyer like any other buyer. Refusing, accusing the buyer of steering, or reporting the buyer are not appropriate responses.",
  },
  {
    id: "03.43",
    question: "Ownership recognized by the courts after 7 years of open, actual, continuous, notorious, and hostile possession of property belonging to another:",
    choices: [
      { key: "A", text: "adverse possession" },
      { key: "B", text: "easement by prescription" },
      { key: "C", text: "encroachment" },
      { key: "D", text: "land-use license" },
    ],
    answer: "A",
    videoId: "V0rMyNFG30A",
    content:
      "Adverse possession is a way to gain title to someone else’s land by possessing it. In Florida the possession must be open, actual, continuous, notorious, and hostile for 7 years, and the courts then recognize the possessor as the owner.\n\nAn easement by prescription gives only a right to use land, not ownership. An encroachment is a structure that extends onto a neighbor’s land, and a land-use license is only permission. The choice that describes ownership is adverse possession.",
    explanation:
      "Ownership recognized by the courts after 7 years of open, actual, continuous, notorious, and hostile possession is adverse possession. An easement by prescription is only a right of use, not ownership.",
  },
  {
    id: "04.05",
    question: "The grantor cannot provide an updated abstract as evidence of marketable. What is the best solution?",
    choices: [
      { key: "A", text: "homeowner's insurance" },
      { key: "B", text: "an attorney's opinion" },
      { key: "C", text: "grantor should purchase the grantee a title insurance policy" },
      { key: "D", text: "do not sell the property" },
    ],
    answer: "C",
    videoId: "1wklzSwYulU",
    content:
      "An abstract of title is the history of the recorded documents affecting a property, and it is used as evidence that the title is marketable. If the grantor cannot provide an updated abstract, the buyer needs another way to be protected.\n\nThe best solution among the choices is for the grantor to purchase a title insurance policy for the grantee. Title insurance protects the grantee against covered title problems. Homeowner’s insurance does not insure title, and simply not selling the property does not solve the problem.",
    explanation:
      "When an updated abstract is not available, the grantor purchasing a title insurance policy for the grantee gives the buyer protection for covered title problems. Homeowner’s insurance does not cover title.",
  },
  {
    id: "04.18",
    question: "If licensee is asked about merchantability of title, they must:",
    choices: [
      { key: "A", text: "provide names of suitable lawyers" },
      { key: "B", text: "provide insurance quotes" },
      { key: "C", text: "venture and opinion" },
      { key: "D", text: "advise the buyer to consult an attorney for an opinion or purchase title insurance" },
    ],
    answer: "D",
    videoId: "hoZ4URixgYM",
    content:
      "Marketable title is title a reasonable buyer would accept, free from reasonable doubt. Whether a particular title is marketable is a legal question, and a real estate licensee is not the one to answer it.\n\nA licensee who is asked about it should advise the buyer to consult an attorney for an opinion or to purchase title insurance. The licensee should not venture an opinion.",
    explanation:
      "A licensee should not give an opinion on the quality of title. The correct response is to advise the buyer to consult an attorney for an opinion or purchase title insurance.",
  },
  {
    id: "03.55",
    question: "Which clause names the type of estate?",
    choices: [
      { key: "A", text: "habendum" },
      { key: "B", text: "seizin" },
      { key: "C", text: "hypothecation" },
      { key: "D", text: "warranty forever" },
    ],
    answer: "A",
    videoId: "7yBKEhvkisg",
    content:
      "A deed has several parts. The habendum clause, often introduced by the words “to have and to hold,” names the type of estate being conveyed, such as fee simple.\n\nThe other choices are not the clause that names the estate. Seizin is the possession or ownership of the estate, and hypothecation is pledging property as security for a debt without giving up possession. The warranty clause is where the grantor makes promises about the title.",
    explanation:
      "The habendum clause names the type of estate being conveyed. Seizin, hypothecation, and the warranty clause serve different purposes.",
  },
  {
    id: "03.36",
    question: "Which deed is best for the grantee?",
    choices: [
      { key: "A", text: "warranty" },
      { key: "B", text: "special" },
      { key: "C", text: "quit claim" },
      { key: "D", text: "certificate of sale" },
    ],
    answer: "A",
    videoId: "hpMcfdhCBeA",
    content:
      "Deeds differ in how much protection the grantor promises the grantee. A warranty deed gives the most: the grantor promises that the title is good and will defend it against claims.\n\nA special warranty deed promises only against problems arising during the grantor’s own ownership. A quitclaim deed passes whatever interest the grantor has, if any, with no promises. A certificate of sale is not a deed that protects the grantee. The warranty deed is best for the grantee.",
    explanation:
      "The warranty deed gives the grantee the most protection. A special warranty deed covers less, and a quitclaim deed makes no promises about the title.",
  },
  {
    id: "01.18",
    question: "Which of the following unpaid creditors would be allowed to force the sale of a homestead?",
    choices: [
      { key: "A", text: "hospital" },
      { key: "B", text: "credit card company" },
      { key: "C", text: "mortgage lien holder" },
      { key: "D", text: "civil suit judgement holder" },
    ],
    answer: "C",
    videoId: "NWQgNyC666M",
    content:
      "Florida homestead is protected from forced sale by most general creditors. A creditor with only a general claim, such as a hospital, a credit card company, or someone holding a civil suit judgment, cannot force the sale of the homestead.\n\nThe exceptions are specific obligations tied to the property itself, such as the mortgage used to buy or improve it, and unpaid taxes and assessments. The mortgage lien holder is the creditor who can force the sale.",
    explanation:
      "A mortgage lien holder has a specific claim against the property and can force its sale. General creditors such as a hospital, a credit card company, or a civil judgment holder cannot force the sale of a homestead.",
  },
  {
    id: "03.30",
    question: "Property was purchased, but provided no access. Seller owned the adjoining property, and buyer had the right to cross. This is a(n):",
    choices: [
      { key: "A", text: "easement by necessity" },
      { key: "B", text: "easement by prescription" },
      { key: "C", text: "encroachment" },
      { key: "D", text: "deed restriction" },
    ],
    answer: "A",
    videoId: "2RztWdIY2LU",
    content:
      "An easement by necessity arises when a parcel is sold with no access to a public road, and the seller still owns the surrounding land. The buyer is given the right to cross the seller’s adjoining property to get in and out.\n\nIt is not an easement by prescription, which comes from long-term use. An encroachment is a structure that crosses onto a neighbor’s land, and a deed restriction limits how the property may be used.",
    explanation:
      "A buyer who has no access and a right to cross the seller’s adjoining land has an easement by necessity. Prescription comes from long use, an encroachment is a physical intrusion, and a deed restriction limits use.",
  },
  {
    id: "03.32",
    question: "A water utility easement to cross several properties is a(n):",
    choices: [
      { key: "A", text: "easement in gross" },
      { key: "B", text: "easement by necessity" },
      { key: "C", text: "easement appurtenant" },
      { key: "D", text: "easement by prescription" },
    ],
    answer: "A",
    videoId: "BrkHdpknagA",
    content:
      "An easement in gross belongs to a person or company, not to a neighboring piece of land. A water utility easement is the classic example: the utility has the right to cross several properties, but it does not own a parcel that benefits from the easement.\n\nAn easement appurtenant, by contrast, benefits a neighboring parcel and passes with that land. Necessity and prescription describe how an easement is created, not this kind of utility right.",
    explanation:
      "A utility easement that crosses several properties is an easement in gross, because it benefits the utility and not a neighboring parcel. An appurtenant easement benefits adjoining land.",
  },
  {
    id: "03.52",
    question: "Deed used to transfer ownership when owner is declared incompetent:",
    choices: [
      { key: "A", text: "committee's" },
      { key: "B", text: "representative's" },
      { key: "C", text: "certificate of title" },
      { key: "D", text: "guardian's" },
    ],
    answer: "A",
    videoId: "7DGzD6KQsUI",
    content:
      "A deed is only valid when the person signing has legal capacity. An owner who has been declared incompetent cannot sign a deed on their own, so the conveyance has to go through a court-supervised process.\n\nThe deed used in that situation is the committee’s deed, according to the exam-prep term used in this course. The court requirements must be met before the property can be transferred.",
    explanation:
      "A committee’s deed is the deed used to transfer property when the owner has been declared incompetent. The transfer requires a court-supervised process because the owner cannot sign on their own.",
  },
  {
    id: "03.53",
    question: "The deed used to convey the interests of a minor:",
    choices: [
      { key: "A", text: "committee's" },
      { key: "B", text: "representative's" },
      { key: "C", text: "certificate of title" },
      { key: "D", text: "guardian's" },
    ],
    answer: "D",
    videoId: "S7kEEfLbBhI",
    content:
      "A person must be 18, sane, and sober to have the capacity to sign a deed. A minor is missing the first of those, so someone else has to act for the minor.\n\nThe deed used to convey a minor’s interest is the guardian’s deed. A committee’s deed is for an owner declared incompetent, and a representative’s deed is for an estate.",
    explanation:
      "A guardian’s deed conveys the interests of a minor. A committee’s deed is used for an owner declared incompetent.",
  },
];

// Topic filters on /sample-questions/. Keys and labels match the YouTube topic playlists
// (/workspace/course1-library/youtube-format/playlists.json). Routing follows the playlists:
// exam subject 4 -> brokerage, 2/3 -> license-law, 7 -> fair-housing, 9 -> titles-deeds,
// 18 -> property-taxes-homestead, 19 -> planning-zoning; 04.01 / 04.02 -> investment-depreciation.
// When adding a new card, add its ID here too. An unmapped ID still shows under "All".
export type SampleTopicKey =
  | "brokerage"
  | "license-law"
  | "fair-housing"
  | "investment-depreciation"
  | "property-taxes-homestead"
  | "planning-zoning"
  | "titles-deeds";

export const sampleTopics: { key: SampleTopicKey; label: string }[] = [
  { key: "brokerage", label: "Brokerage Relationships" },
  { key: "license-law", label: "License Law" },
  { key: "planning-zoning", label: "Planning and Zoning" },
  { key: "property-taxes-homestead", label: "Property Taxes and Homestead" },
  { key: "titles-deeds", label: "Titles and Deeds" },
  { key: "investment-depreciation", label: "Investment and Depreciation" },
  { key: "fair-housing", label: "Fair Housing" },
];

export const sampleTopicById: Record<string, SampleTopicKey> = {
  "10.04": "brokerage",
  "10.07": "brokerage",
  "10.12": "brokerage",
  "10.15": "brokerage",
  "10.16": "brokerage",
  "10.19": "brokerage",
  "10.20": "brokerage",
  "10.22": "brokerage",
  "10.24": "brokerage",
  "10.26": "brokerage",
  "10.30": "brokerage",
  "12.49": "brokerage",
  "11.44": "license-law",
  "11.45": "license-law",
  "11.46": "license-law",
  "12.54": "license-law",
  "12.56": "license-law",
  "11.01": "fair-housing",
  "04.01": "investment-depreciation",
  "04.02": "investment-depreciation",
  "01.08": "property-taxes-homestead",
  "01.16": "property-taxes-homestead",
  "01.20": "property-taxes-homestead",
  "01.04": "planning-zoning",
  "01.10": "planning-zoning",
  "01.11": "planning-zoning",
  "01.12": "planning-zoning",
  "01.28": "planning-zoning",
  "01.03": "titles-deeds",
  "01.09": "titles-deeds",
  "01.02": "planning-zoning",
  "01.30": "planning-zoning",
  "01.17": "property-taxes-homestead",
  "01.15": "property-taxes-homestead",
  "01.07": "property-taxes-homestead",
  "01.14": "property-taxes-homestead",
  "11.03": "fair-housing",
  "11.05": "fair-housing",
  "11.07": "fair-housing",
  "11.09": "fair-housing",
  "11.12": "fair-housing",
  "03.37": "titles-deeds",
  "04.06": "titles-deeds",
  "11.04": "fair-housing",
  "11.10": "fair-housing",
  "03.43": "titles-deeds",
  "04.05": "titles-deeds",
  "04.18": "titles-deeds",
  "03.55": "titles-deeds",
  "03.36": "titles-deeds",
  "01.18": "property-taxes-homestead",
  "03.30": "titles-deeds",
  "03.32": "titles-deeds",
  "03.52": "titles-deeds",
  "03.53": "titles-deeds",
};

export const sampleTopicFor = (id: string): SampleTopicKey | undefined => sampleTopicById[id];

/** Deep-link anchor for a card, e.g. "10.15" -> "q-10-15". */
export const sampleAnchorFor = (id: string): string => `q-${id.replace(/\./g, "-")}`;

export const homeTeaserIds = ["10.15", "04.01", "10.22"] as const;

export const homeTeaserQuestions = homeTeaserIds.map((id) => {
  const question = sampleQuestions.find((item) => item.id === id);
  if (!question) throw new Error(`Missing teaser question ${id}`);
  return question;
});
