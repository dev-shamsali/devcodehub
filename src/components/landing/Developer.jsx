'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Globe } from 'lucide-react';
import { AUTHOR } from '@/lib/site';
import BrandIcon from './BrandIcon';
import SpotlightCard from './SpotlightCard';

/**
 * Author surface. The name, role and profile links are still plain server
 * markup in the initial HTML (Motion only controls opacity/transform on top
 * of it), so a crawler or an answer engine reads the same content either
 * way, marked up with rel="author" pointing at the Person node declared in
 * the layout's JSON-LD.
 */
export default function Developer() {
  const reduce = useReducedMotion();

  return (
    <section id="developer" className="edge-top scroll-mt-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-16 lg:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[19rem] lg:mx-0"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-5 rounded-[28px] bg-brand/12 blur-[60px]"
          />
          <SpotlightCard as="div" className="glass overflow-hidden p-2">
            <Image
              src="/shamsali.jpeg"
              alt={`${AUTHOR.name}, developer of DevCodeHub`}
              width={1024}
              height={1024}
              sizes="(max-width: 1024px) 76vw, 19rem"
              className="w-full rounded-[10px] object-cover"
            />
          </SpotlightCard>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand">
            Who made this
          </p>

          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-text-hi md:text-[2.6rem]">
            {AUTHOR.name}
          </h2>
          <p className="mt-2 text-[0.95rem] text-text-lo">{AUTHOR.role}</p>

          <p className="mt-6 max-w-[56ch] text-[1rem] leading-relaxed text-text-mid">
            {AUTHOR.bio}
          </p>

          <p className="mt-4 max-w-[56ch] text-[0.92rem] leading-relaxed text-text-lo">
            DevCodeHub is his own project, designed, built and maintained solo on
            Next.js, React and Firebase.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href={AUTHOR.github}
              rel="author me noopener noreferrer"
              target="_blank"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[0.88rem] text-text-hi transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              <BrandIcon slug="github" label="" color="f4f3f5" />
              GitHub
            </motion.a>
            <motion.a
              href={AUTHOR.linkedin}
              rel="author me noopener noreferrer"
              target="_blank"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[0.88rem] text-text-hi transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              <BrandIcon slug="linkedin" label="" color="f4f3f5" />
              LinkedIn
            </motion.a>
            <motion.a
              href={AUTHOR.instagram}
              rel="author me noopener noreferrer"
              target="_blank"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[0.88rem] text-text-hi transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              <BrandIcon slug="instagram" label="" color="f4f3f5" />
              Instagram
            </motion.a>
            <motion.a
              href={AUTHOR.portfolio}
              rel="author me noopener noreferrer"
              target="_blank"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[0.88rem] text-text-hi transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              <Globe className="h-4 w-4" strokeWidth={1.75} />
              Portfolio
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
