/**
 * Creates or updates an admin account with a password, directly in MongoDB.
 * Password signup is refused for admin addresses on purpose, so this is how an
 * admin gets a password login.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' ADMIN_NAME='Your Name' \
 *     node scripts/create-admin.mjs
 *
 * Also add the address to ADMIN_EMAILS in the environment. Reads MONGODB_URI
 * and MONGODB_DB from the environment (load .env first, e.g. node --env-file=.env).
 */
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const name = (process.env.ADMIN_NAME || 'Admin').trim();

if (!email || password.length < 8 || Buffer.byteLength(password) > 72) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (8 to 72 bytes).');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set.');
  process.exit(1);
}

const client = await new MongoClient(process.env.MONGODB_URI).connect();
try {
  const users = client.db(process.env.MONGODB_DB || 'devcodehub').collection('users');
  const now = new Date();
  const result = await users.updateOne(
    { email },
    {
      $set: {
        name,
        passwordHash: await bcrypt.hash(password, 12),
        emailVerified: true,
        updatedAt: now,
      },
      $setOnInsert: { email, googleId: null, createdAt: now },
    },
    { upsert: true }
  );
  console.log(result.upsertedCount ? `Created admin ${email}` : `Updated admin ${email}`);
} finally {
  await client.close();
}
