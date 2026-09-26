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

The workflow keeps its HMAC-only duplicate ledger in an Actions cache and polls only the last 48 hours. DBPR's official upload and processing-result emails remain the authoritative receipts in the provider mailbox.

If the bot clicks **Submit** but cannot verify DBPR's response, it marks the record for manual review and will not retry it automatically. A confirmed DBPR submission is saved before student email is attempted, so an email outage cannot trigger a duplicate filing.

## First run

1. Add the encrypted secrets except `REPORTING_ENABLED`.
2. Run **DLT reporting bot** manually with `production` off.
3. Review the dry-run output. It contains counts and redacted record previews only.
4. Verify that `test test / SL123` is rejected.
5. Add `REPORTING_ENABLED` only after a real, verified completion is available for the first controlled production run.
6. Set `DLT_REPORTING_BOT_ENABLED=true` only when the scheduled production run is ready to go live.
