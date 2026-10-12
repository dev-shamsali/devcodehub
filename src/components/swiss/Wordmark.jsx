'use client';

import { motion, useReducedMotion } from 'motion/react';

const PARTS = [
  { text: 'DEV', accent: false },
  { text: 'CODE', accent: true },
  { text: 'HUB', accent: false },
];

/**
 * The brand set as one oversized line, edge to edge. Letters rise out of a
 * clip in sequence on load, which is the only motion here: it introduces the
 * name and then stops. Decorative for assistive tech; the real name is in the
 * nav and the page heading.
 */
export default function Wordmark() {
  const reduce = useReducedMotion();
  let i = 0;

  return (
    <div
      aria-hidden="true"
      className="select-none overflow-hidden whitespace-nowrap px-[1.2vw] pt-[1.6vw] text-center font-extrabold uppercase leading-[0.8] tracking-[-0.055em] text-[14.9vw]"
    >
      {PARTS.map((part) => (
        <span key={part.text} className={part.accent ? 'text-(--accent)' : 'text-(--ink)'}>
          {part.text.split('').map((ch) => {
            const delay = i++ * 0.05;
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
