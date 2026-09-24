import hub from "../content/license-guides/index.html?raw";
import sales from "../content/license-guides/how-to-get-florida-real-estate-license.html?raw";
import broker from "../content/license-guides/florida-broker-license-requirements.html?raw";
import exam from "../content/license-guides/school-certificate-and-state-exam.html?raw";
import realtor from "../content/license-guides/sales-associate-vs-realtor.html?raw";
import renewal from "../content/license-guides/post-licensing-vs-ce.html?raw";

export const guides = [
  { slug: undefined, title: "Florida Real Estate License Knowledge Center", description: "Florida sales associate and broker licensing steps, course certification, state exams, and renewal requirements explained.", markup: hub, heading: "Florida real estate licensing, explained." },
  { slug: "how-to-get-florida-real-estate-license", title: "How to Get a Florida Real Estate Sales Associate License", description: "Apply to DBPR, complete Course 1 and FastPass, get certified, schedule the Pearson exam, and activate your Florida sales associate license.", markup: sales, heading: "How to get a Florida real estate license" },
  { slug: "florida-broker-license-requirements", title: "Florida Broker License Requirements", description: "Florida broker eligibility: 24 active months within five years, Course 2, Broker FastPass, DBPR approval, and the Pearson broker exam.", markup: broker, heading: "How to get a Florida broker license" },
  { slug: "school-certificate-and-state-exam", title: "School Certificate vs. Florida State Exam", description: "How school certification, DBPR exam approval, and Pearson testing work for Florida sales associate and broker candidates.", markup: exam, heading: "School certificate, DBPR approval, and the state exam" },
  { slug: "sales-associate-vs-realtor", title: "Florida Sales Associate License vs. REALTOR®", description: "A Florida sales associate license is issued by DBPR; REALTOR® refers to NAR membership. Learn the difference and the licensing steps.", markup: realtor, heading: "Sales associate and REALTOR®: what’s the difference?" },
  { slug: "post-licensing-vs-ce", title: "Florida Post-Licensing vs. 14-Hour CE", description: "Find the right Florida first-renewal Post-Licensing or later 14-hour CE requirement for sales associates and brokers.", markup: renewal, heading: "Post-Licensing or 14-Hour CE?" },
];
