'use client';

import { useEffect, useState, Fragment } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, set, update, child } from 'firebase/database';
import {
  Search,
  FolderOpen,
  MoreVertical,
  Lock,
  Unlock,
  Pin,
  PinOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';

const THIRTY_SIX_HOURS_MS = 36 * 60 * 60 * 1000;

export default function NoteList({ onSelect, onDelete }) {
  const [notes, setNotes] = useState([]);
  const [newNoteName, setNewNoteName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // PIN modal state
  const [pinModal, setPinModal] = useState({
    open: false,
    action: null, // 'open' | 'setLock' | 'unlock' | 'delete'
    noteId: null,
  });
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');

  // Confirm modal (for delete selected/single)
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: '',
    onConfirm: null,
  });

  // Master delete modal
  const [masterModalOpen, setMasterModalOpen] = useState(false);
  const [masterValue, setMasterValue] = useState('');
  const [masterError, setMasterError] = useState('');
  const [masterChecking, setMasterChecking] = useState(false);

  // Relative timestamps need a clock, but reading Date.now() during render is
  // impure and desyncs on re-render. Sample it on an interval instead.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* -------------------- LOAD & AUTO-CLEAN -------------------- */
  useEffect(() => {
    const notesRef = ref(database, 'notes');

    const unsubscribe = onValue(
      notesRef,
      async (snapshot) => {
        const data = snapshot.val() || {};
        const now = Date.now();
        const updates = {};
        const list = [];

        for (const id of Object.keys(data)) {
          const n = data[id];

          if (!n || typeof n !== 'object') {
            updates[id] = null;
            continue;
          }

          const rawName = n.name ?? '';
          const trimmedName = String(rawName).trim();

          // Remove empty names
          if (!trimmedName) {
            updates[id] = null;
            continue;
          }

          // Remove ghost notes where name == generated id (old bug)
          if (trimmedName === id && id.startsWith('note_')) {
            updates[id] = null;
            continue;
          }

          const pinned = !!n.pinned;
          const locked = !!n.locked;
          const createdAt = n.createdAt || now;
          const lastModified = n.lastModified || createdAt;

          // Auto-delete: only if NOT pinned, NOT locked, older than 36h
          if (!pinned && !locked && now - createdAt > THIRTY_SIX_HOURS_MS) {
            updates[id] = null;
            continue;
          }

          list.push({
            id,
            name: trimmedName,
            content: n.content || '',
            pinned,
            locked,
            pinCode: n.pinCode || '',
            createdAt,
            lastModified,
          });
        }

        if (Object.keys(updates).length) {
          try {
            await update(notesRef, updates);
          } catch (e) {
            console.error('Auto-clean failed:', e);
          }
        }

        list.sort(
          (a, b) =>
            (b.pinned - a.pinned) ||
            (b.lastModified - a.lastModified)
        );

        setNotes(list);
        setLoading(false);

        // Clean selection from deleted ids
        setSelectedIds((prev) => {
          const next = new Set(
            [...prev].filter((id) => list.some((n) => n.id === id))
          );
          return next;
        });
      },
      (err) => {
        console.error(err);
        setError('Failed to load codes');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* -------------------- HELPERS -------------------- */

  const filtered = notes.filter((n) =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (ts) => {
    const d = new Date(ts);
    const diff = now - d.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return d.toLocaleDateString();
  };

  const findNote = (id) => notes.find((n) => n.id === id);

  /* -------------------- CREATE NOTE -------------------- */

  const createNote = async () => {
    const trimmed = newNoteName.trim();
    if (!trimmed) {
      setError('Please enter a code name');
      return;
    }
    if (
      notes.some(
        (n) => n.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setError('Duplicate name');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const now = Date.now();
      const id = `note_${now}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const noteRef = child(ref(database, 'notes'), id);
      await set(noteRef, {
        name: trimmed,
        content: '',
        createdAt: now,
        lastModified: now,
        pinned: false,
        locked: false,
        pinCode: '',
      });
      setNewNoteName('');
    } catch (err) {
      console.error(err);
      setError('Failed to create code');
    } finally {
      setIsCreating(false);
    }
  };

  /* -------------------- SELECTION -------------------- */

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () =>
    setSelectedIds(new Set(filtered.map((n) => n.id)));

  const clearSelection = () => setSelectedIds(new Set());

  /* -------------------- PIN & LOCK -------------------- */

  const handleTogglePin = async (note) => {
    try {
      await update(ref(database, `notes/${note.id}`), {
        pinned: !note.pinned,
        lastModified: Date.now(),
      });
    } catch (e) {
      console.error('Toggle pin failed:', e);
    }
  };

  const openSetLockModal = (note) => {
    setPinModal({
      open: true,
      action: 'setLock',
      noteId: note.id,
    });
    setPinValue('');
    setPinError('');
  };

  const openUnlockModal = (note) => {
    if (!note.pinCode) {
      // no PIN, just unlock
      update(ref(database, `notes/${note.id}`), {
        locked: false,
        pinCode: '',
        lastModified: Date.now(),
      }).catch((e) => console.error(e));
      return;
    }
    setPinModal({
      open: true,
      action: 'unlock',
      noteId: note.id,
    });
    setPinValue('');
    setPinError('');
  };

  /* -------------------- OPEN / DELETE (PIN MODALS) -------------------- */

  const openLockedNoteModal = (note) => {
    if (!note.pinCode) {
      // Locked with no pin -> just block editing; allow open read
      onSelect?.(note.id, note.name);
      return;
    }
    setPinModal({
      open: true,
      action: 'open',
      noteId: note.id,
    });
    setPinValue('');
    setPinError('');
  };

  const openDeleteLockedModal = (note) => {
    if (!note.locked || !note.pinCode) {
      // no pin-protection: go through confirm modal
      setConfirmModal({
        open: true,
        message: `Delete "${note.name}"?`,
        onConfirm: () => deleteNotes([note.id]),
      });
      return;
    }
    setPinModal({
      open: true,
      action: 'delete',
      noteId: note.id,
    });
    setPinValue('');
    setPinError('');
  };

  /* -------------------- DELETE HELPERS -------------------- */

  const deleteNotes = async (ids) => {
    if (!ids.length) return;
    const updates = {};
    ids.forEach((id) => {
      updates[id] = null;
    });
    try {
      await update(ref(database, 'notes'), updates);
      ids.forEach((id) => onDelete?.(id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } catch (e) {
      console.error('Delete failed:', e);
      setError('Failed to delete codes');
    }
  };

  const deleteSelected = () => {
    const ids = [...selectedIds];
    if (!ids.length) return;
    setConfirmModal({
      open: true,
      message: `Delete ${ids.length} selected code(s)? Locked notes with PIN are skipped.`,
      onConfirm: () => {
        // For simplicity: only delete notes that are not locked+pin
        const deletable = ids.filter((id) => {
          const n = findNote(id);
          return !(n?.locked && n.pinCode);
        });
        deleteNotes(deletable);
      },
    });
  };

  const openMasterDeleteModal = () => {
    if (!notes.length) return;
    setMasterValue('');
    setMasterError('');
    setMasterModalOpen(true);
  };

  const confirmMasterDelete = async () => {
    setMasterError('');
    setMasterChecking(true);
    try {
      const res = await fetch('/api/master-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: masterValue }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setMasterError(data.error || 'Incorrect master password.');
        return;
      }
      await deleteNotes(notes.map((n) => n.id));
      setMasterModalOpen(false);
    } catch {
      setMasterError('Could not reach the server. Try again.');
    } finally {
      setMasterChecking(false);
    }
  };

  /* -------------------- PIN MODAL CONFIRM -------------------- */

  const handlePinModalConfirm = async () => {
    const { action, noteId } = pinModal;
    const note = findNote(noteId);
    if (!note) {
      setPinModal({ open: false, action: null, noteId: null });
      return;
    }

    const val = pinValue.trim();

    try {
      if (action === 'setLock') {
        // Allow empty (lock without PIN) OR 4-digit
        if (val && !/^\d{4}$/.test(val)) {
          setPinError('PIN must be 4 digits or leave empty.');
          return;
        }
        await update(ref(database, `notes/${noteId}`), {
          locked: true,
          pinCode: val || '',
          lastModified: Date.now(),
        });
        setPinModal({ open: false, action: null, noteId: null });
      }

      if (action === 'unlock') {
        if (val !== note.pinCode) {
          setPinError('Incorrect PIN.');
          return;
        }
        await update(ref(database, `notes/${noteId}`), {
          locked: false,
          pinCode: '',
          lastModified: Date.now(),
        });
        setPinModal({ open: false, action: null, noteId: null });
      }

      if (action === 'open') {
        if (val !== note.pinCode) {
          setPinError('Incorrect PIN.');
          return;
        }
        setPinModal({ open: false, action: null, noteId: null });
        onSelect?.(note.id, note.name);
      }

      if (action === 'delete') {
        if (val !== note.pinCode) {
          setPinError('Incorrect PIN.');
          return;
        }
        await deleteNotes([note.id]);
        setPinModal({ open: false, action: null, noteId: null });
      }
    } catch (e) {
      console.error('PIN action failed:', e);
      setPinError('Something went wrong. Try again.');
    }
  };

  /* -------------------- RENDER -------------------- */

  return (
    <>
      <div className="flex h-full flex-col text-text-hi">
        {/* HEADER */}
        <div className="bg-ink-800/85 backdrop-blur-xl px-4 py-3 border-b border-white/8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-brand" />
            <h2 className="text-base font-semibold">Codes</h2>
          </div>
          <span className="text-xs text-text-lo">
            Total: {notes.length}
          </span>
        </div>

        {/* SEARCH */}
        <div className="bg-ink-800/85 backdrop-blur-xl px-4 py-3 border-b border-white/8 sticky top-[44px] z-20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-lo" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search codes..."
              className="w-full rounded-[10px] border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-text-hi placeholder:text-text-lo focus:border-brand/40 focus:ring-2 focus:ring-brand/30 outline-none"
            />
          </div>
        </div>

        {/* ADD + BULK */}
        <div className="bg-ink-800/85 backdrop-blur-xl px-4 py-3 border-b border-white/8 sticky top-[92px] z-20 space-y-2">
          <div className="flex gap-2">
            <input
              value={newNoteName}
              onChange={(e) => {
                setNewNoteName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && createNote()}
              placeholder="New code name..."
              className="flex-1 rounded-[10px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-text-hi placeholder:text-text-lo focus:border-brand/40 focus:ring-2 focus:ring-brand/30 outline-none"
            />
            <button
              onClick={createNote}
              disabled={!newNoteName.trim() || isCreating}
              className="px-4 py-2 rounded-lg bg-brand-solid text-white text-sm font-medium hover:bg-brand-solid-hover disabled:bg-white/[0.10] disabled:text-text-lo"
            >
              {isCreating ? '...' : 'Add'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-mid">
            <span>Selected: {selectedIds.size}</span>
            <button
              onClick={selectAll}
              className="px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.10]"
            >
              Select all
            </button>
            <button
              onClick={clearSelection}
              className="px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.10]"
            >
              Clear
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedIds.size}
              className="px-2 py-1 rounded bg-brand/10 text-brand-soft hover:bg-brand/15 disabled:opacity-40"
            >
              Delete selected
            </button>
            <button
              onClick={openMasterDeleteModal}
              disabled={!notes.length}
              className="px-3 py-1.5 rounded bg-brand-solid text-white text-xs font-semibold hover:bg-brand-solid-hover disabled:opacity-40"
            >
              Delete all
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {loading ? (
            <div className="text-center py-8 text-text-lo text-sm">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-text-lo text-sm">
              No codes found.
            </div>
          ) : (
            filtered.map((note) => (
              <motion.div
                key={note.id}
                layout
                className="flex items-center justify-between rounded-[10px] border border-white/8 bg-white/[0.025] px-3 py-2 transition-colors hover:border-white/14 hover:bg-white/[0.06]"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedIds.has(note.id)}
                  onChange={() => toggleSelect(note.id)}
                  className="accent-blue-600 mr-2"
                />

                {/* Note info */}
                <div
                  className={`flex-1 cursor-pointer ${
                    note.locked ? 'opacity-70' : ''
                  }`}
                  onClick={() =>
                    note.locked
                      ? openLockedNoteModal(note)
                      : onSelect?.(note.id, note.name)
                  }
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-text-hi">
                    <span className="truncate">{note.name}</span>
                    {note.pinned && (
                      <Pin className="w-4 h-4 text-brand-soft" />
                    )}
                    {note.locked && (
                      <Lock className="w-4 h-4 text-text-mid" />
                    )}
                  </div>
                  <p className="text-[10px] text-text-lo">
                    Modified {formatDate(note.lastModified)}
                  </p>
                </div>

                {/* Dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === note.id ? null : note.id
                      )
                    }
                    className="p-1.5 rounded-md hover:bg-white/[0.06]"
                  >
                    <MoreVertical className="w-4 h-4 text-text-mid" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen === note.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="glass absolute right-0 top-full mt-1 w-40 z-50 overflow-hidden text-text-hi"
                      >
                        <button
                          onClick={() => {
                            handleTogglePin(note);
                            setDropdownOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/[0.06]"
                        >
                          {note.pinned ? (
                            <PinOff className="w-4 h-4" />
                          ) : (
                            <Pin className="w-4 h-4" />
                          )}
                          {note.pinned ? 'Unpin' : 'Pin'}
                        </button>

                        {note.locked ? (
                          <button
                            onClick={() => {
                              openUnlockModal(note);
                              setDropdownOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/[0.06]"
                          >
                            <Unlock className="w-4 h-4" />
                            Unlock
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              openSetLockModal(note);
                              setDropdownOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/[0.06]"
                          >
                            <Lock className="w-4 h-4" />
                            Lock with PIN
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const newName = window.prompt(
                              'Rename code:',
                              note.name
                            );
                            // leaving a single prompt for rename is acceptable;
                            // if you want this also modal-based, I can convert too.
                            if (newName && newName.trim()) {
                              update(
                                ref(database, `notes/${note.id}`),
                                {
                                  name: newName.trim(),
                                  lastModified: Date.now(),
                                }
                              );
                            }
                            setDropdownOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/[0.06]"
                        >
                          ✏️ Rename
                        </button>

                        <button
                          onClick={() => {
                            openDeleteLockedModal(note);
                            setDropdownOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-soft hover:bg-brand/10"
                        >
                          🗑️ Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {error && (
          <p className="text-center text-xs text-brand-soft py-2">
            {error}
          </p>
        )}
      </div>

      {/* PIN MODAL */}
      <Transition appear show={pinModal.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() =>
            setPinModal({ open: false, action: null, noteId: null })
          }
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
                <Dialog.Title className="text-sm font-semibold text-text-hi mb-1">
                  {pinModal.action === 'setLock' && 'Set PIN (optional)'}
                  {pinModal.action === 'unlock' && 'Unlock code'}
                  {pinModal.action === 'open' && 'Enter PIN to open'}
                  {pinModal.action === 'delete' && 'Enter PIN to delete'}
                </Dialog.Title>
                <p className="text-[11px] text-text-lo mb-2">
                  {pinModal.action === 'setLock'
                    ? 'Leave empty to lock without PIN, or enter a 4-digit PIN.'
                    : 'Enter the 4-digit PIN for this code.'}
                </p>
                <input
                  type="password"
                  value={pinValue}
                  onChange={(e) => {
                    setPinValue(e.target.value);
                    setPinError('');
                  }}
                  maxLength={4}
                  className="w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-text-hi placeholder:text-text-lo focus:border-brand/40 focus:ring-2 focus:ring-brand/30 outline-none"
                  autoFocus
                />
                {pinError && (
                  <p className="text-[10px] text-brand-soft mt-1">
                    {pinError}
                  </p>
                )}
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      setPinModal({
                        open: false,
                        action: null,
                        noteId: null,
                      })
                    }
                    className="px-2 py-1 text-xs rounded bg-white/[0.06] hover:bg-white/[0.10]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePinModalConfirm}
                    className="px-3 py-1 text-xs rounded bg-brand-solid text-white hover:bg-brand-solid-hover"
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* CONFIRM MODAL */}
      <Transition appear show={confirmModal.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() =>
            setConfirmModal({ open: false, message: '', onConfirm: null })
          }
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
                <Dialog.Title className="text-sm font-semibold text-text-hi">
                  Confirm
                </Dialog.Title>
                <p className="text-[11px] text-text-mid mt-1">
                  {confirmModal.message}
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      setConfirmModal({
                        open: false,
                        message: '',
                        onConfirm: null,
                      })
                    }
                    className="px-2 py-1 text-xs rounded bg-white/[0.06] hover:bg-white/[0.10]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      confirmModal.onConfirm?.();
                      setConfirmModal({
                        open: false,
                        message: '',
                        onConfirm: null,
                      });
                    }}
                    className="px-3 py-1 text-xs rounded bg-brand-solid text-white hover:bg-brand-solid-hover"
                  >
                    Yes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* MASTER DELETE MODAL */}
      <Transition appear show={masterModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setMasterModalOpen(false)}
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
                  Delete ALL codes
                </Dialog.Title>
                <p className="text-[11px] text-text-mid mt-1">
                  This will delete <b>all</b> codes including pinned and locked.
                  Enter master password to continue.
                </p>
                <input
                  type="password"
                  value={masterValue}
                  onChange={(e) => {
                    setMasterValue(e.target.value);
                    setMasterError('');
                  }}
                  className="mt-2 w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-text-hi placeholder:text-text-lo focus:border-brand/40 focus:ring-2 focus:ring-brand/30 outline-none"
                  placeholder="Master password"
                />
                {masterError && (
                  <p className="text-[10px] text-brand-soft mt-1">
                    {masterError}
                  </p>
                )}
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setMasterModalOpen(false)}
                    className="px-2 py-1 text-xs rounded bg-white/[0.06] hover:bg-white/[0.10]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmMasterDelete}
                    disabled={masterChecking}
                    className="px-3 py-1 text-xs rounded bg-brand-solid text-white hover:bg-brand-solid-hover disabled:opacity-60"
                  >
                    {masterChecking ? 'Checking...' : 'Delete all'}
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
