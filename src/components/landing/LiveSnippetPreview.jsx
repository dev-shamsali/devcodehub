'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useReducedMotion } from 'motion/react';

/**
 * A real CodeMirror 6 instance, read only, running the same extensions the
 * editor route uses. This is a genuine preview of the product rather than a
 * mock-up built from styled divs.
 *
 * The typing pass exists to show the one thing a still image cannot: that a
 * second person's edits arrive in your buffer while you are looking at it.
 * It is disabled entirely under prefers-reduced-motion, which renders the
 * finished snippet immediately.
 */

const SNIPPET = `// shared by mehreen, 2 minutes ago
export function retry(fn, attempts = 3) {
  return async (...args) => {
    let lastError;

    for (let i = 0; i < attempts; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        await wait(2 ** i * 100);
      }
    }

    throw lastError;
  };
}`;

const TYPED_TAIL = `

// jitter stops every client retrying
// on the same tick. nice catch
const wait = (ms) =>
  new Promise((r) => setTimeout(r, ms * (0.5 + Math.random())));`;

export default function LiveSnippetPreview() {
  const host = useRef(null);
  const viewRef = useRef(null);
  const reduce = useReducedMotion();
  const [collaborating, setCollaborating] = useState(false);

  useEffect(() => {
    if (!host.current) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: reduce ? SNIPPET + TYPED_TAIL : SNIPPET,
        extensions: [
          lineNumbers(),
          javascript(),
          oneDark,
          EditorView.editable.of(false),
          EditorView.lineWrapping,
        ],
      }),
      parent: host.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;

    let index = 0;
    let typeTimer;
    let restartTimer;

    const step = () => {
      const view = viewRef.current;
      if (!view) return;

      if (index >= TYPED_TAIL.length) {
        setCollaborating(false);
        restartTimer = setTimeout(() => {
          const v = viewRef.current;
          if (!v) return;
          v.dispatch({
            changes: { from: 0, to: v.state.doc.length, insert: SNIPPET },
          });
          index = 0;
          setCollaborating(true);
          typeTimer = setTimeout(step, 900);
        }, 4200);
        return;
      }

      // Type in small bursts so it reads like a person, not a ticker.
      const burst = TYPED_TAIL.slice(index, index + (1 + Math.floor(Math.random() * 3)));
      view.dispatch({
        changes: { from: view.state.doc.length, insert: burst },
        scrollIntoView: true,
      });
      index += burst.length;
      typeTimer = setTimeout(step, 26 + Math.random() * 46);
    };

    const kickoff = setTimeout(() => {
      setCollaborating(true);
      step();
    }, 1400);

    return () => {
      clearTimeout(kickoff);
      clearTimeout(typeTimer);
      clearTimeout(restartTimer);
    };
  }, [reduce]);

  return (
    <div className="glass glass-lit overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <span className="truncate font-mono text-[0.78rem] text-text-mid">
          retry-with-backoff.js
        </span>

        <span
          className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1.5 pr-2.5"
          aria-live="polite"
        >
          <span className="flex -space-x-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-deep text-[0.6rem] font-semibold text-white ring-2 ring-ink-800">
              M
            </span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-ink-500 text-[0.6rem] font-semibold text-text-hi ring-2 ring-ink-800">
              T
            </span>
          </span>
          <span className="text-[0.7rem] text-text-mid">
            {collaborating ? 'Mehreen is typing' : '2 editing'}
          </span>
        </span>
      </div>

      <div
        ref={host}
        aria-hidden="true"
        className="h-[22rem] overflow-hidden text-[0.82rem] sm:h-[25rem]"
      />
    </div>
  );
}
