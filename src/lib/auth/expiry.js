/**
 * Sessions end at the next midnight in India Standard Time.
 *
 * IST is a fixed UTC+05:30 with no daylight saving, so the offset can be
 * applied as plain arithmetic instead of pulling in a timezone library.
 */

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Epoch ms of the next 00:00 IST strictly after `now`. */
export function nextMidnightIST(now = Date.now()) {
  const istDay = Math.floor((now + IST_OFFSET_MS) / DAY_MS);
  return (istDay + 1) * DAY_MS - IST_OFFSET_MS;
}

export function isExpired(expiresAt, now = Date.now()) {
  return typeof expiresAt !== 'number' || now >= expiresAt;
}
