import { SITE } from '@/lib/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The landing page is crawlable; the API and signed-in/auth pages are not.
        disallow: ['/api/', '/media', '/editor', '/login', '/signup', '/forgot-password', '/reset-password'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
