import nodemailer from "nodemailer";
import { dbprDate } from "./records.js";
import { sendMailWithRetry } from "./mail-delivery.js";

const STUDENT_COURSE_NAMES = Object.freeze({
  "2436207": "14-Hour Continuing Education",
  "2436300": "Sales Post-Licensing",
  "3313434": "Broker Post-Licensing"
});

const FACEBOOK_PROFILE_URL = "https://www.facebook.com/dan.larson.7169/";
const FACEBOOK_REVIEW_REQUEST = "Please also share an honest review of your experience in a Facebook post and tag us.";

function studentConfirmationHtml(text) {
  return text.split("\n\n")
    .filter(paragraph => paragraph !== `Facebook: ${FACEBOOK_PROFILE_URL}`)
    .map(paragraph => {
      let content = paragraph.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;")
        .replaceAll("\n", "<br>");
      if (paragraph === FACEBOOK_REVIEW_REQUEST) {
        content = content.replace("tag us.", `<a href="${FACEBOOK_PROFILE_URL}">tag us</a>.`);
      }
      for (const url of [
        "https://www.myfloridalicense.com",
        "https://www.trustpilot.com/review/daniellarsontraining.com",
        "https://daniellarsontraining.com"
      ]) {
        content = content.replaceAll(url, `<a href="${url}">${url}</a>`);
      }
      return `<p>${content}</p>`;
    }).join("\n");
}

function transporter(env) {
  if (!env.SMTP_USER || !env.SMTP_APP_PASSWORD) throw new Error("SMTP credentials are required.");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_APP_PASSWORD }
  });
}

export async function sendStudentConfirmation(candidate, env = process.env) {
  const courseName = STUDENT_COURSE_NAMES[String(candidate.thinkificCourseId)];
  if (!courseName) throw new Error("Student confirmation course is not mapped.");
  const mail = transporter(env);
  const message = {
    from: `Daniel Larson Training <${env.SMTP_USER}>`,
    to: candidate.studentEmail,
    replyTo: env.SMTP_USER,
    subject: "Your course completion was reported to Florida DBPR",
    text: [
      `Hello ${candidate.firstName},`,
      "",
      "Thank you for choosing Daniel Larson Training for your required real estate education.",
      "",
      `Your ${courseName} completion was reported to Florida DBPR.`,
      `Completion date: ${dbprDate(candidate.completedAt)}`,
      `License: ${candidate.license.full}`,
      "",
      "DBPR may take up to 48 hours to finish processing the record.",
      "",
      "Completing your education does not automatically renew your license, so be sure to complete the renewal process at https://www.myfloridalicense.com before your license expires.",
      "",
      "Would you take a moment to share an honest review of your experience on Trustpilot? Your feedback helps future students choose a school and helps us improve our courses.",
      "",
      "Leave a review: https://www.trustpilot.com/review/daniellarsontraining.com",
      "",
      FACEBOOK_REVIEW_REQUEST,
      "",
      `Facebook: ${FACEBOOK_PROFILE_URL}`,
      "",
      "Thank you for coming our way,",
      "",
      "Daniel Larson",
      "Daniel Larson Training",
      "239-471-8500",
      "https://daniellarsontraining.com"
    ].join("\n")
  };
  await sendMailWithRetry(mail, { ...message, html: studentConfirmationHtml(message.text) });
}

export async function sendAdminNotice(subject, lines, env = process.env, attachments = []) {
  const mail = transporter(env);
  await sendMailWithRetry(mail, {
    from: `DLT Reporting Bot <${env.SMTP_USER}>`,
    to: env.ADMIN_EMAIL || env.SMTP_USER,
    subject,
    text: lines.join("\n"),
    attachments
  });
}
