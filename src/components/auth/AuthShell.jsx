import Link from 'next/link';
import Wordmark from '@/components/landing/Wordmark';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-12">
      <div className="relative w-full max-w-[400px]">
        <Link href="/" className="mb-8 block text-center">
          <Wordmark className="text-xl" />
        </Link>
        <div className="glass glass-lit p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-text-hi">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-text-mid">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <p className="mt-6 text-center text-sm text-text-mid">{footer}</p>}
      </div>
    </main>
  );
}
