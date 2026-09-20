export type Testimonial = {
  name: string;
  audience: "sales" | "broker" | "general";
  quote: string;
  context?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Von Howard",
    audience: "general",
    context: "Fort Myers · Managing Broker",
    quote: "FastPass is, hands down, the fastest, easiest way to prepare and get certified for the licensing exam. When you have questions, Daniel will be available — actually Daniel — not a customer service person. Outstanding personalized service.",
  },
  {
    name: "John S.",
    audience: "sales",
    context: "Cape Coral · Broker Associate",
    quote: "The Florida exams are tough, but his practice exams are close to the real PearsonVUE exam. FastPass is the slam dunk. I walked into PearsonVUE ready to go.",
  },
  {
    name: "Silvia P.",
    audience: "sales",
    context: "Miami · New Sales Associate",
    quote: "I PASSED!! Thank you!! You made it so easy. FastPass is very similar to the real exam.",
  },
  {
    name: "Mike McMurray",
    audience: "general",
    context: "SWFL & The Islands · Broker",
    quote: "I'm not an exam person, but Larson got me through it. I send everyone to him, including my daughter and team members. They all move fast through the content, and pass.",
  },
  {
    name: "Willy the Closer",
    audience: "broker",
    context: "Estero · Independent Broker",
    quote: "Did Course 2 + Exam Prep, then added FastPass — opened my own brokerage. Daniel's got all the stuff. Follow the system.",
  },
  {
    name: "Alyssa L.",
    audience: "sales",
    context: "Bonita Springs",
    quote: "Took the exam last Monday and passed. I literally heard his explanations in my head as I was taking the test. I will send EVERYONE to this guy.",
  },
];
