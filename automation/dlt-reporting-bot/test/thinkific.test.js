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
      [survey ? "surveySubmissions" : "quizSubmissions"]: { nodes: [], pageInfo: { hasNextPage: false } }
    } } }) };
  });
  await fetchThinkificData("synthetic-token", new Date("2026-09-28T06:00:00Z"));
  assert.equal(calls[0].variables.surveyFilter.completedAt.from, "2026-08-27T06:00:00.000Z");
  assert.equal(calls.length, 4);
  for (const call of calls.slice(1)) assert.equal(call.variables.quizFilter.completedAt.from, "2026-09-26T06:00:00.000Z");
});

test("missing results or pagination stop instead of silently dropping records", async (t) => {
  for (const connection of [{}, { nodes: [] }, { nodes: [{}], pageInfo: { hasNextPage: false } }]) {
    t.mock.method(globalThis, "fetch", async () => ({ ok: true, status: 200,
      json: async () => ({ data: { site: { surveySubmissions: connection } } })
    }));
    await assert.rejects(fetchThinkificData("synthetic-token"), /reporting stopped/);
    t.mock.restoreAll();
  }
});

function response(connection, survey = true) {
  return { ok: true, status: 200, json: async () => ({ data: { site: {
    [survey ? "surveySubmissions" : "quizSubmissions"]: connection
  } } }) };
}

test("reads all pages with unchanged filters and deduplicates overlapping records", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const body = JSON.parse(options.body);
    calls.push(body);
    assert.match(body.query, /first: \$first, after: \$after/);
    assert.equal(body.variables.first, 25);
    const survey = Boolean(body.variables.surveyFilter);
    const prefix = survey ? "survey" : body.variables.quizFilter.courseIds[0];
    return response(body.variables.after === null
      ? { nodes: [{ id: `${prefix}-1` }], pageInfo: { hasNextPage: true, endCursor: "next" } }
      : { nodes: [{ id: `${prefix}-1` }, { id: `${prefix}-2` }], pageInfo: { hasNextPage: false } }, survey);
  });
  const result = await fetchThinkificData("synthetic-token");
  assert.equal(result.surveys.length, 2);
  assert.equal(result.quizzes.length, 6);
  assert.equal(calls.length, 8);
  for (let i = 0; i < calls.length; i += 2) {
    assert.equal(calls[i].variables.after, null);
    assert.equal(calls[i + 1].variables.after, "next");
    const filter = i === 0 ? "surveyFilter" : "quizFilter";
    assert.deepEqual(calls[i].variables[filter], calls[i + 1].variables[filter]);
  }
});

test("a repeating cursor or absent next cursor stops reporting", async (t) => {
  for (const endCursor of [null, "same"]) {
    t.mock.method(globalThis, "fetch", async () => response({
      nodes: [{ id: "synthetic" }], pageInfo: { hasNextPage: true, endCursor }
    }));
    await assert.rejects(fetchThinkificData("synthetic-token"), /pagination did not advance/);
    t.mock.restoreAll();
  }
});

test("retries a GraphQL gateway timeout and a non-JSON 503 then recovers", async (t) => {
  const delays = [];
  const sizes = [];
  t.mock.method(globalThis, "setTimeout", (callback, delay) => { delays.push(delay); callback(); });
  t.mock.method(console, "warn", () => {});
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    calls += 1;
    sizes.push(JSON.parse(options.body).variables.first);
    if (calls === 1) return { ok: true, status: 200, json: async () => ({ errors: [{ extensions: { code: "GATEWAY_TIMEOUT" } }] }) };
    if (calls === 2) return { ok: false, status: 503, json: async () => { throw new SyntaxError("non-JSON"); } };
    return response({ nodes: [], pageInfo: { hasNextPage: false } }, Boolean(JSON.parse(options.body).variables.surveyFilter));
  });
  await fetchThinkificData("synthetic-token");
  assert.equal(calls, 6);
  assert.deepEqual(delays, [1000, 2000]);
  assert.deepEqual(sizes.slice(0, 3), [25, 5, 5]);
});

test("persistent gateway failures exhaust four attempts without accepting partial data", async (t) => {
  const delays = [];
  const sizes = [];
  t.mock.method(globalThis, "setTimeout", (callback, delay) => { delays.push(delay); callback(); });
  t.mock.method(console, "warn", () => {});
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    calls += 1;
    sizes.push(JSON.parse(options.body).variables.first);
    return { ok: true, status: 200, json: async () => ({
      data: { site: { surveySubmissions: { nodes: [], pageInfo: { hasNextPage: false } } } },
      extensions: { rateLimit: { resetAt: new Date(Date.now() + 60000).toISOString() } },
      errors: [{ extensions: { code: "GATEWAY_TIMEOUT" } }]
    }) };
  });
  await assert.rejects(fetchThinkificData("synthetic-token"), /GATEWAY_TIMEOUT; reporting stopped/);
  assert.equal(calls, 4);
  assert.deepEqual(sizes, [25, 5, 1, 1]);
  assert.deepEqual(delays, [1000, 2000, 4000]);
});

test("authorization failures are not retried", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls += 1;
    return { ok: false, status: 401, json: async () => ({ errors: [{ extensions: { code: "UNAUTHORIZED" } }] }) };
  });
  await assert.rejects(fetchThinkificData("synthetic-token"), /UNAUTHORIZED/);
  assert.equal(calls, 1);
});
