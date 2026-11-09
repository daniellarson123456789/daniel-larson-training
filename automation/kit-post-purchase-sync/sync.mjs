import { pathToFileURL } from 'node:url';
import { setTimeout as pause } from 'node:timers/promises';

// No dependencies, persistence, customer exports, message sender or imports.
// The only write route is existing-subscriber tagging with these two IDs.
const KIT = 'https://api.kit.com/v4';
const THINKIFIC = 'https://api.thinkific.com/api/public/v1';
const EXPECTED_KIT_ACCOUNT = '2988262';
export const APPLY_PHRASE = 'ADD_EXISTING_POST_EXCLUSIONS';
export const COURSE_TAGS = Object.freeze({ sales: 913293, brokerOne: 3313433, brokerTwo: 3502829, salesTag: 25573844, brokerTag: 25573845 });
const TAG_ALLOWLIST = new Set([COURSE_TAGS.salesTag, COURSE_TAGS.brokerTag]);
const MAX_PAGES = 1000, MAX_ROWS = 100000, MAX_BYTES = 4 * 1024 * 1024;
const STATES = ['active', 'inactive', 'bounced', 'complained', 'cancelled'];
const normalizeEmail = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validId = value => /^(?:[1-9]\d*)$/.test(String(value ?? ''));
const integer = value => Number.isSafeInteger(value) && value >= 0;
class SafeFailure extends Error { constructor(code) { super(code); this.code = code; } }
const fail = code => { throw new SafeFailure(code); };

function emptyReport(apply) {
  return {
    schema_version: 'post-exclusion-sync-v1', mode: apply ? 'apply' : 'dry_run', status: 'not_started',
    account_verified: false, complete_inventory: false,
    sendAllowed: false, consentInferred: false, negativeOwnershipProven: false,
    replySyncConnected: false, partialHoldsAreLiveStops: false,
    thinkific_pagination: { observedRows: 0, expectedItems: null, terminalPage: null,
      expectedPages: null, lastPageCount: 0, pageSizes: [] },
    counts: { requests: 0, thinkific_pages: 0, kit_pages: 0, tag_pages: 0, enrollments: 0,
      subscribers: 0, relevant_enrollments: 0, unmatched_identities: 0,
      identity_holds: 0, partial_broker_holds: 0, invalid_email_rows: 0,
      trial_rows_held: 0, already_tagged: 0, proposed_sales: 0, proposed_broker: 0,
      identity_changed_before_write: 0, tag_write_attempts: 0, tag_adds_confirmed: 0,
      uncertain_write_readbacks: 0, uncertain_writes_recovered: 0 },
    states: { active: 0, inactive: 0, bounced: 0, complained: 0, cancelled: 0, other: 0 },
  };
}

async function boundedJson(response) {
  if (!response.body || !/\bapplication\/json\b/i.test(response.headers.get('content-type') ?? '')) fail('invalid_json_response');
  const reader = response.body.getReader(), chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) fail('response_too_large');
      chunks.push(value);
    }
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { fail('invalid_json_response'); }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}

function apiClient({ token, key, apply, fetchImpl, pauseImpl, report }) {
  return async function request(provider, route, method = 'GET') {
    const permittedWrite = provider === 'kit' && method === 'POST' &&
      /^\/tags\/(25573844|25573845)\/subscribers\/[1-9]\d*$/.test(route);
    if (method !== 'GET' && !(apply && permittedWrite)) fail('write_guard_denied');
    if (!['kit', 'thinkific'].includes(provider) || !route.startsWith('/') || route.startsWith('//')) fail('request_guard_denied');
    if (report.counts.requests) await pauseImpl(600); // Below both providers' 120/min key limits.
    report.counts.requests++;
    let response;
    try {
      response = await fetchImpl((provider === 'kit' ? KIT : THINKIFIC) + route, {
        method, redirect: 'error', signal: AbortSignal.timeout(20000),
        headers: { accept: 'application/json', 'content-type': 'application/json',
          ...(provider === 'kit' ? { 'X-Kit-Api-Key': key } : { authorization: `Bearer ${token}` }) },
        ...(method === 'POST' ? { body: '{}' } : {}),
      });
    } catch { fail('network_timeout_or_redirect_failure'); }
    const accepted = method === 'GET' ? response.status === 200 : [200, 201].includes(response.status);
    if (!accepted) {
      await response.body?.cancel().catch(() => {});
      fail(response.status === 429 ? 'rate_limited' : response.status === 401 ? 'authentication_denied'
        : response.status === 403 ? 'permission_denied' : response.status === 404 ? 'resource_missing'
        : response.status >= 500 ? 'provider_failure' : 'unexpected_http_status');
    }
    try { return await boundedJson(response); }
    catch (error) { if (error instanceof SafeFailure) throw error; fail('invalid_or_interrupted_response'); }
  };
}

