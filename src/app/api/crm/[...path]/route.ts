import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const subpath = path.join('/');
    const url = new URL(req.url);
    const queryString = url.search;

    const token = req.headers.get('authorization');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${BACKEND_URL}/v1/crm/${subpath}${queryString}`, { headers });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const subpath = path.join('/');
    const body = await req.json();

    const token = req.headers.get('authorization');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${BACKEND_URL}/v1/crm/${subpath}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const subpath = path.join('/');
    const body = await req.json();

    const token = req.headers.get('authorization');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${BACKEND_URL}/v1/crm/${subpath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const subpath = path.join('/');

    const token = req.headers.get('authorization');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${BACKEND_URL}/v1/crm/${subpath}`, {
        method: 'DELETE',
        headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
