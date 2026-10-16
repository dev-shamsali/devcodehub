import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionExpiry, isExpired, SESSION_DAYS } from '../src/lib/auth/expiry.js';

const DAY = 24 * 60 * 60 * 1000;

test('a session lasts exactly 45 days from sign-in', () => {
  assert.equal(SESSION_DAYS, 45);
  assert.equal(sessionExpiry(1_000_000), 1_000_000 + 45 * DAY);
});

test('still valid on day 44, over on day 45', () => {
  const start = Date.parse('2026-10-16T08:00:00Z');
  const end = sessionExpiry(start);
  assert.equal(isExpired(end, start + 44 * DAY), false);
  assert.equal(isExpired(end, start + 45 * DAY), true);
});

test('missing or malformed cutoff counts as expired', () => {
  assert.equal(isExpired(undefined, 0), true);
  assert.equal(isExpired('later', 0), true);
});
