import { getUploadAuthParams } from '@imagekit/next/server';
import { requireUser } from '@/lib/auth/guard';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Auth params are signed with a short expiry, so they must never be cached.
export const dynamic = 'force-dynamic';

/**
 * Mints short-lived upload credentials for the browser.
 *
 * The private key signs the token here and is never sent to the client. The
 * client receives only { token, signature, expire }, which authorise a single
 * upload window and nothing else.
 *
 * Requires a signed-in user, so only logged-in people can request a signature.
 */
export async function GET() {
  const gate = await requireUser();
  if (gate.response) return gate.response;

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return NextResponse.json(
      { ok: false, error: 'ImageKit is not configured on this deployment.' },
      { status: 503 }
    );
  }

  try {
    const { token, signature, expire } = getUploadAuthParams({
      privateKey,
      publicKey,
      // Ten minutes is plenty for a browser upload and keeps the window tight.
      expire: Math.floor(Date.now() / 1000) + 60 * 10,
    });

    return NextResponse.json(
      { ok: true, token, signature, expire, publicKey },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('ImageKit auth failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Could not sign the upload.' },
      { status: 500 }
    );
  }
}
