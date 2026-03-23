import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Disposable Email Detector — Check Temp & Throwaway Emails | ZeroBounce AI',
    description: 'Instantly detect disposable, temporary, and throwaway email addresses. Check if an email is from Mailinator, Guerrillamail, Tempmail, or 5,000+ other disposable providers. Free online tool — no signup required.',
    keywords: 'disposable email detector, temp email checker, throwaway email check, fake email detector, temporary email validator, burner email check',
    alternates: { canonical: 'https://zerobounceai.com/free-tools/disposable-email-detector' },
    openGraph: {
        title: 'Free Disposable Email Detector | ZeroBounce AI',
        description: 'Check if an email is from a disposable or temporary provider. Free tool, instant results.',
        url: 'https://zerobounceai.com/free-tools/disposable-email-detector',
        siteName: 'ZeroBounce AI',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Disposable Email Detector',
    description: 'Detect throwaway and temporary email addresses from 5,000+ disposable providers.',
    url: 'https://zerobounceai.com/free-tools/disposable-email-detector',
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
