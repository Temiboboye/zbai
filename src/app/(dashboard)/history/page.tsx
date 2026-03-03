'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryItem {
    id: number;
    email: string;
    final_status: string;
    safety_score: number;
    smtp_provider: string | null;
    is_catch_all: boolean;
    is_disposable: boolean;
    is_role_based: boolean;
    source: string;
    bulk_job_id: string | null;
    created_at: string;
}

interface Stats {
    total: number;
    valid: number;
    invalid: number;
    risky: number;
}

function getStatusBadge(status: string) {
    const map: Record<string, { label: string; cls: string; icon: string }> = {
        valid_safe: { label: 'Valid', cls: styles.badgeValid, icon: '✅' },
        valid_risky: { label: 'Risky', cls: styles.badgeRisky, icon: '⚠️' },
        invalid: { label: 'Invalid', cls: styles.badgeInvalid, icon: '❌' },
        invalid_syntax: { label: 'Bad Syntax', cls: styles.badgeInvalid, icon: '❌' },
        invalid_domain: { label: 'Bad Domain', cls: styles.badgeInvalid, icon: '❌' },
        no_mx: { label: 'No MX', cls: styles.badgeInvalid, icon: '❌' },
        no_mx_records: { label: 'No MX', cls: styles.badgeInvalid, icon: '❌' },
        disposable: { label: 'Disposable', cls: styles.badgeRisky, icon: '🗑️' },
        risky: { label: 'Risky', cls: styles.badgeRisky, icon: '⚠️' },
        user_not_found: { label: 'Not Found', cls: styles.badgeInvalid, icon: '❌' },
        error: { label: 'Error', cls: styles.badgeUnknown, icon: '⚙️' },
    };
    const info = map[status] || { label: status, cls: styles.badgeUnknown, icon: '❓' };
    return (
        <span className={`${styles.badge} ${info.cls}`}>
            {info.icon} {info.label}
        </span>
    );
}

function getScoreColor(score: number) {
    if (score >= 80) return '#b9ff66';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
}

