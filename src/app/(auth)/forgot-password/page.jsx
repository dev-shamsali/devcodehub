import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import ForgotForm from '@/components/auth/ForgotForm';

export const metadata = { title: 'Forgot password', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we will send a reset link."
      footer={
        <Link href="/login" className="text-text-hi hover:underline">
          Back to log in
        </Link>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
