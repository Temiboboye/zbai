import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Domain Age Checker — Check Domain Trust & DNS Records | ZeroBounce AI',
    description: 'Check if a domain exists, its age, and whether it has active DNS records. Identify new, suspicious, or expired domains. Free domain trust verification tool for email marketers and sales teams.',
    keywords: 'domain age checker, domain age lookup, check domain age, domain trust score, domain dns check, whois domain age',
    alternates: { canonical: 'https://zerobounceai.com/free-tools/domain-age-checker' },
    openGraph: {
        title: 'Free Domain Age Checker | ZeroBounce AI',
        description: 'Check domain age and DNS records. Identify suspicious or expired domains instantly.',
        url: 'https://zerobounceai.com/free-tools/domain-age-checker',
        siteName: 'ZeroBounce AI',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Domain Age Checker',
    description: 'Check if a domain exists and verify its DNS records and trust level.',
    url: 'https://zerobounceai.com/free-tools/domain-age-checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'ZeroBounce AI', url: 'https://zerobounceai.com' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    )
}
