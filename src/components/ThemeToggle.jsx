'use client';

import { useEffect, useState } from 'react';

const KEY = 'dch-theme';

/**
 * "invert color": flips <html data-theme> between light and dark and
 * remembers the choice per browser. Storage can be blocked, so every access
 * is guarded. Portals follow because the attribute is on the root element.
 */
export default function ThemeToggle({ className = '', style }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Mirror what the head script already applied before paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const invert = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <button onClick={invert} className={className} style={style}>
      invert color
    </button>
  );
}
