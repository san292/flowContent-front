import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const  middleware=(request: NextRequest)=> {
  const { pathname } = request.nextUrl;

  // Protège /admin et /sujets
  if (pathname.startsWith('/admin') || pathname.startsWith('/sujets')) {
    const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export default middleware

export const config = {
  matcher: ['/admin/:path*', '/sujets/:path*'],
};