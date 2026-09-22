import { NextResponse } from 'next/server';
import { IMAGEKIT, MEDIA_FOLDER } from '@/lib/imagekit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Streams a media file back through our own origin with an explicit
 * Content-Disposition header.
 *
 * The `download` attribute and ImageKit's `?ik-attachment=true` both rely on
 * the browser honouring a cross-origin response header, which some browsers,
 * extensions and corporate proxies quietly ignore. Serving the bytes from
 * this origin makes the download attribute same-origin, so the save-as
 * behaviour is guaranteed rather than best-effort.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url') || '';
  const name = (searchParams.get('name') || 'download').replace(/["\r\n]/g, '').slice(0, 200);

  const endpoint = (IMAGEKIT.urlEndpoint || '').replace(/\/$/, '');
  const allowedPrefix = `${endpoint}${MEDIA_FOLDER}/`;

  // Only ever fetch files this app itself put on ImageKit. Without this
  // check the route is an open proxy for any URL a caller supplies.
  if (!endpoint || !fileUrl.startsWith(allowedPrefix)) {
    return NextResponse.json({ ok: false, error: 'Invalid file url.' }, { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(fileUrl, { cache: 'no-store' });
  } catch (error) {
    console.error('Media download fetch failed:', error);
    return NextResponse.json({ ok: false, error: 'Could not reach the file.' }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ ok: false, error: 'File not found.' }, { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
  const length = upstream.headers.get('content-length');
  if (length) headers.set('Content-Length', length);
  headers.set(
    'Content-Disposition',
    `attachment; filename="${name.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(name)}`
  );
  headers.set('Cache-Control', 'no-store');

  return new NextResponse(upstream.body, { status: 200, headers });
}
