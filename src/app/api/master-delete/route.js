import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

function safeEqual(a, b) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  const secret = process.env.MASTER_DELETE_PASSWORD;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'Master delete is not configured on this deployment.' },
      { status: 503 }
    );
  }

  let password;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  if (typeof password !== 'string' || !safeEqual(password, secret)) {
    return NextResponse.json({ ok: false, error: 'Incorrect master password.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
