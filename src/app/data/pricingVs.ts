export interface PricingVs {
    slug: string
    competitorName: string
    competitorPricingStartingAt: string
    competitorPricingTier1: { emails: string, price: string }
    competitorPricingTier2: { emails: string, price: string }
    competitorPricingTier3: { emails: string, price: string }
    competitorModel: string
    zerobounceAIStartingAt: string
    zerobounceAIPricingTier1: { emails: string, price: string }
    zerobounceAIPricingTier2: { emails: string, price: string }
    zerobounceAIPricingTier3: { emails: string, price: string }
    zerobounceAIModel: string
    savingsPercentage: string
    hiddenFeesComparison: string
    valueAdd: string[]
}

export const pricingVs: PricingVs[] = [
    {
        slug: 'neverbounce',
        competitorName: 'NeverBounce',
        competitorPricingStartingAt: '$0.008 per email',
        competitorPricingTier1: { emails: '10,000', price: '$80' },
        competitorPricingTier2: { emails: '100,000', price: '$500' },
        competitorPricingTier3: { emails: '1,000,000', price: '$3,000' },
        competitorModel: 'Pay-as-you-go volume tiers',
        zerobounceAIStartingAt: '$0.005 per email',
        zerobounceAIPricingTier1: { emails: '10,000', price: '$50' },
        zerobounceAIPricingTier2: { emails: '100,000', price: '$400' },
        zerobounceAIPricingTier3: { emails: '1,000,000', price: '$2,000' },
        zerobounceAIModel: 'Pay-as-you-go + flat subscriptions',
        savingsPercentage: 'Up to 37% cheaper',
        hiddenFeesComparison: 'NeverBounce charges $0.008 baseline. ZeroBounce AI provides standard verification + AI confidence scoring for catch-all domains at a lower baseline price.',
        valueAdd: ['Included AI Confidence Scoring for Catch-alls (NeverBounce returns "Unknown")', 'Included Email pattern detection', 'API access included free', '100 free monthly credits']
    },
    {
        slug: 'hunter-io',
        competitorName: 'Hunter.io',
        competitorPricingStartingAt: '$49/month',
        competitorPricingTier1: { emails: '1,000 verifications', price: '$49/mo' },
        competitorPricingTier2: { emails: '10,000 verifications', price: '$149/mo' },
        competitorPricingTier3: { emails: '50,000 verifications', price: '$499/mo' },
        competitorModel: 'Strict monthly subscriptions based on usage limits',
        zerobounceAIStartingAt: '$0.005 per email (PAYG)',
        zerobounceAIPricingTier1: { emails: '1,000 verifications', price: '$5.00 (PAYG)' },
        zerobounceAIPricingTier2: { emails: '10,000 verifications', price: '$50.00 (PAYG)' },
        zerobounceAIPricingTier3: { emails: '50,000 verifications', price: '$250.00 (PAYG)' },
        zerobounceAIModel: 'Pay only for what you verify, credits never expire',
        savingsPercentage: 'Up to 90% cheaper for low volume',
        hiddenFeesComparison: 'Hunter locks you into expensive monthly subscriptions even if you don\'t verify that many emails every month. ZeroBounce AI lets you buy credits that never expire.',
        valueAdd: ['No monthly lock-in', 'Credits never expire', 'Higher accuracy on B2B catch-all domains', 'Built specifically for verification (Hunter is primarily a finder)']
    },
    {
        slug: 'zerobounce',
        competitorName: 'ZeroBounce (Legacy)',
        competitorPricingStartingAt: '$0.008 per email',
        competitorPricingTier1: { emails: '10,000', price: '$65' },
        competitorPricingTier2: { emails: '100,000', price: '$390' },
        competitorPricingTier3: { emails: '1,000,000', price: '$2,250' },
        competitorModel: 'Tiered volume pricing',
        zerobounceAIStartingAt: '$0.005 per email',
        zerobounceAIPricingTier1: { emails: '10,000', price: '$50' },
        zerobounceAIPricingTier2: { emails: '100,000', price: '$400' },
        zerobounceAIPricingTier3: { emails: '1,000,000', price: '$2,000' },
        zerobounceAIModel: 'AI-first streamlined pricing',
        savingsPercentage: '15-25% cheaper across tiers',
        hiddenFeesComparison: 'ZeroBounce AI includes modern AI capabilities (confidence scoring for catch-alls) built into the base price, whereas legacy verify systems struggle with modern B2B security.',
        valueAdd: ['Next-Gen AI Catch-all scoring', 'Faster API response times', 'More generous free tier', 'Modern dashboard and reporting']
    },
    {
        slug: 'clearout',
        competitorName: 'Clearout',
        competitorPricingStartingAt: '$21 for 3,000',
        competitorPricingTier1: { emails: '10,000', price: '$58' },
        competitorPricingTier2: { emails: '100,000', price: '$350' },
        competitorPricingTier3: { emails: '1,000,000', price: '$1,500' },
        competitorModel: 'Pay-as-you-go',
        zerobounceAIStartingAt: '$0.005 per email',
        zerobounceAIPricingTier1: { emails: '10,000', price: '$50' },
        zerobounceAIPricingTier2: { emails: '100,000', price: '$400' },
        zerobounceAIPricingTier3: { emails: '1,000,000', price: '$2,000' },
        zerobounceAIModel: 'Pay-as-you-go',
        savingsPercentage: 'Comparable, with AI features included',
        hiddenFeesComparison: 'While pricing is similar at high volumes, ZeroBounce AI provides significantly better resolution on catch-all domains, meaning you get more usable emails for your money.',
        valueAdd: ['Superior Catch-All resolution', 'Better API latency', 'Clearer reporting on disposable emails']
    },
    {
        slug: 'kickbox',
        competitorName: 'Kickbox',
        competitorPricingStartingAt: '$0.01 per email',
        competitorPricingTier1: { emails: '10,000', price: '$100' },
        competitorPricingTier2: { emails: '100,000', price: '$800' },
        competitorPricingTier3: { emails: '1,000,000', price: '$4,000' },
        competitorModel: 'Premium tier volume pricing',
        zerobounceAIStartingAt: '$0.005 per email',
        zerobounceAIPricingTier1: { emails: '10,000', price: '$50' },
        zerobounceAIPricingTier2: { emails: '100,000', price: '$400' },
        zerobounceAIPricingTier3: { emails: '1,000,000', price: '$2,000' },
        zerobounceAIModel: 'Value-driven AI pricing',
        savingsPercentage: '50% cheaper',
        hiddenFeesComparison: 'Kickbox is one of the most expensive verifiers on the market. ZeroBounce AI delivers identical or better accuracy for half the price.',
        valueAdd: ['Half the cost of Kickbox', 'AI Scoring on unknown domains', 'Rapid bulk processing speeds']
    }
]

export function getPricingVsBySlug(slug: string): PricingVs | undefined {
    return pricingVs.find(p => p.slug === slug)
}

export function getAllPricingVsSlugs(): string[] {
    return pricingVs.map(p => p.slug)
}
