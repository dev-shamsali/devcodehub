/**
 * What the product is actually built on. Real logos from Simple Icons.
 *
 * This is deliberately not a "trusted by" wall: inventing customer logos for a
 * real person's real product would be fabricated social proof.
 */
const STACK = [
  { slug: 'nextdotjs', name: 'Next.js' },
  { slug: 'react', name: 'React' },
  { slug: 'firebase', name: 'Firebase' },
  { slug: 'tailwindcss', name: 'Tailwind CSS' },
  { slug: 'vercel', name: 'Vercel' },
];

export default function StackStrip() {
  return (
    <section className="edge-top" aria-label="Technology stack">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-7 px-5 py-12 sm:px-8 md:flex-row md:justify-between md:gap-10">
        <p className="max-w-[22ch] text-center text-[0.82rem] leading-relaxed text-text-lo md:text-left">
          Built on the stack your team already runs.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-6 md:gap-x-11">
          {STACK.map((tech) => (
            <li key={tech.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/a9a6b1`}
                alt={tech.name}
                width={26}
                height={26}
                loading="lazy"
                className="h-[26px] w-[26px] opacity-70 transition-opacity duration-300 hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
