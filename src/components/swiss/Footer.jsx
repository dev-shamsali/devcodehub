import Link from 'next/link';
import { SITE, AUTHOR } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="swiss-cols relative border-t border-(--line) pb-20 pt-10 md:pb-16">
      <div className="grid grid-cols-4 gap-y-8 text-[0.85rem] md:grid-cols-8">
        <p className="col-span-4 col-start-1 max-w-[40ch] px-4 leading-relaxed text-(--mute) md:col-span-3 md:col-start-2 md:px-0 md:pl-3">
          {SITE.tagline}. Built and maintained by{' '}
          <a href={AUTHOR.github} rel="author me noopener noreferrer" target="_blank" className="swiss-link text-(--ink)">
            {AUTHOR.name}
          </a>
          .
        </p>
        <ul className="col-span-2 col-start-1 space-y-2 px-4 md:col-span-1 md:col-start-5 md:px-0 md:pl-3">
          <li><Link href="/editor" className="swiss-link">Editor</Link></li>
          <li><Link href="/media" className="swiss-link">Media</Link></li>
        </ul>
        <ul className="col-span-2 space-y-2 px-4 md:col-span-1 md:col-start-6 md:px-0 md:pl-3">
          <li><Link href="/privacy" className="swiss-link">Privacy</Link></li>
          <li><Link href="/terms" className="swiss-link">Terms</Link></li>
        </ul>
        <ul className="col-span-4 col-start-1 flex flex-wrap gap-x-6 gap-y-2 px-4 md:col-span-2 md:col-start-7 md:block md:space-y-2 md:px-0 md:pl-3">
          <li><a href={AUTHOR.github} rel="me noopener noreferrer" target="_blank" className="swiss-link">GitHub</a></li>
          <li><a href={AUTHOR.linkedin} rel="me noopener noreferrer" target="_blank" className="swiss-link">LinkedIn</a></li>
          <li><a href={AUTHOR.instagram} rel="me noopener noreferrer" target="_blank" className="swiss-link">Instagram</a></li>
        </ul>
      </div>
    </footer>
  );
}
