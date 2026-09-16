'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { database } from '../lib/firebase';
import { ref, update, onValue, off } from 'firebase/database';

import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

import { Copy, Check, Loader2, Wifi, WifiOff } from 'lucide-react';
import { AUTHOR } from '@/lib/site';

export default function CodeEditor({ noteId }) {
  const editorContainerRef = useRef(null);
  const viewRef = useRef(null);

  // Kept in a ref, not state: this flag guards the write-back inside the
  // CodeMirror update listener. As state it both went stale in the listener
  // closure and, being an effect dependency, tore the editor down and rebuilt
  // it on every remote edit.
  const isRemoteUpdate = useRef(false);

  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [charCount, setCharCount] = useState(0);

  const handleCopy = useCallback(async () => {
    try {
      const code = viewRef.current?.state.doc.toString() || '';
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, []);

  const updateStats = useCallback((doc) => {
    setLineCount(doc.lines);
    setCharCount(doc.toString().length);
  }, []);

  useEffect(() => {
    if (!editorContainerRef.current || !noteId) return;

    const noteRef = ref(database, `notes/${noteId}`);

    const state = EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(),
        history(),
        javascript(),
        oneDark,
        EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((updateEvent) => {
          if (!updateEvent.docChanged) return;
          updateStats(updateEvent.state.doc);
          if (isRemoteUpdate.current) return;

          setIsSaving(true);
          update(noteRef, { content: updateEvent.state.doc.toString() }).finally(
            () => setTimeout(() => setIsSaving(false), 300)
          );
        }),
      ],
    });

    const view = new EditorView({ state, parent: editorContainerRef.current });
    viewRef.current = view;

    const unsubscribe = onValue(
      noteRef,
      (snapshot) => {
        setIsConnected(true);
        const content = snapshot.val()?.content || '';
        if (view.state.doc.toString() === content) return;

        isRemoteUpdate.current = true;
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: content },
        });
        updateStats(view.state.doc);
        isRemoteUpdate.current = false;
      },
      (error) => {
        setIsConnected(false);
        console.error('Firebase connection error:', error);
      }
    );

    return () => {
      unsubscribe();
      off(noteRef);
      view.destroy();
      viewRef.current = null;
    };
  }, [noteId, updateStats]);

  return (
    <div className="glass flex h-full min-h-[26rem] flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <span className="flex items-center gap-2 text-[0.78rem]">
          {isConnected ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.75} />
              <span className="text-text-mid">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
              <span className="text-brand-soft">Reconnecting</span>
            </>
          )}
        </span>

        <div className="flex items-center gap-4">
          <span
            className={`flex items-center gap-1.5 text-[0.74rem] text-text-lo transition-opacity ${
              isSaving ? 'opacity-100' : 'opacity-0'
            }`}
            aria-live="polite"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
            Saving
          </span>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[0.78rem] text-text-hi transition-colors hover:border-white/20 hover:bg-white/10 active:translate-y-px"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                Copy
              </>
            )}
          </button>
        </div>
      </header>

      <div ref={editorContainerRef} className="min-h-0 flex-1 overflow-auto" />

      <footer className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/8 px-4 py-2.5 font-mono text-[0.72rem] text-text-lo">
        <span className="flex gap-4">
          <span>
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
          <span>{charCount} chars</span>
        </span>
        <span>
          Built by{' '}
          <a
            href={AUTHOR.github}
            rel="author me noopener noreferrer"
            target="_blank"
            className="text-text-mid transition-colors hover:text-brand-soft"
          >
            {AUTHOR.name}
          </a>
        </span>
      </footer>
    </div>
  );
}
