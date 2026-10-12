'use client';

import { useFormStatus } from 'react-dom';

export function Field({ label, name, type = 'text', autoComplete, ...rest }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.8rem] text-text-mid">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="w-full rounded-[12px] border border-white/12 bg-white/[0.05] px-3.5 py-2.5 text-sm text-text-hi shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition-colors placeholder:text-text-lo focus:border-brand focus:bg-white/[0.07] focus:ring-2 focus:ring-brand/30"
        {...rest}
      />
    </label>
  );
}

export function SubmitButton({ children, pendingLabel }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full btn-liquid px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ error, message }) {
  if (error) {
    return (
      <p role="alert" className="rounded-[12px] border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-hi">
        {message}
      </p>
    );
  }
  return null;
}

export function GoogleButton({ action, next }) {
  return (
    <form action={action}>
      <input type="hidden" name="next" value={next || ''} />
      <button
        type="submit"
        className="glass-pill flex w-full items-center justify-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-hi transition-colors hover:bg-white/10"
      >
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-4 w-4">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
          <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-text-lo" aria-hidden="true">
      <span className="h-px flex-1 bg-white/10" />
      or
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}
