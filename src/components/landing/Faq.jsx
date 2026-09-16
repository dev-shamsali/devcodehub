'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { FAQ } from '@/lib/site';

/**
 * Visible answers for readers, and the same strings emitted as FAQPage
 * structured data from the root layout. Both read from lib/site so an answer
 * can never be updated in one place and stale in the other.
 *
 * Every answer stays mounted and is collapsed with grid-template-rows rather
 * than being conditionally rendered. An unmounted answer is invisible to a
 * crawler or an answer engine reading the raw HTML, which would put six of the
 * seven answers out of reach of the thing this section exists to feed.
 */
export default function Faq() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="edge-top scroll-mt-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-28">
        <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-text-hi md:text-4xl lg:sticky lg:top-28 lg:self-start">
          Questions people
          <br className="hidden lg:block" /> actually ask.
        </h2>

        <div className="divide-y divide-white/8 border-y border-white/8">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-brand-soft"
                  >
                    <span className="text-[0.98rem] font-medium text-text-hi">
                      {item.q}
                    </span>
                    <Plus
                      className={`h-4 w-4 shrink-0 text-brand transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                </h3>

                <motion.div
                  id={`faq-panel-${i}`}
                  initial={false}
                  animate={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="grid"
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-6 pr-10 text-[0.92rem] leading-relaxed text-text-mid">
                      {item.a}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
