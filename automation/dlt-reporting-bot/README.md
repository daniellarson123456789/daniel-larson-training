# Daniel Larson Training reporting bot

This bot polls Thinkific for the three required license-information survey answers and a passing final-exam submission. It maps the completion to the approved DBPR course, enters the attendee in the DBPR Education Provider Reporting Portal, waits for the portal's success message, and then emails the student.

The initial state is guarded. `REPORTING_ENABLED` must equal the exact production phrase in `src/config.js` before the DBPR Submit button can be clicked. `SL123` and the student name `test test` are permanently blocked in code.

## Confirmed mappings

| Thinkific course | Thinkific ID | DBPR course |
| --- | ---: | ---: |
| 14CE EXAM PASS | 2436207 | 0028050 |
| POST EXAM PASS | 2436300 | 0025288 |
| BROKER POST EXAM PASS | 3313434 | 0031262 |

## Required encrypted secrets

- `THINKIFIC_API_TOKEN`
- `DBPR_USERNAME`
- `DBPR_PASSWORD`
- `SMTP_USER`
- `SMTP_APP_PASSWORD`
- `LEDGER_HMAC_KEY` — a long random value used to store only non-reversible completion fingerprints
- `REPORTING_ENABLED` — leave unset for dry runs; production requires the exact phrase defined in `src/config.js`

The scheduled job also requires the repository variable `DLT_REPORTING_BOT_ENABLED=true`. Leave it unset until the manual dry run is clean.

The workflow keeps its HMAC-only duplicate ledger in an Actions cache and requires that history on every run. Missing or corrupt history stops reporting; do not replace it with an empty file. Recent exams are polled for 48 hours, with preceding surveys available across the full 30-day matching window. A query reaching the current 100-record limit stops for review instead of silently ignoring records. DBPR's official upload and processing-result emails remain the authoritative receipts in the provider mailbox.

Missing-information notices are sent once per exam and reason. Successfully delivered notices are recorded as HMAC fingerprints in the ledger. Delivery failures remain eligible for a later notification attempt.

When enabled, the workflow is scheduled **every 10 minutes** using the cron expression `*/10 * * * *`. GitHub can delay or drop scheduled jobs, so this is a target cadence rather than a delivery guarantee. A separate read-only health check should verify that a successful LIVE scheduled report job has completed within the preceding two hours, including a successfully saved reporting ledger, and alert on missing execution, failed or unexpectedly skipped jobs, non-live mode, or substantive reporting and email errors. Push-triggered dry runs and manual runs do not count as successful scheduled reporting. Disable automatic runs by setting `DLT_REPORTING_BOT_ENABLED=false`. The variable only gates scheduled runs; manual production runs still require the explicit production option and the authorization secret.

If the bot clicks **Submit** but cannot verify DBPR's response, it marks the record for manual review and will not retry it automatically. A confirmed DBPR submission is saved before student email is attempted, so an email outage cannot trigger a duplicate filing.

## First run

1. Add the encrypted secrets except `REPORTING_ENABLED`.
2. Run **DLT reporting bot** manually with `production` off.
3. Review the dry-run output. It contains counts and redacted record previews only.
4. Verify that `test test / SL123` is rejected.
5. Add `REPORTING_ENABLED` only after a real, verified completion is available for the first controlled production run.
6. Set `DLT_REPORTING_BOT_ENABLED=true` only when the scheduled production run is ready to go live.
