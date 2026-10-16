import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { listActivity } from '@/lib/activity';
import { getDb } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get('limit') || '200', 10) || 200;
  const action = searchParams.get('action') || '';

  try {
    const [{ items, total }, users] = await Promise.all([
      listActivity({ limit, action }),
      getDb().then((db) => db.collection('users').estimatedDocumentCount()),
    ]);
    return NextResponse.json(
      { ok: true, items, total, users },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Admin activity failed:', error);
    return NextResponse.json({ ok: false, error: 'Could not load the activity log.' }, { status: 500 });
  }
}
