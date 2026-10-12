import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import SignupForm from '@/components/auth/SignupForm';
import { safeNext } from '@/lib/auth/validation';

export const metadata = { title: 'Create account', robots: { index: false } };

export default async function SignupPage({ searchParams }) {
  const { next } = await searchParams;
  const dest = safeNext(next);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Your name is shown on every snippet you create or edit."
      footer={
        <>
          Have an account?{' '}
          <Link
            href={next ? `/login?next=${encodeURIComponent(dest)}` : '/login'}
            className="swiss-link text-(--ink)"
          >
            Log in
          </Link>
        </>
      }
    >
      <SignupForm next={dest} />
    </AuthShell>
  );
}
