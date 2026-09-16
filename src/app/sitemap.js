import { SITE } from '@/lib/site';

export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/editor`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/media`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
