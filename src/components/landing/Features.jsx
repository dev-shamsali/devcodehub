'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Radio, Link2, Pin, Lock, Download } from 'lucide-react';

/**
 * Five capabilities, five cells. The grid is shaped to the content: a wide
 * lead cell for the headline feature, then a 2 + 2 run beneath it.
 */
const FEATURES = [
  {
    icon: Radio,
    title: 'Edits arrive as they are typed',
    body: 'Every keystroke writes to Firebase Realtime Database and lands in every open browser within a fraction of a second. Nobody refreshes, nobody re-pastes.',
    span: 'md:col-span-3',
    tone: 'lit',
  },
  {
    icon: Link2,
    title: 'A link is the whole invite',
    body: 'Anonymous sign-in happens on open, so a collaborator goes from link to cursor without an account.',
    span: 'md:col-span-2',
  },
  {
    icon: Pin,
    title: 'Pin what should outlive the day',
    body: 'Unpinned snippets clear themselves after 36 hours. Pin the ones worth keeping.',
    span: 'md:col-span-1',
  },
  {
    icon: Lock,
    title: 'Lock a snippet once it is settled',
    body: 'A PIN keeps a finished snippet from drifting while people are still reading it.',
    span: 'md:col-span-1',
  },
  {
    icon: Download,
    title: 'Leave with the file',
    body: 'Download any snippet in the extension that matches its language, straight into the repo.',
    span: 'md:col-span-2',
  },
];

export default function Features() {
  const reduce = useReducedMotion();

  return (
    <section id="features" className="edge-top scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-[34ch]">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand">
            What it does
          </p>
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-text-hi md:text-4xl">
            Built for the code that moves between people.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const lit = feature.tone === 'lit';

            return (
              <motion.article
                key={feature.title}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.07, 0.28),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`glass relative overflow-hidden p-6 sm:p-7 ${feature.span} ${
                  lit ? 'glass-lit md:p-9' : ''
                }`}
              >
                {lit && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/20 blur-[80px]"
                  />
                )}

                <div className="relative">
                  <span
                    className={`mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full border ${
                      lit
                        ? 'border-brand/30 bg-brand/12 text-brand-soft'
                        : 'border-white/10 bg-white/[0.05] text-text-mid'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>

                  <h3
                    className={`font-display font-semibold tracking-tight text-text-hi ${
                      lit ? 'text-2xl md:text-[1.75rem]' : 'text-lg'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`mt-2.5 leading-relaxed text-text-mid ${
                      lit ? 'max-w-[48ch] text-[0.98rem]' : 'text-[0.9rem]'
                    }`}
                  >
                    {feature.body}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
