import { NextResponse } from 'next/server';
import { getShares, isConfigured, describeDbError } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const THIRTY_SIX_HOURS_MS = 36 * 60 * 60 * 1000;

const notConfigured = () =>
  NextResponse.json(
    { ok: false, error: 'The database is not configured on this deployment.' },
    { status: 503 }
  );

/** Strips Mongo internals so the browser only ever sees fields it needs. */
function toClient(doc) {
  return {
    id: doc.shareId,
    name: doc.name,
    createdAt: doc.createdAt?.getTime?.() ?? doc.createdAt ?? 0,
    updatedAt: doc.updatedAt?.getTime?.() ?? doc.updatedAt ?? 0,
    pinned: Boolean(doc.pinned),
    fileCount: Array.isArray(doc.files) ? doc.files.length : 0,
  };
}

export async function GET() {
  if (!isConfigured()) return notConfigured();

  try {
    const shares = await getShares();

    // Unpinned shares expire 36 hours after their last change, matching the
    // snippet side. Swept on read rather than with a TTL index, because a TTL
    // index cannot be made conditional on `pinned`.
    await shares.deleteMany({
      pinned: { $ne: true },
      updatedAt: { $lt: new Date(Date.now() - THIRTY_SIX_HOURS_MS) },
    });

    const docs = await shares
      .find({}, { projection: { 'files.filePath': 0 } })
      .sort({ pinned: -1, updatedAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ ok: true, shares: docs.map(toClient) });
  } catch (error) {
    console.error('List shares failed:', error);
    return NextResponse.json(
      { ok: false, error: describeDbError(error) || 'Could not load shares.' },
      { status: describeDbError(error) ? 503 : 500 }
    );
  }
}

export async function POST(request) {
  if (!isConfigured()) return notConfigured();

  let name;
  try {
    ({ name } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ ok: false, error: 'A name is required.' }, { status: 400 });
  }

  try {
    const shares = await getShares();
    const now = new Date();
    const shareId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

    const doc = {
      shareId,
      name: name.trim().slice(0, 120),
      createdAt: now,
      updatedAt: now,
      pinned: false,
      files: [],
    };

    await shares.insertOne(doc);
    return NextResponse.json({ ok: true, share: toClient(doc) }, { status: 201 });
  } catch (error) {
    console.error('Create share failed:', error);
    return NextResponse.json(
      { ok: false, error: describeDbError(error) || 'Could not create that share.' },
      { status: describeDbError(error) ? 503 : 500 }
    );
  }
}
