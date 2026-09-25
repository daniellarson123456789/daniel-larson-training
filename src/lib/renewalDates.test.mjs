import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateRenewalDates } from './renewalDates.mjs';

test('moves back from the second anniversary to the prior renewal date', () => {
  assert.deepEqual(estimateRenewalDates('2026-05-31'), {
    first: '2028-03-31', next: '2030-03-31', secondAnniversary: '2028-05-31', fromDbpr: false,
  });
  assert.equal(estimateRenewalDates('2026-10-01').first, '2028-09-30');
});

test('includes a matching March or September anniversary', () => {
  assert.equal(estimateRenewalDates('2026-03-31').first, '2028-03-31');
  assert.equal(estimateRenewalDates('2026-09-30').first, '2028-09-30');
});

test('accepts the DBPR date over the estimate and anchors the next cycle to it', () => {
  const result = estimateRenewalDates('2026-05-31', '2028-09-30');
  assert.equal(result.first, '2028-09-30');
  assert.equal(result.next, '2030-09-30');
  assert.equal(result.fromDbpr, true);
});

test('rejects nonexistent dates and non-renewal-day DBPR dates', () => {
  assert.throws(() => estimateRenewalDates('2026-02-30'), /valid/);
  assert.throws(() => estimateRenewalDates('2026-05-31', '2028-04-01'), /March 31 or September 30/);
});
