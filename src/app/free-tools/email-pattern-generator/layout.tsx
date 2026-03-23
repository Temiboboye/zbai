import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Email Pattern Generator — Find Email Formats by Company | ZeroBounce AI',
    description: 'Generate likely email addresses from a person\'s name and company domain. Discover email patterns like firstname.lastname@, first@, and more. Free email finder tool for sales prospecting and outreach.',
    keywords: 'email pattern generator, find email format, email permutator, company email finder, email guesser, find someone email address',
    alternates: { canonical: 'https://zerobounceai.com/free-tools/email-pattern-generator' },
    openGraph: {
        title: 'Free Email Pattern Generator | ZeroBounce AI',
        description: 'Generate likely email addresses from a name and company domain. Free tool for sales prospecting.',
        url: 'https://zerobounceai.com/free-tools/email-pattern-generator',
        siteName: 'ZeroBounce AI',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Email Pattern Generator',
    description: 'Generate likely email addresses from a person\'s name and company domain for sales prospecting.',
    url: 'https://zerobounceai.com/free-tools/email-pattern-generator',
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
