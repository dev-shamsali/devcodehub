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
  const page = Number.parseInt(searchParams.get('page') || '1', 10) || 1;
  const action = searchParams.get('action') || '';
  const q = searchParams.get('q') || '';

  try {
    const [log, users] = await Promise.all([
      listActivity({ page, pageSize: 10, action, q }),
      getDb().then((db) => db.collection('users').estimatedDocumentCount()),
    ]);
    return NextResponse.json(
      { ok: true, ...log, users },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Admin activity failed:', error);
    return NextResponse.json({ ok: false, error: 'Could not load the activity log.' }, { status: 500 });
  }
}
