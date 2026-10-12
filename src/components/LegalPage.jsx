import SwissShell from '@/components/swiss/SwissShell';
import SwissNav from '@/components/swiss/SwissNav';
import Footer from '@/components/swiss/Footer';
import { auth } from '@/auth';

/**
 * Shell for the policy pages, in the landing page's paper-and-ink system.
 * Server component so it can pass the signed-in user to the nav.
 */
export default async function LegalPage({ title, updated, children }) {
  const session = await auth();

  return (
    <SwissShell>
      <SwissNav user={session?.user ?? null} />
      <main className="swiss-cols relative py-20 md:py-28">
        <div className="grid grid-cols-4 md:grid-cols-8">
          <div className="col-span-4 col-start-1 px-4 md:col-span-5 md:col-start-2 md:px-0 md:pl-3">
            <h1 className="text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.05em]">
              {title}
            </h1>
            <p className="mt-4 text-[0.85rem] text-(--mute)">Last updated {updated}</p>
            <article className="mt-14 space-y-10 text-[1rem] leading-relaxed text-(--mute) [&_a]:text-(--ink) [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-[1.4rem] [&_h2]:font-medium [&_h2]:tracking-[-0.02em] [&_h2]:text-(--ink) [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:text-(--ink) [&_ul]:mt-3 [&_ul]:space-y-1.5">
              {children}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </SwissShell>
  );
}
