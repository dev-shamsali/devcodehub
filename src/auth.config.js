import { encode } from 'next-auth/jwt';
import { nextMidnightIST, isExpired } from '@/lib/auth/expiry';

/**
 * Config shared by the proxy and the full server config. It must not import
 * the database, so the proxy stays light and never opens a Mongo connection.
 */
export const authConfig = {
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt',
    // Upper bound only. The real end of a session is `expiresAt` below.
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    // Pin the JWT's own `exp` to the midnight cutoff. Without this, every
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
        token.expiresAt = nextMidnightIST();
      }
      // Returning null clears the cookie: the session is over.
      if (isExpired(token.expiresAt)) return null;
      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      session.expiresAt = token.expiresAt;
      // Auth.js derives `expires` from maxAge; report the real cutoff.
      session.expires = new Date(token.expiresAt).toISOString();
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const loggedIn = Boolean(auth?.user);
      if (pathname.startsWith('/media') || pathname.startsWith('/editor')) return loggedIn;
      return true;
    },
  },
};
