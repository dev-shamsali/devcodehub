import SiteNav from '@/components/landing/SiteNav';
import Hero from '@/components/landing/Hero';
import StackStrip from '@/components/landing/StackStrip';
import Features from '@/components/landing/Features';
import Workflow from '@/components/landing/Workflow';
import Faq from '@/components/landing/Faq';
import Developer from '@/components/landing/Developer';
import ClosingCta from '@/components/landing/ClosingCta';
import SiteFooter from '@/components/landing/SiteFooter';

export default function Home() {
  return (
    <>
      <SiteNav />
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
