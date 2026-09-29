import { COURSE_MAP, POLL_WINDOW_HOURS, MATCH_WINDOW_DAYS } from "./config.js";

const ENDPOINT = "https://api.thinkific.com/stable/graphql";

const SURVEY_QUERY = `
  query ReportingSurveys($surveyFilter: SurveySubmissionsFilter, $after: String) {
    site {
      surveySubmissions(first: 25, after: $after, filter: $surveyFilter) {
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
  query ReportingQuizzes($quizFilter: QuizSubmissionFilter, $after: String) {
    site {
      quizSubmissions(first: 25, after: $after, filter: $quizFilter) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          completedAt
          passed
          attempts
          quiz { id name }
          user { gid email }
        }
      }
    }
  }
`;

async function postGraphql(token, query, variables, label) {
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
        body: JSON.stringify({ query, variables }),
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
      const resetAt = Date.parse(payload.extensions?.rateLimit?.resetAt ?? "");
      const resetDelay = Number.isNaN(resetAt) ? 0 : resetAt - Date.now() + 1000;
      const delay = Math.min(65_000, Math.max(1000 * (2 ** attempt), resetDelay));
      console.warn(`Thinkific ${label}: ${rateLimited ? "rate limited" : "gateway timeout/unavailable"}; retry ${attempt + 1}/3.`);
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

async function queryCourseQuizzes(token, courseId, from) {
  const quizFilter = { courseIds: [courseId], completedAt: { from } };
  const quizzes = await queryAllPages(token, QUIZ_QUERY, { quizFilter }, "quizSubmissions", `quizzes course ${courseId}`);
  return quizzes.map((quiz) => ({ ...quiz, courseId }));
}

export async function fetchThinkificData(token, now = new Date()) {
  if (!token) throw new Error("THINKIFIC_API_TOKEN is required.");
  const from = new Date(now.getTime() - POLL_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const surveyFrom = new Date(Date.parse(from) - MATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const courseIds = Object.keys(COURSE_MAP);
  const surveys = await querySurveys(token, courseIds, surveyFrom);
  const quizzes = [];
  for (const courseId of courseIds) {
    quizzes.push(...await queryCourseQuizzes(token, courseId, from));
  }
  return { surveys, quizzes };
}
