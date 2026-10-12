'use client';

import { useState } from 'react';
import { FAQ } from '@/lib/site';

/**
 * Same questions the structured data carries. Every answer stays mounted and
 * is collapsed with grid-template-rows, so crawlers reading raw HTML still
 * see all of them.
 */
export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="swiss-cols relative scroll-mt-14 py-24 md:py-36">
      <div className="grid grid-cols-4 gap-y-12 md:grid-cols-8">
        <h2 className="col-span-4 col-start-1 px-4 text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[1] tracking-[-0.045em] md:sticky md:top-24 md:col-span-3 md:col-start-2 md:self-start md:px-0 md:pl-3">
          Questions people actually ask.
        </h2>

        <div className="col-span-4 border-b border-(--line) md:col-span-4 md:col-start-5">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-t border-(--line)">
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-start justify-between gap-6 px-4 py-5 text-left md:px-3"
                  >
                    <span className="text-[1.05rem] font-medium tracking-[-0.015em]">{item.q}</span>
                    <span aria-hidden="true" className="w-4 shrink-0 text-right font-mono text-[1.1rem] leading-none">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[56ch] px-4 pb-6 text-[0.95rem] leading-relaxed text-(--mute) md:px-3">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
