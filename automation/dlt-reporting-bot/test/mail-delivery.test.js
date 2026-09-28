import test from "node:test";
import assert from "node:assert/strict";
import { notifyWithoutBlocking, sendMailWithRetry } from "../src/mail-delivery.js";

test("recovers from Gmail 451 with bounded retries and the same message ID", async () => {
  const sent = [];
  const delays = [];
  const mail = { sendMail: async (message) => {
    sent.push(message);
    if (sent.length < 3) throw Object.assign(new Error("Temporary rejection"), { responseCode: 451 });
    return { accepted: ["admin@example.com"] };
  } };
  const result = await sendMailWithRetry(mail, { to: "admin@example.com", text: "Notice" }, { wait: async (ms) => delays.push(ms) });
  assert.deepEqual(result.accepted, ["admin@example.com"]);
  assert.deepEqual(delays, [2000, 5000]);
  assert.equal(new Set(sent.map((message) => message.messageId)).size, 1);
});

test("does not repeatedly retry a permanent rejection or uncertain network failure", async () => {
  for (const error of [Object.assign(new Error("Rejected"), { responseCode: 550 }), new Error("Connection closed")]) {
    let calls = 0;
    await assert.rejects(sendMailWithRetry({ sendMail: async () => { calls += 1; throw error; } }, {}, { wait: async () => assert.fail("unexpected retry") }), (actual) => actual === error);
    assert.equal(calls, 1);
  }
});

test("an exhausted admin alert returns without throwing and logs no private details", async () => {
  let attempts = 0;
  const warnings = [];
  const delivered = await notifyWithoutBlocking(() => sendMailWithRetry({ sendMail: async () => {
    attempts += 1;
    throw Object.assign(new Error("451 temporary rejection for private@example.com"), { responseCode: 451, code: "EMESSAGE" });
  } }, {}, { wait: async () => {} }), (...args) => warnings.push(args));
  assert.equal(delivered, false);
  assert.equal(attempts, 3);
  assert.equal(warnings.length, 1);
  assert.equal(JSON.stringify(warnings).includes("private@example.com"), false);
});
