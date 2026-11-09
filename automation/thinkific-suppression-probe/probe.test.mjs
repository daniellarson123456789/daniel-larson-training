import test from 'node:test';
import assert from 'node:assert/strict';
import { ENROLLMENTS_URL, probeEnrollments } from './probe.mjs';

const fakeToken = 'synthetic-test-secret';
const sample = { id: 11, user_id: 22, user_email: 'synthetic@example.invalid', course_id: 33, expiry_date: null, completed_at: null };
const response = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const run = (body, status = 200) => probeEnrollments({ token: fakeToken, fetchImpl: async () => response(body, status) });

test('missing secret makes no request', async () => {
  let called = false;
  const report = await probeEnrollments({ fetchImpl: async () => { called = true; } });
  assert.equal(called, false);
  assert.equal(report.status, 'existing_secret_unavailable');
});
test('fixed read-only request uses existing Bearer shape and never redirects credentials', async () => {
  let request;
  const report = await probeEnrollments({ token: fakeToken, fetchImpl: async (...args) => { request = args; return response({ items: [sample], meta: { pagination: { next_page: 2 } } }); } });
  assert.equal(request[0], ENROLLMENTS_URL);
  assert.equal(request[1].method, 'GET');
  assert.equal(request[1].redirect, 'error');
  assert.equal(request[1].headers.authorization, `Bearer ${fakeToken}`);
  assert.equal('body' in request[1], false);
  assert.equal(report.enrollmentReadAllowed, true);
  assert.equal(report.sampleFieldPresence.user_id, true);
  assert.equal(report.sampleFieldPresence.is_trial, false);
  assert.equal(report.additionalPagesReported, true);
  assert.equal(report.fullSnapshot, false);
  assert.equal(report.externalWrites, 0);
  assert.equal(report.emailsSent, 0);
  for (const forbidden of [fakeToken, sample.user_email, '"id":11', '"user_id":22']) assert.equal(JSON.stringify(report).includes(forbidden), false);
});
test('empty sample verifies read capability but never proves nonownership', async () => {
  const report = await run({ items: [], meta: { pagination: { next_page: null } } });
  assert.equal(report.enrollmentReadAllowed, true);
  assert.equal(report.sampleChecked, false);
  assert.equal(report.ownershipReconciled, false);
});
test('error bodies cannot leak and auth denial does not claim the token is invalid', async () => {
  const report = await run({ error: `${fakeToken} ${sample.user_email}` }, 401);
  assert.equal(report.status, 'authentication_or_plan_denied');
  assert.equal(report.httpStatus, 401);
  assert.equal(JSON.stringify(report).includes(fakeToken), false);
  assert.equal(JSON.stringify(report).includes(sample.user_email), false);
});
test('network error details containing secrets or student data are discarded', async () => {
  const report = await probeEnrollments({ token: fakeToken, fetchImpl: async () => { throw new Error(`${fakeToken} ${sample.user_email}`); } });
  assert.equal(report.status, 'network_timeout_or_redirect_failure');
  assert.equal(JSON.stringify(report).includes(fakeToken), false);
});
test('unexpected bodies, extra records and nonobject samples do not claim capability', async () => {
  assert.equal((await run({ error: sample })).status, 'unexpected_response_shape');
  assert.equal((await run({ items: [sample, sample] })).status, 'sample_limit_not_honored');
  assert.equal((await run({ items: [null] })).status, 'unexpected_sample_shape');
});
test('malformed or oversized JSON is suppressed, not printed', async () => {
  const bad = await probeEnrollments({ token: fakeToken, fetchImpl: async () => new Response('not json: synthetic@example.invalid', { headers: { 'content-type': 'application/json' } }) });
  const large = await run({ items: [{ ...sample, excess: 'x'.repeat(1024 * 1024) }] });
  assert.equal(bad.status, 'invalid_or_oversized_json_response');
  assert.equal(large.status, 'invalid_or_oversized_json_response');
});
test('permission denial and rate limiting are reported without retries', async () => {
  assert.equal((await run({}, 403)).status, 'permission_denied');
  const limited = await run({}, 429);
  assert.equal(limited.status, 'rate_limited');
  assert.equal(limited.requestsAttempted, 1);
});
