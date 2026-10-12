import { test } from 'node:test';
import assert from 'node:assert/strict';
import { containsProfanity, maskProfanity } from '../src/lib/profanity.js';

test('blocks obvious abuse, including leetspeak and spaced letters', () => {
  assert.equal(containsProfanity('Maa ka bhosad aag'), true);
  assert.equal(containsProfanity('Sh1t'), true);
  assert.equal(containsProfanity('f u c k'), true);
  assert.equal(containsProfanity('FUUUUCK'), true);
});

test('leaves ordinary names alone', () => {
  for (const ok of ['Good morning', 'class assistant', 'scunthorpe', 'cocktail', 'my-passwords', 'Shams Ali', 'nahi gye toh laat markar bhagayenge']) {
    assert.equal(containsProfanity(ok), false, ok);
  }
});

test('masks a stored bad word but keeps the rest', () => {
  assert.equal(maskProfanity('Maa ka bhosad aag'), 'Maa ka b***** aag');
  assert.equal(maskProfanity('Good morning'), 'Good morning');
});

test('non-strings are safe', () => {
  assert.equal(containsProfanity(undefined), false);
  assert.equal(containsProfanity(42), false);
});
