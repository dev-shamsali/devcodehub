import { createHash, randomBytes } from 'node:crypto';
import { getDb } from '@/lib/mongodb';

let indexesReady = null;

async function collections() {
  const db = await getDb();
  const users = db.collection('users');
  const resets = db.collection('passwordResets');
  const limits = db.collection('authRateLimits');
  indexesReady ??= Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    resets.createIndex({ tokenHash: 1 }, { unique: true }),
    resets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).catch((e) => {
    indexesReady = null;
    throw e;
  });
  await indexesReady;
  return { users, resets, limits };
}

export async function findUserByEmail(email) {
  const { users } = await collections();
  return users.findOne({ email });
}

export async function createUser({ email, name, passwordHash }) {
  const { users } = await collections();
  const now = new Date();
  const result = await users.insertOne({
    email,
    name,
    passwordHash,
    googleId: null,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  });
  return { _id: result.insertedId, email, name };
}

/**
 * Finds or creates the user for a verified Google identity.
 *
 * If a password account already uses this email, Google proves the owner of
 * that inbox, so the account is linked and the old password is dropped. That
 * stops someone who pre-registered a victim's address from keeping access.
 */
export async function upsertGoogleUser({ email, name, googleId }) {
  const { users } = await collections();
  const now = new Date();
  const existing = await users.findOne({ email });
  if (!existing) {
    const result = await users.insertOne({
      email,
      name,
      passwordHash: null,
      googleId,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });
    return { _id: result.insertedId, email, name };
  }
  const update = { googleId, emailVerified: true, updatedAt: now };
  if (!existing.emailVerified) update.passwordHash = null;
  await users.updateOne({ _id: existing._id }, { $set: update });
  return { _id: existing._id, email, name: existing.name || name };
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const RESET_TTL_MS = 60 * 60 * 1000;

/** Returns the raw token for the email link; only its hash is stored. */
export async function createResetToken(userId) {
  const { resets } = await collections();
  await resets.deleteMany({ userId });
  const token = randomBytes(32).toString('base64url');
  await resets.insertOne({
    userId,
    tokenHash: sha256(token),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });
  return token;
}

/** Atomically consumes a token. Returns the userId, or null if invalid/expired. */
export async function consumeResetToken(token) {
  if (typeof token !== 'string' || token.length < 20 || token.length > 100) return null;
  const { resets } = await collections();
  const doc = await resets.findOneAndDelete({ tokenHash: sha256(token) });
  const found = doc?.value ?? doc;
  if (!found || found.expiresAt.getTime() < Date.now()) return null;
  return found.userId;
}

export async function peekResetToken(token) {
  if (typeof token !== 'string' || token.length < 20 || token.length > 100) return false;
  const { resets } = await collections();
  const doc = await resets.findOne({ tokenHash: sha256(token) });
  return Boolean(doc && doc.expiresAt.getTime() >= Date.now());
}

export async function setPassword(userId, passwordHash) {
  const { users, resets } = await collections();
  await users.updateOne(
    { _id: userId },
    { $set: { passwordHash, emailVerified: true, updatedAt: new Date() } }
  );
  await resets.deleteMany({ userId });
}

/* ---- rate limiting ---------------------------------------------------- */

const WINDOW_MS = 15 * 60 * 1000;

/** True when `key` has used up `max` attempts in the current window. Read-only. */
export async function isLimited(key, max = 5) {
  const { limits } = await collections();
  const doc = await limits.findOne({ _id: key });
  return Boolean(doc && doc.expiresAt.getTime() > Date.now() && doc.count >= max);
}

export async function recordAttempt(key) {
  const { limits } = await collections();
  const now = Date.now();
  const doc = await limits.findOne({ _id: key });
  if (!doc || doc.expiresAt.getTime() <= now) {
    await limits.replaceOne(
      { _id: key },
      { _id: key, count: 1, expiresAt: new Date(now + WINDOW_MS) },
      { upsert: true }
    );
    return;
  }
  await limits.updateOne({ _id: key }, { $inc: { count: 1 } });
}

export async function clearAttempts(key) {
  const { limits } = await collections();
  await limits.deleteOne({ _id: key });
}
