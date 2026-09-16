import EditorWorkspace from '@/components/EditorWorkspace';
import { SITE } from '@/lib/site';

const title = 'Realtime collaborative code editor';
const description =
  'Open the DevCodeHub editor and share a code snippet your team can edit live. Create a snippet, send the link, watch edits land as they happen. No account required.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/editor' },
  keywords: [
    'realtime code editor',
    'collaborative code editor online',
    'share code snippet link',
    'pair programming editor',
    'DevCodeHub editor',
  ],
  openGraph: {
    type: 'website',
    url: `${SITE.url}/editor`,
    siteName: SITE.name,
    title: `${title} | ${SITE.name}`,
    description,
  },
};

/**
 * The editor fills the window and nothing follows it. The description and
 * authorship a crawler needs are carried by the metadata and the JSON-LD
 * rather than by visible marketing copy, because this route is a tool.
 */
const editorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE.url}/editor#app`,
  name: `${SITE.name} Editor`,
  url: `${SITE.url}/editor`,
  description,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any browser',
  isPartOf: { '@id': `${SITE.url}/#website` },
  author: { '@id': `${SITE.url}/#author` },
  creator: { '@id': `${SITE.url}/#author` },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Realtime collaborative editing',
    'Shareable snippet links',
    'Anonymous access with no signup',
    'Syntax highlighting via CodeMirror 6',
    'Pin and lock snippets',
    'Snippet download',
  ],
};

export default function EditorRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(editorJsonLd) }}
      />
      <div className="h-[100dvh]">
        <EditorWorkspace />
      </div>
    </>
  );
}
