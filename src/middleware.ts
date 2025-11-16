import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Protège /admin et /sujets
  if (pathname.startsWith('/admin') || pathname.startsWith('/sujets')) {
    const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';

    if (!isLoggedIn) {
      // Redirige vers /login avec le paramètre 'from' pour afficher un message
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default middleware

export const config = {
  matcher: ['/admin/:path*', '/sujets/:path*'],
};