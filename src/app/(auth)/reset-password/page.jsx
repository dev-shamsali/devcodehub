import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import ResetForm from '@/components/auth/ResetForm';
import { peekResetToken } from '@/lib/auth/db';

export const metadata = { title: 'Reset password', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams;
  const valid = typeof token === 'string' && (await peekResetToken(token));

  return (
    <AuthShell
      title="Set a new password"
      footer={
        <Link href="/login" className="swiss-link text-(--ink)">
          Back to log in
        </Link>
      }
    >
      {valid ? (
        <ResetForm token={token} />
      ) : (
        <p className="text-[0.95rem] text-(--mute)">
          This reset link is invalid or has expired.{' '}
          <Link href="/forgot-password" className="swiss-link text-(--ink)">
            Request a new one
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
