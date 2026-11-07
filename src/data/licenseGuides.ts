import hub from "../content/license-guides/index.html?raw";
import sales from "../content/license-guides/how-to-get-florida-real-estate-license.html?raw";
import broker from "../content/license-guides/florida-broker-license-requirements.html?raw";
import exam from "../content/license-guides/school-certificate-and-state-exam.html?raw";
import realtor from "../content/license-guides/sales-associate-vs-realtor.html?raw";
import renewal from "../content/license-guides/post-licensing-vs-ce.html?raw";
import math from "../content/license-guides/florida-real-estate-math.html?raw";
import problems from "../content/license-guides/florida-real-estate-license-problems.html?raw";
import { addLicensingBudget } from "../lib/licensingBudget";

export const guides = [
  { slug: undefined, title: "Florida Real Estate Course and Student Resources", description: "Choose a Daniel Larson Training course, open your student portal, prepare for school certification, and plan your licensing or renewal steps.", markup: hub, heading: "Choose your course. Plan your next step." },
  { slug: "how-to-get-florida-real-estate-license", title: "Florida Sales Licensing: Course 1 Student Roadmap", description: "Start Course 1 at Daniel Larson Training: compare packages, access your course, plan FastPass study, and prepare your school certificate for the state exam.", markup: addLicensingBudget(sales, "sales"), heading: "Starting Florida Course 1" },
  { slug: "florida-broker-license-requirements", title: "Florida Broker Licensing: Course 2 Student Roadmap", description: "Start Course 2 at Daniel Larson Training: compare broker packages, access your course, plan certification, and prepare your documents for the broker exam.", markup: addLicensingBudget(broker, "broker"), heading: "Starting Florida Course 2" },
  { slug: "school-certificate-and-state-exam", title: "School Certificate vs. Florida State Exam", description: "How school certification, DBPR exam approval, and Pearson testing work for Florida sales associate and broker candidates.", markup: exam, heading: "School certificate, DBPR approval, and the state exam" },
  { slug: "sales-associate-vs-realtor", title: "Florida Sales Associate License vs. REALTOR®", description: "A Florida sales associate license is issued by DBPR; REALTOR® refers to NAR membership. Learn the difference and the licensing steps.", markup: realtor, heading: "Sales associate and REALTOR®: what’s the difference?" },
  { slug: "post-licensing-vs-ce", title: "Florida Post-Licensing vs. 14-Hour CE", description: "Find the right Florida first-renewal Post-Licensing or later 14-hour CE requirement for sales associates and brokers.", markup: renewal, heading: "Post-Licensing or 14-Hour CE?" },
  { slug: "florida-real-estate-math", title: "Florida Real Estate Math: Commissions, Profit, Prorations, and Land", description: "Learn Florida real estate exam math with worked examples of commission splits, profit percentages, tax prorations, and land acreage.", markup: math, heading: "Florida real estate math, explained" },
  { slug: "florida-real-estate-license-problems", title: "Florida Real Estate License Problems? Get Help", description: "Missed Post-Licensing or CE, an inactive license, failed final, or missing DBPR credit? Daniel Larson can help you understand your options and next steps.", markup: problems, heading: "Florida real estate license problem? We can help." },
];
