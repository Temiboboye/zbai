import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Email Syntax Checker — Validate Email Format Online | ZeroBounce AI',
    description: 'Check if an email address has valid syntax with our free RFC-compliant email validator. Catch typos, missing domains, invalid characters, and formatting errors instantly. No signup required.',
    keywords: 'email syntax checker, email format validator, email validation tool, RFC email check, email address validator, check email format',
    alternates: { canonical: 'https://zerobounceai.com/free-tools/email-syntax-checker' },
    openGraph: {
        title: 'Free Email Syntax Checker | ZeroBounce AI',
        description: 'Validate email format online. Catch typos and formatting errors instantly.',
        url: 'https://zerobounceai.com/free-tools/email-syntax-checker',
        siteName: 'ZeroBounce AI',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Email Syntax Checker',
    description: 'RFC-compliant email syntax validator. Check if an email address has valid format.',
    url: 'https://zerobounceai.com/free-tools/email-syntax-checker',
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
