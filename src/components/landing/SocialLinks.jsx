'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Globe } from 'lucide-react';
import { AUTHOR } from '@/lib/site';
import BrandIcon from './BrandIcon';

const BRAND_LINKS = [
  { slug: 'github', href: AUTHOR.github, label: 'GitHub' },
  { slug: 'linkedin', href: AUTHOR.linkedin, label: 'LinkedIn' },
  { slug: 'instagram', href: AUTHOR.instagram, label: 'Instagram' },
];

/**
 * Compact icon-only row of the developer's profiles, for chrome that's too
 * narrow for the full text-labelled buttons the landing page uses (Developer
 * section, footer). Same four destinations, sized down for a toolbar.
 */
export default function SocialLinks({ className = '', iconSize = 14 }) {
  const reduce = useReducedMotion();
  const buttonClass =
    'rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-text-mid transition-colors hover:text-text-hi';
  const hoverProps = {
    whileHover: reduce ? undefined : { y: -2 },
    whileTap: reduce ? undefined : { scale: 0.92 },
    transition: { type: 'spring', stiffness: 400, damping: 22 },
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {BRAND_LINKS.map((item) => (
        <motion.a
          key={item.slug}
          href={item.href}
          rel="me noopener noreferrer"
          target="_blank"
          aria-label={`${AUTHOR.name} on ${item.label}`}
          className={buttonClass}
          {...hoverProps}
        >
          <BrandIcon slug={item.slug} label="" size={iconSize} />
        </motion.a>
      ))}
      <motion.a
        href={AUTHOR.portfolio}
        rel="me noopener noreferrer"
        target="_blank"
        aria-label={`${AUTHOR.name}'s portfolio`}
        className={buttonClass}
        {...hoverProps}
      >
        <Globe style={{ width: iconSize, height: iconSize }} strokeWidth={1.75} />
      </motion.a>
    </div>
  );
}
