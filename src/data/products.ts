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
    price: 240,
    couponCode: "license200",
    discountAmount: 200,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/course1?coupon=license200`,
  },
  salesFastPass: {
    id: "sales-fastpass",
    name: "Sales FastPass",
    shortName: "FastPass",
    price: 340,
    couponCode: "fp260",
    discountAmount: 260,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/fastpass1?coupon=fp260`,
  },
  salesFastPassPost: {
    id: "sales-fastpass-post",
    name: "FastPass + Post-Licensing",
    shortName: "FastPass + Post",
    price: 440,
    couponCode: "careerbundle340",
    discountAmount: 340,
    category: "sales",
    checkoutUrl: `https://portal.daniellarsontraining.com/enroll/2270667?coupon=careerbundle340`,
  },
  brokerCourse2: {
    id: "broker-course-2",
    name: "Florida 72-Hour Broker Course 2",
    shortName: "Course 2",
    price: 240,
    couponCode: "license200",
    discountAmount: 200,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/brokerexamblast?coupon=license200`,
  },
  brokerFastPass: {
    id: "broker-fastpass",
    name: "Broker FastPass",
    shortName: "Broker FastPass",
    price: 340,
    couponCode: "BKFP240",
    discountAmount: 240,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/brokerfastpass?coupon=BKFP240`,
  },
  brokerCareerLaunch: {
    id: "broker-career-launch",
    name: "Broker Career Launch",
    shortName: "Broker Career Launch",
    price: 440,
    couponCode: "careerbundle320",
    discountAmount: 320,
    category: "broker",
    checkoutUrl: `https://portal.daniellarsontraining.com/bundles/broker-career-launch?coupon=careerbundle320`,
  },
  salesPost: {
    id: "sales-post",
    name: "45-Hour Sales Post-Licensing",
    shortName: "Sales Post",
    price: 130,
    couponCode: "post91",
    discountAmount: 91,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/enroll/2621565?coupon=post91",
  },
  brokerPost: {
    id: "broker-post",
    name: "60-Hour Broker Post-Licensing",
    shortName: "Broker Post",
    price: 160,
    couponCode: "bkpost101",
    discountAmount: 101,
    category: "post",
    checkoutUrl: "https://portal.daniellarsontraining.com/enroll/3642987?coupon=bkpost101",
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

