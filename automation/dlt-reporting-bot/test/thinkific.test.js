import test from "node:test";
import assert from "node:assert/strict";
import { fetchThinkificData } from "../src/thinkific.js";

test("looks back far enough for a survey completed weeks before a recent exam", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const body = JSON.parse(options.body);
    calls.push(body);
    const survey = Boolean(body.variables.surveyFilter);
    return { ok: true, status: 200, json: async () => ({ data: { site: {
      [survey ? "surveySubmissions" : "quizSubmissions"]: { nodes: [] }
    } } }) };
  });
  await fetchThinkificData("synthetic-token", new Date("2026-09-28T06:00:00Z"));
  assert.equal(calls[0].variables.surveyFilter.completedAt.from, "2026-08-27T06:00:00.000Z");
  assert.equal(calls.length, 4);
  for (const call of calls.slice(1)) assert.equal(call.variables.quizFilter.completedAt.from, "2026-09-26T06:00:00.000Z");
});

test("missing or full query results stop instead of silently dropping records", async (t) => {
  for (const nodes of [undefined, Array.from({ length: 100 }, () => ({}))]) {
    t.mock.method(globalThis, "fetch", async () => ({ ok: true, status: 200,
      json: async () => ({ data: { site: { surveySubmissions: { nodes } } } })
    }));
    await assert.rejects(fetchThinkificData("synthetic-token"), /reporting stopped/);
    t.mock.restoreAll();
  }
});
