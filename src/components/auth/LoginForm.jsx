'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction, googleAction } from '@/app/(auth)/actions';
import { Field, SubmitButton, FormMessage, GoogleButton, Divider } from './fields';

export default function LoginForm({ next, initialError }) {
  const [state, formAction] = useActionState(loginAction, { error: initialError });
  return (
    <>
      <GoogleButton action={googleAction} next={next} />
      <Divider />
      <form action={formAction} className="space-y-7">
        <input type="hidden" name="next" value={next || ''} />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Password" name="password" type="password" autoComplete="current-password" />
        <div className="text-right">
          <Link href="/forgot-password" className="swiss-link text-[0.85rem] text-(--mute)">
            Forgot password?
          </Link>
        </div>
        <FormMessage error={state?.error} />
        <SubmitButton pendingLabel="Logging in...">Log in</SubmitButton>
      </form>
    </>
  );
}
