export interface VerificationExample {
    slug: string
    title: string
    description: string
    emailType: string
    rawResponse: string
    status: 'Valid' | 'Invalid' | 'Catch-All' | 'Disposable'
    confidence: number
}

export const verificationExamples: VerificationExample[] = [
    {
        slug: 'gmail',
        title: 'Gmail Address Verification Check',
        description: 'See the raw verification output when ZeroBounce AI tests a standard, valid Gmail address.',
        emailType: 'Personal Email (Gmail)',
        status: 'Valid',
        confidence: 100,
        rawResponse: `{
  "address": "john.doe.example@gmail.com",
  "status": "valid",
  "sub_status": "",
  "free_email": true,
  "did_you_mean": null,
  "account": "john.doe.example",
  "domain": "gmail.com",
  "domain_age_days": "10000+",
  "smtp_provider": "google",
  "mx_record": "gmail-smtp-in.l.google.com",
  "mx_found": true,
  "firstname": "John",
  "lastname": "Doe",
  "gender": "male",
  "country": "US",
  "region": "California",
  "city": "Mountain View",
  "zipcode": "94043",
  "processed_at": "2026-04-16 14:02:11.123"
}`
    },
    {
        slug: 'microsoft-365',
        title: 'Microsoft 365 (O365) Verification Example',
        description: 'A look at how we verify corporate properties hosted on Microsoft 365, which often employ advanced routing.',
        emailType: 'Corporate Email (M365)',
        status: 'Valid',
        confidence: 99,
        rawResponse: `{
  "address": "sarah.smith@microsoft.com",
  "status": "valid",
  "sub_status": "",
  "free_email": false,
  "did_you_mean": null,
  "account": "sarah.smith",
  "domain": "microsoft.com",
  "domain_age_days": "11000+",
  "smtp_provider": "microsoft",
  "mx_record": "microsoft-com.mail.protection.outlook.com",
  "mx_found": true,
  "firstname": "Sarah",
  "lastname": "Smith",
  "gender": "female",
  "country": "US",
  "region": "Washington",
  "city": "Redmond",
  "zipcode": "98052",
  "processed_at": "2026-04-16 14:15:33.456"
}`
    },
    {
        slug: 'catch-all',
        title: 'Catch-All Domain Score Analysis',
        description: 'An example of our AI confidence scoring applied to an "accept-all" domain where traditional verifiers fail.',
        emailType: 'Catch-All (B2B)',
        status: 'Catch-All',
        confidence: 85,
        rawResponse: `{
  "address": "marketing.director@acmecorp.net",
  "status": "catch-all",
  "sub_status": "",
  "catch_all_confidence_score": 85,
  "free_email": false,
  "did_you_mean": null,
  "account": "marketing.director",
  "domain": "acmecorp.net",
  "domain_age_days": "3450",
  "smtp_provider": "proofpoint",
  "mx_record": "mx1.proofpoint.com",
  "mx_found": true,
  "firstname": "Unknown",
  "lastname": "Unknown",
  "pattern_match_probability": "High",
  "processed_at": "2026-04-16 14:22:01.888"
}`
    },
    {
        slug: 'disposable',
        title: 'Disposable Temporary Email Detection',
        description: 'We instantly detect addresses from over 10,000 disposable domains to protect your list quality.',
        emailType: 'Disposable Email',
        status: 'Disposable',
        confidence: 0,
        rawResponse: `{
  "address": "throwaway12345@10minutemail.com",
  "status": "do_not_mail",
  "sub_status": "disposable",
  "free_email": true,
  "did_you_mean": null,
  "account": "throwaway12345",
  "domain": "10minutemail.com",
  "domain_age_days": "5400",
  "smtp_provider": "unknown",
  "mx_record": "mx.10minutemail.com",
  "mx_found": true,
  "disposable_domain_matched": true,
  "processed_at": "2026-04-16 14:30:12.111"
}`
    },
    {
        slug: 'invalid-typo',
        title: 'Syntax Error and Typo Detection',
        description: 'ZeroBounce AI catches syntactical errors and domain typos, offering "Did you mean?" suggestions to salvage fat-fingered leads.',
        emailType: 'Typo / Invalid Syntax',
        status: 'Invalid',
        confidence: 0,
        rawResponse: `{
  "address": "hello@gmael.com",
  "status": "invalid",
  "sub_status": "mailbox_not_found",
  "free_email": false,
  "did_you_mean": "hello@gmail.com",
  "account": "hello",
  "domain": "gmael.com",
  "domain_age_days": "500",
  "smtp_provider": "unknown",
  "mx_record": null,
  "mx_found": false,
  "processed_at": "2026-04-16 14:45:50.009"
}`
    }
]

export function getVerificationExampleBySlug(slug: string): VerificationExample | undefined {
    return verificationExamples.find(e => e.slug === slug)
}

export function getAllVerificationExampleSlugs(): string[] {
    return verificationExamples.map(e => e.slug)
}
