'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Code2, Images, FileArchive, Timer, ShieldCheck } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

/**
 * Five capabilities, five cells: a wide lead cell and a narrow stat cell on
 * the first row, then three equal cells. The stat cells carry the real limits
 * from the product (25 MB, 36 hours) as display figures.
 */
const FEATURES = [
  {
    icon: Code2,
    title: 'Edit the same code, live',
    body: 'Every keystroke reaches everyone with the snippet open. Each snippet shows who created it and who edited it last.',
    span: 'md:col-span-4',
    tone: 'lit',
  },
  {
    icon: FileArchive,
    title: 'Zips, PDFs and docs too',
    figure: '25 MB',
    figureNote: 'per file',
    span: 'md:col-span-2',
    tone: 'tint',
  },
  {
    icon: Timer,
    title: 'Clears itself',
    body: 'Unpinned snippets and shares expire 36 hours after their last change. Pin what you keep.',
    span: 'md:col-span-2',
  },
  {
    icon: Images,
    title: 'Many files, one share',
    body: 'Drop a folder of screenshots at once. Every file gets a direct link for an issue or a pull request.',
    span: 'md:col-span-2',
  },
  {
    icon: ShieldCheck,
    title: 'Signed in, then signed out',
    body: 'Log in with email or Google. Your session ends at midnight India time.',
    span: 'md:col-span-2',
  },
];

export default function Features() {
  const reduce = useReducedMotion();

  return (
    <section id="features" className="edge-top scroll-mt-24">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[24ch] font-display text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-text-hi md:text-4xl"
        >
          Everything a share needs.
        </motion.h2>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const lit = feature.tone === 'lit';
            const tint = feature.tone === 'tint';

            return (
              <SpotlightCard
                as={motion.article}
                key={feature.title}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.07, 0.28),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`glass glass-hover p-6 sm:p-7 ${feature.span} ${
                  lit ? 'glass-lit md:p-9' : ''
                } ${tint ? 'bg-gradient-to-br from-brand/25 to-transparent' : ''}`}
              >
                <div className="relative flex h-full flex-col">
                  <span className="icon-chip mb-6">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>

                  <h3
                    className={`font-display font-semibold tracking-tight text-text-hi ${
                      lit ? 'text-2xl md:text-[1.75rem]' : 'text-lg'
                    }`}
                  >
                    {feature.title}
                  </h3>

                  {feature.figure ? (
                    <p className="mt-auto pt-6 font-display text-5xl font-semibold tracking-tight text-text-hi">
                      {feature.figure}
                      <span className="ml-2 text-base font-normal text-text-mid">
                        {feature.figureNote}
                      </span>
                    </p>
                  ) : (
                    <p
                      className={`mt-2.5 leading-relaxed text-text-mid ${
                        lit ? 'max-w-[48ch] text-[0.98rem]' : 'text-[0.9rem]'
                      }`}
                    >
                      {feature.body}
                    </p>
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
