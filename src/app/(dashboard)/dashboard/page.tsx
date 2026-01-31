'use client';

import { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { useCredits } from '@/contexts/CreditContext';
import styles from './page.module.css';

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--gray-900)',
                border: '1px solid var(--gray-700)',
                padding: '12px',
                borderRadius: '8px'
            }}>
                <p style={{ color: 'var(--gray-300)', marginBottom: '4px' }}>{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color, fontSize: '14px', fontWeight: 600 }}>
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const COLORS = ['#b9ff66', '#ff5050', '#ffaa00', '#00ccff', '#cc00ff'];

export default function DashboardPage() {
    const { balance } = useCredits();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics/stats');
                if (res.ok) {
                    const stats = await res.json();
                    setData(stats);
                }
            } catch (error) {
                console.error('Failed to load stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className={styles.container} style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--gray-700)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            </div>
        );
    }

    if (!data) return null;

    const pieData = Object.entries(data.quality_distribution).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h1>Analytics Dashboard</h1>
                    <p>Overview of your email verification performance</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ color: '#b9ff66' }}>✓</div>
                    <div className={styles.statValue} style={{ color: '#ffffff' }}>{data.total_verified.toLocaleString()}</div>
                    <div className={styles.statLabel}>Total Verified</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ color: '#00ccff' }}>🛡️</div>
                    <div className={styles.statValue} style={{ color: '#ffffff' }}>{data.avg_safety_score}%</div>
                    <div className={styles.statLabel}>Avg Safety Score</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ color: '#ffaa00' }}>⚡</div>
                    <div className={styles.statValue} style={{ color: '#ffffff' }}>{balance.toLocaleString()}</div>
                    <div className={styles.statLabel}>Credits Available</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ color: '#ff5050' }}>🚫</div>
                    <div className={styles.statValue} style={{ color: '#ffffff' }}>
                        {((data.quality_distribution['Invalid'] / data.total_verified) * 100).toFixed(1)}%
                    </div>
                    <div className={styles.statLabel}>Invalid Rate</div>
                </div>
            </div>

            {/* Main Charts Area */}
            <div className={styles.chartsGrid}>
                {/* Volume Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3>Verification Volume (30 Days)</h3>
                    </div>
                    <div style={{ height: '320px', width: '100%' }}>
                        <ResponsiveContainer>
                            <AreaChart data={data.daily_stats}>
                                <defs>
                                    <linearGradient id="colorValid" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#b9ff66" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#b9ff66" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorInvalid" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff5050" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ff5050" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-800)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => new Date(str).getDate().toString()}
                                    stroke="var(--gray-500)"
                                    tick={{ fill: 'var(--gray-500)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="var(--gray-500)"
                                    tick={{ fill: 'var(--gray-500)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="valid" stackId="1" stroke="#b9ff66" fill="url(#colorValid)" name="Valid" />
                                <Area type="monotone" dataKey="invalid" stackId="1" stroke="#ff5050" fill="url(#colorInvalid)" name="Invalid" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Pie Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3>Quality Distribution</h3>
                    </div>
                    <div style={{ height: '320px', width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.recentActivity}>
                <div className={styles.chartHeader}>
                    <h3>Recent Activity</h3>
                    <a href="/billing" style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none' }}>View All</a>
                </div>
                <div className={styles.activityList}>
                    {data.recent_usage.map((item: any, index: number) => (
                        <div key={index} className={styles.activityItem}>
                            <div className={styles.activityInfo}>
                                <div className={styles.activityIcon}>
                                    {item.operation.includes('Blacklist') ? '🚫' : '⚡'}
                                </div>
                                <div className={styles.activityDetails}>
                                    <h4>{item.operation}</h4>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                            <div className={styles.activityCredits}>
                                -{item.credits_used.toLocaleString()} credits
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
