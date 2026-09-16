'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Three moves, laid out as a horizontal run connected by a hairline. The verb
 * is the label, so there is no "Step 1 / Step 2" scaffolding.
 */
const MOVES = [
  {
    verb: 'Name it',
    body: 'Open the editor and give the snippet a name. It exists the moment you hit create, with no project or repo to set up first.',
  },
  {
    verb: 'Send it',
    body: 'Drop the link in the review thread. Whoever opens it is signed in anonymously and looking at your buffer.',
  },
  {
    verb: 'Work it',
    body: 'Both of you type into the same document. When the fix is right, download it or pin it and move on.',
  },
];

export default function Workflow() {
  const reduce = useReducedMotion();

  return (
    <section id="workflow" className="edge-top scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <h2 className="max-w-[24ch] font-display text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-text-hi md:text-4xl">
          Three moves, start to finish.
        </h2>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connector. Desktop only, decorative. */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[9px] hidden h-px bg-gradient-to-r from-brand/45 via-white/12 to-transparent md:block"
          />

          {MOVES.map((move, i) => (
            <motion.li
              key={move.verb}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="mb-6 block h-[18px] w-[18px] rounded-full border-2 border-brand bg-ink-900"
              />
              <h3 className="font-display text-xl font-semibold tracking-tight text-text-hi">
                {move.verb}
              </h3>
              <p className="mt-2.5 max-w-[38ch] text-[0.92rem] leading-relaxed text-text-mid">
                {move.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
