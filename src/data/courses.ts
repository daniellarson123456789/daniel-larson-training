export type CourseDirectoryItem = {
  label: string;
  href: string;
  note?: string;
};

export const salesLicensingCourses: CourseDirectoryItem[] = [
  { label: "FastPass Start Here", href: "https://portal.daniellarsontraining.com/courses/starthere", note: "Roadmap" },
  { label: "Course 1", href: "https://portal.daniellarsontraining.com/courses/course1", note: "Required pre-license course" },
  { label: "Course 1 Exam Pass", href: "https://portal.daniellarsontraining.com/courses/examprep", note: "Standard course-final / review path" },
  { label: "FastPass", href: "https://portal.daniellarsontraining.com/courses/FASTPASS", note: "FastPass certification path" },
  { label: "500 Sample Q+A", href: "https://portal.daniellarsontraining.com/courses/statelicensingexamcoursesamplequestions", note: "Practice" },
  { label: "Audio Ebook Exam Prep", href: "https://portal.daniellarsontraining.com/courses/examprep", note: "Audio review" },
  { label: "Exam Math Basics", href: "https://portal.daniellarsontraining.com/courses/math", note: "Math review" },
];

export const brokerLicensingCourses: CourseDirectoryItem[] = [
  { label: "Broker Start Here", href: "https://portal.daniellarsontraining.com/courses/brokerstarthere", note: "Roadmap" },
  { label: "Broker Course 2", href: "https://portal.daniellarsontraining.com/courses/brokercourse", note: "Required broker pre-license course" },
  { label: "Broker Course 2 Exam Pass", href: "https://portal.daniellarsontraining.com/courses/brokerexampass", note: "Standard course-final path" },
  { label: "Broker FastPass Start", href: "https://portal.daniellarsontraining.com/courses/copy-of-broker-fastpass", note: "FastPass roadmap" },
  { label: "Broker FastPass", href: "https://portal.daniellarsontraining.com/courses/brokerfastpass", note: "FastPass certification path" },
  { label: "Broker 500 Sample Q+A", href: "https://portal.daniellarsontraining.com/courses/examblast", note: "Practice" },
  { label: "Broker Audio Reviews", href: "https://portal.daniellarsontraining.com/courses/brokeraudioreviews", note: "Audio review" },
  { label: "Broker Exam Prep", href: "https://portal.daniellarsontraining.com/courses/brokerexamblast", note: "Exam review" },
  { label: "Exam Math Basics", href: "https://portal.daniellarsontraining.com/courses/math", note: "Math review" },
];

export const postLicensingCourses: CourseDirectoryItem[] = [
  { label: "Sales Post-Licensing", href: "https://portal.daniellarsontraining.com/courses/salespost", note: "Sales associates · first renewal" },
  { label: "Sales Post-Licensing Exam Pass", href: "https://portal.daniellarsontraining.com/courses/postexampass", note: "Sales post final" },
  { label: "Broker Post-Licensing — Section 1", href: "https://portal.daniellarsontraining.com/courses/take/copy-of-post-licensing-course", note: "Brokers · first renewal" },
  { label: "Broker Post-Licensing — Section 2", href: "https://portal.daniellarsontraining.com/courses/broker-post-licensing-section2", note: "Brokers · first renewal" },
];

export const continuingEducationCourses: CourseDirectoryItem[] = [
  { label: "14-Hour CE", href: "https://portal.daniellarsontraining.com/courses/14CE", note: "Sales associates + brokers" },
  { label: "14CE Exam Pass", href: "https://portal.daniellarsontraining.com/courses/14ceexampass", note: "FastPass final / renewal completion" },
];

export const examPrepOnlyCourses: CourseDirectoryItem[] = [
  { label: "Sales Exam Prep Only", href: "https://portal.daniellarsontraining.com/bundles/examprepfastpassonly", note: "Already completed Course 1 elsewhere" },
  { label: "Broker Exam Prep Only", href: "https://portal.daniellarsontraining.com/bundles/brokeruncertifiedfastpass", note: "Already completed Course 2 elsewhere" },
];
