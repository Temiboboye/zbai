export interface Industry {
  slug: string
  name: string
  icon: string
  headline: string
  description: string
  painPoints: { title: string; text: string }[]
  benefits: { title: string; text: string }[]
  avgBounceRate: string
  avgListSize: string
  potentialSavings: string
  useCases: string[]
  faq: { q: string; a: string }[]
}

export const industries: Industry[] = [
  {
    slug: 'saas',
    name: 'SaaS Companies',
    icon: '💻',
    headline: 'Keep Your Trial-to-Paid Pipeline Clean',
    description: 'SaaS companies live and die by email engagement. From trial welcome sequences to feature announcements and renewal reminders, accurate email verification prevents wasted send volume and improves conversion metrics.',
    painPoints: [
      { title: 'Fake Signups', text: 'Competitors and bots sign up with fake emails to abuse free trials, inflating your user count and skewing analytics.' },
      { title: 'Failed Onboarding Emails', text: 'If your welcome sequence bounces, new users never get activated. That\'s lost revenue from day one.' },
      { title: 'Churn from Bad Emails', text: 'Users who never receive renewal reminders or feature updates churn silently. Clean emails prevent this.' },
    ],
    benefits: [
      { title: 'Block Fake Signups', text: 'Verify emails at registration with our real-time API. Block disposable and invalid emails before they enter your database.' },
      { title: 'Improve Activation Rates', text: 'Ensure every new signup receives your onboarding sequence. Clean emails = higher activation = more paid conversions.' },
      { title: 'Reduce Churn', text: 'Keep your email list clean so renewal reminders, feature announcements, and support emails always land.' },
    ],
    avgBounceRate: '2-5%',
    avgListSize: '10K-500K',
    potentialSavings: '$5,000-$50,000/year in prevented bounces',
    useCases: ['Trial signup verification', 'Onboarding email deliverability', 'Product update notifications', 'Renewal and billing reminders', 'Customer feedback surveys'],
    faq: [
      { q: 'How can SaaS companies use email verification at signup?', a: 'Integrate ZeroBounce AI\'s real-time API into your signup form. Our API verifies emails in under 1 second, blocking disposable, invalid, and risky emails before they enter your database.' },
      { q: 'Does email verification help reduce churn?', a: 'Yes. By ensuring all transactional and marketing emails reach your users, you prevent silent churn caused by missed billing reminders, feature announcements, and support communications.' },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    icon: '🏠',
    headline: 'Never Lose a Lead to a Bad Email',
    description: 'Real estate agents depend on timely email communication for property alerts, open house invitations, and offer notifications. A bounced email can mean a lost sale worth tens of thousands in commission.',
    painPoints: [
      { title: 'Lead Form Spam', text: 'Property listing forms attract fake submissions with invalid emails, wasting agent time on non-leads.' },
      { title: 'Missed Property Alerts', text: 'When listing alerts bounce, buyers miss their dream home. That\'s a lost commission for you.' },
      { title: 'Stale Contact Lists', text: 'People change emails frequently. Old lists degrade quickly, reducing your reachable audience.' },
    ],
    benefits: [
      { title: 'Qualify Leads Instantly', text: 'Verify lead form submissions in real-time. Only spend time on contacts with valid, reachable emails.' },
      { title: 'Deliver Every Alert', text: 'Ensure property alerts, open house invites, and offer updates reach every interested buyer.' },
      { title: 'Clean Your CRM', text: 'Bulk verify your existing contact database. Remove invalid emails and focus on reachable clients.' },
    ],
    avgBounceRate: '5-10%',
    avgListSize: '1K-50K',
    potentialSavings: '$2,000-$20,000/year in recovered commissions',
    useCases: ['Lead form verification', 'Property alert deliverability', 'Open house invitations', 'Market update newsletters', 'CRM database cleaning'],
    faq: [
      { q: 'How does email verification help real estate agents?', a: 'Email verification ensures your property alerts, open house invitations, and market updates reach every qualified buyer. It also filters out fake leads from property listing forms, saving you time on follow-ups.' },
      { q: 'Should I verify my real estate CRM contacts?', a: 'Absolutely. Contact lists degrade 25-30% per year as people change emails. Regular bulk verification with ZeroBounce AI keeps your CRM clean and your campaigns effective.' },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-Commerce',
    icon: '🛒',
    headline: 'Protect Revenue with Verified Customer Emails',
    description: 'E-commerce businesses send critical transactional emails: order confirmations, shipping updates, and abandoned cart recovery. Invalid emails mean lost orders and poor customer experience.',
    painPoints: [
      { title: 'Abandoned Cart Recovery', text: 'Abandoned cart emails generate 15-20% of e-commerce revenue. If they bounce, that revenue is lost.' },
      { title: 'Order Confirmation Failures', text: 'Customers who don\'t receive order confirmations flood support channels, increasing costs.' },
      { title: 'Promotional Spam Traps', text: 'Purchased or scraped email lists can contain spam traps that damage your sender reputation.' },
    ],
    benefits: [
      { title: 'Recover More Carts', text: 'Clean email lists ensure your abandoned cart recovery emails actually reach shoppers. More delivery = more recovered orders.' },
      { title: 'Protect Sender Reputation', text: 'Avoid spam traps and high bounce rates that can land you in spam folders. Keep your domain reputation pristine.' },
      { title: 'Reduce Support Load', text: 'When order confirmations and shipping updates land reliably, your support team handles fewer "where\'s my order?" tickets.' },
    ],
    avgBounceRate: '3-8%',
    avgListSize: '50K-5M',
    potentialSavings: '$10,000-$200,000/year in recovered revenue',
    useCases: ['Checkout email verification', 'Abandoned cart recovery', 'Order and shipping confirmations', 'Promotional campaigns', 'Loyalty program communications'],
    faq: [
      { q: 'How does email verification increase e-commerce revenue?', a: 'Clean email lists ensure abandoned cart emails, win-back campaigns, and promotional offers actually reach customers. Studies show this can recover 15-20% of otherwise lost revenue.' },
      { q: 'Should I verify emails at checkout?', a: 'Yes. Use ZeroBounce AI\'s real-time API to verify emails during checkout. This prevents order confirmation failures and ensures you can reach customers for shipping updates.' },
    ],
  },
  {
    slug: 'agencies',
    name: 'Marketing Agencies',
    icon: '📊',
    headline: 'Deliver Results Your Clients Actually See',
    description: 'Marketing agencies manage email campaigns for multiple clients. Poor list quality reflects directly on your agency\'s performance metrics. Clean lists mean better open rates, fewer complaints, and happy clients.',
    painPoints: [
      { title: 'Client List Quality', text: 'Clients often provide dirty email lists. Running campaigns on unverified lists risks your sending infrastructure.' },
      { title: 'Shared IP Reputation', text: 'One client\'s bounced campaign can damage shared IP reputation, affecting all clients.' },
      { title: 'Performance Reporting', text: 'High bounce rates make campaign performance look poor, even if the creative and strategy are excellent.' },
    ],
    benefits: [
      { title: 'Protect Your Infrastructure', text: 'Verify every client list before sending. Prevent one bad list from damaging your shared sending reputation.' },
      { title: 'Improve Client Metrics', text: 'Clean lists mean higher open rates, lower bounces, and better ROI metrics in client reports.' },
      { title: 'Scale Confidently', text: 'Bulk verification lets you onboard new clients and clean their lists in minutes, not days.' },
    ],
    avgBounceRate: '5-15%',
    avgListSize: '10K-1M per client',
    potentialSavings: '$20,000-$100,000/year across clients',
    useCases: ['Client list cleaning', 'Pre-campaign verification', 'Lead generation list quality', 'Email deliverability audits', 'Client onboarding verification'],
    faq: [
      { q: 'Why should marketing agencies verify email lists?', a: 'Agencies manage multiple clients\' email reputations. Verifying lists before campaigns protects your shared infrastructure, improves campaign metrics, and demonstrates professionalism to clients.' },
      { q: 'Can I verify emails for multiple clients?', a: 'Yes. ZeroBounce AI supports team accounts and bulk verification. Upload and verify client lists separately, maintaining clean data isolation between accounts.' },
    ],
  },
  {
    slug: 'recruiters',
    name: 'Recruiters & HR',
    icon: '👥',
    headline: 'Reach Every Candidate, Every Time',
    description: 'Recruiters rely on email outreach to source talent. Invalid candidate emails mean missed hires, slower hiring cycles, and wasted outreach effort.',
    painPoints: [
      { title: 'Outdated Candidate Data', text: 'Recruiters often work with LinkedIn exports, resume databases, and purchased lists — all prone to stale emails.' },
      { title: 'Low Response Rates', text: 'When emails bounce, your response rate metrics tank and top candidates never see your opportunities.' },
      { title: 'Competitive Timing', text: 'In recruiting, being first to reach a candidate matters. Bounced emails cost you critical time.' },
    ],
    benefits: [
      { title: 'Verify Before Outreach', text: 'Check candidate emails before sending. Don\'t waste outreach sequences on invalid addresses.' },
      { title: 'Find Correct Emails', text: 'Use our email finder + pattern recognition to find working email addresses when you only have a name and company.' },
      { title: 'Clean ATS Database', text: 'Bulk verify your ATS/CRM to remove invalid emails and maintain accurate candidate records.' },
    ],
    avgBounceRate: '8-20%',
    avgListSize: '5K-100K',
    potentialSavings: '$5,000-$50,000/year in faster placements',
    useCases: ['Candidate outreach verification', 'ATS database cleaning', 'Offer letter delivery assurance', 'Interview scheduling confirmation', 'Onboarding communication'],
    faq: [
      { q: 'How can recruiters use email verification?', a: 'Verify candidate emails before outreach sequences to maximize response rates. Use our email finder to discover candidate emails when you only have their name and company.' },
      { q: 'Can ZeroBounce AI integrate with ATS systems?', a: 'Yes. Our REST API integrates with any ATS or recruiting CRM. Verify emails in real-time during data entry or bulk verify your existing database.' },
    ],
  },
  {
    slug: 'startups',
    name: 'Startups',
    icon: '🚀',
    headline: 'Maximize Every Dollar of Your Email Budget',
    description: 'Startups can\'t afford wasted email sends or damaged sender reputation. Email verification helps you get the most from limited marketing budgets and protect your domain reputation from day one.',
    painPoints: [
      { title: 'Limited Budget', text: 'Every bounced email wastes money from your tight marketing budget. ESP charges don\'t discriminate between valid and invalid sends.' },
      { title: 'New Domain Reputation', text: 'As a new sender, your domain reputation is fragile. High bounce rates early on can permanently damage deliverability.' },
      { title: 'Growth Metrics', text: 'Investors want to see engagement metrics. Inflated lists with invalid emails make your funnel metrics look worse.' },
    ],
    benefits: [
      { title: 'Protect New Domain', text: 'Start with clean sends from day one. Build a strong sender reputation that scales with your business.' },
      { title: 'Maximize ESP Spend', text: 'Only pay to send to valid addresses. Clean lists reduce your ESP costs by 10-30%.' },
      { title: 'Accurate Metrics', text: 'Clean data means accurate open rates, CTR, and conversion metrics that you can trust and present to investors.' },
    ],
    avgBounceRate: '3-10%',
    avgListSize: '500-50K',
    potentialSavings: '$1,000-$15,000/year in ESP and marketing costs',
    useCases: ['User signup verification', 'Product launch announcements', 'Investor update deliverability', 'Beta user outreach', 'Early adopter engagement'],
    faq: [
      { q: 'Why is email verification critical for startups?', a: 'Startups have fragile domain reputations. High bounce rates early on can permanently damage your deliverability. ZeroBounce AI helps you build a clean sender reputation from day one.' },
      { q: 'Is ZeroBounce AI affordable for early-stage startups?', a: 'Yes. Our credit-based pricing means you only pay for what you use. Start with 100 free credits and scale as your list grows.' },
    ],
  },
  {
    slug: 'freelancers',
    name: 'Freelancers',
    icon: '💼',
    headline: 'Land More Clients with Verified Outreach',
    description: 'Freelancers who cold-email potential clients need every message to land. Email verification ensures your pitches reach decision-makers instead of bouncing into the void.',
    painPoints: [
      { title: 'Wasted Outreach', text: 'Every bounced cold email is a potential client you\'ll never reach. Freelancers can\'t afford this waste.' },
      { title: 'Manual Research', text: 'Finding correct email addresses for prospects takes hours of manual work and guesswork.' },
      { title: 'Reputation Risk', text: 'High bounce rates from cold outreach can damage your personal email domain reputation.' },
    ],
    benefits: [
      { title: 'Verify Before You Send', text: 'Check every prospect email before sending. Maximize your outreach success rate.' },
      { title: 'Find Emails Faster', text: 'Use our email finder to discover prospect emails from just a name and company domain.' },
      { title: 'Protect Your Domain', text: 'Keep your bounce rate low to maintain strong email deliverability for all communications.' },
    ],
    avgBounceRate: '10-25%',
    avgListSize: '100-5K',
    potentialSavings: '$500-$5,000/year in time and lost clients',
    useCases: ['Prospect email verification', 'Cold outreach campaigns', 'Portfolio and proposal delivery', 'Invoice and payment reminders', 'Client communication'],
    faq: [
      { q: 'Can freelancers benefit from email verification?', a: 'Absolutely. If you cold-email prospects, verifying emails first dramatically improves your delivery rate and protects your sender reputation for all emails.' },
      { q: 'What plan is right for freelancers?', a: 'Start with our free credits. Most freelancers need only a few hundred verifications per month. Our credit-based pricing scales with your needs.' },
    ],
  },
  {
    slug: 'nonprofits',
    name: 'Nonprofits',
    icon: '🤝',
    headline: 'Reach Every Donor and Volunteer',
    description: 'Nonprofits rely on email for fundraising campaigns, volunteer coordination, and community updates. Bounced donation appeals mean lost funding for your mission.',
    painPoints: [
      { title: 'Donor List Decay', text: 'Donor lists degrade 25-30% per year. Outdated emails mean your fundraising appeals never reach supporters.' },
      { title: 'Tight Budgets', text: 'Every dollar spent on bounced emails is a dollar not going to your mission. Nonprofits can\'t afford ESP waste.' },
      { title: 'Event Coordination', text: 'Volunteer sign-up confirmations and event reminders that bounce mean no-shows and understaffed events.' },
    ],
    benefits: [
      { title: 'Maximize Donations', text: 'Ensure fundraising appeals reach every donor. Clean lists improve open rates and donation conversion.' },
      { title: 'Reduce Email Costs', text: 'Stop paying ESPs to send to invalid addresses. Redirect savings to your mission.' },
      { title: 'Better Event Turnout', text: 'Verified emails ensure event reminders and volunteer coordination messages are delivered.' },
    ],
    avgBounceRate: '5-15%',
    avgListSize: '5K-500K',
    potentialSavings: '$2,000-$30,000/year in recovered donations',
    useCases: ['Fundraising campaign deliverability', 'Donor list maintenance', 'Volunteer coordination', 'Newsletter distribution', 'Grant reporting communications'],
    faq: [
      { q: 'How can nonprofits use email verification?', a: 'Clean your donor email lists before fundraising campaigns to maximize delivery. Verify volunteer signup emails to ensure event coordination messages reach everyone.' },
      { q: 'Do you offer nonprofit discounts?', a: 'Contact us about special nonprofit pricing. We believe clean email data should be accessible to organizations doing good work.' },
    ],
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find(i => i.slug === slug)
}

export function getAllIndustrySlugs(): string[] {
  return industries.map(i => i.slug)
}
