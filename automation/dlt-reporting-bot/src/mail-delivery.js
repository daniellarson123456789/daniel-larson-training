import { randomUUID } from "node:crypto";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendMailWithRetry(mail, message, { wait = sleep, delays = [2000, 5000] } = {}) {
  const outgoing = {
    ...message,
    messageId: message.messageId || `<${randomUUID()}@daniellarsontraining.com>`
  };
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await mail.sendMail(outgoing);
    } catch (error) {
      const smtpCode = Number(error.responseCode);
      // Retry an explicit temporary rejection. An ambiguous connection failure
      // might have occurred after acceptance, so do not retry that blindly.
      if (!(smtpCode >= 400 && smtpCode < 500) || attempt >= delays.length) throw error;
      await wait(delays[attempt]);
    }
  }
}

export async function notifyWithoutBlocking(deliver, logError = console.error) {
  try {
    await deliver();
    return true;
  } catch (error) {
    logError("Admin alert could not be delivered; reporting will continue.", {
      code: error.code,
      smtpCode: error.responseCode
    });
    return false;
  }
}
