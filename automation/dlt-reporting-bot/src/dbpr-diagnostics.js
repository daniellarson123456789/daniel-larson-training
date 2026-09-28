// Screenshots may contain student information. Keep them out of public logs,
// error properties, files, and Actions artifacts; send only to the admin inbox.
const failureAttachments = new WeakMap();

export function dbprFailureAttachments(error) {
  return failureAttachments.get(error) ?? [];
}

export async function captureDbprFailure(page, error, stage, { log = console.error } = {}) {
  const state = { stage, screenshotCaptured: false };
  try {
    state.loginVisible = await page.locator("#username").isVisible();
    for (const role of ["table", "grid", "row", "cell", "gridcell"]) {
      state[`${role}Count`] = await page.getByRole(role).count();
    }
    state.addVisible = await page.getByRole("button", { name: "Add", exact: true }).isVisible();
  } catch {
    state.pageInspectionFailed = true;
  }
  try {
    const content = await page.screenshot({
      type: "png", fullPage: true, timeout: 5000,
      mask: [page.locator('input[type="password"], #username, input[autocomplete="one-time-code"]')]
    });
    failureAttachments.set(error, [{ filename: "dbpr-failure.png", contentType: "image/png", content }]);
    state.screenshotCaptured = true;
  } catch {
    // A screenshot failure must not replace the reporting error or retry Submit.
  }
  log(JSON.stringify({ dbprFailure: state }));
}
