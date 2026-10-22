// Selected, verbatim excerpts from individual Trustpilot reviews.
// Dates are publication dates. Topic labels describe only what the reviewer confirms.
// Maintain this list manually; it is not a live TrustScore or review-count feed.
export const trustpilotProfileUrl = "https://www.trustpilot.com/review/daniellarsontraining.com";

export const reviews = {
  alejandro: {
    name: "Alejandro Hinostroza",
    excerpt: "This was a very effective coursework that allowed me to pass the Florida State Exam.",
    topic: "Florida state-exam preparation",
    url: "https://www.trustpilot.com/reviews/6ad7fd76b7e46dd0d32d3776",
    date: "2026-10-21",
    dateLabel: "October 21, 2026",
    rating: 5,
  },
  mike: {
    name: "Mike",
    excerpt: "He made it so easy to learn the material through the written version then the video.",
    topic: "Written + video instruction",
    url: "https://www.trustpilot.com/reviews/6ad7e1566804a4ff30dc43db",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    rating: 5,
  },
  catalina: {
    name: "Catalina Grisalez",
    excerpt: "His method of teaching, explaining, thorough examples to assist his students to understand this industry is outstanding.",
    topic: "Broker licensing student",
    url: "https://www.trustpilot.com/reviews/6ad7c261dd53c1f686bf0f8e",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    rating: 5,
  },
  john: {
    name: "John Colin Simoneau",
    excerpt: "great information and quick replies.",
    topic: "Course information + support",
    url: "https://www.trustpilot.com/reviews/6ad7b5da844c403076fb3a7c",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    rating: 5,
  },
  cheryl: {
    name: "Cheryl V",
    excerpt: "I could do a little bit at a time during my lunch breaks when I had time.",
    topic: "Flexible study",
    url: "https://www.trustpilot.com/reviews/6ad7b1ceb64b7c7d04ab8e08",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    rating: 5,
  },
  jessica: {
    name: "Jessica Ann Linville",
    excerpt: "The course was so easy to navigate, follow along and quick to get to the finish line!",
    topic: "Course navigation",
    url: "https://www.trustpilot.com/reviews/6ad7b0511aa85a375c2daba4",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    rating: 5,
  },
  gabrielle: {
    name: "Gabrielle Jene",
    excerpt: "This real estate school has been truly amazing. I graduated in 2024 and was able to renew my license today.",
    topic: "45-hour Sales Post-Licensing",
    url: "https://www.trustpilot.com/reviews/6ad8227726d13ed6589c9fd0",
    date: "2026-10-21",
    dateLabel: "October 21, 2026",
    rating: 5,
  },
  tim: {
    name: "Tim Kennedy, PA",
    excerpt: "Very user-friendly and I was able to accomplish my continuing education requirements efficiently and quickly.",
    topic: "Continuing education",
    url: "https://www.trustpilot.com/reviews/6ad8d8bf194ff1689b3b3fcc",
    date: "2026-10-21",
    dateLabel: "October 21, 2026",
    rating: 5,
  },
  cassidy: {
    name: "cassidyy m",
    excerpt: "Daniel is the best and always answers if you need any help or have questions!",
    topic: "Direct instructor support",
    url: "https://www.trustpilot.com/reviews/6ada24c1bc8d5fac051b9dae",
    date: "2026-10-22",
    dateLabel: "October 22, 2026",
    rating: 5,
  },
} as const;

export const reviewSelections = {
  school: {
    title: "Student experiences on Trustpilot",
    intro: "Selected customer reviews about licensing, renewal education, and instructor support. Read the full reviews on Trustpilot.",
    ids: ["alejandro", "mike", "cassidy", "catalina", "gabrielle", "tim"],
  },
  broker: {
    title: "Broker licensing feedback + student experiences",
    intro: "Feedback from a current broker licensing student, plus reviews of teaching, study materials, and support across the school.",
    ids: ["catalina", "mike", "cassidy", "cheryl", "alejandro", "john"],
  },
  post: {
    title: "Post-Licensing feedback + student experiences",
    intro: "Feedback from a 45-hour Sales Post-Licensing student, plus reviews of flexible study, course navigation, and school support.",
    ids: ["gabrielle", "cassidy", "cheryl", "mike", "jessica", "john"],
  },
  ce: {
    title: "CE feedback + student experiences",
    intro: "Feedback on completing continuing education, plus reviews of flexible study, course navigation, and school support.",
    ids: ["tim", "cassidy", "cheryl", "mike", "jessica", "john"],
  },
} as const;

export type ReviewContext = keyof typeof reviewSelections;
