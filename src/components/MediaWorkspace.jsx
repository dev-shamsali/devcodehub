'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, Code2, Images, ArrowLeft } from 'lucide-react';
import MediaList from '@/components/MediaList';
import MediaGallery from '@/components/MediaGallery';
import Wordmark from '@/components/landing/Wordmark';

/**
 * Shell for /media. Same two-pane shape as the editor: a sidebar of shares on
 * the left, the selected share on the right, drawer-style on small screens.
 */
export default function MediaWorkspace() {
  const [selected, setSelected] = useState({ id: null, name: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Bumped by the gallery after an upload or delete so the sidebar refetches
  // instead of waiting out its poll interval.
  const [refreshToken, setRefreshToken] = useState(0);

  const handleChanged = useCallback(() => setRefreshToken((n) => n + 1), []);

  const handleSelect = useCallback((id, name = '') => {
    setSelected({ id, name });
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="relative flex h-full overflow-hidden bg-ink-900">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-brand/12 blur-[120px]"
      />

      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-ink-900/70 backdrop-blur-sm transition-opacity md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[19rem] transform flex-col border-r border-white/8 bg-ink-800/80 backdrop-blur-xl transition-transform duration-300 ease-out sm:w-80 md:static md:w-[22rem] md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-mid transition-colors hover:text-text-hi"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            <Wordmark className="text-[0.9rem]" />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-full p-1.5 text-text-mid transition-colors hover:bg-white/5 hover:text-text-hi md:hidden"
            aria-label="Close share list"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <MediaList
            selectedId={selected.id}
            onSelect={handleSelect}
            refreshToken={refreshToken}
          />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/8 bg-ink-900/80 px-4 py-3 backdrop-blur-xl">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-text-hi transition-colors hover:bg-white/10 md:hidden"
            aria-label="Open share list"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <Wordmark className="text-[0.9rem] md:hidden" />

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-1.5 text-[0.82rem] text-text-mid transition-colors hover:text-text-hi"
            >
              <Code2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Editor
            </Link>
            <a
              href="#about"
              className="hidden text-[0.82rem] text-text-mid transition-colors hover:text-text-hi sm:block"
            >
              About
            </a>
          </div>
        </div>

        <div className="min-h-0 flex-1 p-3 sm:p-5">
          {selected.id ? (
            // Keyed so a share switch remounts with fresh state instead of
            // briefly showing the previous share's files.
            <MediaGallery
              key={selected.id}
              shareId={selected.id}
              shareName={selected.name}
              onChanged={handleChanged}
            />
          ) : (
            <div className="glass flex h-full min-h-[24rem] items-center justify-center p-8">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-brand/25 bg-brand/10">
                  <Images className="h-5 w-5 text-brand-soft" strokeWidth={1.75} />
                </div>
                <h2 className="font-display text-xl tracking-tight text-text-hi">
                  No share open
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-mid">
                  Pick a share from the list, or name a new one to start
                  collecting images and archives in one place.
                </p>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mt-5 rounded-full bg-brand-solid px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover active:scale-[0.98] md:hidden"
                >
                  Browse shares
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
