import test from "node:test";
import assert from "node:assert/strict";
import { inspect } from "node:util";
import { captureDbprFailure, dbprFailureAttachments } from "../src/dbpr-diagnostics.js";

function pageFixture(screenshot) {
  return {
    locator: () => ({ isVisible: async () => false }),
    getByRole: role => ({ count: async () => role === "gridcell" ? 6 : 1, isVisible: async () => true }),
    screenshot
  };
}

test("keeps the private screenshot out of errors and public diagnostic logs", async () => {
  const screenshot = Buffer.from("private-student-screen");
  const error = new Error("Attendee verification stopped before Submit.");
  const logs = [];
  await captureDbprFailure(pageFixture(async options => {
    assert.ok(options.mask.length > 0);
    return screenshot;
  }), error, "add_attendee", { log: message => logs.push(message) });
  assert.equal(dbprFailureAttachments(error)[0].content, screenshot);
  assert.equal(dbprFailureAttachments(error)[0].contentType, "image/png");
  assert.deepEqual(Object.keys(error), []);
  assert.equal(inspect(error).includes("private-student-screen"), false);
  const state = JSON.parse(logs[0]).dbprFailure;
  assert.deepEqual(state, {
    stage: "add_attendee", screenshotCaptured: true, loginVisible: false,
    tableCount: 1, gridCount: 1, rowCount: 1, cellCount: 1, gridcellCount: 6, addVisible: true
  });
});

test("a failed screenshot preserves the original error and has no attachment", async () => {
  const error = new Error("Original DBPR error");
  await captureDbprFailure(pageFixture(async () => { throw new Error("Screenshot unavailable"); }), error, "add_attendee", { log: () => {} });
  assert.equal(error.message, "Original DBPR error");
  assert.deepEqual(dbprFailureAttachments(error), []);
});
