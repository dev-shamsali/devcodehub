'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { resetAction } from '@/app/(auth)/actions';
import { Field, SubmitButton, FormMessage } from './fields';

export default function ResetForm({ token }) {
  const [state, formAction] = useActionState(resetAction, null);

  if (state?.done) {
    return (
      <div className="space-y-4">
        <FormMessage message="Password updated. You can log in with it now." />
        <Link
          href="/login"
          className="block rounded-full btn-liquid px-4 py-2.5 text-center text-sm font-medium text-white"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Field label="New password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} />
      <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" minLength={8} maxLength={72} />
      <FormMessage error={state?.error} />
      <SubmitButton pendingLabel="Saving...">Set new password</SubmitButton>
    </form>
  );
}
