import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Check if the request is for a protected route
    const protectedPaths = ['/dashboard', '/verify', '/bulk', '/sort', '/api-keys', '/blacklist', '/billing', '/email-finder'];
    const path = request.nextUrl.pathname;

    // Check if current path is protected
    const isProtected = protectedPaths.some(protectedPath =>
        path.startsWith(protectedPath)
    );

    if (isProtected) {
        // Check for auth token in cookies (legacy or NextAuth)
        const token = request.cookies.get('token');
        const nextAuthToken = request.cookies.get('next-auth.session-token');
        const secureNextAuthToken = request.cookies.get('__Secure-next-auth.session-token');

        // If no token found, redirect to login
        if (!token && !nextAuthToken && !secureNextAuthToken) {
            const loginUrl = new URL('/login', request.url);
            // Add redirect parameter to return user after login
            loginUrl.searchParams.set('redirect', path);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/verify/:path*',
        '/bulk/:path*',
        '/sort/:path*',
        '/api-keys/:path*',
        '/blacklist/:path*',
        '/billing/:path*',
        '/email-finder/:path*',
    ],
};
