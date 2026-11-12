import test from "node:test";
import assert from "node:assert/strict";
import { buildCandidate, candidateKey, dbprDate, matchCandidates, normalizeLicense, surveyDiagnostics } from "../src/records.js";

function survey(overrides = {}) {
  return {
    id: "survey-1",
    completedAt: "2026-09-26T19:06:00Z",
    course: { id: "2436207", name: "14CE EXAM PASS" },
    user: { gid: "student-1", email: "student@example.com" },
    userAnswers: { nodes: [
      { question: { prompt: "What is your first name, exactly as shown on your Florida real estate license?" }, textResponse: "Jane" },
      { question: { prompt: "What is your last name, exactly as shown on your Florida real estate license?" }, textResponse: "De La Cruz" },
      { question: { prompt: "What is your real estate license number, including the SL, BK, or BL prefix?" }, textResponse: "SL 0012345" }
    ] },
    ...overrides
  };
}

function quiz(overrides = {}) {
  return {
    id: "quiz-1",
    courseId: "2436207",
    completedAt: "2026-09-26T19:10:00Z",
    passed: true,
    user: { gid: "student-1", email: "student@example.com" },
    ...overrides
  };
}

test("normalizes a Florida real-estate license", () => {
  assert.deepEqual(normalizeLicense(" sl-0012345 "), { full: "SL0012345", occupation: "SL", number: "0012345" });
});

test("accepts a single leading number sign without changing the license or its leading zeros", () => {
  for (const prefix of ["SL", "BK", "BL"]) {
    for (const input of [`#${prefix}0012345`, ` # ${prefix.toLowerCase()}-0012345 `]) {
      assert.deepEqual(normalizeLicense(input), {
        full: `${prefix}0012345`, occupation: prefix, number: "0012345"
      });
    }
  }
});

test("still rejects missing prefixes, embedded punctuation, multiple licenses, and excess markers", () => {
  for (const input of ["#0012345", "#BK", "##BK0012345", "BK#0012345", "#BK0012345#",
    "#BK0012345/SL0012346", "license #BK0012345", "#BK00123O5", "#BK12345678901"]) {
    assert.throws(() => normalizeLicense(input), /License must begin/);
  }
});

test("a broker completion with a leading number sign becomes a candidate with the same duplicate key", () => {
  const exam = quiz({ courseId: "3313434" });
  const submission = survey({ course: { id: "3313434", name: "BROKER POST EXAM PASS" } });
  submission.userAnswers.nodes[2].textResponse = "#BK0012345";
  const result = matchCandidates([exam], [submission]);
  assert.equal(result.exceptions.length, 0);
  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0].dbprCourseNumber, "0031262");
  assert.equal(result.matches[0].license.full, "BK0012345");
  const diagnostics = surveyDiagnostics(submission);
  assert.equal(diagnostics.licenseResponse.validFormat, true);
  assert.equal(diagnostics.answers[2].responseHasLicenseFormat, true);
  for (const privateValue of ["Jane", "De La Cruz", "0012345", "student@example.com"]) {
    assert.equal(JSON.stringify(diagnostics).includes(privateValue), false);
  }
  submission.userAnswers.nodes[2].textResponse = "BK0012345";
  assert.equal(candidateKey(result.matches[0], "secret"), candidateKey(buildCandidate(exam, submission), "secret"));
});

test("a leading number sign cannot bypass blocked test licenses", () => {
  const submission = survey();
  submission.userAnswers.nodes[2].textResponse = "#SL123";
  assert.throws(() => buildCandidate(quiz(), submission), /Blocked test license/);
});

test("builds a DBPR candidate from the three survey answers", () => {
  const result = buildCandidate(quiz(), survey());
  assert.equal(result.firstName, "Jane");
  assert.equal(result.lastName, "De La Cruz");
  assert.equal(result.dbprCourseNumber, "0028050");
  assert.equal(result.license.full, "SL0012345");
});

test("hard-blocks the supplied test identity and SL123", () => {
  assert.throws(() => buildCandidate(
    quiz(),
    survey({ userAnswers: { nodes: [
      { question: { prompt: "First name" }, textResponse: "test" },
      { question: { prompt: "Last name" }, textResponse: "test" },
      { question: { prompt: "License number" }, textResponse: "SL123" }
    ] } })
  ), /Blocked test license|Blocked test student/);
});

test("matches only the same student and course with a preceding survey", () => {
  const result = matchCandidates([quiz()], [survey()]);
  assert.equal(result.matches.length, 1);
  assert.equal(result.exceptions.length, 0);
});

test("formats completion date in Florida time", () => {
  assert.equal(dbprDate("2026-09-27T01:30:00Z"), "09/26/2026");
});

test("keeps the duplicate key stable if Thinkific later changes completion time", () => {
  const candidate = buildCandidate(quiz(), survey());
  const updated = { ...candidate, completedAt: "2026-09-27T19:10:00.000Z" };
  assert.equal(candidateKey(candidate, "secret"), candidateKey(updated, "secret"));
});

test("diagnostics distinguish a missing license field without exposing responses", () => {
  const submission = survey();
  submission.userAnswers.nodes[2].question.prompt = "Real estate credential";
  const result = matchCandidates([quiz()], [submission]);
  assert.equal(result.matches.length, 0);
  const diagnostics = result.exceptions[0].diagnostics;
  assert.equal(diagnostics.fieldsFound.license, false);
  assert.equal(diagnostics.answers[2].responseHasLicenseFormat, true);
  const serialized = JSON.stringify(diagnostics);
  for (const privateValue of ["Jane", "De La Cruz", "0012345", "student@example.com", "Real estate credential"]) {
    assert.equal(serialized.includes(privateValue), false);
  }
});

test("diagnostics identify an invalid returned response without accepting it", () => {
  const submission = survey();
  submission.userAnswers.nodes[2].textResponse = "SL&#48;012345";
  const result = matchCandidates([quiz()], [submission]);
  assert.equal(result.matches.length, 0);
  const diagnostics = result.exceptions[0].diagnostics;
  assert.equal(diagnostics.fieldsFound.license, true);
  assert.equal(diagnostics.licenseResponse.validFormat, false);
  assert.equal(diagnostics.licenseResponse.hasHtmlEntity, true);
  assert.equal(JSON.stringify(diagnostics).includes("SL&#48;012345"), false);
});

test("recognizes a license question when rich text splits a word", () => {
  const submission = survey();
  submission.userAnswers.nodes[2].question.prompt = "<p>What is your real estate licen<strong>se num</strong>ber, including the SL, BK, or BL prefix?</p>";
  const result = matchCandidates([quiz()], [submission]);
  assert.equal(result.matches.length, 1);
  assert.equal(result.exceptions.length, 0);
  assert.equal(result.matches[0].license.full, "SL0012345");
  assert.equal(result.matches[0].lastName, "De La Cruz");
});

test("ignores invisible question formatting while preserving license validation", () => {
  const submission = survey();
  submission.userAnswers.nodes[2].question.prompt = "Real estate licen\u200Bse num\uFEFFber";
  assert.equal(buildCandidate(quiz(), submission).license.full, "SL0012345");
  submission.userAnswers.nodes[2].textResponse = "0012345";
  assert.throws(() => buildCandidate(quiz(), submission), /License must begin/);
  submission.userAnswers.nodes[2].textResponse = "SL123";
  assert.throws(() => buildCandidate(quiz(), submission), /Blocked test license/);
});
