'use server';

import { headers } from 'next/headers';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { signIn, signOut, clientIp, loginLimitKey } from '@/auth';
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
  validateName,
  safeNext,
} from '@/lib/auth/validation';
import {
  findUserByEmail,
  createUser,
  createResetToken,
  consumeResetToken,
  setPassword,
  isLimited,
  recordAttempt,
} from '@/lib/auth/db';
import { sendResetEmail, sendGoogleOnlyEmail } from '@/lib/auth/mail';

const BCRYPT_COST = 12;
const TOO_MANY = 'Too many attempts. Wait 15 minutes and try again.';

async function ip() {
  return clientIp(await headers());
}

function appUrl() {
  const url = process.env.APP_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');
  if (!url) throw new Error('APP_URL is not set.');
  return url.replace(/\/$/, '');
}

export async function loginAction(_prev, formData) {
  const email = normalizeEmail(formData.get('email'));
  const password = String(formData.get('password') || '');
  const next = safeNext(formData.get('next'));

  if (validateEmail(email) || !password) return { error: 'Enter your email and password.' };
  if (await isLimited(loginLimitKey(email, await ip()))) return { error: TOO_MANY };

  try {
    await signIn('credentials', { email, password, redirectTo: next });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Incorrect email or password.' };
    }
    throw error; // the redirect itself
  }
}

export async function signupAction(_prev, formData) {
  const name = String(formData.get('name') || '').trim();
  const email = normalizeEmail(formData.get('email'));
  const password = String(formData.get('password') || '');
  const next = safeNext(formData.get('next'));

  const invalid = validateName(name) || validateEmail(email) || validatePassword(password);
  if (invalid) return { error: invalid };

  const limitKey = `signup:${await ip()}`;
  if (await isLimited(limitKey, 10)) return { error: TOO_MANY };
  await recordAttempt(limitKey);

  if (await findUserByEmail(email)) {
    return { error: 'An account with this email already exists. Log in instead.' };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  try {
    await createUser({ email, name, passwordHash });
  } catch (error) {
    if (error?.code === 11000) {
      return { error: 'An account with this email already exists. Log in instead.' };
    }
    throw error;
  }

  try {
    await signIn('credentials', { email, password, redirectTo: next });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Account created. Log in to continue.' };
    throw error;
  }
}

export async function googleAction(formData) {
  await signIn('google', { redirectTo: safeNext(formData.get('next')) });
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}

const FORGOT_OK = {
  message: 'If an account exists for that email, a reset link is on its way. Check your inbox.',
};

export async function forgotAction(_prev, formData) {
  const email = normalizeEmail(formData.get('email'));
  if (validateEmail(email)) return { error: 'Enter a valid email address.' };

  const limitKey = `forgot:${await ip()}`;
  if (await isLimited(limitKey)) return { error: TOO_MANY };
  await recordAttempt(limitKey);

  try {
    const user = await findUserByEmail(email);
    if (user) {
      if (user.passwordHash) {
        const token = await createResetToken(user._id);
        await sendResetEmail(email, `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`);
      } else {
        await sendGoogleOnlyEmail(email, `${appUrl()}/login`);
      }
    }
  } catch (error) {
    // Same reply either way, so failures cannot be used to probe accounts.
    console.error('Forgot password failed:', error);
  }
  return FORGOT_OK;
}

export async function resetAction(_prev, formData) {
  const token = String(formData.get('token') || '');
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');

  const invalid = validatePassword(password);
  if (invalid) return { error: invalid };
  if (password !== confirm) return { error: 'Passwords do not match.' };

  const limitKey = `reset:${await ip()}`;
  if (await isLimited(limitKey, 10)) return { error: TOO_MANY };
  await recordAttempt(limitKey);

  const userId = await consumeResetToken(token);
  if (!userId) return { error: 'This reset link is invalid or has expired. Request a new one.' };

  await setPassword(userId, await bcrypt.hash(password, BCRYPT_COST));
  return { done: true };
}
