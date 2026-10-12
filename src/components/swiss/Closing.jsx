import Link from 'next/link';

export default function Closing() {
  return (
    <section className="swiss-cols relative py-24 md:py-40">
      <div className="grid grid-cols-4 md:grid-cols-8">
        <h2 className="col-span-4 col-start-1 px-4 text-[clamp(2.6rem,7.4vw,7rem)] font-medium leading-[0.98] tracking-[-0.05em] md:col-span-7 md:col-start-2 md:px-0 md:pl-3">
          Send the next file as a link.
        </h2>
        <p className="col-span-4 col-start-1 mt-8 max-w-[44ch] px-4 text-[1rem] leading-relaxed text-(--mute) md:col-span-3 md:col-start-2 md:px-0 md:pl-3">
          Create an account, name a share and drop your files in. The link is ready as soon as you are.
        </p>
        <div className="col-span-4 col-start-1 mt-10 px-4 md:col-span-3 md:col-start-5 md:mt-8 md:px-0 md:pl-3">
          <Link
            href="/signup"
            className="inline-block bg-(--ink) px-8 py-4 text-[1rem] font-medium text-(--paper) transition-colors hover:bg-(--accent) hover:text-white"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}
