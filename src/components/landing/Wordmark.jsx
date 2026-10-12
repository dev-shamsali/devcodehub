/* eslint-disable @next/next/no-img-element */

/**
 * Wordmark. The DC emblem on a white tile (its black half would vanish on the
 * dark ground) followed by the name set in type.
 */
export default function Wordmark({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display font-semibold tracking-tight text-text-hi ${className}`}
    >
      <img
        src="/logo-mark.png"
        alt=""
        width={28}
        height={28}
        className="h-[1.7em] w-[1.7em] rounded-[0.4em]"
      />
      <span>
        Dev<span className="text-[#2f80ff]">Code</span>Hub
      </span>
    </span>
  );
}
