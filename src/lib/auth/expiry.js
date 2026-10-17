/**
 * Stay signed in until logout.
 *
 * A login is kept alive for as long as the person keeps using the site: every
 * visit pushes the cutoff out another year, and the cookie is re-issued about
 * once a day. Only logging out, or a full year of not visiting, ends it.
 * (Browsers cap a cookie's life near 400 days, so a literal "forever" is not
 * possible; renewing on use is how a login stays alive past that cap.)
 */

export const SESSION_DAYS = 365;
export const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;
/** How often the cookie is re-issued while the site is in use. */
export const RENEW_SECONDS = 24 * 60 * 60;

/** Epoch ms at which a session that is active at `now` would end. */
export function sessionExpiry(now = Date.now()) {
  return now + SESSION_SECONDS * 1000;
}

export function isExpired(expiresAt, now = Date.now()) {
  return typeof expiresAt !== 'number' || now >= expiresAt;
}
