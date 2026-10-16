import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { authConfig } from '@/auth.config';
import { isAdminEmail } from '@/lib/auth/admin';
import { logActivity } from '@/lib/activity';
import { normalizeEmail, validateEmail } from '@/lib/auth/validation';
import {
  findUserByEmail,
  upsertGoogleUser,
  isLimited,
  recordAttempt,
  clearAttempts,
} from '@/lib/auth/db';

// A real hash to compare against when the email is unknown, so a miss takes
// as long as a hit and does not reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export function clientIp(headers) {
  const get = (name) => (typeof headers.get === 'function' ? headers.get(name) : headers[name]);
  return (get('x-forwarded-for') || '').split(',')[0].trim() || get('x-real-ip') || 'unknown';
}

export const loginLimitKey = (email, ip) => `login:${ip}:${email}`;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Behind a proxy/host that sets x-forwarded-host (Vercel etc.).
  trustHost: true,
  providers: [
    Google({
      // Link by verified email (see upsertGoogleUser).
      allowDangerousEmailAccountLinking: false,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const email = normalizeEmail(credentials?.email);
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if (validateEmail(email) || !password || password.length > 200) return null;

        const key = loginLimitKey(email, clientIp(request.headers));
        if (await isLimited(key)) throw new CredentialsSignin();

        const user = await findUserByEmail(email);
        const ok = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH);
        if (!user || !user.passwordHash || !ok) {
          await recordAttempt(key);
          return null;
        }
        await clearAttempts(key);
        const signedIn = {
          id: String(user._id),
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified === true,
        };
        await logActivity({ user: signedIn, action: 'login' });
        return signedIn;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account, profile }) {
      if (account?.provider !== 'google') return true;
      return Boolean(profile?.email && profile.email_verified);
    },
    async jwt({ token, user, account, profile, ...rest }) {
      if (account?.provider === 'google' && profile) {
        const dbUser = await upsertGoogleUser({
          email: normalizeEmail(profile.email),
          name: profile.name || profile.email,
          googleId: profile.sub,
        });
        user = { id: String(dbUser._id), email: dbUser.email, name: dbUser.name, emailVerified: true };
        await logActivity({ user, action: 'login' });
        token.name = dbUser.name;
        token.email = dbUser.email;
      }
      // Sign-in only: admin needs an address on the list AND a verified email.
      if (user) token.admin = isAdminEmail(user.email) && user.emailVerified === true;
      return authConfig.callbacks.jwt({ token, user, account, profile, ...rest });
    },
  },
});
