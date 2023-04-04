import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function isLoggedIn(request) {
  const token = request.cookies.get('userToken');

  return Boolean(token);
}

export default async function middleware(request: NextRequest) {
  const nextPage = NextResponse.next();

  if (!isLoggedIn(request)) {
    const loginURL = new URL('/sign-in', request.url);

    return NextResponse.redirect(loginURL);
  }

  return nextPage;
}

export const config = {
  matcher: ['/((?!_next|sign-in|sign-up|favicon.ico|login-register-banner.jpg).*)'],
};
