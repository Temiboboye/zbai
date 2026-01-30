import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Check if the request is for a protected route
    const protectedPaths = ['/dashboard', '/verify', '/bulk', '/sort', '/api-keys', '/blacklist', '/billing'];
    const path = request.nextUrl.pathname;

    // Check if current path is protected
    const isProtected = protectedPaths.some(protectedPath =>
        path.startsWith(protectedPath)
    );

    if (isProtected) {
        // Check for auth token in cookies
        const token = request.cookies.get('token');

        // If no token, redirect to login
        if (!token) {
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
    ],
};
