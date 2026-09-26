import fs from "node:fs/promises";
import path from "node:path";

const EMPTY = { version: 1, processed: {} };

export async function loadLedger(filePath) {
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    if (parsed.version !== 1 || typeof parsed.processed !== "object") throw new Error("Unsupported ledger format.");
    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") return structuredClone(EMPTY);
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

export function pruneLedger(ledger, days = 60) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  for (const [key, value] of Object.entries(ledger.processed)) {
    if (new Date(value.submittedAt).getTime() < cutoff) delete ledger.processed[key];
  }
}
