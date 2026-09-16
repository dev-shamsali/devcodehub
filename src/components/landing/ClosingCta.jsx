import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ClosingCta() {
  return (
    <section className="edge-top">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="glass glass-lit relative overflow-hidden px-6 py-16 text-center sm:px-12 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/18 blur-[110px]"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-[20ch] font-display text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-text-hi md:text-[2.75rem]">
              The next snippet does not need a paste.
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-[1rem] leading-relaxed text-text-mid">
              Open the editor, name a buffer and send the link. That is the
              entire setup.
            </p>
            <Link
              href="/editor"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-brand-solid px-7 py-3.5 text-[0.96rem] font-medium text-white transition-all hover:bg-brand-solid-hover active:translate-y-px"
            >
              Open editor
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
