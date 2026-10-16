import { getDb } from '@/lib/mongodb';

let ready = null;

/** Entries older than this are deleted. */
export const RETENTION_DAYS = 5;
const RETENTION_SECONDS = RETENTION_DAYS * 24 * 60 * 60;

async function setup(db, col) {
  await col.createIndex({ at: -1 });
  try {
    // MongoDB's TTL monitor removes expired entries about once a minute.
    await col.createIndex({ at: 1 }, { expireAfterSeconds: RETENTION_SECONDS });
  } catch (error) {
    // An index on `at` already exists with an older retention (it was a year).
    // The TTL of an existing index is changed in place, not re-created.
    if (error?.code !== 85 && error?.code !== 86) throw error;
    await db.command({
      collMod: 'activityLog',
      index: { keyPattern: { at: 1 }, expireAfterSeconds: RETENTION_SECONDS },
    });
  }
}

async function collection() {
  const db = await getDb();
  const col = db.collection('activityLog');
  ready ??= setup(db, col).catch((e) => {
    ready = null;
    throw e;
  });
  await ready;
  return col;
}

export const ACTIONS = [
  'login',
  'signup',
  'note.create',
  'note.edit',
  'note.rename',
  'note.delete',
  'note.pin',
  'note.lock',
  'note.unlock',
  'share.create',
  'share.delete',
  'admin.delete_all',
];

const clip = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');

/**
 * Records who did what and when. The identity always comes from the server
 * session, never from the request body, so entries cannot be forged by a
 * client. Failures are swallowed: logging must never break the action itself.
 */
export async function logActivity({ user, action, targetId = '', targetName = '' }) {
  try {
    if (!ACTIONS.includes(action) || !user) return;
    const col = await collection();
    await col.insertOne({
      at: new Date(),
      action,
      userId: String(user.id || ''),
      name: clip(user.name, 120),
      email: clip(user.email, 254).toLowerCase(),
      targetId: clip(targetId, 120),
      targetName: clip(targetName, 160),
    });
  } catch (error) {
    console.error('Activity log failed:', error?.message || error);
  }
}

/** True when this user already logged this action on this target recently. */
export async function loggedRecently({ userId, action, targetId, withinMs }) {
  const col = await collection();
  const found = await col.findOne({
    userId: String(userId),
    action,
    targetId,
    at: { $gt: new Date(Date.now() - withinMs) },
  });
  return Boolean(found);
}

const escapeRegex = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * One page of the log, newest first. Also deletes anything past the retention
 * window right away, so the log is correct even between TTL monitor runs.
 */
export async function listActivity({ page = 1, pageSize = 10, action = '', q = '' } = {}) {
  const col = await collection();
  const cutoff = new Date(Date.now() - RETENTION_SECONDS * 1000);
  await col.deleteMany({ at: { $lt: cutoff } });

  const filter = {};
  if (ACTIONS.includes(action)) filter.action = action;
  const term = typeof q === 'string' ? q.trim().slice(0, 80) : '';
  if (term) {
    const re = new RegExp(escapeRegex(term), 'i');
    filter.$or = [{ name: re }, { email: re }, { targetName: re }];
  }

  const size = Math.min(Math.max(pageSize, 1), 50);
  const total = await col.countDocuments(filter);
  const pages = Math.max(Math.ceil(total / size), 1);
  const current = Math.min(Math.max(page, 1), pages);

  const items = await col
    .find(filter)
    .sort({ at: -1 })
    .skip((current - 1) * size)
    .limit(size)
    .toArray();

  return {
    total,
    page: current,
    pages,
    pageSize: size,
    items: items.map((d) => ({
      id: String(d._id),
      at: d.at.getTime(),
      action: d.action,
      name: d.name,
      email: d.email,
      targetId: d.targetId,
      targetName: d.targetName,
    })),
  };
}
