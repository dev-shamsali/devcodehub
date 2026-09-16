import { NextResponse } from 'next/server';
import { MEDIA_FOLDER } from '@/lib/imagekit';

export const runtime = 'nodejs';

const API = 'https://api.imagekit.io/v1/files';

/** ImageKit authenticates management calls with HTTP Basic: privateKey as the username. */
function authHeader(privateKey) {
  return `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Looks up a file, tolerating ImageKit's media library indexing lag.
 *
 * A file that has just been uploaded is served by the CDN before it is
 * queryable here, so a single 404 does not mean the file is absent. Measured
 * at roughly 8 seconds on a fresh upload. Without these retries a user who
 * deletes straight after uploading gets a silent no-op and the bytes are
 * orphaned on ImageKit forever.
 */
async function fetchDetails(fileId, privateKey) {
  const delays = [0, 1500, 3000, 5000];

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt]) await wait(delays[attempt]);

    const res = await fetch(`${API}/${fileId}/details`, {
      headers: { Authorization: authHeader(privateKey) },
      cache: 'no-store',
    });

    if (res.ok) return { found: true, file: await res.json() };
    if (res.status !== 404) return { found: false, status: res.status };
  }

  return { found: false, status: 404 };
}

/**
 * Removes one file from ImageKit.
 *
 * The fileId arrives from the browser, so it cannot be trusted. Before
 * deleting, the file's real path is read back from ImageKit and checked
 * against MEDIA_FOLDER. Without that check a crafted fileId could delete any
 * asset in the account.
 */
export async function POST(request) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { ok: false, error: 'ImageKit is not configured on this deployment.' },
      { status: 503 }
    );
  }

  let fileId;
  try {
    ({ fileId } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  if (typeof fileId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(fileId)) {
    return NextResponse.json({ ok: false, error: 'Invalid file id.' }, { status: 400 });
  }

  try {
    const details = await fetchDetails(fileId, privateKey);

    if (!details.found) {
      if (details.status === 404) {
        // Still absent after retries. Report it rather than claiming success,
        // so the caller can surface that the bytes may still be on ImageKit.
        return NextResponse.json(
          { ok: false, error: 'ImageKit has no record of that file.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { ok: false, error: 'Could not read the file from ImageKit.' },
        { status: 502 }
      );
    }

    const path = details.file?.filePath || '';
    if (!path.startsWith(`${MEDIA_FOLDER}/`)) {
      return NextResponse.json(
        { ok: false, error: 'That file is not managed by this app.' },
        { status: 403 }
      );
    }

    const removed = await fetch(`${API}/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader(privateKey) },
    });

    if (!removed.ok && removed.status !== 404) {
      return NextResponse.json(
        { ok: false, error: 'ImageKit refused the delete.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('ImageKit delete failed:', error);
    return NextResponse.json({ ok: false, error: 'Delete failed.' }, { status: 500 });
  }
}
