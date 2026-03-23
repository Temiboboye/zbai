import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free MX Record Lookup — Check Domain Mail Servers Instantly | ZeroBounce AI',
    description: 'Look up MX records for any domain. Check if a domain has valid mail servers, verify email deliverability, and troubleshoot DNS email issues. Free online MX lookup tool — instant results.',
    keywords: 'mx record lookup, mx record checker, domain mail server check, dns mx lookup, email server lookup, mail exchange record',
    alternates: { canonical: 'https://zerobounceai.com/free-tools/mx-record-lookup' },
    openGraph: {
        title: 'Free MX Record Lookup Tool | ZeroBounce AI',
        description: 'Check if a domain has valid MX records and can receive email. Instant free lookup.',
        url: 'https://zerobounceai.com/free-tools/mx-record-lookup',
        siteName: 'ZeroBounce AI',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free MX Record Lookup',
    description: 'Look up MX records for any domain to check if it can receive email.',
    url: 'https://zerobounceai.com/free-tools/mx-record-lookup',
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
