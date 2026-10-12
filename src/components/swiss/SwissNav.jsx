'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/(auth)/actions';

const LINKS = [
  { href: '/#features', label: 'Features', col: 'md:col-start-2' },
  { href: '/#workflow', label: 'Workflow', col: 'md:col-start-3' },
  { href: '/editor', label: 'Editor', col: 'md:col-start-4' },
  { href: '/media', label: 'Media', col: 'md:col-start-5' },
  { href: '/#faq', label: 'FAQ', col: 'md:col-start-6' },
];

const cell =
  'relative hidden h-full items-center pl-3 text-[0.8rem] transition-colors hover:text-(--accent) md:flex after:absolute after:bottom-0 after:left-0 after:h-2 after:w-px after:bg-(--ink)';

/**
 * Sticky index bar. Each destination sits on a column guide with a tick
 * under it, so the nav reads as part of the grid. On a phone it collapses to
 * the mark and a Menu toggle that opens a full-width list.
 */
export default function SwissNav({ user = null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-(--paper) text-(--ink)">
      <nav
        aria-label="Primary"
        className="swiss-cols grid h-[52px] grid-cols-4 border-b border-(--line) md:grid-cols-8"
      >
        <Link href="/" className="flex h-full items-center pl-4" aria-label="DevCodeHub home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" width={26} height={26} className="h-[26px] w-[26px]" />
        </Link>

        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`${cell} ${l.col}`}>
            {l.label}
          </Link>
        ))}

        {user ? (
          <>
            <form action={logoutAction} className="hidden h-full md:col-start-7 md:block">
              <button type="submit" className={`${cell} w-full text-left`}>
                Log out
              </button>
            </form>
            <Link href="/editor" className={`${cell} md:col-start-8 font-medium`}>
              Open editor
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className={`${cell} md:col-start-7`}>
              Log in
            </Link>
            <Link href="/signup" className={`${cell} md:col-start-8 font-medium`}>
              Create account
            </Link>
          </>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="swiss-menu"
          className="col-start-4 flex h-full items-center justify-end pr-4 text-[0.8rem] md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <div
          id="swiss-menu"
          className="absolute inset-x-0 top-[52px] border-b border-(--line) bg-(--paper) px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="divide-y divide-(--line)">
            {[...LINKS, ...(user ? [{ href: '/editor', label: 'Open editor' }] : [{ href: '/login', label: 'Log in' }, { href: '/signup', label: 'Create account' }])].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-[1.5rem] font-medium tracking-tight"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <form action={logoutAction}>
                  <button type="submit" className="block w-full py-3.5 text-left text-[1.5rem] font-medium tracking-tight">
                    Log out
                  </button>
                </form>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
