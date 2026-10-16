/**
 * A login lasts 45 days, or until the user logs out. There is no sliding
 * window: the cutoff is fixed at sign-in, so a stolen cookie cannot stay
 * valid forever by being used.
 */

export const SESSION_DAYS = 45;
export const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;

/** Epoch ms at which a session started at `now` ends. */
export function sessionExpiry(now = Date.now()) {
  return now + SESSION_SECONDS * 1000;
}

export function isExpired(expiresAt, now = Date.now()) {
  return typeof expiresAt !== 'number' || now >= expiresAt;
}
