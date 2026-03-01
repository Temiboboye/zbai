'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

interface Lead {
    id: number;
    name: string | null;
    email: string;
    company: string | null;
    status: string;
    source: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string | null;
}

interface Stats {
    total: number;
    stages: Record<string, number>;
}

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];
const STATUS_COLORS: Record<string, string> = {
    new: '#3b82f6',
    contacted: '#f59e0b',
    qualified: '#8b5cf6',
    won: '#10b981',
    lost: '#ef4444',
};

export default function CRMPage() {
    const { token } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [showImport, setShowImport] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formCompany, setFormCompany] = useState('');
    const [formStatus, setFormStatus] = useState('new');
    const [formSource, setFormSource] = useState('manual');
    const [formNotes, setFormNotes] = useState('');

    const headers = useCallback(() => ({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }), [token]);

    const fetchLeads = useCallback(async () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (filterStatus) params.set('status', filterStatus);
        const qs = params.toString() ? `?${params.toString()}` : '';

        try {
            const res = await fetch(`/api/crm/leads${qs}`, { headers: headers() });
            if (res.ok) setLeads(await res.json());
        } catch (e) { console.error(e); }
    }, [search, filterStatus, headers]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch('/api/crm/stats', { headers: headers() });
            if (res.ok) setStats(await res.json());
        } catch (e) { console.error(e); }
    }, [headers]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            await Promise.all([fetchLeads(), fetchStats()]);
            setLoading(false);
        }
        if (token) load();
    }, [token, fetchLeads, fetchStats]);

    const openAddModal = () => {
        setEditingLead(null);
        setFormName(''); setFormEmail(''); setFormCompany('');
        setFormStatus('new'); setFormSource('manual'); setFormNotes('');
        setShowModal(true);
    };

    const openEditModal = (lead: Lead) => {
        setEditingLead(lead);
        setFormName(lead.name || ''); setFormEmail(lead.email);
        setFormCompany(lead.company || ''); setFormStatus(lead.status);
        setFormSource(lead.source || ''); setFormNotes(lead.notes || '');
        setShowModal(true);
    };

    const handleSave = async () => {
        const body = {
            name: formName || null,
            email: formEmail,
            company: formCompany || null,
            status: formStatus,
            source: formSource || null,
            notes: formNotes || null,
        };

        if (editingLead) {
            await fetch(`/api/crm/leads/${editingLead.id}`, {
                method: 'PUT', headers: headers(), body: JSON.stringify(body),
            });
        } else {
            await fetch('/api/crm/leads', {
                method: 'POST', headers: headers(), body: JSON.stringify(body),
            });
        }
        setShowModal(false);
        fetchLeads();
        fetchStats();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this lead?')) return;
        await fetch(`/api/crm/leads/${id}`, { method: 'DELETE', headers: headers() });
        fetchLeads();
        fetchStats();
    };

    const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        const lines = text.trim().split('\n');
        const headerLine = lines[0].split(',').map(h => h.trim().toLowerCase());

        const emailIdx = headerLine.findIndex(h => h === 'email');
        const nameIdx = headerLine.findIndex(h => h === 'name');
        const companyIdx = headerLine.findIndex(h => h === 'company');

        if (emailIdx === -1) { alert('CSV must have an "email" column'); return; }

        const importLeads = lines.slice(1).filter(l => l.trim()).map(line => {
            const cols = line.split(',').map(c => c.trim());
            return {
                email: cols[emailIdx],
                name: nameIdx >= 0 ? cols[nameIdx] : null,
                company: companyIdx >= 0 ? cols[companyIdx] : null,
                status: 'new',
                source: 'import',
                notes: null,
            };
        });

        await fetch('/api/crm/leads/import', {
            method: 'POST', headers: headers(), body: JSON.stringify(importLeads),
        });

        setShowImport(false);
        fetchLeads();
        fetchStats();
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>CRM</h1>
                    <p className={styles.subtitle}>Manage your leads and pipeline</p>
                </div>
                <div className={styles.headerActions}>
                    <button onClick={() => setShowImport(!showImport)} className={styles.btnOutline}>
                        📥 Import CSV
                    </button>
                    <button onClick={openAddModal} className={styles.btnPrimary}>
                        + Add Lead
                    </button>
                </div>
            </div>

            {/* Pipeline Stats */}
            {stats && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{stats.total}</span>
                        <span className={styles.statLabel}>Total Leads</span>
                    </div>
                    {STATUSES.map(s => (
                        <div
                            key={s}
                            className={`${styles.statCard} ${filterStatus === s ? styles.statCardActive : ''}`}
                            onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
                            style={{ '--stage-color': STATUS_COLORS[s] } as React.CSSProperties}
                        >
                            <span className={styles.statValue}>{stats.stages[s] || 0}</span>
                            <span className={styles.statLabel}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                            <div className={styles.statBar} />
                        </div>
                    ))}
                </div>
            )}

            {/* CSV Import */}
            {showImport && (
                <div className={styles.importBox}>
                    <p>Upload a CSV file with columns: <strong>email</strong> (required), name, company</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCSVImport}
                    />
                </div>
            )}

            {/* Search & Filter */}
            <div className={styles.toolbar}>
                <input
                    type="text"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
                {filterStatus && (
                    <button onClick={() => setFilterStatus('')} className={styles.clearFilter}>
                        ✕ Clear filter: {filterStatus}
                    </button>
                )}
            </div>

            {/* Leads Table */}
            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.loading}>Loading leads...</div>
                ) : leads.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No leads yet. Add your first lead or import from CSV.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Source</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>{lead.name || '—'}</td>
                                    <td className={styles.emailCell}>{lead.email}</td>
                                    <td>{lead.company || '—'}</td>
                                    <td>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ background: STATUS_COLORS[lead.status] + '22', color: STATUS_COLORS[lead.status] }}
                                        >
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className={styles.sourceCell}>{lead.source || '—'}</td>
                                    <td className={styles.dateCell}>
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => openEditModal(lead)} title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(lead.id)} title="Delete">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>{editingLead ? 'Edit Lead' : 'Add Lead'}</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email *</label>
                                <input value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="john@company.com" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Company</label>
                                <input value={formCompany} onChange={e => setFormCompany(e.target.value)} placeholder="Acme Inc" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Source</label>
                                <input value={formSource} onChange={e => setFormSource(e.target.value)} placeholder="manual" />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Notes</label>
                                <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={3} placeholder="Additional notes..." />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowModal(false)} className={styles.btnOutline}>Cancel</button>
                            <button onClick={handleSave} className={styles.btnPrimary} disabled={!formEmail}>
                                {editingLead ? 'Update' : 'Add Lead'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
