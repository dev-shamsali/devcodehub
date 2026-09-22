import EditorWorkspace from '@/components/EditorWorkspace';
import { SITE } from '@/lib/site';

const title = 'Realtime collaborative code editor';
const description =
  'Open the DevCodeHub editor and share a code snippet your team can edit live. Create a snippet, send the link, watch edits land as they happen. No account required.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  keywords: [
    'realtime code editor',
    'collaborative code editor online',
    'share code snippet link',
    'pair programming editor',
    'DevCodeHub editor',
  ],
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title: `${title} | ${SITE.name}`,
    description,
  },
};

/**
 * The editor fills the window and nothing follows it. The description and
 * authorship a crawler needs are carried by the metadata and the root
 * layout's JSON-LD graph rather than by visible marketing copy, because this
 * route is a tool, not the marketing page (that's /info).
 */
export default function Home() {
  return (
    <div className="h-[100dvh]">
      <EditorWorkspace />
    </div>
  );
}
