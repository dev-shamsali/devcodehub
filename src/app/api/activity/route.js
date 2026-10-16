import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/guard';
import { logActivity, loggedRecently } from '@/lib/activity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// The browser may only report these. Sign-ins and admin actions are logged by
// the server itself and are not accepted from the client.
const CLIENT_ACTIONS = new Set([
  'note.create',
  'note.edit',
  'note.rename',
  'note.delete',
  'note.pin',
  'note.lock',
  'note.unlock',
]);

// Edits stream in while someone types; one entry per person per snippet per window.
const EDIT_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request) {
  const gate = await requireUser();
  if (gate.response) return gate.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  const { action, targetId, targetName } = body || {};
  if (typeof action !== 'string' || !CLIENT_ACTIONS.has(action) || typeof targetId !== 'string' || !targetId) {
    return NextResponse.json({ ok: false, error: 'Invalid activity.' }, { status: 400 });
  }

  try {
    if (action === 'note.edit') {
      const recent = await loggedRecently({
        userId: gate.user.id,
        action,
        targetId,
        withinMs: EDIT_WINDOW_MS,
      });
      if (recent) return NextResponse.json({ ok: true, skipped: true });
    }
    await logActivity({
      user: gate.user,
      action,
      targetId,
      targetName: typeof targetName === 'string' ? targetName : '',
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Activity route failed:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
