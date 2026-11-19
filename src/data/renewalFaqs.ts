/**
 * Plain buyer questions for Post-Licensing and 14-hour CE (Nov 19, 2026).
 * Lead questions follow real search phrasing ("fastest way to finish", "final exam", "online"); see
 * search-research-2026-11-19.md.
 * One source for the visible FAQ, the FAQPage JSON-LD and llms.txt / llms-full.txt,
 * so people and AI tools see the same question and the same answer.
 * Deadlines checked against DBPR (MyFloridaLicense.com) on Nov 19, 2026:
 * - FREC Licensure Information page (Post before the initial expiration date; 14 hours of CE after)
 * - DBPR Real Estate Education Requirements PDF (first renewal period 18-24 months; then 24 months;
 *   3 Core Law + 3 Ethics and Business Practices + 8 specialty; classroom or distance education)
 * - DBPR Renewal Information notices (March 31 / September 30 expirations; null and void if Post
 *   is missed; $25 late fee)
 * - DBPR answers a_id 1976 and 711 (missed CE: involuntary inactive, 12 months, 28-hour reactivation,
 *   null and void after 24 months)
 */
import { products, salePrice } from "./products";

export type RenewalFaq = { q: string; a: string };

const salesPost = salePrice(products.salesPost);
const brokerPost = salePrice(products.brokerPost);
const ce = salePrice(products.ce14);

export const postFaqs: RenewalFaq[] = [
  {
    q: "What’s the fastest way to finish Florida Post-Licensing?",
    a: `Take it online with FastPass. It’s self-paced with no page timers, so if you already know the material you can move fast, then take the final exam when you’re ready. Both courses are online: the 45-hour Sales Post is $${salesPost} and the 60-hour Broker Post is $${brokerPost}. Each includes section PDFs, narrated lessons, review questions, the FastPass final exam, and DBPR completion reporting within 1 business day after you pass.`,
  },
  {
    q: "I already know this. How fast can I get to the final exam?",
    a: "As fast as you’re ready. FastPass Post-Licensing is self-paced, with no timed videos, lesson clock, or page timers, so you move through each section’s review at your own speed and take the included FastPass final exam when you’re ready. The full course is there if you want a refresher, and after you pass, we report your completion to DBPR.",
  },
  {
    q: "Can I take Florida Post-Licensing online?",
    a: `Yes. Florida allows Post-Licensing online, and FastPass offers both courses online and self-paced: 45 hours for sales associates and 60 hours for brokers. The 45-hour Sales Post is $${salesPost} and the 60-hour Broker Post is $${brokerPost}. Each includes section PDFs, narrated lessons, review questions, the FastPass final exam, and DBPR completion reporting.`,
  },
  {
    q: "When is Florida Post-Licensing due?",
    a: "Before the first expiration date on your license. Florida real estate licenses expire on March 31 or September 30, and your first expiration comes 18 to 24 months after you’re licensed. Your exact date is in your DBPR account at MyFloridaLicense.com. After that first renewal, you take 14-hour CE every two years instead.",
  },
  {
    q: "What happens if I miss the Florida Post-Licensing deadline?",
    a: "Your license becomes null and void. It doesn’t go inactive, and taking the course late won’t bring it back. A sales associate has to take Course 1 again and pass the state exam again. If your date is coming up, finish Post-Licensing now. If it has already passed, contact us and we’ll walk you through your options.",
  },
  {
    q: "How much does Florida Post-Licensing cost?",
    a: `The 45-hour Sales Associate Post-Licensing course is $${salesPost}, and the 60-hour Broker Post-Licensing course is $${brokerPost}. Each is a one-time enrollment that includes the course materials, the FastPass final exam, and DBPR completion reporting. The state license renewal fee is separate and paid to DBPR.`,
  },
  {
    q: "How long does Florida Post-Licensing take?",
    a: "The state sets the course at 45 hours for sales associates and 60 hours for brokers, but FastPass doesn’t make you sit through a clock. There are no timed videos or page timers. Review what you want at your own pace, then take the included FastPass final exam when you’re ready. If you already know the material, that’s why it can take far less time than sitting through every hour.",
  },
  {
    q: "Can I take Post-Licensing before I am licensed?",
    a: "No. Post-Licensing can only be completed after you are licensed. It is required before your first renewal. You can enroll now so the course is ready when you need it, but you complete the course after licensure.",
  },
  {
    q: "How is completion reported to DBPR?",
    a: "Your licensed name and license number are collected before the final exam. After you pass, completion reporting to DBPR is automated and handled within 1 business day, guaranteed. You complete and pay for your separate license renewal through MyFloridaLicense.com.",
  },
];

