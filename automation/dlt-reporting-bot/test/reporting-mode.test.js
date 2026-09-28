import test from "node:test";
import assert from "node:assert/strict";
import { REPORTING_SWITCH, reportingMode } from "../src/config.js";

test("ordinary validation runs stay in dry-run mode", () => {
  assert.equal(reportingMode({ REPORTING_REQUESTED: "false", REPORTING_ENABLED: "DRY_RUN" }), "DRY_RUN");
});

test("a requested live run fails clearly when its secret is absent or incorrect", () => {
  for (const setting of [undefined, "", "DRY_RUN", "true"]) {
    assert.throws(() => reportingMode({ REPORTING_REQUESTED: "true", REPORTING_ENABLED: setting }), /REPORTING_ENABLED repository secret is missing or incorrect/);
  }
});

test("live mode requires the existing exact authorization setting", () => {
  assert.equal(reportingMode({ REPORTING_REQUESTED: "true", REPORTING_ENABLED: REPORTING_SWITCH }), "LIVE");
});
