import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextMidnightIST, isExpired } from '../src/lib/auth/expiry.js';

const IST = 5.5 * 3600 * 1000;
const at = (iso) => Date.parse(iso);

test('afternoon IST rolls to the next IST midnight', () => {
  // 2026-10-12 15:00 IST = 09:30Z
  assert.equal(nextMidnightIST(at('2026-10-12T09:30:00Z')), at('2026-10-12T18:30:00Z'));
});

test('one second before midnight IST still ends at that midnight', () => {
  assert.equal(nextMidnightIST(at('2026-10-12T18:29:59Z')), at('2026-10-12T18:30:00Z'));
});

test('exactly midnight IST rolls a full day', () => {
  assert.equal(nextMidnightIST(at('2026-10-12T18:30:00Z')), at('2026-10-13T18:30:00Z'));
});

test('result is always 00:00 IST', () => {
  const t = nextMidnightIST(Date.now());
  assert.equal((t + IST) % 86400000, 0);
});

test('isExpired', () => {
  assert.equal(isExpired(1000, 1000), true);
  assert.equal(isExpired(1000, 999), false);
  assert.equal(isExpired(undefined, 0), true);
});
