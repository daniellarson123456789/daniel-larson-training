import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { installRosterUploadGuard, prepareAttendeeForm, verifyRosterData, validRosterData } from "../src/dbpr-form.js";
import { verifyPendingAttendee } from "../src/dbpr-attendees.js";

// Only loopback requests and synthetic students. The fixture preserves the
// portal's original default-submit buttons and add_check serialization code.
const candidate = {
  firstName: "Jane", lastName: "De La Cruz", dbprCourseNumber: "0025288",
  completedAt: "2026-09-28T01:43:00Z", license: { occupation: "SL", number: "0098765" }
};
const goodData = "De La Cruz$$Jane$$ $$SL$$0098765$$row_0@@";
let browser, server, url, fixture;
const uploads = [];
before(async () => {
  fixture = await readFile(new URL("./fixtures/dbpr-attendee-form.html", import.meta.url), "utf8");
  server = createServer(async (req, res) => {
    if (req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      uploads.push(new URLSearchParams(body).get("hiddenTableData"));
      res.end("Your education course roster has been submitted.");
    } else {
      res.setHeader("Content-Type", "text/html");
      res.end(fixture);
    }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${server.address().port}/attendee`;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

async function fillAndAdd(page) {
  await page.locator("#last-name").fill(candidate.lastName);
  await page.locator("#first-name").fill(candidate.firstName);
  await page.locator("#rank").selectOption("SL");
  await page.locator("#license").fill(candidate.license.number);
  await page.getByRole("button", { name: "Add", exact: true }).click();
}

test("reproduces the original empty upload when the Add handler throws", async () => {
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.evaluate(() => { window.add_check = () => { throw new Error("script unavailable"); }; });
    const count = uploads.length;
    await fillAndAdd(page);
    assert.equal(uploads.length, count + 1);
    assert.equal(uploads.at(-1), "");
  } finally { await page.close(); }
});

test("protected Add cannot submit when its handler throws", async () => {
  const page = await browser.newPage({ serviceWorkers: "block" });
  try {
    await page.goto(url);
    const guard = await installRosterUploadGuard(page, candidate);
    await prepareAttendeeForm(page, candidate);
    await page.evaluate(() => { window.add_check = () => { throw new Error("script unavailable"); }; });
    const count = uploads.length;
    await fillAndAdd(page);
    await assert.rejects(verifyRosterData(page, candidate), /upload blocked/);
    assert.equal(uploads.length, count);
    assert.equal(guard.sent, false);
    assert.equal(await page.locator("#submit-form").count(), 1);
  } finally { await page.close(); }
});

test("network guard blocks default form POST even without the button protection", async () => {
  const page = await browser.newPage({ serviceWorkers: "block" });
  try {
    await page.goto(url);
    const guard = await installRosterUploadGuard(page, candidate);
    await page.evaluate(() => { window.add_check = undefined; });
    const count = uploads.length;
    await fillAndAdd(page).catch(() => {});
    assert.equal(guard.blocked, true);
    assert.equal(guard.sent, false);
    assert.equal(uploads.length, count);
  } finally { await page.close(); }
});

test("waits for delayed scripts, then verifies and sends exactly one full attendee", async () => {
  const page = await browser.newPage({ serviceWorkers: "block" });
  try {
    await page.goto(url);
    const guard = await installRosterUploadGuard(page, candidate);
    await page.evaluate(() => {
      const add = window.add_check;
      window.add_check = undefined;
      setTimeout(() => { window.add_check = add; }, 200);
    });
    await prepareAttendeeForm(page, candidate, { timeout: 2000 });
    const count = uploads.length;
    await fillAndAdd(page);
    await verifyPendingAttendee(page, candidate, { timeout: 1000 });
    assert.equal(await verifyRosterData(page, candidate), goodData);
    assert.equal(uploads.length, count);
    await guard.authorize();
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    assert.equal(uploads.length, count + 1);
    assert.equal(uploads.at(-1), goodData);
    assert.equal(guard.sent, true);
    assert.equal(guard.acceptedResponse, true);
    await assert.rejects(guard.authorize(), /review required/);
  } finally { await page.close(); }
});

test("rejects wrong or missing course/date and missing scripts before Add", async () => {
  const page = await browser.newPage();
  try {
    for (const header of ["Course Code: 0028050 Course Date: 09/27/2026", "Course Code: 0025288 Course Date: 09/28/2026", "Course Code: 0025288 Course Date:"]) {
      await page.goto(url);
      await page.locator("#instructions").evaluate((el, text) => { el.textContent = text; }, header);
      await assert.rejects(prepareAttendeeForm(page, candidate), /course or completion date/);
    }
    await page.goto(url);
    await page.evaluate(() => { window.add_check = undefined; });
    await assert.rejects(prepareAttendeeForm(page, candidate, { timeout: 100 }), /scripts did not become ready/);
  } finally { await page.close(); }
});

test("rejects empty, changed, duplicate, or incomplete hidden roster data", async () => {
  assert.equal(validRosterData(goodData, candidate), true);
  for (const bad of ["", goodData + goodData, goodData.replace("Jane", "Joan"), goodData.replace("0098765", "0098766"), goodData.replace("$$ $$", "$$M$$"), goodData.replace("$$SL$$", "$$BK$$"), goodData.slice(0, -2)]) {
    assert.equal(validRosterData(bad, candidate), false);
  }
  const page = await browser.newPage({ serviceWorkers: "block" });
  try {
    await page.goto(url);
    const guard = await installRosterUploadGuard(page, candidate);
    await prepareAttendeeForm(page, candidate);
    await fillAndAdd(page);
    await guard.authorize();
    await page.locator("#hiddenTableData").evaluate(el => { el.value = ""; });
    const count = uploads.length;
    await page.getByRole("button", { name: "Submit", exact: true }).click().catch(() => {});
    assert.equal(guard.blocked, true);
    assert.equal(guard.sent, false);
    assert.equal(uploads.length, count);
  } finally { await page.close(); }
});
