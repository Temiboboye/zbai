import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Email Syntax Checker — Validate Email Format Online | ZeroBounce AI',
    description: 'Check if an email address has valid syntax with our free RFC-compliant email syntax validator. Catch typos, missing domains, and formatting errors.',
    alternates: { canonical: 'https://zerobounceai.com/free-tools/email-syntax-checker' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