export default function HistoryPage() {
    const { token } = useAuth();
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, valid: 0, invalid: 0, risky: 0 });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
    const [detailJson, setDetailJson] = useState<any>(null);

    const fetchHistory = useCallback(async () => {
        if (!token) return;
        setLoading(true);

        const params = new URLSearchParams({ page: String(page), per_page: '50' });
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        if (sourceFilter) params.set('source', sourceFilter);

        try {
            const res = await fetch(`/api/verify/history?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
                setTotal(data.total || 0);
                setTotalPages(data.total_pages || 1);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [token, page, search, statusFilter, sourceFilter]);

    const fetchStats = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch('/api/verify/history?page=1&per_page=1', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            // Use the stats endpoint via a separate proxy
            const statsRes = await fetch('/api/analytics/stats', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            // For now, calculate from the history totals
            // We'll get stats from the dedicated endpoint
        } catch (e) {
            console.error(e);
        }
    }, [token]);

    // Fetch history stats from the backend
    useEffect(() => {
        if (!token) return;
        (async () => {
            try {
                // Forward as a custom stat call
                const params = new URLSearchParams({ page: '1', per_page: '1' });
                const res = await fetch(`/api/verify/history?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    // We have the total, now get filtered counts
                    const allTotal = data.total || 0;

                    // Quick count fetches
                    const [validRes, invalidRes, riskyRes] = await Promise.all([
                        fetch('/api/verify/history?page=1&per_page=1&status=valid_safe', { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch('/api/verify/history?page=1&per_page=1&status=invalid', { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch('/api/verify/history?page=1&per_page=1&status=risky', { headers: { 'Authorization': `Bearer ${token}` } }),
                    ]);

                    const validData = validRes.ok ? await validRes.json() : { total: 0 };
                    const invalidData = invalidRes.ok ? await invalidRes.json() : { total: 0 };
                    const riskyData = riskyRes.ok ? await riskyRes.json() : { total: 0 };

                    setStats({
                        total: allTotal,
                        valid: validData.total || 0,
                        invalid: invalidData.total || 0,
                        risky: riskyData.total || 0,
                    });
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const openDetail = async (item: HistoryItem) => {
        setSelectedItem(item);
        // Fetch full detail from backend
        try {
            const res = await fetch(`/api/verify/history?search=${encodeURIComponent(item.email)}&page=1&per_page=1`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.items?.length > 0) {
                    setDetailJson(data.items[0]);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>History</h1>
                <p>View all your past verification results</p>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={`${styles.statCard} ${styles.statTotal}`}>
                    <h3>{stats.total.toLocaleString()}</h3>
                    <p>Total Verified</p>
                </div>
                <div className={`${styles.statCard} ${styles.statValid}`}>
                    <h3>{stats.valid.toLocaleString()}</h3>
                    <p>Valid</p>
                </div>
                <div className={`${styles.statCard} ${styles.statInvalid}`}>
                    <h3>{stats.invalid.toLocaleString()}</h3>
                    <p>Invalid</p>
                </div>
                <div className={`${styles.statCard} ${styles.statRisky}`}>
                    <h3>{stats.risky.toLocaleString()}</h3>
                    <p>Risky</p>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search by email..."
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className={styles.filterSelect}
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Statuses</option>
                    <option value="valid_safe">✅ Valid</option>
                    <option value="valid_risky">⚠️ Valid Risky</option>
                    <option value="invalid">❌ Invalid</option>
                    <option value="risky">⚠️ Risky</option>
                    <option value="disposable">🗑️ Disposable</option>
                </select>
                <select
                    className={styles.filterSelect}
                    value={sourceFilter}
                    onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Sources</option>
                    <option value="single">🔍 Single</option>
                    <option value="bulk">📁 Bulk</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.loading}>Loading history...</div>
            ) : items.length === 0 ? (
                <div className={styles.empty}>
                    <p>No verification history yet</p>
                    <span>Verify an email to see it here</span>
                </div>
            ) : (
                <>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                    <th>Provider</th>
                                    <th>Source</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} onClick={() => openDetail(item)}>
                                        <td className={styles.emailCol}>{item.email}</td>
                                        <td>{getStatusBadge(item.final_status)}</td>
                                        <td>
                                            <div className={styles.scoreBar}>
                                                <div className={styles.scoreTrack}>
                                                    <div
                                                        className={styles.scoreFill}
                                                        style={{
                                                            width: `${item.safety_score}%`,
                                                            backgroundColor: getScoreColor(item.safety_score),
                                                        }}
                                                    />
                                                </div>
                                                <span className={styles.scoreValue} style={{ color: getScoreColor(item.safety_score) }}>
                                                    {item.safety_score}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{item.smtp_provider || '—'}</td>
                                        <td>
                                            <span className={styles.sourceBadge}>
                                                {item.source === 'bulk' ? '📁 Bulk' : '🔍 Single'}
                                            </span>
                                        </td>
                                        <td>
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            ← Prev
                        </button>
                        <span className={styles.pageInfo}>
                            Page {page} of {totalPages} ({total.toLocaleString()} results)
                        </span>
                        <button
                            className={styles.pageBtn}
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {/* Detail Modal */}
            {selectedItem && (
                <div className={styles.detailOverlay} onClick={() => setSelectedItem(null)}>
                    <div className={styles.detailPanel} onClick={e => e.stopPropagation()}>
                        <div className={styles.detailHeader}>
                            <h3>{selectedItem.email}</h3>
                            <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>×</button>
                        </div>

                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <label>Status</label>
                                <span>{getStatusBadge(selectedItem.final_status)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Safety Score</label>
                                <span style={{ color: getScoreColor(selectedItem.safety_score) }}>
                                    {selectedItem.safety_score}/100
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Provider</label>
                                <span>{selectedItem.smtp_provider || 'Unknown'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Source</label>
                                <span>{selectedItem.source === 'bulk' ? '📁 Bulk' : '🔍 Single'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Catch-All</label>
                                <span>{selectedItem.is_catch_all ? '⚠️ Yes' : '✅ No'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Disposable</label>
                                <span>{selectedItem.is_disposable ? '🗑️ Yes' : '✅ No'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Role-Based</label>
                                <span>{selectedItem.is_role_based ? '⚠️ Yes' : '✅ No'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Date</label>
                                <span>
                                    {selectedItem.created_at
                                        ? new Date(selectedItem.created_at).toLocaleString()
                                        : '—'}
                                </span>
                            </div>
                        </div>

                        {detailJson && (
                            <div className={styles.jsonBlock}>
                                <h4>Full Details</h4>
                                <pre>{JSON.stringify(detailJson, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
