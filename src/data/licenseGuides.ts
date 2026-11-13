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
import { addGuideSignup } from "../lib/guideSignup";

export const guides = [
  { slug: undefined, title: "Florida Licensing Guides", description: "Choose a Daniel Larson Training course, open your student portal, prepare for school certification, and plan your licensing or renewal steps.", markup: hub, heading: "Choose your course. Plan your next step." },
  { slug: "how-to-get-florida-real-estate-license", title: "Florida Course 1 Licensing Guide", description: "Starting Course 1 with Daniel Larson Training? Choose a package, open your course, keep your certificate and DBPR notices together, and prepare for exam day.", markup: addGuideSignup(addLicensingBudget(sales, "sales")), heading: "Starting Florida Course 1" },
  { slug: "florida-broker-license-requirements", title: "Florida Course 2 Broker Guide", description: "Starting Course 2 with Daniel Larson Training? Choose a broker package, open your course, track your certificate and DBPR notices, and prepare for broker exam day.", markup: addGuideSignup(addLicensingBudget(broker, "broker")), heading: "Starting Florida Course 2" },
  { slug: "school-certificate-and-state-exam", title: "School Certificate vs. Florida State Exam", description: "Ready to book the Florida real estate exam? How your school certificate, DBPR approval, and Pearson scheduling fit together, and what to bring on test day.", markup: addGuideSignup(exam), heading: "School certificate, DBPR approval, and the state exam" },
  { slug: "sales-associate-vs-realtor", title: "Real Estate License vs. REALTOR®", description: "Is a Florida real estate license the same as being a REALTOR®? No. DBPR issues the license; REALTOR® means NAR membership. Here is the difference.", markup: addGuideSignup(realtor), heading: "Sales associate and REALTOR®: what’s the difference?" },
  { slug: "post-licensing-vs-ce", title: "Florida Post-Licensing vs. 14-Hour CE", description: "First Florida renewal or a later one? See whether you need 45-hour sales Post-Licensing, 60-hour broker Post-Licensing, or 14-hour CE, and estimate your dates.", markup: addGuideSignup(renewal, "renewal"), heading: "Post-Licensing or 14-Hour CE?" },
  { slug: "florida-real-estate-math", title: "Florida Real Estate Exam Math", description: "Learn Florida real estate exam math with worked examples of commission splits, profit percentages, tax prorations, and land acreage.", markup: addGuideSignup(math), heading: "Florida real estate math, explained" },
  { slug: "florida-real-estate-license-problems", title: "Florida Real Estate License Help", description: "Missed Post-Licensing or CE, an inactive license, failed final, or missing DBPR credit? Daniel Larson can help you understand your options and next steps.", markup: addGuideSignup(problems, "renewal"), heading: "Florida real estate license problem? We can help." },
  { slug: "getting-licensed", title: "How to Get Your Florida Real Estate License", description: "The steps to a Florida sales associate license, in order: who can apply, the DBPR application, fingerprints, the 63-hour course, the state exam, and activation.", markup: addGuideSignup(gettingLicensed), heading: "How to get your Florida real estate license." },
  { slug: "broker-license", title: "Florida Real Estate Broker License Requirements", description: "Do you qualify for a Florida broker license? How to count 24 months of active experience, plus the Course 2, DBPR application, broker exam, and first-renewal steps.", markup: addGuideSignup(brokerLicense), heading: "Florida real estate broker license requirements." },
  { slug: "course-and-state-exam", title: "Florida Real Estate Exams: Certification and Preparation", description: "The Florida real estate exam: 100 questions, 3.5 hours, 75 to pass. What it costs, what happens if you fail, and how to study for the sales or broker exam.", markup: addGuideSignup(courseAndStateExam), heading: "Florida real estate exams: certification and preparation." },
  { slug: "continuing-education", title: "Florida Real Estate Continuing Education Requirements", description: "Past your first Florida renewal? What 14-hour CE must include, how to renew with DBPR, and what to do if your license went inactive.", markup: addGuideSignup(continuingEducation, "renewal"), heading: "Florida real estate continuing education requirements." },
  { slug: "licensing-costs", title: "What Does a Florida Real Estate License Cost?", description: "Build a Florida real estate licensing budget. Compare tuition, application, state-exam and fingerprint costs for sales associates and brokers.", markup: addGuideSignup(licensingCosts), heading: "What does a Florida real estate license cost?" },
  { slug: "realtor-membership-mls", title: "Florida License, REALTOR® Membership, and MLS Access", description: "Newly licensed in Florida? What REALTOR® membership and MLS access involve, who charges for each, and what to ask a brokerage before you pay any dues.", markup: addGuideSignup(realtorMembershipMls), heading: "Your license, REALTOR® membership, and MLS access." },
];
