import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdminEmail } from '@/lib/auth/admin';

/**
 * For route handlers. Returns { user } or { response } to return directly.
 * Authoritative: the proxy check is only a convenience redirect.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      response: NextResponse.json(
        { ok: false, error: 'Sign in to continue.' },
        { status: 401 }
      ),
    };
  }
  return { user: session.user };
}

/**
 * For admin-only route handlers. Beyond the session role, the address is
 * re-checked against ADMIN_EMAILS now, so revoking an admin takes effect at
 * once rather than when their 45-day login runs out.
 */
export async function requireAdmin() {
  const gate = await requireUser();
  if (gate.response) return gate;
  const { user } = gate;
  if (user.role !== 'admin' || !isAdminEmail(user.email)) {
    return {
      response: NextResponse.json({ ok: false, error: 'Admin access required.' }, { status: 403 }),
    };
  }
  return { user };
}
