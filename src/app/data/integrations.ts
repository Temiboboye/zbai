export interface Integration {
    slug: string
    name: string
    category: string
    icon: string
    description: string
    useCases: string[]
    benefits: string[]
}

const integrations: Integration[] = [
    {
        slug: 'hubspot',
        name: 'HubSpot',
        category: 'CRM',
        icon: '🟠',
        description: 'Verify emails directly in your HubSpot CRM. Clean contacts before outreach, validate leads at import, and maintain list hygiene automatically.',
        useCases: [
            'Verify contacts before importing into HubSpot',
            'Clean existing HubSpot contact lists in bulk',
            'Validate form submissions in real-time via API',
            'Score catch-all contacts before enrollment in sequences',
        ],
        benefits: [
            'Reduce bounce rates on HubSpot email campaigns',
            'Protect sender reputation for your HubSpot-managed domain',
            'Improve HubSpot lead scoring with email quality data',
            'Save credits by only emailing verified contacts',
        ],
    },
    {
        slug: 'salesforce',
        name: 'Salesforce',
        category: 'CRM',
        icon: '☁️',
        description: 'Integrate email verification with Salesforce to keep your Leads and Contacts clean. Verify before outreach, enrich data quality, and improve deliverability.',
        useCases: [
            'Bulk verify Salesforce Leads before sales sequences',
            'Real-time verification on Salesforce web-to-lead forms',
            'Clean Salesforce Contact records before marketing campaigns',
            'Enrich Salesforce records with email quality metadata',
        ],
        benefits: [
            'Higher email deliverability for Salesforce campaigns',
            'Cleaner pipeline with verified lead data',
            'Reduced cost per lead from better email accuracy',
            'Salesforce reporting on email quality metrics',
        ],
    },
    {
        slug: 'mailchimp',
        name: 'Mailchimp',
        category: 'Email Marketing',
        icon: '🐒',
        description: 'Clean your Mailchimp lists before sending campaigns. Remove invalid, disposable, and risky emails to protect your sender reputation and reduce bounces.',
        useCases: [
            'Export Mailchimp list → verify → re-import clean list',
            'Pre-verify subscriber lists before campaign sends',
            'Identify and remove disposable signups from audiences',
            'Score catch-all subscribers before including in segments',
        ],
        benefits: [
            'Lower Mailchimp bounce rates below 2%',
            'Save money on Mailchimp pricing (only pay for real subscribers)',
            'Improve open rates by keeping only engaged, valid emails',
            'Avoid Mailchimp account suspension from high bounces',
        ],
    },
    {
        slug: 'sendgrid',
        name: 'SendGrid',
        category: 'Email API',
        icon: '📮',
        description: 'Verify emails before sending via SendGrid. Protect your SendGrid sender reputation by only delivering to verified addresses.',
        useCases: [
            'Pre-verify recipient lists before SendGrid sends',
            'Real-time verification webhook before transactional emails',
            'Clean suppression lists and re-verify',
            'Monitor domain health alongside SendGrid analytics',
        ],
        benefits: [
            'Protect SendGrid IP reputation',
            'Reduce hard bounces and improve engagement scores',
            'Lower cost by not wasting SendGrid sends on invalid emails',
            'Maintain consistent inbox placement rates',
        ],
    },
    {
        slug: 'zapier',
        name: 'Zapier',
        category: 'Automation',
        icon: '⚡',
        description: 'Connect ZeroBounce AI to 5,000+ apps via Zapier. Automatically verify emails when new leads appear in your CRM, forms, or spreadsheets.',
        useCases: [
            'Auto-verify emails when new rows are added to Google Sheets',
            'Trigger verification on new CRM contacts',
            'Validate emails from Typeform, JotForm, or Gravity Forms',
            'Route verified vs. invalid leads to different workflows',
        ],
        benefits: [
            'Zero-code email verification in any workflow',
            'Automatic list hygiene without manual exports',
            'Real-time lead scoring via Zapier triggers',
            'Connect to 5,000+ apps without writing code',
        ],
    },
    {
        slug: 'google-sheets',
        name: 'Google Sheets',
        category: 'Productivity',
        icon: '📊',
        description: 'Verify email lists directly from Google Sheets. Export your sheet, run AI-powered verification, and import clean results.',
        useCases: [
            'Upload Google Sheets CSV for bulk verification',
            'Verify event attendee lists before invitations',
            'Clean lead generation spreadsheets',
            'Validate partner and vendor contact sheets',
        ],
        benefits: [
            'No technical setup — just export and upload',
            'Categorized results you can import back into Sheets',
            'Catch-all confidence scores visible in spreadsheet format',
            'Share clean lists with team members',
        ],
    },
    {
        slug: 'wordpress',
        name: 'WordPress',
        category: 'CMS',
        icon: '🔵',
        description: 'Verify emails from WordPress forms and signups. Prevent fake registrations, clean subscriber lists, and protect your email campaigns.',
        useCases: [
            'Validate WooCommerce customer emails at checkout',
            'Verify WordPress registration form emails',
            'Clean newsletter subscriber lists from Contact Form 7',
            'Real-time API verification for Gravity Forms',
        ],
        benefits: [
            'Prevent fake WooCommerce accounts',
            'Reduce spam signups on WordPress sites',
            'Improve email campaign deliverability',
            'Protect WooCommerce transactional email reputation',
        ],
    },
    {
        slug: 'pipedrive',
        name: 'Pipedrive',
        category: 'CRM',
        icon: '🟢',
        description: 'Keep your Pipedrive contacts clean with email verification. Verify deals and contacts before outreach to improve cold email deliverability.',
        useCases: [
            'Verify new Pipedrive contacts before adding to sequences',
            'Bulk clean existing Pipedrive contact database',
            'Score catch-all emails before sales outreach',
            'Validate emails from Pipedrive web forms',
        ],
        benefits: [
            'Higher deliverability for Pipedrive email campaigns',
            'Better deal pipeline with verified contact data',
            'Reduced bounce rates on cold outreach',
            'Cleaner CRM data for accurate reporting',
        ],
    },
    {
        slug: 'activecampaign',
        name: 'ActiveCampaign',
        category: 'Marketing Automation',
        icon: '💙',
        description: 'Verify and clean your ActiveCampaign lists before automations run. Protect sender reputation and improve automation performance.',
        useCases: [
            'Clean ActiveCampaign lists before drip campaigns',
            'Verify contacts entering automations',
            'Remove disposable emails from ActiveCampaign audiences',
            'Score catch-all contacts before nurture sequences',
        ],
        benefits: [
            'Protect ActiveCampaign sending reputation',
            'Improve automation engagement rates',
            'Reduce ActiveCampaign costs (fewer invalid contacts)',
            'Better segmentation with email quality data',
        ],
    },
    {
        slug: 'constant-contact',
        name: 'Constant Contact',
        category: 'Email Marketing',
        icon: '📧',
        description: 'Clean Constant Contact lists to improve deliverability and reduce bounces. Verify before campaigns to protect your sender reputation.',
        useCases: [
            'Export and verify Constant Contact lists before sends',
            'Remove invalid and risky emails from segments',
            'Identify disposable email signups',
            'Re-verify old contacts before re-engagement campaigns',
        ],
        benefits: [
            'Lower Constant Contact bounce rates',
            'Improved inbox placement across campaigns',
            'Reduced risk of Constant Contact account warnings',
            'Better open rates from cleaner lists',
        ],
    },
    {
        slug: 'convertkit',
        name: 'ConvertKit',
        category: 'Creator Email',
        icon: '✨',
        description: 'Keep your ConvertKit subscriber list clean and profitable. Verify emails before broadcasts and sequences to maximize deliverability.',
        useCases: [
            'Verify ConvertKit subscriber lists before paid newsletters',
            'Clean imported subscriber lists',
            'Validate landing page signups',
            'Remove inactive and invalid subscribers',
        ],
        benefits: [
            'Higher deliverability for creator newsletters',
            'Save on ConvertKit pricing with fewer invalid subscribers',
            'Better engagement metrics for sponsorship deals',
            'Protect creator brand reputation',
        ],
    },
    {
        slug: 'lemlist',
        name: 'Lemlist',
        category: 'Cold Outreach',
        icon: '🍋',
        description: 'Verify cold outreach lists before loading into Lemlist. Protect your sending domain and improve reply rates with only verified prospects.',
        useCases: [
            'Pre-verify prospect lists before Lemlist campaigns',
            'Score catch-all emails before cold sequences',
            'Remove disposable and role-based emails',
            'Clean bounced contacts from previous campaigns',
        ],
        benefits: [
            'Protect cold email sender reputation',
            'Higher reply rates from verified prospects only',
            'Reduced daily send waste on invalid emails',
            'Better Lemlist campaign analytics',
        ],
    },
]

export function getAllIntegrationSlugs(): string[] {
    return integrations.map(i => i.slug)
}

export function getIntegrationBySlug(slug: string): Integration | undefined {
    return integrations.find(i => i.slug === slug)
}

export function getAllIntegrations(): Integration[] {
    return integrations
}
