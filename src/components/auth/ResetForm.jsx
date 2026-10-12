'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { resetAction } from '@/app/(auth)/actions';
import { Field, SubmitButton, FormMessage } from './fields';

export default function ResetForm({ token }) {
  const [state, formAction] = useActionState(resetAction, null);

  if (state?.done) {
    return (
      <div className="space-y-7">
        <FormMessage message="Password updated. You can log in with it now." />
        <Link
          href="/login"
          className="btn-primary block px-6 py-4 text-center text-[0.95rem] font-medium"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-7">
      <input type="hidden" name="token" value={token} />
      <Field label="New password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} />
      <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" minLength={8} maxLength={72} />
      <FormMessage error={state?.error} />
      <SubmitButton pendingLabel="Saving...">Set new password</SubmitButton>
    </form>
  );
}
