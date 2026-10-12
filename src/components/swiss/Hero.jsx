import Link from 'next/link';
import Wordmark from './Wordmark';

/**
 * Wordmark, then a bare statement on the grid. The h1 is the plain-language
 * value proposition; the wordmark above it is decoration.
 */
export default function Hero() {
  return (
    <section className="relative">
      <Wordmark />
    </section>
  );
}

export function HeroBody() {
  return (
    <div className="swiss-cols relative grid min-h-[calc(100dvh-30vw)] grid-cols-4 content-start gap-y-10 overflow-hidden pb-16 pt-16 md:min-h-[calc(100dvh-20vw)] md:grid-cols-8 md:gap-y-0 md:pt-24">
      {/* One diagonal hairline, corner to corner. Decorative. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-(--line)"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      <p className="relative col-span-3 col-start-1 pl-4 text-[0.82rem] leading-snug text-(--mute) md:col-span-2 md:col-start-2 md:pl-3">
        A realtime code editor and a shared file drop for your team. Sign in once to use both.
      </p>

      <div className="relative col-span-4 col-start-1 px-4 md:col-span-4 md:col-start-5 md:px-0 md:pl-3">
        <h1 className="text-[clamp(2rem,4.2vw,4rem)] font-normal leading-[1.06] tracking-[-0.03em]">
          Edit code live.
          <br />
          Share files in <span className="text-(--accent)">one link</span>.
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/signup"
            className="bg-(--ink) px-6 py-3.5 text-[0.9rem] font-medium text-(--paper) transition-colors hover:bg-(--accent) hover:text-white"
          >
            Get started
          </Link>
          <Link href="#workflow" className="swiss-link text-[0.9rem]">
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}
