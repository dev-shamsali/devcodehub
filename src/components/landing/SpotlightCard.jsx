'use client';

import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from 'motion/react';

/**
 * Wraps a glass panel with a cursor-tracked highlight, so hovering a card
 * reads as a physical surface catching light rather than a flat rectangle.
 *
 * Position is kept in a motion value, never React state: the panel would
 * otherwise re-render on every pixel of mouse movement. Skipped entirely
 * under reduced motion, since the effect is decorative only.
 */
export default function SpotlightCard({ as: Tag, className = '', children, ...motionProps }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const background = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, rgb(61 141 255 / 0.16), transparent 72%)`;

  const handleMove = (event) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <Tag
      onMouseMove={handleMove}
      className={`group relative ${className}`}
      {...motionProps}
    >
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
        />
      )}
      <div className="relative">{children}</div>
    </Tag>
  );
}
