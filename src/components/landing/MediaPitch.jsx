'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Images, FileArchive, Link2, Timer } from 'lucide-react';

const POINTS = [
  {
    icon: Images,
    title: 'Many files, one share',
    body: 'Drop a whole folder of screenshots at once. They upload in parallel and appear for everyone watching the share.',
  },
  {
    icon: FileArchive,
    title: 'Archives welcome',
    body: 'Zip files sit alongside images with a direct download link, so a build output or a bundle of assets travels the same way.',
  },
  {
    icon: Link2,
    title: 'Copy a direct link',
    body: 'Every file has a CDN URL you can paste into an issue, a pull request or a chat thread.',
  },
  {
    icon: Timer,
    title: 'Clears itself',
    body: 'Unpinned shares expire 36 hours after their last change. Pin the ones you need to keep.',
  },
];

export default function MediaPitch() {
  const reduce = useReducedMotion();

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section id="about" className="edge-top relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-2/3 rounded-full bg-brand/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
          <motion.h1
            {...rise(0)}
            className="font-display text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-text-hi md:text-5xl lg:text-[3.4rem]"
          >
            Share the screenshots.
            <br />
            Skip the{' '}
            <span className="relative whitespace-nowrap text-brand">
              attachment
              <svg
                aria-hidden="true"
                viewBox="0 0 120 10"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2 w-full text-brand/45"
              >
                <path
                  d="M2 7C28 3 62 2 118 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p
            {...rise(0.08)}
            className="max-w-[48ch] text-base leading-relaxed text-text-mid sm:text-[1.05rem]"
          >
            DevCodeHub Media is a shared drop for the images and archives that
            move around a team during review. Name a share above, add as many
            files as you like, send the link.
          </motion.p>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.li
                key={point.title}
                {...rise(Math.min(i * 0.07, 0.24))}
                className="glass p-6"
              >
                <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-text-mid">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-text-hi">
                  {point.title}
                </h2>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-text-mid">
                  {point.body}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
