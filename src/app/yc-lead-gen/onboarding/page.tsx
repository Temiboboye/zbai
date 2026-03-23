'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../page.module.css';

export default function YCOnboardingPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        companyName: '',
        companyWebsite: '',
        productDescription: '',
        targetTitles: '',
        targetIndustries: '',
        targetCompanySize: '',
        targetGeography: '',
        existingCustomers: '',
        competitors: '',
        valueProposition: '',
        additionalNotes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/crm/service-onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    sessionId,
                    service: 'yc_lead_gen',
                }),
            });

            if (!response.ok) throw new Error('Failed to submit');
            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again or email us at support@zerobounceai.com');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className={styles.container}>
                <section className={styles.heroSection} style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
                    <h1 className={styles.heroTitle} style={{ fontSize: '3rem' }}>
                        You&apos;re All <span className="text-gradient">Set!</span>
                    </h1>
                    <p className={styles.heroSubtitle} style={{ fontSize: '1.25rem' }}>
                        We&apos;ve received your campaign details. Our team will start building your outbound engine within 24 hours.
                    </p>
                    <div style={{
                        maxWidth: '600px',
                        margin: '2rem auto',
                        padding: '2rem',
                        borderRadius: '16px',
                        background: 'var(--dark)',
                        border: '1px solid var(--surface-border)',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--green)' }}>What happens next:</h3>
                        <ol style={{ color: 'var(--gray-400)', lineHeight: '2', paddingLeft: '1.25rem' }}>
                            <li>We review your ICP and start building your lead list (24 hrs)</li>
                            <li>Your dedicated sending domain is set up (24 hrs)</li>
                            <li>Email warmup begins (2 weeks)</li>
                            <li>Cold sequences are written and loaded for your approval</li>
                            <li>Campaign goes live — meetings start flowing in</li>
                        </ol>
                    </div>
                    <p style={{ color: 'var(--gray-400)', marginTop: '1rem' }}>
                        Questions? Email us anytime at <a href="mailto:support@zerobounceai.com" style={{ color: 'var(--green)' }}>support@zerobounceai.com</a>
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <section className={styles.heroSection} style={{ paddingBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h1 className={styles.heroTitle} style={{ fontSize: '2.5rem' }}>
                    Payment <span className="text-gradient">Confirmed!</span>
                </h1>
                <p className={styles.heroSubtitle} style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                    Fill in the details below so we can start building your outbound engine right away.
                </p>
            </section>

            <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem 6rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* About You */}
                    <fieldset style={{ border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '2rem', background: 'var(--dark)' }}>
                        <legend style={{ color: 'var(--green)', fontWeight: '600', fontSize: '1.1rem', padding: '0 0.5rem' }}>About You</legend>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <label style={labelStyle}>
                                Full Name *
                                <input name="fullName" value={form.fullName} onChange={handleChange} required style={inputStyle} placeholder="e.g. Temi Boboye" />
                            </label>
                            <label style={labelStyle}>
                                Email *
                                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@company.com" />
                            </label>
                            <label style={labelStyle}>
                                Company Name *
                                <input name="companyName" value={form.companyName} onChange={handleChange} required style={inputStyle} placeholder="e.g. ZeroBounce AI" />
                            </label>
                            <label style={labelStyle}>
                                Company Website *
                                <input name="companyWebsite" value={form.companyWebsite} onChange={handleChange} required style={inputStyle} placeholder="https://yourcompany.com" />
                            </label>
                        </div>
                    </fieldset>

                    {/* Your Product */}
                    <fieldset style={{ border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '2rem', background: 'var(--dark)' }}>
                        <legend style={{ color: 'var(--green)', fontWeight: '600', fontSize: '1.1rem', padding: '0 0.5rem' }}>Your Product</legend>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <label style={labelStyle}>
                                What does your product/service do? *
                                <textarea name="productDescription" value={form.productDescription} onChange={handleChange} required style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Describe what you sell in 2-3 sentences. What problem does it solve?" />
                            </label>
                            <label style={labelStyle}>
                                What makes you different from competitors?
                                <textarea name="valueProposition" value={form.valueProposition} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Your unique value proposition — why should prospects choose you?" />
                            </label>
                            <label style={labelStyle}>
                                Who are your competitors? (optional)
                                <input name="competitors" value={form.competitors} onChange={handleChange} style={inputStyle} placeholder="e.g. NeverBounce, Hunter.io, ZeroBounce" />
                            </label>
                        </div>
                    </fieldset>

                    {/* Target Customer */}
                    <fieldset style={{ border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '2rem', background: 'var(--dark)' }}>
                        <legend style={{ color: 'var(--green)', fontWeight: '600', fontSize: '1.1rem', padding: '0 0.5rem' }}>Ideal Customer Profile (ICP)</legend>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <label style={labelStyle}>
                                Target Job Titles *
                                <input name="targetTitles" value={form.targetTitles} onChange={handleChange} required style={inputStyle} placeholder="e.g. VP Sales, Head of Growth, CTO, Founders" />
                            </label>
                            <label style={labelStyle}>
                                Target Industries *
                                <input name="targetIndustries" value={form.targetIndustries} onChange={handleChange} required style={inputStyle} placeholder="e.g. SaaS, Fintech, E-commerce, Healthcare" />
                            </label>
                            <label style={labelStyle}>
                                Target Company Size
                                <select name="targetCompanySize" value={form.targetCompanySize} onChange={handleChange} style={inputStyle}>
                                    <option value="">Select company size</option>
                                    <option value="1-10">1-10 employees (Startups)</option>
                                    <option value="11-50">11-50 employees (Seed/Series A)</option>
                                    <option value="51-200">51-200 employees (Series A/B)</option>
                                    <option value="201-1000">201-1,000 employees (Mid-market)</option>
                                    <option value="1000+">1,000+ employees (Enterprise)</option>
                                    <option value="any">Any size</option>
                                </select>
                            </label>
                            <label style={labelStyle}>
                                Target Geography
                                <input name="targetGeography" value={form.targetGeography} onChange={handleChange} style={inputStyle} placeholder="e.g. US only, North America, Global" />
                            </label>
                            <label style={labelStyle}>
                                Can you name 3-5 existing customers or companies who are a perfect fit?
                                <textarea name="existingCustomers" value={form.existingCustomers} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="e.g. Stripe, Notion, Linear — companies that are similar to your best customers" />
                            </label>
                        </div>
                    </fieldset>

                    {/* Additional */}
                    <fieldset style={{ border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '2rem', background: 'var(--dark)' }}>
                        <legend style={{ color: 'var(--green)', fontWeight: '600', fontSize: '1.1rem', padding: '0 0.5rem' }}>Anything Else?</legend>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <label style={labelStyle}>
                                Additional notes, links, or context
                                <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Anything else we should know — existing outbound efforts, calendar booking link, Slack channel for updates, etc." />
                            </label>
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-green"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem' }}
                    >
                        {loading ? 'Submitting...' : 'Submit & Start My Campaign 🚀'}
                    </button>

                    <p style={{ color: 'var(--gray-400)', textAlign: 'center', fontSize: '0.9rem' }}>
                        We&apos;ll review your details and begin building within 24 hours.
                    </p>
                </form>
            </section>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    color: '#ccc',
    fontSize: '0.95rem',
    fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--surface-border)',
    background: 'var(--black)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
};
