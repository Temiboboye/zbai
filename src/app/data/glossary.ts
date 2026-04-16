export interface GlossaryTerm {
    slug: string
    term: string
    definition: string
    longDescription: string
    relatedTerms: string[]
}

export const glossaryTerms: GlossaryTerm[] = [
    {
        slug: 'hard-bounce',
        term: 'Hard Bounce',
        definition: 'An email that has failed to deliver for permanent reasons, such as the recipient address being invalid or the domain name not existing.',
        longDescription: 'A hard bounce is a permanent delivery failure. When an email bounces hard, the receiving server explicitly states that the recipient does not exist or the domain is invalid. Sending emails to addresses that consistently hard bounce will severely damage your sender reputation. Best practices dictate removing hard bounces from your mailing list immediately. ZeroBounce AI detects these invalid addresses before you send, protecting your reputation.',
        relatedTerms: ['soft-bounce', 'bounce-rate', 'email-deliverability']
    },
    {
        slug: 'soft-bounce',
        term: 'Soft Bounce',
        definition: 'An email that has failed to deliver due to temporary reasons, like a full inbox or a temporarily offline server.',
        longDescription: 'Unlike a hard bounce, a soft bounce means the email address is generally valid, but delivery failed for a temporary reason. Common causes include the recipient\'s inbox being full, the message being too large, or the receiving server temporarily declining connections (e.g., due to rate limiting or maintenance). Most email service providers (ESPs) will attempt to resend soft-bounced emails multiple times before giving up.',
        relatedTerms: ['hard-bounce', 'bounce-rate', 'email-deliverability']
    },
    {
        slug: 'catch-all-email',
        term: 'Catch-All Email (Accept-All)',
        definition: 'A server configuration that accepts any email sent to a domain, even if the specific mailbox does not exist.',
        longDescription: 'A catch-all (or accept-all) domain is configured to ensure no emails are lost, catching typoed addresses. While great for the domain owner, it makes email verification very difficult because the server responds to SMTP checks with a "valid" status for every address queried. Traditional verifiers return "unknown" for these. ZeroBounce AI uses advanced AI algorithms and pattern recognition to assign a confidence score to catch-all addresses, predicting their true validity.',
        relatedTerms: ['smtp-check', 'confidence-score', 'email-verification']
    },
    {
        slug: 'spf-record',
        term: 'SPF (Sender Policy Framework)',
        definition: 'An email authentication method that specifies which mail servers are authorized to send email on behalf of your domain.',
        longDescription: 'Sender Policy Framework (SPF) is a DNS record that helps prevent email spoofing. It contains a list of IP addresses and domains that you approve to send emails using your domain name. When an email arrives, the receiving server checks your SPF record. If the email originates from an unauthorized server, it may be marked as spam or rejected. Properly configuring your SPF record is crucial for high email deliverability.',
        relatedTerms: ['dkim', 'dmarc', 'email-deliverability', 'dns-records']
    },
    {
        slug: 'dkim',
        term: 'DKIM (DomainKeys Identified Mail)',
        definition: 'An email authentication technique that allows the receiver to check that an email was indeed sent and authorized by the owner of that domain.',
        longDescription: 'DKIM adds a cryptographic signature to your emails. This signature is linked to a specific domain name using a private key. The receiving email server uses the public key (published in your domain\'s DNS records) to verify the signature. This ensures that the email was not altered in transit and confirms the sender\'s identity, building trust with inbox providers like Gmail and Outlook.',
        relatedTerms: ['spf-record', 'dmarc', 'email-deliverability', 'cryptography']
    },
    {
        slug: 'dmarc',
        term: 'DMARC (Domain-based Message Authentication, Reporting, and Conformance)',
        definition: 'An email authentication protocol that uses SPF and DKIM to provide instructions to the receiving mail server on how to handle emails that fail authentication.',
        longDescription: 'DMARC is the policy layer built on top of SPF and DKIM. It tells receiving servers what to do if an email claims to be from your domain but fails SPF or DKIM checks (e.g., "none" (monitor), "quarantine" (send to spam), or "reject"). DMARC also provides reporting reports back to the domain owner, offering visibility into who is sending email on their behalf, which helps stop phishing and spoofing attacks.',
        relatedTerms: ['spf-record', 'dkim', 'email-spoofing', 'phishing']
    },
    {
        slug: 'bounce-rate',
        term: 'Bounce Rate',
        definition: 'The percentage of emails in a campaign that could not be delivered to the recipient\'s inbox.',
        longDescription: 'Bounce rate is a critical metric in email marketing. It\'s calculated by dividing the total number of bounced emails (hard and soft) by the total number of emails sent. A high bounce rate (typically anything over 2%) signals to Internet Service Providers (ISPs) that your list is outdated or acquired through spammy methods, which damages your sender reputation and causes future emails to go to the spam folder. Routine email verification is the best way to keep your bounce rate low.',
        relatedTerms: ['hard-bounce', 'soft-bounce', 'sender-reputation']
    },
    {
        slug: 'sender-reputation',
        term: 'Sender Reputation',
        definition: 'A score assigned to your IP address and domain by Internet Service Providers (ISPs), measuring your trustworthiness as an email sender.',
        longDescription: 'Sender reputation acts like a credit score for email sending. It is determined by factors like bounce rates, spam complaints, engagement (opens/clicks), spam trap hits, and authentication (SPF, DKIM, DMARC). A good reputation means your emails land in the primary inbox. A bad reputation routes your emails to the spam folder or blocks them entirely. ZeroBounce AI helps protect your sender reputation by removing harmful addresses from your lists.',
        relatedTerms: ['bounce-rate', 'spam-trap', 'email-deliverability', 'inbox-placement']
    },
    {
        slug: 'spam-trap',
        term: 'Spam Trap (Honeypot)',
        definition: 'An email address used by ISPs and anti-spam organizations to identify spammers and block their emails.',
        longDescription: 'Spam traps are email addresses that are either created specifically to catch spammers (pristine traps) or are old, abandoned addresses that have been repurposed (recycled traps). Because these addresses are not used by real people, they should never receive legitimate marketing emails. Hitting a spam trap severely damages your sender reputation and can lead to immediate blacklisting. ZeroBounce AI utilizes extensive databases and proprietary algorithms to detect and remove known spam traps from your lists.',
        relatedTerms: ['sender-reputation', 'blacklist', 'email-hygiene']
    },
    {
        slug: 'email-deliverability',
        term: 'Email Deliverability',
        definition: 'The ability to successfully deliver an email to a recipient\'s inbox, avoiding the spam folder or blocklists.',
        longDescription: 'Email deliverability encompasses the entire process of getting your email from your outbox to the subscriber\'s primary inbox. It is distinct from email delivery (which just means the server accepted the message). Good deliverability requires a strong sender reputation, clean email lists, proper technical authentication (SPF/DKIM/DMARC), relevant content, and engaged subscribers.',
        relatedTerms: ['sender-reputation', 'inbox-placement', 'bounce-rate']
    },
    {
        slug: 'disposable-email',
        term: 'Disposable Email Address (DEA)',
        definition: 'A temporary, throwaway email address designed to self-destruct after a short period, often used to bypass registration forms.',
        longDescription: 'Services like 10MinuteMail or TempMail provide users with disposable emails. Users employ them to receive confirmation links or download gated content without giving up their real address to avoid future marketing emails. For marketers, DEAs are problematic because they quickly turn into hard bounces, skew engagement metrics, and waste resources. ZeroBounce AI identifies and removes disposable emails from your lists.',
        relatedTerms: ['hard-bounce', 'email-verification', 'lead-generation']
    },
    {
        slug: 'role-based-email',
        term: 'Role-Based Email',
        definition: 'An email address associated with a specific position, department, or function within an organization, rather than a specific individual (e.g., info@, sales@, support@).',
        longDescription: 'Role-based addresses are usually managed by multiple people or route to ticketing systems. Sending unsolicited marketing emails to role-based addresses often results in low engagement and high spam complaint rates, as no single person opted in. Many ESPs block imports containing role-based addresses. While they are technically valid emails, it is generally recommended to exclude them from cold outreach campaigns.',
        relatedTerms: ['email-deliverability', 'b2b-marketing', 'email-verification']
    },
    {
        slug: 'smtp',
        term: 'SMTP (Simple Mail Transfer Protocol)',
        definition: 'The standard protocol used on the internet for sending and routing email between mail servers.',
        longDescription: 'SMTP is the foundation of email transmission. When you send an email, your email client uses SMTP to communicate with your mail server, which in turn uses SMTP to communicate with the recipient\'s mail server. In the context of email verification, tools like ZeroBounce AI "ping" the recipient\'s SMTP server, initiating a conversation to ask if heavily the mailbox exists, without actually sending an email.',
        relatedTerms: ['email-verification', 'soft-bounce', 'hard-bounce']
    },
    {
        slug: 'blacklist',
        term: 'Email Blacklist (Blocklist)',
        definition: 'A real-time list of IP addresses or domains identified as sources of spam, used by email providers to block incoming messages.',
        longDescription: 'Organizations like Spamhaus and Barracuda maintain widely used blocklists. If your IP or domain ends up on one of these lists, your emails will be blocked by many major inbox providers until you resolve the issue and request delisting. Blacklisting usually happens due to high spam complaints, hitting spam traps, or a compromised sending server. Regular list cleaning is essential to avoid blacklists.',
        relatedTerms: ['spam-trap', 'sender-reputation', 'email-deliverability']
    },
    {
        slug: 'greylisting',
        term: 'Greylisting',
        definition: 'An anti-spam technique where a receiving mail server temporarily rejects emails from unrecognized senders, asking them to try again later.',
        longDescription: 'When a receiving server employs greylisting, it temporarily rejects an email with a 4xx "try again later" response. Legitimate mail servers are designed to retry delivery after a delay (typically 15 minutes to an hour). Spammer software, often optimized for speed, usually does not retry. Thus, greylisting effectively blocks a significant amount of spam without permanent loss of legitimate mail. For email verifiers, greylisting can cause verification delays.',
        relatedTerms: ['smtp', 'soft-bounce', 'anti-spam']
    },
    {
        slug: 'mx-record',
        term: 'MX Record (Mail Exchanger Record)',
        definition: 'A type of DNS record that specifies the mail server responsible for accepting email messages on behalf of a recipient\'s domain.',
        longDescription: 'MX records are how the internet knows where to route emails addressed to a specific domain. A domain can have multiple MX records with different priorities. The first step in email verification is checking if the domain has valid MX records. If it doesn\'t, the domain cannot receive email, and any addresses on that domain are immediately marked as invalid.',
        relatedTerms: ['dns-records', 'smtp', 'email-verification']
    },
    {
        slug: 'double-opt-in',
        term: 'Double Opt-In (Confirmed Opt-In)',
        definition: 'A subscription process requiring a new subscriber to verify their email address by clicking a link sent in a confirmation email before being added to the list.',
        longDescription: 'Double opt-in is the gold standard for building a high-quality, engaged email list. It prevents fake signups, typos, and malicious bots from injecting unverified or harmful addresses (like spam traps) into your database. By ensuring the owner of the email address actively confirms their subscription, you protect your sender reputation and improve deliverability.',
        relatedTerms: ['single-opt-in', 'email-hygiene', 'spam-trap']
    },
    {
        slug: 'single-opt-in',
        term: 'Single Opt-In',
        definition: 'A subscription process where a user is added to an email list immediately after submitting their email address on a form, without requiring confirmation.',
        longDescription: 'While single opt-in creates a frictionless signup process and typically results in list growth faster than double opt-in, it comes with risks. It leaves lists vulnerable to typos, fake emails, and malicious bot submissions. Without verification at the point of capture, single opt-in lists generally require more frequent and rigorous cleaning using tools like ZeroBounce AI to maintain quality and protect sender reputation.',
        relatedTerms: ['double-opt-in', 'email-hygiene', 'bounce-rate']
    },
    {
        slug: 'email-warm-up',
        term: 'Email Warm-Up',
        definition: 'The process of gradually increasing the volume of emails sent from a new IP address or domain to establish a positive sender reputation with ISPs.',
        longDescription: 'When you start sending from a new IP or domain, ISPs view you with suspicion because you have no history. If you suddenly send thousands of emails, they will likely be blocked or marked as spam. IP warming involves starting with a small sending volume and incrementally increasing it over days or weeks while maintaining high engagement and low complain rates. This demonstrates that you are a legitimate sender.',
        relatedTerms: ['sender-reputation', 'email-deliverability', 'inbox-placement']
    },
    {
        slug: 'inbox-placement',
        term: 'Inbox Placement Rate (IPR)',
        definition: 'The percentage of emails that are delivered successfully to the recipient\'s primary inbox, as opposed to the spam or promotions folder.',
        longDescription: 'While standard "delivery rate" only cares if the server accepted the email, inbox placement measures where it actually ended up. Low inbox placement severely hampers campaign performance. Achieving high inbox placement requires authentication, a stellar sender reputation, highly relevant content, and regular list cleaning to remove unengaged and invalid addresses.',
        relatedTerms: ['email-deliverability', 'sender-reputation', 'spam-trap']
    }
]

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
    return glossaryTerms.find(t => t.slug === slug)
}

export function getAllGlossarySlugs(): string[] {
    return glossaryTerms.map(t => t.slug)
}
