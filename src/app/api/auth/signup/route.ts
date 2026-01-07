import { NextRequest, NextResponse } from 'next/server';

// Mock signup - replace with real backend call
export async function POST(req: NextRequest) {
    try {
        const { full_name, email, password } = await req.json();

        // Validation
        if (!full_name || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Mock - check if email exists
        if (email === 'demo@zerobounce.ai') {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Create mock user with 100 free credits
        const newUser = {
            id: Math.floor(Math.random() * 10000),
            email,
            full_name,
            credits_balance: 100 // Free trial credits
        };

        // Generate mock token
        const token = Buffer.from(`${newUser.id}:${newUser.email}:${Date.now()}`).toString('base64');

        const response = NextResponse.json({
            token,
            user: newUser,
            message: 'Account created successfully! You received 100 free credits.'
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
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
