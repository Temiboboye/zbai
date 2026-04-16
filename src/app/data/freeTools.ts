export interface FreeTool {
    slug: string
    name: string
    title: string
    description: string
    metaDescription: string
    icon: string
    category: string
    features: string[]
    howItWorks: string
    faqs: { q: string; a: string }[]
}

// These are tool landing pages outlining the tools functionality.
export const freeTools: FreeTool[] = [
    {
        slug: 'email-bounce-checker',
        name: 'Email Bounce Checker',
        title: 'Free Email Bounce Checker & Tester',
        description: 'Instantly check if an email address will bounce before you send. Protect your sender reputation by removing invalid emails.',
        metaDescription: 'Free tool to test if an email address will hard bounce. Check validity instantly and protect your email deliverability.',
        icon: '🛑',
        category: 'Verification',
        features: ['SMTP Validation', 'Domain Checking', 'Syntax Validation', 'Instant Results'],
        howItWorks: 'Our email bounce checker simulates sending an email to the address. It talks to the receiving SMTP server and asks if the mailbox exists, without actually sending a message. If the server says no, the email is flagged as a bounce.',
        faqs: [
            { q: 'Is this tool really free?', a: 'Yes, you can check individual emails for bounces completely free. For bulk checking, you can create a free account to get 100 credits.' },
            { q: 'Does checking the bounce send an email?', a: 'No. Our tool uses SMTP connection simulation. We connect to the mail server, verify the mailbox exists, and disconnect before any email is sent.' }
        ]
    },
    {
        slug: 'email-list-cleaner',
        name: 'Email List Cleaner',
        title: 'Free Online Email List Cleaner Tool',
        description: 'Upload your CSV and get a free analysis of your email list quality. Identify the percentage of invalid, risky, and catch-all emails.',
        metaDescription: 'Analyze your email list health for free. Find out how many invalid, bouncing, and risky emails are hiding in your database.',
        icon: '🧹',
        category: 'Bulk Tools',
        features: ['CSV Support', 'List Health Score', 'Duplicates Removal', 'Format Checking'],
        howItWorks: 'Upload a sample or your full list. The tool performs a high-speed surface-level analysis to check for syntax errors, disposable domains, role-based emails, and known complainers, giving you a health score before full verification.',
        faqs: [
            { q: 'How many emails can I analyze for free?', a: 'You can upload lists of any size for the free health analysis. To perform deep SMTP verification on the entire list, you will need credits.' },
            { q: 'What is a list health score?', a: 'It\'s an estimate of your list\'s deliverability. A low score indicates high risk of bounces and spam complaints if you were to send to it without cleaning.' }
        ]
    },
    {
        slug: 'catch-all-checker',
        name: 'Catch-All Domain Checker',
        title: 'Free Catch-All Email Domain Checker',
        description: 'Test if a domain is configured as a catch-all (accept-all). Find out if standard email verifiers will fail on a specific company.',
        metaDescription: 'Check if any domain is configured as a catch-all. Understand why your emails might bounce even if verification tools mark them as valid.',
        icon: '🎯',
        category: 'Deliverability',
        features: ['Domain Analytics', 'Server Response testing', 'Accept-All Detection', 'Confidence Scoring Preview'],
        howItWorks: 'The tool pings the domain\'s MX records with a randomized, non-existent email address (e.g., asdfgbhj@domain.com). If the server accepts it, the domain is confirmed as a catch-all.',
        faqs: [
            { q: 'What does "catch-all" mean?', a: 'A catch-all domain accepts all emails sent to it, regardless of whether the specific user exists. This makes confirming specific addresses impossible without AI confidence scoring.' },
            { q: 'Why do I get false positives on catch-all domains?', a: 'Because the server lies and says "yes, that email exists" to every query. ZeroBounce AI uses alternative signals to predict true validity.' }
        ]
    },
    {
        slug: 'domain-blacklist-checker',
        name: 'Domain Blacklist Checker',
        title: 'Free Email Domain & IP Blacklist Checker',
        description: 'Check if your sending IP or domain is listed on major anti-spam blacklists like Spamhaus, SORBS, and Barracuda.',
        metaDescription: 'Test your domain or IP against 100+ email blacklists instantly. See if your emails are being blocked by ISPs.',
        icon: '⛔',
        category: 'Deliverability',
        features: ['100+ Blacklists Checked', 'IP & Domain Support', 'Real-time Lookup', 'Delisting Guidance'],
        howItWorks: 'We query the DNS records of over 100 prominent DNSBLs (DNS-based Blackhole Lists) with your IP or domain to check if any have flagged you as a source of spam.',
        faqs: [
            { q: 'What do I do if I am blacklisted?', a: 'First, stop sending campaigns. Identify why you were listed (usually high bounces or spam trap hits). Clean your list with ZeroBounce AI, then follow the specific blocklist\'s delisting procedure.' },
            { q: 'How often should I check my blacklist status?', a: 'If you are actively doing cold outreach or high-volume sending, you should monitor your IP and domain status daily or weekly.' }
        ]
    },
    {
        slug: 'spf-record-checker',
        name: 'SPF Record Checker',
        title: 'Free SPF Record Checker & Validator',
        description: 'Validate your Sender Policy Framework (SPF) DNS record. Ensure it correctly authorizes your email servers and prevents spoofing.',
        metaDescription: 'Check your SPF record for syntax errors, multiple records, and "too many DNS lookups" issues. Essential for email deliverability.',
        icon: '🛡️',
        category: 'Authentication',
        features: ['Syntax Validation', 'Lookup Limit Check', 'Include Resolution', 'Authorized IP Display'],
        howItWorks: 'The tool performs a TXT record lookup on your domain, parses the SPF string, and recursively checks all "include" statements to ensure you haven\'t exceeded the 10-lookup limit and that the syntax is perfect.',
        faqs: [
            { q: 'What is the 10-lookup limit?', a: 'SPF protocols limit the number of DNS resolving mechanisms (like "include" or "a") to 10 to prevent denial-of-service attacks. If you exceed 10, your SPF record breaks and emails fail authentication.' },
            { q: 'Can I have multiple SPF records?', a: 'No. A domain must have exactly one SPF record (starting with v=spf1). Multiple records will cause a permanent error and authentication will fail.' }
        ]
    },
    {
        slug: 'dkim-validator',
        name: 'DKIM Record Validator',
        title: 'Free DKIM Record & Selector Validator',
        description: 'Verify your DomainKeys Identified Mail (DKIM) setup. Check if your public key is published correctly in your DNS.',
        metaDescription: 'Test your DKIM DNS record by selector and domain. Ensure your emails are properly cryptographically signed for better inbox placement.',
        icon: '🔑',
        category: 'Authentication',
        features: ['Key Extraction', 'Syntax Check', 'RSA / Ed25519 Support', 'Public Key Display'],
        howItWorks: 'Enter your domain and DKIM selector. We perform a DNS query for the specific TXT record (selector._domainkey.domain.com) and validate the correct formatting of the public key.',
        faqs: [
            { q: 'What is a DKIM selector?', a: 'A selector is a string used to point to a specific public key in your DNS. It allows you to have multiple DKIM keys for different sending services (e.g., one for Google Workspace, one for Mailchimp).' },
            { q: 'Why is my DKIM record returning "Not Found"?', a: 'DNS propagation can take up to 24 hours. If you just added the record, try again later. Alternatively, ensure you are using the correct selector name provided by your email service.' }
        ]
    },
    {
        slug: 'dmarc-checker',
        name: 'DMARC Checker',
        title: 'Free DMARC Record Validator & Tester',
        description: 'Test your DMARC DNS record for errors. Ensure your domain is protected against phishing and spoofing attacks.',
        metaDescription: 'Verify your DMARC policy setup. Check for syntax errors, policy strictness (none, quarantine, reject), and reporting configurations.',
        icon: '👮',
        category: 'Authentication',
        features: ['Policy Validation', 'Tag Parsing', 'Syntax Checking', 'Spoofing Vulnerability Analysis'],
        howItWorks: 'The tool checks the _dmarc.domain.com TXT record, parses the DMARC tags (v, p, rua, ruf), and highlights any misconfigurations or overly permissive settings.',
        faqs: [
            { q: 'What DMARC policy should I use?', a: 'Start with p=none to monitor traffic without blocking emails. Once you confirm all legitimate sending sources are authenticating correctly via SPF and DKIM, move to p=quarantine, and eventually p=reject.' },
            { q: 'Is DMARC required for Gmail and Yahoo?', a: 'Yes. As of 2024, Google and Yahoo require DMARC, SPF, and DKIM for bulk senders (sending 5,000+ emails/day). Without it, your emails will bounce.' }
        ]
    },
    {
        slug: 'email-header-analyzer',
        name: 'Email Header Analyzer',
        title: 'Free Email Header Analyzer Tool',
        description: 'Analyze raw email headers to trace the routing path, inspect authentication results (SPF/DKIM/DMARC), and troubleshoot deliverability issues.',
        metaDescription: 'Paste your raw email headers to trace hops, view server delays, and debug SPF, DKIM, and DMARC authentication failures.',
        icon: '📋',
        category: 'Deliverability',
        features: ['Hop Extraction', 'Delay Calculations', 'Auth Results Parsing', 'Spam Score Extraction'],
        howItWorks: 'Paste the raw source code of an email. The tool parses the standard RFC headers, reading the "Received" lines backwards to map the journey, and extracts the "Authentication-Results" headers.',
        faqs: [
            { q: 'How do I get my email headers?', a: 'In Gmail, click the three dots next to reply and select "Show original". In Outlook, go to File > Properties and look at "Internet headers".' },
            { q: 'What should I look for in the analyzer?', a: 'Look for the "Authentication-Results" section. You want to see "pass" for SPF, DKIM, and DMARC. Also look at the time delays between hops to identify bottlenecks.' }
        ]
    }
]

export function getFreeToolBySlug(slug: string): FreeTool | undefined {
    return freeTools.find(t => t.slug === slug)
}

export function getAllFreeToolSlugs(): string[] {
    return freeTools.map(t => t.slug)
}
