const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72; // bcrypt ignores bytes past 72.

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function validateEmail(email) {
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}

export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX) {
    return `Password must be at most ${PASSWORD_MAX} bytes.`;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain a letter and a number.';
  }
  return null;
}

export function validateName(name) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    return 'Enter your name (2 to 80 characters).';
  }
  return null;
}

/** Only same-site relative paths, so ?next= cannot become an open redirect. */
export function safeNext(value, fallback = '/editor') {
  if (typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  return value;
}
