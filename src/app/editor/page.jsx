import { redirect } from 'next/navigation';
import EditorWorkspace from '@/components/EditorWorkspace';
import { auth } from '@/auth';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Code editor',
  description: `Share a code snippet your team can edit live on ${SITE.name}.`,
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

/**
 * The realtime editor. Login-gated: the proxy redirects early, and this check
 * is the authoritative one. The signed-in name is passed down so each snippet
 * records who created it and who edited it last.
 */
export default async function EditorPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?next=/editor');

  const user = {
    id: session.user.id,
    name: session.user.name || session.user.email || 'Unknown',
    role: session.user.role,
  };

  return (
    <div className="h-[100dvh]">
      <EditorWorkspace user={user} />
    </div>
  );
}
