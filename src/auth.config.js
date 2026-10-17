import { encode } from 'next-auth/jwt';
import { sessionExpiry, isExpired, SESSION_SECONDS, RENEW_SECONDS } from '@/lib/auth/expiry';
import { isAdminEmail } from '@/lib/auth/admin';

/**
 * Config shared by the proxy and the full server config. It must not import
 * the database, so the proxy stays light and never opens a Mongo connection.
 */
export const authConfig = {
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt',
    // One year of inactivity ends a login; every visit renews it (see jwt below).
    maxAge: SESSION_SECONDS,
    // Re-issue the cookie about once a day while the site is in use.
    updateAge: RENEW_SECONDS,
  },
  jwt: {
    // Pin the JWT's own `exp` to the rolling cutoff. Without this, every
    // re-issue would push the expiry a full maxAge into the future.
    async encode(params) {
      const expiresAt = params.token?.expiresAt;
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      return encode({ ...params, maxAge: Math.max(remaining, 1) });
    },
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      // `user` is only present on the request that signs in.
      if (user) {
        token.id = user.id;
        token.expiresAt = sessionExpiry();
      }
      // Returning null clears the cookie: the session is over.
      if (isExpired(token.expiresAt)) return null;
      // Still in use: keep the login alive for another year.
      token.expiresAt = sessionExpiry();
      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      // Admin = verified at sign-in AND still on the ADMIN_EMAILS list today.
      session.user.role = token?.admin && isAdminEmail(token.email) ? 'admin' : 'user';
      session.expiresAt = token.expiresAt;
      // Auth.js derives `expires` from maxAge; report the real cutoff.
      session.expires = new Date(token.expiresAt).toISOString();
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const loggedIn = Boolean(auth?.user);
      if (
        pathname.startsWith('/media') ||
        pathname.startsWith('/editor') ||
        pathname.startsWith('/admin')
      ) {
        return loggedIn;
      }
      return true;
    },
  },
};
