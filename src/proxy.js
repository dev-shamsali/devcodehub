import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

/**
 * Optimistic gate: reads only the session cookie, never the database. The
 * real checks live in the pages and route handlers (see requireUser).
 */
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const protectedPath =
    pathname.startsWith('/media') || pathname.startsWith('/editor') || pathname.startsWith('/admin');
  if (protectedPath && !req.auth) {
    const url = new URL('/login', req.nextUrl.origin);
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }
  const home = req.auth?.user?.role === 'admin' ? '/admin' : '/editor';
  // Only admins may open /admin; everyone else goes to the editor.
  if (pathname.startsWith('/admin') && req.auth && req.auth.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/editor', req.nextUrl.origin));
  }
  // Logged-in users have no business on the landing or auth pages.
  if (req.auth && ['/', '/login', '/signup', '/forgot-password'].includes(pathname)) {
    return NextResponse.redirect(new URL(home, req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/', '/media/:path*', '/editor/:path*', '/admin/:path*', '/login', '/signup', '/forgot-password'],
};
