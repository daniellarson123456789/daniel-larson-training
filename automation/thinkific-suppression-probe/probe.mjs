import { pathToFileURL } from 'node:url';

// Standalone capability check. Never import the reporting bot: even its dry
// run can send notices. This script has one fixed GET destination, no writes,
// no retries, no customer exports, and no logging of external error messages.
export const ENROLLMENTS_URL = 'https://api.thinkific.com/api/public/v1/enrollments?limit=1&page=1';
const MAX_RESPONSE_BYTES = 1024 * 1024;
const KNOWN_FIELDS = Object.freeze([
  'id', 'user_id', 'user_email', 'course_id', 'activated_at',
  'completed_at', 'expiry_date', 'percentage_completed', 'is_active', 'is_trial',
]);

function emptyReport() {
  return {
    schemaVersion: 'thinkific-enrollment-capability-v1', status: 'not_run',
    secretConfigured: false, requestsAttempted: 0, httpStatus: null,
    enrollmentReadAllowed: false, itemsArrayReceived: false,
    sampleRowCount: 0, sampleLimitHonored: false, paginationPresent: false,
    additionalPagesReported: false,
    sampleFieldPresence: Object.fromEntries(KNOWN_FIELDS.map(name => [name, false])),
    sampleChecked: false, fullSnapshot: false, ownershipReconciled: false,
    customerDataWritten: false, externalWrites: 0, emailsSent: 0,
  };
}

async function boundedJson(response) {
  if (!response.body || !/\bapplication\/json\b/i.test(response.headers.get('content-type') ?? '')) throw new Error('invalid_response');
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_RESPONSE_BYTES) throw new Error('response_too_large');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function probeEnrollments({ token, fetchImpl = globalThis.fetch } = {}) {
  const report = emptyReport();
  if (typeof token !== 'string' || !token.trim()) return { ...report, status: 'existing_secret_unavailable' };
  report.secretConfigured = true;
  report.requestsAttempted = 1;
  let response;
  try {
    response = await fetchImpl(ENROLLMENTS_URL, {
      method: 'GET', redirect: 'error',
      headers: { authorization: `Bearer ${token}`, accept: 'application/json', 'content-type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return { ...report, status: 'network_timeout_or_redirect_failure' };
  }
  report.httpStatus = Number.isInteger(response?.status) ? response.status : null;
  if (response?.status !== 200) {
    // Error bodies can contain customer information or request details. Do not
    // parse, print, save or rethrow them, even for useful-looking diagnostics.
    await response?.body?.cancel().catch(() => {});
    const status = response?.status === 401 ? 'authentication_or_plan_denied'
      : response?.status === 403 ? 'permission_denied'
      : response?.status === 404 ? 'endpoint_unavailable'
      : response?.status === 429 ? 'rate_limited'
      : 'unexpected_http_status';
    return { ...report, status };
  }
  let payload;
  try { payload = await boundedJson(response); }
  catch { return { ...report, status: 'invalid_or_oversized_json_response' }; }
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.items)) return { ...report, status: 'unexpected_response_shape' };
  report.itemsArrayReceived = true;
  report.sampleRowCount = payload.items.length;
  if (payload.items.length > 1) return { ...report, status: 'sample_limit_not_honored' };
  report.sampleLimitHonored = true;
  const pagination = payload.meta?.pagination;
  report.paginationPresent = Boolean(pagination && typeof pagination === 'object' && !Array.isArray(pagination));
  report.additionalPagesReported = Number.isInteger(pagination?.next_page) && pagination.next_page > 1;
  if (payload.items.length === 1) {
    const row = payload.items[0];
    if (!row || typeof row !== 'object' || Array.isArray(row)) return { ...report, status: 'unexpected_sample_shape' };
    report.sampleChecked = true;
    report.sampleFieldPresence = Object.fromEntries(KNOWN_FIELDS.map(name => [name, Object.hasOwn(row, name)]));
  }
  report.enrollmentReadAllowed = true;
  report.status = 'enrollment_read_verified';
  return report;
}

// Direct execution is intended only inside the isolated GitHub job. Importing
// this module for tests never accesses process.env and never runs a request.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = await probeEnrollments({ token: process.env.THINKIFIC_API_TOKEN });
    console.log(JSON.stringify(report));
    process.exitCode = report.enrollmentReadAllowed ? 0 : 1;
  } catch {
    console.log(JSON.stringify({ ...emptyReport(), status: 'internal_probe_failure' }));
    process.exitCode = 1;
  }
}
