import MediaWorkspace from '@/components/MediaWorkspace';
import MediaPitch from '@/components/landing/MediaPitch';
import SiteFooter from '@/components/landing/SiteFooter';
import { SITE, AUTHOR } from '@/lib/site';

const title = 'Share images and zip files with your team';
const description =
  'DevCodeHub Media is a free realtime drop for images and zip archives. Create a share, add as many files as you like, send the link. No account required.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/media' },
  keywords: [
    'share images with team',
    'share zip file online',
    'image sharing for developers',
    'upload screenshots share link',
    'DevCodeHub Media',
  ],
  openGraph: {
    type: 'website',
    url: `${SITE.url}/media`,
    siteName: SITE.name,
    title: `${title} | ${SITE.name}`,
    description,
  },
};

/**
 * Same shape as "/": the tool occupies the first viewport, and the text the
 * page ranks on sits underneath it on the same URL.
 */
const mediaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE.url}/media#page`,
      url: `${SITE.url}/media`,
      name: `${SITE.name} Media`,
      description,
      isPartOf: { '@id': `${SITE.url}/#website` },
      author: { '@id': `${SITE.url}/#author` },
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE.url}/media#app`,
      name: `${SITE.name} Media`,
      url: `${SITE.url}/media`,
      description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any browser',
      author: { '@id': `${SITE.url}/#author` },
      creator: { '@id': `${SITE.url}/#author` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'Upload many images at once',
        'Share zip archives',
        'Direct CDN links per file',
        'Realtime updates across viewers',
        'No account required',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE.url}/media#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I share images with my team on DevCodeHub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Open DevCodeHub Media, name a share, then drag your images into the panel or use Add files. Each file gets a direct link, and anyone with the share open sees new files appear immediately.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I share a zip file on DevCodeHub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Zip archives upload alongside images and appear in the same share with a direct download link. Individual files are limited to 25 MB.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who built DevCodeHub Media?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `DevCodeHub and its media sharing route were designed and built by ${AUTHOR.name}, a full stack developer working in Next.js, React and Firebase. Files are delivered through ImageKit. You can find his work at ${AUTHOR.github}.`,
          },
        },
      ],
    },
  ],
};

export default function MediaRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaJsonLd) }}
      />
      <div id="media" className="h-[100dvh]">
        <MediaWorkspace />
      </div>
      <main>
        <MediaPitch />
      </main>
      <SiteFooter />
    </>
  );
}
