import { COURSE_MAP, POLL_WINDOW_HOURS } from "./config.js";

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
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(`Thinkific API error: ${JSON.stringify(payload.errors ?? payload)}`);
  }
  return payload.data?.site ?? {};
}

async function queryCourse(token, courseId, from) {
  const surveyFilter = { courseIds: [courseId], completedAt: { from } };
  const quizFilter = { courseIds: [courseId], completedAt: { from } };
  const [surveySite, quizSite] = await Promise.all([
    postGraphql(token, SURVEY_QUERY, { surveyFilter }),
    postGraphql(token, QUIZ_QUERY, { quizFilter })
  ]);
  return {
    surveys: surveySite.surveySubmissions?.nodes ?? [],
    quizzes: (quizSite.quizSubmissions?.nodes ?? []).map((quiz) => ({ ...quiz, courseId }))
  };
}

export async function fetchThinkificData(token, now = new Date()) {
  if (!token) throw new Error("THINKIFIC_API_TOKEN is required.");
  const from = new Date(now.getTime() - POLL_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const courseIds = Object.keys(COURSE_MAP);
  const results = await Promise.all(courseIds.map((courseId) => queryCourse(token, courseId, from)));
  return {
    surveys: results.flatMap((result) => result.surveys),
    quizzes: results.flatMap((result) => result.quizzes)
  };
}
