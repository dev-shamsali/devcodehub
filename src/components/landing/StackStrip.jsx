'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * What the product is actually built on. Real logos from Simple Icons.
 *
 * This is deliberately not a "trusted by" wall: inventing customer logos for a
 * real person's real product would be fabricated social proof.
 */
const STACK = [
  { slug: 'nextdotjs', name: 'Next.js' },
  { slug: 'react', name: 'React' },
  { slug: 'mongodb', name: 'MongoDB' },
  { slug: 'tailwindcss', name: 'Tailwind CSS' },
  { slug: 'vercel', name: 'Vercel' },
];

export default function StackStrip() {
  const reduce = useReducedMotion();

  return (
    <section aria-label="Technology stack" className="px-5 sm:px-8">
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="glass-pill mx-auto flex max-w-[1200px] flex-col items-center gap-6 !rounded-[28px] px-6 py-7 md:flex-row md:justify-between md:gap-10 md:!rounded-full md:px-10"
      >
        <p className="max-w-[22ch] text-center text-[0.82rem] leading-relaxed text-text-lo md:text-left">
          Built on the stack your team already runs.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-6 md:gap-x-11">
          {STACK.map((tech, i) => (
            <motion.li
              key={tech.slug}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/a7b0c0`}
                alt={tech.name}
                width={26}
                height={26}
                loading="lazy"
                className="h-[26px] w-[26px] opacity-70 transition-opacity duration-300 hover:opacity-100"
              />
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
