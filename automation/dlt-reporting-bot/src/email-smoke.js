import { sendAdminNotice } from "./email.js";

await sendAdminNotice(
  "DLT reporting bot email test",
  [
    "Success — the DLT reporting bot can send email through Gmail.",
    "",
    "This was an email-only test. No Thinkific completion was processed and no DBPR submission was attempted.",
    `GitHub Actions run: ${process.env.GITHUB_RUN_ID || "local test"}`
  ]
);

console.log("Email-only test succeeded.");
