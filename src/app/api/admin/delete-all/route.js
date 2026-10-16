import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

/**
 * Authorises and records the "delete all codes" action. The snippets live in
 * Firebase and are removed by the admin panel in the browser, so this route is
 * the server-side gate: no admin session, no go-ahead, and every use is logged
 * with the admin's name and email.
 */
export async function POST(request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }
  if (body?.confirm !== 'DELETE ALL') {
    return NextResponse.json({ ok: false, error: 'Type DELETE ALL to confirm.' }, { status: 400 });
  }

  await logActivity({ user: gate.user, action: 'admin.delete_all', targetName: 'all codes' });
  return NextResponse.json({ ok: true });
}
