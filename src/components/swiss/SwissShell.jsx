'use client';

import { useEffect, useState } from 'react';

const KEY = 'dch-theme';

/**
 * Page wrapper for the landing and policy pages. Owns the light/dark switch
 * ("invert color"). The choice is remembered per browser; storage can be
 * blocked, so every access is guarded and the page renders light without it.
 */
export default function SwissShell({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      // Applying a stored preference after mount is the one place state is set from an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === 'dark' || saved === 'light') setTheme(saved);
    } catch {
      /* storage blocked: stay light */
    }
  }, []);

  const invert = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="swiss" data-theme={theme}>
      {children}
      <button
        onClick={invert}
        className="swiss-link fixed bottom-4 left-4 z-40 px-1 text-[0.78rem] text-white mix-blend-difference hover:!text-white"
      >
        invert color
      </button>
    </div>
  );
}