async function readEnrollments(request, report) {
  const rows = [], seenIds = new Set();
  let page = 1, expectedPages, expectedItems;
  for (let n = 0; n < MAX_PAGES; n++) {
    const data = await request('thinkific', `/enrollments?limit=250&page=${page}`);
    const p = data?.meta?.pagination;
    if (!Array.isArray(data?.items) || data.items.length > 250 || !p || p.current_page !== page ||
      !integer(p.total_pages) || !integer(p.total_items)) fail('thinkific_pagination_invalid');
    if (n === 0) { expectedPages = p.total_pages; expectedItems = p.total_items; }
    if (p.total_pages !== expectedPages || p.total_items !== expectedItems) fail('thinkific_snapshot_changed');
    report.thinkific_pagination.expectedItems = expectedItems;
    report.thinkific_pagination.expectedPages = expectedPages;
    report.thinkific_pagination.lastPageCount = data.items.length;
    report.thinkific_pagination.pageSizes.push(data.items.length);
    for (const row of data.items) {
      if (!row || !validId(row.id) || !validId(row.user_id) || !validId(row.course_id)) fail('enrollment_shape_invalid');
      if (seenIds.has(String(row.id))) fail('thinkific_duplicate_enrollment');
      seenIds.add(String(row.id));
      // Extra provider fields never leave this reader or reach the report.
      rows.push({ userId: String(row.user_id), email: normalizeEmail(row.user_email), course: Number(row.course_id), trial: row.is_trial === true });
    }
    report.counts.thinkific_pages++;
    report.thinkific_pagination.observedRows = rows.length;
    if (rows.length > MAX_ROWS) fail('inventory_limit_exceeded');
    if (p.next_page === null) {
      report.thinkific_pagination.terminalPage = page;
      if (page !== Math.max(1, expectedPages) || rows.length !== expectedItems) fail('thinkific_pagination_incomplete');
      report.counts.enrollments = rows.length;
      return rows;
    }
    if (p.next_page !== page + 1 || p.next_page > expectedPages || !data.items.length) fail('thinkific_pagination_invalid');
    page = p.next_page;
  }
  fail('inventory_limit_exceeded');
}

async function readKitPages(request, route, field, report) {
  const rows = [], cursors = new Set();
  let after = null;
  for (let n = 0; n < MAX_PAGES; n++) {
    const data = await request('kit', route + (after === null ? '' : `&after=${encodeURIComponent(after)}`));
    const p = data?.pagination;
    if (!Array.isArray(data?.[field]) || !p || typeof p.has_next_page !== 'boolean') fail('kit_pagination_invalid');
    rows.push(...data[field]);
    report.counts[field === 'tags' ? 'tag_pages' : 'kit_pages']++;
    if (rows.length > MAX_ROWS) fail('inventory_limit_exceeded');
    if (!p.has_next_page) return rows;
    if (typeof p.end_cursor !== 'string' || !p.end_cursor || cursors.has(p.end_cursor) || !data[field].length) fail('kit_cursor_invalid');
    cursors.add(p.end_cursor); after = p.end_cursor;
  }
  fail('inventory_limit_exceeded');
}

function tagIds(rows) {
  if (!Array.isArray(rows) || rows.some(row => !validId(row?.id))) fail('kit_tags_invalid');
  return new Set(rows.map(row => Number(row.id)));
}

async function readSubscribers(request, report) {
  const rows = await readKitPages(request, '/subscribers?status=all&include=tags&per_page=500&sort_field=id&sort_order=asc', 'subscribers', report);
  const subscribers = rows.map(row => {
    if (!validId(row?.id) || typeof row.state !== 'string' || !row.state || !validEmail(normalizeEmail(row.email_address))) fail('kit_subscriber_invalid');
    report.states[STATES.includes(row.state) ? row.state : 'other']++;
    return { id: String(row.id), email: normalizeEmail(row.email_address), tags: tagIds(row.tags) };
  });
  report.counts.subscribers = subscribers.length;
  return subscribers;
}

function groupBy(rows, key) {
  const groups = new Map();
  for (const row of rows) { const value = key(row); groups.set(value, [...(groups.get(value) ?? []), row]); }
  return groups;
}

