'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { X, FileCode2, ArrowLeft } from 'lucide-react';
import AppBar from '@/components/AppBar';
import NoteList from '@/components/NoteList';
import CodeEditor from '@/components/CodeEditor';
import Wordmark from '@/components/landing/Wordmark';

export default function EditorWorkspace({ user }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelect = useCallback((id) => {
    setSelectedNoteId(id);
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="relative flex h-full overflow-hidden">

      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-ink-900/70 backdrop-blur-sm transition-opacity md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[19rem] transform flex-col border-r border-white/10 bg-ink-900/60 backdrop-blur-2xl transition-transform duration-300 ease-out sm:w-80 md:static md:w-[22rem] md:translate-x-0 ${
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
            aria-label="Close snippet list"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <NoteList onSelect={handleSelect} user={user} selectedId={selectedNoteId} />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <AppBar user={user} onMenu={() => setIsSidebarOpen(true)} menuLabel="Open snippet list" />

        <div className="min-h-0 flex-1 p-3 sm:p-5">
          {selectedNoteId ? (
            <CodeEditor noteId={selectedNoteId} user={user} />
          ) : (
            <div className="glass flex h-full min-h-[24rem] items-center justify-center p-8">
              <div className="max-w-sm text-center">
                <div className="icon-chip mx-auto mb-5 !h-14 !w-14">
                  <FileCode2 className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h2 className="font-display text-xl tracking-tight text-text-hi">
                  Nothing open yet
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-mid">
                  Pick a snippet from the list, or name a new one to start a
                  buffer your team can edit alongside you.
                </p>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mt-5 btn-primary px-5 py-2.5 text-sm font-medium md:hidden"
                >
                  Browse snippets
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
