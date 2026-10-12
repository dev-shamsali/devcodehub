import SiteNav from '@/components/landing/SiteNav';
import SiteFooter from '@/components/landing/SiteFooter';
import { auth } from '@/auth';

/**
 * Shared shell for the policy pages: site nav, one glass sheet of readable
 * text, site footer. Server component so it can pass the signed-in user to
 * the nav.
 */
export default async function LegalPage({ title, updated, children }) {
  const session = await auth();

  return (
    <>
      <SiteNav user={session?.user ?? null} />
      <main className="mx-auto max-w-[820px] px-5 pb-20 pt-32 sm:px-8">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-text-hi md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-text-lo">Last updated {updated}</p>
        <article className="glass mt-10 space-y-8 p-6 text-[0.95rem] leading-relaxed text-text-mid sm:p-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-text-hi [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_a]:text-brand-soft [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-text-hi">
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
