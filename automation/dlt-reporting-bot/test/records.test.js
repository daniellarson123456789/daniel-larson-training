import test from "node:test";
import assert from "node:assert/strict";
import { buildCandidate, candidateKey, dbprDate, matchCandidates, normalizeLicense } from "../src/records.js";

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
