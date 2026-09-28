import crypto from "node:crypto";
import {
  COURSE_MAP,
  HARD_BLOCKED_LICENSES,
  MATCH_WINDOW_DAYS
} from "./config.js";

function cleanText(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeLicense(value) {
  const compact = cleanText(value).toUpperCase().replace(/[\s-]/g, "");
  const match = compact.match(/^(SL|BK|BL)(\d{1,10})$/);
  if (!match) throw new Error("License must begin with SL, BK, or BL and end in digits.");
  return {
    full: `${match[1]}${match[2]}`,
    occupation: match[1],
    number: match[2]
  };
}

function answerField(value) {
  // Thinkific's rich-text question can split words across inline elements or
  // contain invisible formatting that is absent from the CSV export.
  const prompt = cleanText(value).toLowerCase().replace(/[\s\u200B-\u200D\uFEFF]/g, "");
  if (prompt.includes("firstname")) return "firstName";
  if (prompt.includes("lastname")) return "lastName";
  if (/license(?:number|#)/.test(prompt)) return "license";
  return null;
}

function answersByMeaning(submission) {
  const values = {};
  for (const answer of submission.userAnswers?.nodes ?? []) {
    const field = answerField(answer.question?.prompt);
    if (field) values[field] = cleanText(answer.textResponse);
  }
  return values;
}

// Only structural information belongs in the public Actions log. Never include
// student responses, names, emails, license numbers, or free-form prompts.
export function surveyDiagnostics(submission) {
  const answers = answersByMeaning(submission);
  const license = cleanText(answers.license);
  const compact = license.toUpperCase().replace(/[\s-]/g, "");
  return {
    course: COURSE_MAP[String(submission.course?.id)]?.thinkificName ?? "unmapped",
    fieldsFound: {
      firstName: Object.hasOwn(answers, "firstName"),
      lastName: Object.hasOwn(answers, "lastName"),
      license: Object.hasOwn(answers, "license")
    },
    licenseResponse: {
      length: license.length,
      validFormat: /^(SL|BK|BL)\d{1,10}$/.test(compact),
      hasHtmlEntity: /&(?:#\d+|#x[\da-f]+|[a-z]+);/i.test(license),
      hasOtherCharacters: /[^a-z\d\s-]/i.test(license)
    },
    answers: (submission.userAnswers?.nodes ?? []).map((answer) => {
      const prompt = cleanText(answer.question?.prompt).toLowerCase();
      const field = answerField(answer.question?.prompt);
      const response = cleanText(answer.textResponse);
      return {
        matchesFirstName: field === "firstName",
        matchesLastName: field === "lastName",
        matchesLicense: field === "license",
        promptHasHtmlEntity: /&(?:#\d+|#x[\da-f]+|[a-z]+);/i.test(prompt),
        responseType: answer.textResponse === null ? "null" : typeof answer.textResponse,
        responseLength: response.length,
        responseHasLicenseFormat: /^(SL|BK|BL)\d{1,10}$/.test(response.toUpperCase().replace(/[\s-]/g, ""))
      };
    })
  };
}

function validateName(value, label) {
  const normalized = cleanText(value);
  if (!normalized || normalized.length > 45) throw new Error(`${label} is missing or too long.`);
  if (!/^[\p{L}][\p{L}' .-]*$/u.test(normalized)) throw new Error(`${label} contains unsupported characters.`);
  return normalized;
}

export function buildCandidate(quiz, survey) {
  const courseId = String(survey.course?.id ?? "");
  const course = COURSE_MAP[courseId];
  if (!course) throw new Error(`Unmapped Thinkific course ${courseId}.`);
  if (!quiz.passed) throw new Error("Quiz submission is not passing.");

  const answers = answersByMeaning(survey);
  const firstName = validateName(answers.firstName, "First name");
  const lastName = validateName(answers.lastName, "Last name");
  const license = normalizeLicense(answers.license);
  const completedAt = new Date(quiz.completedAt);
  if (Number.isNaN(completedAt.getTime())) throw new Error("Quiz completion time is missing.");

  const candidate = {
    quizSubmissionId: String(quiz.id),
    surveySubmissionId: String(survey.id),
    userId: String(quiz.user?.gid ?? survey.user?.gid ?? ""),
    studentEmail: String(quiz.user?.email ?? survey.user?.email ?? "").trim().toLowerCase(),
    firstName,
    lastName,
    license,
    thinkificCourseId: courseId,
    thinkificCourseName: course.thinkificName,
    dbprCourseNumber: course.dbprCourseNumber,
    dbprCourseDescription: course.dbprCourseDescription,
    completedAt: completedAt.toISOString()
  };

  assertSafeCandidate(candidate);
  return candidate;
}

export function assertSafeCandidate(candidate) {
  if (!candidate.studentEmail || !candidate.studentEmail.includes("@")) {
    throw new Error("Student email is missing.");
  }
  if (HARD_BLOCKED_LICENSES.has(candidate.license.full)) {
    throw new Error(`Blocked test license ${candidate.license.full}.`);
  }
  if (candidate.firstName.toLowerCase() === "test" && candidate.lastName.toLowerCase() === "test") {
    throw new Error("Blocked test student.");
  }
}

function sameUser(a, b) {
  const aid = String(a.user?.gid ?? "");
  const bid = String(b.user?.gid ?? "");
  if (aid && bid) return aid === bid;
  return String(a.user?.email ?? "").toLowerCase() === String(b.user?.email ?? "").toLowerCase();
}

export function matchCandidates(quizSubmissions, surveySubmissions) {
  const matches = [];
  const exceptions = [];
  const maxGap = MATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  for (const quiz of quizSubmissions.filter((item) => item.passed && item.completedAt)) {
    const quizTime = new Date(quiz.completedAt).getTime();
    const possible = surveySubmissions
      .filter((survey) => sameUser(quiz, survey))
      .filter((survey) => String(survey.course?.id ?? "") === String(quiz.courseId ?? ""))
      .filter((survey) => {
        const surveyTime = new Date(survey.completedAt).getTime();
        return surveyTime <= quizTime && quizTime - surveyTime <= maxGap;
      })
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    if (!possible.length) {
      exceptions.push({ quizSubmissionId: String(quiz.id), reason: "No preceding license survey matched this passing exam." });
      continue;
    }

    try {
      matches.push(buildCandidate(quiz, possible[0]));
    } catch (error) {
      exceptions.push({
        quizSubmissionId: String(quiz.id),
        reason: error.message,
        diagnostics: surveyDiagnostics(possible[0])
      });
    }
  }
  return { matches, exceptions };
}

export function candidateKey(candidate, secret) {
  if (!secret) throw new Error("LEDGER_HMAC_KEY is required.");
  return crypto
    .createHmac("sha256", secret)
    .update([
      candidate.thinkificCourseId,
      candidate.quizSubmissionId,
      candidate.userId
    ].join("|"))
    .digest("hex");
}

export function dbprDate(isoDate) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  }).formatToParts(new Date(isoDate));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.month}/${value.day}/${value.year}`;
}
