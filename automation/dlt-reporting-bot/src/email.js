import nodemailer from "nodemailer";
import { dbprDate } from "./records.js";
import { sendMailWithRetry } from "./mail-delivery.js";

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
  const mail = transporter(env);
  await sendMailWithRetry(mail, {
    from: `Daniel Larson Training <${env.SMTP_USER}>`,
    to: candidate.studentEmail,
    replyTo: env.SMTP_USER,
    subject: "Your course completion was reported to Florida DBPR",
    text: [
      `Hello ${candidate.firstName},`,
      "",
      "Thank you for choosing Daniel Larson Training to complete your required real estate education.",
      "",
      `Your ${candidate.thinkificCourseName} completion was reported to Florida DBPR.`,
      `Completion date: ${dbprDate(candidate.completedAt)}`,
      `License: ${candidate.license.full}`,
      "",
      "DBPR may take up to 48 hours to finish processing the record.",
      "",
      "Completing your education does not automatically renew your license, so be sure to complete the renewal process at https://www.myfloridalicense.com before your license expires.",
      "",
      "If you felt it was as Fast, Easy, and Simple as possible, please tell your friends! Our biggest source of growth is referrals!",
      "",
      "Thank you for coming our way,",
      "",
      "Daniel Larson",
      "Daniel Larson Training",
      "239-471-8500",
      "https://daniellarsontraining.com"
    ].join("\n")
  });
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
