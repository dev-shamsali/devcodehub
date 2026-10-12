'use client';

import { motion, useReducedMotion } from 'motion/react';

const ROWS = [
  {
    title: 'Edit the same code, live',
    body: 'Every keystroke reaches everyone with the snippet open. Each snippet shows who created it and who edited it last.',
  },
  {
    title: 'Zips, PDFs and docs too',
    figure: '25 MB',
    note: 'per file',
  },
  {
    title: 'Clears itself',
    body: 'Unpinned snippets and shares expire 36 hours after their last change. Pin what you keep.',
  },
  {
    title: 'Many files, one share',
    body: 'Drop a folder of screenshots at once. Every file gets a direct link for an issue or a pull request.',
  },
  {
    title: 'Signed in, then signed out',
    body: 'Log in with email or Google. Your session ends at midnight India time.',
  },
];

export default function Features() {
  const reduce = useReducedMotion();
  const rise = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, delay: Math.min(i * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section id="features" className="swiss-cols relative scroll-mt-14 py-24 md:py-36">
      <div className="grid grid-cols-4 md:grid-cols-8">
        <motion.h2
          {...rise(0)}
          className="col-span-4 col-start-1 px-4 text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[1] tracking-[-0.045em] md:col-span-6 md:col-start-2 md:px-0 md:pl-3"
        >
          Everything a share needs.
        </motion.h2>
      </div>

      <div className="mt-16 md:mt-24">
        {ROWS.map((row, i) => (
          <motion.div
            key={row.title}
            {...rise(i)}
            className="grid grid-cols-4 gap-y-3 border-t border-(--line) py-8 md:grid-cols-8 md:py-10"
          >
            <h3 className="col-span-4 px-4 text-[1.25rem] font-medium tracking-[-0.02em] md:col-span-3 md:col-start-2 md:px-0 md:pl-3 md:text-[1.5rem]">
              {row.title}
            </h3>
            {row.figure ? (
              <p className="col-span-4 px-4 text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-[-0.05em] md:col-span-4 md:col-start-5 md:px-0 md:pl-3">
                {row.figure}
                <span className="ml-3 text-[1rem] font-normal tracking-normal text-(--mute)">{row.note}</span>
              </p>
            ) : (
              <p className="col-span-4 max-w-[46ch] px-4 text-[1rem] leading-relaxed text-(--mute) md:col-span-4 md:col-start-5 md:px-0 md:pl-3">
                {row.body}
              </p>
            )}
          </motion.div>
        ))}
        <div className="border-t border-(--line)" />
      </div>
    </section>
  );
}
