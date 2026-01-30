'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import { useCredits } from '@/contexts/CreditContext';
import Papa from 'papaparse';

interface BulkJob {
    job_id: string;
    status: string;
    total_emails: number;
    processed: number;
    created_at: string;
}

interface VerificationResult {
    email: string;
    final_status: string;
    safety_score: number;
}

export default function BulkPage() {
    // State
    const [mode, setMode] = useState<'paste' | 'upload'>('upload');
    const [emails, setEmails] = useState('');
    const [parsedFile, setParsedFile] = useState<{ name: string; count: number; data: string[] } | null>(null);
    const [activeJob, setActiveJob] = useState<BulkJob | null>(null);
    const [results, setResults] = useState<VerificationResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'valid' | 'invalid' | 'catchall'>('valid');
    const [isDragging, setIsDragging] = useState(false);

    // Hooks
    const { balance, deductCredits } = useCredits();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // -- File Handling --
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        // Handle plain text files (one email per line)
        if (fileExtension === 'txt') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (!text) {
                    alert('Could not read file.');
                    return;
                }

                // Split by newlines and filter for valid emails
                const emailList = text
                    .split(/[\r\n]+/)
                    .map(line => line.trim())
                    .filter(line => line.includes('@') && line.includes('.'));

                if (emailList.length === 0) {
                    alert('No valid emails found in this file.');
                    return;
                }

                setParsedFile({
                    name: file.name,
                    count: emailList.length,
                    data: emailList
                });
            };
            reader.onerror = () => {
                alert('Error reading file.');
            };
            reader.readAsText(file);
            return;
        }

        // Handle CSV files with PapaParser
        Papa.parse(file, {
            complete: (results) => {
                const emailList: string[] = [];
                // Find emails in any column
                results.data.forEach((row: any) => {
                    const rowVals = Array.isArray(row) ? row : Object.values(row);
                    rowVals.forEach((val: any) => {
                        if (typeof val === 'string') {
                            const trimmed = val.trim();
                            if (trimmed.includes('@') && trimmed.includes('.') && !emailList.includes(trimmed)) {
                                emailList.push(trimmed);
                            }
                        }
                    });
                });

                if (emailList.length === 0) {
                    alert('No valid emails found in this file.');
                    return;
                }

                setParsedFile({
                    name: file.name,
                    count: emailList.length,
                    data: emailList
                });
            },
            header: false,
            skipEmptyLines: true
        });
    };

    // -- Job Processing --
    const startVerification = async () => {
        const emailList = mode === 'paste'
            ? emails.split('\n').map(e => e.trim()).filter(e => e.includes('@'))
            : parsedFile?.data || [];

        if (emailList.length === 0) return alert('No emails to verify');

        if (balance < emailList.length) {
            return alert(`Insufficient credits. You need ${emailList.length} credits.`);
        }

        setLoading(true);
        setResults(null);
        setActiveJob(null);

        try {
            const res = await fetch('/api/verify/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: emailList })
            });

            if (!res.ok) throw new Error('Start failed');

            const job = await res.json();
            setActiveJob(job);
            deductCredits(emailList.length);
            pollJob(job.job_id);
        } catch (error) {
            console.error(error);
            alert('Failed to start verification.');
            setLoading(false);
        }
    };

    const pollJob = (jobId: string) => {
        const interval = setInterval(async () => {
            try {
                // Get job status
                const res = await fetch(`/api/verify/bulk/${jobId}`);
                if (!res.ok) return;
                const jobStatus = await res.json();
                setActiveJob(jobStatus);

                // Try to fetch partial results even while processing
                try {
                    const resultsRes = await fetch(`/api/verify/bulk/${jobId}/results`);
                    if (resultsRes.ok) {
                        const data = await resultsRes.json();
                        // Update results even if job isn't complete yet
                        if (data.results && data.results.length > 0) {
                            setResults(data.results);
                        }
                    }
                } catch (e) {
                    // Results not ready yet, that's okay
                }

                if (jobStatus.status === 'completed') {
                    clearInterval(interval);
                    // Final fetch to ensure we have all results
                    fetchResults(jobId);
                }
            } catch (e) { console.error(e); }
        }, 1000); // Poll every second
    };

    const fetchResults = async (jobId: string) => {
        try {
            const res = await fetch(`/api/verify/bulk/${jobId}/results`);
            if (!res.ok) {
                // If 400 (not completed), keep current partial results
                if (res.status === 400) return;
                throw new Error('Failed to fetch results');
            }
            const data = await res.json();
            setResults(data.results);
            setLoading(false);
            setParsedFile(null); // Clear input state on success
            setEmails('');
        } catch (error) {
            console.error('Error fetching results:', error);
            setLoading(false);
        }
    };

    // -- Valid/Invalid    // Categorize results
    const validResults = results?.filter(r => r.final_status === 'valid_safe') || [];
    const catchallResults = results?.filter(r => r.final_status.includes('catch') || r.final_status.includes('risky')) || [];
    const invalidResults = results?.filter(r =>
        r.final_status !== 'valid_safe' &&
        !r.final_status.includes('catch') &&
        !r.final_status.includes('risky')
    ) || [];
    const currentList = activeTab === 'valid' ? validResults : activeTab === 'catchall' ? catchallResults : invalidResults;

    // Download CSV
    const downloadCsv = (filter: 'valid' | 'invalid' | 'catchall') => {
        if (!results) return;
        const list = filter === 'valid' ? validResults : filter === 'catchall' ? catchallResults : invalidResults;

        const csv = [
            'Email,Status,Safety Score',
            ...list.map(r => `${r.email},${r.final_status},${r.safety_score}`)
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulk_${filter}_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 style={{ color: '#000' }}>Bulk Verifier</h1>
                <p>Verify thousands of emails accurately. Upload a CSV or paste your list.</p>
            </div>

            {/* Input Card */}
            <div className={styles.inputCard}>
                <div className={styles.tabHeader}>
                    <button
                        className={`${styles.modeTab} ${mode === 'upload' ? styles.activeMode : ''}`}
                        onClick={() => setMode('upload')}
                    >
                        📁 File Upload
                    </button>
                    <button
                        className={`${styles.modeTab} ${mode === 'paste' ? styles.activeMode : ''}`}
                        onClick={() => setMode('paste')}
                    >
                        📋 Copy & Paste
                    </button>
                </div>

                <div className={styles.inputBody}>
                    {mode === 'paste' ? (
                        <>
                            <textarea
                                className={styles.textarea}
                                placeholder="john@example.com&#10;jane@test.org&#10;..."
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                            />
                            <div className={styles.inputMeta}>
                                {emails.split('\n').filter(e => e.includes('@')).length} emails detected
                            </div>
                        </>
                    ) : (
                        <div
                            className={`${styles.dropzone} ${parsedFile ? styles.hasFile : ''} ${isDragging ? styles.dragging : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                            }}
                        >
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept=".csv,.txt"
                                onChange={handleFileSelect}
                            />

                            {parsedFile ? (
                                <div className={styles.fileSuccess}>
                                    <div className={styles.fileIcon}>📄</div>
                                    <div className={styles.fileInfo}>
                                        <h3>{parsedFile.name}</h3>
                                        <p>{parsedFile.count} emails ready to verify</p>
                                    </div>
                                    <button onClick={() => setParsedFile(null)} className={styles.removeBtn}>✕</button>
                                </div>
                            ) : (
                                <div className={styles.uploadPrompt}>
                                    <div className={styles.uploadIcon}>☁️</div>
                                    <h3>Drag & drop your file here</h3>
                                    <p>or</p>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Browse Files
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.actionFooter}>
                        <div className={styles.costEstimate}>
                            Estimated Cost: <span>{
                                mode === 'paste'
                                    ? emails.split('\n').filter(e => e.includes('@')).length
                                    : (parsedFile?.count || 0)
                            } credits</span>
                        </div>
                        <button
                            className="btn btn-primary"
                            disabled={loading || (mode === 'paste' ? !emails : !parsedFile)}
                            onClick={startVerification}
                        >
                            {loading ? 'Starting...' : 'Verify Emails'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            {activeJob && activeJob.status !== 'completed' && (
                <div className={styles.progressCard}>
                    <div className={styles.progressHeader}>
                        <h3>Processing Batch...</h3>
                        <span>{Math.round((activeJob.processed / activeJob.total_emails) * 100)}%</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(activeJob.processed / activeJob.total_emails) * 100}%` }}
                        />
                    </div>
                    <p className={styles.progressMeta}>
                        {activeJob.processed.toLocaleString()} of {activeJob.total_emails.toLocaleString()} processed
                    </p>
                </div>
            )}

            {/* Results Section */}
            {results && (
                <div className={`${styles.resultsContainer} animate-fade-in`}>
                    <div className={styles.resultsTabs}>
                        <button
                            className={`${styles.resultTab} ${activeTab === 'valid' ? styles.validTab : ''}`}
                            onClick={() => setActiveTab('valid')}
                        >
                            <span className={styles.resultIcon}>✅</span>
                            Valid ({validResults.length})
                        </button>
                        <button
                            className={`${styles.resultTab} ${activeTab === 'catchall' ? styles.catchallTab : ''}`}
                            onClick={() => setActiveTab('catchall')}
                        >
                            <span className={styles.resultIcon}>🔄</span>
                            Catch-all ({catchallResults.length})
                        </button>
                        <button
                            className={`${styles.resultTab} ${activeTab === 'invalid' ? styles.invalidTab : ''}`}
                            onClick={() => setActiveTab('invalid')}
                        >
                            <span className={styles.resultIcon}>⚠️</span>
                            Invalid ({invalidResults.length})
                        </button>
                    </div>

                    <div className={styles.listCard}>
                        <div className={styles.listToolbar}>
                            <h3>{activeTab === 'valid' ? 'Deliverable Emails' : activeTab === 'catchall' ? 'Catch-all & Risky' : 'Undeliverable'}</h3>
                            <button className="btn btn-outline" onClick={() => downloadCsv(activeTab)}>
                                Download CSV
                            </button>
                        </div>

                        <div className={styles.emailList}>
                            {currentList.map((res, i) => (
                                <div key={i} className={styles.emailRow}>
                                    <div className={styles.rowData}>
                                        <span className={styles.emailText}>{res.email}</span>
                                        <span className={styles.scoreBadge} style={{
                                            borderColor: res.safety_score > 80 ? '#b9ff66' : '#ff5050'
                                        }}>
                                            Score: {res.safety_score}
                                        </span>
                                    </div>
                                    <span className={`${styles.statusBadge} ${res.final_status === 'valid_safe' ? styles.statusSuccess : styles.statusError}`}>
                                        {res.final_status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
