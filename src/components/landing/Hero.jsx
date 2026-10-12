'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Images, FileArchive, Code2 } from 'lucide-react';

/**
 * Chips orbiting the emblem. Each is a glass tile with its own fill,
 * and floats on a slow spring so the hero is alive without being busy.
 */
const CHIPS = [
  { icon: Images, label: 'Images', className: 'left-[-6%] top-[10%]', delay: 0 },
  { icon: FileArchive, label: 'Archives', className: 'right-[-10%] top-[50%]', delay: 0.6 },
  { icon: Code2, label: 'Live editor', className: 'left-[2%] bottom-[5%]', delay: 1.2 },
];

export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section className="relative overflow-hidden pt-24">
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-16 pt-6 sm:px-8 lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pb-16">
        <div>
          <motion.h1
            {...rise(0)}
            className="font-display text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-text-hi md:text-5xl lg:text-6xl"
          >
            Edit code live.
            <br />
            Share files in{' '}
            <span className="bg-gradient-to-b from-brand-soft to-brand bg-clip-text text-transparent">
              one link
            </span>
            .
          </motion.h1>

          <motion.p
            {...rise(0.08)}
            className="mt-6 max-w-[44ch] text-base leading-relaxed text-text-mid sm:text-[1.05rem]"
          >
            A realtime code editor and a shared file drop for your team. Sign
            in once to use both.
          </motion.p>

          <motion.div {...rise(0.16)} className="mt-9 flex flex-wrap items-center gap-3">
            <motion.div
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 btn-primary rounded-full px-6 py-3 text-[0.94rem] font-medium text-white"
              >
                Get started
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </motion.div>
            <motion.a
              href="#workflow"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="glass-pill inline-flex items-center px-6 py-3 text-[0.94rem] text-text-hi transition-colors hover:bg-white/[0.08]"
            >
              How it works
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-full max-w-[460px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[8%] rounded-full bg-brand/25 blur-[90px]"
          />

          <div className="glass glass-lit glass-hover !absolute inset-[10%] grid place-items-center overflow-hidden p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.png"
              alt="DevCodeHub logo"
              width={256}
              height={256}
              className="w-[64%] rounded-[18px] shadow-[0_24px_60px_-20px_rgba(61,141,255,0.6)]"
            />
          </div>

          {CHIPS.map(({ icon: Icon, label, className, delay }) => (
            <motion.div
              key={label}
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5.5, delay, repeat: Infinity, ease: 'easeInOut' }}
              className={`glass-pill glass-hover group absolute hidden items-center gap-3 py-2 pl-2 pr-5 sm:flex ${className}`}
            >
              <span className="icon-chip !h-10 !w-10">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="text-[0.84rem] font-medium text-text-hi">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
