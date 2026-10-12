import SiteNav from '@/components/landing/SiteNav';
import Hero from '@/components/landing/Hero';
import StackStrip from '@/components/landing/StackStrip';
import Features from '@/components/landing/Features';
import Workflow from '@/components/landing/Workflow';
import Faq from '@/components/landing/Faq';
import Developer from '@/components/landing/Developer';
import ClosingCta from '@/components/landing/ClosingCta';
import SiteFooter from '@/components/landing/SiteFooter';
import { SITE } from '@/lib/site';
import { auth } from '@/auth';

const title = 'What DevCodeHub is and how it works';
const description = SITE.description;

export const metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}`,
    siteName: SITE.name,
    title: `${title} | ${SITE.name}`,
    description,
  },
};

export default async function HomePage() {
  const session = await auth();
  return (
    <>
      <SiteNav user={session?.user ?? null} />
      <main>
        <Hero />
        <StackStrip />
        <Features />
        <Workflow />
        <Faq />
        <Developer />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
