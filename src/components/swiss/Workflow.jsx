'use client';

import { motion, useReducedMotion } from 'motion/react';

const MOVES = [
  {
    verb: 'Sign in',
    body: 'Create an account or continue with Google. You stay signed in for 45 days, or until you log out.',
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
    <section id="workflow" className="swiss-cols relative scroll-mt-14 py-24 md:py-36">
      <div className="grid grid-cols-4 md:grid-cols-8">
        <h2 className="col-span-4 col-start-1 px-4 text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[1] tracking-[-0.045em] md:col-span-6 md:col-start-2 md:px-0 md:pl-3">
          From login to shared in three moves.
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-4 gap-y-14 md:mt-24 md:grid-cols-8 md:gap-y-0">
        {MOVES.map((move, i) => (
          <motion.div
            key={move.verb}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`col-span-4 border-t border-(--line) px-4 pt-6 md:col-span-2 md:px-0 md:pl-3 ${
              ['md:col-start-2', 'md:col-start-4', 'md:col-start-6'][i]
            }`}
          >
            <h3 className="text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              {move.verb}
            </h3>
            <p className="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-(--mute)">{move.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
