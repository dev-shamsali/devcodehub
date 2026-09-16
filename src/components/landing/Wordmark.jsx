/**
 * Wordmark. Type only, no drawn logo. The slash is the mark.
 */
export default function Wordmark({ className = '' }) {
  return (
    <span
      className={`font-display font-semibold tracking-tight text-text-hi ${className}`}
    >
      dev<span className="text-brand">/</span>codehub
    </span>
  );
}
