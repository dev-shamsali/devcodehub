'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Wordmark from './Wordmark';

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#workflow', label: 'Workflow' },
  { href: '/media', label: 'Media' },
  { href: '/#faq', label: 'FAQ' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const { scrollY } = useScroll();

  // Motion value subscription, so the scroll position never enters React state
  // on every frame. Only the boolean crossing re-renders.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24;
    setLifted((prev) => (prev === next ? prev : next));
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          lifted
            ? 'border-b border-white/8 bg-ink-900/72 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8"
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
            <Link
              href="/editor"
              className="hidden rounded-full bg-brand-solid px-4 py-2 text-[0.86rem] font-medium text-white transition-all hover:bg-brand-solid-hover active:translate-y-px sm:block"
            >
              Open editor
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-text-hi transition-colors hover:bg-white/10 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <X className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Menu className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </nav>
      </div>

      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden border-b border-white/8 bg-ink-900/95 backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto flex max-w-[1200px] flex-col gap-1 px-5 py-4">
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
            <Link
              href="/editor"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-brand-solid px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Open editor
            </Link>
          </li>
        </ul>
      </motion.div>
    </header>
  );
}
