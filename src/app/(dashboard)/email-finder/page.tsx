'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import styles from './page.module.css';
import { useCredits } from '@/contexts/CreditContext';

interface EmailResult {
    full_name: string;
    domain: string;
    email: string | null;
    email_candidates: string[];
    confidence: string;
    method: string | null;
    domain_valid: boolean;
    verified: boolean;
    error?: string;
    original?: any;
}

interface FinderResult {
    results: EmailResult[];
    summary: {
        total: number;
        found: number;
        verified: number;
        high_confidence: number;
        credits_used: number;
    };
}

export default function EmailFinderPage() {
    const { balance, deductCredits } = useCredits();

    // Input modes
    const [mode, setMode] = useState<'single' | 'csv'>('single');

    // Single mode
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [verify, setVerify] = useState(false);

    // CSV mode
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any[]>([]);
    const [nameColumn, setNameColumn] = useState('');
    const [domainColumn, setDomainColumn] = useState('');
    const [columns, setColumns] = useState<string[]>([]);

    // Results
    const [loading, setLoading] = useState(false);
    const [singleResult, setSingleResult] = useState<EmailResult | null>(null);
    const [bulkResults, setBulkResults] = useState<FinderResult | null>(null);

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvFile(file);

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                if (results.data.length > 0) {
                    const cols = Object.keys(results.data[0] as object);
                    setColumns(cols);
                    setCsvData(results.data);

                    // Auto-detect columns
                    const nameCandidates = ['name', 'full_name', 'fullname', 'founder', 'founder_name', 'person', 'contact'];
                    const domainCandidates = ['domain', 'website', 'company_website', 'url', 'company_domain', 'company'];

                    for (const col of cols) {
                        const lowerCol = col.toLowerCase();
                        if (nameCandidates.some(n => lowerCol.includes(n)) && !nameColumn) {
                            setNameColumn(col);
                        }
                        if (domainCandidates.some(d => lowerCol.includes(d)) && !domainColumn) {
                            setDomainColumn(col);
                        }
                    }
                }
            },
            skipEmptyLines: true
        });
    };

    // Find single email
    const findSingleEmail = async () => {
        if (!name || !domain) {
            alert('Please enter both name and domain');
            return;
        }

        const creditsNeeded = verify ? 2 : 1;
        if (balance < creditsNeeded) {
            alert(`Insufficient credits. Need ${creditsNeeded}`);
            return;
        }

        setLoading(true);
        setSingleResult(null);

        try {
            const res = await fetch('/api/email-finder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, domain, verify })
            });

            if (!res.ok) throw new Error('Failed to find email');

            const data = await res.json();
            setSingleResult(data);
            deductCredits(creditsNeeded);
        } catch (error) {
            console.error(error);
            alert('Error finding email');
        } finally {
            setLoading(false);
        }
    };

    // Find bulk emails
    const findBulkEmails = async () => {
        if (!csvData.length || !nameColumn || !domainColumn) {
            alert('Please upload a CSV and select the name and domain columns');
            return;
        }

        const entries = csvData
            .filter(row => row[nameColumn] && row[domainColumn])
            .map(row => ({
                name: row[nameColumn],
                domain: row[domainColumn],
                ...row // Include all original data
            }));

        if (entries.length === 0) {
            alert('No valid entries found');
            return;
        }

        const creditsNeeded = entries.length * (verify ? 2 : 1);
        if (balance < creditsNeeded) {
            alert(`Insufficient credits. Need ${creditsNeeded}`);
            return;
        }

        setLoading(true);
        setBulkResults(null);

        try {
            const res = await fetch('/api/email-finder/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries, verify })
            });

            if (!res.ok) throw new Error('Failed to find emails');

            const data = await res.json();
            setBulkResults(data);
            deductCredits(creditsNeeded);
        } catch (error) {
            console.error(error);
            alert('Error finding emails');
        } finally {
            setLoading(false);
        }
    };

    // Download results as CSV
    const downloadResults = () => {
        if (!bulkResults) return;

        const csv = [
            'Name,Domain,Email,Confidence,Candidates,Verified',
            ...bulkResults.results.map(r =>
                `"${r.full_name}","${r.domain}","${r.email || ''}","${r.confidence}","${r.email_candidates?.join('; ') || ''}","${r.verified}"`
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'found_emails.csv';
        a.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Email Finder</h1>
                <p>Find email addresses from names and company domains</p>
            </div>

            {/* Mode Toggle */}
            <div className={styles.modeToggle}>
                <button
                    className={`${styles.modeBtn} ${mode === 'single' ? styles.active : ''}`}
                    onClick={() => setMode('single')}
                >
                    🔍 Single Lookup
                </button>
                <button
                    className={`${styles.modeBtn} ${mode === 'csv' ? styles.active : ''}`}
                    onClick={() => setMode('csv')}
                >
                    📁 CSV Import
                </button>
            </div>

            {/* Single Lookup Mode */}
            {mode === 'single' && (
                <div className={styles.card}>
                    <h3>Find Email Address</h3>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Smith"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Company Domain</label>
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="company.com"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="verify"
                            checked={verify}
                            onChange={(e) => setVerify(e.target.checked)}
                        />
                        <label htmlFor="verify">Verify email with SMTP (+1 credit)</label>
                    </div>
                    <div className={styles.actionRow}>
                        <span className={styles.cost}>Cost: {verify ? '2' : '1'} credits</span>
                        <button
                            className="btn btn-primary"
                            onClick={findSingleEmail}
                            disabled={loading || !name || !domain}
                        >
                            {loading ? 'Finding...' : 'Find Email'}
                        </button>
                    </div>

                    {/* Single Result */}
                    {singleResult && (
                        <div className={styles.resultCard}>
                            <h4>Result</h4>
                            {singleResult.email ? (
                                <>
                                    <div className={styles.mainEmail}>
                                        <span className={styles.emailIcon}>📧</span>
                                        <strong>{singleResult.email}</strong>
                                        <span className={`${styles.badge} ${styles[singleResult.confidence]}`}>
                                            {singleResult.confidence}
                                        </span>
                                    </div>
                                    {singleResult.verified && (
                                        <div className={styles.verifiedBadge}>✅ Email Verified</div>
                                    )}
                                    {singleResult.email_candidates?.length > 1 && (
                                        <div className={styles.candidates}>
                                            <strong>Alternative patterns:</strong>
                                            <ul>
                                                {singleResult.email_candidates.slice(1).map((email, i) => (
                                                    <li key={i}>{email}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.notFound}>
                                    ❌ Could not find email: {singleResult.error || 'Unknown error'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* CSV Import Mode */}
            {mode === 'csv' && (
                <div className={styles.card}>
                    <h3>Import from CSV</h3>

                    {/* File Upload */}
                    <div className={styles.uploadArea}>
                        {!csvFile ? (
                            <label className={styles.dropzone}>
                                <input
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <div className={styles.uploadIcon}>📁</div>
                                <div>Drag & drop or click to upload CSV</div>
                                <small>File should have name and domain columns</small>
                            </label>
                        ) : (
                            <div className={styles.fileLoaded}>
                                <span>✅ {csvFile.name}</span>
                                <span>{csvData.length} rows loaded</span>
                                <button onClick={() => { setCsvFile(null); setCsvData([]); setColumns([]); }}>
                                    ✖ Clear
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Column Selection */}
                    {columns.length > 0 && (
                        <div className={styles.columnSelection}>
                            <div className={styles.inputGroup}>
                                <label>Name Column</label>
                                <select
                                    value={nameColumn}
                                    onChange={(e) => setNameColumn(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">Select column...</option>
                                    {columns.map(col => (
                                        <option key={col} value={col}>{col}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Domain/Website Column</label>
                                <select
                                    value={domainColumn}
                                    onChange={(e) => setDomainColumn(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">Select column...</option>
                                    {columns.map(col => (
                                        <option key={col} value={col}>{col}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Options */}
                    {csvData.length > 0 && nameColumn && domainColumn && (
                        <>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="verifyBulk"
                                    checked={verify}
                                    onChange={(e) => setVerify(e.target.checked)}
                                />
                                <label htmlFor="verifyBulk">Verify emails with SMTP (+1 credit each)</label>
                            </div>
                            <div className={styles.actionRow}>
                                <span className={styles.cost}>
                                    Cost: {csvData.length * (verify ? 2 : 1)} credits for {csvData.length} rows
                                </span>
                                <button
                                    className="btn btn-primary"
                                    onClick={findBulkEmails}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : `Find ${csvData.length} Emails`}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Bulk Results */}
            {bulkResults && (
                <div className={styles.resultsSection}>
                    {/* Summary */}
                    <div className={styles.summaryCard}>
                        <h3>📊 Results Summary</h3>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue}>{bulkResults.summary.total}</div>
                                <div className={styles.summaryLabel}>Total</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue}>{bulkResults.summary.found}</div>
                                <div className={styles.summaryLabel}>Found</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue}>{bulkResults.summary.verified}</div>
                                <div className={styles.summaryLabel}>Verified</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue}>{bulkResults.summary.high_confidence}</div>
                                <div className={styles.summaryLabel}>High Conf.</div>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <div className={styles.downloadRow}>
                        <button className="btn btn-primary" onClick={downloadResults}>
                            📥 Download Results CSV
                        </button>
                    </div>

                    {/* Results Table */}
                    <div className={styles.tableCard}>
                        <table className={styles.resultTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Domain</th>
                                    <th>Email</th>
                                    <th>Confidence</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bulkResults.results.map((result, i) => (
                                    <tr key={i}>
                                        <td>{result.full_name}</td>
                                        <td>{result.domain}</td>
                                        <td className={styles.emailCell}>
                                            {result.email || <span className={styles.notFound}>—</span>}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[result.confidence] || ''}`}>
                                                {result.confidence}
                                            </span>
                                        </td>
                                        <td>
                                            {result.verified ? (
                                                <span className={styles.verified}>✅ Verified</span>
                                            ) : result.email ? (
                                                <span className={styles.pattern}>🎯 Pattern</span>
                                            ) : (
                                                <span className={styles.failed}>❌ Failed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
