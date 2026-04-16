export interface UseCase {
    slug: string
    name: string
    title: string
    description: string
    painPoint: string
    solution: string
    keyFeatures: string[]
    bestPractices: string[]
    faqs: { q: string; a: string }[]
}

export const useCases: UseCase[] = [
    {
        slug: 'cold-email',
        name: 'Cold Email Outreach',
        title: 'Email Verification for Cold Email Outreach',
        description: 'Ensure your cold emails actually reach decision-makers. Protect your sender reputation by removing invalid emails and spam traps before launching your outreach campaigns.',
        painPoint: 'High bounce rates when doing cold outreach destroy your sending reputation, leading to your domain being blacklisted. If your emails land in spam, your cold outreach strategy fails entirely.',
        solution: 'ZeroBounce AI validates every email address on your prospect list prior to sending, ensuring you only contact real people. Our confidence scoring allows you to target catch-all domains safely.',
        keyFeatures: [
            'API integration with tools like Instantly and Lemlist',
            'Advanced Catch-All confidence scoring',
            'Spam trap detection and removal',
            'Pattern recognition for finding valid contacts'
        ],
        bestPractices: [
            'Never send a cold email campaign without verifying the list first',
            'Exclude emails with a catch-all confidence score below 75',
            'Warm up your domain gradually before scaling outreach',
            'Regularly monitor your domain\'s sender score'
        ],
        faqs: [
            { q: 'How does verification help cold email deliverability?', a: 'By removing hard bounces and spam traps, verification keeps your complaint and bounce rates low. This signals to providers like Google and Microsoft that you are a legitimate sender, keeping your emails out of the spam folder.' },
            { q: 'Can ZeroBounce AI verify catch-all domains for cold outreach?', a: 'Yes. Many B2B companies use catch-all domains. Native verifiers in outreach tools often mark these as "risky." ZeroBounce AI scores these from 0-100, letting you confidently contact valuable targets.' },
            { q: 'Should I verify lists I bought online?', a: 'Absolutely. Purchased lists are notorious for containing high numbers of invalid addresses and spam traps. Never email a purchased list without rigorous verification first.' }
        ]
    },
    {
        slug: 'newsletter-lists',
        name: 'Newsletter List Cleaning',
        title: 'Email List Verification for Newsletters & Creators',
        description: 'Maintain a pristine newsletter audience. Clean your subscribed list regularly to keep engagement high, reduce ESP costs, and ensure your content hits the primary inbox.',
        painPoint: 'Over time, newsletter subscribers abandon their email addresses or change jobs, leading to subscriber decay. Continuing to send to these dormant addresses lowers your overall open rate and hurts deliverability.',
        solution: 'Periodically running your newsletter list through ZeroBounce AI removes dead addresses, identifies chronic non-engagers, and filters out malicious bots that signed up via your forms.',
        keyFeatures: [
            'Bulk CSV upload for large lists',
            'Integrations with Mailchimp, ConvertKit, and Substack',
            'Disposable email detection',
            'Role-based email filtering'
        ],
        bestPractices: [
            'Clean your newsletter list at least once every 6 months (or every 3 months for large lists)',
            'Implement a sunset policy: remove subscribers who haven\'t opened an email in 6 months',
            'Use our real-time API on your subscription forms to block fake emails',
            'Monitor engagement metrics after every clean'
        ],
        faqs: [
            { q: 'Why should I pay to delete subscribers from my newsletter?', a: 'Because inactive and bouncing subscribers hurt the deliverability of the active ones. Furthermore, most ESPs charge by subscriber count; deleting dead weight saves you money.' },
            { q: 'How often do email addresses become invalid?', a: 'Roughly 22% of B2B email addresses become invalid every year due to job changes. B2C lists decay slightly slower, but still experience significant churn.' },
            { q: 'Will cleaning my list improve my open rates?', a: 'Yes. By removing the invalid and bouncing addresses from your total send count, the percentage of successful deliveries and opens (the open rate) will mathematically increase, improving your deliverability profile.' }
        ]
    },
    {
        slug: 'lead-generation',
        name: 'B2B Lead Generation',
        title: 'Real-Time Email Verification for Lead Generation',
        description: 'Capture accurate lead data at the source. Integrate email verification into your signup forms, webinars, and lead magnets to guarantee sales team follow-ups are effective.',
        painPoint: 'Tired of your sales team following up with "mickey.mouse@asdf.com"? Fake emails in your CRM waste thousands of hours of sales productivity and distort your lead quality metrics.',
        solution: 'Use ZeroBounce AI\'s real-time API to instantly check emails as prospects type them into your lead gen forms. Block disposables and typos before they enter your CRM.',
        keyFeatures: [
            'Sub-second real-time API response times',
            'Typo detection and suggestion (e.g., did you mean @gmail.com?)',
            'Integration with HubSpot, Salesforce, and Marketo',
            'Disposable and free-email provider filtering'
        ],
        bestPractices: [
            'Integrate verification on all high-value lead capture forms',
            'Use the "did you mean" feature to correct typos rather than outright blocking',
            'Consider filtering out free emails (Gmail, Yahoo) if you only want B2B leads',
            'Regularly audit your CRM for data decay'
        ],
        faqs: [
            { q: 'Can I block disposable emails from downloading my lead magnets?', a: 'Yes. By using the ZeroBounce AI API, you can reject signups from temporary domains (like 10MinuteMail) and force users to provide a legitimate business or personal email.' },
            { q: 'How fast is the real-time API?', a: 'ZeroBounce AI\'s API is designed for latency-sensitive applications, typically responding in under 300ms, ensuring your lead capture forms remain fast and frictionless.' },
            { q: 'Does it work with my CRM?', a: 'Yes, we offer native integrations and webhook support for major CRMs like HubSpot, Salesforce, and Pipedrive, allowing for seamless data hygiene.' }
        ]
    },
    {
        slug: 'ecommerce',
        name: 'E-Commerce Platforms',
        title: 'Email Verification for E-Commerce & Retail',
        description: 'Ensure order confirmations, shipping updates, and abandoned cart emails reach your customers. Reduce customer support tickets caused by typoed email addresses during checkout.',
        painPoint: 'When a customer misspells their email address during guest checkout, they don\'t receive their receipt or tracking info, leading to panicked support tickets and a poor customer experience.',
        solution: 'ZeroBounce AI verifies emails at checkout and suggests corrections for common typos (e.g., "gmael.com" to "gmail.com"). It also ensures your promotional emails hit the inbox, driving repeat purchases.',
        keyFeatures: [
            'Real-time typo correction API',
            'High-volume capacity for promotional blasts',
            'Shopify and WooCommerce compatible',
            'Spam trap detection to protect marketing ROI'
        ],
        bestPractices: [
            'Implement real-time verification on the checkout page',
            'Prompt the user with "Did you mean [correction]?" if a typo is detected',
            'Clean your promotional list before major sales events (Black Friday, Cyber Monday)',
            'Segment your active vs. inactive purchasers to protect deliverability'
        ],
        faqs: [
            { q: 'Will real-time verification slow down my checkout process?', a: 'No, ZeroBounce AI\'s API responds in milliseconds, ensuring no noticeable delay in the customer checkout experience while saving you from support headaches.' },
            { q: 'How does verification help abandoned cart campaigns?', a: 'Abandoned cart emails have extremely high ROI. If the email address is invalid or bounces, you lose that potential revenue. Verification ensures your recovery emails actually reach the user.' },
            { q: 'Can you detect if an email is fake vs a typo?', a: 'Yes. Our system distinguishes between known invalid domains, disabled accounts, temporary emails, and simple syntax errors or typos like "yaho.com".' }
        ]
    },
    {
        slug: 'saas-onboarding',
        name: 'SaaS User Onboarding',
        title: 'Verifying Emails for SaaS Signup & Onboarding',
        description: 'Maximize user activation rates. Ensure your welcome drip campaigns, product updates, and password reset emails are delivered successfully to every new signup.',
        painPoint: 'If your welcome email goes to spam or bounces because the user entered a fake email, they won\'t experience your product\'s "aha" moment. Poor onboarding deliverability directly impacts MRR/ARR.',
        solution: 'ZeroBounce AI ensures the emails collected during SaaS registration are valid, active, and able to receive your critical onboarding sequences. It protects your application\'s sending IP reputation.',
        keyFeatures: [
            'API integration for signup flows',
            'Detection of role-based emails (support@, admin@)',
            'Identification of free vs business email domains',
            'Comprehensive status codes for detailed routing logic'
        ],
        bestPractices: [
            'Block disposable email addresses from signing up for free trials',
            'Use role-based email detection to identify potential enterprise accounts vs single users',
            'Monitor the deliverability of your transactional emails separately from marketing emails',
            'If an email bounces during onboarding, prompt the user in-app to update their address'
        ],
        faqs: [
            { q: 'Should I prevent role-based emails (like info@) from signing up?', a: 'It depends on your software. For B2B products, an info@ signup might indicate a shared team account. However, role-based emails generally have lower engagement. ZeroBounce AI flags them so you can decide your logic.' },
            { q: 'How do I stop free trial abuse?', a: 'A common tactic for free trial abuse is using disposable emails. Integrating ZeroBounce AI into your signup flow allows you to instantly block known temporary email domains, forcing users to use real addresses.' },
            { q: 'Why are my password reset emails going to spam?', a: 'If your application sends transactional emails (like password resets) from the same IP that sends marketing emails to unverified, bouncing addresses, your reputation drops. Verifying all inputs protects your transactional deliverability.' }
        ]
    }
]

export function getUseCaseBySlug(slug: string): UseCase | undefined {
    return useCases.find(u => u.slug === slug)
}

export function getAllUseCaseSlugs(): string[] {
    return useCases.map(u => u.slug)
}
