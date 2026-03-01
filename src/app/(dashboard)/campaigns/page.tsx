'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

interface Lead {
    id: number;
    name: string | null;
    email: string;
    company: string | null;
    status: string;
}

interface CampaignRecord {
    id: number;
    name: string;
    template_category: string | null;
    template_name: string | null;
    subject: string;
    recipient_count: number;
    status: string;
    created_at: string;
}

interface Template {
    category: string;
    name: string;
    subject: string;
    body: string;
    variables: string[];
}

const TEMPLATES: Template[] = [
    {
        category: 'SaaS',
        name: 'Initial Outreach',
        subject: "Quick question about {{company}}'s email deliverability",
        body: `Hi {{first_name}},

I noticed {{company}} recently {{trigger_event}} - congrats!

Quick question: are you seeing bounce rates above 3-5% on your email campaigns?

Most SaaS companies we work with lose 5-8% of their emails to bounces, which damages sender reputation and costs real revenue.

We built ZeroBounce AI to solve this - our AI-powered verification hits 98%+ accuracy (vs. 92-95% for traditional tools) and includes confidence scoring for catch-all domains.

Try our free tools → {{signup_link}}

No credit card required. See results in 2 minutes.

Best,
{{your_name}}`,
        variables: ['first_name', 'company', 'trigger_event', 'signup_link', 'your_name'],
    },
    {
        category: 'SaaS',
        name: 'Follow Up - Case Study',
        subject: 'How {{similar_company}} reduced bounces by 94%',
        body: `Hi {{first_name}},

Following up on my last message. Wanted to share a quick case study:

{{similar_company}} was dealing with 8% bounce rates that were killing their Gmail deliverability. After switching to ZeroBounce AI:

- Bounce rate dropped from 8% to 0.4%
- Gmail inbox placement improved from 62% to 91%
- Revenue increased 34% due to better deliverability

Would it be worth a quick 10-minute chat to see if we can do the same for {{company}}?

Best,
{{your_name}}`,
        variables: ['first_name', 'company', 'similar_company', 'your_name'],
    },
    {
        category: 'Agencies',
        name: 'Agency Outreach',
        subject: 'Save $200+/mo on email tools for {{agency_name}}',
        body: `Hi {{first_name}},

I see {{agency_name}} does email marketing for clients. Quick question:

Are you paying separately for email verification AND email finding? Most agencies spend $200-400/mo on tools like Hunter ($99) + ZeroBounce ($120+).

We built ZeroBounce AI as an all-in-one platform:
- Email verification (98%+ accuracy)
- Email finder
- Bulk email sorter
- AI confidence scoring for catch-all domains

All in one tool, one bill. Most agencies save $200+/mo.

Want me to show you a 2-minute demo?

Best,
{{your_name}}`,
        variables: ['first_name', 'agency_name', 'your_name'],
    },
    {
        category: 'Agencies',
        name: 'Agency ROI Calculator',
        subject: 'Your {{agency_name}} email verification ROI',
        body: 'Hi {{first_name}},\n\nI put together some numbers for {{agency_name}}:\n\nIf you\'re verifying {{monthly_volume}} emails/month:\n- Current cost (estimated): ${{current_cost}}/mo\n- ZeroBounce AI cost: ${{our_cost}}/mo\n- Annual savings: ${{annual_savings}}\n\nPlus you get features competitors charge extra for:\n- AI confidence scoring (catch-all domains)\n- Email pattern recognition\n- Built-in email finder\n\nWant me to walk through the numbers?\n\nBest,\n{{your_name}}',
        variables: ['first_name', 'agency_name', 'monthly_volume', 'current_cost', 'our_cost', 'annual_savings', 'your_name'],
    },
    {
        category: 'Ecommerce',
        name: 'Ecommerce Outreach',
        subject: 'Your {{company}} emails might be going to spam',
        body: `Hi {{first_name}},

I noticed {{company}} sends regular marketing emails to customers. Here's something that might surprise you:

If your email list has more than 3% invalid addresses, Gmail and Outlook will start routing ALL your emails to spam - even to valid subscribers.

Most e-commerce brands we've audited have 8-12% invalid emails in their list.

ZeroBounce AI can clean your list in minutes with 98%+ accuracy. We've helped brands like yours increase inbox placement from 62% to 91%.

Want me to run a quick free audit on a sample of your list?

Best,
{{your_name}}`,
        variables: ['first_name', 'company', 'your_name'],
    },
];

const CATEGORIES = ['SaaS', 'Agencies', 'Ecommerce'];

