'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

interface UserAdminData {
    id: number;
    email: string;
    credits: number;
    is_active: boolean;
    is_admin: boolean;
    is_verified: boolean;
    created_at: string;
}

interface AdminStats {
    total_users: number;
    total_credits: number;
    total_transactions: number;
    total_jobs: number;
}

export default function AdminPanel() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserAdminData[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserAdminData | null>(null);
    const [creditAmount, setCreditAmount] = useState<number>(0);
    const [creditReason, setCreditReason] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!user || !user.is_admin) {
                router.push('/dashboard');
            } else {
                fetchData();
            }
        }
    }, [user, isLoading]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (usersRes.ok && statsRes.ok) {
                setUsers(await usersRes.json());
                setStats(await statsRes.json());
            }
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCredits = async () => {
        if (!selectedUser || !token) return;
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/admin/users/${selectedUser.id}/credits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: creditAmount,
                    description: creditReason
                })
            });

            if (response.ok) {
                setSelectedUser(null);
                setCreditAmount(0);
                setCreditReason('');
                fetchData();
            }
        } catch (error) {
            console.error('Failed to update credits:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const toggleUserStatus = async (userId: number) => {
        if (!token) return;
        try {
            const response = await fetch(`/api/admin/users/${userId}/toggle-active`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    if (isLoading || loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Loading Admin Panel...</h1>
                </div>
            </div>
        );
    }

    if (!user || !user.is_admin) return null;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Admin Central</h1>
                    <p>System Management & User Oversight</p>
                </div>
            </header>

            {stats && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Users</div>
                        <div className={styles.statValue}>{stats.total_users.toLocaleString()}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Circulating Credits</div>
                        <div className={styles.statValue}>{stats.total_credits.toLocaleString()}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Transactions</div>
                        <div className={styles.statValue}>{stats.total_transactions.toLocaleString()}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Bulk Jobs</div>
                        <div className={styles.statValue}>{stats.total_jobs.toLocaleString()}</div>
                    </div>
                </div>
            )}

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>User Directory</h2>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Credits</th>
                                <th>Status</th>
                                <th>Privileges</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <div className={styles.userEmail}>{u.email}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>ID: {u.id}</div>
                                    </td>
                                    <td>{u.credits.toLocaleString()}</td>
                                    <td>
                                        <span className={`${styles.badge} ${u.is_active ? styles.activeBadge : styles.inactiveBadge}`}>
                                            {u.is_active ? 'Active' : 'Banned'}
                                        </span>
                                    </td>
                                    <td>
                                        {u.is_admin ? (
                                            <span className={`${styles.badge} ${styles.adminBadge}`}>Admin</span>
                                        ) : (
                                            <span style={{ color: 'var(--gray-500)', fontSize: '12px' }}>User</span>
                                        )}
                                    </td>
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={`${styles.actionBtn} ${styles.manageBtn}`}
                                                onClick={() => setSelectedUser(u)}
                                            >
                                                Credits
                                            </button>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => toggleUserStatus(u.id)}
                                            >
                                                {u.is_active ? 'Ban' : 'Unban'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Manage Credits for {selectedUser.email}</h3>

                        <div className={styles.inputGroup}>
                            <label>Credit Adjustment (use negative for deduction)</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(parseInt(e.target.value))}
                                placeholder="e.g. 500 or -200"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Reason / Reference</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={creditReason}
                                onChange={(e) => setCreditReason(e.target.value)}
                                placeholder="e.g. Support refund, Loyalty bonus"
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setSelectedUser(null)}
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleUpdateCredits}
                                disabled={isUpdating || !creditReason}
                            >
                                {isUpdating ? 'Updating...' : 'Apply Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
