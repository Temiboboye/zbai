import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/settings/',
                    '/_next/',
                    '/private/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/dashboard/settings/'],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/_next/'],
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/_next/'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/_next/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/_next/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
