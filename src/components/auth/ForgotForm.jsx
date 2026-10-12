'use client';

import { useActionState } from 'react';
import { forgotAction } from '@/app/(auth)/actions';
import { Field, SubmitButton, FormMessage } from './fields';

export default function ForgotForm() {
  const [state, formAction] = useActionState(forgotAction, null);
  return (
    <form action={formAction} className="space-y-7">
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <FormMessage error={state?.error} message={state?.message} />
      <SubmitButton pendingLabel="Sending...">Send reset link</SubmitButton>
    </form>
  );
}
