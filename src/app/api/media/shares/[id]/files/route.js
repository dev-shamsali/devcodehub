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
const VALID_FILE_ID = /^[A-Za-z0-9_-]{1,64}$/;

/**
 * Accepts only the fields the gallery renders. The body comes from the
 * browser, so anything else it sends is dropped rather than stored.
 */
function sanitise(input) {
  const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
  const num = (v) => (Number.isFinite(v) ? v : null);

  if (!VALID_FILE_ID.test(input?.fileId || '')) return null;

  return {
    fileId: input.fileId,
    name: str(input.name, 260),
    url: str(input.url, 2048),
    thumbnailUrl: str(input.thumbnailUrl, 2048),
    filePath: str(input.filePath, 1024),
    fileType: str(input.fileType, 120),
    size: num(input.size) ?? 0,
    width: num(input.width),
    height: num(input.height),
    uploadedAt: Date.now(),
  };
}

export async function POST(request, { params }) {
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

  const file = sanitise(body);
  if (!file) {
    return NextResponse.json({ ok: false, error: 'Invalid file payload.' }, { status: 400 });
  }

  try {
    const shares = await getShares();
    const result = await shares.updateOne(
      { shareId: id },
      {
        // $pull then $push would need two round trips; a fileId is unique per
        // upload, so a plain push cannot duplicate.
        $push: { files: file },
        $set: { updatedAt: new Date() },
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ ok: false, error: 'That share no longer exists.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, file }, { status: 201 });
  } catch (error) {
    console.error('Add file failed:', error);
    return NextResponse.json(
      { ok: false, error: describeDbError(error) || 'Could not save that file.' },
      { status: describeDbError(error) ? 503 : 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  const fileId = new URL(request.url).searchParams.get('fileId') || '';

  if (!VALID_ID.test(id) || !VALID_FILE_ID.test(fileId)) {
    return NextResponse.json({ ok: false, error: 'Invalid id.' }, { status: 400 });
  }

  try {
    const shares = await getShares();
    const result = await shares.updateOne(
      { shareId: id },
      { $pull: { files: { fileId } }, $set: { updatedAt: new Date() } }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ ok: false, error: 'That share no longer exists.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Remove file failed:', error);
    return NextResponse.json(
      { ok: false, error: describeDbError(error) || 'Could not remove that file.' },
      { status: describeDbError(error) ? 503 : 500 }
    );
  }
}
