import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdminEmail } from '@/lib/auth/admin';
import AdminPanel from '@/components/AdminPanel';

export const metadata = { title: 'Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

/**
 * Admin panel. The proxy redirects early; this check is the authoritative one
 * and also re-reads ADMIN_EMAILS, so a revoked admin is turned away at once.
 */
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?next=/admin');
  if (session.user.role !== 'admin' || !isAdminEmail(session.user.email)) redirect('/editor');

  const user = {
    id: session.user.id,
    name: session.user.name || session.user.email,
    email: session.user.email,
    role: 'admin',
  };

  return (
    <div className="h-[100dvh]">
      <AdminPanel user={user} />
    </div>
  );
}
