import ThemeToggle from '@/components/ThemeToggle';

/**
 * Page wrapper for the landing, policy and auth pages. The theme lives on
 * <html data-theme>; the toggle sits fixed at the bottom left.
 */
export default function SwissShell({ children, className = '' }) {
  return (
    <div className={`swiss ${className}`}>
      {children}
      <ThemeToggle className="swiss-link fixed bottom-4 left-4 z-40 px-1 text-[0.78rem] text-[#fff] mix-blend-difference hover:!text-[#fff]" />
    </div>
  );
}
