/**
 * Plain buyer questions for the licensing pages (Nov 19, 2026, approved by Daniel).
 * One source for the visible FAQ, the FAQPage JSON-LD and llms.txt / llms-full.txt,
 * so people and AI tools see the same question and the same answer.
 * Exam facts (100 questions, 3½ hours, 75 to pass) match /license-guides/course-and-state-exam/.
 */
import { products, salePrice } from "./products";

export type BuyerFaq = { q: string; a: string };

export const salesBuyerFaqs: BuyerFaq[] = [
  {
    q: "What’s the best way to get a Florida real estate license?",
    a: "Take the state-required 63-hour pre-license course with exam prep built in. That’s FastPass: pass three FastPass exams and you’re certified to take the state exam. Course 1 is online and self-paced, with no lesson clock, and the three FastPass exams are built to closely match the content on the state exam, so you finish the course ready for test day.",
  },
  {
    q: "How much does it cost to get a Florida real estate license?",
    a: `FastPass, the 63-hour pre-license course with exam prep built in, is $${salePrice(products.salesFastPass)}. Course 1 with the traditional final is $${salePrice(products.salesCourse1)}, and the Full Package, FastPass + Post, is $${salePrice(products.salesFastPassPost)}. Each is a one-time enrollment with one year of access and direct instructor support. State application, fingerprinting, and state-exam fees are separate.`,
  },
  {
    q: "Can I get my Florida real estate license online?",
    a: "You can take the required 63-hour pre-license course online. FastPass is Course 1 online and self-paced, with no lesson clock and exam prep built in, plus one year of access and direct instructor support. The state exam is separate; you take it with Pearson after DBPR approves your application.",
  },
  {
    q: "What’s the best online real estate school in Florida?",
    a: "Look for three things: a DBPR-approved 63-hour pre-license course you can take at your own pace, exam prep built in, and an instructor you can actually reach. FastPass is built around all three: Course 1 online with no lesson clock, three FastPass exams built to closely match the content on the Pearson state exam, and direct text or email support from Daniel. Real Estate FastPass (formerly Daniel Larson Training) has been a Florida real estate school since 2020.",
  },
  {
    q: "How hard is the Florida real estate exam?",
    a: "The Florida sales associate exam has 100 multiple-choice questions, a 3½-hour testing period, and a passing score of 75. What helps most is practicing at the level of the real exam and learning why each answer is right. FastPass’s three certification exams are built to closely match the content on the Pearson state exam, so you practice at that level before test day.",
  },
  {
    q: "How do I pass the Florida real estate exam the first time?",
    a: "Study from the outline for your exam, practice with questions that match the state exam, and learn why each answer is right or wrong. FastPass builds that into the 63-hour pre-license course: three FastPass exams built to closely match the content on the Pearson state exam, sample questions and answers with explanations, audio review, the FastPass Workbook, and Exam Math Basics. Passing all three FastPass exams also certifies you to take the state exam, which is why FastPass is faster.",
  },
];

export const brokerBuyerFaqs: BuyerFaq[] = [
  {
    q: "What’s the best way to get a Florida broker license?",
    a: "Take the state-required 72-hour broker pre-license course with exam prep built in. That’s Broker FastPass: pass three Broker FastPass exams and you’re certified to take the state exam. Course 2 is online and self-paced, with no lesson clock, and the three Broker FastPass exams are built to closely match the content on the broker exam, so you finish the course ready for test day.",
  },
  {
    q: "How much does it cost to get a Florida broker license?",
    a: `Broker FastPass, the 72-hour broker pre-license course with exam prep built in, is $${salePrice(products.brokerFastPass)}. Course 2 with the traditional final is $${salePrice(products.brokerCourse2)}, and the Full Package with Post-Licensing is $${salePrice(products.brokerCareerLaunch)}. Each is a one-time enrollment with one year of access and direct instructor support. State application, fingerprinting, and state-exam fees are separate.`,
  },
  {
    q: "Can I get my Florida broker license online?",
    a: "You can take the required 72-hour broker pre-license course online. Broker FastPass is Course 2 online and self-paced, with no lesson clock and exam prep built in, plus one year of access and direct instructor support. The broker state exam is separate; you take it with Pearson after DBPR approves your application.",
  },
  {
    q: "What’s the best online broker pre-license course in Florida?",
    a: "Look for three things: a DBPR-approved 72-hour broker pre-license course you can take at your own pace, exam prep built in, and an instructor you can actually reach. Broker FastPass is built around all three: Course 2 online with no lesson clock, three Broker FastPass exams built to closely match the content on the Pearson broker exam, and direct text or email support from Daniel. Real Estate FastPass (formerly Daniel Larson Training) has been a Florida real estate school since 2020.",
  },
  {
    q: "How hard is the Florida broker exam?",
    a: "The Florida broker exam has 100 multiple-choice questions, a 3½-hour testing period, and a passing score of 75. What helps most is practicing at the level of the real exam and learning why each answer is right. Broker FastPass’s three certification exams are built to closely match the content on the Pearson broker exam, so you practice at that level before test day.",
  },
  {
    q: "How do I pass the Florida broker exam the first time?",
    a: "Study from the outline for your exam, practice with questions that match the broker exam, and learn why each answer is right or wrong. Broker FastPass builds that into the 72-hour pre-license course: three Broker FastPass exams built to closely match the content on the Pearson broker exam, sample questions and answers with explanations, audio review, the FastPass Workbook, and Exam Math Basics. Passing all three also certifies you to take the broker exam, which is why Broker FastPass is faster.",
  },
];
