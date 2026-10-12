'use client';

import { useFormStatus } from 'react-dom';

export function Field({ label, name, type = 'text', autoComplete, ...rest }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.8rem] text-(--mute)">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="w-full border-0 border-b border-(--ink) bg-transparent px-0 py-2.5 text-[1.05rem] text-(--ink) outline-none transition-colors placeholder:text-(--mute) focus:border-(--accent)"
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
      className="btn-primary w-full px-6 py-4 text-[0.95rem] font-medium"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ error, message }) {
  if (error) {
    return (
      <p role="alert" className="border-l-2 border-danger pl-3 text-[0.9rem] text-danger">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="border-l-2 border-(--ink) pl-3 text-[0.9rem] text-(--ink)">
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
        className="flex w-full items-center justify-center gap-2.5 border border-(--ink) px-4 py-3.5 text-[0.95rem] font-medium text-(--ink) transition-colors hover:bg-(--ink) hover:text-(--paper)"
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
    <div className="my-6 flex items-center gap-3 text-[0.8rem] text-(--mute)" aria-hidden="true">
      <span className="h-px flex-1 bg-(--line)" />
      or
      <span className="h-px flex-1 bg-(--line)" />
    </div>
  );
}
