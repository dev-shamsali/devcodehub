import Link from 'next/link';
import { SITE, AUTHOR } from '@/lib/site';
import Wordmark from './Wordmark';
import BrandIcon from './BrandIcon';

export default function SiteFooter() {
  return (
    <footer className="edge-top">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark className="text-[1.05rem]" />
          <p className="mt-3 max-w-[38ch] text-[0.84rem] leading-relaxed text-text-lo">
            {SITE.tagline}. Built and maintained by{' '}
            <a
              href={AUTHOR.github}
              rel="author me noopener noreferrer"
              target="_blank"
              className="text-text-mid underline decoration-white/20 underline-offset-4 transition-colors hover:text-brand-soft"
            >
              {AUTHOR.name}
            </a>
            .
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/editor"
            className="text-[0.86rem] text-text-mid transition-colors hover:text-text-hi"
          >
            Editor
          </Link>
          <Link
            href="/media"
            className="text-[0.86rem] text-text-mid transition-colors hover:text-text-hi"
          >
            Media
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={AUTHOR.github}
              rel="me noopener noreferrer"
              target="_blank"
              aria-label={`${AUTHOR.name} on GitHub`}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-text-mid transition-colors hover:text-text-hi"
            >
              <BrandIcon slug="github" label="" />
            </a>
            <a
              href={AUTHOR.linkedin}
              rel="me noopener noreferrer"
              target="_blank"
              aria-label={`${AUTHOR.name} on LinkedIn`}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-text-mid transition-colors hover:text-text-hi"
            >
              <BrandIcon slug="linkedin" label="" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
