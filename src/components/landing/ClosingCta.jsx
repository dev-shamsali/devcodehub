'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

export default function ClosingCta() {
  const reduce = useReducedMotion();

  return (
    <section className="edge-top">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-24">
        <SpotlightCard
          as={motion.div}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="glass glass-lit overflow-hidden px-6 py-16 text-center sm:px-12 lg:py-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/18 blur-[110px]"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-[20ch] font-display text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-text-hi md:text-[2.75rem]">
              Send the next file as a link.
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-[1rem] leading-relaxed text-text-mid">
              Create an account, name a share and drop your files in. The link is
              ready as soon as you are.
            </p>
            <motion.div
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="mt-9 inline-block"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 btn-liquid rounded-full px-7 py-3.5 text-[0.96rem] font-medium text-white transition-colors"
              >
                Get started
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </motion.div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
