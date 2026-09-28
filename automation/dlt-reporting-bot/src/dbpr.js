import { chromium } from "playwright";
import { DBPR, REPORTING_SWITCH } from "./config.js";
import { assertSafeCandidate, dbprDate } from "./records.js";
import { verifyPendingAttendee } from "./dbpr-attendees.js";
import { captureDbprFailure } from "./dbpr-diagnostics.js";
import { installRosterUploadGuard, prepareAttendeeForm, verifyRosterData } from "./dbpr-form.js";

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
  const page = await browser.newPage({ serviceWorkers: "block" });
  let uploadGuard;
  let stage = "login";
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

    stage = "select_provider";
    await page.goto(DBPR.providerPageUrl, { waitUntil: "domcontentloaded" });
    const providerRow = page.getByRole("row", { name: new RegExp(DBPR.providerNumber) });
    await providerRow.getByRole("link", { name: "Select", exact: true }).click();

    stage = "select_course";
    await page.waitForLoadState("domcontentloaded");
    await page.locator("#coursedte").fill(dbprDate(candidate.completedAt));
    await page.locator("#coursedte").dispatchEvent("change");
    await page.locator("#coursedte").blur();
    const courseRow = page.getByRole("row", { name: new RegExp(candidate.dbprCourseNumber) });
    await courseRow.getByRole("link", { name: "Select", exact: true }).click();

    stage = "prepare_attendee_form";
    uploadGuard = await installRosterUploadGuard(page, candidate);
    await prepareAttendeeForm(page, candidate);
    stage = "add_attendee";
    await page.locator("#last-name").fill(candidate.lastName);
    await page.locator("#first-name").fill(candidate.firstName);
    await page.locator("#mid-name").fill("");
    await page.locator("#rank").selectOption(candidate.license.occupation);
    await page.locator("#license").fill(candidate.license.number);
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await verifyPendingAttendee(page, candidate);
    await verifyRosterData(page, candidate);

    // Final safety gate immediately before the irreversible click.
    assertSafeCandidate(candidate);
    if (env.REPORTING_ENABLED !== REPORTING_SWITCH) throw new Error("Production reporting switch changed before submit.");
    stage = "submit";
    await uploadGuard.authorize();
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await page.waitForLoadState("domcontentloaded");

    const body = await page.locator("body").innerText();
    if (!uploadGuard.sent || !uploadGuard.acceptedResponse || !/Your education course roster has been submitted/i.test(body)) {
      throw new Error("DBPR did not display its successful-reporting confirmation.");
    }
    return {
      status: "submitted",
      dbprCourseNumber: candidate.dbprCourseNumber,
      receiptText: body.slice(0, 5000)
    };
  } catch (error) {
    await captureDbprFailure(page, error, stage);
    if (uploadGuard?.sent) {
      error.code = "DBPR_SUBMISSION_UNCERTAIN";
    }
    throw error;
  } finally {
    await browser.close();
  }
}
