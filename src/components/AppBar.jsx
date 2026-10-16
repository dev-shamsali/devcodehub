'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Code2, Images, LogOut, ShieldCheck } from 'lucide-react';
import { logoutAction } from '@/app/(auth)/actions';
import SocialLinks from '@/components/landing/SocialLinks';
import ThemeToggle from '@/components/ThemeToggle';

const TABS = [
  { href: '/editor', label: 'Codes', icon: Code2 },
  { href: '/media', label: 'Media', icon: Images },
];
const ADMIN_TAB = { href: '/admin', label: 'Admin', icon: ShieldCheck };

/**
 * Top bar shared by the editor and the media page. Left: who is signed in and
 * the developer's profiles. Right: the Codes / Media switch (the current one
 * is lit red) and Log out. On a phone the profiles drop out and Log out
 * becomes an icon, so the bar stays on one line.
 */
export default function AppBar({ user, onMenu, menuLabel = 'Open list' }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-(--line) bg-(--paper) px-3 py-0 sm:gap-3 sm:px-4">
      {onMenu && (
        <button
          onClick={onMenu}
          className="shrink-0 border border-(--line) p-2 text-(--ink) transition-colors hover:bg-(--ink) hover:text-(--paper) md:hidden"
          aria-label={menuLabel}
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}

      <div className="flex min-w-0 items-center gap-3">
        {user?.name && (
          <span
            className="max-w-[7.5rem] truncate py-3.5 text-[0.9rem] font-medium text-text-hi sm:max-w-[14rem]"
            title={user.name}
          >
            {user.name}
          </span>
        )}
        <span aria-hidden="true" className="hidden h-4 w-px bg-(--line) md:block" />
        <SocialLinks className="hidden md:flex" />
      </div>

      <nav aria-label="Workspace" className="ml-auto flex h-[52px] shrink-0 items-stretch">
        {(user?.role === 'admin' ? [...TABS, ADMIN_TAB] : TABS).map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 border-b-2 px-4 text-[0.85rem] font-medium transition-colors ${
                active
                  ? 'border-danger bg-danger/10 text-danger'
                  : 'border-transparent text-text-mid hover:text-text-hi'
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
      </nav>

      <ThemeToggle className="swiss-link hidden shrink-0 text-[0.8rem] text-text-mid lg:block" />

      <form action={logoutAction} className="shrink-0">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 border border-(--line) px-3 py-2 text-[0.82rem] text-text-mid transition-colors hover:border-(--ink) hover:text-text-hi"
          aria-label="Log out"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.9} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </form>
    </div>
  );
}
