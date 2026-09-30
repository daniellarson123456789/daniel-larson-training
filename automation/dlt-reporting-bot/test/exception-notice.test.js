import test from "node:test";
import assert from "node:assert/strict";
import { matchCandidates } from "../src/records.js";
import { exceptionNotice } from "../src/exception-notice.js";
import { markExceptionsNotified, unnotifiedExceptions } from "../src/ledger.js";

const quiz = {
  id: "synthetic-exam", courseId: "2436207", passed: true,
  completedAt: "2026-09-30T01:00:00Z",
  user: { gid: "synthetic-user", email: "jane@example.com" }
};
function survey(license) {
  return {
    id: "synthetic-survey", course: { id: quiz.courseId }, user: quiz.user,
    completedAt: "2026-09-30T00:50:00Z",
    userAnswers: { nodes: [
      { question: { prompt: "First name" }, textResponse: "Jane" },
      { question: { prompt: "Last name" }, textResponse: "Example" },
      { question: { prompt: "License number" }, textResponse: license }
    ] }
  };
}

test("missing or incomplete license blocks reporting and produces an actionable FAILED notice", () => {
  for (const license of ["", "SL", "1234567", "SL12abc"]) {
    const { matches, exceptions } = matchCandidates([quiz], [survey(license)]);
    assert.equal(matches.length, 0);
    assert.equal(exceptions.length, 1);
    const notice = exceptionNotice(exceptions);
    assert.match(notice.subject, /^FAILED/);
    const body = notice.lines.join("\n");
    for (const expected of ["Jane", "Example", "jane@example.com", "0028050", "09/29/2026", "License must begin", "not submitted to DBPR by this run"]) {
      assert.ok(body.includes(expected), expected);
    }
    assert.ok(body.includes(license ? JSON.stringify(license) : "License supplied: [not provided]"));
    const publicDiagnostics = JSON.stringify(exceptions[0].diagnostics);
    assert.ok(!publicDiagnostics.includes("jane@example.com"));
    assert.ok(!publicDiagnostics.includes("Jane"));
  }
});

test("missing survey still identifies the student by email and the mapped course", () => {
  const { exceptions } = matchCandidates([quiz], []);
  const body = exceptionNotice(exceptions).lines.join("\n");
  assert.ok(body.includes("jane@example.com"));
  assert.ok(body.includes("0028050"));
  assert.ok(body.includes("No preceding license survey"));
  assert.ok(body.includes("First name supplied: [not provided]"));
});

test("private alert details do not enter the ledger and delivered alerts stay deduplicated", () => {
  const { exceptions } = matchCandidates([quiz], [survey("SL")]);
  const ledger = { version: 1, processed: {}, notifiedExceptions: {} };
  assert.equal(unnotifiedExceptions(ledger, exceptions, "synthetic-key").length, 1);
  markExceptionsNotified(ledger, exceptions, "synthetic-key");
  assert.equal(unnotifiedExceptions(ledger, exceptions, "synthetic-key").length, 0);
  assert.deepEqual(ledger.processed, {});
  assert.ok(!JSON.stringify(ledger).includes("jane@example.com"));
  assert.ok(!JSON.stringify(ledger).includes("Jane"));
});

test("long or multiline survey input stays bounded and cannot inject email fields", () => {
  const { exceptions } = matchCandidates([quiz], [survey("SL\nBcc: other@example.com" + "x".repeat(800))]);
  const notice = exceptionNotice(exceptions);
  assert.equal(notice.subject, "FAILED — DLT reporting needs your attention");
  const licenseLine = notice.lines.find((line) => line.startsWith("License supplied:"));
  assert.ok(licenseLine.length < 550);
  assert.ok(!licenseLine.includes("\n"));
  assert.ok(licenseLine.includes("[truncated]"));
});
