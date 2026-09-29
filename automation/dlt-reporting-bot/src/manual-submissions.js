import { createHash } from "node:crypto";
import { candidateKey, dbprDate } from "./records.js";

// Verified manual DBPR roster receipts. Keep student data out of this public
// repository. Fingerprints identify course + license + actual completion day.
// Retain these entries even after a candidate has been copied into the ledger:
// an older restored ledger must not make the manual submission eligible again.
const MANUAL_SUBMISSIONS = new Map([
  ["54e881bf8fbfda548262859f90f391494e0153fa06ce00a618917aa6db39f89e", "2026-09-29T04:01:30Z"],
  ["0b74bc29e7136ffbdcb0c8a1a71cbb41f8c46357f10264a4760c247189eba367", "2026-09-29T04:01:30Z"],
  ["732a3fcefd216adde774a69b298040b731f738b92ba67c8bcdf8b9e39fda14d4", "2026-09-29T04:06:16Z"]
]);

export function manualSubmissionFingerprint(candidate) {
  const match = String(candidate.license?.full ?? "").match(/^(SL|BK|BL)(\d+)$/);
  if (!match) throw new Error("Invalid license during manual-submission reconciliation.");
  const license = `${match[1]}${BigInt(match[2])}`;
  return createHash("sha256")
    .update(JSON.stringify([candidate.dbprCourseNumber, license, dbprDate(candidate.completedAt)]))
    .digest("hex");
}

export function reconcileManualSubmissions(ledger, candidates, secret, receipts = MANUAL_SUBMISSIONS) {
  let count = 0;
  for (const candidate of candidates) {
    const submittedAt = receipts.get(manualSubmissionFingerprint(candidate));
    if (!submittedAt) continue;
    const key = candidateKey(candidate, secret);
    if (ledger.processed[key]) continue;
    ledger.processed[key] = {
      submittedAt,
      dbprCourseNumber: candidate.dbprCourseNumber,
      status: "manually_submitted"
    };
    count += 1;
  }
  return count;
}
