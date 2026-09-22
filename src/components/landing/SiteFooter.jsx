'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Globe } from 'lucide-react';
import { SITE, AUTHOR } from '@/lib/site';
import Wordmark from './Wordmark';
import BrandIcon from './BrandIcon';

export default function SiteFooter() {
  const reduce = useReducedMotion();

  return (
    <footer className="edge-top">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <Wordmark className="text-[1.05rem]" />
          <p className="mt-3 max-w-[38ch] text-[0.84rem] leading-relaxed text-text-lo">
            {SITE.tagline}. Built and maintained by{' '}
            <a
              href={AUTHOR.github}
              rel="author me noopener noreferrer"
              target="_blank"
              className="text-text-mid underline decoration-white/20 underline-offset-4 transition-colors hover:text-brand-soft"
            >
              {AUTHOR.name}
            </a>
            .
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[0.86rem] text-text-mid transition-colors hover:text-text-hi"
          >
            Editor
          </Link>
          <Link
            href="/media"
            className="text-[0.86rem] text-text-mid transition-colors hover:text-text-hi"
          >
            Media
          </Link>

          <div className="flex items-center gap-2">
            <motion.a
              href={AUTHOR.github}
              rel="me noopener noreferrer"
              target="_blank"
              aria-label={`${AUTHOR.name} on GitHub`}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-text-mid transition-colors hover:text-text-hi"
            >
              <BrandIcon slug="github" label="" />
            </motion.a>
            <motion.a
              href={AUTHOR.linkedin}
              rel="me noopener noreferrer"
              target="_blank"
              aria-label={`${AUTHOR.name} on LinkedIn`}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-text-mid transition-colors hover:text-text-hi"
            >
              <BrandIcon slug="linkedin" label="" />
            </motion.a>
            <motion.a
              href={AUTHOR.instagram}
              rel="me noopener noreferrer"
              target="_blank"
              aria-label={`${AUTHOR.name} on Instagram`}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-text-mid transition-colors hover:text-text-hi"
            >
              <BrandIcon slug="instagram" label="" />
            </motion.a>
            <motion.a
              href={AUTHOR.portfolio}
              rel="me noopener noreferrer"
              target="_blank"
              aria-label={`${AUTHOR.name}'s portfolio`}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-text-mid transition-colors hover:text-text-hi"
            >
              <Globe className="h-4 w-4" strokeWidth={1.75} />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
