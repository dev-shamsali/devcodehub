'use client';

import { useCallback, useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Images, Pin, PinOff, Trash2, MoreVertical } from 'lucide-react';

/**
 * Sidebar list of media shares, backed by MongoDB through /api/media/shares.
 *
 * Unlike the snippet list, this cannot subscribe for pushes: MongoDB has no
 * browser channel. It polls instead, and refetches immediately after any
 * mutation so the local view never lags behind an action the user just took.
 */

const POLL_MS = 6000;

export default function MediaList({ selectedId, onSelect, refreshToken }) {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, share: null });
  const [now, setNow] = useState(() => Date.now());

  // Pure fetch. Keeping the state writes out of here lets the effect below
  // apply them from a promise callback rather than synchronously.
  const fetchShares = useCallback(async () => {
    const res = await fetch('/api/media/shares', { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'Could not load shares.');
    return data.shares;
  }, []);

  // Used from event handlers, where setState is fine.
  const load = useCallback(
    () =>
      fetchShares()
        .then((list) => {
          setShares(list);
          setError('');
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false)),
    [fetchShares]
  );

  useEffect(() => {
    let alive = true;

    const tick = () =>
      fetchShares()
        .then((list) => {
          if (!alive) return;
          setShares(list);
          setError('');
        })
        .catch((err) => alive && setError(err.message))
        .finally(() => alive && setLoading(false));

    tick();
    const poll = setInterval(tick, POLL_MS);
    const clock = setInterval(() => setNow(Date.now()), 60_000);

    return () => {
      alive = false;
      clearInterval(poll);
      clearInterval(clock);
    };
    // refreshToken is a deliberate trigger: the gallery bumps it after an
    // upload or delete so counts refresh without waiting out the poll.
  }, [fetchShares, refreshToken]);

  const createShare = async () => {
    const name = newName.trim();
    if (!name || isCreating) return;

    setIsCreating(true);
    setError('');
    try {
      const res = await fetch('/api/media/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not create that share.');

      setNewName('');
      setShares((prev) => [data.share, ...prev]);
      onSelect(data.share.id, data.share.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const togglePin = async (share) => {
    setMenuOpen(null);
    setShares((prev) =>
      prev.map((s) => (s.id === share.id ? { ...s, pinned: !s.pinned } : s))
    );
    await fetch(`/api/media/shares/${share.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: !share.pinned }),
    }).catch(() => {});
    load();
  };

  const deleteShare = async () => {
    const share = confirm.share;
    if (!share) return;
    setConfirm({ open: false, share: null });
    setShares((prev) => prev.filter((s) => s.id !== share.id));
    if (selectedId === share.id) onSelect(null);

    try {
      const res = await fetch(`/api/media/shares/${share.id}`, { method: 'DELETE' });
      const data = await res.json();
      // Release the bytes on ImageKit too, so a deleted share does not leave
      // orphaned files behind on the CDN account.
      await Promise.all(
        (data.fileIds || []).map((fileId) =>
          fetch('/api/media/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId }),
          }).catch(() => {})
        )
      );
    } catch {
      setError('Share removed, but some files may remain on ImageKit.');
    }
    load();
  };

  const formatDate = (ts) => {
    const diff = now - ts;
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  const filtered = shares.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex h-full flex-col text-text-hi">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/8 bg-ink-800/85 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5 text-brand" strokeWidth={1.75} />
            <h2 className="text-base font-semibold">Shares</h2>
          </div>
          <span className="text-xs text-text-lo">Total: {shares.length}</span>
        </div>

        <div className="sticky top-[52px] z-20 border-b border-white/8 bg-ink-800/85 px-4 py-3 backdrop-blur-xl">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-lo"
              strokeWidth={1.75}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shares..."
              className="w-full rounded-[10px] border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-text-hi outline-none placeholder:text-text-lo focus:border-brand/40 focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <div className="sticky top-[113px] z-20 border-b border-white/8 bg-ink-800/85 px-4 py-3 backdrop-blur-xl">
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && createShare()}
              placeholder="New share name..."
              className="flex-1 rounded-[10px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-text-hi outline-none placeholder:text-text-lo focus:border-brand/40 focus:ring-2 focus:ring-brand/30"
            />
            <button
              onClick={createShare}
              disabled={!newName.trim() || isCreating}
              className="rounded-[10px] bg-brand-solid px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover disabled:bg-white/[0.10] disabled:text-text-lo"
            >
              {isCreating ? '...' : 'Add'}
            </button>
          </div>
          {error && <p className="mt-2 text-[11px] text-brand-soft">{error}</p>}
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {loading ? (
            <div className="space-y-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[58px] animate-pulse rounded-[10px] border border-white/8 bg-white/[0.03]"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-lo">
              {shares.length === 0
                ? 'No shares yet. Name one above to start.'
                : 'No shares match that search.'}
            </p>
          ) : (
            filtered.map((share) => {
              const active = share.id === selectedId;
              return (
                <div
                  key={share.id}
                  className={`relative flex items-center gap-2 rounded-[10px] border px-3 py-2 transition-colors ${
                    active
                      ? 'border-brand/40 bg-brand/10'
                      : 'border-white/8 bg-white/[0.025] hover:border-white/14 hover:bg-white/[0.06]'
                  }`}
                >
                  <button
                    onClick={() => onSelect(share.id, share.name)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      {share.pinned && (
                        <Pin className="h-3 w-3 shrink-0 text-brand" strokeWidth={2} />
                      )}
                      <span className="truncate text-sm font-medium text-text-hi">
                        {share.name}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-text-lo">
                      {share.fileCount} {share.fileCount === 1 ? 'file' : 'files'}
                      {' · '}
                      {formatDate(share.updatedAt)}
                    </span>
                  </button>

                  <button
                    onClick={() => setMenuOpen(menuOpen === share.id ? null : share.id)}
                    className="rounded-md p-1.5 text-text-mid transition-colors hover:bg-white/[0.08] hover:text-text-hi"
                    aria-label={`Actions for ${share.name}`}
                    aria-expanded={menuOpen === share.id}
                  >
                    <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
                  </button>

                  {menuOpen === share.id && (
                    <div className="glass absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden">
                      <button
                        onClick={() => togglePin(share)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-hi transition-colors hover:bg-white/[0.06]"
                      >
                        {share.pinned ? (
                          <>
                            <PinOff className="h-3.5 w-3.5" strokeWidth={1.75} /> Unpin
                          </>
                        ) : (
                          <>
                            <Pin className="h-3.5 w-3.5" strokeWidth={1.75} /> Pin
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setConfirm({ open: true, share });
                          setMenuOpen(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-brand-soft transition-colors hover:bg-brand/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <Transition appear show={confirm.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[70]"
          onClose={() => setConfirm({ open: false, share: null })}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="glass w-full max-w-xs p-4">
                <Dialog.Title className="text-sm font-semibold text-brand-soft">
                  Delete this share
                </Dialog.Title>
                <p className="mt-1 text-[11px] leading-relaxed text-text-mid">
                  Removes <b>{confirm.share?.name}</b> and deletes its files from
                  ImageKit. This cannot be undone.
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setConfirm({ open: false, share: null })}
                    className="rounded px-2 py-1 text-xs text-text-mid transition-colors hover:bg-white/[0.08] hover:text-text-hi"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteShare}
                    className="rounded bg-brand-solid px-3 py-1 text-xs text-white transition-colors hover:bg-brand-solid-hover"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
