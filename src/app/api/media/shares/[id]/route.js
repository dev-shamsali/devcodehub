import { NextResponse } from 'next/server';
import { getShares, isConfigured, describeDbError } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const notConfigured = () =>
  NextResponse.json(
    { ok: false, error: 'The database is not configured on this deployment.' },
    { status: 503 }
  );

const VALID_ID = /^[A-Za-z0-9_-]{1,40}$/;

export async function GET(request, { params }) {
  if (!isConfigured()) return notConfigured();

  // Next 16: params is a promise and must be awaited.
  const { id } = await params;
  if (!VALID_ID.test(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid share id.' }, { status: 400 });
  }

  try {
    const shares = await getShares();
    const doc = await shares.findOne({ shareId: id });
    if (!doc) {
      return NextResponse.json({ ok: false, error: 'That share no longer exists.' }, { status: 404 });
    }

    const files = (doc.files || [])
      .slice()
      .sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));

    return NextResponse.json({
      ok: true,
      share: {
        id: doc.shareId,
        name: doc.name,
        pinned: Boolean(doc.pinned),
        updatedAt: doc.updatedAt?.getTime?.() ?? 0,
        files,
      },
    });
  } catch (error) {
    console.error('Read share failed:', error);
    return NextResponse.json(
      { ok: false, error: describeDbError(error) || 'Could not load that share.' },
      { status: describeDbError(error) ? 503 : 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  if (!VALID_ID.test(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid share id.' }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  const set = { updatedAt: new Date() };
  if (typeof body.pinned === 'boolean') set.pinned = body.pinned;
  if (typeof body.name === 'string' && body.name.trim()) set.name = body.name.trim().slice(0, 120);

  try {
    const shares = await getShares();
    const result = await shares.updateOne({ shareId: id }, { $set: set });
    if (!result.matchedCount) {
      return NextResponse.json({ ok: false, error: 'That share no longer exists.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Update share failed:', error);
    return NextResponse.json(
      { ok: false, error: describeDbError(error) || 'Could not update that share.' },
      { status: describeDbError(error) ? 503 : 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  if (!VALID_ID.test(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid share id.' }, { status: 400 });
  }

  try {
    const shares = await getShares();
    // Hand back the file ids so the caller can release the bytes on ImageKit.
    const doc = await shares.findOneAndDelete({ shareId: id });
    const removed = doc?.files || doc?.value?.files || [];
    return NextResponse.json({ ok: true, fileIds: removed.map((f) => f.fileId).filter(Boolean) });
  } catch (error) {
    console.error('Delete share failed:', error);
    return NextResponse.json(
      { ok: false, error: describeDbError(error) || 'Could not delete that share.' },
      { status: describeDbError(error) ? 503 : 500 }
    );
  }
}
