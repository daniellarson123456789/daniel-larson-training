import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadLedger, saveLedger, markProcessed, unnotifiedExceptions, markExceptionsNotified, exceptionKey } from "../src/ledger.js";

const secret = "synthetic-test-key-only";
const exception = { quizSubmissionId: "synthetic-quiz", reason: "Missing survey" };

test("missing or corrupt required history stops reporting instead of resetting it", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "dlt-ledger-"));
  const file = path.join(dir, "ledger.json");
  try {
    await assert.rejects(loadLedger(file, { required: true }), /history is missing/);
    for (const value of ["broken JSON", "null", '{"version":1,"processed":null}', '{"version":1,"processed":[]}']) {
      await writeFile(file, value);
      await assert.rejects(loadLedger(file, { required: true }));
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("existing completion history survives alert-ledger migration and round trips", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "dlt-ledger-"));
  const file = path.join(dir, "ledger.json");
  try {
    const processed = { fingerprint: { status: "submitted", dbprCourseNumber: "0025288", submittedAt: new Date().toISOString() } };
    await writeFile(file, JSON.stringify({ version: 1, processed }));
    const ledger = await loadLedger(file, { required: true });
    assert.deepEqual(ledger.processed, processed);
    assert.deepEqual(ledger.notifiedExceptions, {});
    markProcessed(ledger, "uncertain", { status: "needs_manual_review", dbprCourseNumber: "0025288" });
    markExceptionsNotified(ledger, [exception], secret);
    await saveLedger(file, ledger);
    const restored = await loadLedger(file, { required: true });
    assert.deepEqual(restored.processed.fingerprint, processed.fingerprint);
    assert.equal(restored.processed.uncertain.status, "needs_manual_review");
    assert.deepEqual(unnotifiedExceptions(restored, [exception], secret), []);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("only delivered notices are suppressed; new reasons and exams still notify", () => {
  const ledger = { version: 1, processed: {}, notifiedExceptions: {} };
  assert.deepEqual(unnotifiedExceptions(ledger, [exception, exception], secret), [exception]);
  // No mark call after a delivery failure: it remains eligible next run.
  assert.deepEqual(unnotifiedExceptions(ledger, [exception], secret), [exception]);
  markExceptionsNotified(ledger, [exception], secret);
  const changed = { ...exception, reason: "Invalid license" };
  const another = { ...exception, quizSubmissionId: "another-synthetic-quiz" };
  assert.deepEqual(unnotifiedExceptions(ledger, [exception, changed, another], secret), [changed, another]);
  assert.match(exceptionKey(exception, secret), /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(ledger).includes(exception.quizSubmissionId), false);
  assert.equal(JSON.stringify(ledger).includes(exception.reason), false);
});
