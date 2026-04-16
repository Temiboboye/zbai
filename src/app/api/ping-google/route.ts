import { NextResponse } from 'next/server'

// POST /api/ping-google — Ping Google to re-crawl the sitemap
export async function POST(request: Request) {
    const authHeader = request.headers.get('x-indexnow-secret')
    if (authHeader !== process.env.INDEXNOW_SECRET && authHeader !== 'zbai-indexnow-2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sitemapUrl = 'https://zerobounceai.com/sitemap.xml'

    try {
        // Google sitemap ping
        const googleResponse = await fetch(
            `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
        )

        // Bing sitemap ping (legacy, in addition to IndexNow)
        const bingResponse = await fetch(
            `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
        )

        return NextResponse.json({
            success: true,
            sitemapUrl,
            google: { status: googleResponse.status, ok: googleResponse.ok },
            bing: { status: bingResponse.status, ok: bingResponse.ok },
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
        }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({
        usage: 'POST to this endpoint with header x-indexnow-secret to ping Google & Bing to re-crawl the sitemap',
        sitemapUrl: 'https://zerobounceai.com/sitemap.xml',
    })
}
