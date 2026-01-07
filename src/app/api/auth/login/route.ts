import { NextRequest, NextResponse } from 'next/server';

// Mock authentication - replace with real backend call
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Mock validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Mock user database (replace with real database query)
        const mockUsers = [
            {
                id: 1,
                email: 'demo@zerobounce.ai',
                password: 'demo123',
                full_name: 'Demo User',
                credits_balance: 142500
            }
        ];

        const user = mockUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate mock token (in production, use JWT)
        const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

        const response = NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                credits_balance: user.credits_balance
            }
        });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
