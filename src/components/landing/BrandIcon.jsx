/**
 * Brand marks (GitHub, LinkedIn, stack logos).
 *
 * lucide-react v1 removed every brand glyph, so these come from Simple Icons
 * rather than being hand-drawn. Colour is baked into the CDN path because the
 * service returns a flat single-colour SVG.
 */
export default function BrandIcon({
  slug,
  label,
  size = 16,
  color = 'a9a6b1',
  className = '',
}) {
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
