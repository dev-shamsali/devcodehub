'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * A field of the product's own words hung in 3D space. Scrolling tilts and
 * pushes the field toward you, so the page feels like moving through the
 * product's vocabulary. Positions are fixed constants (no randomness) so the
 * server and client render the same markup. Under reduced motion the field
 * is a static, unrotated layout.
 */
const WORDS = [
  ['Edit', 8, 10, -300], ['Share', 52, 6, -80], ['Live', 78, 14, -420], ['Link', 24, 24, -160],
  ['Images', 64, 28, -260], ['Zip', 6, 36, -480], ['PDF', 40, 38, -40], ['Names', 86, 40, -140],
  ['Pin', 18, 50, -360], ['Created by', 56, 52, -200], ['Snippets', 80, 60, -460], ['Docs', 32, 64, -90],
  ['Media', 8, 70, -240], ['Edited by', 68, 74, -60], ['Sign in', 44, 80, -380], ['Code', 22, 86, -140],
  ['Files', 84, 88, -300], ['Team', 56, 92, -500], ['Review', 4, 92, -120], ['Sync', 36, 14, -540],
];

export default function WordField() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [46, 12]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-22, 8]);
  const z = useTransform(scrollYProgress, [0, 1], [-520, 260]);

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className={`swiss-flip swiss-cols relative ${reduce ? 'h-[80vh]' : 'h-[300vh]'}`}
    >
      <div
        className={`overflow-hidden ${
          reduce ? 'h-full' : 'sticky top-[52px] h-[calc(100dvh-52px)]'
        }`}
        style={{ perspective: '1100px' }}
      >
        <motion.div
          className="absolute inset-[-10%]"
          style={
            reduce
              ? { transformStyle: 'preserve-3d' }
              : { rotateX, rotateZ, z, transformStyle: 'preserve-3d' }
          }
        >
          {WORDS.map(([word, x, y, depth]) => (
            <span
              key={word}
              className="absolute whitespace-nowrap text-[clamp(1.6rem,5vw,5.5rem)] font-medium tracking-[-0.04em]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translateZ(${depth}px)`,
                opacity: 0.35 + (depth + 540) / 540 * 0.6,
              }}
            >
              {word}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
