// Read-only API diagnostics. Never logs credentials or student records, and
// never imports reporting/email code. Used only after a failed push dry run.
const endpoint = "https://api.thinkific.com/stable/graphql";
const token = process.env.THINKIFIC_API_TOKEN;
if (!token) throw new Error("THINKIFIC_API_TOKEN is required.");

async function probe(label, query, variables = {}) {
  const start = Date.now();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(25_000)
    });
    const payload = await response.json();
    const errors = (payload.errors ?? []).map(e => ({ code: e.extensions?.code ?? "API_ERROR", message: String(e.message ?? "").slice(0,200) }));
    const connection = payload.data?.site?.quizSubmissions;
    console.log(JSON.stringify({ diagnostic: label, ms: Date.now() - start, http: response.status, errors, nodes: connection?.nodes?.length, hasNextPage: connection?.pageInfo?.hasNextPage }));
    if (payload.data?.__type) console.log(JSON.stringify({ diagnostic: label, schema: payload.data.__type }));
    return !payload.errors?.length && response.ok;
  } catch (error) {
    console.log(JSON.stringify({ diagnostic: label, ms: Date.now() - start, errorType: error.name }));
    return false;
  }
}

await probe("quiz-filter-schema", `query ReportingFilterSchema { __type(name: "QuizSubmissionFilter") { name inputFields { name type { kind name ofType { kind name ofType { kind name } } } } } }`);
const query = fields => `query ReportingDiagnostic($filter: QuizSubmissionFilter) { site { quizSubmissions(first: 1, filter: $filter) { pageInfo { hasNextPage } nodes { ${fields} } } } }`;
const from = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
await probe("quiz-unfiltered-minimal", query("id"));
await probe("quiz-course-only-minimal", query("id"), { filter: { courseIds: ["2436207"] } });
await probe("quiz-date-only-minimal", query("id"), { filter: { completedAt: { from } } });
const filter = { courseIds: ["2436207"], completedAt: { from } };
const minimal = await probe("quiz-course-date-minimal", query("id completedAt passed"), { filter });
if (minimal) {
  await probe("quiz-with-quiz-relationship", query("id completedAt passed quiz { id name }"), { filter });
  await probe("quiz-with-user-relationship", query("id completedAt passed user { gid email }"), { filter });
}
