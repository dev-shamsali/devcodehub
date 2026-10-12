import { test, expect } from '@playwright/test';
import { encode } from 'next-auth/jwt';

const AUTH_SECRET = 'playwright-test-secret-not-for-production';
const COOKIE = 'authjs.session-token';

/** /media is login-gated, so each test starts with a signed session cookie. */
async function signIn(context) {
  const expiresAt = Date.now() + 60 * 60 * 1000;
  const value = await encode({
    token: { id: 'test-user', name: 'Test', email: 'test@example.com', expiresAt },
    secret: AUTH_SECRET,
    salt: COOKIE,
    maxAge: 3600,
  });
  await context.addCookies([{ name: COOKIE, value, url: 'http://localhost:3100' }]);
}


/**
 * The /media route needs no real credentials. ImageKit and MongoDB are mocked at the network layer instead
 * of being reached for real, since this environment has none configured.
 */

const SHARE_ID = 'test-share-1';
const SHARE = {
  id: SHARE_ID,
  name: 'Test share',
  fileCount: 0,
  updatedAt: Date.now(),
  pinned: false,
};

function json(body, status = 200) {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

async function mockBackend(page, { files = [] } = {}) {
  const stored = [...files];
  // Mirrors the real API: the share only exists in the list once it has
  // actually been created, so the initial poll and the post-create poll
  // don't both hand back the same id (which produced a duplicate React key).
  const shares = [];

  await page.route('**/api/media/shares', async (route) => {
    if (route.request().method() === 'POST') {
      shares.unshift(SHARE);
      return route.fulfill(json({ ok: true, share: SHARE }, 201));
    }
    return route.fulfill(json({ ok: true, shares }));
  });

  await page.route(`**/api/media/shares/${SHARE_ID}`, async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill(
        json({ ok: true, share: { ...SHARE, files: stored } })
      );
    }
    return route.fulfill(json({ ok: true }));
  });

  await page.route(`**/api/media/shares/${SHARE_ID}/files`, async (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      stored.push(body);
      return route.fulfill(json({ ok: true, file: body }, 201));
    }
    return route.fulfill(json({ ok: true }));
  });

  await page.route('**/api/media/auth', (route) =>
    route.fulfill(
      json({
        ok: true,
        token: 'test-token',
        signature: 'test-signature',
        expire: Math.floor(Date.now() / 1000) + 600,
        publicKey: 'public_test_key',
      })
    )
  );

  await page.route('**/api/media/delete', (route) => route.fulfill(json({ ok: true })));

  await page.route('https://upload.imagekit.io/**', async (route) => {
    const form = route.request().postData() || '';
    const nameMatch = form.match(/filename="([^"]+)"/);
    const name = nameMatch?.[1] || 'file';
    return route.fulfill(
      json({
        fileId: `file_${Math.random().toString(36).slice(2, 8)}`,
        name,
        url: `https://ik.imagekit.io/test/${name}`,
        thumbnailUrl: `https://ik.imagekit.io/test/${name}`,
        filePath: `/devcodehub/media/${SHARE_ID}/${name}`,
        size: 1024,
        fileType: name.endsWith('.zip') ? 'application/zip' : 'image',
        height: null,
        width: null,
      })
    );
  });
}

async function openShare(page) {
  await page.goto('/media');
  await page.getByPlaceholder('New share name...').fill(SHARE.name);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('heading', { name: SHARE.name })).toBeVisible();
}

test.describe('media upload', () => {
  test.beforeEach(async ({ context }) => {
    await signIn(context);
  });

  test('accepts image, zip, pdf, and docx files', async ({ page }) => {
    await mockBackend(page);
    await openShare(page);

    const buffer = Buffer.from('fake bytes for upload test');
    await page.setInputFiles('input[type="file"]', [
      { name: 'photo.png', mimeType: 'image/png', buffer },
      { name: 'archive.zip', mimeType: 'application/zip', buffer },
      { name: 'report.pdf', mimeType: 'application/pdf', buffer },
      {
        name: 'notes.docx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer,
      },
    ]);

    // "Copy link to X" only renders once a file has finished uploading and
    // moved out of the pending queue, so this also proves the upload completed.
    await expect(page.getByRole('button', { name: 'Copy link to photo.png' })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole('button', { name: 'Copy link to archive.zip' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link to report.pdf' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link to notes.docx' })).toBeVisible();
  });

  test('rejects a disallowed file type', async ({ page }) => {
    await mockBackend(page);
    await openShare(page);

    await page.setInputFiles('input[type="file"]', [
      { name: 'installer.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('x') },
    ]);

    await expect(
      page.getByText('installer.exe is not an image, zip, PDF, or Word document.')
    ).toBeVisible();
  });

  test('dropdown menu opens with pin and delete actions', async ({ page }) => {
    await mockBackend(page);
    await openShare(page);

    await page.getByRole('button', { name: `Actions for ${SHARE.name}` }).click();
    await expect(page.getByRole('button', { name: 'Pin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  });
});
