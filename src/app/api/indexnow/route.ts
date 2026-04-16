import { NextResponse } from 'next/server'
import { getAllCompetitorSlugs } from '@/app/data/competitors'
import { getAllProviderSlugs } from '@/app/data/providers'
import { getAllIndustrySlugs } from '@/app/data/industries'
import { getAllCompanySlugs } from '@/app/data/companies'
import { getAllIntegrationSlugs } from '@/app/data/integrations'

const INDEXNOW_KEY = '03bc7da65c6549d6b1b6494192ce803b'
const SITE_URL = 'https://zerobounceai.com'

function getAllUrls(): string[] {
    const urls: string[] = []

    // Core pages
    const corePages = [
        '', '/signup', '/login', '/free-tools', '/comparison', '/billing',
        '/verify', '/bulk', '/email-checker', '/email-verifier',
        '/free-email-verification', '/about', '/blog', '/privacy', '/terms',
        '/gdpr', '/security',
    ]
    corePages.forEach(p => urls.push(`${SITE_URL}${p}`))

    // Programmatic pages
    getAllCompetitorSlugs().forEach(s => {
        urls.push(`${SITE_URL}/compare/${s}`)
        urls.push(`${SITE_URL}/alternative-to/${s}`)
    })
    getAllProviderSlugs().forEach(s => urls.push(`${SITE_URL}/verify/${s}`))
    getAllIndustrySlugs().forEach(s => urls.push(`${SITE_URL}/email-verification-for/${s}`))
    getAllCompanySlugs().forEach(s => urls.push(`${SITE_URL}/email-format/${s}`))
    getAllIntegrationSlugs().forEach(s => urls.push(`${SITE_URL}/integrations/${s}`))

    // Blog posts
    const blogPosts = [
        'email-verification-guide', 'zerobounce-ai-vs-competitors',
        'catch-all-email-verification', 'email-verification-b2b-sales',
        'reduce-email-bounce-rate', 'email-deliverability-guide',
        'how-to-clean-email-list', 'how-to-avoid-spam-traps',
    ]
    blogPosts.forEach(p => urls.push(`${SITE_URL}/blog/${p}`))

    // Free tools
    const tools = [
        'email-syntax-checker', 'mx-record-lookup', 'disposable-email-detector',
        'email-pattern-generator', 'domain-age-checker',
    ]
    tools.forEach(t => urls.push(`${SITE_URL}/free-tools/${t}`))

    return urls
}

// POST /api/indexnow — Submit all URLs to IndexNow
export async function POST(request: Request) {
    // Simple auth check — require a secret header
    const authHeader = request.headers.get('x-indexnow-secret')
    if (authHeader !== process.env.INDEXNOW_SECRET && authHeader !== 'zbai-indexnow-2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allUrls = getAllUrls()

    // IndexNow accepts max 10,000 URLs per request
    const batches: string[][] = []
    for (let i = 0; i < allUrls.length; i += 10000) {
        batches.push(allUrls.slice(i, i + 10000))
    }

    const results = []

    for (const batch of batches) {
        const payload = {
            host: 'zerobounceai.com',
            key: INDEXNOW_KEY,
            keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
            urlList: batch,
        }

        try {
            const response = await fetch('https://www.bing.com/IndexNow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(payload),
            })

            results.push({
                urls: batch.length,
                status: response.status,
                statusText: response.statusText,
            })
        } catch (error) {
            results.push({
                urls: batch.length,
                status: 'error',
                error: String(error),
            })
        }
    }

    return NextResponse.json({
        success: true,
        totalUrls: allUrls.length,
        batches: results,
        key: INDEXNOW_KEY,
        timestamp: new Date().toISOString(),
    })
}

// GET /api/indexnow — Show stats about indexable URLs
export async function GET() {
    const allUrls = getAllUrls()

    return NextResponse.json({
        totalUrls: allUrls.length,
        key: INDEXNOW_KEY,
        keyFileUrl: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        sitemapUrl: `${SITE_URL}/sitemap.xml`,
        categories: {
            core: 17,
            competitors: getAllCompetitorSlugs().length,
            alternatives: getAllCompetitorSlugs().length,
            providers: getAllProviderSlugs().length,
            industries: getAllIndustrySlugs().length,
            companies: getAllCompanySlugs().length,
            integrations: getAllIntegrationSlugs().length,
            blogs: 8,
            tools: 5,
        },
        usage: 'POST to this endpoint with header x-indexnow-secret to submit all URLs to IndexNow',
    })
}
