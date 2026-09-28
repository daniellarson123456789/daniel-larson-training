import { COURSE_MAP, POLL_WINDOW_HOURS, MATCH_WINDOW_DAYS } from "./config.js";

const ENDPOINT = "https://api.thinkific.com/stable/graphql";

const SURVEY_QUERY = `
  query ReportingSurveys($surveyFilter: SurveySubmissionsFilter) {
    site {
      surveySubmissions(first: 100, filter: $surveyFilter) {
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
  query ReportingQuizzes($quizFilter: QuizSubmissionFilter) {
    site {
      quizSubmissions(first: 100, filter: $quizFilter) {
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

async function postGraphql(token, query, variables) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({ query, variables })
    });
    const payload = await response.json();
    const rateLimited = response.status === 429 || payload.errors?.some((error) => error.extensions?.code === "RATE_LIMITED");
    if (rateLimited && attempt < 3) {
      const resetAt = Date.parse(payload.extensions?.rateLimit?.resetAt ?? "");
      const resetDelay = Number.isNaN(resetAt) ? 0 : resetAt - Date.now() + 1000;
      const delay = Math.min(65_000, Math.max(1000 * (2 ** attempt), resetDelay));
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    if (!response.ok || payload.errors?.length) {
      throw new Error(`Thinkific API error: ${JSON.stringify(payload.errors ?? payload)}`);
    }
    return payload.data?.site ?? {};
  }
  throw new Error("Thinkific API rate limit did not clear.");
}

async function querySurveys(token, courseIds, from) {
  const surveyFilter = { courseIds, completedAt: { from } };
  const site = await postGraphql(token, SURVEY_QUERY, { surveyFilter });
  return checkedNodes(site.surveySubmissions?.nodes, "survey");
}

function checkedNodes(nodes, kind) {
  if (!Array.isArray(nodes)) throw new Error(`Thinkific ${kind} response is missing; reporting stopped.`);
  // The current query requests 100 records. Stop rather than silently ignore
  // records if volume reaches this limit; pagination must then be configured.
  if (nodes.length >= 100) throw new Error(`Thinkific ${kind} query reached its 100-record limit; reporting stopped for review.`);
  return nodes;
}

async function queryCourseQuizzes(token, courseId, from) {
  const quizFilter = { courseIds: [courseId], completedAt: { from } };
  const quizSite = await postGraphql(token, QUIZ_QUERY, { quizFilter });
  return checkedNodes(quizSite.quizSubmissions?.nodes, "quiz").map((quiz) => ({ ...quiz, courseId }));
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
