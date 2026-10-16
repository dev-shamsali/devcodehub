import { getDb } from '@/lib/mongodb';

let ready = null;

async function collection() {
  const db = await getDb();
  const col = db.collection('activityLog');
  ready ??= Promise.all([
    col.createIndex({ at: -1 }),
    // Keep a year of history, then let MongoDB drop it.
    col.createIndex({ at: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }),
  ]).catch((e) => {
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

export async function listActivity({ limit = 200, action = '' } = {}) {
  const col = await collection();
  const filter = ACTIONS.includes(action) ? { action } : {};
  const [items, total] = await Promise.all([
    col.find(filter).sort({ at: -1 }).limit(Math.min(Math.max(limit, 1), 500)).toArray(),
    col.estimatedDocumentCount(),
  ]);
  return {
    total,
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
