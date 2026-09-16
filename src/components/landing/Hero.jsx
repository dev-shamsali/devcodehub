'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import LiveSnippetPreview from './LiveSnippetPreview';

export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section className="relative overflow-hidden pt-[68px]">
      {/* Brand light, thrown from behind the preview panel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-18rem] top-[-10rem] h-[44rem] w-[44rem] rounded-full bg-brand/14 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-16rem] top-[14rem] h-[30rem] w-[30rem] rounded-full bg-brand-deep/10 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:pb-28 lg:pt-24">
        <div>
          <motion.h1
            {...rise(0)}
            className="font-display text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-text-hi md:text-5xl lg:text-6xl"
          >
            Paste it once.
            <br />
            Your team edits it{' '}
            <span className="relative whitespace-nowrap text-brand">
              live
              <svg
                aria-hidden="true"
                viewBox="0 0 120 10"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2 w-full text-brand/45"
              >
                <path
                  d="M2 7C28 3 62 2 118 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p
            {...rise(0.08)}
            className="mt-6 max-w-[46ch] text-base leading-relaxed text-text-mid sm:text-[1.05rem]"
          >
            Name a snippet, send the link, watch edits land as they happen. No
            account, no install.
          </motion.p>

          <motion.div {...rise(0.16)} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/editor"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-solid px-6 py-3 text-[0.94rem] font-medium text-white transition-all hover:bg-brand-solid-hover active:translate-y-px"
            >
              Open editor
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
            <a
              href="#workflow"
              className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-[0.94rem] text-text-hi transition-colors hover:border-white/20 hover:bg-white/[0.08] active:translate-y-px"
            >
              How it works
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <LiveSnippetPreview />
        </motion.div>
      </div>
    </section>
  );
}
