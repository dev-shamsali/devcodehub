'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Three moves, laid out as a horizontal run connected by a hairline. The verb
 * is the label, so there is no "Step 1 / Step 2" scaffolding.
 */
const MOVES = [
  {
    verb: 'Sign in',
    body: 'Create an account or continue with Google. You stay signed in until midnight India time.',
  },
  {
    verb: 'Create it',
    body: 'Name a snippet in the editor, or a share in Media. It exists the moment you press create.',
  },
  {
    verb: 'Send the link',
    body: 'Teammates open it and see your edits and files as they land, with names on every change.',
  },
];

export default function Workflow() {
  const reduce = useReducedMotion();

  return (
    <section id="workflow" className="edge-top scroll-mt-24">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[24ch] font-display text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-text-hi md:text-4xl"
        >
          From login to shared in three moves.
        </motion.h2>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connector. Desktop only, decorative. Draws left to right as the
              row enters view, tracing the order the three moves happen in. */}
          <motion.span
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
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
                className="liquid mb-6 block h-[18px] w-[18px] rounded-full border-2 border-brand bg-ink-900"
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
