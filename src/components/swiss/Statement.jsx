'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * Three capability lines that light up in sequence as you scroll through a
 * pinned stage. Scroll position drives opacity directly, so the order the
 * lines appear in is the order the page wants them read in. Under reduced
 * motion all three are simply shown.
 */
const LINES = [
  { text: 'Edit code live', offset: 'md:ml-[25%]', range: [0.02, 0.28] },
  { text: 'Share files', offset: 'md:ml-[37.5%]', range: [0.3, 0.55] },
  { text: 'Know who changed it', offset: 'md:ml-[12.5%]', range: [0.57, 0.82] },
];

function Line({ text, offset, range, progress, reduce }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [28, 0]);
  return (
    <motion.p
      style={reduce ? undefined : { opacity, y }}
      className={`px-4 text-[clamp(2.4rem,8.2vw,8rem)] font-medium leading-[0.98] tracking-[-0.045em] md:px-0 ${offset}`}
    >
      {text}
    </motion.p>
  );
}

export default function Statement() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section
      ref={ref}
      className={`swiss-flip swiss-cols relative ${reduce ? '' : 'h-[260vh]'}`}
    >
      <div
        className={`flex flex-col justify-center gap-3 py-24 md:gap-5 ${
          reduce ? '' : 'sticky top-[52px] h-[calc(100dvh-52px)] overflow-hidden py-0'
        }`}
      >
        {LINES.map((l) => (
          <Line key={l.text} {...l} progress={scrollYProgress} reduce={reduce} />
        ))}
      </div>
    </section>
  );
}
