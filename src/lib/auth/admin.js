/**
 * Administrators are named in the ADMIN_EMAILS environment variable
 * (comma separated). The list is read on every check, so removing an address
 * takes effect immediately even for a session that was already issued.
 *
 * An address only counts as admin once its email is verified, which today
 * means a Google sign-in. A password account created with an admin address
 * is never verified, so nobody can claim admin by registering it first.
 */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  return typeof email === 'string' && adminEmails().includes(email.trim().toLowerCase());
}
