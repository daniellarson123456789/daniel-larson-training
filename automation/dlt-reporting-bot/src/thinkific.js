import { COURSE_MAP, POLL_WINDOW_HOURS, MATCH_WINDOW_DAYS } from "./config.js";

const ENDPOINT = "https://api.thinkific.com/stable/graphql";
const USER_BATCH_SIZE = 100;

// The unscoped quiz resolver can time out even for first: 1. Numeric user IDs
// select a working scoped lookup; User.gid is a different identifier and must
// not be passed to QuizSubmissionFilter.userIds (it returns empty results).
const USERS_QUERY = `
  query ReportingUsers($after: String, $first: Int!) {
    site {
      users(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { id }
      }
    }
  }
`;

const SURVEY_QUERY = `
  query ReportingSurveys($surveyFilter: SurveySubmissionsFilter, $after: String, $first: Int!) {
    site {
      surveySubmissions(first: $first, after: $after, filter: $surveyFilter) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          completedAt
          course { id name }
          user { gid email }
          userAnswers(first: 5) {
            nodes {
              textResponse
              question { id position prompt }
            }
          }
        }
      }
    }
  }
`;

const QUIZ_QUERY = `
  query ReportingQuizzes($quizFilter: QuizSubmissionFilter, $after: String, $first: Int!) {
    site {
      quizSubmissions(first: $first, after: $after, filter: $quizFilter) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          completedAt
          passed
          quiz { id name }
          user { gid email }
        }
      }
    }
  }
`;

async function postGraphql(token, query, variables, label) {
  let first = 25;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    let response;
    let payload;
    try {
      response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
        body: JSON.stringify({ query, variables: { ...variables, first } }),
        signal: AbortSignal.timeout(30_000)
      });
      payload = await response.json();
    } catch (error) {
      const transient = !response || [429, 502, 503, 504].includes(response.status);
      if (!transient || attempt === 3) {
        throw new Error(`Thinkific ${label} request failed; reporting stopped.`, { cause: error });
      }
      console.warn(`Thinkific ${label}: temporary connection/response failure; retry ${attempt + 1}/3.`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (2 ** attempt)));
      continue;
    }
    const rateLimited = response.status === 429 || payload.errors?.some((error) => error.extensions?.code === "RATE_LIMITED");
    const gatewayFailure = [502, 503, 504].includes(response.status) || payload.errors?.some((error) => error.extensions?.code === "GATEWAY_TIMEOUT");
    if ((rateLimited || gatewayFailure) && attempt < 3) {
      if (gatewayFailure) first = Math.max(1, Math.floor(first / 5));
      const resetAt = rateLimited ? Date.parse(payload.extensions?.rateLimit?.resetAt ?? "") : NaN;
      const resetDelay = Number.isNaN(resetAt) ? 0 : resetAt - Date.now() + 1000;
      const delay = Math.min(65_000, Math.max(1000 * (2 ** attempt), resetDelay));
      console.warn(`Thinkific ${label}: ${rateLimited ? "rate limited" : "gateway timeout/unavailable"}; retry ${attempt + 1}/3, page size ${first}.`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    if (!response.ok || payload.errors?.length) {
      const codes = payload.errors?.map((error) => error.extensions?.code ?? "API_ERROR").join(", ");
      throw new Error(`Thinkific ${label} API error: ${codes || response.status}; reporting stopped.`);
    }
    return payload.data?.site ?? {};
  }
  throw new Error("Thinkific API rate limit did not clear.");
}

async function querySurveys(token, courseIds, from) {
  const surveyFilter = { courseIds, completedAt: { from } };
  return queryAllPages(token, SURVEY_QUERY, { surveyFilter }, "surveySubmissions", "surveys");
}

async function queryAllPages(token, query, variables, field, label) {
  const records = new Map();
  const cursors = new Set();
  let after = null;
  for (let page = 0; page < 100; page += 1) {
    const site = await postGraphql(token, query, { ...variables, after }, label);
    const connection = site[field];
    if (!Array.isArray(connection?.nodes) || typeof connection?.pageInfo?.hasNextPage !== "boolean") {
      throw new Error(`Thinkific ${label} response/pagination is missing; reporting stopped.`);
    }
    for (const node of connection.nodes) {
      if (!node?.id) throw new Error(`Thinkific ${label} record ID is missing; reporting stopped.`);
      records.set(String(node.id), node);
    }
    if (!connection.pageInfo.hasNextPage) return [...records.values()];
    const cursor = connection.pageInfo.endCursor;
    if (!connection.nodes.length || typeof cursor !== "string" || !cursor || cursors.has(cursor)) {
      throw new Error(`Thinkific ${label} pagination did not advance; reporting stopped.`);
    }
    cursors.add(cursor);
    after = cursor;
  }
  throw new Error(`Thinkific ${label} exceeded 100 pages; reporting stopped for review.`);
}

async function queryCourseQuizzes(token, courseId, from, userIds) {
  if (!userIds.length) throw new Error("An unscoped exam lookup is not permitted.");
  const quizFilter = { courseIds: [courseId], completedAt: { from }, userIds };
  const quizzes = await queryAllPages(token, QUIZ_QUERY, { quizFilter }, "quizSubmissions", `quizzes course ${courseId}`);
  return quizzes.map((quiz) => ({ ...quiz, courseId }));
}

export async function fetchThinkificData(token, now = new Date()) {
  if (!token) throw new Error("THINKIFIC_API_TOKEN is required.");
  const from = new Date(now.getTime() - POLL_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const surveyFrom = new Date(Date.parse(from) - MATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const courseIds = Object.keys(COURSE_MAP);
  const surveys = await querySurveys(token, courseIds, surveyFrom);
  // Fetch every user, not only survey respondents: a passed exam without a
  // matching survey still needs to produce the existing reporting exception.
  const users = await queryAllPages(token, USERS_QUERY, {}, "users", "user directory");
  const userIds = users.map(user => String(user.id));
  if (userIds.some(id => !/^\d+$/.test(id))) {
    throw new Error("Thinkific user directory did not return numeric IDs; reporting stopped.");
  }
  if (surveys.length && !userIds.length) {
    throw new Error("Thinkific user directory is empty despite survey records; reporting stopped.");
  }
  const quizzes = [];
  for (const courseId of courseIds) {
    for (let start = 0; start < userIds.length; start += USER_BATCH_SIZE) {
      quizzes.push(...await queryCourseQuizzes(token, courseId, from, userIds.slice(start, start + USER_BATCH_SIZE)));
    }
  }
  return { surveys, quizzes, userCount: userIds.length };
}
