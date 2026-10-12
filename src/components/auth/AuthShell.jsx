import SwissShell from '@/components/swiss/SwissShell';
import SwissNav from '@/components/swiss/SwissNav';
import Wordmark from '@/components/swiss/Wordmark';
import Footer from '@/components/swiss/Footer';

/**
 * Frame for login, signup and the password pages, in the landing page's
 * paper-and-ink system: oversized wordmark, index bar, then the heading on
 * the left of the grid and the form on the right.
 */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <SwissShell>
      <Wordmark />
      <SwissNav user={null} />
      <main className="swiss-cols relative grid min-h-[60dvh] grid-cols-4 content-start gap-y-12 py-16 md:grid-cols-8 md:py-24">
        <div className="col-span-4 col-start-1 px-4 md:col-span-3 md:col-start-2 md:px-0 md:pl-3">
          <h1 className="text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[1] tracking-[-0.045em]">{title}</h1>
          {subtitle && <p className="mt-5 max-w-[34ch] text-[1rem] leading-relaxed text-(--mute)">{subtitle}</p>}
          {footer && <p className="mt-10 text-[0.9rem] text-(--mute)">{footer}</p>}
        </div>
        <div className="col-span-4 col-start-1 px-4 md:col-span-3 md:col-start-5 md:px-0 md:pl-3">{children}</div>
      </main>
      <Footer />
    </SwissShell>
  );
}
