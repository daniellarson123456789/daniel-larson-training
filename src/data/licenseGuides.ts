import hub from "../content/license-guides/index.html?raw";
import sales from "../content/license-guides/how-to-get-florida-real-estate-license.html?raw";
import broker from "../content/license-guides/florida-broker-license-requirements.html?raw";
import exam from "../content/license-guides/school-certificate-and-state-exam.html?raw";
import realtor from "../content/license-guides/sales-associate-vs-realtor.html?raw";
import renewal from "../content/license-guides/post-licensing-vs-ce.html?raw";
import math from "../content/license-guides/florida-real-estate-math.html?raw";
import problems from "../content/license-guides/florida-real-estate-license-problems.html?raw";
import gettingLicensed from "../content/license-guides/getting-licensed.html?raw";
import brokerLicense from "../content/license-guides/broker-license.html?raw";
import courseAndStateExam from "../content/license-guides/course-and-state-exam.html?raw";
import continuingEducation from "../content/license-guides/continuing-education.html?raw";
import licensingCosts from "../content/license-guides/licensing-costs.html?raw";
import realtorMembershipMls from "../content/license-guides/realtor-membership-mls.html?raw";
import { addLicensingBudget } from "../lib/licensingBudget";

export const guides = [
  { slug: undefined, title: "Florida Licensing Guides", description: "Choose a Daniel Larson Training course, open your student portal, prepare for school certification, and plan your licensing or renewal steps.", markup: hub, heading: "Choose your course. Plan your next step." },
  { slug: "how-to-get-florida-real-estate-license", title: "Florida Course 1 Licensing Guide", description: "Start Course 1 at Daniel Larson Training: compare packages, access your course, plan FastPass study, and prepare your school certificate for the state exam.", markup: addLicensingBudget(sales, "sales"), heading: "Starting Florida Course 1" },
  { slug: "florida-broker-license-requirements", title: "Florida Course 2 Broker Guide", description: "Start Course 2 at Daniel Larson Training: compare broker packages, access your course, plan certification, and prepare your documents for the broker exam.", markup: addLicensingBudget(broker, "broker"), heading: "Starting Florida Course 2" },
  { slug: "school-certificate-and-state-exam", title: "School Certificate vs. Florida State Exam", description: "How school certification, DBPR exam approval, and Pearson testing work for Florida sales associate and broker candidates.", markup: exam, heading: "School certificate, DBPR approval, and the state exam" },
  { slug: "sales-associate-vs-realtor", title: "Real Estate License vs. REALTOR®", description: "A Florida sales associate license is issued by DBPR; REALTOR® refers to NAR membership. Learn the difference and the licensing steps.", markup: realtor, heading: "Sales associate and REALTOR®: what’s the difference?" },
  { slug: "post-licensing-vs-ce", title: "Florida Post-Licensing vs. 14-Hour CE", description: "Find the right Florida first-renewal Post-Licensing or later 14-hour CE requirement for sales associates and brokers.", markup: renewal, heading: "Post-Licensing or 14-Hour CE?" },
  { slug: "florida-real-estate-math", title: "Florida Real Estate Exam Math", description: "Learn Florida real estate exam math with worked examples of commission splits, profit percentages, tax prorations, and land acreage.", markup: math, heading: "Florida real estate math, explained" },
  { slug: "florida-real-estate-license-problems", title: "Florida Real Estate License Help", description: "Missed Post-Licensing or CE, an inactive license, failed final, or missing DBPR credit? Daniel Larson can help you understand your options and next steps.", markup: problems, heading: "Florida real estate license problem? We can help." },
  { slug: "getting-licensed", title: "How to Get Your Florida Real Estate License", description: "Plan your Florida sales associate license: eligibility, application, fingerprints, Course 1, the state exam, and activation.", markup: gettingLicensed, heading: "How to get your Florida real estate license." },
  { slug: "broker-license", title: "Florida Real Estate Broker License Requirements", description: "Plan the Florida broker upgrade: qualifying experience, application, Course 2, the broker exam, and first renewal.", markup: brokerLicense, heading: "Florida real estate broker license requirements." },
  { slug: "course-and-state-exam", title: "Florida Real Estate Exams: Certification and Preparation", description: "Florida real estate exams: 100 questions, 3.5 hours, 75 to pass. School certification, state-exam fees, retakes, and FastPass preparation explained.", markup: courseAndStateExam, heading: "Florida real estate exams: certification and preparation." },
  { slug: "continuing-education", title: "Florida Real Estate Continuing Education Requirements", description: "Understand Florida real estate CE after your first renewal: required subjects, the 14-hour requirement, reporting, and the separate steps to renew with DBPR.", markup: continuingEducation, heading: "Florida real estate continuing education requirements." },
  { slug: "licensing-costs", title: "What Does a Florida Real Estate License Cost?", description: "Build a Florida real estate licensing budget. Compare tuition, application, state-exam and fingerprint costs for sales associates and brokers.", markup: licensingCosts, heading: "What does a Florida real estate license cost?" },
  { slug: "realtor-membership-mls", title: "Florida License, REALTOR® Membership, and MLS Access", description: "What your license provides, what membership adds, and what to ask your broker before paying additional fees.", markup: realtorMembershipMls, heading: "Your license, REALTOR® membership, and MLS access." },
];
