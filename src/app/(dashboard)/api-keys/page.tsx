'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    created_at: string;
    last_used: string | null;
    usage_count: number;
    rate_limit: number;
    status: string;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyLimit, setNewKeyLimit] = useState(1000);
    const [creating, setCreating] = useState(false);

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/keys/list');
            if (res.ok) {
                const data = await res.json();
                setKeys(data);
            }
        } catch (error) {
            console.error('Failed to fetch keys:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;
        setCreating(true);

        try {
            const res = await fetch('/api/keys/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newKeyName,
                    limit: newKeyLimit
                })
            });

            if (res.ok) {
                const newKey = await res.json();
                setKeys([...keys, newKey]);
                setNewKeyName('');
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to create key');
            }
        } catch (error) {
            console.error('Failed to create key:', error);
            alert('Failed to create key');
        } finally {
            setCreating(false);
        }
    };

    const handleRevokeKey = async (keyString: string) => {
        if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return;

        try {
            const res = await fetch('/api/keys/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: keyString })
            });

            if (res.ok) {
                setKeys(keys.filter(k => k.key !== keyString));
            } else {
                alert('Failed to revoke key');
            }
        } catch (error) {
            console.error('Failed to revoke key:', error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('API Key copied to clipboard!');
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2>API Key Management</h2>
                <div className={styles.form}>
                    <input
                        type="text"
                        placeholder="Key Name (e.g. Mobile App)"
                        className={styles.input}
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                    />
                    <select
                        className={styles.select}
                        value={newKeyLimit}
                        onChange={(e) => setNewKeyLimit(Number(e.target.value))}
                    >
                        <option value={1000}>1,000 req/day</option>
                        <option value={5000}>5,000 req/day</option>
                        <option value={10000}>10,000 req/day</option>
                        <option value={100000}>Unlimited</option>
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreateKey}
                        disabled={creating || !newKeyName}
                    >
                        {creating ? 'Generating...' : 'Generate Key'}
                    </button>
                </div>

                {loading ? (
                    <div className="animate-spin" style={{ width: '30px', height: '30px', border: '2px solid var(--primary)', borderRadius: '50%', margin: '0 auto' }} />
                ) : (
                    <div className={styles.keyList}>
                        {keys.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px' }}>
                                No API keys found. Create one to get started.
                            </p>
                        ) : keys.map((k) => (
                            <div key={k.id} className={styles.keyItem}>
                                <div className={styles.keyInfo}>
                                    <div className={styles.keyHeader}>
                                        <p className={styles.keyLabel}>{k.name}</p>
                                        <p className={styles.keyDate}>Created: {new Date(k.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className={styles.keyValueContainer}>
                                        <span className={styles.keyValue}>{k.key}</span>
                                        <button
                                            className={styles.copyBtn}
                                            onClick={() => copyToClipboard(k.key)}
                                            title="Copy Key"
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <div className={styles.keyStats}>
                                        <div className={styles.statItem}>
                                            Usage: <span>{k.usage_count.toLocaleString()} calls</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            Last Used: <span>{k.last_used ? new Date(k.last_used).toLocaleString() : 'Never'}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            Limit: <span>{k.rate_limit.toLocaleString()}/day</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={styles.revokeBtn}
                                    onClick={() => handleRevokeKey(k.key)}
                                >
                                    Revoke
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.guideSection}>
                <h2>Quick Start Guide</h2>
                <p>Integrate our real-time verification into your signup flow in minutes using your API key.</p>

                <div className={styles.codeBlock}>
                    <pre>
                        {`# Example using curl
curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://api.zerobounce.ai'}/api/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test@example.com"}'`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
