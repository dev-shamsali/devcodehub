import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionExpiry, isExpired, SESSION_DAYS, RENEW_SECONDS } from '../src/lib/auth/expiry.js';

const DAY = 24 * 60 * 60 * 1000;

test('an active session is kept alive for a year', () => {
  assert.equal(SESSION_DAYS, 365);
  assert.equal(sessionExpiry(1_000_000), 1_000_000 + 365 * DAY);
});

test('each visit pushes the cutoff out again', () => {
  const login = Date.parse('2026-10-17T08:00:00Z');
  const firstCutoff = sessionExpiry(login);
  const laterVisit = login + 200 * DAY;
  assert.equal(isExpired(firstCutoff, laterVisit), false);
  assert.ok(sessionExpiry(laterVisit) > firstCutoff);
});

test('a year with no visit ends the login', () => {
  const login = Date.parse('2026-10-17T08:00:00Z');
  assert.equal(isExpired(sessionExpiry(login), login + 366 * DAY), true);
});

test('the cookie is renewed about daily', () => {
  assert.equal(RENEW_SECONDS, 24 * 60 * 60);
});

test('missing or malformed cutoff counts as expired', () => {
  assert.equal(isExpired(undefined, 0), true);
  assert.equal(isExpired('later', 0), true);
});
