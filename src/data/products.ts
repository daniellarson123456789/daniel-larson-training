export type Product = {
  id: string;
  name: string;
  shortName: string;
  price: number;
  category: "sales" | "broker" | "post" | "ce" | "exam-prep";
  checkoutUrl: string;
};


export const salePrice = (product: Product) => product.price;

export const products: Record<string, Product> = {
  salesCourse1: {
    id: "sales-course-1",
    name: "Florida 63-Hour Sales Associate Course 1",
    shortName: "Course 1",
    price: 180,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/course1`,
  },
  salesFastPass: {
    id: "sales-fastpass",
    name: "Sales FastPass",
    shortName: "FastPass",
    price: 260,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/fastpass1`,
  },
  salesFastPassPost: {
    id: "sales-fastpass-post",
    name: "FastPass + Post-Licensing",
    shortName: "FastPass + Post",
    price: 340,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/ADDPOST1`,
  },
  brokerCourse2: {
    id: "broker-course-2",
    name: "Florida 72-Hour Broker Course 2",
    shortName: "Course 2",
    price: 180,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/brokerexamblast`,
  },
  brokerFastPass: {
    id: "broker-fastpass",
    name: "Broker FastPass",
    shortName: "Broker FastPass",
    price: 260,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/brokerfastpass`,
  },
  brokerCareerLaunch: {
    id: "broker-career-launch",
    name: "Broker Career Launch",
    shortName: "Broker Career Launch",
    price: 340,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/broker-career-launch`,
  },
  salesPost: {
    id: "sales-post",
    name: "45-Hour Sales Post-Licensing",
    shortName: "Sales Post",
    price: 100,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/enroll/2621565",
  },
  brokerPost: {
    id: "broker-post",
    name: "60-Hour Broker Post-Licensing",
    shortName: "Broker Post",
    price: 130,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/enroll/3642987",
  },
  ce14: {
    id: "14-hour-ce",
    name: "Florida 14-Hour Continuing Education",
    shortName: "14-Hour CE",
    price: 25,
    category: "ce",
    checkoutUrl: `https://portal.daniellarsontraining.com/enroll/2621207`,
  },
  salesExamPrep: {
    id: "sales-exam-prep",
    name: "Florida Sales Associate Exam Prep",
    shortName: "Sales Exam Prep",
    price: 130,
    category: "exam-prep",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/examprepfastpassonly",
  },
  brokerExamPrep: {
    id: "broker-exam-prep",
    name: "Florida Broker Exam Prep",
    shortName: "Broker Exam Prep",
    price: 130,
    category: "exam-prep",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/brokeruncertifiedfastpass",
  },
};

