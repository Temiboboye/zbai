import { MetadataRoute } from 'next'
import { getAllCompetitorSlugs } from './data/competitors'
import { getAllProviderSlugs } from './data/providers'
import { getAllIndustrySlugs } from './data/industries'
import { getAllCompanySlugs } from './data/companies'
import { getAllIntegrationSlugs } from './data/integrations'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zerobounceai.com'

    const corePages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/free-tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/comparison`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/billing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/verify`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/bulk`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/email-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/email-verifier`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/free-email-verification`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/gdpr`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/security`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ]

    const competitorPages: MetadataRoute.Sitemap = getAllCompetitorSlugs().map(slug => ({
        url: `${baseUrl}/compare/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8,
    }))

    const providerPages: MetadataRoute.Sitemap = getAllProviderSlugs().map(slug => ({
        url: `${baseUrl}/verify/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8,
    }))

    const industryPages: MetadataRoute.Sitemap = getAllIndustrySlugs().map(slug => ({
        url: `${baseUrl}/email-verification-for/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7,
    }))

    const companyPages: MetadataRoute.Sitemap = getAllCompanySlugs().map(slug => ({
        url: `${baseUrl}/email-format/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6,
    }))

    const integrationPages: MetadataRoute.Sitemap = getAllIntegrationSlugs().map(slug => ({
        url: `${baseUrl}/integrations/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8,
    }))

    const blogPages: MetadataRoute.Sitemap = [
        { url: `${baseUrl}/blog/email-verification-guide`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/blog/zerobounce-ai-vs-competitors`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/blog/catch-all-email-verification`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/blog/email-verification-b2b-sales`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/blog/reduce-email-bounce-rate`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/blog/email-deliverability-guide`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/blog/how-to-clean-email-list`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/blog/how-to-avoid-spam-traps`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    ]

    const toolPages: MetadataRoute.Sitemap = [
        { url: `${baseUrl}/free-tools/email-syntax-checker`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/free-tools/mx-record-lookup`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/free-tools/disposable-email-detector`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/free-tools/email-pattern-generator`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/free-tools/domain-age-checker`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    ]

    return [...corePages, ...competitorPages, ...providerPages, ...industryPages, ...companyPages, ...integrationPages, ...blogPages, ...toolPages]
}

