import Image from 'next/image';
import { AUTHOR } from '@/lib/site';

const LINKS = [
  { label: 'GitHub', href: AUTHOR.github },
  { label: 'LinkedIn', href: AUTHOR.linkedin },
  { label: 'Instagram', href: AUTHOR.instagram },
  { label: 'Portfolio', href: AUTHOR.portfolio },
];

/**
 * Author block. Plain server markup with rel="author", so the name, role and
 * profile links are in the initial HTML for crawlers and answer engines.
 */
export default function Developer() {
  return (
    <section id="developer" className="swiss-flip swiss-cols relative scroll-mt-14 py-24 md:py-36">
      <div className="grid grid-cols-4 gap-y-12 md:grid-cols-8">
        <div className="col-span-3 col-start-1 px-4 md:col-span-2 md:col-start-2 md:px-0 md:pl-3">
          <Image
            src="/shamsali.jpeg"
            alt={`${AUTHOR.name}, developer of DevCodeHub`}
            width={1024}
            height={1024}
            sizes="(max-width: 768px) 75vw, 22vw"
            className="aspect-[4/5] w-full object-cover grayscale"
          />
        </div>

        <div className="col-span-4 col-start-1 px-4 md:col-span-4 md:col-start-5 md:px-0 md:pl-3">
          <h2 className="text-[clamp(2.4rem,5.4vw,5rem)] font-medium leading-[1] tracking-[-0.045em]">
            {AUTHOR.name}
          </h2>
          <p className="mt-3 text-[0.95rem] text-(--mute)">{AUTHOR.role}</p>
          <p className="mt-8 max-w-[52ch] text-[1.05rem] leading-relaxed">{AUTHOR.bio}</p>
          <p className="mt-4 max-w-[52ch] text-[0.92rem] leading-relaxed text-(--mute)">
            DevCodeHub is his own project, designed, built and maintained solo on Next.js, React and MongoDB.
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[0.95rem]">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  rel={l.label === 'GitHub' ? 'author me noopener noreferrer' : 'me noopener noreferrer'}
                  target="_blank"
                  className="swiss-link"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
