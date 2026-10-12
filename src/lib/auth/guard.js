import { NextResponse } from 'next/server';
import { auth } from '@/auth';

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
