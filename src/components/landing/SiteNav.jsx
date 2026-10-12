'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { Menu, X } from 'lucide-react';
import Wordmark from './Wordmark';
import { logoutAction } from '@/app/(auth)/actions';

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#workflow', label: 'Workflow' },
  { href: '/editor', label: 'Editor' },
  { href: '/media', label: 'Media' },
  { href: '/#faq', label: 'FAQ' },
];

export default function SiteNav({ user = null }) {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  // Motion value subscription, so the scroll position never enters React state
  // on every frame. Only the boolean crossing re-renders.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24;
    setLifted((prev) => (prev === next ? prev : next));
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`glass-pill mx-auto max-w-[1100px] transition-shadow duration-300 ${
          lifted ? 'shadow-[0_18px_50px_-20px_rgba(0,0,0,0.95)]' : ''
        }`}
      >
        <nav
          aria-label="Primary"
          className="flex h-[60px] items-center justify-between gap-6 pl-5 pr-3 sm:pl-6"
        >
          <Link href="/" className="shrink-0">
            <Wordmark className="text-[1.05rem]" />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.86rem] text-text-mid transition-colors hover:text-text-hi"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <form action={logoutAction} className="hidden sm:block">
                <button
                  type="submit"
                  className="px-3 py-2 text-[0.86rem] text-text-mid transition-colors hover:text-text-hi"
                >
                  Log out
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="hidden px-3 py-2 text-[0.86rem] text-text-mid transition-colors hover:text-text-hi sm:block"
              >
                Log in
              </Link>
            )}
            <motion.div
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="hidden sm:block"
            >
              {user ? (
                <Link
                  href="/editor"
                  className="block rounded-full btn-primary px-4 py-2 text-[0.86rem] font-medium text-white transition-colors"
                >
                  Open editor
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="block rounded-full btn-primary px-4 py-2 text-[0.86rem] font-medium text-white transition-colors"
                >
                  Create account
                </Link>
              )}
            </motion.div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-text-hi transition-colors hover:bg-white/10 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={reduce ? false : { opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={reduce ? undefined : { opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={reduce ? false : { opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={reduce ? undefined : { opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute"
                  >
                    <Menu className="h-4 w-4" strokeWidth={1.75} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </div>

      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="glass mx-auto mt-2 max-w-[1100px] overflow-hidden !rounded-[22px] md:hidden"
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-[10px] px-3 py-2.5 text-sm text-text-mid transition-colors hover:bg-white/5 hover:text-text-hi"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/editor"
                  onClick={() => setOpen(false)}
                  className="block rounded-full btn-primary px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Open editor
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-full border border-white/10 px-4 py-2.5 text-center text-sm text-text-mid"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block rounded-full btn-primary px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-full border border-white/10 px-4 py-2.5 text-center text-sm text-text-mid"
                >
                  Log in
                </Link>
              </div>
            )}
          </li>
        </ul>
      </motion.div>
    </header>
  );
}
