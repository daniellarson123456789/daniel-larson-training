import test from "node:test";
import assert from "node:assert/strict";
import { fetchThinkificData } from "../src/thinkific.js";
import { matchCandidates } from "../src/records.js";

test("looks back far enough for a survey completed weeks before a recent exam", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const body = JSON.parse(options.body);
    calls.push(body);
    const survey = Boolean(body.variables.surveyFilter);
    const users = body.query.includes("query ReportingUsers(");
    return { ok: true, status: 200, json: async () => ({ data: { site: {
      [users ? "users" : survey ? "surveySubmissions" : "quizSubmissions"]: { nodes: users ? [{ id: "1001" }] : [], pageInfo: { hasNextPage: false } }
    } } }) };
  });
  await fetchThinkificData("synthetic-token", new Date("2026-09-28T06:00:00Z"));
  assert.equal(calls[0].variables.surveyFilter.completedAt.from, "2026-08-27T06:00:00.000Z");
  assert.equal(calls.length, 5);
  for (const call of calls.filter(c => c.variables.quizFilter)) {
    assert.equal(call.variables.quizFilter.completedAt.from, "2026-09-26T06:00:00.000Z");
    assert.deepEqual(call.variables.quizFilter.userIds, ["1001"]);
  }
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

function response(connection, survey = true, users = false) {
  return { ok: true, status: 200, json: async () => ({ data: { site: {
    [users ? "users" : survey ? "surveySubmissions" : "quizSubmissions"]: connection
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
    const users = body.query.includes("query ReportingUsers(");
    if (users) return response(body.variables.after === null
      ? { nodes: [{ id: "1001" }], pageInfo: { hasNextPage: true, endCursor: "next" } }
      : { nodes: [{ id: "1001" }, { id: "1002" }], pageInfo: { hasNextPage: false } }, false, true);
    if (!survey) assert.deepEqual(body.variables.quizFilter.userIds, ["1001", "1002"]);
    const prefix = survey ? "survey" : body.variables.quizFilter.courseIds[0];
    return response(body.variables.after === null
      ? { nodes: [{ id: `${prefix}-1` }], pageInfo: { hasNextPage: true, endCursor: "next" } }
      : { nodes: [{ id: `${prefix}-1` }, { id: `${prefix}-2` }], pageInfo: { hasNextPage: false } }, survey);
  });
  const result = await fetchThinkificData("synthetic-token");
  assert.equal(result.surveys.length, 2);
  assert.equal(result.quizzes.length, 6);
  assert.equal(result.userCount, 2);
  assert.equal(calls.length, 10);
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
    const body = JSON.parse(options.body);
    const users = body.query.includes("query ReportingUsers(");
    return response({ nodes: users ? [{ id: "1001" }] : [], pageInfo: { hasNextPage: false } }, Boolean(body.variables.surveyFilter), users);
  });
  await fetchThinkificData("synthetic-token");
  assert.equal(calls, 7);
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

test("all directory pages and user batches are covered, including a passing student without a survey", async (t) => {
  const ids = Array.from({ length: 205 }, (_, i) => String(1000 + i));
  const batches = new Map();
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const { query, variables } = JSON.parse(options.body);
    if (variables.surveyFilter) return response({ nodes: [], pageInfo: { hasNextPage: false } });
    if (query.includes("query ReportingUsers(")) {
      const start = Number(variables.after ?? 0);
      const next = start + variables.first;
      return response({ nodes: ids.slice(start, next).map(id => ({ id })), pageInfo: {
        hasNextPage: next < ids.length, endCursor: String(next)
      } }, false, true);
    }
    const { courseIds, userIds } = variables.quizFilter;
    assert.ok(userIds.length > 0 && userIds.length <= 100);
    batches.set(courseIds[0], [...(batches.get(courseIds[0]) ?? []), ...userIds]);
    const found = courseIds[0] === "2436207" && userIds.includes(ids.at(-1));
    return response({ nodes: found ? [{ id: "synthetic-missing-survey-exam", passed: true,
      completedAt: "2026-09-29T04:00:00Z", user: { gid: "synthetic-gid" }, quiz: { name: "Final Exam" }
    }] : [], pageInfo: { hasNextPage: false } }, false);
  });
  const result = await fetchThinkificData("synthetic-token", new Date("2026-09-29T05:00:00Z"));
  assert.equal(result.userCount, 205);
  assert.equal(batches.size, 3);
  for (const batch of batches.values()) assert.deepEqual(batch, ids);
  assert.equal(result.quizzes.length, 1);
  const matched = matchCandidates(result.quizzes, result.surveys);
  assert.equal(matched.exceptions.length, 1);
  assert.match(matched.exceptions[0].reason, /No preceding license survey/);
});

test("invalid or unexpectedly empty user directories stop instead of declaring there are no exams", async (t) => {
  for (const users of [[], [{ id: "gid://synthetic/1234" }]]) {
    t.mock.method(globalThis, "fetch", async (_url, options) => {
      const body = JSON.parse(options.body);
      if (body.variables.surveyFilter) return response({ nodes: [{ id: "synthetic-survey" }], pageInfo: { hasNextPage: false } });
      assert.ok(body.query.includes("query ReportingUsers("), "No exam lookup should occur with an invalid directory");
      return response({ nodes: users, pageInfo: { hasNextPage: false } }, false, true);
    });
    await assert.rejects(fetchThinkificData("synthetic-token"), /user directory.*reporting stopped/);
    t.mock.restoreAll();
  }
});
