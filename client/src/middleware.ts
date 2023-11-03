import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(function middleware(request: NextRequestWithAuth) {
  const token = request.nextauth.token;
  if (token) {
    const data: any = token.data;
    if (data.role) {
      if (
        request.nextUrl.pathname.startsWith('/dashboard') &&
        data.role != 'PROCTOR'
      ) {
        return NextResponse.rewrite(new URL('/', request.url));
      } else if (
        request.nextUrl.pathname.startsWith('/student') &&
        data.role != 'STUDENT'
      ) {
        return NextResponse.rewrite(new URL('/', request.url));
      }
    }
  }
});

export const config = { matcher: ['/dashboard/:path*', '/student/:path*'] };
