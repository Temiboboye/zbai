'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
    const { user, token } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setMsg('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
            } else {
                setMsg(data.detail || 'Failed to update password');
            }
        } catch (err) {
            setMsg('Error updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
                fontSize: '2.5rem',
                marginBottom: '1.5rem',
                fontWeight: '800',
                color: 'var(--black)',
                background: 'var(--green)',
                display: 'inline-block',
                padding: '0 12px',
                borderRadius: '6px'
            }}>My Profile</h1>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--gray-900)', borderRadius: '12px', border: '1px solid var(--gray-800)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--white)' }}>Account Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem 2rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--gray-400)' }}>Email</div>
                    <div>
                        <span className="greenhead" style={{ color: 'var(--white)', fontWeight: '600' }}>
                            {user?.email}
                        </span>
                    </div>

                    <div style={{ color: 'var(--gray-400)' }}>Credits Available</div>
                    <div style={{ fontWeight: '600', color: 'var(--green)' }}>{user?.credits?.toLocaleString()}</div>

                    <div style={{ color: 'var(--gray-400)' }}>Account Status</div>
                    <div>
                        <span style={{
                            background: user?.is_verified ? '#ecfdf5' : '#fef2f2',
                            color: user?.is_verified ? '#059669' : '#dc2626',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}>
                            {user?.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--gray-900)', borderRadius: '12px', border: '1px solid var(--gray-800)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--white)' }}>Security</h2>
                <form onSubmit={handlePasswordUpdate}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--gray-300)' }}>Current Password</label>
                        <input
                            type="password"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--gray-700)',
                                background: 'var(--dark)',
                                color: 'var(--white)',
                                fontSize: '1rem'
                            }}
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--gray-300)' }}>New Password</label>
                        <input
                            type="password"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--gray-700)',
                                background: 'var(--dark)',
                                color: 'var(--white)',
                                fontSize: '1rem'
                            }}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '600' }}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    {msg && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: msg.includes('success') ? '#ecfdf5' : '#fef2f2',
                            color: msg.includes('success') ? '#059669' : '#dc2626',
                            textAlign: 'center',
                            fontSize: '0.9rem'
                        }}>
                            {msg}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
