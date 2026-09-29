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
    if (payload.data?.__type) {
      const schema = payload.data.__type;
      if (schema.fields) schema.fields = schema.fields.filter(f => /user|enrollment|quiz|^id$|^gid$/i.test(f.name));
      console.log(JSON.stringify({ diagnostic: label, schema }));
    }
    return !payload.errors?.length && response.ok ? payload.data : null;
  } catch (error) {
    console.log(JSON.stringify({ diagnostic: label, ms: Date.now() - start, errorType: error.name }));
    return false;
  }
}

const userSchema = await probe("user-schema", `query ReportingUserSchema { __type(name: "User") { name fields { name type { kind name ofType { kind name } } } } }`);
const query = fields => `query ReportingDiagnostic($filter: QuizSubmissionFilter) { site { quizSubmissions(first: 1, filter: $filter) { pageInfo { hasNextPage } nodes { ${fields} } } } }`;
const from = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
const hasId = userSchema?.__type?.fields?.some(f => f.name === "id");
const surveys = await probe("recent-survey-user-lookup", `query ReportingSurveyUsers($filter: SurveySubmissionsFilter) { site { surveySubmissions(first: 25, filter: $filter) { nodes { user { ${hasId ? "id" : ""} gid } } } } }`, { filter: { courseIds: ["2436207"], completedAt: { from } } });
const users = (surveys?.site?.surveySubmissions?.nodes ?? []).map(n => n.user).filter(Boolean);
const userIds = [...new Set(users.map(u => u.id).filter(Boolean))];
console.log(JSON.stringify({ diagnostic: "survey-user-id-shapes", count: users.length, hasId, idIsNumeric: users.map(u => /^\d+$/.test(String(u.id ?? ""))), gidIsNumeric: users.map(u => /^\d+$/.test(String(u.gid ?? ""))) }));
if (userIds.length) {
  const filter = { courseIds: ["2436207"], completedAt: { from }, userIds: [userIds[0]] };
  await probe("quiz-one-legacy-user-full", query("id completedAt passed quiz { id name } user { gid email }"), { filter });
  await probe("quiz-legacy-user-batch-full", query("id completedAt passed quiz { id name } user { gid email }"), { filter: { ...filter, userIds } });
}
await probe("user-directory-minimal", `query ReportingUsers { site { users(first: 1) { pageInfo { hasNextPage endCursor } nodes { ${hasId ? "id" : ""} gid } } } }`);
