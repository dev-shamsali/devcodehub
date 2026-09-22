/**
 * Brand marks (GitHub, LinkedIn, stack logos).
 *
 * lucide-react v1 removed every brand glyph, so these come from Simple Icons
 * rather than being hand-drawn. Colour is baked into the CDN path because the
 * service returns a flat single-colour SVG.
 *
 * cdn.simpleicons.org 404s specifically for "linkedin" (every colour, every
 * casing) while still serving every other slug here, including on the
 * official jsdelivr mirror of the same package, so it reads as that proxy
 * having pulled the mark rather than a typo on our side. Those slugs render
 * from the exact path Simple Icons ships instead of hitting the CDN.
 */
const INLINE_PATHS = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

export default function BrandIcon({
  slug,
  label,
  size = 16,
  color = 'a9a6b1',
  className = '',
}) {
  const inlinePath = INLINE_PATHS[slug];

  if (inlinePath) {
    return (
      <svg
        role="img"
        aria-label={label || undefined}
        aria-hidden={label ? undefined : 'true'}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={`#${color}`}
        className={className}
        style={{ width: size, height: size }}
      >
        <path d={inlinePath} />
      </svg>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt={label}
      width={size}
      height={size}
      loading="lazy"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
