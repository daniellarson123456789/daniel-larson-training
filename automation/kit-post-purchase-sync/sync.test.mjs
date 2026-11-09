import test from 'node:test';
import assert from 'node:assert/strict';
import { runSync, APPLY_PHRASE, COURSE_TAGS as C } from './sync.mjs';

const env = { THINKIFIC_API_TOKEN: 'synthetic-thinkific-secret', KIT_API_KEY: 'synthetic-kit-secret' };
const email = 'person@example.invalid';
const enrollment = (overrides = {}) => ({ id: 101, user_id: 201, user_email: email, course_id: C.sales, is_free_trial: false, ...overrides });
const subscriber = (overrides = {}) => ({ id: 301, email_address: email, state: 'active', tags: [], ...overrides });
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
const page = (rows, more = false, cursor = 'last') => ({ subscribers: rows, pagination: { has_next_page: more, end_cursor: cursor } });

function service({ enrollments = [enrollment()], subscribers = [subscriber()], thinkPageSize = 250, kitPageSize = 500, intercept } = {}) {
  const calls = [], applied = new Map(subscribers.map(row => [String(row.id), new Set(row.tags.map(t => t.id))]));
  const fetchImpl = async (raw, options) => {
    const url = new URL(raw), call = { url, options }; calls.push(call);
    const replacement = await intercept?.(call, { calls, applied });
    if (replacement) return replacement;
    assert.equal(options.redirect, 'error');
    if (url.hostname === 'api.thinkific.com') {
      assert.equal(options.method, 'GET');
      assert.equal(options.headers.authorization, `Bearer ${env.THINKIFIC_API_TOKEN}`);
      assert.ok(url.searchParams.has('query[email]'));
      const scoped = enrollments.filter(row => row.user_email.trim().toLowerCase() === url.searchParams.get('query[email]'));
      const n = Number(url.searchParams.get('page')), total = Math.ceil(scoped.length / thinkPageSize);
      return json({ items: scoped.slice((n - 1) * thinkPageSize, n * thinkPageSize), meta: { pagination: { current_page: n, next_page: n < total ? n + 1 : null, total_pages: total, total_items: scoped.length } } });
    }
    assert.equal(url.hostname, 'api.kit.com');
    assert.equal(options.headers['X-Kit-Api-Key'], env.KIT_API_KEY);
    if (url.pathname === '/v4/account') return json({ account: { id: 2988262 } });
    if (url.pathname === '/v4/subscribers') {
      assert.equal(url.searchParams.get('status'), 'all');
      assert.equal(url.searchParams.get('include'), 'tags');
      const offset = Number(url.searchParams.get('after') ?? 0);
      return json(page(subscribers.slice(offset, offset + kitPageSize), offset + kitPageSize < subscribers.length, String(offset + kitPageSize)));
    }
    const tags = /^\/v4\/subscribers\/(\d+)\/tags$/.exec(url.pathname);
    if (tags) return json({ tags: [...(applied.get(tags[1]) ?? [])].map(id => ({ id })), pagination: { has_next_page: false, end_cursor: null } });
    const identity = /^\/v4\/subscribers\/(\d+)$/.exec(url.pathname);
    if (identity) return json({ subscriber: subscribers.find(row => String(row.id) === identity[1]) });
    const tag = /^\/v4\/tags\/(\d+)\/subscribers\/(\d+)$/.exec(url.pathname);
    if (tag && options.method === 'POST') {
      assert.equal(options.body, '{}');
      assert.ok([C.salesTag, C.brokerTag].includes(Number(tag[1])));
      applied.get(tag[2]).add(Number(tag[1]));
      return json({ subscriber: subscribers.find(row => String(row.id) === tag[2]) }, 201);
    }
    throw new Error('Unexpected synthetic route');
  };
  return { fetchImpl, calls, applied };
}
const run = (s, apply = false, overrides = {}) => runSync({ env: { ...env, ...(apply ? { APPLY: APPLY_PHRASE } : {}) }, fetchImpl: s.fetchImpl, pauseImpl: async () => {}, ...overrides });
const writes = s => s.calls.filter(c => c.options.method !== 'GET');

