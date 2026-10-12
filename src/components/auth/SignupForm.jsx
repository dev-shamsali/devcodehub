'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signupAction, googleAction } from '@/app/(auth)/actions';
import { Field, SubmitButton, FormMessage, GoogleButton, Divider } from './fields';

export default function SignupForm({ next }) {
  const [state, formAction] = useActionState(signupAction, null);
  return (
    <>
      <GoogleButton action={googleAction} next={next} />
      <Divider />
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next || ''} />
        <Field label="Name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
        />
        <p className="text-xs text-text-lo">At least 8 characters, with a letter and a number.</p>
        <FormMessage error={state?.error} />
        <SubmitButton pendingLabel="Creating account...">Create account</SubmitButton>
        <p className="text-center text-xs text-text-lo">
          By creating an account you agree to the{' '}
          <Link href="/terms" className="text-text-mid underline underline-offset-4 hover:text-text-hi">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-text-mid underline underline-offset-4 hover:text-text-hi">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </>
  );
}
