import SwissShell from '@/components/swiss/SwissShell';
import SwissNav from '@/components/swiss/SwissNav';
import Hero, { HeroBody } from '@/components/swiss/Hero';
import Statement from '@/components/swiss/Statement';
import Features from '@/components/swiss/Features';
import WordField from '@/components/swiss/WordField';
import Workflow from '@/components/swiss/Workflow';
import Faq from '@/components/swiss/Faq';
import Developer from '@/components/swiss/Developer';
import Closing from '@/components/swiss/Closing';
import Footer from '@/components/swiss/Footer';
import { SITE } from '@/lib/site';
import { redirect } from 'next/navigation';
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
  // Signed in today: skip the landing page and go straight to the editor.
  if (session?.user?.id) redirect('/editor');
  return (
    <SwissShell>
      <Hero />
      <SwissNav user={null} />
      <main>
        <HeroBody />
        <Statement />
        <Features />
        <WordField />
        <Workflow />
        <Faq />
        <Developer />
        <Closing />
      </main>
      <Footer />
    </SwissShell>
  );
}
