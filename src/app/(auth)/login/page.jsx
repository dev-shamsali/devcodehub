import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import { safeNext } from '@/lib/auth/validation';

export const metadata = { title: 'Log in', robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const { next, error } = await searchParams;
  const dest = safeNext(next);
  const initialError = error
    ? 'Sign-in failed. Use a verified Google account or your email and password.'
    : undefined;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to open the editor and media."
      footer={
        <>
          No account?{' '}
          <Link
            href={next ? `/signup?next=${encodeURIComponent(dest)}` : '/signup'}
            className="text-text-hi hover:underline"
          >
            Create account
          </Link>
        </>
      }
    >
      <LoginForm next={dest} initialError={initialError} />
    </AuthShell>
  );
}
