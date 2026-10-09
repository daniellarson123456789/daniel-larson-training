export type Product = {
  id: string;
  name: string;
  shortName: string;
  price: number;
  couponCode?: string;
  discountAmount?: number;
  category: "sales" | "broker" | "post" | "ce" | "exam-prep";
  checkoutUrl: string;
};

export const products: Record<string, Product> = {
  salesCourse1: {
    id: "sales-course-1",
    name: "Florida 63-Hour Sales Associate Course 1",
    shortName: "Course 1",
    price: 240,
    couponCode: "FP200",
    discountAmount: 200,
    category: "sales",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/course1?coupon=FP200",
  },
  salesFastPass: {
    id: "sales-fastpass",
    name: "Sales FastPass",
    shortName: "FastPass",
    price: 340,
    couponCode: "FP200",
    discountAmount: 200,
    category: "sales",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/fastpass1?coupon=FP200",
  },
  salesFastPassPost: {
    id: "sales-fastpass-post",
    name: "FastPass + Post-Licensing",
    shortName: "FastPass + Post",
    price: 440,
    couponCode: "FP200",
    discountAmount: 200,
    category: "sales",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/ADDPOST1?coupon=FP200",
  },
  brokerCourse2: {
    id: "broker-course-2",
    name: "Florida 72-Hour Broker Course 2",
    shortName: "Course 2",
    price: 240,
    couponCode: "FP200",
    discountAmount: 200,
    category: "broker",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/brokerexamblast?coupon=FP200",
  },
  brokerFastPass: {
    id: "broker-fastpass",
    name: "Broker FastPass",
    shortName: "Broker FastPass",
    price: 340,
    couponCode: "FP200",
    discountAmount: 200,
    category: "broker",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/brokerfastpass?coupon=FP200",
  },
  brokerCareerLaunch: {
    id: "broker-career-launch",
    name: "Broker Career Launch",
    shortName: "Broker Career Launch",
    price: 440,
    couponCode: "FP200",
    discountAmount: 200,
    category: "broker",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/broker-career-launch?coupon=FP200",
  },
  salesPost: {
    id: "sales-post",
    name: "45-Hour Sales Post-Licensing",
    shortName: "Sales Post",
    price: 130,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/post-licensing",
  },
  brokerPost: {
    id: "broker-post",
    name: "60-Hour Broker Post-Licensing",
    shortName: "Broker Post",
    price: 160,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/broker-post-licensing",
  },
  ce14: {
    id: "14-hour-ce",
    name: "Florida 14-Hour Continuing Education",
    shortName: "14-Hour CE",
    price: 65,
    category: "ce",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/14ce",
  },
  salesExamPrep: {
    id: "sales-exam-prep",
    name: "Florida Sales Associate Exam Prep",
    shortName: "Sales Exam Prep",
    price: 160,
    category: "exam-prep",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/examprepfastpassonly",
  },
  brokerExamPrep: {
    id: "broker-exam-prep",
    name: "Florida Broker Exam Prep",
    shortName: "Broker Exam Prep",
    price: 160,
    category: "exam-prep",
    checkoutUrl: "https://portal.daniellarsontraining.com/bundles/brokeruncertifiedfastpass",
  },
};
