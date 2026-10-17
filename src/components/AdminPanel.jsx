'use client';

import { useCallback, useEffect, useState } from 'react';
import { ref, get, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import AppBar from '@/components/AppBar';

const LABELS = {
  login: 'Signed in',
  signup: 'Created account',
  'note.create': 'Created code',
  'note.edit': 'Edited code',
  'note.rename': 'Renamed code',
  'note.delete': 'Deleted code',
  'note.pin': 'Pinned code',
  'note.lock': 'Locked code',
  'note.unlock': 'Unlocked code',
  'share.create': 'Created share',
  'share.delete': 'Deleted share',
  'admin.delete_all': 'Deleted ALL codes',
};

const DANGER = new Set(['note.delete', 'share.delete', 'admin.delete_all']);
const POLL_MS = 30_000;

const stamp = (ms) =>
  new Date(ms).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

export default function AdminPanel({ user }) {
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({ total: 0, users: 0, pages: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Wait for a pause in typing before asking the server, and go back to page 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ page: String(page) });
      if (action) qs.set('action', action);
      if (search) qs.set('q', search);
      const res = await fetch(`/api/admin/activity?${qs}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not load the log.');
      setItems(data.items);
      setTotals({ total: data.total, users: data.users, pages: data.pages, pageSize: data.pageSize });
      // The server clamps the page if entries expired out from under it.
      if (data.page !== page) setPage(data.page);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [action, search, page]);

  useEffect(() => {
    // Initial and filter-change fetch; the interval keeps the log live.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, POLL_MS);
    return () => clearInterval(t);
  }, [load]);

  /* ---- delete all ---- */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({ kind: '', text: '' });

  const deleteAll = async (e) => {
    e.preventDefault();
    if (phrase !== 'DELETE ALL' || busy) return;
    setBusy(true);
    setResult({ kind: '', text: '' });
    try {
      // The server confirms the admin session and records the action first.
      const res = await fetch('/api/admin/delete-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: phrase }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Not allowed.');

      const snap = await get(ref(database, 'notes'));
      const count = snap.exists() ? Object.keys(snap.val()).length : 0;
      await remove(ref(database, 'notes'));
      await remove(ref(database, 'presence')).catch(() => {});
      setResult({ kind: 'ok', text: `Deleted ${count} ${count === 1 ? 'code' : 'codes'}.` });
      setConfirmOpen(false);
      setPhrase('');
      load();
    } catch (err) {
      setResult({ kind: 'error', text: err.message || 'Delete failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar user={user} />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-10 sm:px-6 md:pt-14">
          <h1 className="text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.045em]">Admin</h1>
          <p className="mt-3 text-[0.95rem] text-text-mid">
            Signed in as <span className="text-text-hi">{user.email}</span>
          </p>

          {/* Stats */}
          <dl className="mt-10 grid grid-cols-3 border-y border-(--line)">
            {[
              ['Users', totals.users],
              ['Log entries', totals.total],
              ['Page', `${page} / ${totals.pages}`],
            ].map(([label, value], i) => (
              <div key={label} className={`px-4 py-5 ${i ? 'border-l border-(--line)' : ''}`}>
                <dt className="text-[0.78rem] text-text-lo">{label}</dt>
                <dd className="mt-1 text-[clamp(1.6rem,4vw,3rem)] font-medium leading-none tracking-[-0.04em]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Activity log */}
          <section className="mt-14" aria-labelledby="activity-h">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="activity-h" className="text-[1.6rem] font-medium tracking-[-0.03em]">
                Activity log
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, code..."
                  aria-label="Search activity"
                  className="w-56 border-0 border-b border-(--ink) bg-transparent px-0 py-2 text-[0.9rem] outline-none placeholder:text-(--mute) focus:border-(--accent)"
                />
                <select
                  value={action}
                  onChange={(e) => {
                    setAction(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by action"
                  className="border border-(--line) bg-(--paper) px-3 py-2 text-[0.85rem] text-(--ink) outline-none focus:border-(--accent)"
                >
                  <option value="">All actions</option>
                  {Object.entries(LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <button
                  onClick={load}
                  className="border border-(--line) px-3 py-2 text-[0.85rem] transition-colors hover:border-(--ink)"
                >
                  Refresh
                </button>
              </div>
            </div>

            <p className="mt-2 text-[0.78rem] text-text-lo">Times are India Standard Time. Updates every 30 seconds. Entries are kept for 5 days, then deleted.</p>

            {error && (
              <p role="alert" className="mt-4 border-l-2 border-danger pl-3 text-[0.9rem] text-danger">
                {error}
              </p>
            )}

            <div className="mt-6 border border-(--line)">
              <div className="hidden grid-cols-[9.5rem_1fr_1.2fr_11rem_1fr] gap-4 border-b border-(--line) px-4 py-3 text-[0.75rem] text-text-lo md:grid">
                <span>Time</span>
                <span>Who</span>
                <span>Email</span>
                <span>Action</span>
                <span>Code / share</span>
              </div>

              {loading ? (
                <p className="px-4 py-10 text-center text-[0.9rem] text-text-lo">Loading...</p>
              ) : items.length === 0 ? (
                <p className="px-4 py-10 text-center text-[0.9rem] text-text-lo">No activity yet.</p>
              ) : (
                <ul className="divide-y divide-(--line)">
                  {items.map((i) => (
                    <li
                      key={i.id}
                      className="grid gap-x-4 gap-y-1 px-4 py-3 text-[0.88rem] md:grid-cols-[9.5rem_1fr_1.2fr_11rem_1fr] md:items-center"
                    >
                      <span className="font-mono text-[0.78rem] text-text-lo">{stamp(i.at)}</span>
                      <span className="truncate font-medium">{i.name || 'Unknown'}</span>
                      <span className="truncate text-text-mid">{i.email}</span>
                      <span className={DANGER.has(i.action) ? 'font-medium text-danger' : ''}>
                        {LABELS[i.action] || i.action}
                      </span>
                      <span className="truncate text-text-mid">{i.targetName || '-'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <nav aria-label="Activity log pages" className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[0.82rem] text-text-lo">
                {totals.total === 0
                  ? '0 entries'
                  : `${(page - 1) * totals.pageSize + 1}-${Math.min(page * totals.pageSize, totals.total)} of ${totals.total}`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                  aria-label="Previous 10 entries"
                  className="border border-(--line) px-4 py-2 text-[1.1rem] leading-none transition-colors hover:border-(--ink) disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-(--line)"
                >
                  &lt;
                </button>
                <span className="min-w-[5.5rem] text-center font-mono text-[0.82rem]">
                  {page} / {totals.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totals.pages))}
                  disabled={page >= totals.pages}
                  aria-label="Next 10 entries"
                  className="border border-(--line) px-4 py-2 text-[1.1rem] leading-none transition-colors hover:border-(--ink) disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-(--line)"
                >
                  &gt;
                </button>
              </div>
            </nav>
          </section>

          {/* Danger zone */}
          <section className="mt-16 border border-danger p-5 sm:p-7" aria-labelledby="danger-h">
            <h2 id="danger-h" className="text-[1.3rem] font-medium tracking-[-0.02em] text-danger">
              Delete all codes
            </h2>
            <p className="mt-2 max-w-[60ch] text-[0.92rem] leading-relaxed text-text-mid">
              Removes every code from the editor for everyone, including pinned and locked ones. This
              cannot be undone, and the action is recorded in the log with your name and email.
            </p>

            {result.text && (
              <p
                role={result.kind === 'error' ? 'alert' : 'status'}
                className={`mt-4 border-l-2 pl-3 text-[0.9rem] ${
                  result.kind === 'error' ? 'border-danger text-danger' : 'border-(--ink)'
                }`}
              >
                {result.text}
              </p>
            )}

            {!confirmOpen ? (
              <button
                onClick={() => {
                  setConfirmOpen(true);
                  setResult({ kind: '', text: '' });
                }}
                className="btn-danger mt-6 px-6 py-3 text-[0.9rem] font-medium"
              >
                Delete all codes
              </button>
            ) : (
              <form onSubmit={deleteAll} className="mt-6 max-w-md">
                <label className="block">
                  <span className="mb-1 block text-[0.8rem] text-text-lo">
                    Type <b className="text-text-hi">DELETE ALL</b> to confirm
                  </span>
                  <input
                    autoFocus
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    autoComplete="off"
                    className="w-full border-0 border-b border-danger bg-transparent px-0 py-2.5 text-[1rem] outline-none"
                  />
                </label>
                <div className="mt-5 flex gap-3">
                  <button
                    type="submit"
                    disabled={phrase !== 'DELETE ALL' || busy}
                    className="btn-danger px-6 py-3 text-[0.9rem] font-medium"
                  >
                    {busy ? 'Deleting...' : 'Delete everything'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmOpen(false);
                      setPhrase('');
                    }}
                    className="border border-(--line) px-6 py-3 text-[0.9rem] transition-colors hover:border-(--ink)"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
