import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false } };

/**
 * Where every sign-in lands. The role decides the page: admins go to the
 * admin panel, everyone else to the editor. A page (not a route handler) so
 * the redirect also works when it follows a client-side navigation.
 */
export default async function AfterLogin() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  redirect(session.user.role === 'admin' ? '/admin' : '/editor');
}
