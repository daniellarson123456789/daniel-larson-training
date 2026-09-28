import { dbprDate } from "./records.js";

function exactText(value) {
  return new RegExp(`^${String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")}$`, "i");
}

function numericId(value) {
  if (!/^\d+$/.test(value)) throw new Error("Invalid DBPR identifier.");
  return new RegExp(`^0*${value.replace(/^0+/, "") || "0"}$`);
}

export async function verifyPendingAttendee(page, candidate, { timeout = 15000 } = {}) {
  // DBPR's Course Attendee(s) Entered table is populated after Add. Check
  // individual cells so column order, line wrapping, and zero padding do not
  // prevent a match. The date, name, course, and full license must all agree.
  const fields = {
    course: numericId(candidate.dbprCourseNumber),
    date: exactText(dbprDate(candidate.completedAt)),
    name: exactText(`${candidate.lastName}, ${candidate.firstName}`),
    occupation: exactText(candidate.license.occupation),
    license: numericId(candidate.license.number)
  };
  const rows = page.getByRole("row");
  let attendee = rows;
  for (const pattern of Object.values(fields)) {
    attendee = attendee.filter({ has: page.getByRole("cell", { name: pattern }) });
  }

  try {
    await attendee.waitFor({ state: "visible", timeout });
    const table = page.getByRole("table").filter({ has: attendee });
    const enteredRows = table.getByRole("row").filter({ has: page.getByRole("cell") });
    if (await enteredRows.count() !== 1) throw new Error("Unexpected attendees.");
  } catch {
    // Never expose Playwright's locator error, which includes student details,
    // in the public Actions log. Counts still explain which check failed.
    const diagnostics = {};
    for (const [field, pattern] of Object.entries(fields)) {
      diagnostics[field] = await rows.filter({ has: page.getByRole("cell", { name: pattern }) }).count();
    }
    diagnostics.exactMatches = await attendee.count();
    throw new Error(`DBPR pending attendee could not be verified; upload authorization withheld. Checks: ${JSON.stringify(diagnostics)}`);
  }
}
