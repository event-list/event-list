import { NextRequest, NextResponse } from 'next/server';

function isLoggedIn(request) {
  const token = request.cookies.get('jwt');;

  return Boolean(token);
}

export default async function middleware(request: NextRequest) {
  const nextPage = NextResponse.next();

  if (!isLoggedIn(request) && request.nextUrl.pathname === '/') {
    const loginURL = new URL('/sign-in', request.url);

    return NextResponse.redirect(loginURL);
  }

  return nextPage;
}

export const config = {
  matcher: ['/'],
};