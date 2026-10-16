import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adminEmails, isAdminEmail } from '../src/lib/auth/admin.js';

test('reads a comma separated list, trimmed and lower-cased', () => {
  process.env.ADMIN_EMAILS = ' Boss@Example.com ,second@example.com,, ';
  assert.deepEqual(adminEmails(), ['boss@example.com', 'second@example.com']);
});

test('matches case-insensitively and rejects everyone else', () => {
  process.env.ADMIN_EMAILS = 'boss@example.com';
  assert.equal(isAdminEmail('BOSS@example.com'), true);
  assert.equal(isAdminEmail('intruder@example.com'), false);
  assert.equal(isAdminEmail(undefined), false);
});

test('an empty list means nobody is admin', () => {
  process.env.ADMIN_EMAILS = '';
  assert.equal(isAdminEmail('boss@example.com'), false);
});
