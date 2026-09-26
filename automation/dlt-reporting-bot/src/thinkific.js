import { COURSE_MAP, POLL_WINDOW_HOURS } from "./config.js";

const ENDPOINT = "https://api.thinkific.com/stable/graphql";

const QUERY = `
  query ReportingData(
    $surveyFilter: SurveySubmissionsFilter,
    $quizFilter: QuizSubmissionFilter
  ) {
    site {
      surveySubmissions(first: 100, filter: $surveyFilter) {
        nodes {
          id
          completedAt
          course { id name }
          user { gid email }
          userAnswers(first: 10) {
            nodes {
              textResponse
              question { id position prompt }
            }
          }
        }
      }
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

async function queryCourse(token, courseId, from) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        surveyFilter: { courseIds: [courseId], completedAt: { from } },
        quizFilter: { courseIds: [courseId], completedAt: { from } }
      }
    })
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(`Thinkific API error: ${JSON.stringify(payload.errors ?? payload)}`);
  }
  return {
    surveys: payload.data?.site?.surveySubmissions?.nodes ?? [],
    quizzes: (payload.data?.site?.quizSubmissions?.nodes ?? []).map((quiz) => ({ ...quiz, courseId }))
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
