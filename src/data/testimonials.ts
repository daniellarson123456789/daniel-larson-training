export type Testimonial = {
  name: string;
  audience: "sales" | "broker" | "general";
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Von Howard",
    audience: "general",
    quote: "FastPass made the process simple, and Daniel was actually available when I needed help.",
  },
  {
    name: "John S.",
    audience: "sales",
    quote: "The practice and explanations prepared me for the licensing exam and made the process much more manageable.",
  },
  {
    name: "Silvia P.",
    audience: "sales",
    quote: "I passed, and the FastPass preparation felt very similar to the real exam experience.",
  },
  {
    name: "Mike McMurray",
    audience: "general",
    quote: "I send people I know to Daniel because the system helps them move through the process and pass.",
  },
  {
    name: "Willy the Closer",
    audience: "broker",
    quote: "I completed Course 2 and FastPass, earned my broker license, and opened my brokerage. Follow the system.",
  },
  {
    name: "Alyssa L.",
    audience: "sales",
    quote: "Daniel picked up when I needed help, and the explanations stayed with me when it was time to test.",
  },
];
