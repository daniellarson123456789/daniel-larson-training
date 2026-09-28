import path from "node:path";
import { COURSE_MAP, reportingMode } from "./config.js";
import { fetchThinkificData } from "./thinkific.js";
import { candidateKey, matchCandidates } from "./records.js";
import { loadLedger, markProcessed, pruneLedger, saveLedger } from "./ledger.js";
import { reportToDbpr } from "./dbpr.js";
import { sendAdminNotice, sendStudentConfirmation } from "./email.js";
import { notifyWithoutBlocking } from "./mail-delivery.js";
import { dbprFailureAttachments } from "./dbpr-diagnostics.js";

const ledgerPath = process.env.LEDGER_PATH || path.resolve(".state/processed.json");

async function main() {
  console.log(JSON.stringify({ reportingMode: reportingMode(process.env) }));
  const ledger = await loadLedger(ledgerPath);
  pruneLedger(ledger);
  const data = await fetchThinkificData(process.env.THINKIFIC_API_TOKEN);

  const quizzes = data.quizzes
    .filter((quiz) => COURSE_MAP[String(quiz.courseId)])
    .filter((quiz) => /exam|final/i.test(String(quiz.quiz?.name ?? "")));

  const { matches, exceptions } = matchCandidates(quizzes, data.surveys);
  const pending = matches.filter((candidate) => !ledger.processed[candidateKey(candidate, process.env.LEDGER_HMAC_KEY)]);
  const exceptionReasons = exceptions.reduce((counts, item) => {
    counts[item.reason] = (counts[item.reason] ?? 0) + 1;
    return counts;
  }, {});

  console.log(JSON.stringify({
    surveys: data.surveys.length,
    passingMatches: matches.length,
    pending: pending.length,
    exceptions: exceptions.length,
    exceptionReasons,
    exceptionDiagnostics: exceptions
      .filter((item) => item.diagnostics)
      .map((item) => item.diagnostics)
  }));

  if (exceptions.length && process.env.SMTP_USER) {
    await notifyWithoutBlocking(() => sendAdminNotice("DLT reporting exception", exceptions.map((item) => `${item.quizSubmissionId}: ${item.reason}`)));
  }

  for (const candidate of pending) {
    const key = candidateKey(candidate, process.env.LEDGER_HMAC_KEY);
    try {
      const result = await reportToDbpr(candidate);
      if (result.status === "submitted") {
        // Persist the successful DBPR submission before attempting email. An
        // email outage must never cause the state filing to be repeated.
        markProcessed(ledger, key, result);
        await saveLedger(ledgerPath, ledger);

        try {
          await sendStudentConfirmation(candidate);
          await sendAdminNotice("DBPR submission accepted", [
            `Course: ${candidate.thinkificCourseName}`,
            `DBPR course: ${candidate.dbprCourseNumber}`,
            `License: ${candidate.license.full}`,
            "",
            result.receiptText
          ]);
        } catch (emailError) {
          console.error(`DBPR submission was saved, but email failed: ${emailError.message}`);
        }
      } else {
        console.log(JSON.stringify({ status: "dry_run", preview: result.preview }));
      }
    } catch (error) {
      if (error.code === "DBPR_SUBMISSION_UNCERTAIN") {
        // The Submit click occurred but confirmation could not be verified.
        // Hold the record so a retry cannot create a duplicate filing.
        markProcessed(ledger, key, {
          status: "needs_manual_review",
          dbprCourseNumber: candidate.dbprCourseNumber
        });
        await saveLedger(ledgerPath, ledger);
        console.error(`DBPR result needs manual review for quiz ${candidate.quizSubmissionId}: ${error.message}`);
        if (process.env.SMTP_USER) {
          try {
            await sendAdminNotice("DBPR submission needs manual review", [
              `Quiz submission: ${candidate.quizSubmissionId}`,
              `Course: ${candidate.thinkificCourseName}`,
              `License: ${candidate.license.full}`,
              `Reason: ${error.message}`,
              "Do not resubmit until the DBPR result email and portal status are checked."
            ], process.env, dbprFailureAttachments(error));
          } catch {}
        }
        continue;
      }
      throw error;
    }
  }
  await saveLedger(ledgerPath, ledger);
}

main().catch(async (error) => {
  console.error(error.stack || error.message);
  if (process.env.SMTP_USER) {
    try {
      await sendAdminNotice("DLT reporting bot failed", [error.message], process.env, dbprFailureAttachments(error));
    } catch {}
  }
  process.exitCode = 1;
});
