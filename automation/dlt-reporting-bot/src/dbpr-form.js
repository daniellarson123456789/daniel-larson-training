import { dbprDate } from "./records.js";

const clean = value => String(value).trim().replace(/\s+/g, " ").toUpperCase();
const number = value => /^\d+$/.test(value) ? value.replace(/^0+/, "") || "0" : null;

export function validRosterData(value, candidate) {
  // DBPR's setHiddenInputTable serializes six fields per attendee. A visible
  // row alone is insufficient: this hidden field is what the server receives.
  if (typeof value !== "string" || !value.endsWith("@@")) return false;
  const rows = value.slice(0, -2).split("@@");
  if (rows.length !== 1) return false;
  const fields = rows[0].split("$$");
  return fields.length === 6 &&
    clean(fields[0]) === clean(candidate.lastName) &&
    clean(fields[1]) === clean(candidate.firstName) &&
    fields[2].trim() === "" &&
    fields[3] === candidate.license.occupation &&
    number(fields[4]) !== null && number(fields[4]) === number(candidate.license.number) &&
    /^row_\d+$/.test(fields[5]);
}

export async function verifyCourseHeader(page, candidate) {
  const text = await page.locator("#instructions").innerText();
  const course = text.match(/Course Code:\s*(\d+)/i)?.[1];
  const date = text.match(/Course Date:\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1];
  if (number(course || "") !== number(candidate.dbprCourseNumber) || date !== dbprDate(candidate.completedAt)) {
    throw new Error("DBPR selected course or completion date does not match; upload blocked.");
  }
}

export async function prepareAttendeeForm(page, candidate, { timeout = 30000 } = {}) {
  try {
    await page.waitForFunction(() => document.readyState !== "loading" &&
      typeof window.jQuery === "function" && typeof window.$ === "function" &&
      typeof window.add_check === "function" && typeof window.submit_check === "function" &&
      document.querySelector("#submit-form #hiddenTableData") &&
      document.querySelector("#courseTable tbody"), null, { timeout });
  } catch {
    throw new Error("DBPR attendee form scripts did not become ready; upload blocked.");
  }
  await verifyCourseHeader(page, candidate);
  // The portal omits type=button. If add_check throws, its trailing return
  // false is skipped and the browser otherwise POSTs an empty roster.
  // Preserve DBPR's own validation and Add handler; only remove this fallback.
  await page.getByRole("button", { name: "Add", exact: true }).evaluate(button => {
    button.type = "button";
  });
}

export async function verifyRosterData(page, candidate) {
  const value = await page.locator("#hiddenTableData").inputValue();
  if (!validRosterData(value, candidate)) {
    throw new Error("DBPR upload data does not contain exactly the verified attendee; upload blocked.");
  }
  return value;
}

export async function installRosterUploadGuard(page, candidate) {
  let approved = null;
  let sent = false;
  let blocked = false;
  let acceptedResponse = false;
  let uploadRequest = null;
  page.on("response", response => {
    if (response.request() === uploadRequest) acceptedResponse = response.status() >= 200 && response.status() < 400;
  });
  await page.route("**/*", async route => {
    const request = route.request();
    if (["GET", "HEAD"].includes(request.method())) return route.continue();
    const data = new URLSearchParams(request.postData() || "");
    const values = data.getAll("hiddenTableData");
    const allowed = !sent && !blocked && approved && request.method() === "POST" &&
      request.url() === approved.action && request.isNavigationRequest() &&
      request.frame() === page.mainFrame() && values.length === 1 &&
      values[0] === approved.value && validRosterData(values[0], candidate);
    if (!allowed) {
      blocked = true;
      return route.abort("blockedbyclient");
    }
    // Mark uncertainty before releasing the request, including transport errors.
    sent = true;
    approved = null;
    uploadRequest = request;
    return route.continue();
  });
  return {
    get sent() { return sent; },
    get blocked() { return blocked; },
    get acceptedResponse() { return acceptedResponse; },
    async authorize() {
      if (sent || blocked) throw new Error("DBPR upload guard stopped an unexpected request; review required.");
      await verifyCourseHeader(page, candidate);
      const value = await verifyRosterData(page, candidate);
      const form = await page.locator("#submit-form").evaluate(element => ({ action: element.action, method: element.method }));
      if (form.method.toLowerCase() !== "post" || new URL(form.action).origin !== new URL(page.url()).origin) {
        throw new Error("DBPR submission form changed; upload blocked.");
      }
      approved = { action: form.action, value };
    }
  };
}
