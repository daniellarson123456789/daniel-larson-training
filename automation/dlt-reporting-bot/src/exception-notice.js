import { dbprDate } from "./records.js";

function response(value) {
  // Keep untrusted survey responses on one line and bound unusually long input.
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text ? JSON.stringify(text.length > 500 ? `${text.slice(0, 500)} [truncated]` : text) : "[not provided]";
}

export function exceptionNotice(exceptions) {
  return {
    subject: "FAILED — DLT reporting needs your attention",
    lines: [
      "The bot could not report the following passing exam(s) because required student information is missing or invalid.",
      "These entries were not submitted to DBPR by this run. A separate manual submission may already exist.",
      "Look up the correct license details and report manually if needed. Check previous submissions first to avoid duplicates.",
      "",
      ...exceptions.flatMap((item) => {
        const details = item.adminDetails ?? {};
        const date = new Date(details.completedAt);
        return [
          `First name supplied: ${response(details.firstName)}`,
          `Last name supplied: ${response(details.lastName)}`,
          `Student email: ${response(details.studentEmail)}`,
          `Course: ${response(details.courseName)}`,
          `DBPR course number: ${response(details.dbprCourseNumber)}`,
          `Completion date (Eastern): ${Number.isNaN(date.getTime()) ? "[unavailable]" : dbprDate(details.completedAt)}`,
          `License supplied: ${response(details.submittedLicense)}`,
          `Problem: ${response(item.reason)}`,
          `Exam submission ID: ${response(item.quizSubmissionId)}`,
          ""
        ];
      })
    ]
  };
}
