import fs from "node:fs/promises";
import path from "node:path";
import { createHmac } from "node:crypto";

const EMPTY = { version: 1, processed: {}, notifiedExceptions: {} };
const isMap = value => value !== null && typeof value === "object" && !Array.isArray(value);

export async function loadLedger(filePath, { required = false } = {}) {
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    if (!isMap(parsed) || parsed.version !== 1 || !isMap(parsed.processed) ||
      (parsed.notifiedExceptions !== undefined && !isMap(parsed.notifiedExceptions))) {
      throw new Error("Unsupported ledger format; reporting stopped.");
    }
    parsed.notifiedExceptions ??= {};
    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") {
      if (required) throw new Error("Reporting history is missing; reporting stopped to prevent duplicate submissions. Restore the latest ledger before retrying.");
      return structuredClone(EMPTY);
    }
    throw error;
  }
}

export async function saveLedger(filePath, ledger) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temp = `${filePath}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(ledger, null, 2)}\n`, { mode: 0o600 });
  await fs.rename(temp, filePath);
}

export function markProcessed(ledger, key, result) {
  ledger.processed[key] = {
    submittedAt: new Date().toISOString(),
    dbprCourseNumber: result.dbprCourseNumber,
    status: result.status
  };
}

export function exceptionKey(exception, hmacKey) {
  if (!hmacKey) throw new Error("LEDGER_HMAC_KEY is required.");
  return createHmac("sha256", hmacKey)
    .update(JSON.stringify(["exception", String(exception.quizSubmissionId), exception.reason]))
    .digest("hex");
}

export function unnotifiedExceptions(ledger, exceptions, hmacKey) {
  const seen = new Set(Object.keys(ledger.notifiedExceptions));
  return exceptions.filter(item => {
    const key = exceptionKey(item, hmacKey);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function markExceptionsNotified(ledger, exceptions, hmacKey) {
  for (const item of exceptions) ledger.notifiedExceptions[exceptionKey(item, hmacKey)] = new Date().toISOString();
}

export function pruneLedger(ledger, days = 60) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  for (const [key, value] of Object.entries(ledger.processed)) {
    if (new Date(value.submittedAt).getTime() < cutoff) delete ledger.processed[key];
  }
  for (const [key, value] of Object.entries(ledger.notifiedExceptions)) {
    if (new Date(value).getTime() < cutoff) delete ledger.notifiedExceptions[key];
  }
}
