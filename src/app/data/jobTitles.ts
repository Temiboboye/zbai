export interface JobTitle {
    slug: string
    title: string
    department: string
    seniority: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'Individual Contributor'
    commonPatterns: string[]
    description: string
    tips: string[]
}

export const jobTitles: JobTitle[] = [
    {
        slug: 'ceo',
        title: 'CEO (Chief Executive Officer)',
        department: 'Executive',
        seniority: 'C-Level',
        commonPatterns: ['firstname@', 'initial.lastname@', 'ceo@'],
        description: 'Finding the CEO\'s email address is the holy grail of B2B sales. However, CEOs are highly guarded. While their email formats often follow standard company patterns, they may use unique aliases or have aggressive spam filtering.',
        tips: [
            'For smaller companies (<50 employees), firstname@ is very common.',
            'CEOs of large enterprises often use a custom alias to avoid spam.',
            'Never guess a CEO\'s email and send blindly; a hard bounce or spam complaint from an executive server is disastrous.'
        ]
    },
    {
        slug: 'cto',
        title: 'CTO (Chief Technology Officer)',
        department: 'Engineering',
        seniority: 'C-Level',
        commonPatterns: ['firstname.lastname@', 'firstname@', 'firstinitiallastname@'],
        description: 'CTOs manage technology strategy and purchasing. They are highly technical and have zero tolerance for unsolicited spam or generic pitches. Their email addresses usually follow the standard corporate structure.',
        tips: [
            'CTOs often employ strict spam filters or use catch-all routing to filter external mail.',
            'Verifying a CTO\'s email is critical; if they catch you guessing, they will block your domain.',
            'Look for their GitHub or personal blog, which sometimes lists a public contact address.'
        ]
    },
    {
        slug: 'cmo',
        title: 'CMO (Chief Marketing Officer)',
        department: 'Marketing',
        seniority: 'C-Level',
        commonPatterns: ['firstname.lastname@', 'firstname@'],
        description: 'CMOs control large budgets for MarTech and advertising. Finding their email is crucial for marketing agencies and software vendors. Their email formats usually adhere strictly to the company standard.',
        tips: [
            'CMOs are active on LinkedIn. Cross-referencing their name with company domains usually yields the right format.',
            'CMOs receive immense volumes of cold outreach. Ensure your deliverability is perfect so you don\'t land in spam.'
        ]
    },
    {
        slug: 'vp-sales',
        title: 'VP of Sales',
        department: 'Sales',
        seniority: 'VP',
        commonPatterns: ['firstname.lastname@', 'firstinitiallastname@'],
        description: 'VPs of Sales are prime targets for RevOps tools, lead generation services, and sales training. Because they build outbound teams themselves, they respect a well-researched, perfectly delivered cold email.',
        tips: [
            'Sales leaders change jobs frequently. Always verify their email before sending to avoid hard bounces from outdated data.',
            'Their email almost always follows the primary corporate structure.'
        ]
    },
    {
        slug: 'vp-engineering',
        title: 'VP of Engineering',
        department: 'Engineering',
        seniority: 'VP',
        commonPatterns: ['firstname.lastname@', 'firstname@'],
        description: 'VPs of Engineering make the final call on developer tools, cloud infrastructure, and technical hiring. Like CTOs, they are technically savvy and employ strong email security.',
        tips: [
            'They often use aliases differently from the standard format to filter vendor noise.',
            'Using ZeroBounce AI on engineering domains is essential as they often configure strict DMARC and spam policies.'
        ]
    },
    {
        slug: 'marketing-director',
        title: 'Marketing Director',
        department: 'Marketing',
        seniority: 'Director',
        commonPatterns: ['firstname.lastname@', 'firstnamelastname@'],
        description: 'Marketing Directors often hold the actual purchasing power for mid-tier SaaS tools and agency retainers. They are accessible but busy.',
        tips: [
            'Because they are middle management, their emails always follow the strict corporate naming convention (e.g., john.doe@company.com).',
            'Verify before sending; high turnover in marketing roles means lists decay quickly.'
        ]
    },
    {
        slug: 'hr-manager',
        title: 'HR Manager',
        department: 'Human Resources',
        seniority: 'Manager',
        commonPatterns: ['firstname.lastname@', 'firstname@'],
        description: 'HR Managers are targets for recruiting tools, benefits platforms, and HR tech. They often handle sensitive employee data, meaning their inboxes are highly protected.',
        tips: [
            'Beware of role-based emails like "hr@company.com" or "careers@company.com". While these are easy to find, emailing them has low conversion rates.',
            'Always find the specific HR Manager\'s direct email address using the company\'s standard format.'
        ]
    },
    {
        slug: 'founder',
        title: 'Founder / Co-Founder',
        department: 'Executive',
        seniority: 'C-Level',
        commonPatterns: ['firstname@', 'initial.lastname@'],
        description: 'Founders of startups and SMBs are the ultimate decision-makers. In early-stage companies, their email format is almost always just their first name.',
        tips: [
            'If the company has under 50 employees, try firstname@company.com.',
            'Founders often keep their original firstname@ alias even as the company grows and switches to firstname.lastname@ for new employees.'
        ]
    },
    {
        slug: 'product-manager',
        title: 'Product Manager',
        department: 'Product',
        seniority: 'Individual Contributor',
        commonPatterns: ['firstname.lastname@'],
        description: 'Product Managers influence purchases for analytics, feedback, and design tools. They are usually found using standard corporate email configurations.',
        tips: [
            'Verify their emails carefully; "PM" roles are common, and "John Smith PM" could refer to many people at a large enterprise.',
            'Stick to the first.last@ format.'
        ]
    },
    {
        slug: 'cfo',
        title: 'CFO (Chief Financial Officer)',
        department: 'Finance',
        seniority: 'C-Level',
        commonPatterns: ['firstname.lastname@', 'firstinitiallastname@'],
        description: 'CFOs hold the purse strings. Outbound to CFOs must be highly targeted and professional. Their emails are tightly guarded behind corporate firewalls.',
        tips: [
            'CFOs often have executive assistants. Bouncing an email off an executive server damages your domain reputation significantly.',
            'Ensure 100% verification certainty before sending.'
        ]
    }
]

export function getJobTitleBySlug(slug: string): JobTitle | undefined {
    return jobTitles.find(j => j.slug === slug)
}

export function getAllJobTitleSlugs(): string[] {
    return jobTitles.map(j => j.slug)
}
