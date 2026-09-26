import { chromium } from "playwright";
import { DBPR, REPORTING_SWITCH } from "./config.js";
import { assertSafeCandidate, dbprDate } from "./records.js";

function redactCandidate(candidate) {
  return {
    course: candidate.thinkificCourseName,
    dbprCourseNumber: candidate.dbprCourseNumber,
    completionDate: dbprDate(candidate.completedAt),
    occupation: candidate.license.occupation,
    licenseSuffix: candidate.license.number.slice(-3)
  };
}

export async function reportToDbpr(candidate, env = process.env) {
  assertSafeCandidate(candidate);
  const productionEnabled = env.REPORTING_ENABLED === REPORTING_SWITCH;
  if (!productionEnabled) {
    return { status: "dry_run", dbprCourseNumber: candidate.dbprCourseNumber, preview: redactCandidate(candidate) };
  }
  if (!env.DBPR_USERNAME || !env.DBPR_PASSWORD) throw new Error("DBPR credentials are required.");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let submitClicked = false;
  try {
    await page.goto(DBPR.loginUrl, { waitUntil: "domcontentloaded" });
    await page.locator("#username").fill(env.DBPR_USERNAME);
    await page.locator("#password").fill(env.DBPR_PASSWORD);
    await Promise.all([
      page.waitForLoadState("domcontentloaded"),
      page.getByRole("button", { name: "Sign in", exact: true }).click()
    ]);
    if (await page.getByText(/Username or password was invalid/i).count()) throw new Error("DBPR rejected the stored login.");
    if (!(await page.getByText(env.DBPR_USERNAME, { exact: false }).count())) throw new Error("DBPR login could not be verified.");

    await page.goto(DBPR.providerPageUrl, { waitUntil: "domcontentloaded" });
    const providerRow = page.getByRole("row", { name: new RegExp(DBPR.providerNumber) });
    await providerRow.getByRole("link", { name: "Select", exact: true }).click();

    await page.locator("#coursedte").fill(dbprDate(candidate.completedAt));
    const courseRow = page.getByRole("row", { name: new RegExp(candidate.dbprCourseNumber) });
    await courseRow.getByRole("link", { name: "Select", exact: true }).click();

    await page.locator("#last-name").fill(candidate.lastName);
    await page.locator("#first-name").fill(candidate.firstName);
    await page.locator("#rank").selectOption(candidate.license.occupation);
    await page.locator("#license").fill(candidate.license.number);
    await page.getByRole("button", { name: "Add", exact: true }).click();

    const attendeeRow = page.getByRole("row", { name: new RegExp(`${candidate.dbprCourseNumber}.*${candidate.license.occupation}.*${candidate.license.number}`) });
    if (!(await attendeeRow.count())) throw new Error("DBPR did not add the attendee to the pending report.");

    // Final safety gate immediately before the irreversible click.
    assertSafeCandidate(candidate);
    if (env.REPORTING_ENABLED !== REPORTING_SWITCH) throw new Error("Production reporting switch changed before submit.");
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    submitClicked = true;
    await page.waitForLoadState("domcontentloaded");

    const body = await page.locator("body").innerText();
    if (!/success|successfully|allow 48 hours/i.test(body)) {
      throw new Error("DBPR did not display its successful-reporting confirmation.");
    }
    return {
      status: "submitted",
      dbprCourseNumber: candidate.dbprCourseNumber,
      receiptText: body.slice(0, 5000)
    };
  } catch (error) {
    if (submitClicked) {
      error.code = "DBPR_SUBMISSION_UNCERTAIN";
    }
    throw error;
  } finally {
    await browser.close();
  }
}
