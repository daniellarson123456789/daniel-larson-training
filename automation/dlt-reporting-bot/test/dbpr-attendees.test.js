import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { verifyPendingAttendee } from "../src/dbpr-attendees.js";

// Synthetic records only; these tests use an in-memory page and never DBPR.
const candidate = {
  firstName: "Jane", lastName: "De La Cruz", dbprCourseNumber: "0025288",
  completedAt: "2026-09-28T01:43:00Z",
  license: { occupation: "SL", number: "0098765" }
};
const columns = ["Course Number", "Course Description", "Course Date", "Student Name", "Occupation Code", "License Number"];
const cells = ["0025288", "SALES POST LICENSE", "09/27/2026", "De La Cruz, Jane", "SL", "0098765"];
const rowHtml = (values = cells) => `<tr>${values.map(value => `<td>${value}</td>`).join("")}</tr>`;
const tableHtml = (rows = "") => `<table><thead><tr>${columns.map(value => `<th>${value}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
let browser;
before(async () => { browser = await chromium.launch({ headless: true }); });
after(async () => { await browser?.close(); });

test("waits for Add to finish rendering the matching attendee", async () => {
  const page = await browser.newPage();
  try {
    await page.setContent(`${tableHtml()}<button id="add">Add</button>`);
    await page.evaluate(html => {
      document.querySelector("#add").onclick = () => setTimeout(() => {
        document.querySelector("tbody").innerHTML = html;
      }, 250);
    }, rowHtml());
    await page.getByRole("button", { name: "Add", exact: true }).click();
    assert.equal(await page.getByRole("cell", { name: "0098765", exact: true }).count(), 0);
    await verifyPendingAttendee(page, candidate, { timeout: 2000 });
  } finally { await page.close(); }
});

test("accepts leading-zero formatting without accepting a different identifier", async () => {
  const page = await browser.newPage();
  try {
    const formatted = [...cells];
    formatted[0] = "25288";
    formatted[5] = "000098765";
    await page.setContent(tableHtml(rowHtml(formatted)));
    await verifyPendingAttendee(page, candidate, { timeout: 200 });
    formatted[5] = "10098765";
    await page.setContent(tableHtml(rowHtml(formatted)));
    await assert.rejects(verifyPendingAttendee(page, candidate, { timeout: 100 }), /upload authorization withheld/);
  } finally { await page.close(); }
});

test("blocks wrong course, date, name, occupation, license, and an empty list", async () => {
  const page = await browser.newPage();
  try {
    for (const [index, value] of [[0, "0028050"], [2, "09/28/2026"], [3, "Smith, Jane"], [4, "BK"], [5, "0098766"]]) {
      const wrong = [...cells];
      wrong[index] = value;
      await page.setContent(tableHtml(rowHtml(wrong)));
      await assert.rejects(verifyPendingAttendee(page, candidate, { timeout: 100 }), error => {
        assert.match(error.message, /upload authorization withheld/);
        for (const privateText of ["Jane", "Cruz", "0098765", "09/27/2026"]) assert.equal(error.message.includes(privateText), false);
        return true;
      });
    }
    await page.setContent(tableHtml());
    await assert.rejects(verifyPendingAttendee(page, candidate, { timeout: 100 }), /upload authorization withheld/);
  } finally { await page.close(); }
});

test("blocks duplicate and unexpected extra attendees", async () => {
  const page = await browser.newPage();
  try {
    for (const extra of [cells, ["0025288", "SALES POST LICENSE", "09/27/2026", "Doe, John", "SL", "0012345"]]) {
      await page.setContent(tableHtml(rowHtml() + rowHtml(extra)));
      await assert.rejects(verifyPendingAttendee(page, candidate, { timeout: 100 }), /upload authorization withheld/);
    }
  } finally { await page.close(); }
});