function planTags(enrollments, subscribers, report) {
  const byUser = groupBy(enrollments, row => row.userId);
  const usersByEmail = groupBy(enrollments.filter(row => validEmail(row.email)), row => row.email);
  const kitByEmail = groupBy(subscribers, row => row.email), kitById = groupBy(subscribers, row => row.id);
  const actions = [];
  report.counts.invalid_email_rows = enrollments.filter(row => !validEmail(row.email)).length;
  for (const rows of byUser.values()) {
    const relevant = rows.filter(row => [COURSE_TAGS.sales, COURSE_TAGS.brokerOne, COURSE_TAGS.brokerTwo].includes(row.course));
    if (!relevant.length) continue;
    report.counts.relevant_enrollments += relevant.length;
    const emails = new Set(rows.map(row => row.email));
    const email = rows[0].email;
    if (emails.size !== 1 || !validEmail(email) || new Set((usersByEmail.get(email) ?? []).map(row => row.userId)).size !== 1) {
      report.counts.identity_holds++; continue;
    }
    const matches = kitByEmail.get(email) ?? [];
    if (!matches.length) { report.counts.unmatched_identities++; continue; }
    if (matches.length !== 1 || kitById.get(matches[0].id).length !== 1) { report.counts.identity_holds++; continue; }
    const subscriber = matches[0], courses = new Set(relevant.filter(row => !row.trial).map(row => row.course));
    report.counts.trial_rows_held += relevant.filter(row => row.trial).length;
    const one = courses.has(COURSE_TAGS.brokerOne), two = courses.has(COURSE_TAGS.brokerTwo);
    if (one !== two) report.counts.partial_broker_holds++;
    const tags = [...(courses.has(COURSE_TAGS.sales) ? [COURSE_TAGS.salesTag] : []), ...(one && two ? [COURSE_TAGS.brokerTag] : [])];
    for (const tag of tags) {
      if (!TAG_ALLOWLIST.has(tag)) fail('tag_guard_denied');
      if (subscriber.tags.has(tag)) { report.counts.already_tagged++; continue; }
      actions.push({ id: subscriber.id, email, tag });
      report.counts[tag === COURSE_TAGS.salesTag ? 'proposed_sales' : 'proposed_broker']++;
    }
  }
  return actions;
}

async function currentIdentity(request, action) {
  const data = await request('kit', `/subscribers/${action.id}`);
  return validId(data?.subscriber?.id) && String(data.subscriber.id) === action.id && normalizeEmail(data.subscriber.email_address) === action.email;
}
async function currentTags(request, action, report) {
  return tagIds(await readKitPages(request, `/subscribers/${action.id}/tags?per_page=500`, 'tags', report));
}

export async function runSync({ env = {}, fetchImpl = globalThis.fetch, pauseImpl = pause } = {}) {
  const apply = env.APPLY === APPLY_PHRASE, report = emptyReport(apply);
  try {
    if (env.APPLY && !apply) fail('invalid_apply_guard');
    if (typeof env.THINKIFIC_API_TOKEN !== 'string' || !env.THINKIFIC_API_TOKEN.trim() || typeof env.KIT_API_KEY !== 'string' || !env.KIT_API_KEY.trim()) fail('missing_credentials');
    const request = apiClient({ token: env.THINKIFIC_API_TOKEN, key: env.KIT_API_KEY, apply, fetchImpl, pauseImpl, report });
    const account = await request('kit', '/account');
    if (String(account?.account?.id) !== EXPECTED_KIT_ACCOUNT) fail('wrong_kit_account');
    report.account_verified = true;
    const enrollments = await readEnrollments(request, report);
    const subscribers = await readSubscribers(request, report);
    report.complete_inventory = true;
    const actions = planTags(enrollments, subscribers, report);
    if (!apply) { report.status = 'dry_run_complete'; return report; }
    for (const action of actions) {
      if (!(await currentIdentity(request, action))) { report.counts.identity_changed_before_write++; continue; }
      if ((await currentTags(request, action, report)).has(action.tag)) { report.counts.already_tagged++; continue; }
      // Re-read ID/email immediately before POST, after the potentially paged tag read.
      if (!(await currentIdentity(request, action))) { report.counts.identity_changed_before_write++; continue; }
      report.counts.tag_write_attempts++;
      let written;
      try {
        written = await request('kit', `/tags/${action.tag}/subscribers/${action.id}`, 'POST');
      } catch (error) {
        if (error instanceof SafeFailure && ['rate_limited', 'authentication_denied', 'permission_denied', 'resource_missing'].includes(error.code)) throw error;
        // A lost response may hide a committed write. Read back, never POST again.
        report.counts.uncertain_write_readbacks++;
        if (!(await currentIdentity(request, action)) || !(await currentTags(request, action, report)).has(action.tag)) fail('write_unconfirmed_manual_review');
        report.counts.uncertain_writes_recovered++;
        report.counts.tag_adds_confirmed++;
        continue;
      }
      if (String(written?.subscriber?.id) !== action.id || normalizeEmail(written.subscriber.email_address) !== action.email) fail('write_response_identity_mismatch');
      // Even a successful response is not counted as a confirmed exclusion
      // until the actual tag can be read. A stale list requires review, not retry.
      if (!(await currentTags(request, action, report)).has(action.tag)) fail('write_unconfirmed_manual_review');
      report.counts.tag_adds_confirmed++;
    }
    report.status = report.counts.identity_changed_before_write ? 'apply_complete_with_identity_holds' : 'apply_complete';
  } catch (error) {
    // Never surface provider bodies, URLs, IDs, email addresses, credentials or stacks.
    report.status = error instanceof SafeFailure ? error.code : 'internal_failure';
  }
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await runSync({ env: process.env });
  console.log(JSON.stringify(report));
  process.exitCode = ['dry_run_complete', 'apply_complete', 'apply_complete_with_identity_holds'].includes(report.status) ? 0 : 1;
}

