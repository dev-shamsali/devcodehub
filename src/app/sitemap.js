import { SITE } from '@/lib/site';

export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/media`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