export default function CampaignsPage() {
    const { token } = useAuth();
    const [step, setStep] = useState<'select' | 'customize' | 'recipients' | 'review'>('select');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [activeCategory, setActiveCategory] = useState('SaaS');
    const [campaignName, setCampaignName] = useState('');

    // Recipients
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);

    // Campaigns history
    const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const headers = useCallback(() => ({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }), [token]);

    const fetchCampaigns = useCallback(async () => {
        try {
            const res = await fetch('/api/crm/campaigns', { headers: headers() });
            if (res.ok) setCampaigns(await res.json());
        } catch (e) { console.error(e); }
    }, [headers]);

    const fetchLeads = useCallback(async () => {
        try {
            const res = await fetch('/api/crm/leads?limit=500', { headers: headers() });
            if (res.ok) setLeads(await res.json());
        } catch (e) { console.error(e); }
    }, [headers]);

    useEffect(() => {
        if (token) { fetchCampaigns(); fetchLeads(); }
    }, [token, fetchCampaigns, fetchLeads]);

    const handleSelectTemplate = (t: Template) => {
        setSelectedTemplate(t);
        const vars: Record<string, string> = {};
        t.variables.forEach(v => { vars[v] = ''; });
        setVariables(vars);
        setCampaignName(`${t.category} - ${t.name}`);
        setStep('customize');
    };

    const getPreviewBody = () => {
        if (!selectedTemplate) return '';
        let text = selectedTemplate.body;
        for (const [key, val] of Object.entries(variables)) {
            text = text.replaceAll(`{{${key}}}`, val || `{{${key}}}`);
        }
        return text;
    };

    const getPreviewSubject = () => {
        if (!selectedTemplate) return '';
        let text = selectedTemplate.subject;
        for (const [key, val] of Object.entries(variables)) {
            text = text.replaceAll(`{{${key}}}`, val || `{{${key}}}`);
        }
        return text;
    };

    const toggleLead = (id: number) => {
        setSelectedLeadIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAllLeads = () => {
        if (selectedLeadIds.length === leads.length) {
            setSelectedLeadIds([]);
        } else {
            setSelectedLeadIds(leads.map(l => l.id));
        }
    };

    const handleSend = async () => {
        if (!selectedTemplate) return;
        setLoading(true);
        try {
            await fetch('/api/crm/campaigns', {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({
                    name: campaignName,
                    template_category: selectedTemplate.category,
                    template_name: selectedTemplate.name,
                    subject: getPreviewSubject(),
                    body: getPreviewBody(),
                    recipient_ids: selectedLeadIds,
                }),
            });
            setStep('select');
            setSelectedTemplate(null);
            setSelectedLeadIds([]);
            fetchCampaigns();
            fetchLeads();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Email Campaigns</h1>
                    <p className={styles.subtitle}>Create and send email campaigns using templates</p>
                </div>
            </div>

            {/* Step Indicator */}
            {step !== 'select' && (
                <div className={styles.steps}>
                    {(['select', 'customize', 'recipients', 'review'] as const).map((s, i) => (
                        <div
                            key={s}
                            className={`${styles.step} ${step === s ? styles.stepActive : ''} ${(['select', 'customize', 'recipients', 'review'].indexOf(step) > i) ? styles.stepDone : ''}`}
                        >
                            <span className={styles.stepNum}>{i + 1}</span>
                            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Step 1: Template Selection */}
            {step === 'select' && (
                <>
                    <div className={styles.categoryTabs}>
                        {CATEGORIES.map(c => (
                            <button
                                key={c}
                                className={`${styles.categoryTab} ${activeCategory === c ? styles.categoryTabActive : ''}`}
                                onClick={() => setActiveCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className={styles.templateGrid}>
                        {TEMPLATES.filter(t => t.category === activeCategory).map((t, idx) => (
                            <div key={idx} className={styles.templateCard} onClick={() => handleSelectTemplate(t)}>
                                <h3>{t.name}</h3>
                                <p className={styles.templateSubject}>{t.subject}</p>
                                <p className={styles.templatePreview}>{t.body.substring(0, 120)}...</p>
                                <div className={styles.templateVars}>
                                    {t.variables.map(v => (
                                        <span key={v} className={styles.varTag}>{`{{${v}}}`}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Campaign History */}
                    {campaigns.length > 0 && (
                        <div className={styles.historySection}>
                            <h2>Campaign History</h2>
                            <div className={styles.historyTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Campaign</th>
                                            <th>Template</th>
                                            <th>Recipients</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.map(c => (
                                            <tr key={c.id}>
                                                <td className={styles.campaignName}>{c.name}</td>
                                                <td>{c.template_name || '—'}</td>
                                                <td>{c.recipient_count}</td>
                                                <td>
                                                    <span className={styles.statusBadge}>{c.status}</span>
                                                </td>
                                                <td className={styles.dateCell}>
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Step 2: Customize Variables */}
            {step === 'customize' && selectedTemplate && (
                <div className={styles.customizeLayout}>
                    <div className={styles.variablesPanel}>
                        <h3>Variables</h3>
                        <div className={styles.formGroup}>
                            <label>Campaign Name</label>
                            <input value={campaignName} onChange={e => setCampaignName(e.target.value)} />
                        </div>
                        {selectedTemplate.variables.map(v => (
                            <div key={v} className={styles.formGroup}>
                                <label>{`{{${v}}}`}</label>
                                <input
                                    value={variables[v] || ''}
                                    onChange={e => setVariables({ ...variables, [v]: e.target.value })}
                                    placeholder={v.replace(/_/g, ' ')}
                                />
                            </div>
                        ))}
                        <div className={styles.stepActions}>
                            <button onClick={() => setStep('select')} className={styles.btnOutline}>← Back</button>
                            <button onClick={() => setStep('recipients')} className={styles.btnPrimary}>Next →</button>
                        </div>
                    </div>
                    <div className={styles.previewPanel}>
                        <h3>Preview</h3>
                        <div className={styles.emailPreview}>
                            <div className={styles.previewSubject}>
                                <strong>Subject:</strong> {getPreviewSubject()}
                            </div>
                            <div className={styles.previewBody}>
                                {getPreviewBody()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Select Recipients */}
            {step === 'recipients' && (
                <div className={styles.recipientsPanel}>
                    <div className={styles.recipientsHeader}>
                        <h3>Select Recipients ({selectedLeadIds.length} selected)</h3>
                        <button onClick={selectAllLeads} className={styles.btnOutline}>
                            {selectedLeadIds.length === leads.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>

                    {leads.length === 0 ? (
                        <p className={styles.emptyLeads}>No leads found. <a href="/crm">Add leads in CRM</a> first.</p>
                    ) : (
                        <div className={styles.leadsList}>
                            {leads.map(lead => (
                                <div
                                    key={lead.id}
                                    className={`${styles.leadItem} ${selectedLeadIds.includes(lead.id) ? styles.leadItemSelected : ''}`}
                                    onClick={() => toggleLead(lead.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedLeadIds.includes(lead.id)}
                                        onChange={() => toggleLead(lead.id)}
                                    />
                                    <div>
                                        <strong>{lead.name || lead.email}</strong>
                                        {lead.name && <span className={styles.leadEmail}>{lead.email}</span>}
                                        {lead.company && <span className={styles.leadCompany}>@ {lead.company}</span>}
                                    </div>
                                    <span className={styles.leadStatus} data-status={lead.status}>{lead.status}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.stepActions}>
                        <button onClick={() => setStep('customize')} className={styles.btnOutline}>← Back</button>
                        <button onClick={() => setStep('review')} className={styles.btnPrimary} disabled={selectedLeadIds.length === 0}>
                            Review →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Review & Send */}
            {step === 'review' && selectedTemplate && (
                <div className={styles.reviewPanel}>
                    <h3>Review Campaign</h3>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <label>Campaign Name</label>
                            <p>{campaignName}</p>
                        </div>
                        <div className={styles.reviewItem}>
                            <label>Template</label>
                            <p>{selectedTemplate.category} → {selectedTemplate.name}</p>
                        </div>
                        <div className={styles.reviewItem}>
                            <label>Recipients</label>
                            <p>{selectedLeadIds.length} leads</p>
                        </div>
                        <div className={styles.reviewItem}>
                            <label>Subject</label>
                            <p>{getPreviewSubject()}</p>
                        </div>
                    </div>

                    <div className={styles.previewPanel}>
                        <h4>Email Preview</h4>
                        <div className={styles.emailPreview}>
                            <div className={styles.previewBody}>{getPreviewBody()}</div>
                        </div>
                    </div>

                    <div className={styles.stepActions}>
                        <button onClick={() => setStep('recipients')} className={styles.btnOutline}>← Back</button>
                        <button onClick={handleSend} className={styles.btnSend} disabled={loading}>
                            {loading ? 'Sending...' : `Send to ${selectedLeadIds.length} recipients`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