export const ceFaqs: RenewalFaq[] = [
  {
    q: "What’s the fastest way to finish Florida 14-hour CE?",
    a: `Take it online with FastPass. It’s self-paced with no page timers, so if you already know the material you can move fast, then take the final exam when you’re ready. The course covers all 14 hours Florida requires (3 hours Core Law, 3 hours Ethics and Business Practices, and 8 hours specialty education) for $${ce}, and after you pass, we report your completion to DBPR within 1 business day.`,
  },
  {
    q: "How do I renew my Florida real estate license?",
    a: `Complete 14 hours of continuing education, then renew and pay the renewal fee in your DBPR account at MyFloridaLicense.com before your expiration date. That’s every renewal after your first; the first one needs Post-Licensing instead. FastPass 14-Hour CE is online and self-paced for $${ce}, and after you pass, we report your completion to DBPR.`,
  },
  {
    q: "When is my Florida real estate license renewal due?",
    a: "On the expiration date shown on your license and in your DBPR account. Florida real estate licenses expire on March 31 or September 30, and after your first renewal they renew every two years. DBPR sends a renewal notice before your expiration date. If you renew after that date, DBPR adds a late fee.",
  },
  {
    q: "What does Florida 14-hour CE include?",
    a: "3 hours of Core Law, 3 hours of Ethics and Business Practices, and 8 hours of specialty education. The FastPass 14-Hour CE course covers all 14 hours in one course.",
  },
  {
    q: "Can I take Florida real estate CE online?",
    a: "Yes. Florida allows continuing education online. FastPass 14-Hour CE is online and self-paced, with downloadable section PDFs, audio-guided lessons, review questions, and the FastPass final exam.",
  },
  {
    q: "How much does Florida 14-hour CE cost?",
    a: `$${ce} for the complete 14-hour CE course with the FastPass final exam, downloadable section PDFs, audio-guided lessons, review questions, and DBPR completion reporting. This is a one-time enrollment. The state license renewal fee is separate and paid through DBPR.`,
  },
  {
    q: "What happens if I miss my Florida CE deadline?",
    a: "Your license goes involuntary inactive, and you can’t practice until it’s current again. You have up to 12 months after your expiration date to finish the 14 hours and pay the renewal fee plus the late fee. After 12 months, DBPR requires a 28-hour reactivation course instead, and after 24 months the license goes null and void.",
  },
  {
    q: "Do I need 14-hour CE for my first renewal?",
    a: "No. Your first renewal needs Post-Licensing: 45 hours for sales associates and 60 hours for brokers. 14-hour CE starts with the renewal after that.",
  },
  {
    q: "I already know this. How fast can I get to the CE final exam?",
    a: "As fast as you’re ready. FastPass 14-Hour CE is self-paced, with no timed videos, lesson clock, or page timers, so you move through each section’s review at your own speed and take the included FastPass final exam when you’re ready. The section PDFs, audio-guided lessons, and review questions are there for anything you want to brush up on, and after you pass, we report your completion to DBPR.",
  },
  {
    q: "How is completion reported to DBPR?",
    a: "Your licensed name and license number are collected before the final exam. After you pass, Real Estate FastPass reports your completion to DBPR automatically within 1 business day, guaranteed. You still complete your separate license renewal and pay the state renewal fee through MyFloridaLicense.com.",
  },
];
