'use client';

import { motion, useReducedMotion } from 'motion/react';
import { LogIn, FilePlus2, Link2 } from 'lucide-react';

/**
 * Three moves, laid out as a horizontal run connected by a hairline. The verb
 * is the label, so there is no "Step 1 / Step 2" scaffolding.
 */
const MOVES = [
  {
    icon: LogIn,
    verb: 'Sign in',
    body: 'Create an account or continue with Google. You stay signed in until midnight India time.',
  },
  {
    icon: FilePlus2,
    verb: 'Create it',
    body: 'Name a snippet in the editor, or a share in Media. It exists the moment you press create.',
  },
  {
    icon: Link2,
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

        <ol className="relative mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {MOVES.map((move, i) => {
            const Icon = move.icon;
            return (
              <motion.li
                key={move.verb}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass glass-hover group p-6 sm:p-7"
              >
                <span className="icon-chip mb-6">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-text-hi">
                  {move.verb}
                </h3>
                <p className="mt-2.5 max-w-[38ch] text-[0.92rem] leading-relaxed text-text-mid">
                  {move.body}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
