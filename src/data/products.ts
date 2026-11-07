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

export const ceSale = { code: "ce1314", discountAmount: 52 } as const;

export const salePrice = (product: Product) => product.price - (product.discountAmount ?? 0);

export const products: Record<string, Product> = {
  salesCourse1: {
    id: "sales-course-1",
    name: "Florida 63-Hour Sales Associate Course 1",
    shortName: "Course 1",
    price: 220,
    couponCode: "fastpass100",
    discountAmount: 100,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/course1?coupon=fastpass100`,
  },
  salesFastPass: {
    id: "sales-fastpass",
    name: "Sales FastPass",
    shortName: "FastPass",
    price: 320,
    couponCode: "fastpass100",
    discountAmount: 100,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/fastpass1?coupon=fastpass100`,
  },
  salesFastPassPost: {
    id: "sales-fastpass-post",
    name: "FastPass + Post-Licensing",
    shortName: "FastPass + Post",
    price: 380,
    couponCode: "fastpass100",
    discountAmount: 100,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/ADDPOST1?coupon=fastpass100`,
  },
  brokerCourse2: {
    id: "broker-course-2",
    name: "Florida 72-Hour Broker Course 2",
    shortName: "Course 2",
    price: 220,
    couponCode: "fastpass100",
    discountAmount: 100,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/brokerexamblast?coupon=fastpass100`,
  },
  brokerFastPass: {
    id: "broker-fastpass",
    name: "Broker FastPass",
    shortName: "Broker FastPass",
    price: 320,
    couponCode: "fastpass100",
    discountAmount: 100,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/brokerfastpass?coupon=fastpass100`,
  },
  brokerCareerLaunch: {
    id: "broker-career-launch",
    name: "Broker Career Launch",
    shortName: "Broker Career Launch",
    price: 380,
    couponCode: "fastpass100",
    discountAmount: 100,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/broker-career-launch?coupon=fastpass100`,
  },
  salesPost: {
    id: "sales-post",
    name: "45-Hour Sales Post-Licensing",
    shortName: "Sales Post",
    price: 130,
    couponCode: "post30",
    discountAmount: 30,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/enroll/2621565?coupon=post30",
  },
  brokerPost: {
    id: "broker-post",
    name: "60-Hour Broker Post-Licensing",
    shortName: "Broker Post",
    price: 160,
    couponCode: "post30",
    discountAmount: 30,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/enroll/3642987?coupon=post30",
  },
  ce14: {
    id: "14-hour-ce",
    name: "Florida 14-Hour Continuing Education",
    shortName: "14-Hour CE",
    price: 65,
    couponCode: ceSale.code,
    discountAmount: ceSale.discountAmount,
    category: "ce",
    checkoutUrl: `https://portal.daniellarsontraining.com/enroll/2621207?coupon=${ceSale.code}`,
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

