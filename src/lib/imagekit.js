/**
 * Shared ImageKit constants.
 *
 * Only public values live here. The private key is read from the environment
 * inside the two server routes and never crosses into a client component.
 */

export const IMAGEKIT = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
};

/**
 * Every upload is confined to this folder. The delete route refuses any file
 * whose path falls outside it, so a stray fileId cannot be used to remove
 * unrelated assets from the account.
 */
export const MEDIA_FOLDER = '/devcodehub/media';

export const ACCEPTED_MIME = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
];

export const ACCEPT_ATTR = 'image/*,.zip';

// ImageKit rejects anything larger on the standard plan, so catch it in the
// browser rather than after the bytes have been sent.
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

export function isZip(file) {
  const type = file?.fileType || file?.type || '';
  const name = file?.name || '';
  return type === 'application/zip' || /\.zip$/i.test(name);
}

export function isImage(file) {
  const type = file?.fileType || file?.type || '';
  const name = file?.name || '';
  if (isZip(file)) return false;
  return type === 'image' || type.startsWith('image/') || /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(name);
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

/** Rejects a file before upload. Returns an error string, or null when fine. */
export function rejectReason(file) {
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name} is ${formatBytes(file.size)}. Limit is ${formatBytes(MAX_FILE_BYTES)}.`;
  }
  const looksAccepted =
    ACCEPTED_MIME.includes(file.type) ||
    /\.(png|jpe?g|gif|webp|avif|svg|zip)$/i.test(file.name);
  if (!looksAccepted) {
    return `${file.name} is not an image or a zip.`;
  }
  return null;
}
