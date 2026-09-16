import { MongoClient } from 'mongodb';

/**
 * Cached MongoDB client.
 *
 * Next.js re-evaluates modules on every hot reload in development and may run
 * many concurrent lambdas in production. Without caching the client on the
 * global object, each one opens its own connection pool and an Atlas M0
 * cluster runs out of connections quickly.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'devcodehub';

let clientPromise = global._devcodehubMongo;

if (!clientPromise) {
  if (!uri) {
    clientPromise = null;
  } else {
    clientPromise = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    }).connect();
    global._devcodehubMongo = clientPromise;
  }
}

export function isConfigured() {
  return Boolean(uri);
}

export async function getDb() {
  if (!clientPromise) {
    throw new Error('MONGODB_URI is not set.');
  }
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Turns a driver failure into something actionable.
 *
 * Atlas answers a connection from an IP that is not on its access list by
 * accepting TCP and then rejecting the TLS handshake, which surfaces as a
 * server-selection or TLS error rather than an auth error. Reported as-is it
 * reads like an application bug, so it is named explicitly here.
 */
export function describeDbError(error) {
  const text = `${error?.name || ''} ${error?.message || ''}`;

  if (/ServerSelection|ReplicaSetNoPrimary|tlsv1 alert|SSL alert/i.test(text)) {
    return 'Cannot reach MongoDB. Add this deployment\u2019s IP to the Atlas access list (Network Access), then retry.';
  }
  if (/Authentication failed|bad auth/i.test(text)) {
    return 'MongoDB rejected the credentials in MONGODB_URI.';
  }
  return null;
}

export async function getShares() {
  const db = await getDb();
  const shares = db.collection('mediaShares');
  // Lookups are always by shareId, and the list is sorted by recency.
  await shares.createIndex({ shareId: 1 }, { unique: true }).catch(() => {});
  await shares.createIndex({ pinned: -1, updatedAt: -1 }).catch(() => {});
  return shares;
}
