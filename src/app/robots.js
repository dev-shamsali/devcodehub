import { SITE } from '@/lib/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Only the API is withheld. /editor is crawlable on purpose: it is the
        // page brand searchers want, so it has to be eligible to rank.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
