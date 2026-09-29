import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { candidateKey } from "../src/records.js";
import { saveLedger, loadLedger } from "../src/ledger.js";
import { manualSubmissionFingerprint, reconcileManualSubmissions } from "../src/manual-submissions.js";

const secret = "synthetic-test-key";
const candidate = {
  quizSubmissionId: "synthetic-exam", userId: "synthetic-user",
  thinkificCourseId: "2436207", dbprCourseNumber: "0028050",
  completedAt: "2026-09-29T02:30:00Z", license: { full: "SL987654321" }
};
const receiptDate = "2026-09-29T04:01:30Z";
const receipts = new Map([[manualSubmissionFingerprint(candidate), receiptDate]]);
const empty = () => ({ version: 1, processed: {}, notifiedExceptions: {} });

test("manual receipts suppress the same completion, including retakes and padded license numbers, but not other students, courses or days", () => {
  const ledger = empty();
  const repeated = { ...candidate, quizSubmissionId: "same-day-retake", license: { full: "SL000987654321" } };
  const otherStudent = { ...candidate, quizSubmissionId: "other-student", license: { full: "SL987654322" } };
  const otherCourse = { ...candidate, thinkificCourseId: "2436300", dbprCourseNumber: "0025288" };
  const later = { ...candidate, quizSubmissionId: "later-day", completedAt: "2026-09-29T04:30:00Z" };
  const candidates = [candidate, repeated, otherStudent, otherCourse, later];
  assert.equal(reconcileManualSubmissions(ledger, candidates, secret, receipts), 2);
  const pending = candidates.filter(c => !ledger.processed[candidateKey(c, secret)]);
  assert.deepEqual(pending, [otherStudent, otherCourse, later]);
  assert.equal(reconcileManualSubmissions(ledger, candidates, secret, receipts), 0);
  assert.equal(ledger.processed[candidateKey(candidate, secret)].status, "manually_submitted");
});

test("manual reconciliation survives saving and can rebuild from an older ledger without exposing student identifiers", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "dlt-manual-"));
  const file = path.join(dir, "ledger.json");
  try {
    const ledger = empty();
    reconcileManualSubmissions(ledger, [candidate], secret, receipts);
    await saveLedger(file, ledger);
    const restored = await loadLedger(file, { required: true });
    assert.equal(restored.processed[candidateKey(candidate, secret)].submittedAt, receiptDate);
    assert.equal(reconcileManualSubmissions(restored, [candidate], secret, receipts), 0);
    assert.equal(reconcileManualSubmissions(empty(), [candidate], secret, receipts), 1);
    for (const value of [candidate.userId, candidate.quizSubmissionId, candidate.license.full]) {
      assert.equal(JSON.stringify(restored).includes(value), false);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
