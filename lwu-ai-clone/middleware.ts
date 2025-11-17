export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tools/:path*',
    '/api/generate/:path*',
    '/api/user/:path*',
  ],
};
