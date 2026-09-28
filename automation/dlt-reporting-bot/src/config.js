export const COURSE_MAP = Object.freeze({
  "2436207": {
    thinkificName: "14CE EXAM PASS",
    dbprCourseNumber: "0028050",
    dbprCourseDescription: "(CORRESPONDENCE) CONTINUING EDUCATION"
  },
  "2436300": {
    thinkificName: "POST EXAM PASS",
    dbprCourseNumber: "0025288",
    dbprCourseDescription: "(DISTANCE) SALES POST LICENSE"
  },
  "3313434": {
    thinkificName: "BROKER POST EXAM PASS",
    dbprCourseNumber: "0031262",
    dbprCourseDescription: "(DISTANCE) BROKER POST LICENSE"
  }
});

export const DBPR = Object.freeze({
  loginUrl: "https://www.myfloridalicense.com/cereporting/security/login.jsp",
  providerPageUrl: "https://www.myfloridalicense.com/cereporting/pages/picklicense",
  providerNumber: "0008759"
});

export const REPORTING_SWITCH = "YES_I_AUTHORIZE_DBPR_SUBMISSION";
export const HARD_BLOCKED_LICENSES = new Set(["SL123"]);
export const POLL_WINDOW_HOURS = 48;
export const MATCH_WINDOW_DAYS = 30;

export function reportingMode(env = process.env) {
  const enabled = env.REPORTING_ENABLED === REPORTING_SWITCH;
  if (env.REPORTING_REQUESTED === "true" && !enabled) {
    throw new Error("Live reporting was requested, but the REPORTING_ENABLED repository secret is missing or incorrect. Set it to the exact authorization phrase in src/config.js, then start a new workflow run.");
  }
  return enabled ? "LIVE" : "DRY_RUN";
}
