'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Code2, Images, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/(auth)/actions';
import SocialLinks from '@/components/landing/SocialLinks';

const TABS = [
  { href: '/editor', label: 'Codes', icon: Code2 },
  { href: '/media', label: 'Media', icon: Images },
];

/**
 * Top bar shared by the editor and the media page. Left: who is signed in and
 * the developer's profiles. Right: the Codes / Media switch (the current one
 * is lit red) and Log out. On a phone the profiles drop out and Log out
 * becomes an icon, so the bar stays on one line.
 */
export default function AppBar({ user, onMenu, menuLabel = 'Open list' }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-white/10 bg-ink-900/40 px-3 py-2.5 backdrop-blur-2xl sm:gap-3 sm:px-4">
      {onMenu && (
        <button
          onClick={onMenu}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 p-2 text-text-hi transition-colors hover:bg-white/10 md:hidden"
          aria-label={menuLabel}
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}

      <div className="flex min-w-0 items-center gap-3">
        {user?.name && (
          <span
            className="max-w-[7.5rem] truncate text-[0.9rem] font-medium text-text-hi sm:max-w-[14rem]"
            title={user.name}
          >
            {user.name}
          </span>
        )}
        <span aria-hidden="true" className="hidden h-4 w-px bg-white/12 md:block" />
        <SocialLinks className="hidden md:flex" />
      </div>

      <nav
        aria-label="Workspace"
        className="glass-pill ml-auto flex shrink-0 items-center gap-1 p-1"
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.82rem] font-medium transition-colors ${
                active
                  ? 'border-danger/45 bg-danger/18 text-danger shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_6px_18px_-8px_rgba(214,50,63,0.7)]'
                  : 'border-transparent text-text-mid hover:text-text-hi'
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="shrink-0">
        <button
          type="submit"
          className="glass-pill inline-flex items-center gap-1.5 px-3 py-2 text-[0.82rem] text-text-mid transition-colors hover:text-text-hi"
          aria-label="Log out"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.9} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </form>
    </div>
  );
}