test('default dry run completes both pagination chains and never writes', async () => {
  const s = service({ thinkPageSize: 1, kitPageSize: 1,
    enrollments: [enrollment(), enrollment({ id: 102, user_id: 202, user_email: 'broker@example.invalid', course_id: C.brokerOne }), enrollment({ id: 103, user_id: 202, user_email: 'broker@example.invalid', course_id: C.brokerTwo })],
    subscribers: [subscriber(), subscriber({ id: 302, email_address: 'broker@example.invalid' })] });
  const r = await run(s);
  assert.equal(r.status, 'dry_run_complete'); assert.equal(r.scoped_inventory_complete, true);
  assert.equal(r.schema_version, 'post-exclusion-sync-v2'); assert.equal(r.school_inventory_complete, false);
  assert.equal(r.inventory_scope, 'unambiguous_existing_kit_subscriber_email_scopes');
  assert.ok(Number.isFinite(Date.parse(r.checked_at)));
  assert.equal(r.counts.thinkific_pages, 3); assert.equal(r.counts.kit_pages, 2);
  assert.equal(r.counts.proposed_sales, 1); assert.equal(r.counts.proposed_broker, 1);
  assert.equal(r.counts.scoped_email_queries_completed, 2); assert.equal(writes(s).length, 0);
  for (const flag of ['sendAllowed', 'consentInferred', 'negativeOwnershipProven', 'replySyncConnected', 'partialHoldsAreLiveStops']) assert.equal(r[flag], false);
});
test('explicit apply adds only an active existing-ID exclusion', async () => {
  const s = service();
  const r = await run(s, true);
  assert.equal(r.status, 'apply_complete'); assert.equal(r.counts.tag_adds_confirmed, 1);
  assert.deepEqual(writes(s).map(c => c.url.pathname), [`/v4/tags/${C.salesTag}/subscribers/301`]);
  assert.equal(writes(s)[0].options.body, '{}');
  const preceding = s.calls[s.calls.indexOf(writes(s)[0]) - 1];
  assert.equal(preceding.url.pathname, '/v4/subscribers/301');
});
test('rerun with a stale list still reads current tags and skips duplicate writes', async () => {
  const s = service();
  assert.equal((await run(s, true)).counts.tag_adds_confirmed, 1);
  const second = await run(s, true);
  assert.equal(second.counts.tag_adds_confirmed, 0); assert.equal(second.counts.already_tagged, 1);
  assert.equal(writes(s).length, 1);
});
test('missing customers are never created; plus aliases are not folded', async () => {
  const s = service({ subscribers: [subscriber({ email_address: 'person+alias@example.invalid' })] });
  const r = await run(s, true);
  assert.equal(r.counts.enrollments, 0); assert.equal(r.counts.proposed_sales, 0); assert.equal(writes(s).length, 0);
  const query = s.calls.find(c => c.url.hostname === 'api.thinkific.com').url.searchParams.get('query[email]');
  assert.equal(query, 'person+alias@example.invalid'); assert.equal(r.negativeOwnershipProven, false);
});
test('trim/case normalization matches without broadening identity', async () => {
  const s = service({ enrollments: [enrollment({ user_email: ' PERSON@EXAMPLE.INVALID ' })] });
  assert.equal((await run(s)).counts.proposed_sales, 1);
});
test('partial Broker Post remains a hold, not a complete ownership tag', async () => {
  const s = service({ enrollments: [enrollment({ course_id: C.brokerOne })] });
  const r = await run(s, true);
  assert.equal(r.counts.partial_broker_holds, 1); assert.equal(r.counts.proposed_broker, 0); assert.equal(writes(s).length, 0);
});
test('different Thinkific identities sharing an email cannot combine Broker sections', async () => {
  const s = service({ enrollments: [enrollment({ course_id: C.brokerOne }), enrollment({ id: 102, user_id: 202, course_id: C.brokerTwo })] });
  const r = await run(s, true); assert.equal(r.counts.identity_holds, 2); assert.equal(writes(s).length, 0);
});
test('one Thinkific ID with inconsistent emails and duplicate Kit IDs/emails are held', async () => {
  for (const args of [
    { enrollments: [enrollment(), enrollment({ id: 102, user_email: 'other@example.invalid' })], subscribers: [subscriber(), subscriber({ id: 302, email_address: 'other@example.invalid' })] },
    { subscribers: [subscriber(), subscriber({ id: 302 })] },
    { subscribers: [subscriber(), subscriber({ email_address: 'other@example.invalid' })] },
  ]) {
    const s = service(args); assert.ok((await run(s, true)).counts.identity_holds > 0); assert.equal(writes(s).length, 0);
  }
});
test('a changed ID/email on the immediate pre-write check blocks mutation', async () => {
  let reads = 0;
  const s = service({ intercept(call) {
    if (call.url.pathname === '/v4/subscribers/301' && ++reads === 2) return json({ subscriber: subscriber({ email_address: 'changed@example.invalid' }) });
  } });
  const r = await run(s, true); assert.equal(r.counts.identity_changed_before_write, 1); assert.equal(writes(s).length, 0);
});
test('all tag pages are read before deciding a tag is missing', async () => {
  const s = service({ intercept(call) {
    if (call.url.pathname.endsWith('/301/tags')) return json(call.url.searchParams.has('after')
      ? { tags: [{ id: C.salesTag }], pagination: { has_next_page: false, end_cursor: 'last' } }
      : { tags: [{ id: 999 }], pagination: { has_next_page: true, end_cursor: 'second' } });
  } });
  const r = await run(s, true); assert.equal(r.counts.tag_pages, 2); assert.equal(r.counts.already_tagged, 1); assert.equal(writes(s).length, 0);
});
test('missing or looping pagination fails before any write', async () => {
  for (const intercept of [
    c => c.url.hostname === 'api.thinkific.com' ? json({ items: [enrollment()], meta: { pagination: { current_page: 1, next_page: 1, total_pages: 2, total_items: 2 } } }) : null,
    c => c.url.pathname === '/v4/subscribers' ? json({ subscribers: [subscriber()] }) : null,
    c => c.url.pathname === '/v4/subscribers' ? json(page([subscriber()], true, 'repeated')) : null,
  ]) { const s = service({ intercept }); assert.notEqual((await run(s, true)).status, 'apply_complete'); assert.equal(writes(s).length, 0); }
});
test('changing Thinkific totals and duplicate enrollment IDs abort a mixed snapshot', async () => {
  for (const args of [
    { thinkPageSize: 1, enrollments: [enrollment(), enrollment()] },
    { thinkPageSize: 1, enrollments: [enrollment(), enrollment({ id: 102 })], intercept(c) {
      if (c.url.hostname === 'api.thinkific.com' && c.url.searchParams.get('page') === '2') return json({ items: [enrollment({ id: 102 })], meta: { pagination: { current_page: 2, next_page: null, total_pages: 2, total_items: 3 } } });
    } },
  ]) { const s = service(args); const r = await run(s, true); assert.equal(r.scoped_inventory_complete, false); assert.equal(writes(s).length, 0); }
});
test('terminal mismatch preserves only aggregate diagnostics without relaxing completeness', async () => {
  for (const totalPages of [2, 3]) {
    const s = service({ intercept(c) {
      if (c.url.hostname !== 'api.thinkific.com') return null;
      const n = Number(c.url.searchParams.get('page'));
      return json({ items: [enrollment({ id: 100 + n })],
        meta: { pagination: { current_page: n, next_page: n === 1 ? 2 : null, total_pages: totalPages, total_items: 3 },
          private_provider_note: 'person@example.invalid synthetic-thinkific-secret 987654321' } });
    } });
    const r = await run(s, true);
    assert.equal(r.status, 'thinkific_pagination_incomplete');
    assert.deepEqual(r.thinkific_pagination, { diagnostic_scope: 'last_existing_subscriber_email_query', observedRows: 2, expectedItems: 3, terminalPage: 2, expectedPages: totalPages, lastPageCount: 1, pageSizes: [1, 1] });
    assert.equal(r.scoped_inventory_complete, false); assert.equal(r.counts.kit_pages, 1);
    assert.equal(r.counts.tag_write_attempts, 0); assert.equal(writes(s).length, 0);
    assert.deepEqual(r.trial_field_counts, { true: 0, false: 2, missing: 0, invalid: 0 });
    for (const privateValue of [email, env.THINKIFIC_API_TOKEN, '987654321']) assert.equal(JSON.stringify(r).includes(privateValue), false);
  }
});
test('429 and provider error text are never retried or logged', async () => {
  const s = service({ intercept(c) { if (c.url.hostname === 'api.thinkific.com') return json({ error: 'person@example.invalid synthetic-thinkific-secret 987654321' }, 429); } });
  const r = await run(s, true), output = JSON.stringify(r);
  assert.equal(r.status, 'rate_limited'); assert.equal(s.calls.length, 3); assert.equal(writes(s).length, 0);
  for (const privateValue of [email, env.THINKIFIC_API_TOKEN, '987654321']) assert.equal(output.includes(privateValue), false);
});
test('write rate limits stop after one attempt', async () => {
  const s = service({ intercept(c) { if (c.options.method === 'POST') return json({ error: email }, 429); } });
  const r = await run(s, true); assert.equal(r.status, 'rate_limited'); assert.equal(writes(s).length, 1);
});
test('a timed-out committed write is recovered by readback without another POST', async () => {
  const s = service({ intercept(c, { applied }) {
    if (c.options.method === 'POST') { applied.get('301').add(C.salesTag); throw new Error(`timeout ${email} ${env.KIT_API_KEY}`); }
  } });
  const r = await run(s, true); assert.equal(r.status, 'apply_complete');
  assert.equal(r.counts.uncertain_writes_recovered, 1); assert.equal(writes(s).length, 1);
  assert.equal(JSON.stringify(r).includes(email), false);
});
test('an unconfirmed timeout stops the run without a blind retry', async () => {
  const s = service({ intercept(c) { if (c.options.method === 'POST') throw new Error('lost response'); } });
  const r = await run(s, true); assert.equal(r.status, 'write_unconfirmed_manual_review');
  assert.equal(r.counts.uncertain_write_readbacks, 1); assert.equal(writes(s).length, 1);
});
test('a mismatched write-response identity stops instead of masking the conflict', async () => {
  const s = service({ intercept(c) { if (c.options.method === 'POST') return json({ subscriber: subscriber({ id: 302 }) }, 201); } });
  const r = await run(s, true); assert.equal(r.status, 'write_response_identity_mismatch');
  assert.equal(r.counts.uncertain_write_readbacks, 0); assert.equal(writes(s).length, 1);
});
test('a successful POST without an observable tag is not counted or blindly retried', async () => {
  const s = service({ intercept(c) { if (c.options.method === 'POST') return json({ subscriber: subscriber() }, 201); } });
  const r = await run(s, true); assert.equal(r.status, 'write_unconfirmed_manual_review');
  assert.equal(r.counts.tag_adds_confirmed, 0); assert.equal(writes(s).length, 1);
  assert.equal(r.counts.tag_pages, 2);
  assert.equal(r.partialHoldsAreLiveStops, false); assert.equal(r.sendAllowed, false);
});
test('secrets and an exact apply guard are required; wrong account stops before enrollments', async () => {
  const s = service();
  assert.equal((await run(s, false, { env: {} })).status, 'missing_credentials');
  assert.equal((await run(s, false, { env: { ...env, APPLY: 'true' } })).status, 'invalid_apply_guard');
  assert.equal(s.calls.length, 0);
  const wrong = service({ intercept(c) { if (c.url.pathname === '/v4/account') return json({ account: { id: 987654321 } }); } });
  assert.equal((await run(wrong, true)).status, 'wrong_kit_account'); assert.equal(wrong.calls.length, 1);
});
test('empty collections are complete and yield no negative eligibility or imports', async () => {
  const s = service({ enrollments: [], subscribers: [] });
  const r = await run(s, true); assert.equal(r.status, 'apply_complete'); assert.equal(r.scoped_inventory_complete, true);
  assert.equal(r.school_inventory_complete, false); assert.equal(r.counts.scoped_email_queries, 0);
  assert.equal(s.calls.some(c => c.url.hostname === 'api.thinkific.com'), false);
  assert.equal(r.counts.proposed_sales, 0); assert.equal(writes(s).length, 0);
  assert.equal('eligible_to_market' in r, false);
});
test('untrusted status strings and error bodies never become output keys or values', async () => {
  const s = service({ subscribers: [subscriber({ state: 'person@example.invalid 987654321' })] });
  const r = await run(s); assert.equal(r.states.other, 1); assert.equal(JSON.stringify(r).includes(email), false);
  const malformed = service({ intercept(c) { if (c.url.pathname === '/v4/subscribers') return new Response(email, { headers: { 'content-type': 'text/html' } }); } });
  assert.equal((await run(malformed)).status, 'invalid_json_response');
});
test('explicit trial evidence is held and cannot create a full-course exclusion', async () => {
  const s = service({ enrollments: [enrollment({ is_free_trial: true })] });
  const r = await run(s, true); assert.equal(r.counts.trial_rows_held, 1); assert.equal(writes(s).length, 0);
  assert.deepEqual(r.trial_field_counts, { true: 1, false: 0, missing: 0, invalid: 0 });
});
test('only exact is_free_trial false permits ownership; missing and invalid values remain unknown holds', async () => {
  for (const invalid of [undefined, null, 'false', 0, {}]) {
    const row = enrollment({ is_free_trial: invalid, is_trial: false });
    if (invalid === undefined) delete row.is_free_trial;
    const s = service({ enrollments: [row] }), r = await run(s, true);
    assert.equal(r.counts.unknown_trial_rows_held, 1); assert.equal(r.counts.proposed_sales, 0);
    assert.equal(r.counts.trial_rows_held, 0); assert.equal(writes(s).length, 0);
    assert.equal(r.trial_field_counts[invalid === undefined ? 'missing' : 'invalid'], 1);
  }
  const s = service({ enrollments: [enrollment({ is_free_trial: false, is_trial: true })] });
  const r = await run(s, true); assert.equal(r.counts.tag_adds_confirmed, 1);
  assert.deepEqual(r.trial_field_counts, { true: 0, false: 1, missing: 0, invalid: 0 });
});
test('trial field diagnostics survive terminal pagination failure for all four categories', async () => {
  const missing = enrollment({ id: 103 }); delete missing.is_free_trial;
  const rows = [enrollment({ is_free_trial: true }), enrollment({ id: 102 }), missing, enrollment({ id: 104, is_free_trial: null })];
  const s = service({ intercept(c) {
    if (c.url.hostname === 'api.thinkific.com') return json({ items: rows, meta: { pagination: { current_page: 1, next_page: null, total_pages: 1, total_items: 5 } } });
  } });
  const r = await run(s, true); assert.equal(r.status, 'thinkific_pagination_incomplete');
  assert.deepEqual(r.trial_field_counts, { true: 1, false: 1, missing: 1, invalid: 1 });
  assert.equal(r.scoped_inventory_complete, false); assert.equal(writes(s).length, 0);
});
test('cancelled subscribers are scanned read-only but never proposed or tagged', async () => {
  const s = service({ subscribers: [subscriber({ state: 'cancelled' })] });
  const r = await run(s, true);
  assert.equal(r.scoped_inventory_complete, true); assert.equal(r.counts.scoped_email_queries_completed, 1);
  assert.equal(r.counts.enrollments, 1); assert.equal(r.states.cancelled, 1);
  assert.equal(r.counts.non_active_subscribers_skipped, 1); assert.equal(r.counts.proposed_sales, 0);
  assert.equal(writes(s).length, 0);
});
test('cancellation immediately before the write blocks a previously active subscriber', async () => {
  let reads = 0;
  const s = service({ intercept(c) {
    if (c.url.pathname === '/v4/subscribers/301' && ++reads === 2) return json({ subscriber: subscriber({ state: 'cancelled' }) });
  } });
  const r = await run(s, true); assert.equal(r.counts.state_changed_before_write, 1);
  assert.equal(writes(s).length, 0); assert.equal(r.counts.tag_adds_confirmed, 0);
});
test('duplicate Kit identities are held before email-filtered queries', async () => {
  const s = service({ subscribers: [subscriber(), subscriber({ id: 302 })] });
  const r = await run(s, true); assert.equal(r.counts.kit_identity_rows_held, 2);
  assert.equal(r.counts.scoped_email_queries, 0); assert.equal(writes(s).length, 0);
  assert.equal(r.school_inventory_complete, false);
});
test('a returned email outside its exact query stops all writes, even after a valid scope', async () => {
  const s = service({ subscribers: [subscriber(), subscriber({ id: 302, email_address: 'second@example.invalid' })], intercept(c) {
    if (c.url.hostname === 'api.thinkific.com' && c.url.searchParams.get('query[email]') === 'second@example.invalid') return json({ items: [enrollment({ id: 102, user_email: 'unrelated@example.invalid' })], meta: { pagination: { current_page: 1, next_page: null, total_pages: 1, total_items: 1 } } });
  } });
  const r = await run(s, true); assert.equal(r.status, 'thinkific_filter_identity_mismatch');
  assert.equal(r.counts.scoped_email_queries_completed, 1); assert.equal(r.counts.filter_identity_holds, 1);
  assert.equal(r.scoped_inventory_complete, false); assert.equal(writes(s).length, 0);
});
test('zero pages cannot describe a nonempty enrollment inventory', async () => {
  const s = service({ intercept(c) {
    if (c.url.hostname === 'api.thinkific.com') return json({ items: [enrollment()], meta: { pagination: { current_page: 1, next_page: null, total_pages: 0, total_items: 1 } } });
  } });
  const r = await run(s, true);
  assert.equal(r.status, 'thinkific_pagination_invalid');
  assert.equal(r.scoped_inventory_complete, false); assert.equal(writes(s).length, 0);
});
test('all Kit and per-email source pages finish before the first write', async () => {
  const s = service({ kitPageSize: 1, thinkPageSize: 1,
    subscribers: [subscriber(), subscriber({ id: 302, email_address: 'second@example.invalid' })],
    enrollments: [enrollment(), enrollment({ id: 102, user_id: 202, user_email: 'second@example.invalid', course_id: C.brokerOne }), enrollment({ id: 103, user_id: 202, user_email: 'second@example.invalid', course_id: C.brokerTwo })] });
  const r = await run(s, true); assert.equal(r.counts.tag_adds_confirmed, 2);
  const firstWrite = s.calls.findIndex(c => c.options.method === 'POST');
  const sourceReads = s.calls.map((c, i) => ({ c, i })).filter(({ c }) => c.url.hostname === 'api.thinkific.com');
  assert.equal(sourceReads.length, 3); assert.ok(sourceReads.every(({ i }) => i < firstWrite));
  assert.equal(r.counts.scoped_email_queries_completed, 2); assert.equal(r.school_inventory_complete, false);
});

